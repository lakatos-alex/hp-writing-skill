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
export function extractBook(file) {
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
  const grouped = new Map();
  for (const doc of documents) {
    const m = doc.name.match(/hp(\d{2})_ch(\d{3})_/i);
    if (m) { const key = Number(m[1]); if (!grouped.has(key)) grouped.set(key, []); grouped.get(key).push({ ...doc, number: Number(m[2]) }); }
  }
  const winner = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (!winner) throw Error('Unsupported edition: expected hpNN_chNNN chapter filenames; no guessed boundaries');
  const [bookNumber, raw] = winner, code = codes[bookNumber - 1];
  if (!code || raw.length !== counts[bookNumber - 1] || raw.some((c, i) => c.number !== i + 1)) throw Error(`Missing, duplicate, or out-of-order chapters in ${file}`);
  const chapters = raw.map(c => {
    const title = plain(c.html.match(/<h1\b[^>]*>([^]*?)<\/h1>/i)?.[1] ?? '');
    if (!title) throw Error(`Missing chapter title: ${c.name}`);
    const text = markdown(c.html.replace(/<h[1-6]\b[^>]*>[^]*?<\/h[1-6]>/gi, ''));
    if (text.length < 100) throw Error(`Empty chapter: ${c.name}`);
    const anchor = code === 'DH' && c.number === 37 ? 'DH-epilogue' : `${code}${c.number}`;
    return { anchor, number: c.number, title, entry: c.name, words: text.split(/\s+/u).length, sha256: hash(text), text };
  });
  return { code, title, language, source: path.basename(file), sha256: hash(bytes), chapters,
    excluded: documents.filter(d => !raw.some(c => c.name === d.name)).map(d => d.name) };
}
export function importSources(dir) {
  dir = path.resolve(dir);
  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.epub'));
  if (!files.length) throw Error(`No EPUB sources in ${dir}`);
  const books = files.map(f => extractBook(path.join(dir, f))).sort((a, b) => codes.indexOf(a.code) - codes.indexOf(b.code));
  if (new Set(books.map(b => b.code)).size !== books.length) throw Error('Duplicate editions: use one edition per book');
  // Every source passes validation before generated outputs are replaced.
  for (const b of books) fs.writeFileSync(path.join(dir, b.source.replace(/\.epub$/i, '.md')), `# ${b.title}\n\nSource: ${b.source} | Language: ${b.language}\n\n` + b.chapters.map(c => `## ${c.anchor}: ${c.title}\n\n${c.text}\n`).join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, 'catalogue.local.json'), JSON.stringify({ schemaVersion: 1, generatedAt: new Date().toISOString(), books }), 'utf8');
  return books.map(b => ({ code: b.code, chapters: b.chapters.length, words: b.chapters.reduce((n, c) => n + c.words, 0), excludedEntries: b.excluded.length }));
}
function options(args) {
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) throw Error(`Unexpected argument: ${args[i]}`);
    const key = args[i].slice(2);
    if (['json', 'full'].includes(key)) out[key] = true;
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
export function search(books, o) {
  if (!o.query?.trim()) throw Error('--query is required');
  const query = o.query.normalize('NFKC'), hits = [];
  const pattern = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
  for (const b of books) for (const c of b.chapters) {
    if (o.book && b.code.toLowerCase() !== o.book.toLowerCase()) continue;
    if (o.anchor && c.anchor.toLowerCase() !== o.anchor.toLowerCase()) continue;
    const text = c.text.normalize('NFKC');
    for (const match of text.matchAll(pattern)) {
      const pos = match.index;
      const radius = integer(o.context, 180);
      hits.push({ anchor: c.anchor, title: c.title, offset: pos, excerpt: c.text.normalize('NFKC').slice(Math.max(0, pos - radius), pos + query.length + radius) });
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
  const [command = 'help', ...rest] = args, o = options(rest);
  const allowed = { help: [], import: ['sources', 'json'], inventory: ['sources', 'json'], chapters: ['query', 'book', 'topic', 'limit', 'offset', 'json'], search: ['sources', 'query', 'book', 'anchor', 'context', 'offset', 'limit', 'json'], read: ['sources', 'anchor', 'offset', 'max-chars', 'full', 'json'], facts: ['query', 'kind', 'json'], audit: ['file', 'json'], 'check-state': ['file', 'json'] };
  if (!allowed[command]) throw Error(`Unknown command: ${command}`);
  for (const k of Object.keys(o)) if (!allowed[command].includes(k)) throw Error(`Unknown option --${k} for ${command}`);
  const dir = path.resolve(o.sources ?? process.env.HP_SOURCES ?? 'original-sources');
  let result;
  if (command === 'help') return console.log('hp.mjs import|inventory|chapters|search|read|facts|audit|check-state\nSources: --sources PATH or HP_SOURCES. Search: --query TEXT [--book PS] [--anchor PS1] [--limit 12] [--offset 0]. Read: --anchor PS1 [--max-chars 12000 | --full]. Chapters: [--topic KEY] [--book PS] [--query TEXT]. Facts: --query TEXT [--kind event|testimony|interpretation]. Audit/check-state: --file PATH. Output is JSON except read; --json makes read JSON. See references/tools.md.');
  if (command === 'import') result = importSources(dir);
  else if (command === 'chapters') {
    const chapters = JSON.parse(fs.readFileSync(path.join(root, 'data/chapters.json'), 'utf8'));
    const topics = JSON.parse(fs.readFileSync(path.join(root, 'data/topics.json'), 'utf8'));
    if (o.topic && !Object.hasOwn(topics, o.topic)) throw Error(`Unknown topic: ${o.topic}`);
    const found = chapters.filter(c => (!o.book || c.book.toLowerCase() === o.book.toLowerCase()) && (!o.topic || c.topicCounts[o.topic]) && (!o.query || `${c.anchor} ${c.title}`.toLowerCase().includes(o.query.toLowerCase())));
    if (o.topic) found.sort((a, b) => b.topicCounts[o.topic] - a.topicCounts[o.topic]);
    const offset = integer(o.offset, 0), limit = integer(o.limit, 20, 1);
    result = { total: found.length, offset, nextOffset: offset + limit < found.length ? offset + limit : null, chapters: found.slice(offset, offset + limit) };
  } else if (command === 'facts') {
    const facts = JSON.parse(fs.readFileSync(path.join(root, 'data', 'facts.json'), 'utf8'));
    result = facts.filter(f => (!o.kind || f.kind === o.kind) && (!o.query || JSON.stringify(f).toLowerCase().includes(o.query.toLowerCase())));
  } else if (command === 'audit' || command === 'check-state') {
    if (!o.file) throw Error('--file is required');
    const text = fs.readFileSync(o.file, 'utf8'); result = command === 'audit' ? audit(text) : checkState(JSON.parse(text));
    if (result.ok === false) process.exitCode = 1;
  } else {
    const { books } = loadCatalogue(dir);
    if (command === 'inventory') result = books.map(({ code, title, language, sha256, chapters }) => ({ code, title, language, sha256, chapters: chapters.map(({ text, ...c }) => c) }));
    if (command === 'search') result = search(books, o);
    if (command === 'read') {
      if (!o.anchor) throw Error('--anchor is required');
      const c = books.flatMap(b => b.chapters).find(c => c.anchor.toLowerCase() === o.anchor.toLowerCase());
      if (!c) throw Error(`Unknown chapter: ${o.anchor}`);
      const offset = integer(o.offset, 0), limit = o.full ? c.text.length : integer(o['max-chars'], 12000, 1);
      result = { anchor: c.anchor, title: c.title, offset, totalCharacters: c.text.length, nextOffset: offset + limit < c.text.length ? offset + limit : null, text: c.text.slice(offset, offset + limit) };
      if (!o.json) return console.log(`# ${result.anchor}: ${result.title}\n[offset=${offset}; nextOffset=${result.nextOffset}; total=${result.totalCharacters}]\n\n${result.text}`);
    }
  }
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(`ERROR: ${e.message}`); process.exitCode = 1; }
}
