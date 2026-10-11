import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { loadKnowledge, semanticSearch } from '../../skills/harry-potter-fanfic/scripts/semantic.mjs';
import { root } from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
import { validateBookKnowledge } from '../validate_book_knowledge.mjs';

const entries = loadKnowledge();
const lookup = (query, extra = {}) => semanticSearch({book:'PS',query,...extra},entries);
const first = (query, extra) => lookup(query,extra).entries[0]?.id;
test('real concept requests find known referents without exact names', () => {
  assert.equal(first('object that tells you something is forgotten'),'remembrall');
  assert.equal(first('potions teacher',{category:'person'}),'severus-snape');
  assert.equal(first('where can I buy a wand'),'ollivanders-shop');
  assert.equal(first('spell to float a feather'),'wingardium-leviosa');
  assert.equal(first('object showing deepest desire'),'mirror-of-erised');
  assert.equal(first('blue portable fire',{category:'spell'}),'bluebell-flames');
});
test('Hungarian names, concepts and accents resolve the same identity', () => {
  assert.equal(first('bájitaltan tanára',{category:'person'}),'severus-snape');
  assert.equal(first('nefeledd gömb',{category:'object'}),undefined); // No fabricated split headword.
  assert.equal(first('NefeleDDgömb'),'remembrall');
  assert.equal(first('nefeleddGOMB'),'remembrall');
  assert.equal(first('Ampók',{category:'person'}),'griphook');
  assert.equal(first('könyvtárosnő',{category:'person'}),'madam-pince');
  assert.equal(first('kinyit ajtó',{category:'spell'}),'alohomora');
});
test('exact names outrank descriptive cross-references, aliases deduplicate referents', () => {
  assert.equal(first('Harry Potter'),'harry-potter');
  assert.equal(first('Nimbus 2000'),'nimbus-two-thousand');
  const result = lookup('Flamel');
  assert.equal(new Set(result.entries.map(e => e.id)).size,result.entries.length);
  assert.equal(lookup('Potato telepathy').total,0);
});
test('all spell results identify real human casting and no object behaviours', () => {
  const spells = semanticSearch({category:'spell',limit:20},entries).entries;
  assert.deepEqual(spells.map(e => e.id).sort(),['alohomora','avada-kedavra','bluebell-flames','locomotor-mortis','petrificus-totalus','wingardium-leviosa']);
  for (const s of spells) for (const o of s.occurrences) {
    assert.ok(o.practitionerIds.length);
    assert.ok(o.practitionerIds.every(id => entries.find(e => e.id === id)?.entityKind === 'human'));
    assert.notEqual(o.vocalisation,'non-verbal');
  }
  for (const query of ['Put-Outer','Nimbus flight','snowballs','rat yellow','Incendio','Finite','Vermillious','Oculus Reparo','Incarcerous']) assert.equal(lookup(query,{category:'spell'}).total,0,query);
});
test('failed casts, unknown speech and later identity remain explicit', () => {
  const alohomora = entries.find(e => e.id === 'alohomora');
  assert.equal(alohomora.occurrences.find(o => o.anchor === 'PS16').outcome,'failure');
  const blue = entries.find(e => e.id === 'bluebell-flames');
  assert.equal(blue.incantation,null);
  assert.equal(blue.occurrences.find(o => o.anchor === 'PS11').vocalisation,'unreported');
  const killing = entries.find(e => e.id === 'avada-kedavra');
  assert.equal(killing.identification.availableFrom,'GoF14');
  assert.ok(killing.occurrences.every(o => o.anchor === 'PS4'));
  assert.equal(killing.occurrences.find(o => o.targetIds.includes('harry-potter')).outcome,'failure');
  assert.equal(killing.laterIncantation.hu,'Adava Kedavra');
});
test('object classification does not automatically certify enchantment', () => {
  assert.equal(entries.find(e => e.id === 'hagrids-flute').magicStatus,'ordinary');
  assert.equal(entries.find(e => e.id === 'quaffle').magicStatus,'not-established');
  assert.equal(entries.find(e => e.id === 'remembrall').magicStatus,'demonstrated');
  assert.equal(entries.find(e => e.id === 'fluffy-harp').magicStatus,'not-established');
  assert.equal(first('Liquorice Wands',{category:'object'}),'liquorice-wands');
  assert.equal(lookup('Liquorice Wands',{category:'spell'}).total,0);
  assert.equal(first('Quidditch through the Ages',{category:'object'}),'quidditch-ages-book');
  const ordinary = semanticSearch({category:'object','magic-status':'ordinary',limit:100},entries);
  assert.ok(ordinary.entries.some(e => e.id === 'hagrids-flute'));
  assert.ok(ordinary.entries.some(e => e.id === 'standard-book-spells'));
  assert.ok(ordinary.entries.every(e => e.category === 'object'));
});
test('chapter filters select occurrences and mentions without importing identification anchors', () => {
  assert.equal(lookup('Alohomora',{anchor:'PS16'}).total,1);
  assert.equal(lookup('Alohomora',{anchor:'PS1'}).total,0);
  assert.throws(() => lookup('Avada',{anchor:'GoF14'}),/Invalid PS anchor/);
  const people = semanticSearch({category:'person',limit:200},entries).entries;
  assert.ok(!people.some(e => e.entityKind === 'animal'));
  assert.equal(entries.find(e => e.id === 'baruffio').presence[0].mode,'mentioned');
  assert.equal(entries.find(e => e.id === 'charlie-weasley').presence[0].mode,'mentioned');
});
test('ranking and pagination are stable, and invalid requests fail visibly', () => {
  const all = semanticSearch({category:'object',limit:100},entries);
  const second = semanticSearch({category:'object',offset:5,limit:5},entries);
  assert.deepEqual(second.entries.map(e => e.id),all.entries.slice(5,10).map(e => e.id));
  assert.equal(second.nextOffset,10);
  assert.equal(semanticSearch({offset:999,limit:2},entries).nextOffset,null);
  for (const bad of [{query:''},{limit:0},{offset:-1},{id:'x',query:'x'},{category:'creature'},{anchor:'PS18'},{book:'OotP'},{'magic-status':'ordinary'}]) assert.throws(() => semanticSearch(bad,entries));
});
test('source-free CLI exposes unified and category routes, rejects conflicting flags', () => {
  const cli = (...args) => spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8'});
  for (const command of ['people','spells','places','objects','semantic']) {
    const result = cli(command,'--book','PS','--limit','1');
    assert.equal(result.status,0,result.stderr);
    assert.equal(JSON.parse(result.stdout).entries.length,1);
  }
  assert.equal(JSON.parse(cli('magic','--book','PS','--limit','20').stdout).total,6);
  assert.notEqual(cli('semantic','--book','PS','--query','x','--id','x').status,0);
});
test('validator rejects non-spells, missing/non-human casters and unsupported silent claims', () => {
  // One isolated fixture per mutation; keep cleanup tightly scoped to mkdtemp output.
  for (const [change,pattern] of [
    [e => {e.kind='enchanted-object';},/Non-spell/],
    [e => {e.occurrences[0].practitionerIds=[];},/human caster/],
    [e => {e.occurrences[0].practitionerIds=['peeves'];},/human caster/],
    [e => {e.occurrences[0].vocalisation='non-verbal';},/evidence/],
    [e => {delete e.identification;},/Unidentified/],
  ]) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'hp-semantic-test-'));
    try {
      fs.cpSync(path.join(root,'data'),path.join(tmp,'skills/harry-potter-fanfic/data'),{recursive:true});
      const file = path.join(tmp,'skills/harry-potter-fanfic/data/books/ps/magic.json');
      const data = JSON.parse(fs.readFileSync(file,'utf8'));change(data.entries[0]);fs.writeFileSync(file,JSON.stringify(data));
      assert.throws(() => validateBookKnowledge(tmp),pattern);
    } finally {fs.rmSync(tmp,{recursive:true,force:true});}
  }
});
