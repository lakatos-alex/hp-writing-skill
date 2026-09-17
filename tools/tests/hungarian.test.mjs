import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { root, glossary, lintHungarian, hash, search } from '../../skills/harry-potter-fanfic/scripts/hp.mjs';
const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/hp.mjs'),...args],{encoding:'utf8'});
test('glossary distinguishes spoken formula from named effect',()=>{
  const entries=glossary('Accio');assert.equal(entries.find(e=>e.id==='accio').hu,'Invito');assert.equal(entries.find(e=>e.id==='summoning-charm').hu,'begyűjtőbűbáj');
  assert.ok(glossary('Norris').some(e=>e.en===e.hu));assert.equal(glossary('Pomfrey')[0].hu,'Madam Pomfrey');
  assert.ok(glossary('Roxfort').some(e=>e.id==='hogwarts'));assert.throws(()=>glossary('', 'typo'));
});
test('Hungarian lint is advisory and respects token boundaries',()=>{
  assert.ok(lintHungarian('Hogwarts is a name in this quotation.').warnings.some(e=>e.suggested==='Roxfort'));
  assert.equal(lintHungarian('Roxfortban maradt. Madam Pomfrey segített.').warnings.length,0);
  assert.equal(lintHungarian('xHogwartsy').warnings.length,0);
});
test('source-free Hungarian chapter and glossary pagination',()=>{
  const c=cli('chapters','--lang','hu','--book','DH','--limit','40');assert.equal(c.status,0);assert.equal(JSON.parse(c.stdout).total,37);
  assert.ok(JSON.parse(c.stdout).chapters.every(c=>c.sourceQuality));
  const g=cli('glossary','--category','person','--limit','1');assert.equal(g.status,0);assert.equal(JSON.parse(g.stdout).nextOffset,1);
  assert.notEqual(cli('chapters','--lang','de').status,0);assert.notEqual(cli('glossary','--limit','-1').status,0);
});
test('paired read requires both languages and preserves independent offsets and warnings',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'hp-pair-'));
  try {
    for(const lang of ['en','hu']) {
      const d=path.join(dir,lang);fs.mkdirSync(d);fs.writeFileSync(path.join(d,'source.pdf'),'fixture');
      const text=lang==='en'?'Original English test paragraph.':'Eredeti magyar tesztbekezdés.';
      const b={code:'PS',language:lang,source:'source.pdf',sha256:hash('fixture'),chapters:[{anchor:'PS1',title:'Test',text,sha256:hash(text)}],...(lang==='hu'?{conversion:{warnings:['Synthetic quality warning']}}:{})};
      fs.writeFileSync(path.join(d,'catalogue.local.json'),JSON.stringify({schemaVersion:1,books:[b]}));
      if(lang==='hu')assert.ok(search([b],{query:'magyar'}).hits[0].sourceQuality);
    }
    const a=cli('align','--sources',dir,'--anchor','PS1','--offset','2','--max-chars','5');assert.equal(a.status,0);const r=JSON.parse(a.stdout);
    assert.equal(r.passages.length,2);assert.ok(r.passages.every(p=>p.offset===2&&p.text.length===5&&p.nextOffset===7));assert.ok(r.passages[1].sourceWarnings.length);
    assert.notEqual(cli('read','--sources',path.join(dir,'hu'),'--lang','en','--anchor','PS1').status,0);
    fs.renameSync(path.join(dir,'hu'),path.join(dir,'missing-hu'));assert.notEqual(cli('align','--sources',dir,'--anchor','PS1').status,0);
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
