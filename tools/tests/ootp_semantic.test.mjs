import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {loadKnowledge,semanticSearch,knowledgeStats} from '../../skills/harry-potter-fanfic/scripts/semantic.mjs';
import {validateBookKnowledge} from '../validate_book_knowledge.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../skills/harry-potter-fanfic');
const entries=loadKnowledge('OotP');
const lookup=(query,options={})=>semanticSearch({book:'OotP',query,...options});
const env={...process.env};delete env.HP_SOURCES;
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{cwd:os.tmpdir(),env,encoding:'utf8'});

test('five book inventories share the typed contract while independent reading stays separate',()=>{
  for(const book of ['PS','CoS','PoA','GoF','OotP']) {
    const counts=validateBookKnowledge(undefined,book),stats=knowledgeStats(book)[0];
    assert.equal(stats.records,counts.characters+counts.magic+counts.places+counts.objects);
  }
  const coverage=JSON.parse(cli('coverage','--book','OotP').stdout);
  assert.equal(coverage.chapters.length,38);assert.equal(coverage.retrievalPass.state,'complete');
  assert.equal(coverage.coverageState,'incomplete');
  const represented=new Set(entries.flatMap(e=>[...(e.evidence??[]),...(e.termMentions??[]),...(e.occurrences??[])].map(e=>e.anchor)));
  for(let n=1;n<=38;n++)assert.ok(represented.has('OotP'+n));
});

test('later identification of James lifting Snape does not certify an OotP spoken or silent formula',()=>{
  const spell=lookup('Levicorpus',{category:'spell'}).entries[0];
  assert.ok(spell);assert.equal(spell.identification.availableFrom,'HBP16');
  assert.equal(spell.identification.basis,'later-explicit-identification');
  assert.ok(spell.occurrences.some(o=>o.anchor==='OotP28'&&o.vocalisation==='unreported'));
  assert.ok(spell.laterIncantation);assert.ok(!spell.incantation);
  assert.ok(!lookup('Levicorpus',{anchor:'OotP27',category:'spell'}).entries.length);
});

test('unnamed silent attacks and object operation do not become guessed spell identities',()=>{
  const spells=entries.filter(e=>e.category==='spell');
  assert.ok(!spells.some(e=>/dolohov.*(?:curse|purple)|purple.*curse/i.test(e.id+' '+e.labelEn)));
  assert.ok(!spells.some(e=>['apparition','animagus','doxycide','extendable-ears','da-galleons','prophecy-orb'].includes(e.id)));
  for(const spell of spells)for(const occurrence of spell.occurrences) {
    assert.ok(occurrence.practitionerIds.every(id=>entries.some(e=>e.id===id&&e.entityKind==='human')));
    if(occurrence.vocalisation==='non-verbal')assert.ok(occurrence.nonVerbalEvidence.length);
  }
});

test('source-free OotP routes select languages and preserve paging and knowledge limits',()=>{
  for(const command of ['characters','people','places','objects','spells','semantic','glossary']) {
    const en=cli(command,'--book','OotP','--limit','2','--lang','en');assert.equal(en.status,0,en.stderr);
    const hu=cli(command,'--book','OotP','--limit','2','--lang','hu');assert.equal(hu.status,0,hu.stderr);
    const a=JSON.parse(en.stdout),b=JSON.parse(hu.stdout);
    assert.equal(a.total,b.total);assert.deepEqual(a.entries.map(e=>e.id),b.entries.map(e=>e.id));
    assert.ok(a.entries.every(e=>!Object.hasOwn(e,'labelHu')));
    assert.ok(b.entries.every(e=>!Object.hasOwn(e,'labelEn')));
    assert.match(a.scope,/knowledge/i);
  }
  for(const anchor of ['OotP0','OotP39','OotP01','GoF35'])assert.throws(()=>lookup('Harry',{anchor}),/Invalid OotP anchor/);
  assert.notEqual(cli('facts','--book','OotP').status,0,'legacy evidence-card projection remains PS-only');
  assert.notEqual(cli('glossary','--book','Unknown').status,0,'unknown books fail visibly');
});
