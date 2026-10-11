import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {loadKnowledge,semanticSearch,knowledgeStats} from '../../skills/harry-potter-fanfic/scripts/semantic.mjs';
import {validateBookKnowledge} from '../validate_book_knowledge.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../skills/harry-potter-fanfic');
const entries=loadKnowledge('GoF'),find=id=>entries.find(e=>e.id===id);
const lookup=(query,options={})=>semanticSearch({book:'GoF',query,...options});
const env={...process.env};delete env.HP_SOURCES;
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8',env});

test('GoF bilingual retrieval returns relevant spell, person, place and object identities',()=>{
  for(const [q,category,id] of [
    ['Invito','spell','accio'],['Baziteo','spell','engorgio'],['Relaxo','spell','relashio'],
    ['Obstructo','spell','impedimenta'],['Carbunculus','spell','furnunculus'],
    ['captive Auror','person','alastor-moody'],['Rita Vitrol','person','rita-skeeter'],
    ['egg water','object','golden-egg'],['seven-lock trunk','object','moody-trunk'],
    ['electrical interference','object','muggle-electronic-devices'],
    ['egg water bathroom','place','prefects-bathroom'],['Sirius cave','place','sirius-cave'],
  ])assert.equal(lookup(q,{category}).entries[0]?.id,id,q);
});

test('impostor, adult followers and Animagus identities do not leak into wrong practitioners',()=>{
  for(const spell of entries.filter(e=>e.category==='spell'))for(const o of spell.occurrences){
    assert.ok(o.practitionerIds.every(id=>find(id)?.entityKind==='human'));
    assert.ok(!o.practitionerIds.includes('alastor-moody'),'no real Moody classroom casting');
    assert.notEqual(o.vocalisation,'non-verbal');
  }
  for(const id of ['engorgio','reducio'])assert.deepEqual(find(id).occurrences[0].practitionerIds,['barty-crouch-junior']);
  assert.deepEqual(find('killing-curse').occurrences.find(o=>o.anchor==='GoF32').practitionerIds,['peter-pettigrew']);
  assert.deepEqual(find('morsmordre').occurrences[0].practitionerIds,['barty-crouch-junior']);
  assert.ok(find('morsmordre').identification.evidence.some(e=>e.anchor==='GoF35'));
  for(const q of ['Scabbers','Makesz'])assert.equal(lookup(q,{category:'person'}).entries[0]?.id,'peter-pettigrew');
  assert.equal(find('rita-skeeter').entityKind,'human');
  assert.equal(lookup('beetle',{category:'animal'}).total,0);
  assert.ok(find('nott-senior'));assert.ok(!find('nott-ps'));
  assert.ok(find('crabbe-senior')&&find('crabbe'));
  assert.ok(find('dennis-creevey'));assert.ok(!find('dennis-dudley-gang'));
});

test('known failed casts qualify while guessed formulas and passive effects do not',()=>{
  assert.ok(find('accio').occurrences.some(o=>o.outcome==='failure'));
  assert.ok(find('reducto').occurrences.some(o=>o.outcome==='failure'));
  assert.equal(find('shield-charm').incantation,null);
  for(const q of ['Ascendio','Aguamenti','Protego','Depulso','Confundo','Cistem Aperio','Animagus','Polyjuice Potion','Portkey'])assert.equal(lookup(q,{category:'spell'}).total,0,q);
  assert.equal(find('relashio').occurrences[0].vocalisation,'spoken');
  assert.equal(find('bubble-head-charm').incantation,null);
  assert.equal(find('unbreakable-charm').occurrences[0].mode,'reported');
  assert.ok(find('stupefy').reportedClassUses.some(r=>r.practitionerIds.includes('barty-crouch-junior')));
});

test('edition-specific wand inspection differs from twin-core effect and object activation',()=>{
  const inspection=find('prior-incantato');
  assert.equal(inspection.incantation.hu,'Priori incantatem');
  assert.equal(inspection.occurrences[0].anchor,'GoF9');
  assert.deepEqual(inspection.occurrences[0].practitionerIds,['amos-diggory']);
  assert.ok(!inspection.occurrences.some(o=>o.anchor==='GoF34'));
  assert.equal(find('killing-curse').incantation.hu,'Adava Kedavra');
  assert.equal(find('deletrius').incantation.hu,'Annullate');
  assert.equal(find('incendio').incantation.hu,'Piroinitio');
  for(const id of ['goblet-of-fire','triwizard-cup','moody-trunk','golden-egg','polyjuice-potion','beetle-jar'])assert.equal(find(id).magicStatus,'demonstrated');
  for(const id of ['goblet-casket','ron-dress-robes','muggle-electronic-devices','moody-wooden-leg'])assert.equal(find(id).magicStatus,'ordinary');
  assert.equal(find('cauldron').magicStatus,'not-established');
  assert.equal(find('muggle-electronic-devices').evidence[0].kind,'testimony');
});

test('GoF source-free commands and scope retain honest reading and knowledge limits',()=>{
  for(const command of ['characters','people','spells','places','objects','semantic']){
    const result=cli(command,'--book','GoF','--limit','1');assert.equal(result.status,0,result.stderr);
    assert.equal(JSON.parse(result.stdout).book,'GoF');
  }
  const coverage=JSON.parse(cli('coverage','--book','GoF').stdout);
  assert.equal(coverage.coverageState,'incomplete');assert.equal(coverage.retrievalPass.state,'complete');
  assert.equal(coverage.chapters.length,37);
  assert.equal(lookup('Professor Moody',{category:'person',anchor:'GoF14'}).entries[0]?.id,'barty-crouch-junior');
  assert.ok(find('barty-crouch-junior').limits.includes('not a character-knowledge cutoff'));
  for(const anchor of ['PS14','GoF0','GoF38','GoF01'])assert.throws(()=>lookup('Lumos',{anchor}),/Invalid GoF anchor/);
  assert.notEqual(cli('facts','--book','GoF').status,0);
  for(const command of ['facts']){
    const failure=cli(command,'--book','GoF');
    assert.match(failure.stderr,/--book supports PS only/);
    assert.match(failure.stderr,/semantic --book GoF/);
    assert.equal(cli(command,'--query','electricity').status,0);
  }
  assert.match(cli('people').stderr,/choose PS, CoS, PoA, GoF/);
  assert.notEqual(cli('stats','--book','Unknown').status,0);
  assert.deepEqual(JSON.parse(cli('stats','--book','GoF').stdout).books,knowledgeStats('GoF'));
  assert.equal(validateBookKnowledge(undefined,'GoF').coverage,37);
});
