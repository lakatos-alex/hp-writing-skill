/** Curated concept retrieval. No embeddings, source text, network or model calls. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data/books');
const categories = {characters:'person', magic:'spell', places:'place', objects:'object'};
export const fold = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
  .replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const tokens = value => fold(value).split(' ').filter(Boolean);
const stop = new Set(tokens('a an the and or of to for from in on with by at is are was were it its that this those these which who what where how find search show me please something can i you your s ve has have had do does did tells using used use object objects spell spells person people place places character characters magical magic tool az a egy és vagy hogy ami amely hol ki mit melyik keres keresés mutat nekem tárgy tárgyak varázslat varázslatok ember emberek hely helyek'));
const groups = [
  ['forget','forgot','forgotten','forgetfulness','remember','remind','reminds','memory','feledekeny','feledekenyseg','elfelejt','elfelejtett','emlekezet'],
  ['unlock','unlocking','open','opening','locked','nyit','nyitas','kinyit','kinyitni','zar'],
  ['levitate','levitation','levitating','float','floating','lift','lebegtet','lebegtetes','lebeg','emel'],
  ['invisible','invisibility','unseen','hide','hiding','lathatatlan','lathatatlansag','elrejt'],
  ['immortal','immortality','halhatatlan','halhatatlansag'],
  ['teacher','teaches','teaching','professor','instructor','tanar','tanara','tanarno','professzor','oktato'],
  ['potions','potion','bajital','bajitalok','bajitaltan'],
  ['charms','charm','bubaj','bubajtan'],
  ['library','librarian','konyvtar','konyvtaros','konyvtarosno'],
  ['shop','shops','store','shopping','buy','buys','purchase','bolt','boltok','uzlet','vasarlas','bevasarlo'],
  ['broom','broomstick','brooms','sepru','seprunyel'],
  ['wish','wishes','desire','desires','vagy','vagyak','kivansag'],
  ['kill','kills','killing','death','deadly','murder','halal','halalos','ol','gyilkos'],
  ['bind','binding','immobilise','immobilize','paralysis','benitas','mozdulatlan'],
  ['fire','flame','flames','tuz','lang','langok','langocska'],
  ['gold','golden','arany'], ['blue','kek'], ['feather','toll'], ['club','bunko'],
  ['wand','wands','palca','varazspalca'], ['school','hogwarts','roxfort'],
];
const expansions = new Map(groups.flatMap(group => group.map(word => [word, group])));
function number(value, fallback, minimum = 0) {
  const n = value == null ? fallback : Number(value);
  if (!Number.isSafeInteger(n) || n < minimum) throw Error('Invalid numeric option');
  return n;
}
export function loadKnowledge(book = 'PS', directory = dataRoot) {
  if (book !== 'PS') throw Error(`Unsupported book knowledge: ${book}`);
  return Object.entries(categories).flatMap(([file,category]) => {
    const data = JSON.parse(fs.readFileSync(path.join(directory, book.toLowerCase(), `${file}.json`), 'utf8'));
    return data.entries.map(entry => ({...entry, category:entry.entityKind === 'animal' ? 'animal' : category}));
  });
}
function evidenceAnchors(entry) {
  return [...new Set([...(entry.evidence ?? []).map(e => e.anchor),
    ...(entry.termMentions ?? []).map(e => e.anchor), ...(entry.occurrences ?? []).map(e => e.anchor)])];
}
function rank(entry, query) {
  if (!query) return {score:0, matched:[]};
  const needle = fold(query);
  const names = [entry.id,entry.labelEn,entry.labelHu,...entry.aliases].map(fold);
  const exact = names.includes(needle);
  const fields = [
    {name:'name',words:new Set(names.flatMap(tokens)),weight:12},
    {name:'concept',words:new Set(entry.searchTerms.flatMap(tokens)),weight:7},
    {name:'description',words:new Set(tokens(entry.description)),weight:3},
    {name:'occurrence',words:new Set((entry.occurrences ?? []).flatMap(e => tokens(e.summary))),weight:2},
  ];
  const terms = [...new Set(tokens(query).filter(word => !stop.has(word)))];
  if (!exact && !terms.length) return null;
  let score = exact ? 1000 : names.some(name => name.includes(needle)) ? 100 : 0;
  const matched = [];
  for (const term of terms) {
    const variants = expansions.get(term) ?? [term];
    const field = fields.find(field => variants.some(word => field.words.has(word)));
    // Require all meaningful terms. A common word alone must not swamp a specific query.
    if (!field && !exact) return null;
    if (field) { score += field.weight; matched.push({queryTerm:term,field:field.name}); }
  }
  return {score,matched};
}
export function semanticSearch(options = {}, entries = loadKnowledge(options.book ?? 'PS')) {
  const book = options.book ?? 'PS';
  if (book !== 'PS') throw Error(`Unsupported book knowledge: ${book}`);
  if (options.id && options.query != null) throw Error('--id and --query cannot be combined');
  if (options.query != null && !options.query.trim()) throw Error('--query must not be empty');
  const intentWords = {object:['object','objects','targy','targyak'],spell:['spell','spells','varazslat','varazslatok'],person:['person','people','ember','emberek'],place:['place','places','hely','helyek']};
  const queryWords = tokens(options.query ?? '');
  const intents = Object.entries(intentWords).filter(([,words]) => words.some(word => queryWords.includes(word))).map(([category]) => category);
  if (!options.category && intents.length === 1) options = {...options,category:intents[0]};
  if (!options.category && intents.length === 0 && queryWords.includes('who')) options = {...options,category:'person'};
  if (!options.category && intents.length === 0 && queryWords.includes('where')) options = {...options,category:'place'};
  if (options.category && !['person','animal','place','object','spell'].includes(options.category)) throw Error(`Unknown semantic category: ${options.category}`);
  if (options.anchor && !/^PS(?:[1-9]|1[0-7])$/.test(options.anchor)) throw Error(`Invalid PS anchor: ${options.anchor}`);
  if (options['magic-status'] && !['demonstrated','ordinary','not-established'].includes(options['magic-status'])) throw Error('Invalid --magic-status');
  if (options['magic-status'] && options.category !== 'object') throw Error('--magic-status requires object category');
  if (options.kind && !entries.some(entry => (entry.entityKind ?? entry.placeKind ?? entry.objectKind ?? entry.kind) === options.kind)) throw Error(`Unknown entity kind: ${options.kind}`);
  const offset = number(options.offset,0), limit = number(options.limit,10,1);
  const ranked = entries.filter(entry => (!options.id || entry.id === options.id)
    && (!options.category || entry.category === options.category)
    && (!options.anchor || evidenceAnchors(entry).includes(options.anchor))
    && (!options.kind || (entry.entityKind ?? entry.placeKind ?? entry.objectKind ?? entry.kind) === options.kind)
    && (!options['magic-status'] || entry.magicStatus === options['magic-status']))
    .map(entry => ({entry,match:rank(entry,options.query)})).filter(item => item.match)
    .sort((a,b) => b.match.score-a.match.score || a.entry.id.localeCompare(b.entry.id,'en'));
  return {book, method:'curated aliases and bilingual concepts; deterministic ranking, no embeddings',
    total:ranked.length,offset,nextOffset:offset+limit<ranked.length?offset+limit:null,
    entries:ranked.slice(offset,offset+limit).map(({entry,match}) => ({...entry,retrieval:{...match,anchors:evidenceAnchors(entry)}}))};
}
