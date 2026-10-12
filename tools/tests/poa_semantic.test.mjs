import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {loadKnowledge,semanticSearch,knowledgeStats} from '../../skills/harry-potter-fanfic/scripts/semantic.mjs';
import {validateBookKnowledge} from '../validate_book_knowledge.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../skills/harry-potter-fanfic');
const entries=loadKnowledge('PoA');
const find=id=>entries.find(e=>e.id===id);
const lookup=(query,options={})=>semanticSearch({book:'PoA',query,...options});
const env={...process.env};delete env.HP_SOURCES;
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8',env});

test('PoA bilingual concept queries retrieve spells, people, places and ordinary objects',()=>{
  for(const [query,category,id] of [
    ['repel Dementors','spell','patronus-charm'],
    ['fear funny','spell','riddikulus'],
    ['lebegtet test','spell','mobilicorpus'],
    ['werewolf teacher','person','remus-lupin'],
    ['travel time','object','time-turner'],
    ['map shows occupants','object','marauders-map'],
    ['sweets secret passage','place','honeydukes'],
    ['broom maintenance gift','object','broomstick-servicing-kit'],
    ['Flitwick prison window','place','flitwick-office'],
  ]) assert.equal(lookup(query,{category}).entries[0]?.id,id,query);
  for(const [name,id] of [['Exlukhops','waddiwasi'],['Comikulissimus','riddikulus'],['Leperex','impervius'],['Buvos Bizsere','fizzing-whizzbees'],['Eszbonto kompot','confusing-concoction'],['Kometa Ketto-Hatvan','comet-two-sixty']]) assert.equal(lookup(name).entries[0]?.id,id,name);
});

test('Animagus aliases resolve one human referent without duplicate rat or dog characters',()=>{
  for(const alias of ['Scabbers','Makesz','Peter Pettigrew','Féregfark']) assert.equal(lookup(alias,{category:'person'}).entries[0]?.id,'peter-pettigrew');
  for(const alias of ['Padfoot','Tapmancs','the black dog']) assert.equal(lookup(alias,{category:'person'}).entries[0]?.id,'sirius-black');
  assert.equal(find('peter-pettigrew').entityKind,'human');
  assert.ok(!find('scabbers'));
  assert.equal(lookup('Makesz',{category:'animal'}).total,0);
  assert.equal(lookup('Csámpás',{category:'animal'}).entries[0]?.id,'crookshanks');
  assert.equal(lookup('Pigwidgeon').total,0);
  assert.ok(find('sirius-gift-owl'));
});

test('PoA casts retain correct human practitioners and simultaneous casts stay grouped',()=>{
  assert.deepEqual(find('lumos').occurrences.map(o=>o.practitionerIds),[['harry-potter'],['harry-potter'],['ron'],['harry-potter']]);
  assert.deepEqual(find('nox').occurrences[0].practitionerIds,['harry-potter','hermione']);
  assert.deepEqual(find('expelliarmus').occurrences.map(o=>o.practitionerIds),[['sirius-black'],['remus-lupin'],['harry-potter','ron','hermione'],['harry-potter']]);
  assert.deepEqual(find('mobilicorpus').occurrences[0].practitionerIds,['remus-lupin']);
  assert.deepEqual(find('alohomora').occurrences[0].practitionerIds,['hermione']);
  for(const spell of entries.filter(e=>e.category==='spell')) for(const o of spell.occurrences){
    assert.ok(o.practitionerIds.every(id=>find(id)?.entityKind==='human'));
    assert.notEqual(o.vocalisation,'non-verbal');
  }
});

test('failed Patronus attempts and the repeated lake rescue viewpoint remain distinct',()=>{
  const patronus=find('patronus-charm');
  assert.equal(patronus.occurrences.filter(o=>o.mode==='practised').length,1);
  assert.equal(patronus.occurrences.filter(o=>o.anchor==='PoA20'&&o.outcome==='failure').length,2);
  assert.deepEqual(patronus.occurrences.find(o=>o.anchor==='PoA20'&&o.practitionerIds.includes('hermione')).practitionerIds,['hermione']);
  const rescue=patronus.occurrences.filter(o=>o.eventId==='poa-lake-rescue-patronus');
  assert.equal(rescue.length,1);
  assert.equal(rescue[0].anchor,'PoA21');
  assert.deepEqual(rescue[0].observationEvidence.map(e=>e.anchor),['PoA20']);
  assert.ok(!patronus.occurrences.some(o=>o.anchor==='PoA20'&&o.outcome==='success'));
  assert.equal(lookup('Expecto Patronum',{anchor:'PoA21'}).entries[0]?.id,'patronus-charm');
  const onlyRescue={...patronus,occurrences:rescue};
  assert.equal(semanticSearch({book:'PoA',id:'patronus-charm',anchor:'PoA20'},[onlyRescue]).total,1);
  assert.equal(semanticSearch({book:'PoA',id:'patronus-charm',anchor:'PoA12'},[onlyRescue]).total,0);
});

test('spell identities exclude unidentified effects, object operation and adaptation formulas',()=>{
  assert.equal(entries.filter(e=>e.category==='spell').length,14);
  for(const query of ['Lumos Maxima','Arresto Momentum','Bombarda','Revelio','Incarcerous','Confundo','Hilario','Incendio','Obliviate','Animagus','Time-Turner','Marauder Map','Mischief managed','I solemnly swear']) assert.equal(lookup(query,{category:'spell'}).total,0,query);
  for(const id of ['cheering-charm','flame-freezing-charm']){
    assert.equal(find(id).incantation,null);
    assert.equal(find(id).occurrences[0].vocalisation,'unreported');
  }
  assert.equal(find('flame-freezing-charm').occurrences.length,1);
  assert.equal(find('flame-freezing-charm').occurrences[0].mode,'reported');
  assert.equal(find('riddikulus').occurrences.filter(o=>o.anchor==='PoA7').length,7);
  assert.ok(!find('freezing-charm'));
});

test('objects retain property evidence and book-three settings avoid film geography',()=>{
  for(const id of ['marauders-map','time-turner','harry-glasses','ron-new-wand','shrinking-solution','talking-mirror']) assert.equal(find(id).magicStatus,'demonstrated');
  for(const id of ['broomstick-servicing-kit','tail-twig-clippers','sirius-permission-letter','chocoballs','broomcare-handbook']) assert.equal(find(id).magicStatus,'ordinary');
  for(const id of ['confusing-concoction','rat-tonic','lunascope','invisible-book-invisibility']) assert.equal(find(id).magicStatus,'not-established');
  assert.ok(find('west-tower').description.includes('landmark'));
  assert.ok(find('flitwick-office').description.includes('seventh-floor'));
  assert.ok(!find('godrics-hollow'));
  assert.equal(find('magnolia-crescent').labelHu,'Magnolia köz');
});

test('source-free PoA CLI and chapter filters report scope separately from reading review',()=>{
  for(const command of ['characters','people','spells','magic','places','objects','semantic']){
    const result=cli(command,'--book','PoA','--limit','1');
    assert.equal(result.status,0,result.stderr);
    assert.equal(JSON.parse(result.stdout).book,'PoA');
  }
  const coverage=JSON.parse(cli('coverage','--book','PoA').stdout);
  assert.equal(coverage.coverageState,'incomplete');
  assert.equal(coverage.retrievalPass.state,'complete');
  assert.equal(coverage.chapters.length,22);
  const stats=knowledgeStats('PoA')[0];
  assert.equal(stats.records,231);
  assert.equal(stats.castingRecords,32);
  assert.equal(stats.contextEvidencePairs,273);
  assert.deepEqual(JSON.parse(cli('stats','--book','PoA').stdout).books,[stats]);
  assert.equal(lookup('Dissendium',{anchor:'PoA16'}).total,0);
  assert.equal(lookup('Capitulatus',{anchor:'PoA19'}).total,1);
  for(const anchor of ['PS17','PoA0','PoA23','PoA01']) assert.throws(()=>lookup('Lumos',{anchor}),/Invalid PoA anchor/);
  assert.equal(semanticSearch({book:'CoS',id:'patronus-charm'}).total,0);
  assert.equal(cli('facts','--book','PoA').status,0);
});

test('validator rejects duplicate casts and unsupported repeated viewpoint metadata',()=>{
  for(const [mutate,pattern] of [
    [d=>{const r=d.entries.find(e=>e.id==='patronus-charm').occurrences.at(-1);r.observationEvidence[0].anchor='CoS17';},/evidence has invalid anchor/],
    [d=>{const r=d.entries.find(e=>e.id==='patronus-charm').occurrences.at(-1);delete r.eventId;},/Observation needs casting event ID/],
    [d=>{const r=d.entries.find(e=>e.id==='patronus-charm').occurrences.at(-1);r.observationEvidence[0].anchor=r.anchor;},/another viewpoint anchor/],
    [d=>{const r=d.entries.find(e=>e.id==='patronus-charm').occurrences.at(-1);r.observationEvidence[0].kind='testimony';},/another viewpoint anchor/],
    [d=>{const p=d.entries.find(e=>e.id==='patronus-charm');p.occurrences.push(structuredClone(p.occurrences.at(-1)));},/duplicate casting event ID/],
  ]){
    const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hp-poa-test-'));
    try{
      fs.cpSync(path.join(root,'data'),path.join(tmp,'skills/harry-potter-fanfic/data'),{recursive:true});
      const target=path.join(tmp,'skills/harry-potter-fanfic/data/books/poa/magic.json');
      const data=JSON.parse(fs.readFileSync(target));mutate(data);fs.writeFileSync(target,JSON.stringify(data));
      assert.throws(()=>validateBookKnowledge(tmp,'PoA'),pattern);
    }finally{fs.rmSync(tmp,{recursive:true,force:true});}
  }
});
