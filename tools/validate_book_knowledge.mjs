import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'skills', 'harry-potter-fanfic', 'data');
const psAnchors = Array.from({length: 17}, (_, index) => `PS${index + 1}`);
const states = new Set(['not-started', 'partial', 'reviewed', 'independently-reviewed']);
const evidenceKinds = new Set(['event', 'testimony', 'interpretation']);
const identifier = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const fail = message => { throw Error(message); };
const check = (value, message) => { if (!value) fail(message); };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const isNfc = value => typeof value === 'string' && value === value.normalize('NFC');
function strings(value, label) { check(Array.isArray(value) && value.every(isNfc), `${label} must be NFC strings`); }
function evidence(items, label, characterIds) {
  check(Array.isArray(items) && items.length, `${label} evidence must be a non-empty array`);
  for (const item of items) {
    check(item && psAnchors.includes(item.anchor), `${label} evidence has invalid PS anchor`);
    check(evidenceKinds.has(item.kind), `${label} evidence has invalid kind`);
    for (const field of ['enLocator', 'huLocator', 'scope', 'status']) check(isNfc(item[field]) && item[field].trim(), `${label} evidence needs NFC ${field}`);
    check(item.status === 'paired-context-reviewed', `${label} evidence is not paired-context-reviewed`);
    if (item.speakerId != null) check(characterIds.has(item.speakerId), `${label} evidence references unknown speaker`);
  }
}
function envelope(data, name) { check(data?.schemaVersion === 1 && data.book === 'PS' && Array.isArray(data.entries), `${name} needs schemaVersion 1, book PS and entries`); }
export function validateBookKnowledge(base = ROOT) {
  const dataDir = path.join(base, 'skills', 'harry-potter-fanfic', 'data');
  const booksDir = path.join(dataDir, 'books', 'ps');
  const glossary = read(path.join(dataDir, 'hu-glossary.json'));
  const facts = read(path.join(dataDir, 'facts.json'));
  const characters = read(path.join(booksDir, 'characters.json'));
  const magic = read(path.join(booksDir, 'magic.json'));
  const coverage = read(path.join(booksDir, 'coverage.json'));
  envelope(characters, 'characters'); envelope(magic, 'magic');
  const glossaryIds = new Set(glossary.map(entry => entry.id)), factIds = new Set(facts.map(entry => entry.id));
  for (const entry of [...glossary, ...facts]) if (entry.evidence != null) evidence(entry.evidence, `Legacy ${entry.id}`, new Set());
  for (const entry of glossary) if (entry.bookUsage?.PS != null) { const usage = entry.bookUsage.PS; check(isNfc(usage.notes) && usage.notes.trim(), `Invalid PS glossary usage: ${entry.id}`); evidence(usage.evidence, `PS glossary usage ${entry.id}`, new Set()); }
  for (const entry of facts) if (entry.bookUsage?.PS != null) { const usage = entry.bookUsage.PS; check(isNfc(usage.claim) && usage.claim.trim() && isNfc(usage.limits) && usage.limits.trim(), `Invalid PS fact usage: ${entry.id}`); evidence(usage.evidence, `PS fact usage ${entry.id}`, new Set()); }
  const characterIds = new Set(characters.entries.map(entry => entry.id));
  check(characterIds.size === characters.entries.length, 'Duplicate character ID');
  for (const entry of characters.entries) {
    check(identifier(entry.id), 'Invalid character ID');
    check(entry.glossaryId == null || glossaryIds.has(entry.glossaryId), `Unknown character glossary ID: ${entry.id}`);
    check(['canonical-term', 'editorial-label'].includes(entry.labelKind), `Invalid character label kind: ${entry.id}`);
    check(entry.labelKind !== 'editorial-label' || entry.glossaryId == null, `Editorial character has glossary ID: ${entry.id}`);
    check(['human','ghost','portrait','animal','magical-being','group','unknown'].includes(entry.entityKind), `Invalid character entity kind: ${entry.id}`);
    check(isNfc(entry.labelEn) && isNfc(entry.labelHu) && isNfc(entry.limits), `Character requires NFC labels and limits: ${entry.id}`);
    check(Array.isArray(entry.presence) && entry.presence.length, `Character needs presence: ${entry.id}`);
    for (const presence of entry.presence) check(psAnchors.includes(presence.anchor) && ['appears','mentioned'].includes(presence.mode), `Invalid character presence: ${entry.id}`);
    strings(entry.factIds, `Character ${entry.id} factIds`); check(entry.factIds.every(id => factIds.has(id)), `Unknown character fact ID: ${entry.id}`);
    check(Array.isArray(entry.writingNotes), `Character writing notes must be array: ${entry.id}`);
    for (const note of entry.writingNotes) { check(isNfc(note.text) && evidenceKinds.has(note.kind), `Invalid character writing note: ${entry.id}`); strings(note.anchors, `Character ${entry.id} note anchors`); check(note.anchors.every(anchor => psAnchors.includes(anchor)), `Invalid character note anchor: ${entry.id}`); }
    evidence(entry.evidence, `Character ${entry.id}`, characterIds);
    check(entry.presence.every(presence => entry.evidence.some(item => item.anchor === presence.anchor)), `Character presence lacks evidence: ${entry.id}`);
  }
  const magicIds = new Set(magic.entries.map(entry => entry.id)); check(magicIds.size === magic.entries.length, 'Duplicate magic ID');
  for (const entry of magic.entries) {
    check(identifier(entry.id), 'Invalid magic ID');
    check(['spell','accidental','potion','enchanted-object','magical-effect','claimed-magic'].includes(entry.kind), `Invalid magic kind: ${entry.id}`);
    for (const field of ['nameGlossaryId','incantationGlossaryId']) check(entry[field] == null || glossaryIds.has(entry[field]), `Unknown magic glossary ID: ${entry.id}`);
    check(['canonical-term','editorial-label'].includes(entry.labelKind), `Invalid magic label kind: ${entry.id}`);
    check(entry.labelKind !== 'editorial-label' || (entry.nameGlossaryId == null && entry.incantationGlossaryId == null), `Editorial magic has glossary ID: ${entry.id}`);
    check(isNfc(entry.labelEn) && isNfc(entry.labelHu) && isNfc(entry.limits), `Magic requires NFC labels and limits: ${entry.id}`);
    strings(entry.factIds, `Magic ${entry.id} factIds`); check(entry.factIds.every(id => factIds.has(id)), `Unknown magic fact ID: ${entry.id}`);
    check(Array.isArray(entry.occurrences) && entry.occurrences.length, `Magic needs occurrences: ${entry.id}`);
    for (const occurrence of entry.occurrences) { check(psAnchors.includes(occurrence.anchor), `Invalid magic anchor: ${entry.id}`); check(['performed','practised','reported','explained','attempted'].includes(occurrence.mode), `Invalid magic mode: ${entry.id}`); check(['success','failure','uncertain','not-demonstrated'].includes(occurrence.outcome), `Invalid magic outcome: ${entry.id}`); strings(occurrence.practitionerIds, `Magic ${entry.id} practitionerIds`); strings(occurrence.targetIds, `Magic ${entry.id} targetIds`); check(occurrence.practitionerIds.every(id => characterIds.has(id)) && occurrence.targetIds.every(id => characterIds.has(id)), `Unknown magic actor ID: ${entry.id}`); check(isNfc(occurrence.summary) && occurrence.summary.trim(), `Magic summary must be NFC: ${entry.id}`); evidence(occurrence.evidence, `Magic ${entry.id}`, characterIds); check(occurrence.evidence.every(item => item.anchor === occurrence.anchor), `Magic occurrence evidence anchor mismatch: ${entry.id}`); }
  }
  check(coverage?.schemaVersion === 1 && coverage.book === 'PS' && coverage.policyVersion === 1, 'Invalid PS coverage envelope');
  check(Array.isArray(coverage.chapters) && coverage.chapters.length === 17 && new Set(coverage.chapters.map(c => c.anchor)).size === 17, 'Coverage needs 17 unique PS chapters');
  for (const chapter of coverage.chapters) check(psAnchors.includes(chapter.anchor) && states.has(chapter.en) && states.has(chapter.hu), `Invalid coverage state: ${chapter.anchor}`);
  for (const category of ['characters','magic','terms','facts']) check(Number.isInteger(coverage.categoryCounts?.[category]) && coverage.categoryCounts[category] >= 0, `Invalid coverage count: ${category}`);
  check(coverage.categoryCounts.characters === characters.entries.length && coverage.categoryCounts.magic === magic.entries.length, 'Coverage counts do not match accepted records');
  for (const disposition of ['pending','accepted','merged','excluded','unresolved']) check(Number.isInteger(coverage.candidateDisposition?.[disposition]) && coverage.candidateDisposition[disposition] >= 0, `Invalid candidate disposition: ${disposition}`);
  check(Array.isArray(coverage.limitations) && coverage.limitations.every(isNfc), 'Coverage limitations must be NFC strings');
  return {characters: characters.entries.length, magic: magic.entries.length, coverage: coverage.chapters.length};
}
export function validatePrivateProgress(file, candidatesDir) {
  const progress = read(file); check(progress?.schemaVersion === 1 && progress.book === 'PS', 'Invalid private progress envelope');
  check(progress.sourceHashes?.en && progress.sourceHashes?.hu, 'Private progress needs EN/HU source hashes');
  const chapters = Array.isArray(progress.chapters) ? progress.chapters : progress.chapter ? [progress.chapter] : progress.anchor && progress.languages ? [{ anchor: progress.anchor, ...progress.languages }] : [];
  check(chapters.length && chapters.length <= 17 && new Set(chapters.map(chapter => chapter.anchor)).size === chapters.length, 'Private progress needs one to 17 unique chapters');
  const chapterAnchors = new Set(chapters.map(chapter => chapter.anchor));
  const counts = Object.fromEntries(['pending','accepted','merged','excluded','unresolved'].map(key => [key, 0]));
  for (const chapter of chapters) for (const language of ['en','hu']) {
    const item = chapter[language]; check(psAnchors.includes(chapter.anchor) && item && Array.isArray(item.reviewedIntervals) && states.has(item.semanticStatus), `Invalid private chapter: ${chapter.anchor}/${language}`);
    let end = 0;
    for (const interval of item.reviewedIntervals) { check(Number.isInteger(interval.start) && Number.isInteger(interval.end) && Number.isInteger(interval.totalCharacters) && interval.start >= 0 && interval.end > interval.start && interval.end <= interval.totalCharacters, `Invalid interval: ${chapter.anchor}/${language}`); check(interval.sourceHash === progress.sourceHashes[language], `Stale interval hash: ${chapter.anchor}/${language}`); check(isNfc(interval.reader) && interval.reader.trim(), `Interval needs reader: ${chapter.anchor}/${language}`); check(interval.start <= end, `Gap in interval coverage: ${chapter.anchor}/${language}`); end = Math.max(end, interval.end); }
    if (['reviewed','independently-reviewed'].includes(item.semanticStatus)) check(item.reviewedIntervals.length && end === item.reviewedIntervals[0].totalCharacters, `Incomplete reviewed intervals: ${chapter.anchor}/${language}`);
  }
  const candidatePaths = !candidatesDir ? [] : fs.statSync(candidatesDir).isDirectory() ? fs.readdirSync(candidatesDir).filter(name => /^candidates-PS(?:[1-9]|1[0-7])\.local\.json$/.test(name)).map(name => path.join(candidatesDir, name)) : [candidatesDir];
  for (const candidatePath of candidatePaths) {
    const name = path.basename(candidatePath), candidateFile = read(candidatePath); check(candidateFile.schemaVersion === 1 && candidateFile.book === 'PS' && psAnchors.includes(candidateFile.anchor), `Invalid candidate file: ${name}`); if (!chapterAnchors.has(candidateFile.anchor)) continue; check(candidateFile.sourceHashes?.en === progress.sourceHashes.en && candidateFile.sourceHashes?.hu === progress.sourceHashes.hu, `Candidate source hash mismatch: ${name}`);
    for (const category of ['characters','magic','terms','facts']) { const group = candidateFile.categories?.[category]; check(group && typeof group.checkedEmpty === 'boolean' && Array.isArray(group.candidates), `Invalid candidate category: ${name}/${category}`); check(!group.checkedEmpty || group.candidates.length === 0, `Checked-empty candidate category has rows: ${name}/${category}`); for (const candidate of group.candidates) { check(identifier(candidate.id) && candidate.chapter === candidateFile.anchor && candidate.category === category, `Invalid candidate identity: ${name}`); check(['pending','accepted','merged','excluded','unresolved'].includes(candidate.disposition), `Invalid candidate disposition: ${candidate.id}`); check(candidate.locators?.en?.trim() && candidate.locators?.hu?.trim(), `Candidate needs paired locators: ${candidate.id}`); counts[candidate.disposition]++; } }
  }
  if (candidatesDir && progress.candidateDisposition) for (const [key, value] of Object.entries(counts)) check(progress.candidateDisposition[key] === value, `Candidate disposition reconciliation failed: ${key}`);
  return {chapters: chapters.length, candidates: counts};
}
function main(args) { const privateIndex = args.indexOf('--private-progress'), candidatesIndex = args.indexOf('--candidates'); const result = privateIndex >= 0 ? validatePrivateProgress(path.resolve(args[privateIndex + 1]), candidatesIndex >= 0 ? path.resolve(args[candidatesIndex + 1]) : undefined) : validateBookKnowledge(); console.log(`PASS: PS book knowledge valid (${JSON.stringify(result)}).`); }
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) { try { main(process.argv.slice(2)); } catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; } }
