#!/usr/bin/env node
/** Local source retrieval; no network, dependencies, or model calls. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const codes = ['PS', 'CoS', 'PoA', 'GoF', 'OotP', 'HBP', 'DH'];
const counts = [17, 18, 22, 37, 38, 30, 37];
const enTitles = [
  { num: 1, text: "philosopher's stone" },
  { num: 1, text: "sorcerer's stone" },
  { num: 2, text: "chamber of secrets" },
  { num: 3, text: "prisoner of azkaban" },
  { num: 4, text: "goblet of fire" },
  { num: 5, text: "order of the phoenix" },
  { num: 6, text: "half-blood prince" },
  { num: 7, text: "deathly hallows" }
];
const huTitles = [
  { num: 1, text: 'bölcsek köve' },
  { num: 2, text: 'titkok kamrája' },
  { num: 3, text: 'azkabani fogoly' },
  { num: 4, text: 'tűz serlege' },
  { num: 5, text: 'főnix rendje' },
  { num: 6, text: 'félvér herceg' },
  { num: 7, text: 'halál ereklyéi' }
];
export const hash = s => createHash('sha256').update(s).digest('hex');
export function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) { crc ^= byte; for (let n = 0; n < 8; n++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); }
  return (crc ^ 0xffffffff) >>> 0;
}
const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', copy: '©' };
export function decode(s) {
  return s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (all, e) => {
    if (!e.startsWith('#')) return entities[e] ?? all;
    const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : Number(e.slice(1));
    if (!Number.isInteger(n) || n > 0x10ffff || n < 0 || (n >= 0xd800 && n <= 0xdfff)) throw Error('Invalid character entity');
    return String.fromCodePoint(n);
  });
}
export function plain(html) {
  return decode(html.replace(/<!--[^]*?-->/g, '').replace(/<(head|script|style|svg)\b[^]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ')).replace(/[\s\u00a0]+/g, ' ').trim();
}
export function markdown(html) {
  let s = html.replace(/\r\n?/g, '\n').replace(/<!--[^]*?-->/g, '').replace(/<(head|script|style|svg)\b[^]*?<\/\1>/gi, '')
    .replace(/<h([1-6])\b[^>]*>([^]*?)<\/h\1>/gi, (_, n, t) => `\n\n${'#'.repeat(Math.min(6, Number(n) + 1))} ${plain(t)}\n\n`)
    .replace(/<(i|em)\b[^>]*>([^]*?)<\/\1>/gi, (_, tag, t) => plain(t) ? `*${plain(t)}*` : '')
    .replace(/<(b|strong)\b[^>]*>([^]*?)<\/\1>/gi, (_, tag, t) => plain(t) ? `**${plain(t)}**` : '')
    .replace(/<li\b[^>]*>/gi, '\n- ').replace(/<br\b[^>]*>/gi, '\n')
    .replace(/<\/(p|div|section|article|blockquote|li|tr)>/gi, '\n\n').replace(/<[^>]*>/g, '');
  s = decode(s).replace(/\u00a0/g, ' ').replace(/[\t ]+/g, ' ').replace(/^ +| +$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
  if (/\ufffd|&(?:#\w+|\w+);/.test(s)) throw Error('Unresolved character encoding or entity');
  return s;
}
function attrs(s) { return Object.fromEntries([...s.matchAll(/([\w:.-]+)\s*=\s*(["'])([^]*?)\2/g)].map(m => [m[1], decode(m[3])])); }
/** Reads stored/deflate ZIP entries in memory; never extracts paths. */
export function unzip(buf) {
  let end = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50 && i + 22 + buf.readUInt16LE(i + 20) === buf.length) { end = i; break; }
  }
  if (end < 0) throw Error('Invalid ZIP end record');
  if (buf.readUInt16LE(end + 4) || buf.readUInt16LE(end + 6)) throw Error('Multi-disk ZIP unsupported');
  let pos = buf.readUInt32LE(end + 16), total = 0;
  const entries = new Map();
  for (let n = 0; n < buf.readUInt16LE(end + 10); n++) {
    if (buf.readUInt32LE(pos) !== 0x02014b50) throw Error('Invalid ZIP directory');
    const flags = buf.readUInt16LE(pos + 8), method = buf.readUInt16LE(pos + 10);
    const size = buf.readUInt32LE(pos + 20), expanded = buf.readUInt32LE(pos + 24);
    const nameLen = buf.readUInt16LE(pos + 28), extra = buf.readUInt16LE(pos + 30), comment = buf.readUInt16LE(pos + 32);
    const local = buf.readUInt32LE(pos + 42), name = buf.subarray(pos + 46, pos + 46 + nameLen).toString('utf8');
    if (flags & 1) throw Error('Encrypted ZIP entry unsupported');
    if (name.startsWith('/') || name.includes('\\') || name.split('/').includes('..') || entries.has(name)) throw Error('Unsafe or duplicate ZIP path');
    total += expanded;
    if (expanded > 32 * 1024 * 1024 || total > 256 * 1024 * 1024) throw Error('EPUB exceeds extraction limits');
    if (buf.readUInt32LE(local) !== 0x04034b50) throw Error('Invalid local ZIP entry');
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    if (start + size > buf.length) throw Error('Truncated ZIP entry');
    const packed = buf.subarray(start, start + size);
    const data = method === 0 ? packed : method === 8 ? inflateRawSync(packed, { maxOutputLength: 32 * 1024 * 1024 }) : null;
    if (!data || data.length !== expanded || crc32(data) !== buf.readUInt32LE(pos + 16)) throw Error('Unsupported or damaged ZIP entry');
    entries.set(name, data); pos += 46 + nameLen + extra + comment;
  }
  return entries;
}
export function extractBook(file, options = {}) {
  const strict = options.strict ?? (!options.permissive);
  const bytes = fs.readFileSync(file), zip = unzip(bytes);
  const get = name => { const b = zip.get(name); if (!b) throw Error(`Missing EPUB entry: ${name}`); return b.toString('utf8'); };
  const opfName = attrs(get('META-INF/container.xml').match(/<rootfile\b[^>]*>/)?.[0] ?? '')['full-path'];
  if (!opfName) throw Error('EPUB package path missing');
  const opf = get(opfName), base = path.posix.dirname(opfName);
  const manifest = new Map([...opf.matchAll(/<item\b[^>]*>/g)].map(m => { const a = attrs(m[0]); return [a.id, a]; }));
  const spine = [...opf.matchAll(/<itemref\b[^>]*>/g)].map(m => attrs(m[0]).idref);
  const title = plain(opf.match(/<(?:\w+:)?title\b[^>]*>([^]*?)<\/(?:\w+:)?title>/)?.[1] ?? '');
  const language = plain(opf.match(/<(?:\w+:)?language\b[^>]*>([^]*?)<\/(?:\w+:)?language>/)?.[1] ?? 'unspecified');
  const documents = spine.map(id => {
    const item = manifest.get(id); if (!item) throw Error(`Missing spine manifest id: ${id}`);
    const name = path.posix.normalize(path.posix.join(base, decodeURIComponent(item.href.split('#')[0])));
    return { name, html: get(name) };
  });

  let detectedBookNumber = 0;
  for (const doc of documents) {
    const m = doc.name.match(/hp(\d{2})_ch(\d{3})_/i);
    if (m) { detectedBookNumber = Number(m[1]); break; }
  }
  if (!detectedBookNumber) {
    const tLow = (title || '').toLowerCase();
    const eMatch = enTitles.find(t => tLow.includes(t.text));
    if (eMatch) detectedBookNumber = eMatch.num;
    else {
      const hMatch = huTitles.find(t => tLow.includes(t.text));
      if (hMatch) detectedBookNumber = hMatch.num;
    }
  }
  if (!detectedBookNumber) {
    const fLow = path.basename(file).toLowerCase();
    const mCode = fLow.match(/\b(ps|cos|poa|gof|ootp|hbp|dh)\b/i);
    if (mCode) detectedBookNumber = codes.indexOf(mCode[1].toUpperCase()) + 1;
    else {
      const mNum = fLow.match(/(?:^|[^\d])0?([1-7])(?:[^\d]|$)/);
      if (mNum) detectedBookNumber = Number(mNum[1]);
    }
  }

  // Strategy 1: Pottermore layout
  const grouped = new Map();
  for (const doc of documents) {
    const m = doc.name.match(/hp(\d{2})_ch(\d{3})_/i);
    if (m) { const key = Number(m[1]); if (!grouped.has(key)) grouped.set(key, []); grouped.get(key).push({ ...doc, number: Number(m[2]) }); }
  }
  let winner = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)[0];

  // Strategy 2: Documented Hungarian NCX layout
  if (!winner && /^hu(?:-|$)/i.test(language)) {
    const bookNumber = detectedBookNumber || (huTitles.find(t => title.toLocaleLowerCase('hu').includes(t.text))?.num || 0);
    const ncx = [...manifest.values()].find(item => item['media-type'] === 'application/x-dtbncx+xml');
    if (bookNumber && ncx) {
      const ncxName = path.posix.normalize(path.posix.join(base, ncx.href));
      const nav = [...get(ncxName).matchAll(/<navPoint\b[^]*?<\/navPoint>/g)].map(m => ({
        label: plain(m[0].match(/<navLabel\b[^>]*>([^]*?)<\/navLabel>/)?.[1] ?? ''),
        href: attrs(m[0].match(/<content\b[^>]*>/)?.[0] ?? '').src
      }));
      const isValidStrict = nav.length === counts[bookNumber - 1] && !nav.some(n => !n.href || n.href.includes('#') || !/fejezet /i.test(n.label));
      if (strict && !isValidStrict) throw Error('Unsupported Hungarian chapter navigation; no guessed boundaries');
      if (isValidStrict) {
        const raw = nav.map((n, i) => {
          const name = path.posix.normalize(path.posix.join(path.posix.dirname(ncxName), decodeURIComponent(n.href)));
          const doc = documents.find(d => d.name === name);
          if (!doc) throw Error(`Chapter missing from spine: ${name}`);
          const heading = plain(doc.html.match(/<h1\b[^>]*>([^]*?)<\/h1>/i)?.[1] ?? '');
          if (heading !== n.label) throw Error(`Navigation/title mismatch: ${name}`);
          return { ...doc, number: i + 1 };
        });
        const positions = raw.map(c => documents.findIndex(d => d.name === c.name));
        if (positions.some((p, i) => i > 0 && p !== positions[i - 1] + 1)) throw Error('Duplicate, split or out-of-order Hungarian chapters');
        winner = [bookNumber, raw];
      }
    } else if (strict) {
      throw Error('Unsupported Hungarian edition: missing recognised title or NCX');
    }
  }

  // Strategy 3: Permissive Navigation Fallback (NCX with fragments, EPUB 3 Nav, or generic chapter spine)
  if (!winner && !strict) {
    const bookNumber = detectedBookNumber || 1;
    const ncx = [...manifest.values()].find(item => item['media-type'] === 'application/x-dtbncx+xml');
    if (ncx) {
      const ncxName = path.posix.normalize(path.posix.join(base, ncx.href));
      const nav = [...get(ncxName).matchAll(/<navPoint\b[^]*?<\/navPoint>/g)].map(m => ({
        label: plain(m[0].match(/<navLabel\b[^>]*>([^]*?)<\/navLabel>/)?.[1] ?? ''),
        href: attrs(m[0].match(/<content\b[^>]*>/)?.[0] ?? '').src
      })).filter(n => n.href && !/^(?:cover|title|copyright|dedication|contents|toc|tartalom|imprint|kolofon)/i.test(n.label.trim()));
      const raw = [];
      for (const n of nav) {
        const cleanHref = decodeURIComponent(n.href.split('#')[0]);
        const name = path.posix.normalize(path.posix.join(path.posix.dirname(ncxName), cleanHref));
        const doc = documents.find(d => d.name === name);
        if (doc && !raw.some(r => r.name === doc.name)) {
          raw.push({ ...doc, number: raw.length + 1, navLabel: n.label });
        }
      }
      if (raw.length >= 3) winner = [bookNumber, raw];
    }
    if (!winner) {
      const navItem = [...manifest.values()].find(item => (item.properties || '').includes('nav') || /nav\.xhtml$/i.test(item.href));
      if (navItem) {
        const navName = path.posix.normalize(path.posix.join(base, navItem.href));
        const navHtml = get(navName);
        const links = [...navHtml.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi)].map(m => ({
          href: m[1],
          label: plain(m[2])
        })).filter(n => !/^(?:cover|title|copyright|dedication|contents|toc|tartalom|imprint|kolofon)/i.test(n.label.trim()));
        const raw = [];
        for (const l of links) {
          const cleanHref = decodeURIComponent(l.href.split('#')[0]);
          const name = path.posix.normalize(path.posix.join(path.posix.dirname(navName), cleanHref));
          const doc = documents.find(d => d.name === name);
          if (doc && !raw.some(r => r.name === doc.name)) {
            raw.push({ ...doc, number: raw.length + 1, navLabel: l.label });
          }
        }
        if (raw.length >= 3) winner = [bookNumber, raw];
      }
    }
    if (!winner) {
      const raw = [];
      for (const doc of documents) {
        const text = plain(doc.html);
        if (text.length > 400 && !/^(?:cover|title page|copyright|dedication|table of contents|contents|tartalomjegyzék)/i.test(text.slice(0, 120).trim())) {
          raw.push({ ...doc, number: raw.length + 1 });
        }
      }
      if (raw.length >= 3) winner = [bookNumber, raw];
    }
  }

  if (!winner) throw Error('Unsupported edition: expected Pottermore chapter filenames or documented Hungarian NCX layout');
  const [bookNumber, raw] = winner, code = codes[bookNumber - 1];
  const expectedCount = counts[bookNumber - 1];
  const warnings = [];

  if (!code || raw.length !== expectedCount || raw.some((c, i) => c.number !== i + 1)) {
    if (strict) throw Error(`Missing, duplicate, or out-of-order chapters in ${file}`);
    warnings.push(`Chapter count mismatch for ${code}: expected ${expectedCount}, found ${raw.length}`);
  }

  const chapters = raw.map((c, idx) => {
    const num = idx + 1;
    let heading = plain(c.html.match(/<h[1-3]\b[^>]*>([^]*?)<\/h[1-3]>/i)?.[1] ?? '');
    let titleText = (heading || c.navLabel || `Chapter ${num}`).replace(/^\S+ fejezet\s+/i, '').replace(/^Chapter\s+\d+[:–-]?\s*/i, '').trim();
    if (!titleText) titleText = `Chapter ${num}`;
    const text = markdown(c.html.replace(/<h[1-6]\b[^>]*>[^]*?<\/h[1-6]>/gi, ''));
    if (text.length < 50 && strict) throw Error(`Empty chapter: ${c.name}`);
    const anchor = code === 'DH' && num === 37 ? 'DH-epilogue' : (num > expectedCount ? `${code}-extra${num - expectedCount}` : `${code}${num}`);
    return { anchor, number: num, title: titleText, entry: c.name, words: text.split(/\s+/u).length, sha256: hash(text), text };
  });

  return { code, title, language, source: path.basename(file), sha256: hash(bytes), chapters,
    excluded: documents.filter(d => !raw.some(c => c.name === d.name)).map(d => d.name),
    ...(warnings.length ? { conversion: { warnings } } : {}) };
}
export function parseTextBook(file, content, options = {}) {
  const strict = !!options.strict;
  const basename = path.basename(file);
  const tLow = (basename + '\n' + content.slice(0, 500)).toLowerCase();

  let bookNumber = 0;
  const eMatch = enTitles.find(t => tLow.includes(t.text));
  if (eMatch) bookNumber = eMatch.num;
  else {
    const hMatch = huTitles.find(t => tLow.includes(t.text));
    if (hMatch) bookNumber = hMatch.num;
  }
  if (!bookNumber) {
    const mCode = basename.match(/\b(ps|cos|poa|gof|ootp|hbp|dh)\b/i);
    if (mCode) bookNumber = codes.indexOf(mCode[1].toUpperCase()) + 1;
    else {
      const mNum = basename.match(/(?:^|[^\d])0?([1-7])(?:[^\d]|$)/);
      if (mNum) bookNumber = Number(mNum[1]);
    }
  }
  if (!bookNumber) bookNumber = 1;
  const code = codes[bookNumber - 1];
  const expectedCount = counts[bookNumber - 1];

  let title = basename.replace(/\.(txt|md)$/i, '');
  let body = content;
  const lines = content.split(/\r?\n/);
  if (lines[0].startsWith('# ')) {
    title = lines[0].slice(2).trim();
    body = content.slice(lines[0].length).trim();
  }

  const regex = /(?:^|\r?\n)(?=(?:#{1,3}\s+(?:[^\r\n]+)|\b(?:Chapter\s+[0-9IVXLCDM]+|[0-9]+\.\s*fejezet|Fejezet\s+[0-9IVXLCDM]+)\b))/gi;
  const rawParts = body.split(regex).map(p => p.trim()).filter(p => p.length > 50);
  const chHeadingPattern = /^(?:#{1,3}\s+|(?:\bChapter\s+[0-9IVXLCDM]+|[0-9]+\.\s*fejezet|Fejezet\s+[0-9IVXLCDM]+)\b)/i;
  const parts = rawParts.filter(p => chHeadingPattern.test(p));

  const warnings = [];
  if (parts.length !== expectedCount) {
    if (strict) throw Error(`Text chapter count mismatch for ${code}: expected ${expectedCount}, found ${parts.length}`);
    warnings.push(`Chapter count mismatch for ${code}: expected ${expectedCount}, found ${parts.length}`);
  }

  const chapters = parts.map((part, i) => {
    const num = i + 1;
    const firstLine = part.split(/\r?\n/)[0].replace(/^#+\s*/, '').trim();
    const anchor = code === 'DH' && num === 37 ? 'DH-epilogue' : (num > expectedCount ? `${code}-extra${num - expectedCount}` : `${code}${num}`);
    let chTitle = firstLine.replace(/^(?:chapter\s+\d+|[0-9]+\.\s*fejezet|fejezet\s+\d+)\s*[:–-]?\s*/i, '').trim();
    if (!chTitle) chTitle = `Chapter ${num}`;
    const nlIdx = part.search(/\r?\n/);
    const rest = nlIdx >= 0 ? part.slice(nlIdx).trim() : '';
    const text = rest.length > 0 ? rest : part;
    return {
      anchor,
      number: num,
      title: chTitle,
      entry: `${basename}#part${num}`,
      words: text.split(/\s+/u).length,
      sha256: hash(text),
      text
    };
  });

  const isHu = /[áéíóöőúüű]/i.test(content) && /\b(?:hogy|nem|volt|egy|és|meg)\b/i.test(content);
  const language = isHu ? 'hu' : 'en';

  return {
    code,
    title,
    language,
    source: basename,
    sha256: hash(Buffer.from(content, 'utf8')),
    chapters,
    excluded: [],
    ...(warnings.length ? { conversion: { warnings } } : {})
  };
}
export function importSources(dir, language, options = {}) {
  if (typeof language === 'object' && language !== null) {
    options = language;
    language = options.lang;
  }
  const strict = !!options.strict;
  dir = path.resolve(dir);
  const entries = fs.readdirSync(dir);
  const files = entries.filter(f => f.toLowerCase().endsWith('.epub'));
  const sidecars = entries.filter(f => f.endsWith('.pdf.local.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const isGen = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8').slice(0, 300).includes('Source:') && fs.readFileSync(path.join(dir, f), 'utf8').slice(0, 300).includes('Language:'); } catch { return false; } };
  const textFiles = entries.filter(f => /\.(md|txt)$/i.test(f) && !f.endsWith('.local.json') && f !== 'README.md' && !f.endsWith('.pdf.raw.txt') && !files.some(e => e.replace(/\.epub$/i, '').toLowerCase() === f.replace(/\.(md|txt)$/i, '').toLowerCase()) && !isGen(f));

  if (!files.length && !sidecars.length && !textFiles.length) throw Error(`No EPUB sources, converted PDF sidecars or novel text files in ${dir}`);

  for (const b of sidecars) {
    if (path.basename(b.source ?? '') !== b.source || !b.source.endsWith('.pdf') || hash(fs.readFileSync(path.join(dir, b.source))) !== b.sha256) throw Error('Invalid or stale PDF sidecar source');
    if (!codes.includes(b.code)) throw Error('Invalid PDF sidecar book code');
    if (strict && (b.chapters?.length !== counts[codes.indexOf(b.code)] || b.chapters.some((c,i) => c.number !== i+1 || c.anchor !== (b.code === 'DH' && i === 36 ? 'DH-epilogue' : `${b.code}${i+1}`) || typeof c.text !== 'string' || hash(c.text) !== c.sha256))) throw Error('Invalid PDF sidecar chapters');
  }
  const extractedBooks = files.map(f => extractBook(path.join(dir, f), { strict, permissive: !strict }));
  const parsedTextBooks = textFiles.map(f => parseTextBook(path.join(dir, f), fs.readFileSync(path.join(dir, f), 'utf8'), { strict }));
  const books = [...extractedBooks, ...sidecars, ...parsedTextBooks].sort((a, b) => codes.indexOf(a.code) - codes.indexOf(b.code));
  if (new Set(books.map(b => b.code)).size !== books.length) throw Error('Duplicate editions: use one edition per book');
  if (new Set(books.map(b => b.language.split('-')[0])).size !== 1) throw Error('Use a separate source directory per language');
  if (language && books.some(b => b.language.split('-')[0] !== language)) throw Error('Source language differs from --lang');
  for (const b of books) {
    const outName = b.source.replace(/\.(epub|pdf|txt)$/i, '.md');
    if (outName !== b.source) {
      fs.writeFileSync(path.join(dir, outName), `# ${b.title}\n\nSource: ${b.source} | Language: ${b.language}\n\n` + b.chapters.map(c => `## ${c.anchor}: ${c.title}\n\n${c.text}\n`).join('\n'), 'utf8');
    }
  }
  fs.writeFileSync(path.join(dir, 'catalogue.local.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), books }), 'utf8');
  return books.map(b => ({ code: b.code, chapters: b.chapters.length, words: b.chapters.reduce((n, c) => n + c.words, 0), excludedEntries: b.excluded.length, ...(b.conversion?.warnings ? {sourceWarnings:b.conversion.warnings} : {}) }));
}

function options(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) throw Error(`Unexpected argument: ${args[i]}`);
    const key = args[i].slice(2);
    if (['json', 'full', 'strict', 'help', 'page'].includes(key)) out[key] = true;
    else { if (args[i + 1] == null || args[i + 1].startsWith('--')) throw Error(`Missing value for --${key}`); out[key] = args[++i]; }
  }
  return out;
}
function integer(value, fallback, min = 0) { const n = value == null ? fallback : Number(value); if (!Number.isSafeInteger(n) || n < min) throw Error('Invalid numeric option'); return n; }
export function loadCatalogue(dir) {
  const cat = JSON.parse(fs.readFileSync(path.join(dir, 'catalogue.local.json'), 'utf8'));
  if (cat.schemaVersion !== 1 || !Array.isArray(cat.books)) throw Error('Unsupported catalogue; import again');
  for (const b of cat.books) {
    if (path.basename(b.source) !== b.source) throw Error('Unsafe source path');
    if (hash(fs.readFileSync(path.join(dir, b.source))) !== b.sha256) throw Error(`Source changed: ${b.source}; import again`);
    if (b.chapters.some(c => hash(c.text) !== c.sha256)) throw Error('Catalogue text changed; import again');
  }
  return cat;
}
export function sourceDirectory(base, language) {
  if (language && !['en', 'hu'].includes(language)) throw Error('--lang must be en or hu');
  const nested = path.join(base, language ?? 'en');
  if (fs.existsSync(nested) && fs.statSync(nested).isDirectory()) return nested;
  return base;
}
export function projectBookGlossary(entry, book) {
  const usage = entry.bookUsage?.[book];
  return {...entry, anchors:entry.anchors.filter(anchor => anchor.startsWith(book)), notes:usage?.notes ?? 'Verified terminology occurrence only; no book-specific usage note has been reviewed.', ...(usage?.evidence ? {evidence:usage.evidence} : {})};
}
export function projectBookFact(fact, book) {
  const usage = fact.bookUsage?.[book];
  if (!usage?.evidence?.length || usage.status !== 'paired-context-reviewed') return null;
  return {id:fact.id, topics:fact.topics, kind:fact.kind, claim:usage.claim, limits:usage.limits, anchors:fact.anchors.filter(anchor => anchor.startsWith(book)), evidence:usage.evidence};
}
export function glossary(query, category, book) {
  const entries = JSON.parse(fs.readFileSync(path.join(root, 'data/hu-glossary.json'), 'utf8'));
  if (category && !entries.some(e => e.category === category)) throw Error(`Unknown glossary category: ${category}`);
  if (book && book !== 'PS') throw Error(`Unsupported book knowledge: ${book}`);
  const needle = query?.normalize('NFKC').toLocaleLowerCase('hu');
  return entries.filter(e => (!category || e.category === category) && (!book || e.anchors?.some(anchor => anchor.startsWith(`${book}`))) && (!needle || [e.id,e.en,e.hu,...e.aliases].join(' ').normalize('NFKC').toLocaleLowerCase('hu').includes(needle))).map(e => book ? projectBookGlossary(e, book) : e);
}
export function lintHungarian(text) {
  const warnings = [];
  for (const e of glossary()) {
    if (e.en.toLocaleLowerCase('hu') === e.hu.toLocaleLowerCase('hu')) continue;
    const escaped = e.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    for (const m of text.matchAll(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'))) {
      warnings.push({ id: e.id, offset: m.index, found: m[0], suggested: e.hu, reason: 'English term in Hungarian draft; check quotation, character voice and project overrides before changing.' });
    }
  }
  return { warnings, note: 'Advisory term scan, not a grammar checker. Does not detect every inflected form or apply edits.' };
}
export function search(books, o) {
  if (!o.query?.trim()) throw Error('--query is required');
  const radius = integer(o.context, 180);
  const query = o.query.normalize('NFKC'), hits = [];
  const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
  for (const b of books) for (const c of b.chapters) {
    if (o.book && b.code.toLowerCase() !== o.book.toLowerCase()) continue;
    if (o.anchor && c.anchor.toLowerCase() !== o.anchor.toLowerCase()) continue;
    const text = c.text.normalize('NFKC');
    for (const match of text.matchAll(pattern)) {
      const pos = match.index;
      hits.push({ anchor: c.anchor, title: c.title, offset: pos, excerpt: c.text.normalize('NFKC').slice(Math.max(0, pos - radius), pos + query.length + radius), ...(b.conversion?.warnings ? {sourceQuality:'degraded transcription; verify spelling and reading order against a reliable edition'} : {}) });
    }
  }
  const offset = integer(o.offset, 0), limit = integer(o.limit, 12, 1);
  return { total: hits.length, offset, nextOffset: offset + limit < hits.length ? offset + limit : null, hits: hits.slice(offset, offset + limit) };
}
export function audit(text) {
  const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? [];
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() && !p.startsWith('#'));
  const counts = new Map();
  for (const p of paragraphs) { const k = p.trim().replace(/\s+/g, ' '); counts.set(k, (counts.get(k) ?? 0) + 1); }
  return { words: words.length, characters: text.length, paragraphs: paragraphs.length, wordCountMethod: 'Unicode letters/numbers with internal apostrophes and hyphens',
    repeatedParagraphs: [...counts].filter(([s, n]) => n > 1 && s.length > 40).map(([text, count]) => ({ text: text.slice(0, 180), count })),
    note: 'Mechanical observations; repetition can be deliberate. This does not judge prose quality.' };
}
export function checkState(s) {
  const string = value => typeof value === 'string' && value.trim().length > 0;
  if (!Array.isArray(s.events)) throw Error('Expected events array; see continuity workflow');
  const known = new Map(Object.entries(s.initialKnowledge ?? {}).map(([k, v]) => { if (!string(k) || !Array.isArray(v) || !v.every(string)) throw Error('initialKnowledge values must be arrays of fact identifiers'); return [k, new Set(v)]; }));
  const inventory = new Map(Object.entries(s.initialObjects ?? {}));
  if ([...inventory].some(([k,v]) => !string(k) || !string(v))) throw Error('initialObjects requires object and holder names');
  const errors = [], ids = new Set(); let previous = -Infinity;
  for (const e of s.events) {
    if (!e || !string(e.id) || ids.has(e.id)) throw Error('Events need unique nonempty ids');
    ids.add(e.id);
    for (const kind of ['requires', 'learns', 'transfers']) {
      if (e[kind] != null && !Array.isArray(e[kind])) throw Error(`${e.id}: ${kind} must be an array`);
      const fields = kind === 'transfers' ? ['object','from','to'] : ['character','fact'];
      if ((e[kind] ?? []).some(r => !r || fields.some(k => !string(r[k])))) throw Error(`${e.id}: invalid ${kind} record`);
    }
    if (!Number.isFinite(e.order) || e.order <= previous) errors.push(`${e.id}: order must strictly increase`);
    previous = e.order;
    for (const r of e.requires ?? []) if (!known.get(r.character)?.has(r.fact)) errors.push(`${e.id}: ${r.character} has no recorded route to ${r.fact}`);
    for (const r of e.learns ?? []) {
      if (!string(r.via)) errors.push(`${e.id}: missing route for ${r.character} learning ${r.fact}`);
      else { if (!known.has(r.character)) known.set(r.character, new Set()); known.get(r.character).add(r.fact); }
    }
    for (const t of e.transfers ?? []) {
      if (inventory.get(t.object) !== t.from) errors.push(`${e.id}: ${t.object} is not held by ${t.from}`);
      else inventory.set(t.object, t.to);
    }
  }
  return { ok: errors.length === 0, errors, note: 'Checks supplied events, not manuscript semantics.' };
}
export function main(args = process.argv.slice(2)) {
  const helpText = 'hp.mjs import|inventory|chapters|search|read|align|facts|glossary|characters|magic|coverage|lint-hu|audit|check-state\nSources: --sources PATH or HP_SOURCES; --lang en|hu (default en for bilingual roots); import [--strict]. Search: --query TEXT [--book PS] [--anchor PS1] [--limit 12] [--offset 0]. Read: --anchor PS1 [--max-chars 12000 | --full]. Align: bilingual source root and --anchor; independent per-language offsets, not sentence alignment. Chapters: [--lang hu] [--topic KEY] [--book PS] [--query TEXT]. Glossary: [--book PS] [--query TEXT] [--category person] [--limit 20]. Facts: [--book PS] [--query TEXT] [--kind event|testimony|interpretation] [--page --limit 10 --offset 0]; pagination requires --page. Characters/magic: --book PS [--query TEXT|--id ID] [--limit 10] [--offset 0]. Coverage: --book PS. PS is the only published book dataset currently; its pilot coverage is incomplete. Audit/lint-hu/check-state: --file PATH. Output is JSON except read; --json makes read JSON. See references/tools.md.';
  if (args.length === 0 || args.includes('--help') || args.includes('-h') || args[0] === 'help') return console.log(helpText);
  const [command, ...rest] = args, o = options(rest);
  const allowed = { help: [], import: ['sources', 'lang', 'strict', 'json'], inventory: ['sources', 'lang', 'json'], chapters: ['query', 'book', 'topic', 'lang', 'limit', 'offset', 'json'], search: ['sources', 'lang', 'query', 'book', 'anchor', 'context', 'offset', 'limit', 'json'], read: ['sources', 'lang', 'anchor', 'offset', 'max-chars', 'full', 'json'], align: ['sources', 'anchor', 'offset', 'max-chars', 'json'], glossary: ['query','category','book','limit','offset','json'], 'lint-hu': ['file','json'], facts: ['query', 'kind', 'book', 'page', 'limit', 'offset', 'json'], characters: ['book','query','id','limit','offset','json'], magic: ['book','query','id','limit','offset','json'], coverage: ['book','json'], audit: ['file', 'json'], 'check-state': ['file', 'json'] };
  if (!allowed[command]) throw Error(`Unknown command: ${command}`);
  for (const k of Object.keys(o)) if (!allowed[command].includes(k)) throw Error(`Unknown option --${k} for ${command}`);
  const base = path.resolve(o.sources ?? process.env.HP_SOURCES ?? 'original-sources');
  const dir = sourceDirectory(base, o.lang);
  let result;
  if (command === 'import') result = importSources(dir, o.lang, { strict: !!o.strict });
  else if (command === 'chapters') {
    const chapters = JSON.parse(fs.readFileSync(path.join(root, o.lang === 'hu' ? 'data/chapters-hu.json' : 'data/chapters.json'), 'utf8'));
    const topics = JSON.parse(fs.readFileSync(path.join(root, 'data/topics.json'), 'utf8'));
    if (o.topic && !Object.hasOwn(topics, o.topic)) throw Error(`Unknown topic: ${o.topic}`);
    const found = chapters.filter(c => (!o.book || c.book.toLowerCase() === o.book.toLowerCase()) && (!o.topic || c.topicCounts[o.topic]) && (!o.query || `${c.anchor} ${c.title}`.toLowerCase().includes(o.query.toLowerCase())));
    if (o.topic) found.sort((a, b) => b.topicCounts[o.topic] - a.topicCounts[o.topic]);
    const offset = integer(o.offset, 0), limit = integer(o.limit, 20, 1);
    result = { total: found.length, offset, nextOffset: offset + limit < found.length ? offset + limit : null, chapters: found.slice(offset, offset + limit) };
  } else if (command === 'facts') {
    const facts = JSON.parse(fs.readFileSync(path.join(root, 'data', 'facts.json'), 'utf8'));
    if (o.kind && !['event','testimony','interpretation'].includes(o.kind)) throw Error(`Unknown fact kind: ${o.kind}`);
    if (o.book && o.book !== 'PS') throw Error(`Unsupported book knowledge: ${o.book}`);
    if (!o.page && (o.limit != null || o.offset != null)) throw Error('Facts pagination requires --page');
    const found = facts.filter(f => (!o.kind || f.kind === o.kind) && (!o.query || JSON.stringify(f).toLowerCase().includes(o.query.toLowerCase()))).map(f => o.book ? projectBookFact(f, o.book) : f).filter(Boolean);
    if (o.page) { const offset = integer(o.offset, 0), limit = integer(o.limit, 10, 1); result = {total:found.length, offset, nextOffset:offset + limit < found.length ? offset + limit : null, facts:found.slice(offset, offset + limit)}; }
    else result = found;
  } else if (command === 'glossary') {
    const found = glossary(o.query, o.category, o.book), offset = integer(o.offset, 0), limit = integer(o.limit, 20, 1);
    result = { total: found.length, offset, nextOffset: offset + limit < found.length ? offset + limit : null, entries: found.slice(offset, offset + limit) };
  } else if (command === 'characters' || command === 'magic') {
    if (o.book !== 'PS') throw Error(`Unsupported book knowledge: ${o.book ?? '(choose PS)'}`);
    if (o.id && o.query) throw Error('--id and --query cannot be combined');
    const entries = JSON.parse(fs.readFileSync(path.join(root, 'data', 'books', 'ps', `${command}.json`), 'utf8')).entries;
    const query = o.query?.normalize('NFKC').toLocaleLowerCase('hu');
    const found = entries.filter(entry => (!o.id || entry.id === o.id) && (!query || [entry.id,entry.labelEn,entry.labelHu, ...(command === 'magic' ? entry.occurrences.map(item => item.summary) : [])].join(' ').normalize('NFKC').toLocaleLowerCase('hu').includes(query)));
    const offset = integer(o.offset, 0), limit = integer(o.limit, 10, 1); result = {total:found.length, offset, nextOffset:offset + limit < found.length ? offset + limit : null, entries:found.slice(offset, offset + limit)};
  } else if (command === 'coverage') {
    if (o.book !== 'PS') throw Error(`Unsupported book knowledge: ${o.book ?? '(choose PS)'}`);
    const coverage = JSON.parse(fs.readFileSync(path.join(root, 'data', 'books', 'ps', 'coverage.json'), 'utf8'));
    const characters=JSON.parse(fs.readFileSync(path.join(root, 'data', 'books', 'ps', 'characters.json'), 'utf8')).entries;
    const magic=JSON.parse(fs.readFileSync(path.join(root, 'data', 'books', 'ps', 'magic.json'), 'utf8')).entries;
    const complete=coverage.chapters.every(chapter => chapter.en === 'independently-reviewed' && chapter.hu === 'independently-reviewed') && coverage.candidateDisposition.pending === 0 && coverage.candidateDisposition.unresolved === 0 && coverage.categoryCounts.characters === characters.length && coverage.categoryCounts.magic === magic.length;
    result = {book:coverage.book, coverageState:complete ? 'complete' : 'incomplete', chapters:coverage.chapters, categoryCounts:coverage.categoryCounts, candidateDisposition:coverage.candidateDisposition, limitations:coverage.limitations};
  } else if (command === 'align') {
    if (!o.anchor) throw Error('--anchor is required');
    const offset = integer(o.offset, 0), limit = integer(o['max-chars'], 4000, 1);
    result = { anchor: o.anchor, alignment: 'chapter only; character offsets are independent in each language', passages: ['en','hu'].map(language => {
      const { books } = loadCatalogue(path.join(base, language));
      const book = books.find(b => b.chapters.some(c => c.anchor.toLowerCase() === o.anchor.toLowerCase()));
      const chapter = book?.chapters.find(c => c.anchor.toLowerCase() === o.anchor.toLowerCase());
      if (!chapter) throw Error(`Missing ${language} chapter: ${o.anchor}`);
      return { language, title: chapter.title, offset, totalCharacters: chapter.text.length, nextOffset: offset + limit < chapter.text.length ? offset + limit : null, text: chapter.text.slice(offset, offset + limit), ...(book.conversion?.warnings ? {sourceWarnings:book.conversion.warnings} : {}) };
    }) };
  } else if (command === 'audit' || command === 'check-state' || command === 'lint-hu') {
    if (!o.file) throw Error('--file is required');
    const text = fs.readFileSync(o.file, 'utf8'); result = command === 'audit' ? audit(text) : command === 'lint-hu' ? lintHungarian(text) : checkState(JSON.parse(text));
    if (result.ok === false) process.exitCode = 1;
  } else {
    const { books } = loadCatalogue(dir);
    if (o.lang && books.some(b => b.language.split('-')[0] !== o.lang)) throw Error('Source language differs from --lang');
    if (command === 'inventory') result = books.map(({ code, title, language, sha256, chapters, conversion }) => ({ code, title, language, sha256, chapters: chapters.map(({ text, ...c }) => c), ...(conversion?.warnings ? {sourceWarnings:conversion.warnings} : {}) }));
    if (command === 'search') result = search(books, o);
    if (command === 'read') {
      if (!o.anchor) throw Error('--anchor is required');
      const book = books.find(b => b.chapters.some(c => c.anchor.toLowerCase() === o.anchor.toLowerCase()));
      const c = book?.chapters.find(c => c.anchor.toLowerCase() === o.anchor.toLowerCase());
      if (!c) throw Error(`Unknown chapter: ${o.anchor}`);
      const offset = integer(o.offset, 0), limit = o.full ? c.text.length : integer(o['max-chars'], 12000, 1);
      result = { anchor: c.anchor, title: c.title, offset, totalCharacters: c.text.length, nextOffset: offset + limit < c.text.length ? offset + limit : null, text: c.text.slice(offset, offset + limit), ...(book.conversion?.warnings ? {sourceWarnings:book.conversion.warnings} : {}) };
      if (!o.json) return console.log(`# ${result.anchor}: ${result.title}\n[offset=${offset}; nextOffset=${result.nextOffset}; total=${result.totalCharacters}]\n${result.sourceWarnings ? '\nSource warnings: '+result.sourceWarnings.join(' ')+'\n' : ''}\n${result.text}`);
    }
  }
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(`ERROR: ${e.message}`); process.exitCode = 1; }
}
