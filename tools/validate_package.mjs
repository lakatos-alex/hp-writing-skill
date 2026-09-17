import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(ROOT, 'skills/harry-potter-fanfic');
const fail = m => { throw Error(m); };
const check = (ok, m) => { if (!ok) fail(m); };
function walk(dir) {
  return fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => {
    if (['.git','node_modules','dist','__pycache__'].includes(e.name)) return [];
    const p = path.join(dir,e.name);
    if (e.isSymbolicLink()) fail(`Symlink in package tree: ${p}`);
    if (p === path.join(ROOT,'original-sources')) return [path.join(p,'README.md')];
    return e.isDirectory() ? walk(p) : [p];
  });
}
try {
  const files = walk(ROOT), entry = fs.readFileSync(path.join(SKILL,'SKILL.md'),'utf8');
  check(entry.startsWith('---\n'), 'Missing frontmatter');
  const [header, body] = entry.slice(4).split('\n---\n');
  check(/^name: harry-potter-fanfic$/m.test(header), 'Invalid skill name');
  check(/^description: .{1,1024}$/m.test(header), 'Invalid description');
  const version=header.match(/^  version: "(\d+\.\d+\.\d+)"$/m)?.[1];
  check(version, 'Missing semantic release version');
  check(body.split('\n').length < 500, 'Entrypoint needs progressive disclosure');
  check(fs.readFileSync(path.join(ROOT,'README.md'),'utf8').includes(`Version ${version}`), 'README version mismatch');
  for(const n of ['LICENSE','ACKNOWLEDGMENTS.md']) check(fs.readFileSync(path.join(ROOT,n)).equals(fs.readFileSync(path.join(SKILL,n))), `Notice copy differs: ${n}`);
  const chapters=JSON.parse(fs.readFileSync(path.join(SKILL,'data/chapters.json'),'utf8'));
  const anchors=new Set(chapters.map(c=>c.anchor));
  check(chapters.length===199 && anchors.size===199,'Expected 199 unique chapter anchors');
  const topics=JSON.parse(fs.readFileSync(path.join(SKILL,'data/topics.json'),'utf8'));
  for(const c of chapters) {
    check(c.title && c.words>100 && Number.isInteger(c.number),'Invalid chapter metadata');
    for(const [k,v] of Object.entries(c.topicCounts)) check(Object.hasOwn(topics,k)&&Number.isInteger(v)&&v>0,'Invalid topic count');
  }
  const huChapters=JSON.parse(fs.readFileSync(path.join(SKILL,'data/chapters-hu.json'),'utf8'));
  check(huChapters.length===199&&new Set(huChapters.map(c=>c.anchor)).size===199,'Expected 199 Hungarian anchors');
  for(const c of huChapters) {
    const en=chapters.find(e=>e.anchor===c.anchor);
    check(en&&c.book===en.book&&c.number===en.number&&c.title&&c.words>100,'Invalid Hungarian chapter alignment');
    check(c.topicBasis==='aligned English lexical counts'&&JSON.stringify(c.topicCounts)===JSON.stringify(en.topicCounts),'Hungarian topic provenance mismatch');
  }
  const glossary=JSON.parse(fs.readFileSync(path.join(SKILL,'data/hu-glossary.json'),'utf8'));
  check(glossary.length>0&&new Set(glossary.map(e=>e.id)).size===glossary.length,'Duplicate or empty glossary');
  const categories=['person','place','house','spell','object','potion','institution','creature','expression','concept'];
  for(const e of glossary) {
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id)&&categories.includes(e.category),`Invalid glossary ID/category: ${e.id}`);
    check(e.en&&e.hu&&e.notes&&Array.isArray(e.aliases)&&e.aliases.every(a=>typeof a==='string')&&e.anchors.length&&e.anchors.every(a=>anchors.has(a)),`Incomplete glossary record: ${e.id}`);
    check(e.verification?.status==='paired-term-checked'&&e.verification.enLocator&&e.verification.huLocator,`Missing paired term provenance: ${e.id}`);
  }
  const facts=JSON.parse(fs.readFileSync(path.join(SKILL,'data/facts.json'),'utf8'));
  check(new Set(facts.map(f=>f.id)).size===facts.length,'Duplicate fact ID');
  for(const f of facts) {
    check(f.claim && f.limits && f.topics.length && f.anchors.every(a=>anchors.has(a)),`Invalid fact: ${f.id}`);
    check(['event','testimony','interpretation'].includes(f.kind),`Invalid evidence kind: ${f.id}`);
    check(f.verification.status==='passage-checked' && f.verification.locator,`Missing evidence status: ${f.id}`);
  }
  execFileSync(process.execPath,[path.join(ROOT,'tools','validate_book_knowledge.mjs')],{cwd:ROOT,stdio:'pipe'});
  for(const file of files) {
    const rel=path.relative(ROOT,file);
    check(!/\.(epub|pdf|mobi|azw3?|zip|tgz)$/i.test(file)&&!file.endsWith('.local.json'),`Private or generated payload: ${rel}`);
    if(!/\.(md|json|mjs|py|ya?ml|ps1)$/.test(file))continue;
    const content=fs.readFileSync(file,'utf8');
    check(!content.includes('\ufffd'),`Replacement character: ${rel}`);
    check(!/^(<<<<<<< |=======\s*$|>>>>>>> )/m.test(content),`Conflict marker: ${rel}`);
    if(file.endsWith('.json'))JSON.parse(content);
    if(file.endsWith('.md'))for(const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      const link=match[1]; if(link.includes('://')||link.startsWith('#'))continue;
      const dest=path.resolve(path.dirname(file),link.split('#')[0]);
      check(dest.startsWith(ROOT+path.sep)&&fs.existsSync(dest),`Broken/external local link: ${rel}: ${link}`);
      if(file.startsWith(SKILL+path.sep))check(dest.startsWith(SKILL+path.sep),`Installed skill depends on checkout: ${rel}: ${link}`);
    }
    if(file.startsWith(SKILL+path.sep))check(!/C:[/\\]Users[/\\]Alex|Hearthbound|Zsófi/.test(content),`Private overlay in skill: ${rel}`);
  }
  if(fs.existsSync(path.join(ROOT,'.git'))) {
    for(const probe of ['original-sources/example.epub','original-sources/books.md','original-sources/nested/book.txt','original-sources/catalogue.local.json'])check(spawnSync('git',['check-ignore','-q',probe],{cwd:ROOT}).status===0,`Source not ignored: ${probe}`);
    const tracked=execFileSync('git',['ls-files'],{cwd:ROOT,encoding:'utf8'}).trim().split('\n');
    check(tracked.every(p=>!p.startsWith('original-sources/')||p==='original-sources/README.md'),'Source material tracked');
    check(execFileSync('git',['check-attr','export-ignore','--','original-sources/'],{cwd:ROOT,encoding:'utf8'}).trim().endsWith(': set'),'Source archive exclusion missing');
  }
  console.log(`PASS: ${files.length} files; 199 paired chapters; ${facts.length} evidence cards; ${glossary.length} bilingual terms; links, metadata, data integrity and publication boundaries.`);
  console.log('These checks do not establish canon interpretation or literary quality.');
}catch(e){console.error(`FAIL: ${e.message}`);process.exitCode=1;}
