import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {loadKnowledge,semanticSearch,knowledgeStats} from '../../skills/harry-potter-fanfic/scripts/semantic.mjs';
import {root} from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
import {validateBookKnowledge} from '../validate_book_knowledge.mjs';

const entries=loadKnowledge('CoS');
const find=id=>entries.find(e=>e.id===id);
const lookup=(query,options={})=>semanticSearch({book:'CoS',query,...options});
const first=(query,options)=>lookup(query,options).entries[0]?.id;
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8'});

test('CoS concepts and translated names resolve distinct identities',()=>{
  assert.equal(first('disarm wand',{category:'spell'}),'expelliarmus');
  assert.equal(first('erase memory',{category:'spell'}),'obliviate');
  assert.equal(first('Capitulatus',{category:'spell'}),'expelliarmus');
  assert.equal(first('Exmemoriam',{category:'spell'}),'obliviate');
  assert.equal(first('Pótcsont-Rapid',{category:'object'}),'skele-gro');
  assert.equal(first('Widra St. Capdel',{category:'place'}),'ottery-st-catchpole');
  assert.equal(first('diary memory possession',{category:'object'}),'riddles-diary');
  assert.equal(first('Dobby',{category:'person'}),'dobby');
  assert.equal(lookup('Fawkes',{category:'person'}).total,0);
  assert.equal(first('Fawkes',{category:'animal'}),'fawkes');
  for(const alias of ['Tom Riddle','Tom Rowle Denem','Voldemort']) assert.equal(first(alias,{category:'person'}),'voldemort');
  assert.equal(entries.filter(e=>e.category==='person' && e.aliases.includes('Tom Riddle')).length,1);
});
test('CoS spell index retains only identified human spells and excludes adaptation guesses',()=>{
  const spells=entries.filter(e=>e.category==='spell');
  assert.deepEqual(spells.map(e=>e.id).sort(),['expelliarmus','finite-incantatem','freezing-charm','lumos','obliviate','rictusempra','serpensortia','tarantallegra']);
  for(const s of spells) for(const o of s.occurrences){
    assert.ok(o.practitionerIds.every(id=>find(id)?.entityKind==='human'));
    assert.notEqual(o.vocalisation,'non-verbal');
  }
  for(const q of ['Hover Charm','Peskipiksi Pesternomi','Hessberöpsi tündemanca','Eat Slugs','Brackium Emendo','Oculus Reparo','Vipera Evanesca','Immobilus','Avada Kedavra','Homorphus Charm','Engorgio','Polyjuice','Ford Anglia']) assert.equal(lookup(q,{category:'spell'}).total,0,q);
});
test('unknown words, backfire and declined Lumos remain separate facts',()=>{
  const freeze=find('freezing-charm');
  assert.equal(freeze.incantation,null);
  assert.equal(freeze.identification.basis,'named-effect-in-book');
  assert.equal(freeze.occurrences[0].vocalisation,'unreported');
  assert.equal(freeze.occurrences[0].wand,'unreported');
  assert.deepEqual(find('lumos').occurrences.map(o=>o.practitionerIds),[['harry-potter'],['harry-potter']]);
  const memory=find('obliviate');
  assert.equal(memory.occurrences.length,1);
  assert.equal(memory.occurrences[0].mode,'attempted');
  assert.equal(memory.occurrences[0].outcome,'failure');
  assert.equal(memory.reportedClassUses.length,2);
  assert.deepEqual(memory.reportedClassUses[0].practitionerIds,['arthur-weasley','perkins']);
  assert.ok(memory.reportedClassUses.every(r=>!r.incantation && r.evidence.every(e=>e.kind==='testimony')));
});
test('ordinary objects and uncertain properties do not become spell events',()=>{
  for(const id of ['colin-camera','harry-glasses','penelope-mirror','moste-potente-potions','harrys-sock']) assert.equal(find(id).magicStatus,'ordinary');
  for(const id of ['borgin-shop-cabinet','hogwarts-vanishing-cabinet','gryffindor-sword','staring-glass-eye']) assert.equal(find(id).magicStatus,'not-established');
  for(const id of ['flying-ford-anglia','riddles-diary','moving-photographs','skele-gro']) assert.equal(find(id).magicStatus,'demonstrated');
  assert.equal(find('hand-of-glory').evidence[0].kind,'testimony');
  assert.equal(find('penelope-mirror').evidence[0].kind,'interpretation');
  assert.equal(find('albus-dumbledore').presence[0].mode,'mentioned');
  assert.ok(!find('perfect-quidditch'));
});
test('book and chapter routes keep inventories isolated and preserve class-report anchors',()=>{
  assert.equal(lookup('Capitulatus',{anchor:'CoS11'}).total,1);
  assert.equal(lookup('Capitulatus',{anchor:'CoS1'}).total,0);
  assert.equal(lookup('Obliviate',{category:'spell',anchor:'CoS3'}).total,1);
  assert.equal(semanticSearch({book:'PS',category:'spell',id:'expelliarmus'}).total,0);
  assert.equal(lookup('Alohomora',{category:'spell'}).total,0);
  for(const anchor of ['PS11','CoS0','CoS19','CoS01','GoF14']) assert.throws(()=>lookup('Lumos',{anchor}),/Invalid CoS anchor/);
  assert.throws(()=>loadKnowledge('OotP'),/Unsupported/);
  const all=semanticSearch({book:'CoS',category:'object',limit:100});
  assert.deepEqual(semanticSearch({book:'CoS',category:'object',offset:5,limit:5}).entries.map(e=>e.id),all.entries.slice(5,10).map(e=>e.id));
});
test('source-free CoS CLI, coverage and stats report the actual packaged inventory',()=>{
  for(const command of ['characters','people','magic','spells','places','objects','semantic']){
    const result=cli(command,'--book','CoS','--limit','1');
    assert.equal(result.status,0,result.stderr);
    assert.equal(JSON.parse(result.stdout).book,'CoS');
    assert.equal(JSON.parse(result.stdout).entries.length,1);
  }
  const coverage=JSON.parse(cli('coverage','--book','CoS').stdout);
  assert.equal(coverage.coverageState,'incomplete');
  assert.equal(coverage.retrievalPass.state,'complete');
  assert.equal(coverage.chapters.length,18);
  const stats=knowledgeStats('CoS')[0];
  assert.equal(stats.records,entries.length);
  assert.equal(stats.people+stats.animals+stats.places+stats.objects+stats.spells,stats.records);
  assert.equal(stats.castingRecords,11);
  assert.equal(stats.classReportRecords,2);
  assert.deepEqual(JSON.parse(cli('stats').stdout).books,knowledgeStats());
  assert.deepEqual(JSON.parse(cli('stats','--book','CoS').stdout).books,[stats]);
  assert.notEqual(cli('stats','--book','OotP').status,0);
});
test('CoS validator rejects foreign anchors and non-human reports',()=>{
  for(const [file,mutate,pattern] of [
    ['places',d=>{d.entries[0].evidence[0].anchor='PS5';},/evidence has invalid anchor/],
    ['magic',d=>{d.entries.find(e=>e.id==='obliviate').reportedClassUses[0].practitionerIds=['dobby'];},/human caster/],
    ['magic',d=>{d.entries[0].identification={basis:'later-explicit-identification',availableFrom:'PS4',evidence:d.entries[0].identification.evidence};},/later anchor/],
  ]){
    const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'hp-cos-test-'));
    try{
      fs.cpSync(path.join(root,'data'),path.join(tmp,'skills/harry-potter-fanfic/data'),{recursive:true});
      const target=path.join(tmp,'skills/harry-potter-fanfic/data/books/cos',`${file}.json`);
      const data=JSON.parse(fs.readFileSync(target));mutate(data);fs.writeFileSync(target,JSON.stringify(data));
      assert.throws(()=>validateBookKnowledge(tmp,'CoS'),pattern);
    }finally{fs.rmSync(tmp,{recursive:true,force:true});}
  }
});

test('README semantic data counts agree with the packaged stats',()=>{
  const readme=fs.readFileSync(path.resolve(root,'../../README.md'),'utf8');
  const stats=knowledgeStats();
  for(const s of stats){
    const values=[s.chapters,s.people+s.animals,s.places,s.objects,s.spells,s.records].join(' | ');
    assert.ok(readme.includes(`(${s.book}) | ${values} |`),s.book);
  }
  const total=key=>stats.reduce((n,s)=>n+s[key],0);
  const normalized=readme.replace(/\s+/g,' ');
  assert.ok(normalized.includes(`${total('contextEvidencePairs')} contextual evidence pairs and ${total('literalMentionPairs')} literal-mention pairs`));
  assert.ok(normalized.includes(`${total('castingRecords')} casting, practice or reported-event rows`));
});
