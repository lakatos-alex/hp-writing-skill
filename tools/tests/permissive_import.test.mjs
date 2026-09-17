import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { crc32, extractBook, importSources, loadCatalogue, parseTextBook } from '../../skills/harry-potter-fanfic/scripts/hp.mjs';

function zip(entries, method = 8) {
  const local = [], central = []; let offset = 0;
  for (const [name, text] of entries) {
    const nameBytes = Buffer.from(name), data = Buffer.from(text), packed = method === 8 ? deflateRawSync(data) : data;
    const l = Buffer.alloc(30), c = Buffer.alloc(46), crc = crc32(data);
    l.writeUInt32LE(0x04034b50); l.writeUInt16LE(method, 8); l.writeUInt32LE(crc, 14); l.writeUInt32LE(packed.length, 18); l.writeUInt32LE(data.length, 22); l.writeUInt16LE(nameBytes.length, 26);
    c.writeUInt32LE(0x02014b50); c.writeUInt16LE(method, 10); c.writeUInt32LE(crc, 16); c.writeUInt32LE(packed.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nameBytes.length, 28); c.writeUInt32LE(offset, 42);
    local.push(l, nameBytes, packed); central.push(c, nameBytes); offset += l.length + nameBytes.length + packed.length;
  }
  const directory = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

function temporary(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hp-permissive-'));
  try { return run(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

test('permissive mode imports non-standard EPUB with EPUB 3 Nav and fragment links', () => temporary(dir => {
  const docs = Array.from({ length: 18 }, (_, i) => [
    `section_${i + 1}.xhtml`,
    `<html><head><title>Chapter ${i + 1}</title></head><body><h2>Chapter ${i + 1}: The Chamber Mystery</h2><p>Original test paragraph with enough narrative text to pass extraction limits safely. ${'Magical narrative content '.repeat(10)}</p></body></html>`
  ]);
  const entries = [
    ['META-INF/container.xml', '<container><rootfiles><rootfile full-path="OEBPS/package.opf"/></rootfiles></container>'],
    ['OEBPS/package.opf', `<package><metadata><dc:title>Harry Potter and the Chamber of Secrets</dc:title><dc:language>en</dc:language></metadata><manifest><item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>${docs.map(([n], i) => `<item id="s${i + 1}" href="${n}"/>`).join('')}</manifest><spine>${docs.map((_, i) => `<itemref idref="s${i + 1}"/>`).join('')}</spine></package>`],
    ['OEBPS/nav.xhtml', `<html xmlns:epub="http://www.idpf.org/2007/ops"><nav epub:type="toc"><ol>${docs.map(([n], i) => `<li><a href="${n}#anchor_start">Chapter ${i + 1}: The Chamber Mystery</a></li>`).join('')}</ol></nav></html>`],
    ...docs.map(([n, html]) => [`OEBPS/${n}`, html])
  ];
  const file = path.join(dir, 'chamber.epub');
  fs.writeFileSync(file, zip(entries));

  // Permissive extraction succeeds and detects CoS (Book 2, 18 chapters)
  const book = extractBook(file, { permissive: true });
  assert.equal(book.code, 'CoS');
  assert.equal(book.chapters.length, 18);
  assert.equal(book.chapters[0].anchor, 'CoS1');
  assert.equal(book.chapters[17].anchor, 'CoS18');
  assert.match(book.chapters[0].title, /The Chamber Mystery/);

  // Full importSources in permissive mode records the book in catalogue.local.json
  importSources(dir, 'en', { strict: false });
  const cat = loadCatalogue(dir);
  assert.equal(cat.books.length, 1);
  assert.equal(cat.books[0].code, 'CoS');
  assert.equal(cat.books[0].chapters.length, 18);
}));

test('strict mode rejects non-conforming edition while permissive mode issues warnings', () => temporary(dir => {
  // 1. Synthetic Book 1 (PS) with 18 chapters using Pottermore naming (extra preview chapter)
  const docs = Array.from({ length: 18 }, (_, i) => [
    `hp01_ch${String(i + 1).padStart(3, '0')}_test.xhtml`,
    `<html><body><h1>Chapter ${i + 1}: Test</h1><p>${'Sample text content for chapter validation. '.repeat(10)}</p></body></html>`
  ]);
  const entries = [
    ['META-INF/container.xml', '<container><rootfiles><rootfile full-path="content.opf"/></rootfiles></container>'],
    ['content.opf', `<package><metadata><dc:title>Harry Potter and the Philosopher's Stone</dc:title><dc:language>en</dc:language></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>${docs.map(([n], i) => `<item id="c${i + 1}" href="${n}"/>`).join('')}</manifest><spine>${docs.map((_, i) => `<itemref idref="c${i + 1}"/>`).join('')}</spine></package>`],
    ['toc.ncx', `<ncx><navMap>${docs.map(([n], i) => `<navPoint><navLabel><text>Chapter ${i + 1}</text></navLabel><content src="${n}"/></navPoint>`).join('')}</navMap></ncx>`],
    ...docs
  ];
  const file = path.join(dir, 'ps_with_preview.epub');
  fs.writeFileSync(file, zip(entries));

  // In strict mode: throws due to chapter count mismatch (expected 17, got 18)
  assert.throws(() => extractBook(file, { strict: true }), /Missing, duplicate, or out-of-order chapters/);

  // In permissive mode: succeeds with warning recorded
  const permissiveBook = extractBook(file, { permissive: true });
  assert.equal(permissiveBook.code, 'PS');
  assert.equal(permissiveBook.chapters.length, 18);
  assert.ok(permissiveBook.conversion?.warnings?.some(w => w.includes('mismatch for PS')));

  // 2. Arbitrary edition layout is rejected by strict mode, but accepted by permissive mode
  const arbDocs = Array.from({ length: 17 }, (_, i) => [
    `chapter_${i + 1}.xhtml`,
    `<html><body><h1>Chapter ${i + 1}</h1><p>${'Sample text content for chapter validation. '.repeat(10)}</p></body></html>`
  ]);
  const arbEntries = [
    ['META-INF/container.xml', '<container><rootfiles><rootfile full-path="content.opf"/></rootfiles></container>'],
    ['content.opf', `<package><metadata><dc:title>Harry Potter and the Philosopher's Stone</dc:title><dc:language>en</dc:language></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>${arbDocs.map(([n], i) => `<item id="c${i + 1}" href="${n}"/>`).join('')}</manifest><spine>${arbDocs.map((_, i) => `<itemref idref="c${i + 1}"/>`).join('')}</spine></package>`],
    ['toc.ncx', `<ncx><navMap>${arbDocs.map(([n], i) => `<navPoint><navLabel><text>Chapter ${i + 1}</text></navLabel><content src="${n}"/></navPoint>`).join('')}</navMap></ncx>`],
    ...arbDocs
  ];
  const arbFile = path.join(dir, 'arbitrary.epub');
  fs.writeFileSync(arbFile, zip(arbEntries));
  assert.throws(() => extractBook(arbFile, { strict: true }), /Unsupported edition/);
  const arbBook = extractBook(arbFile, { permissive: true });
  assert.equal(arbBook.code, 'PS');
  assert.equal(arbBook.chapters.length, 17);
}));

test('direct text novel import splits chapters and builds catalogue', () => temporary(dir => {
  const textContent = `# Harry Potter and the Philosopher's Stone

## Chapter 1: The Boy Who Lived
Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much. They were the last people you'd expect to be involved in anything strange or mysterious.

## Chapter 2: The Vanishing Glass
Nearly ten years had passed since the Dursleys had woken up to find their nephew on the front step, but Privet Drive had hardly changed at all. The sun rose on the same tidy front gardens.

## Chapter 3: The Letters from No One
The escape of the Brazilian boa constrictor earned Harry his longest-ever punishment. By the time he was allowed out of his cupboard, the summer holidays had started and Dudley had already broken his new video camera.
`;
  const textFile = path.join(dir, '01-philosophers-stone.txt');
  fs.writeFileSync(textFile, textContent, 'utf8');

  const book = parseTextBook(textFile, textContent);
  assert.equal(book.code, 'PS');
  assert.equal(book.chapters.length, 3);
  assert.equal(book.chapters[0].anchor, 'PS1');
  assert.equal(book.chapters[0].title, 'The Boy Who Lived');
  assert.match(book.chapters[0].text, /Mr\. and Mrs\. Dursley/);
  assert.equal(book.chapters[1].anchor, 'PS2');
  assert.equal(book.chapters[1].title, 'The Vanishing Glass');

  // importSources handles text file directly
  importSources(dir, 'en');
  const cat = loadCatalogue(dir);
  assert.equal(cat.books.length, 1);
  assert.equal(cat.books[0].code, 'PS');
  assert.equal(cat.books[0].chapters.length, 3);
}));

test('Hungarian text novel import correctly detects language and chapters', () => temporary(dir => {
  const huContent = `# Harry Potter és a Titkok Kamrája

## 1. fejezet: A legrosszabb születésnap
A Privet Drive négy szám alatt nem először robbant ki veszekedés a reggeli órákban. Vernon bácsit kora hajnalban egy harsány huhogás ébresztette fel.

## 2. fejezet: Dobby figyelmeztetése
Harry némán állt az íróasztala mellett, és a kicsi lényre meredt, aki ott gubbasztott a nyikorgó ágy szélén.
`;
  const textFile = path.join(dir, '02-chamber-of-secrets.md');
  fs.writeFileSync(textFile, huContent, 'utf8');

  const book = parseTextBook(textFile, huContent);
  assert.equal(book.code, 'CoS');
  assert.equal(book.language, 'hu');
  assert.equal(book.chapters.length, 2);
  assert.equal(book.chapters[0].anchor, 'CoS1');
  assert.equal(book.chapters[0].title, 'A legrosszabb születésnap');
  assert.equal(book.chapters[1].anchor, 'CoS2');
  assert.equal(book.chapters[1].title, 'Dobby figyelmeztetése');
}));
