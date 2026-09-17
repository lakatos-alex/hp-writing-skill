import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { crc32, extractBook, importSources, loadCatalogue, sourceDirectory, hash, unzip, search } from '../../skills/harry-potter-fanfic/scripts/hp.mjs';

// Original synthetic text only; no private source files required by CI.
function zip(entries, method=8) {
  const local=[], central=[]; let offset=0;
  for (const [name,text] of entries) {
    const nameBytes=Buffer.from(name), data=Buffer.from(text), packed=method===8?deflateRawSync(data):data;
    const l=Buffer.alloc(30), c=Buffer.alloc(46), crc=crc32(data);
    l.writeUInt32LE(0x04034b50); l.writeUInt16LE(method,8); l.writeUInt32LE(crc,14); l.writeUInt32LE(packed.length,18); l.writeUInt32LE(data.length,22); l.writeUInt16LE(nameBytes.length,26);
    c.writeUInt32LE(0x02014b50); c.writeUInt16LE(method,10); c.writeUInt32LE(crc,16); c.writeUInt32LE(packed.length,20); c.writeUInt32LE(data.length,24); c.writeUInt16LE(nameBytes.length,28); c.writeUInt32LE(offset,42);
    local.push(l,nameBytes,packed); central.push(c,nameBytes); offset+=l.length+nameBytes.length+packed.length;
  }
  const directory=Buffer.concat(central), end=Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length,8); end.writeUInt16LE(entries.length,10); end.writeUInt32LE(directory.length,12); end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}
function fixture(lang='hu', order=Array.from({length:17},(_,i)=>i+1), badHeading=false) {
  const name=n=>lang==='en'?`hp01_ch${String(n).padStart(3,'0')}_test.xhtml`:`c${n}.xhtml`;
  const label=n=>lang==='hu'?`${n}. fejezet Próba ${n}`:`Test ${n}`;
  const docs=Array.from({length:17},(_,i)=>[name(i+1),`<html><head><title>Not prose</title></head><body><h1>${badHeading&&i===0?'Wrong':label(i+1)}</h1><p>– Őrizd a kulcsot! – kérte Éva.</p><p>${'Ez eredeti tesztmondat, nem könyvrészlet. '.repeat(6)}<em>Árvíztűrő tükörfúrógép.</em></p></body></html>`]);
  const entries=[['META-INF/container.xml','<container><rootfiles><rootfile full-path="content.opf"/></rootfiles></container>'],
    ['content.opf',`<package><metadata><dc:title>${lang==='hu'?'Harry Potter és a Bölcsek Köve':'Synthetic test title'}</dc:title><dc:language>${lang}</dc:language></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="front" href="front.xhtml"/>${docs.map(([n],i)=>`<item id="c${i+1}" href="${n}"/>`).join('')}</manifest><spine><itemref idref="front"/>${order.map(n=>`<itemref idref="c${n}"/>`).join('')}</spine></package>`],
    ['front.xhtml','<p>Metadata to exclude.</p>'],
    ['toc.ncx',`<ncx><navMap>${docs.map(([n],i)=>`<navPoint><navLabel><text>${label(i+1)}</text></navLabel><content src="${n}"/></navPoint>`).join('')}</navMap></ncx>`],...docs];
  return zip(entries);
}
function temporary(run) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hp-import-'));
  try { return run(dir); } finally { fs.rmSync(dir,{recursive:true,force:true}); }
}
for (const lang of ['en','hu']) test(`${lang} synthetic EPUB imports complete ordered chapters and preserves dialogue`,()=>temporary(dir=>{
  const file=path.join(dir,'book.epub');fs.writeFileSync(file,fixture(lang));
  const b=extractBook(file);assert.equal(b.chapters.length,17);assert.equal(b.chapters.at(-1).anchor,'PS17');
  assert.match(b.chapters[0].text,/– Őrizd a kulcsot! – kérte Éva\./);assert.match(b.chapters[0].text,/\*Árvíztűrő tükörfúrógép\.\*/);
  assert.equal(b.excluded.length,1);assert.equal(b.chapters[0].title,lang==='hu'?'Próba 1':'Test 1');
  importSources(dir,lang);assert.equal(loadCatalogue(dir).books.length,1);assert.match(fs.readFileSync(path.join(dir,'book.md'),'utf8'),/^## PS17:/m);
  assert.throws(()=>importSources(dir,lang==='hu'?'en':'hu'),/language/);
}));
test('NCX cannot conceal out-of-order or duplicated spine chapters',()=>temporary(dir=>{
  for(const order of [[2,1,...Array.from({length:15},(_,i)=>i+3)],[1,1,...Array.from({length:15},(_,i)=>i+3)]]){
    const file=path.join(dir,'bad.epub');fs.writeFileSync(file,fixture('hu',order));assert.throws(()=>extractBook(file));
  }
}));
test('Hungarian heading and navigation must agree',()=>temporary(dir=>{const f=path.join(dir,'bad.epub');fs.writeFileSync(f,fixture('hu',undefined,true));assert.throws(()=>extractBook(f),/mismatch/);}));
test('failed batch leaves existing generated outputs intact',()=>temporary(dir=>{
  fs.writeFileSync(path.join(dir,'good.epub'),fixture());fs.writeFileSync(path.join(dir,'bad.epub'),'bad zip');fs.writeFileSync(path.join(dir,'good.md'),'preserved');
  assert.throws(()=>importSources(dir));assert.equal(fs.readFileSync(path.join(dir,'good.md'),'utf8'),'preserved');assert.equal(fs.existsSync(path.join(dir,'catalogue.local.json')),false);
}));
test('duplicate book editions fail before output',()=>temporary(dir=>{
  fs.writeFileSync(path.join(dir,'a.epub'),fixture());fs.writeFileSync(path.join(dir,'b.epub'),fixture());assert.throws(()=>importSources(dir),/Duplicate/);assert.equal(fs.existsSync(path.join(dir,'a.md')),false);
}));
test('ZIP supports stored data and rejects CRC damage and unsafe names',()=>{
  assert.equal(unzip(zip([['safe','original text']],0)).get('safe').toString(),'original text');
  const damaged=zip([['safe','original text']],0);damaged[34]^=1;assert.throws(()=>unzip(damaged),/damaged/);
  assert.throws(()=>unzip(zip([['../unsafe','text']],0)),/Unsafe/);
  assert.throws(()=>unzip(zip([['same','a'],['same','b']],0)),/duplicate/);
});
test('PDF sidecars retain page-aware text and reject stale source hashes',()=>temporary(dir=>{
  fs.writeFileSync(path.join(dir,'book.pdf'),'synthetic pdf placeholder');
  const b={code:'DH',title:'Synthetic PDF',language:'hu',source:'book.pdf',sha256:hash('synthetic pdf placeholder'),excluded:[],chapters:Array.from({length:37},(_,i)=>({anchor:i===36?'DH-epilogue':`DH${i+1}`,number:i+1,title:`Próba ${i+1}`,entry:`page:${i+1}`,text:'Őrzött eredeti tesztszöveg.',sha256:hash('Őrzött eredeti tesztszöveg.'),words:3}))};
  fs.writeFileSync(path.join(dir,'book.pdf.local.json'),JSON.stringify(b));assert.equal(importSources(dir)[0].chapters,37);
  fs.writeFileSync(path.join(dir,'book.pdf'),'changed');assert.throws(()=>importSources(dir),/stale/);
}));
test('source language resolution supports flat legacy and bilingual directories',()=>temporary(dir=>{
  assert.equal(sourceDirectory(dir),dir);fs.mkdirSync(path.join(dir,'en'));fs.mkdirSync(path.join(dir,'hu'));
  assert.equal(sourceDirectory(dir),path.join(dir,'en'));assert.equal(sourceDirectory(dir,'hu'),path.join(dir,'hu'));assert.throws(()=>sourceDirectory(dir,'de'));
}));
test('search handles Hungarian inflections, decomposed accents and invalid empty-result bounds',()=>{
  const books=[{code:'PS',chapters:[{anchor:'PS1',title:'Próba',text:'Roxfortban. Árvíz. A\u0301rvíz.'}]}];
  assert.equal(search(books,{query:'Roxfort'}).total,1);assert.equal(search(books,{query:'árvíz'}).total,2);
  assert.throws(()=>search(books,{query:'missing',context:-1}));
});
