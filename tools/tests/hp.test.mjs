import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { decode, plain, markdown, unzip, search, audit, checkState, loadCatalogue, hash, root } from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
test('conversion preserves Unicode and simple emphasis, removes empty emphasis and head',()=>{
  const result=markdown('<html><head><title>Metadata</title></head><body><h1>Chapter</h1><p>Éva &amp; Ivo: <em>wait</em>.</p><p><em> </em></p><p>Next&#8217;s turn.</p></body></html>');
  assert.equal(result,"## Chapter\n\nÉva & Ivo: *wait*.\n\nNext’s turn.");
  assert.equal(plain('<p>A <b>small</b> task.</p>'),'A small task.');
});
test('invalid and unresolved entities fail visibly',()=>{assert.throws(()=>decode('&#99999999;'));assert.throws(()=>markdown('<p>&madeup;</p>'));});
const books=[{code:'PS',chapters:[{anchor:'PS1',title:'One',text:'Alpha alpha\nBeta ÉVA.'},{anchor:'PS2',title:'Two',text:'Alpha returns.'}]}];
test('search is literal, case-insensitive and paginated',()=>{
  const r=search(books,{query:'ALPHA',limit:1,context:0});assert.equal(r.total,3);assert.equal(r.nextOffset,1);assert.equal(r.hits[0].excerpt,'Alpha');
  assert.equal(search(books,{query:'alpha',offset:2,limit:1}).hits[0].anchor,'PS2');
  assert.equal(search(books,{query:'.',context:0}).total,2);
});
test('book/chapter filters and Unicode search',()=>{assert.equal(search(books,{query:'éva',anchor:'ps1'}).total,1);assert.equal(search(books,{query:'alpha',book:'DH'}).total,0);});
test('empty queries and invalid bounds fail',()=>{assert.throws(()=>search(books,{query:''}));assert.throws(()=>search(books,{query:'a',limit:-1}));});
test('manuscript counter and duplicate paragraph observations',()=>{
  assert.equal(audit('Éva’s long-term work: 12 repairs.').words,5);
  const p='This is a deliberately repeated paragraph that exceeds forty characters.';
  assert.equal(audit(`${p}\n\n${p}`).repeatedParagraphs[0].count,2);
});
test('knowledge needs a prior route, including within one event',()=>{
  assert.equal(checkState({events:[{id:'a',order:1,requires:[{character:'Ivo',fact:'secret'}]}]}).ok,false);
  assert.equal(checkState({events:[{id:'a',order:1,learns:[{character:'Ivo',fact:'secret',via:'letter'}]},{id:'b',order:2,requires:[{character:'Ivo',fact:'secret'}]}]}).ok,true);
  assert.equal(checkState({events:[{id:'a',order:1,learns:[{character:'Ivo',fact:'secret',via:'letter'}],requires:[{character:'Ivo',fact:'secret'}]}]}).ok,false);
});
test('object transfers require actual custody and order is strict',()=>{
  assert.equal(checkState({initialObjects:{key:'Mara'},events:[{id:'a',order:1,transfers:[{object:'key',from:'Ivo',to:'Mara'}]}]}).ok,false);
  assert.equal(checkState({events:[{id:'a',order:1},{id:'b',order:1}]}).ok,false);
  assert.throws(()=>checkState({}));
});
test('stale source or extracted text invalidates catalogue',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hp-test-'));
  try{
    fs.writeFileSync(path.join(dir,'fake.epub'),'source');
    const catalogue={schemaVersion:1,books:[{source:'fake.epub',sha256:hash('source'),chapters:[{text:'text',sha256:hash('text')}]}]};
    fs.writeFileSync(path.join(dir,'catalogue.local.json'),JSON.stringify(catalogue));assert.equal(loadCatalogue(dir).books.length,1);
    fs.writeFileSync(path.join(dir,'fake.epub'),'changed');assert.throws(()=>loadCatalogue(dir),/Source changed/);
    fs.writeFileSync(path.join(dir,'fake.epub'),'source');catalogue.books[0].chapters[0].text='changed';fs.writeFileSync(path.join(dir,'catalogue.local.json'),JSON.stringify(catalogue));assert.throws(()=>loadCatalogue(dir),/Catalogue text changed/);
  }finally{fs.rmSync(dir,{recursive:true});}
});
test('invalid ZIPs fail without filesystem extraction',()=>assert.throws(()=>unzip(Buffer.from('not a zip')),/ZIP/));
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8'});
test('bundled chapter and fact lookup need no corpus',()=>{
  const r=cli('chapters','--book','DH','--limit','40');assert.equal(r.status,0);assert.equal(JSON.parse(r.stdout).total,37);
  const f=cli('facts','--query','electronics');assert.equal(f.status,0);assert.equal(JSON.parse(f.stdout)[0].id,'hogwarts-electronics');
});
test('CLI rejects misspelled options, missing values and unavailable sources',()=>{
  assert.notEqual(cli('read','--anchro','PS1').status,0);assert.notEqual(cli('search','--query').status,0);assert.notEqual(cli('read','--sources','not-a-source-folder','--anchor','PS1').status,0);
});
