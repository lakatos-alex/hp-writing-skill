#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalogue, search, sourceDirectory } from '../skills/harry-potter-fanfic/scripts/hp.mjs';

const CATEGORIES = ['characters', 'magic', 'terms', 'facts'];
const FILE_PATTERN = /^candidates-(PS\d+)\.local\.json$/;
function issue(id, language, reason) { return { id: id || '(file)', language: language || '-', reason }; }

/** Validate one private candidate envelope against already-loaded source books. */
export function validateCandidate(candidate, { enBooks = [], huBooks = [], expectedAnchor = null } = {}) {
  const failures = [];
  const add = (id, language, reason) => failures.push(issue(id, language, reason));
  const sourceBooks = { en: enBooks, hu: huBooks }, actual = {};
  for (const language of ['en', 'hu']) {
    actual[language] = sourceBooks[language].find(book => book.code === 'PS');
    if (!actual[language]) add('(source)', language, 'missing PS source');
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) { add('(file)', '-', 'invalid JSON object'); return failures; }
  const anchor = typeof candidate.anchor === 'string' ? candidate.anchor : '', envelopeId = anchor || '(file)';
  if (expectedAnchor && anchor !== expectedAnchor) add(expectedAnchor, '-', 'file/envelope anchor mismatch');
  if (candidate.schemaVersion !== 1) add(envelopeId, '-', 'invalid schemaVersion');
  if (candidate.book !== 'PS') add(envelopeId, '-', 'invalid book');
  if (!/^PS\d+$/.test(anchor)) add(envelopeId, '-', 'invalid anchor');
  if (!candidate.sourceHashes || typeof candidate.sourceHashes !== 'object') add(envelopeId, '-', 'missing sourceHashes');
  else for (const language of ['en', 'hu']) {
    if (typeof candidate.sourceHashes[language] !== 'string' || !candidate.sourceHashes[language]) add(envelopeId, language, 'missing source hash');
    else if (actual[language] && candidate.sourceHashes[language] !== actual[language].sha256) add(envelopeId, language, 'source hash mismatch');
  }
  const chapters = {};
  for (const language of ['en', 'hu']) {
    chapters[language] = actual[language]?.chapters.find(chapter => chapter.anchor === anchor);
    if (!chapters[language] && /^PS\d+$/.test(anchor)) add(envelopeId, language, 'missing chapter');
  }
  if (!candidate.categories || typeof candidate.categories !== 'object' || Array.isArray(candidate.categories)) { add(envelopeId, '-', 'missing categories'); return failures; }
  for (const category of CATEGORIES) {
    const group = candidate.categories[category];
    if (!group || typeof group !== 'object' || Array.isArray(group)) { add(envelopeId, '-', `missing category ${category}`); continue; }
    if (typeof group.checkedEmpty !== 'boolean' || !Array.isArray(group.candidates)) { add(envelopeId, '-', `invalid category ${category}`); continue; }
    if (group.checkedEmpty && group.candidates.length) add(envelopeId, '-', `${category} marked checkedEmpty with candidates`);
    for (const [index, item] of group.candidates.entries()) {
      const id = typeof item?.id === 'string' && item.id ? item.id : `${category}[${index}]`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) { add(id, '-', 'invalid candidate'); continue; }
      if (item.chapter !== anchor) add(id, '-', 'dangling chapter');
      if (item.category !== category) add(id, '-', 'category mismatch');
      const locators = item.locators;
      for (const language of ['en', 'hu']) {
        const locator = locators && typeof locators[language] === 'string' ? locators[language] : '';
        if (!locator.trim()) { add(id, language, 'missing locator'); continue; }
        if (!chapters[language]) continue;
        const result = search([{ code: 'PS', chapters: [chapters[language]] }], { anchor, query: locator, limit: 1, context: 0 });
        if (result.total === 0) add(id, language, 'locator not found');
      }
    }
  }
  return failures;
}

function parseArgs(args) {
  const options = {}, allowed = new Set(['sources', 'candidates', 'anchor']);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg.startsWith('--')) throw Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (!allowed.has(key)) throw Error(`Unknown option: --${key}`);
    const value = args[++i];
    if (value == null || value.startsWith('--')) throw Error(`Missing value for --${key}`);
    options[key] = value;
  }
  if (!options.sources) throw Error('--sources is required');
  if (!options.candidates) throw Error('--candidates is required');
  if (options.anchor && !/^PS\d+$/.test(options.anchor)) throw Error('--anchor must be PS followed by a chapter number');
  return options;
}

function run(options) {
  const failures = [], books = {};
  for (const language of ['en', 'hu']) {
    try { books[language] = loadCatalogue(sourceDirectory(path.resolve(options.sources), language)).books; }
    catch (error) { failures.push(issue('(source)', language, error.message)); books[language] = []; }
  }
  let files;
  try { files = fs.readdirSync(path.resolve(options.candidates)).filter(name => FILE_PATTERN.test(name)).sort(); }
  catch (error) { failures.push(issue('(candidates)', '-', error.message)); files = []; }
  if (options.anchor) {
    const expected = `candidates-${options.anchor}.local.json`;
    if (!files.includes(expected)) failures.push(issue(options.anchor, '-', 'candidate file missing'));
    files = files.filter(name => name === expected);
  }
  if (files.length === 0) failures.push(issue(options.anchor || '(candidates)', '-', 'no matching candidate files'));
  let candidateCount = 0;
  for (const file of files) {
    const match = file.match(FILE_PATTERN); let candidate;
    try { candidate = JSON.parse(fs.readFileSync(path.join(path.resolve(options.candidates), file), 'utf8')); }
    catch (error) { failures.push(issue(match?.[1] || file, '-', `invalid candidate file: ${error.message}`)); continue; }
    for (const group of Object.values(candidate?.categories ?? {})) candidateCount += Array.isArray(group?.candidates) ? group.candidates.length : 0;
    failures.push(...validateCandidate(candidate, { enBooks: books.en, huBooks: books.hu, expectedAnchor: match?.[1] }));
  }
  const ids = [...new Set(failures.map(f => `${f.id}/${f.language}`))].sort();
  console.log(`${failures.length ? 'FAIL' : 'PASS'}: files=${files.length} candidates=${candidateCount} failures=${failures.length}`);
  if (ids.length) console.log(`FAILED: ${ids.join(', ')}`);
  return failures.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = run(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }
}
