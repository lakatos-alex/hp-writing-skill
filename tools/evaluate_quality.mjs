#!/usr/bin/env node
/** Local evidence coordinator. No model calls. Run files are DIR/<suite run id>.md. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID, randomInt } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const dimensions = ['language', 'character', 'causality', 'continuity', 'terminology'];
const marker = '<!-- RESOURCE-USE -->';
const defaultSuite = fileURLToPath(new URL('./quality-suite.json', import.meta.url));
const digest = value => createHash('sha256').update(value).digest('hex');
const json = value => JSON.stringify(value, null, 2) + '\n';
const assert = (ok, message) => { if (!ok) throw Error(message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const safeId = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(value);

// Check ancestors too: a safe leaf beneath a linked directory is not safe.
function safePath(file) {
  const absolute = path.resolve(file);
  let cursor = absolute;
  while (true) {
    if (fs.existsSync(cursor) || (() => { try { fs.lstatSync(cursor); return true; } catch { return false; } })()) {
      assert(!fs.lstatSync(cursor).isSymbolicLink(), `Symlink rejected: ${cursor}`);
    }
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return absolute;
}
function read(file) { safePath(file); assert(fs.statSync(file).isFile(), `Not a file: ${file}`); return fs.readFileSync(file); }
function load(file) { return JSON.parse(read(file).toString('utf8')); }
function save(file, value) {
  safePath(file);
  const bytes = json(value);
  if (fs.existsSync(file)) assert(read(file).equals(Buffer.from(bytes)), `Immutable artifact changed: ${file}`);
  else fs.writeFileSync(file, bytes, { flag: 'wx' });
}
function inventory(dir, prefix = '') {
  safePath(dir);
  return fs.readdirSync(dir).sort().flatMap(name => {
    const file = path.join(dir, name), relative = prefix + name;
    safePath(file);
    const stat = fs.lstatSync(file);
    if (stat.isDirectory()) return inventory(file, relative + '/');
    assert(stat.isFile(), `Unsupported file: ${file}`);
    return [{ file: relative, sha256: digest(read(file)) }];
  });
}
function suiteCheck(s) {
  assert(s && safeId(s.id) && Array.isArray(s.wordRange) && s.wordRange.length === 2 && s.wordRange.every(Number.isInteger) && s.wordRange[0] > 0 && s.wordRange[1] >= s.wordRange[0], 'Invalid suite header');
  assert(s.conditions && typeof s.conditions === 'object' && !Array.isArray(s.conditions) && Object.entries(s.conditions).every(([k,v]) => safeId(k) && nonempty(v)), 'Invalid conditions');
  assert(Array.isArray(s.scenarios) && s.scenarios.length && Array.isArray(s.runs) && s.runs.length, 'Empty suite');
  assert(new Set(s.scenarios.map(x => x?.id)).size === s.scenarios.length, 'Duplicate scenario');
  for (const x of s.scenarios) assert(x && safeId(x.id) && nonempty(x.language) && nonempty(x.prompt) && Array.isArray(x.invariants) && x.invariants.length && x.invariants.every(nonempty), 'Invalid scenario');
  assert(new Set(s.runs.map(x => x?.id)).size === s.runs.length, 'Duplicate run');
  const cells = new Set();
  for (const r of s.runs) {
    assert(r && safeId(r.id) && Object.hasOwn(s.conditions,r.condition) && s.scenarios.some(x => x.id === r.scenario), 'Invalid run');
    const cell = `${r.condition}/${r.scenario}`;
    assert(!cells.has(cell), 'Duplicate condition/scenario'); cells.add(cell);
  }
  for (const x of s.scenarios) for (const c of ['baseline','candidate']) assert(cells.has(`${c}/${x.id}`), `Missing paired run: ${c}/${x.id}`);
  for (const c of ['candidate','unaided','optional','required']) assert(cells.has(`${c}/practice`), `Missing exploratory run: ${c}/practice`);
  return s;
}
function snapshots(dir) {
  return inventory(dir).filter(x => /^(baseline|candidate|snapshots?)\//.test(x.file) || /^(baseline|candidate|snapshots?)\.json$/.test(x.file));
}
function scene(dir, run, suite) {
  const raw = read(path.join(dir, run.id + '.md')).toString('utf8');
  const parts = raw.split(marker), text = parts[0].trim();
  const words = text.split(/\s+/u).filter(token => /[\p{L}\p{N}]/u.test(token)).length;
  return { run: run.id, sha256: digest(Buffer.from(raw)), text, words, lengthPass: words >= suite.wordRange[0] && words <= suite.wordRange[1], hasResourceNote: parts.length === 2 && nonempty(parts[1]), nonempty: !!text };
}
function frozen(dir) {
  const manifest = load(path.join(dir, 'freeze-manifest.json'));
  const suite = suiteCheck(load(path.join(dir, 'suite.json')));
  assert(manifest.suite === digest(read(path.join(dir, 'suite.json'))), 'Frozen suite changed');
  assert(JSON.stringify(manifest.snapshots) === JSON.stringify(snapshots(dir)), 'Frozen snapshots changed');
  for (const item of manifest.existingOutputs) {
    assert(suite.runs.some(r => r.id + '.md' === item.file), 'Invalid frozen output path');
    assert(digest(read(path.join(dir,item.file))) === item.sha256, `Frozen output changed: ${item.file}`);
  }
  for (const r of suite.runs) save(path.join(dir, `prompt-${r.id}.json`), { run: r.id, scenario: suite.scenarios.find(x => x.id === r.scenario).prompt, resources: suite.conditions[r.condition], output: `${r.id}.md`, instructions: `Use a fresh context. Write narrative followed by ${marker} and nonempty resource-use notes. Record model/effort, resources actually consulted and limitations. Resource restrictions are instructions, not proof of sandbox isolation.` });
  return suite;
}
function checkedBlind(dir, suite) {
  const seal = load(path.join(dir, 'blind-manifest.json'));
  const expected = ['blind-map.json','judge-1-packet.json','judge-2-packet.json'];
  assert(JSON.stringify(Object.keys(seal.files).sort()) === JSON.stringify(expected.sort()), 'Invalid blind manifest');
  for (const file of expected) assert(digest(read(path.join(dir,file))) === seal.files[file], `Blind artifact changed: ${file}`);
  const mapping = load(path.join(dir,'blind-map.json'));
  assert(mapping.outputs.length === suite.runs.length, 'Invalid mapping');
  for (const r of suite.runs) {
    const m = mapping.outputs.find(x => x.run === r.id);
    assert(m && m.sha256 === scene(dir,r,suite).sha256, `Scene changed: ${r.id}`);
  }
  return mapping;
}
export function validateJudge(judge, mapping) {
  assert(judge && Array.isArray(judge.ratings) && Array.isArray(judge.preferences), 'Invalid judge schema');
  function exact(rows, key, ids) {
    assert(rows.length === ids.length && new Set(rows.map(x => x?.[key])).size === ids.length && rows.every(x => x && ids.includes(x[key])), `Expected exact ${key} IDs`);
  }
  exact(judge.ratings,'id',mapping.outputs.map(x => x.id));
  exact(judge.preferences,'pairId',mapping.pairs.map(x => x.pairId));
  for (const r of judge.ratings) assert(dimensions.every(d => typeof r[d] === 'number' && Number.isFinite(r[d]) && r[d] >= 0 && r[d] <= 4) && nonempty(r.evidence), `Invalid rating: ${r.id}`);
  for (const p of judge.preferences) {
    const pair = mapping.pairs.find(x => x.pairId === p.pairId);
    assert([...pair.outputs,'tie'].includes(p.winner) && nonempty(p.reason) && ['low','medium','high'].includes(p.confidence), `Invalid preference: ${p.pairId}`);
  }
  return judge;
}
function score(dir, suite) {
  const mapping = checkedBlind(dir,suite);
  const judges = [1,2].map(n => validateJudge(load(path.join(dir,`judge-${n}.json`)),mapping));
  const report = {
    scope: 'Diagnostic pilot only; no statistical quality or general superiority claim. Human editorial review pending. Opposite orders do not isolate position bias from reviewer variability.',
    scenes: mapping.outputs.map(m => ({ ...m, mechanical: scene(dir,suite.runs.find(r => r.id === m.run),suite), judges: judges.map(j => j.ratings.find(r => r.id === m.id)), dimensions: Object.fromEntries(dimensions.map(d => [d,judges.map(j => j.ratings.find(r => r.id === m.id)[d])])) })),
    pairs: mapping.pairs.map(p => { const ratings = judges.map(j => j.preferences.find(r => r.pairId === p.pairId)); return { ...p, judges: ratings, agreement: ratings[0].winner === ratings[1].winner }; }),
    ratingHashes: Object.fromEntries([1,2].map(n => [`judge-${n}.json`,digest(read(path.join(dir,`judge-${n}.json`)))]))
  };
  save(path.join(dir,'scores.json'),report);
  return report;
}
export function main(args = process.argv.slice(2)) {
  const [command, input, destination] = args;
  assert(['freeze','status','blind','score','export'].includes(command) && input && args.length === (command === 'export' ? 3 : 2), 'Usage: node tools/evaluate_quality.mjs freeze|status|blind|score DIR; export DIR NEWDIR');
  const dir = safePath(input);
  assert(fs.statSync(dir).isDirectory(), 'Evaluation directory must exist');
  // Reject links anywhere in the evidence tree, including unselected private inputs.
  inventory(dir);
  if (command === 'freeze' && !fs.existsSync(path.join(dir,'freeze-manifest.json'))) {
    const suiteFile = path.join(dir,'suite.json');
    const suite = suiteCheck(load(fs.existsSync(suiteFile) ? suiteFile : defaultSuite));
    if (!fs.existsSync(suiteFile)) save(suiteFile,suite);
    const files = snapshots(dir);
    assert(['baseline/','candidate/'].every(prefix => files.some(file => file.file.startsWith(prefix))), 'Both baseline and candidate snapshots are required');
    save(path.join(dir,'freeze-manifest.json'), { version: 1, suite: digest(read(suiteFile)), snapshots: files, existingOutputs: suite.runs.filter(r => fs.existsSync(path.join(dir,r.id+'.md'))).map(r => ({file:r.id+'.md',sha256:digest(read(path.join(dir,r.id+'.md')))})) });
  }
  const suite = frozen(dir);
  if (command === 'freeze' || command === 'status') {
    if (fs.existsSync(path.join(dir,'blind-manifest.json'))) checkedBlind(dir,suite);
    return { frozen: true, runs: suite.runs.map(r => {
      if (!fs.existsSync(path.join(dir,r.id+'.md'))) return {run:r.id,status:'missing'};
      const {text, ...mechanical} = scene(dir,r,suite);
      return {status:'artifact-present',...mechanical};
    }) };
  }
  if (command === 'blind') {
    if (fs.existsSync(path.join(dir,'blind-manifest.json'))) return checkedBlind(dir,suite);
    const names = ['blind-map.json','judge-1-packet.json','judge-2-packet.json'];
    assert(names.every(n => !fs.existsSync(path.join(dir,n))), 'Partial blind preparation exists; preserve and inspect it');
    const scenes = suite.runs.map(r => scene(dir,r,suite));
    for (const s of scenes) assert(s.nonempty && s.hasResourceNote, `Missing narrative or nonempty resource notes: ${s.run}`);
    const outputs = scenes.map(s => ({id:randomUUID(),run:s.run,sha256:s.sha256}));
    const pairs = [];
    function pair(scenario, a, b, kind) {
      const ids = [a,b].map(c => outputs.find(o => o.run === suite.runs.find(r => r.scenario === scenario && r.condition === c).id).id);
      if (randomInt(2)) ids.reverse();
      pairs.push({pairId:randomUUID(),scenario,kind,outputs:ids});
    }
    for (const s of suite.scenarios) pair(s.id,'baseline','candidate','primary');
    for (const c of ['unaided','optional','required']) pair('practice','candidate',c,'exploratory');
    const mapping = {outputs,pairs};
    save(path.join(dir,names[0]),mapping);
    const anonymous = outputs.map(o => { const r = suite.runs.find(r => r.id === o.run); return {id:o.id,scenario:r.scenario,text:scenes.find(s => s.run === o.run).text}; }).sort((a,b) => a.id.localeCompare(b.id));
    for (const n of [1,2]) save(path.join(dir,`judge-${n}-packet.json`), {
      dimensions, instructions: 'Resource-use notes are explicitly withheld and mechanically checked. Judge independently. Score each dimension 0–4: 0 unusable; 1 repeated serious defects; 2 mixed/material weakness; 3 competent/local weakness; 4 strong execution. Evidence must cite a strength and weakness or explicitly find no material defect. Do not double-penalize one issue. Explain preferences with quoted evidence and confidence; tie is allowed. Word count is mechanical, not a literary dimension. Mark uncertain terminology for verification. No condition is a preferred winner.',
      schema: {ratings:[{id:'output UUID',...Object.fromEntries(dimensions.map(d => [d,'number 0..4'])),evidence:'nonempty text'}],preferences:[{pairId:'pair UUID',winner:'output UUID or tie',reason:'nonempty text',confidence:'low|medium|high'}]},
      scenarios:suite.scenarios, outputs:n === 1 ? anonymous : [...anonymous].reverse(), pairs:(n === 1 ? pairs : [...pairs].reverse()).map(p => ({pairId:p.pairId,scenario:p.scenario,outputs:n === 1 ? p.outputs : [...p.outputs].reverse()}))
    });
    save(path.join(dir,'blind-manifest.json'), {files:Object.fromEntries(names.map(n => [n,digest(read(path.join(dir,n)))]))});
    return mapping;
  }
  if (command === 'score') return score(dir,suite);
  const target = safePath(destination);
  assert(!fs.existsSync(target), 'Export destination exists; no overwrite');
  assert(!path.relative(dir,target).split(path.sep).every(p => p !== '..') && target !== dir, 'Export must be outside evaluation directory');
  score(dir,suite);
  const files = ['suite.json','freeze-manifest.json','blind-manifest.json','blind-map.json','judge-1-packet.json','judge-2-packet.json','judge-1.json','judge-2.json','scores.json',...suite.runs.flatMap(r => [r.id+'.md',`prompt-${r.id}.json`])];
  const manifest = files.map(file => ({file,sha256:digest(read(path.join(dir,file)))}));
  fs.mkdirSync(target,{recursive:true});
  for (const file of files) fs.copyFileSync(path.join(dir,file),path.join(target,file),fs.constants.COPYFILE_EXCL);
  save(path.join(target,'export-manifest.json'),{files:manifest,excluded:'Whole snapshots, books, and unlisted files. Raw scene notes are included; inspect author-provided notes before publication.'});
  return {exported:target,files:files.length+1};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(json(main())); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
