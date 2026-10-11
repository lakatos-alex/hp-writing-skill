/** Project language preferences and output projection; no translation or network. */
import fs from 'node:fs';
import path from 'node:path';
export const configName = '.hp-writing.json';
export function validLanguage(language) {
  if (!['en','hu','both'].includes(language)) throw Error('--lang / config language must be en, hu or both');
  return language;
}
function readConfig(file) {
  if (fs.statSync(file).size > 8192) throw Error(`Language config exceeds 8 KiB: ${file}`);
  let data;
  try { data = JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')); }
  catch { throw Error(`Invalid JSON language config: ${file}`); }
  if (!data || typeof data !== 'object' || Array.isArray(data)
      || Object.keys(data).some(key => !['language','schemaVersion'].includes(key))
      || (data.schemaVersion != null && data.schemaVersion !== 1)) throw Error(`Invalid language config schema: ${file}`);
  validLanguage(data.language);
  return data;
}
export function languageSettings(options = {}, cwd = process.cwd()) {
  const directory = path.resolve(cwd,options.project ?? '.');
  if (!fs.statSync(directory).isDirectory()) throw Error('--project must be a directory');
  let configFile = options.config ? path.resolve(directory,options.config) : null;
  if (!configFile) {
    for (let current=directory;;current=path.dirname(current)) {
      const candidate=path.join(current,configName);
      if (fs.existsSync(candidate)) { configFile=candidate; break; }
      if (path.dirname(current)===current) break;
    }
  }
  const config=configFile ? readConfig(configFile) : null;
  return {language:validLanguage(options.lang ?? config?.language ?? 'en'),
    languageSource:options.lang != null ? 'flag' : config ? 'project-config' : 'default',
    configFile, directory};
}
export function saveLanguage(options = {}, skillRoot, cwd = process.cwd()) {
  const language=validLanguage(options.lang);
  const settings=options.config ? {directory:path.resolve(cwd,options.project ?? '.')} : languageSettings(options,cwd);
  if (!fs.statSync(settings.directory).isDirectory()) throw Error('--project must be a directory');
  const file=options.config ? path.resolve(settings.directory,options.config) : settings.configFile ?? path.join(settings.directory,configName);
  const relative=path.relative(skillRoot,file);
  if (!relative.startsWith('..'+path.sep) && relative!=='..' && !path.isAbsolute(relative)) throw Error('Save language in the story project, outside the installed skill. Use --project PATH.');
  let data={schemaVersion:1};
  if (fs.existsSync(file)) {
    if (fs.lstatSync(file).isSymbolicLink()) throw Error('Refusing to overwrite a linked config file');
    data=readConfig(file);
  }
  fs.writeFileSync(file,JSON.stringify({...data,language},null,2)+'\n',fs.existsSync(file) ? undefined : {flag:'wx'});
  return {language,languageSource:'project-config',configFile:file};
}
/** Mixed aliases/search terms have no language tags; omit them rather than guess. */
export function projectLanguage(value, language, field = '') {
  validLanguage(language);
  if (language==='both' || value == null) return value;
  if (typeof value==='string' && language==='en' && ['notes','limits','description','writingNotes','summary'].includes(field)) {
    // Omit explicitly marked localization commentary, not canonical English
    // names such as Hungarian Horntail. Leave the underlying record unchanged.
    const localized=/\b(?:HU|Hungarian)\s+(?:edition|EPUB|spelling|wording|formula|translation|terminology|names?|labels?|forms?|headwords?)\b/i;
    return value.split(/(?<=[.!?])\s+/).filter(sentence=>!localized.test(sentence)).join(' ');
  }
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(item=>projectLanguage(item,language,field));
  const opposite=language==='en' ? 'hu' : 'en';
  const keys=new Set([opposite,`label${opposite==='en'?'En':'Hu'}`,`${opposite}Locator`,`${opposite}Title`,`${opposite}Words`]);
  const legacyTerm=Object.hasOwn(value,'en') && Object.hasOwn(value,'hu') && Object.hasOwn(value,'notes') && !Object.hasOwn(value,'labelEn');
  return Object.fromEntries(Object.entries(value)
    .filter(([key])=>!keys.has(key) && !['aliases','searchTerms'].includes(key)
      && !(language==='en' && legacyTerm && ['notes','bookUsage'].includes(key)))
    .map(([key,item])=>[key,projectLanguage(item,language,key)]));
}
