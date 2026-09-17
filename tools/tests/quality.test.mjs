import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { main, dimensions } from '../evaluate_quality.mjs';

const source = new URL('../quality-suite.json', import.meta.url);
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'quality-test-'));
  t.after(() => fs.rmSync(root,{recursive:true,force:true}));
  const dir = path.join(root,'run'); fs.mkdirSync(dir);
  fs.mkdirSync(path.join(dir,'baseline')); fs.mkdirSync(path.join(dir,'candidate'));
  fs.writeFileSync(path.join(dir,'baseline','skill.md'),'baseline snapshot');
  fs.writeFileSync(path.join(dir,'candidate','skill.md'),'candidate snapshot');
  fs.copyFileSync(source,path.join(dir,'suite.json'));
  const suite = JSON.parse(fs.readFileSync(source,'utf8'));
  const write = (file,text) => fs.writeFileSync(path.join(dir,file),text);
  const read = file => fs.readFileSync(path.join(dir,file),'utf8');
  const run = command => main([command,dir]);
  const outputs = () => suite.runs.forEach(r => write(r.id+'.md',`${'word '.repeat(360)}\n<!-- RESOURCE-USE -->\nNo resources consulted; model unknown.`));
  const judges = mapping => {
    const judge = {ratings:mapping.outputs.map(o => ({id:o.id,...Object.fromEntries(dimensions.map(d => [d,3])),evidence:'“word” is concrete; rhythm repeats.'})),preferences:mapping.pairs.map(p => ({pairId:p.pairId,winner:p.outputs[0],reason:'“word” supports the brief.',confidence:'low'}))};
    for (const n of [1,2]) write(`judge-${n}.json`,JSON.stringify(judge));
    return judge;
  };
  return {root,dir,suite,write,read,run,outputs,judges};
}

test('end-to-end immutable resume, opposite orders, dimensions and bounded export',t => {
  const f = fixture(t);
  f.run('freeze'); assert.equal(f.run('status').runs.filter(r => r.status === 'missing').length,11);
  f.outputs(); const original = f.read('candidate-practice.md');
  f.run('freeze'); assert.equal(f.read('candidate-practice.md'),original);
  const mapping = f.run('blind'), first = f.read('blind-map.json');
  assert.equal(mapping.pairs.filter(p => p.kind === 'primary').length,4);
  assert.equal(mapping.pairs.filter(p => p.kind === 'exploratory').length,3);
  f.run('blind'); assert.equal(f.read('blind-map.json'),first);
  const packets = [1,2].map(n => JSON.parse(f.read(`judge-${n}-packet.json`)));
  assert.match(packets[0].instructions,/notes are explicitly withheld/);
  assert(!f.read('judge-1-packet.json').includes('No resources consulted'));
  assert(packets[0].outputs.every(o => !('run' in o) && !o.text.includes('RESOURCE-USE')));
  for (const p of packets[0].pairs) assert.deepEqual(p.outputs,[...packets[1].pairs.find(q => q.pairId === p.pairId).outputs].reverse());
  f.judges(mapping); const report = f.run('score');
  assert.equal(report.scenes.length,11); assert.equal(report.pairs.length,7);
  assert.deepEqual(Object.keys(report.scenes[0].dimensions),dimensions);
  assert(report.pairs.every(p => p.agreement));
  const saved = f.read('scores.json'); f.run('score'); assert.equal(f.read('scores.json'),saved);
  f.write('private-book.txt','PRIVATE BOOK');
  const destination = path.join(f.root,'public'); main(['export',f.dir,destination]);
  const files = fs.readdirSync(destination);
  assert(!files.includes('baseline')); assert(!files.includes('candidate')); assert(!files.includes('private-book.txt'));
  assert(files.includes('scores.json')); assert(files.includes('prompt-candidate-practice.json'));
  assert.throws(() => main(['export',f.dir,destination]),/exists/);
});

test('missing outputs and blank or duplicate resource notes block blinding',t => {
  const f = fixture(t); f.run('freeze');
  assert.throws(() => f.run('blind'),/ENOENT/);
  f.outputs();
  for (const text of ['scene','scene\n<!-- RESOURCE-USE --> \n','scene<!-- RESOURCE-USE -->note<!-- RESOURCE-USE -->note']) {
    f.write('baseline-queue.md',text); assert.throws(() => f.run('blind'),/resource notes/);
    assert(!fs.existsSync(path.join(f.dir,'blind-map.json')));
  }
});

test('freeze preserves preexisting scenes and rejects snapshot or suite edits',t => {
  const f = fixture(t); f.outputs(); f.run('freeze'); f.run('freeze');
  const original = f.read('baseline-queue.md'); f.write('baseline-queue.md',original+'edit');
  assert.throws(() => f.run('freeze'),/Frozen output changed/); f.write('baseline-queue.md',original);
  f.write('candidate/skill.md','changed'); assert.throws(() => f.run('status'),/snapshots changed/);
  f.write('candidate/skill.md','candidate snapshot');
  const suite = JSON.parse(f.read('suite.json')); suite.scenarios[0].prompt += ' change';
  f.write('suite.json',JSON.stringify(suite)); assert.throws(() => f.run('freeze'),/suite changed/);
});

for (const file of ['candidate-practice.md','judge-1-packet.json','blind-map.json','baseline/skill.md','prompt-baseline-queue.json']) {
  test(`tamper rejection: ${file}`,t => {
    const f = fixture(t); f.run('freeze'); f.outputs(); f.judges(f.run('blind'));
    f.write(file,f.read(file)+' ');
    assert.throws(() => f.run('score'),/changed/);
  });
}

test('invalid judges: exact IDs, finite ranges, evidence and complete preferences',t => {
  const f = fixture(t); f.run('freeze'); f.outputs(); const mapping = f.run('blind');
  const base = f.judges(mapping);
  const mutations = [
    j => j.ratings.pop(), j => j.ratings[0].id = j.ratings[1].id,
    j => j.ratings[0].language = 5, j => j.ratings[0].language = '3',
    j => j.ratings[0].evidence = ' ', j => j.preferences.pop(),
    j => j.preferences[0].winner = 'unknown', j => j.preferences[0].reason = '',
    j => j.preferences[0].confidence = 'certain', j => j.preferences[0].pairId = 'unknown'
  ];
  for (const mutate of mutations) {
    const judge = structuredClone(base); mutate(judge); f.write('judge-1.json',JSON.stringify(judge));
    assert.throws(() => f.run('score'),/Invalid|Expected/);
    assert(!fs.existsSync(path.join(f.dir,'scores.json')));
  }
  f.judges(mapping); f.run('score');
  const changed = structuredClone(base); changed.ratings[0].language = 2;
  f.write('judge-1.json',JSON.stringify(changed)); assert.throws(() => f.run('score'),/Immutable artifact changed/);
});

test('bad suite and traversal rejected before freezing',t => {
  const f = fixture(t);
  for (const mutate of [s => s.runs[0].id = '../outside', s => s.runs.push(s.runs[0]), s => s.scenarios[0].invariants = [], s => s.runs.pop()]) {
    const suite = structuredClone(f.suite); mutate(suite); f.write('suite.json',JSON.stringify(suite));
    assert.throws(() => f.run('freeze'),/Invalid|Duplicate|Missing/);
    assert(!fs.existsSync(path.join(f.dir,'freeze-manifest.json')));
  }
});

test('directory symlinks or junctions rejected, including ancestors',t => {
  const f = fixture(t); const link = path.join(f.dir,'snapshot');
  fs.symlinkSync(path.join(f.dir,'baseline'),link,process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => f.run('freeze'),/Symlink/);
  assert.throws(() => main(['freeze',link]),/Symlink/);
});

test('word counts use whitespace tokens and exclude punctuation-only dialogue markers',t => {
  const f = fixture(t); f.run('freeze');
  f.write('candidate-practice.md','– Harrynek szólt. 4:10-kor.\n<!-- RESOURCE-USE -->\nNo books.');
  const result = f.run('status').runs.find(r => r.run === 'candidate-practice');
  assert.equal(result.words,3);
  assert.equal(result.lengthPass,false);
});

test('freeze requires both snapshots, not just any snapshot file',t => {
  const f = fixture(t);
  fs.renameSync(path.join(f.dir,'candidate'),path.join(f.dir,'unrelated'));
  assert.throws(() => f.run('freeze'),/Both baseline and candidate/);
  assert(!fs.existsSync(path.join(f.dir,'freeze-manifest.json')));
});
