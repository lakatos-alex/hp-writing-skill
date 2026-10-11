import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {glossary,lintHungarian} from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
const script=fileURLToPath(new URL('../../skills/harry-potter-fanfic/scripts/hp.mjs',import.meta.url));
const env={...process.env};delete env.HP_SOURCES;
const cli=(...args)=>spawnSync(process.execPath,[script,...args],{cwd:path.dirname(script),encoding:'utf8',env});
const result=(...args)=>{const call=cli(...args);assert.equal(call.status,0,call.stderr);return JSON.parse(call.stdout);};

test('previously failed GoF term queries resolve edition wording without a series fallback',()=>{
  for(const [query,id,hu] of [['Summoning','accio','Invito'],['Killing','killing-curse','Adava Kedavra']]){
    const page=result('glossary','--book','GoF','--query',query,'--category','spell','--limit','1');
    assert.equal(page.book,'GoF');assert.equal(page.entries[0].id,id);assert.equal(page.entries[0].hu,hu);
    assert.equal(page.entries[0].termKind,'incantation');
    assert.ok(page.entries[0].evidence.some(e=>e.huLocator.includes(hu)));
    assert.ok(!Object.hasOwn(page.entries[0],'occurrences'),'term lookup stays compact');
    const details=result(...page.entries[0].detailsCommand.split(' '));
    assert.equal(details.entries[0].incantation.hu,hu);
  }
  const names=glossary('Moody','person','GoF');
  assert.ok(names.some(e=>e.id==='alastor-moody'));assert.ok(names.some(e=>e.id==='barty-crouch-junior'));
});

test('typed book terms preserve referents, animals and unnamed spell classes across inventories',()=>{
  for(const [book,q,category,id,hu] of [
    ['PS','float feather','spell','wingardium-leviosa','Vingardium leviosa'],
    ['PS','potions teacher','person','severus-snape','Piton'],
    ['CoS','disarm','spell','expelliarmus','Capitulatus'],
    ['PoA','Leperex','spell','impervius','Leperex'],
    ['PoA','Hedwig','creature','hedwig','Hedvig'],
    ['GoF','Shield Charm','spell','shield-charm',null]
  ]){
    const term=glossary(q,category,book).find(e=>e.id===id);assert.ok(term,`${book}:${q}`);
    assert.equal(term.category,category);assert.equal(term.verification.book,book);
    if(hu)assert.equal(term.hu,hu);else{assert.equal(term.termKind,'referent-name');assert.ok(!term.hu.includes('Protego'));}
  }
  assert.equal(glossary('Protego','spell','GoF').length,0);
  assert.ok(glossary('Harry',undefined,'PS')[0].anchors.every(a=>a.startsWith('PS')));
  assert.ok(glossary('Avada').some(e=>e.hu==='Avada Kedavra'),'legacy series glossary remains separate');
});

test('first-book terminology uses the full typed inventory without importing a later formula',()=>{
  const all=result('glossary','--book','PS','--limit','300');
  assert.equal(all.total,246);
  assert.ok(all.entries.every(e=>e.verification.book==='PS'&&e.detailsCommand.startsWith('semantic --book PS --id ')));
  assert.equal(glossary('deepest desire','object','PS')[0].id,'mirror-of-erised');
  const curse=glossary('Killing Curse','spell','PS').find(e=>e.id==='avada-kedavra');
  assert.equal(curse.termKind,'referent-name');
  assert.ok(!curse.hu.includes('Adava'));
  assert.equal(result(...curse.detailsCommand.split(' ')).entries[0].identification.availableFrom,'GoF14');
  assert.throws(()=>glossary('x','institution','PS'),/Book-scoped glossary categories/);
  assert.throws(()=>glossary('','spell','PS'),/must not be empty/);
});

test('book-term pagination preserves ordering and unavailable scopes fail visibly',()=>{
  const all=glossary(undefined,'spell','GoF');
  const page=result('glossary','--book','GoF','--category','spell','--limit','3','--offset','2');
  assert.equal(page.total,all.length);assert.equal(page.nextOffset,5);
  assert.deepEqual(page.entries.map(e=>e.id),all.slice(2,5).map(e=>e.id));
  assert.equal(result('glossary','--book','GoF','--query','no-such-factual-term').total,0);
  assert.throws(()=>glossary('x',undefined,'HBP'),/Unsupported book terminology/);
  assert.throws(()=>glossary('x','institution','GoF'),/Book-scoped glossary categories/);
  assert.throws(()=>glossary('','spell','GoF'),/must not be empty/);
  for(const args of [['glossary','--book','GoF','--limit','0'],['glossary','--book','GoF','--offset','-1']])assert.notEqual(cli(...args).status,0);
  assert.ok(result('glossary','--query','Accio').scope.includes('series-wide'));
  assert.ok(result('semantic','--book','GoF','--id','missing').scope.includes('not canon absence'));
});

test('focused help distinguishes typed terminology from selective evidence cards',()=>{
  const terms=cli('glossary','--help');const cards=cli('facts','--help');
  assert.equal(terms.status,0);assert.equal(cards.status,0);
  assert.ok(terms.stdout.includes('PS|CoS|PoA|GoF'));
  assert.ok(cards.stdout.includes('--book supports PS only'));
});

test('book-aware Hungarian advisory scan catches the missed edition form without rewriting text',()=>{
  const text='Avada Kedavra. Adava Kedavra. Invito.';
  const scan=lintHungarian(text,'GoF');
  assert.equal(scan.book,'GoF');
  const curse=scan.warnings.filter(e=>e.id==='killing-curse');
  assert.equal(curse.length,1);assert.equal(curse[0].found,'Avada Kedavra');
  assert.equal(curse[0].suggested,'Adava Kedavra');assert.equal(curse[0].offset,0);
  assert.ok(curse[0].anchors.includes('GoF14'));
  assert.ok(!lintHungarian(text).warnings.some(e=>e.id==='killing-curse'));
  assert.throws(()=>lintHungarian(text,'HBP'),/Unsupported book terminology/);
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'hp-book-term-'));
  const file=path.join(temp,'scene.md');
  try {
    fs.writeFileSync(file,text);
    const saved=result('lint-hu','--file',file,'--book','GoF');
    assert.deepEqual(saved,scan);assert.equal(fs.readFileSync(file,'utf8'),text);
  } finally {if(fs.existsSync(file))fs.unlinkSync(file);fs.rmdirSync(temp);}
});
