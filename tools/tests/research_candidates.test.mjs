import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { validateCandidate } from '../check_research_candidates.mjs';

const books = {
  enBooks: [{ code: 'PS', sha256: 'en-hash', chapters: [{ anchor: 'PS1', text: 'A wizard named Éva arrived.' }] }],
  huBooks: [{ code: 'PS', sha256: 'hu-hash', chapters: [{ anchor: 'PS1', text: 'ÉVA varázsló megérkezett.' }] }]
};
const candidate = (overrides = {}) => ({
  schemaVersion: 1, book: 'PS', anchor: 'PS1', sourceHashes: { en: 'en-hash', hu: 'hu-hash' },
  categories: Object.fromEntries(['characters', 'magic', 'terms', 'facts'].map(category => [category, { checkedEmpty: category !== 'characters', candidates: category === 'characters' ? [{ id: 'eva', chapter: 'PS1', category, locators: { en: 'éva', hu: 'éva' } }] : [] }])),
  ...overrides
});

test('candidate locators use NFKC and case-insensitive literal matching', () => assert.deepEqual(validateCandidate(candidate(), books), []));

test('reports source hash, dangling chapter, and per-language locator failures without excerpts', () => {
  const base = candidate();
  const bad = candidate({
    sourceHashes: { en: 'wrong', hu: 'hu-hash' },
    categories: {
      ...base.categories,
      characters: {
        checkedEmpty: false,
        candidates: [{ id: 'bad-id', chapter: 'PS9', category: 'characters', locators: { en: 'missing', hu: '' } }]
      }
    }
  });
  const failures = validateCandidate(bad, books);
  assert.deepEqual(failures.map(({ id, language, reason }) => ({ id, language, reason })), [
    { id: 'PS1', language: 'en', reason: 'source hash mismatch' },
    { id: 'bad-id', language: '-', reason: 'dangling chapter' }, { id: 'bad-id', language: 'en', reason: 'locator not found' }, { id: 'bad-id', language: 'hu', reason: 'missing locator' }
  ]);
  assert.ok(!JSON.stringify(failures).includes('wizard'));
});

test('reports missing chapters in either language', () => {
  const failures = validateCandidate(candidate({ anchor: 'PS10' }), books);
  assert.deepEqual(failures.filter(f => f.reason === 'missing chapter').map(f => f.language), ['en', 'hu']);
});

test('reports filename and envelope anchor mismatch', () => {
  const failures = validateCandidate(candidate(), { ...books, expectedAnchor: 'PS10' });
  assert.deepEqual(failures.filter(f => f.reason === 'file/envelope anchor mismatch'), [{ id: 'PS10', language: '-', reason: 'file/envelope anchor mismatch' }]);
});

test('CLI rejects a candidate directory with no matching files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hp-candidates-'));
  try {
    const result = spawnSync(process.execPath, [path.resolve('tools/check_research_candidates.mjs'), '--sources', 'original-sources', '--candidates', dir], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /no matching candidate files|failures=1/i);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
