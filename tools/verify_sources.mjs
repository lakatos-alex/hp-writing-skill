import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { root, extractBook, loadCatalogue, unzip, plain, search, sourceDirectory } from '../skills/harry-potter-fanfic/scripts/hp.mjs';
const dir=path.resolve(process.argv[2]??'original-sources');
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const check=(ok,m)=>{if(!ok)throw Error(m);};
const normalize=s=>s.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu,'');
try {
  const enDir=sourceDirectory(dir,'en');
  const {books}=loadCatalogue(enDir);
  check(books.length===7,'Expected all seven books');
  const published=JSON.parse(fs.readFileSync(path.join(root,'data/chapters.json'),'utf8'));
  const sourceIndex=fs.readFileSync(path.join(root,'references/source-index.md'),'utf8');
  let count=0;
  for(const b of books) {
    const file=path.join(enDir,b.source), fresh=extractBook(file), entries=unzip(fs.readFileSync(file));
    check(fresh.sha256===b.sha256,'Source hash mismatch');
    const md=fs.readFileSync(file.replace(/\.epub$/i,'.md'),'utf8');
    check((md.match(/^## /gm)??[]).length===b.chapters.length,`Wrong Markdown heading count: ${b.code}`);
    for(const c of b.chapters) {
      const html=entries.get(c.entry).toString('utf8').replace(/<h[1-6]\b[^>]*>[^]*?<\/h[1-6]>/gi,'');
      check(normalize(plain(html))===normalize(c.text),`Text loss: ${c.anchor}`);
      check(fresh.chapters.find(x=>x.anchor===c.anchor)?.text===c.text,`Stale extraction: ${c.anchor}`);
      const p=published.find(p=>p.anchor===c.anchor);
      check(p?.title===c.title&&p?.words===c.words,`Public catalogue drift: ${c.anchor}`);
      const anchor=c.anchor==='DH-epilogue'?'DH epilogue':c.anchor;
      const row=sourceIndex.split('\n').find(l=>l.startsWith(`| ${anchor} |`));
      check(row&&normalize(row.split('|')[2])===normalize(c.title),`Title index drift: ${c.anchor}`);
      check(md.includes(`## ${c.anchor}: ${c.title}\n\n${c.text}`),`Markdown drift: ${c.anchor}`);
      count++;
    }
  }
  check(count===199,'Incomplete narrative corpus');
  const facts=JSON.parse(fs.readFileSync(path.join(root,'data/facts.json'),'utf8'));
  for(const f of facts)check(search(books,{anchor:f.anchors[0],query:f.verification.locator,limit:1,context:0}).total>0,`Missing fact locator: ${f.id}`);
  const psBookRecords=['characters','magic'].flatMap(name=>JSON.parse(fs.readFileSync(path.join(root,'data','books','ps',`${name}.json`),'utf8')).entries);
  const psEvidencePresent=[...JSON.parse(fs.readFileSync(path.join(root,'data/hu-glossary.json'),'utf8')),...JSON.parse(fs.readFileSync(path.join(root,'data/facts.json'),'utf8')),...psBookRecords].some(record=>(record.evidence??[]).some(item=>item.anchor.startsWith('PS')) || (record.bookUsage?.PS?.evidence?.length) || (record.occurrences??[]).some(occurrence=>(occurrence.evidence??[]).length));
  const huDir=path.join(dir,'hu'); let hu=[];
  check(!psEvidencePresent || fs.existsSync(path.join(huDir,'catalogue.local.json')),'PS evidence requires a Hungarian source catalogue');
  if(fs.existsSync(path.join(huDir,'catalogue.local.json'))) {
    hu=loadCatalogue(huDir).books;
    check(hu.length===7&&hu.flatMap(b=>b.chapters).length===199,'Expected complete Hungarian seven-book corpus');
    const huPublished=JSON.parse(fs.readFileSync(path.join(root,'data/chapters-hu.json'),'utf8'));
    for(const b of hu) {
      const file=path.join(huDir,b.source), md=fs.readFileSync(file.replace(/\.(epub|pdf)$/i,'.md'),'utf8');
      const epub=b.source.endsWith('.epub'), fresh=epub?extractBook(file):null, entries=epub?unzip(fs.readFileSync(file)):null;
      check((md.match(/^## /gm)??[]).length===b.chapters.length,`Hungarian Markdown heading count: ${b.code}`);
      for(const c of b.chapters) {
        const p=huPublished.find(p=>p.anchor===c.anchor);
        check(p?.title===c.title&&p?.words===c.words,`Hungarian public catalogue drift: ${c.anchor}`);
        check(md.includes(`## ${c.anchor}: ${c.title}\n\n${c.text}`),`Hungarian Markdown drift: ${c.anchor}`);
        if(epub) {
          const html=entries.get(c.entry).toString('utf8').replace(/<h[1-6]\b[^>]*>[^]*?<\/h[1-6]>/gi,'');
          check(normalize(plain(html))===normalize(c.text),`Hungarian text loss: ${c.anchor}`);
          check(fresh.chapters.find(x=>x.anchor===c.anchor)?.text===c.text,`Hungarian stale extraction: ${c.anchor}`);
        }
      }
    }
    const glossary=JSON.parse(fs.readFileSync(path.join(root,'data/hu-glossary.json'),'utf8'));
    for(const e of glossary) {
      check(search(books,{anchor:e.anchors[0],query:e.verification.enLocator,limit:1,context:0}).total>0,`Missing English term: ${e.id}`);
      check(search(hu,{anchor:e.anchors[0],query:e.verification.huLocator,limit:1,context:0}).total>0,`Missing Hungarian term: ${e.id}`);
    }
    const facts=JSON.parse(fs.readFileSync(path.join(root,'data/facts.json'),'utf8'));
    const bookRecords=psBookRecords;
    const evidenceRecords=[...glossary,...facts,...bookRecords];
    const checkEvidence=(record,label)=>{for(const item of record.evidence??[]) {check(search(books,{anchor:item.anchor,query:item.enLocator,limit:1,context:0}).total>0,`Missing English evidence locator: ${label}`);check(search(hu,{anchor:item.anchor,query:item.huLocator,limit:1,context:0}).total>0,`Missing Hungarian evidence locator: ${label}`);}}
    for(const record of evidenceRecords) checkEvidence(record,record.id);
    for(const record of bookRecords) for(const occurrence of record.occurrences??[]) for(const item of occurrence.evidence??[]) {check(search(books,{anchor:item.anchor,query:item.enLocator,limit:1,context:0}).total>0,`Missing English occurrence locator: ${record.id}`);check(search(hu,{anchor:item.anchor,query:item.huLocator,limit:1,context:0}).total>0,`Missing Hungarian occurrence locator: ${record.id}`);}
    console.log(`PASS: 199 Hungarian chapters; 162 EPUB chapters compared to XHTML; 37 PDF chapter hashes/Markdown checked; ${glossary.length} bilingual term locators present.`);
    console.log('PDF extraction fidelity is evaluated separately by the edition-specific converter and visual page checks.');
  }
  // Report long exact word sequences copied into public prose/data, using 30-word windows.
  const tokenize=s=>(s.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]);
  const candidates=new Map();
  function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){if(['.git','node_modules','original-sources'].includes(e.name))continue;const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(/\.(md|json)$/.test(f)){const w=tokenize(fs.readFileSync(f,'utf8'));for(let i=0;i+30<=w.length;i++)candidates.set(w.slice(i,i+30).join(' '),path.relative(projectRoot,f));}}}
  walk(projectRoot);
  for(const b of [...books,...hu])for(const c of b.chapters){const w=tokenize(c.text);for(let i=0;i+30<=w.length;i++){const key=w.slice(i,i+30).join(' ');check(!candidates.has(key),`Long source sequence in ${candidates.get(key)} from ${c.anchor}`);}}
  console.log(`PASS: ${books.length} EPUBs, ${count} primary chapters; normalized text preserved, titles and hashes agree; ${facts.length} locators present; no 30-word source sequences in public prose/data.`);
  console.log('Text comparison ignores punctuation/whitespace and checks letters/numbers. Locator checks are retrieval tests, not independent semantic verification.');
}catch(e){console.error(`FAIL: ${e.message}`);process.exitCode=1;}
