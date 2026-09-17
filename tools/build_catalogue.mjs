import fs from 'node:fs';
import path from 'node:path';
import { root, loadCatalogue, sourceDirectory } from '../skills/harry-potter-fanfic/scripts/hp.mjs';
const sourceDir = path.resolve(process.argv[2] ?? 'original-sources');
const { books } = loadCatalogue(sourceDirectory(sourceDir, 'en'));
if (books.some(b => !b.language.startsWith('en'))) throw Error('English source catalogue required');
const topics = JSON.parse(fs.readFileSync(path.join(root, 'data/topics.json'), 'utf8'));
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const chapters = books.flatMap(b => b.chapters.map(c => {
  const topicCounts = Object.fromEntries(Object.entries(topics).map(([key, terms]) => [key, terms.reduce((sum, term) => sum + [...c.text.matchAll(new RegExp('(?<![\\p{L}\\p{N}])' + escape(term) + '(?![\\p{L}\\p{N}])', 'giu'))].length, 0)]).filter(([,n]) => n));
  return { anchor: c.anchor, book: b.code, number: c.number, title: c.title, words: c.words, topicCounts };
}));
fs.writeFileSync(path.join(root, 'data/chapters.json'), JSON.stringify(chapters, null, 2) + '\n');
const coverage = { schemaVersion: 2, edition: 'English Pottermore EPUB chapter layout', measuredAt: new Date().toISOString().slice(0, 10),
  method: 'Every primary narrative chapter in EPUB spine order, including DH epilogue; front matter, advertisements and next-book previews excluded. Topics are lexical counts, not semantic verification.',
  books: books.map(b => ({code:b.code, title:b.title, language:b.language, sourceSha256:b.sha256, chapters:b.chapters.length, words:b.chapters.reduce((n,c)=>n+c.words,0), excludedEntries:b.excluded.length})) };
fs.writeFileSync(path.join(root, 'data/source-coverage.json'), JSON.stringify(coverage, null, 2) + '\n');
console.log(`Generated ${chapters.length} chapter records across ${books.length} books; no source passages copied.`);
const huDir = path.join(sourceDir, 'hu');
if (fs.existsSync(path.join(huDir, 'catalogue.local.json'))) {
  const hu = loadCatalogue(huDir).books;
  if (hu.some(b => b.language !== 'hu')) throw Error('Hungarian catalogue language mismatch');
  const translated = hu.flatMap(b => b.chapters.map(c => {
    const paired = chapters.find(p => p.anchor === c.anchor);
    if (!paired) throw Error(`Unaligned chapter ${c.anchor}`);
    return { anchor:c.anchor, book:b.code, number:c.number, title:c.title, words:c.words, topicCounts:paired.topicCounts, topicBasis:'aligned English lexical counts', ...(b.conversion ? {sourceQuality:'degraded PDF transcription; titles are not authoritative spellings'} : {}) };
  }));
  fs.writeFileSync(path.join(root, 'data/chapters-hu.json'), JSON.stringify(translated, null, 2) + '\n');
  const huCoverage = { schemaVersion:1, language:'hu', measuredAt:coverage.measuredAt,
    method:'NCX/spine chapter alignment for EPUB; page-aware extraction for PDF. Titles retain edition spelling. English topic ranks are chapter-alignment hints, not Hungarian lexical measurements.',
    books: hu.map(b => ({ code:b.code, title:b.title, language:b.language, sourceSha256:b.sha256, format:path.extname(b.source).slice(1), chapters:b.chapters.length, words:b.chapters.reduce((n,c)=>n+c.words,0), excludedEntries:b.excluded.length,
      conversion:b.conversion ? {method:'Page-aware PDF text-layer extraction',pages:b.conversion.pdf_pages,paragraphs:'heuristic',editorialQuality:'source defects retained; not a reliable Hungarian prose or terminology standard',warnings:b.conversion.warnings,independentPagesCompared:b.conversion.verification.independent_extraction?.pages_compared ?? 0} : {method:'EPUB NCX and consecutive spine chapters'} })) };
  fs.writeFileSync(path.join(root, 'data/source-coverage-hu.json'), JSON.stringify(huCoverage, null, 2) + '\n');
  console.log(`Generated ${translated.length} Hungarian chapter records; alignment is chapter-level, not sentence-level.`);
}
