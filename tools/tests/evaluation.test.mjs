import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sceneText, validateRatings } from '../evaluate_writing.mjs';
test('evaluation separates original scene from resource notes',()=>assert.equal(sceneText('Scene.\n\n<!-- RESOURCE-USE -->\nNotes.'),'Scene.'));
test('ratings require every blind id, bounded integer dimensions and evidence',()=>{
  const r={id:'x',language:4,terminology:3,continuity:2,narrative:4,compliance:3,evidence:'Specific local finding'};
  assert.equal(validateRatings([r],['x'])[0].total,16);
  for(const bad of [[{...r,language:5}],[{...r,narrative:2.5}],[{...r,evidence:''}],[{...r,id:'wrong'}],[]])assert.throws(()=>validateRatings(bad,['x']));
  assert.throws(()=>validateRatings([r,r],['x','y']));
});
const harness=fileURLToPath(new URL('../evaluate_writing.mjs',import.meta.url));
const run=(...args)=>spawnSync(process.execPath,[harness,...args],{encoding:'utf8'});
test('evaluation resume preserves outputs and rejects snapshot drift',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hp-eval-'));
  try {
    fs.writeFileSync(path.join(dir,'A1.md'),'Saved before interruption.');
    assert.equal(run('prepare',dir).status,0);assert.equal(run('prepare',dir).status,0);
    assert.equal(fs.readFileSync(path.join(dir,'A1.md'),'utf8'),'Saved before interruption.');
    assert.equal(run('status',dir).status,0);
    fs.appendFileSync(path.join(dir,'skill','SKILL.md'),'\nChanged snapshot.');
    assert.notEqual(run('status',dir).status,0);assert.notEqual(run('prepare',dir).status,0);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
test('blind/score/export preserve evidence, mark withheld notes and reject changed outputs',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hp-eval-'));
  try {
    assert.equal(run('prepare',dir).status,0);
    for(const c of ['A','B','C'])for(const s of [1,2])fs.writeFileSync(path.join(dir,`${c}${s}.md`),`Original synthetic fixture ${c}${s}.\n<!-- RESOURCE-USE -->\nUnit test data, not an agent run.`);
    assert.equal(run('blind',dir).status,0);
    const packet=JSON.parse(fs.readFileSync(path.join(dir,'blind-packet.json'),'utf8'));
    assert.match(packet.scope,/withheld/);assert.ok(packet.outputs.every(o=>!o.text.includes('Unit test data')));
    const map=fs.readFileSync(path.join(dir,'blind-map.json'),'utf8');assert.notEqual(run('blind',dir).status,0);assert.equal(fs.readFileSync(path.join(dir,'blind-map.json'),'utf8'),map);
    const ratings=packet.outputs.map(o=>({id:o.id,language:4,terminology:4,continuity:4,narrative:4,compliance:4,evidence:'Synthetic unit-test score, not a literary judgment.'}));
    for(const j of [1,2])for(const suffix of ['','-calibrated'])fs.writeFileSync(path.join(dir,`judge-${j}${suffix}.json`),JSON.stringify(ratings));
    assert.equal(JSON.parse(run('score',dir,'calibrated').stdout).conditionMeans.B,20);
    fs.cpSync(path.join(dir,'skill'),path.join(dir,'retest-skill'),{recursive:true});fs.writeFileSync(path.join(dir,'retest.md'),'Synthetic retest.\n<!-- RESOURCE-USE -->\nUnit test.');
    const exported=path.join(dir,'exported');assert.equal(run('export',dir,exported).status,0);assert.notEqual(run('export',dir,exported).status,0);
    assert.equal(fs.readFileSync(path.join(exported,'A1.md'),'utf8'),fs.readFileSync(path.join(dir,'A1.md'),'utf8'));
    fs.appendFileSync(path.join(dir,'B1.md'),'Changed after judging');assert.notEqual(run('score',dir).status,0);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
