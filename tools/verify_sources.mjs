import fs from 'node:fs';
import path from 'node:path';
import { root, extractBook, loadCatalogue, unzip, plain, search } from '../skills/harry-potter-fanfic/scripts/hp.mjs';
const dir=path.resolve(process.argv[2]??'original-sources');
const check=(ok,m)=>{if(!ok)throw Error(m);};
const normalize=s=>s.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu,'');
try {
  const {books}=loadCatalogue(dir);
  check(books.length===7,'Expected all seven books');
  const published=JSON.parse(fs.readFileSync(path.join(root,'data/chapters.json'),'utf8'));
  const sourceIndex=fs.readFileSync(path.join(root,'references/source-index.md'),'utf8');
  let count=0;
  for(const b of books) {
    const file=path.join(dir,b.source), fresh=extractBook(file), entries=unzip(fs.readFileSync(file));
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
  // Report long exact word sequences copied into public prose/data, using 30-word windows.
  const tokenize=s=>(s.toLowerCase().match(/[\p{L}\p{N}]+/gu)??[]);
  const candidates=new Map();
  function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(/\.(md|json)$/.test(f)){const w=tokenize(fs.readFileSync(f,'utf8'));for(let i=0;i+30<=w.length;i++)candidates.set(w.slice(i,i+30).join(' '),path.relative(root,f));}}}
  walk(root);
  for(const b of books)for(const c of b.chapters){const w=tokenize(c.text);for(let i=0;i+30<=w.length;i++){const key=w.slice(i,i+30).join(' ');check(!candidates.has(key),`Long source sequence in ${candidates.get(key)} from ${c.anchor}`);}}
  console.log(`PASS: ${books.length} EPUBs, ${count} primary chapters; normalized text preserved, titles and hashes agree; ${facts.length} locators present; no 30-word source sequences in public prose/data.`);
  console.log('Text comparison ignores punctuation/whitespace and checks letters/numbers. Locator checks are retrieval tests, not independent semantic verification.');
}catch(e){console.error(`FAIL: ${e.message}`);process.exitCode=1;}
