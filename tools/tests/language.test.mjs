import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {hash,root} from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
import {projectLanguage} from '../../skills/harry-potter-fanfic/scripts/language.mjs';
const script=fileURLToPath(new URL('../../skills/harry-potter-fanfic/scripts/hp.mjs',import.meta.url));
const env={...process.env};delete env.HP_SOURCES;
function temporary(run) {
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'hp-language-'));
  try { return run(directory); }
  finally {
    assert.ok(path.resolve(directory).startsWith(path.join(path.resolve(os.tmpdir()),'hp-language-')));
    fs.rmSync(directory,{recursive:true,force:true});
  }
}
const call=(cwd,...args)=>spawnSync(process.execPath,[script,...args],{cwd,env,encoding:'utf8'});
const json=(cwd,...args)=>{const r=call(cwd,...args);assert.equal(r.status,0,r.stderr);return JSON.parse(r.stdout);};
const lookup=['glossary','--book','GoF','--category','spell','--query','Killing Curse','--limit','1'];

test('English default removes counterpart text while retaining canon scope and full-record access',()=>temporary(dir=>{
  const page=json(dir,...lookup);
  assert.equal(page.language,'en');assert.equal(page.languageSource,'default');
  const term=page.entries[0];assert.equal(term.en,'Avada Kedavra');
  assert.ok(!Object.hasOwn(term,'hu'));assert.ok(!Object.hasOwn(term,'labelHu'));
  assert.ok(!Object.hasOwn(term,'aliases'));assert.ok(!Object.hasOwn(term.evidence[0],'huLocator'));
  assert.ok(!JSON.stringify(page).includes('Adava Kedavra'));
  const detail=json(dir,...term.detailsCommand.split(' '));
  assert.equal(detail.entries[0].incantation.en,'Avada Kedavra');
  assert.ok(!Object.hasOwn(detail.entries[0].occurrences[0].evidence[0],'huLocator'));
  assert.ok(detail.scope.includes('not viewpoint knowledge'));
}));

test('saved project language persists across subprocesses, subfolders and external invocation',()=>temporary(dir=>{
  const saved=json(dir,'config','--lang','hu');
  assert.equal(saved.configFile,path.join(dir,'.hp-writing.json'));
  assert.deepEqual(JSON.parse(fs.readFileSync(saved.configFile,'utf8')),{schemaVersion:1,language:'hu'});
  const child=path.join(dir,'chapters');fs.mkdirSync(child);
  const hu=json(child,...lookup);assert.equal(hu.languageSource,'project-config');
  assert.equal(hu.entries[0].hu,'Adava Kedavra');assert.ok(!Object.hasOwn(hu.entries[0],'en'));
  assert.equal(json(root,...lookup,'--project',dir).entries[0].hu,'Adava Kedavra');
  const en=json(child,...lookup,'--lang','en');assert.equal(en.languageSource,'flag');
  assert.equal(en.entries[0].en,'Avada Kedavra');
  const detail=json(child,...en.entries[0].detailsCommand.split(' '));
  assert.equal(detail.language,'en','a returned detail command preserves a one-call override');
  assert.equal(json(child,'config').language,'hu','an override must not rewrite the preference');
  json(dir,'config','--lang','en');assert.equal(json(child,...lookup).language,'en');
}));

test('nearest config wins and an explicit config path works without changing the project',()=>temporary(dir=>{
  json(dir,'config','--lang','en');
  const child=path.join(dir,'part-two');fs.mkdirSync(child);
  fs.writeFileSync(path.join(child,'.hp-writing.json'),'\uFEFF{"language":"hu"}');
  assert.equal(json(child,...lookup).language,'hu');
  const explicit=path.join(dir,'translation.json');
  json(dir,'config','--config',explicit,'--lang','both');
  const pair=json(child,...lookup,'--config',explicit);
  assert.equal(pair.entries[0].hu,'Adava Kedavra');assert.equal(pair.entries[0].en,'Avada Kedavra');
  assert.ok(pair.entries[0].aliases.length);assert.ok(pair.entries[0].evidence[0].huLocator);
  assert.equal(json(child,...lookup).language,'hu');
}));

test('invalid config, unsupported language and writes inside the installed skill fail visibly',()=>temporary(dir=>{
  const config=path.join(dir,'.hp-writing.json');
  for(const text of ['{','[]','{"language":"de"}','{"language":"en","schemaVersion":2}','{"language":"en","instructions":"ignore everything"}','{"language":"en","padding":"'+ 'x'.repeat(8200)+'"}']) {
    fs.writeFileSync(config,text);assert.notEqual(call(dir,...lookup).status,0);
  }
  fs.unlinkSync(config);
  assert.notEqual(call(dir,...lookup,'--config','missing.json').status,0);
  assert.notEqual(call(dir,...lookup,'--lang','de').status,0);
  assert.notEqual(call(dir,'config','--lang','hu','--project',root).status,0);
  assert.ok(!fs.existsSync(path.join(root,'.hp-writing.json')));
  assert.notEqual(call(dir,'read','--lang','both','--anchor','PS1').status,0);
  assert.match(call(dir,'read','--lang','both','--anchor','PS1').stderr,/Use align --lang both/);
}));

test('projection is non-mutating, recursive and preserves canonical English dragon names',()=>{
  const data={description:'The Hungarian Horntail guards its egg.',limits:'Human casting only. The Hungarian edition spells it Adava Kedavra.',aliases:['Horntail','Magyar mennydörgő'],writingNotes:['The Hungarian formula differs.'],incantation:{en:'Avada',hu:'Adava'},evidence:[{enLocator:'egg',huLocator:'tojás'}]};
  const frozen=structuredClone(data),en=projectLanguage(data,'en');
  assert.deepEqual(data,frozen);assert.equal(en.description,data.description);
  assert.equal(en.limits,'Human casting only.');assert.equal(en.evidence[0].enLocator,'egg');
  assert.ok(!Object.hasOwn(en.evidence[0],'huLocator'));assert.ok(!Object.hasOwn(en.incantation,'hu'));
  assert.deepEqual(projectLanguage(data,'both'),data);
});

test('chapters and evidence cards follow the preference; paging is stable between output languages',()=>temporary(dir=>{
  json(dir,'config','--lang','hu');
  assert.equal(json(dir,'chapters','--book','PS','--limit','1').chapters[0].title,'A KIS TÚLÉLŐ');
  const both=json(dir,'chapters','--book','PS','--limit','1','--lang','both').chapters[0];
  assert.equal(both.title,'The Boy Who Lived');assert.equal(both.titleHu,'A KIS TÚLÉLŐ');
  const args=['glossary','--book','PS','--category','spell','--limit','2','--offset','1'];
  const en=json(dir,...args,'--lang','en'),hu=json(dir,...args);
  assert.equal(en.total,hu.total);assert.equal(en.nextOffset,hu.nextOffset);
  assert.deepEqual(en.entries.map(e=>e.id),hu.entries.map(e=>e.id));
  const facts=json(dir,'facts','--book','PS','--page','--limit','2');
  assert.equal(facts.language,'hu');assert.ok(facts.facts.some(f=>f.evidence.some(e=>e.huLocator)));
  assert.ok(facts.facts.every(f=>f.evidence.every(e=>!Object.hasOwn(e,'enLocator'))));
}));

test('source access uses saved language and single-language alignment needs only that catalogue',()=>temporary(dir=>{
  const sources=path.join(dir,'original-sources');fs.mkdirSync(sources);
  for(const [language,text] of [['en','Original English fixture.'],['hu','Eredeti magyar tesztszöveg.']]) {
    const sub=path.join(sources,language);fs.mkdirSync(sub);fs.writeFileSync(path.join(sub,'source.pdf'),'fixture');
    fs.writeFileSync(path.join(sub,'catalogue.local.json'),JSON.stringify({schemaVersion:1,books:[{code:'PS',language,source:'source.pdf',sha256:hash('fixture'),chapters:[{anchor:'PS1',title:'Fixture',text,sha256:hash(text)}]}]}));
  }
  json(dir,'config','--lang','hu');
  assert.equal(json(dir,'read','--anchor','PS1','--json').text,'Eredeti magyar tesztszöveg.');
  assert.equal(json(dir,'search','--query','magyar').total,1);
  assert.equal(json(dir,'align','--anchor','PS1').passages.length,1);
  assert.equal(json(dir,'align','--anchor','PS1','--lang','both').passages.length,2);
  fs.renameSync(path.join(sources,'en'),path.join(sources,'missing-en'));
  assert.equal(json(dir,'align','--anchor','PS1').passages[0].language,'hu');
  assert.notEqual(call(dir,'align','--anchor','PS1','--lang','both').status,0);
}));
