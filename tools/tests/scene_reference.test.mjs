import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {projectBookFact} from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
const script=fileURLToPath(new URL('../../skills/harry-potter-fanfic/scripts/hp.mjs',import.meta.url));
const cli=(...args)=>spawnSync(process.execPath,[script,...args,'--lang','en'],{encoding:'utf8'});
test('selective facts have safe book projections in all seven novels',()=>{
  for(const book of ['PS','CoS','PoA','GoF','OotP','HBP','DH']){
    const call=cli('facts','--book',book);assert.equal(call.status,0,call.stderr);
    const facts=JSON.parse(call.stdout);assert.ok(facts.length,book);
    assert.ok(facts.every(f=>f.anchors.every(a=>a.startsWith(book))&&f.evidence.every(e=>e.anchor.startsWith(book))));
  }
  const dh=JSON.parse(cli('facts','--book','DH','--query','first-camp').stdout);
  assert.ok(dh.some(f=>f.id==='first-camp-injury'&&f.claim.includes('left upper arm')));
  assert.ok(dh.some(f=>f.id==='first-camp-provisions'&&f.claim.includes('no food')));
  assert.ok(dh.every(f=>f.sourceQuality.includes('degraded')));
  const all=JSON.parse(cli('facts','--book','all','--page','--limit','1').stdout);
  assert.equal(all.total,72);assert.equal(all.nextOffset,1);
});
test('mixed-book claims cannot acquire a safe projection merely by filtering evidence',()=>{
  const f={id:'unsafe',anchors:['PS1','DH19'],claim:'Later guiding knowledge',evidence:[{anchor:'PS1'},{anchor:'DH19'}]};
  assert.equal(projectBookFact(f,'PS'),null);
});
test('failed narrow entity searches suggest evidence in another book without changing scope',()=>{
  const call=cli('semantic','--book','DH','--query',"Marauder's Map");assert.equal(call.status,0,call.stderr);
  const result=JSON.parse(call.stdout);assert.equal(result.book,'DH');assert.equal(result.total,0);
  assert.ok(result.suggestions.some(s=>s.book==='PoA'&&s.id==='marauders-map'));
  assert.ok(result.suggestions.every(s=>!Object.hasOwn(s,'labelHu')));
  assert.match(result.queryHint,/not proof/);
  const missing=JSON.parse(cli('semantic','--book','PS','--query','Potato telepathy').stdout);
  assert.equal(missing.total,0);assert.deepEqual(missing.suggestions,[]);
  const anchored=JSON.parse(cli('semantic','--book','DH','--anchor','DH14','--query',"Marauder's Map").stdout);
  assert.deepEqual(anchored.suggestions,[]);
  const people=JSON.parse(cli('characters','--book','DH','--query',"Marauder's Map").stdout);
  assert.ok(people.suggestions.every(s=>['person','animal'].includes(s.category)),
    'character requests must not suggest objects, places or spells');
});
