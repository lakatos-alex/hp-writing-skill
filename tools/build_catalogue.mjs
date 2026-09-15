import fs from 'node:fs';
import path from 'node:path';
import { root, loadCatalogue } from '../skills/harry-potter-fanfic/scripts/hp.mjs';
const sourceDir = path.resolve(process.argv[2] ?? 'original-sources');
const { books } = loadCatalogue(sourceDir);
const topics = JSON.parse(fs.readFileSync(path.join(root, 'data/topics.json'), 'utf8'));
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const chapters = books.flatMap(b => b.chapters.map(c => {
  const topicCounts = Object.fromEntries(Object.entries(topics).map(([key, terms]) => [key, terms.reduce((sum, term) => sum + [...c.text.matchAll(new RegExp('(?<![\\p{L}\\p{N}])' + escape(term) + '(?![\\p{L}\\p{N}])', 'giu'))].length, 0)]).filter(([,n]) => n));
  return { anchor: c.anchor, book: b.code, number: c.number, title: c.title, words: c.words, topicCounts };
}));
fs.writeFileSync(path.join(root, 'data/chapters.json'), JSON.stringify(chapters, null, 2) + '\n');
const coverage = { schemaVersion: 1, edition: 'English Pottermore EPUBs supplied by the maintainer', measuredAt: new Date().toISOString().slice(0, 10),
  method: 'Every primary narrative chapter in EPUB spine order, including DH epilogue; front matter, advertisements and next-book previews excluded. Topics are lexical counts, not semantic verification.',
  books: books.map(b => ({code:b.code, title:b.title, language:b.language, sourceSha256:b.sha256, chapters:b.chapters.length, words:b.chapters.reduce((n,c)=>n+c.words,0), excludedEntries:b.excluded.length})) };
fs.writeFileSync(path.join(root, 'data/source-coverage.json'), JSON.stringify(coverage, null, 2) + '\n');
console.log(`Generated ${chapters.length} chapter records across ${books.length} books; no source passages copied.`);
