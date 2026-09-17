#!/usr/bin/env node
/** Prepare/resume isolated agent evaluations; no model calls or generated scores. */
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hash, audit, root as skillRoot } from '../skills/harry-potter-fanfic/scripts/hp.mjs';

export const dimensions=['language','terminology','continuity','narrative','compliance'];
export function sceneText(text) { return text.split('<!-- RESOURCE-USE -->')[0].trim(); }
export function validateRatings(ratings, ids) {
  if(!Array.isArray(ratings)||ratings.length!==ids.length||new Set(ratings.map(r=>r.id)).size!==ids.length) throw Error('Expected one rating per blind output');
  for(const r of ratings) {
    if(!ids.includes(r.id)||!dimensions.every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<=4)||typeof r.evidence!=='string'||!r.evidence.trim()) throw Error(`Invalid rating: ${r.id}`);
  }
  return ratings.map(r=>({...r,total:dimensions.reduce((n,k)=>n+r[k],0)}));
}
function writeNew(file, value) { fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n',{flag:'wx'}); }
function snapshotFiles(dir,base=dir) {
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const f=path.join(dir,e.name);
    if(e.isSymbolicLink())throw Error('Snapshot symlink rejected');
    return e.isDirectory()?snapshotFiles(f,base):[{file:path.relative(base,f).replaceAll('\\','/'),sha256:hash(fs.readFileSync(f))}];
  }).sort((a,b)=>a.file.localeCompare(b.file));
}
function verifySnapshot(dir) {
  const manifest=JSON.parse(fs.readFileSync(path.join(dir,'snapshot.json'),'utf8'));
  if(JSON.stringify(manifest.files)!==JSON.stringify(snapshotFiles(path.join(dir,'skill'))))throw Error('Frozen skill snapshot changed');
  return manifest;
}
export function main(args=process.argv.slice(2)) {
  const [command,dirArg]=args;
  if(!dirArg)throw Error('Usage: node tools/evaluate_writing.mjs prepare|status|blind|score|export /absolute/evaluation-directory [calibrated | export-directory]');
  const dir=path.resolve(dirArg);
  if(command==='prepare') {
    fs.mkdirSync(dir,{recursive:true});
    const snapshot=path.join(dir,'skill'), manifest=path.join(dir,'snapshot.json');
    if(fs.existsSync(snapshot)&&!fs.existsSync(manifest))throw Error('Partial snapshot exists; inspect before recovery');
    if(!fs.existsSync(snapshot)) {
      fs.cpSync(skillRoot,snapshot,{recursive:true,errorOnExist:true,force:false});
      writeNew(manifest,{createdAt:new Date().toISOString(),files:snapshotFiles(snapshot)});
    }
    verifySnapshot(dir);
    const protocol=fs.readFileSync(path.join(snapshot,'evals/abc-0.3.0-protocol.md'),'utf8');
    const scenarios=['a school mishap','custody and trust'].map((name,i)=>protocol.split(`## Scenario ${i+1}: ${name}\n\n`)[1]?.split('\n\n## ')[0]);
    if(scenarios.some(s=>!s))throw Error('Scenario extraction failed');
    if(!fs.existsSync(path.join(dir,'scenarios.json')))writeNew(path.join(dir,'scenarios.json'),scenarios);
    console.log(JSON.stringify({directory:dir,snapshot,preservedExistingOutputs:true}));
  } else if(command==='status') {
    verifySnapshot(dir);
    const rows=[];
    for(const condition of ['A','B','C'])for(const scenario of [1,2]) {
      const id=`${condition}${scenario}`, f=path.join(dir,`${id}.md`);
      if(!fs.existsSync(f)){rows.push({id,status:'missing'});continue;}
      const raw=fs.readFileSync(f,'utf8'), text=sceneText(raw), words=audit(text).words;
      rows.push({id,status:'artifact-present',words,lengthPass:words>=450&&words<=600,hasResourceNote:raw.includes('<!-- RESOURCE-USE -->'),sha256:hash(raw)});
    }
    console.log(JSON.stringify(rows,null,2));
  } else if(command==='blind') {
    verifySnapshot(dir);
    if(['blind-map.json','blind-packet.json'].some(f=>fs.existsSync(path.join(dir,f))))throw Error('Blind artifacts already exist; preserve them or inspect a partial preparation');
    const scenarios=JSON.parse(fs.readFileSync(path.join(dir,'scenarios.json'),'utf8')), mapping=[], outputs=[];
    for(const condition of ['A','B','C'])for(const scenario of [1,2]) {
      const run=`${condition}${scenario}`, raw=fs.readFileSync(path.join(dir,`${run}.md`),'utf8');
      if(!raw.includes('<!-- RESOURCE-USE -->'))throw Error(`Missing resource note: ${run}`);
      const id=randomUUID().slice(0,8), text=sceneText(raw);
      mapping.push({id,run,sha256:hash(raw)});outputs.push({id,scenario,prompt:scenarios[scenario-1],words:audit(text).words,text});
    }
    outputs.sort((a,b)=>a.id.localeCompare(b.id));
    writeNew(path.join(dir,'blind-map.json'),mapping);
    writeNew(path.join(dir,'blind-packet.json'),{dimensions,scope:'Resource-use notes are deliberately withheld to preserve blinding. The coordinator checks their presence separately; judges must not deduct for their absence from this packet.',scale:'0 absent/incompatible; 1 serious failure; 2 repeated/material local defects; 3 one local weakness; 4 no material defect. Evidence for deductions must quote or identify specific text. Assess independently, no preferred winner.',outputs});
    console.log('Created blind packet; keep blind-map.json away from judges. Re-running never overwrites it.');
  } else if(command==='score') {
    verifySnapshot(dir);
    const mapping=JSON.parse(fs.readFileSync(path.join(dir,'blind-map.json'),'utf8'));
    if(mapping.length!==6||new Set(mapping.map(m=>m.run)).size!==6||new Set(mapping.map(m=>m.id)).size!==6||mapping.some(m=>! /^[ABC][12]$/.test(m.run)))throw Error('Invalid blind mapping');
    for(const m of mapping)if(hash(fs.readFileSync(path.join(dir,`${m.run}.md`)))!==m.sha256)throw Error(`Output changed after blinding: ${m.run}`);
    const suffix=args[2]==='calibrated'?'-calibrated':'';
    if(args[2]&&args[2]!=='calibrated')throw Error('Optional score mode must be calibrated');
    const judges=[`judge-1${suffix}.json`,`judge-2${suffix}.json`].map(f=>validateRatings(JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),mapping.map(m=>m.id)));
    const rows=mapping.map(m=>({run:m.run,judges:judges.map(j=>j.find(r=>r.id===m.id)),meanTotal:judges.reduce((n,j)=>n+j.find(r=>r.id===m.id).total,0)/judges.length})).sort((a,b)=>a.run.localeCompare(b.run));
    const summary={rows,conditionMeans:Object.fromEntries(['A','B','C'].map(c=>[c,rows.filter(r=>r.run.startsWith(c)).reduce((n,r)=>n+r.meanTotal,0)/2])),note:'Descriptive two-scenario results, not a statistical effectiveness estimate.'};
    console.log(JSON.stringify(summary,null,2));
  } else if(command==='export') {
    verifySnapshot(dir);
    if(!args[2])throw Error('An export directory is required');
    const destination=path.resolve(args[2]);
    if(fs.existsSync(destination))throw Error('Export destination exists; refusing to overwrite evidence');
    const files=['A1.md','A2.md','B1.md','B2.md','C1.md','C2.md','scenarios.json','snapshot.json','blind-map.json','judge-1.json','judge-2.json','judge-1-calibrated.json','judge-2-calibrated.json','retest.md'];
    for(const f of files)if(!fs.existsSync(path.join(dir,f)))throw Error(`Missing artifact: ${f}`);
    const report=mode=>JSON.parse(execFileSync(process.execPath,[fileURLToPath(import.meta.url),'score',dir,...(mode?[mode]:[])],{encoding:'utf8'}));
    const raw=report(),calibrated=report('calibrated');
    fs.mkdirSync(destination,{recursive:true});
    for(const f of files)fs.copyFileSync(path.join(dir,f),path.join(destination,f),fs.constants.COPYFILE_EXCL);
    writeNew(path.join(destination,'scores-original.json'),raw);writeNew(path.join(destination,'scores-calibrated.json'),calibrated);
    writeNew(path.join(destination,'retest-snapshot.json'),{files:snapshotFiles(path.join(dir,'retest-skill'))});
    writeNew(path.join(destination,'artifact-manifest.json'),{files:files.map(file=>({file,sha256:hash(fs.readFileSync(path.join(dir,file)))})),retestWords:audit(sceneText(fs.readFileSync(path.join(dir,'retest.md'),'utf8'))).words});
    console.log(JSON.stringify({exported:destination,files:files.length+4,sourceBooksExported:false}));
  } else throw Error('Unknown evaluation command');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try{main();}catch(e){console.error(e.message);process.exitCode=1;}
}
