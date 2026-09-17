# Local tools

The bundled [hp.mjs](../scripts/hp.mjs) runs on Node.js 22 or newer with no third-party dependencies. It makes no network requests. All paths in commands below are relative to the installed skill folder; pass an absolute source path when running from another project.

## Commands

| Command | Purpose | Writes |
|---|---|---|
| `import` | Read supported EPUBs, verify chapter order, create Markdown and a local catalogue | Generated files beside source EPUBs |
| `inventory` | Verify hashes and list local chapter metadata | None |
| `chapters` | Search the bundled chapter catalogue by title, book or topic | None |
| `search` | Literal, case-insensitive search of local chapter text | None |
| `read` | Read a selected chapter with continuation metadata | None |
| `align` | Read an English/Hungarian chapter pair with independent offsets | None |
| `facts` | Filter bundled original evidence cards | None |
| `glossary` | Find English/Hungarian terms, aliases and usage notes | None |
| `characters`, `magic` | Query the partial PS character and magic datasets | None |
| `coverage` | Report reviewed chapter coverage and limitations for PS | None |
| `lint-hu` | Flag English headwords that may be inconsistent with a Hungarian draft | None |
| `audit` | Count manuscript words and find long duplicate paragraphs | None |
| `check-state` | Check explicit knowledge routes and object transfers | None |

The data-only commands `chapters`, `facts` and `glossary` work without books. The manuscript commands need only the selected input file. The advisory `lint-hu` scan never changes text and does not replace grammatical or editorial review.

## Book-one pilot retrieval

The source-free PS datasets currently cover reviewed material from PS1 and PS10, not the whole book. Query coverage before relying on a missing result. Supported book-specific knowledge is currently PS only.

```sh
node scripts/hp.mjs characters --book PS --id harry-potter
node scripts/hp.mjs magic --book PS --query Leviosa --limit 5
node scripts/hp.mjs glossary --book PS --query Harry
node scripts/hp.mjs facts --book PS --page --limit 10 --offset 0
node scripts/hp.mjs coverage --book PS
```

Character and magic results use `total`, `offset`, `nextOffset` and `entries`; choose either `--id` or `--query`. Paged facts use the same pagination fields and `facts`. Existing unpaged fact commands still return an array; `--limit` and `--offset` require `--page`. Strict PS lookups omit unreviewed later-book notes and use reviewed PS-specific claims. This book filter does not impose a chapter-by-chapter knowledge cutoff on a scene.

## Import books

```sh
node scripts/hp.mjs import --sources /path/to/sources
node scripts/hp.mjs import --sources /path/to/sources --strict
```

The source directory defaults to `HP_SOURCES`, then `original-sources` under the working directory. `--sources` takes precedence. A bilingual root contains `en/` and `hu/`; `--lang en` or `--lang hu` selects the child. Without `--lang`, a bilingual root selects English. A flat single-language directory remains supported. Use separate catalogues for separate languages and one edition per book per catalogue.

By default, the importer operates in permissive mode: it accepts arbitrary EPUBs (via EPUB 3 Navigation documents, standard NCX with fragment links, or spine fallback) and direct novel text files (`.txt` / `.md`). If a non-canonical edition contains preview chapters or minor discrepancies, non-fatal warnings are recorded instead of halting the import. Passing `--strict` enforces exact verification against official benchmark editions (Pottermore `hpNN_chNNN` layout for English, documented strict NCX layout for Hungarian, and exact canonical chapter counts).

Each import overwrites generated same-stem Markdown and `catalogue.local.json`. EPUBs and text sources are read only. All sources are parsed before output writing begins. An operating-system write failure can still leave a partial refresh; rerun after resolving it.

The catalogue contains full chapter text and belongs with the private source files. It records EPUB and extracted-text SHA-256 hashes, language, titles, source entries and excluded spine entries. Cover/front matter, advertisements and next-book previews are excluded from the narrative Markdown. The original EPUB retains them.

The ZIP reader supports stored and deflated entries, rejects encryption and unsafe paths, verifies CRCs and caps expanded size. It does not implement DRM, OCR, ZIP64, arbitrary ebook formats or universal EPUB layout recognition. Paragraphs, chapter headings and simple emphasis are retained; typography and illustration layout are not reproduced.

### Converted PDF sidecars

PDF bytes are not parsed by the Node tool. An edition-specific converter may provide a `*.pdf.local.json` single-book sidecar with `code`, `title`, `language`, PDF basename in `source`, source SHA-256, `chapters` and `excluded`. Chapter records contain `anchor`, `number`, `title`, page locator in `entry`, `words`, UTF-8 text SHA-256 and `text`. Keep all outputs private. Import checks the PDF hash, expected anchor sequence and text hashes, then writes the same-stem Markdown and catalogue. It cannot certify OCR accuracy or repair a damaged edition.

The Hungarian DH index describes a degraded 1,140-page PDF transcription. Its titles preserve the source's spelling; paragraph boundaries are inferred and missing accents are not guessed. Use it for locating material, not as a Hungarian orthographic or translator-style authority. The repository's contributor converter requires Python and pypdf; that dependency is separate from the installed Node tools.

## Find a chapter without books

```sh
node scripts/hp.mjs chapters --book PoA --limit 30
node scripts/hp.mjs chapters --topic food --limit 5
node scripts/hp.mjs chapters --query "Wandmaker"
node scripts/hp.mjs chapters --lang hu --query "Titok"
node scripts/hp.mjs glossary --query "Accio"
node scripts/hp.mjs glossary --category person --limit 10 --offset 0
node scripts/hp.mjs facts --query "Fidelius"
node scripts/hp.mjs facts --kind testimony --query "food"
```

Topics are keys from [topics.json](../data/topics.json). Topic ranking is lexical frequency, not semantic relevance or proof. A chapter with many references to telephones may outrank the chapter that explains Hogwarts' electrical interference. Use evidence cards and specific searches to resolve the claim.

Hungarian chapter topic ranks use the aligned English chapter's counts, labelled `topicBasis`. They are not Hungarian word frequencies. Glossary queries search headwords, aliases and IDs, case-insensitively with Unicode normalization; accents remain significant. The default glossary page size is 20. Read usage notes before adopting a term, especially an incantation or an ambiguous name.

## Search and read

```sh
node scripts/hp.mjs search --sources /path/to/books --book GoF --query electricity
node scripts/hp.mjs search --sources /path/to/books --anchor DH15 --query Gamp --context 700
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --offset 12000 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH-epilogue --full
node scripts/hp.mjs search --sources /path/to/books --lang hu --query "Roxfort"
node scripts/hp.mjs align --sources /path/to/books --anchor PS6 --max-chars 4000
```

Search defaults to 12 hits and 180 characters of context on each side. `--offset` paginates hits; `--limit` controls page size. Read defaults to 12,000 characters and reports `nextOffset`; `--full` returns the whole selected chapter. These are adjustable output defaults, not limits on research depth.

All commands emit JSON except ordinary `read`; use `read --json` for structured output. Search offsets refer to NFKC-normalized text; read offsets refer to the saved chapter text. Use a search hit's anchor and matching phrase to relocate it if normalization changes character length.

Every local read verifies the source and extracted-text hashes. If a source or catalogue changes, import again. There is no semantic-search model or embedding store. Exact query misses require alternate terms or chapter reading.

`align` requires a bilingual root and returns one passage per language. Its default window is 4,000 characters per language; `--offset` starts that numeric offset independently in both texts. Alignment is chapter-level, not sentence-level. Locate a matching event separately when comparing translation choices. Hungarian suffixes can change word endings; stem searches can help but require referent checks.

## Manuscripts and continuity

```sh
node scripts/hp.mjs audit --file /path/to/chapter.md
node scripts/hp.mjs check-state --file /path/to/events.json
node scripts/hp.mjs lint-hu --file /path/to/chapter.md
```

Audit counts Unicode letters/numbers with internal apostrophes and hyphens; markup can affect other counting methods. Prefer the host's accepted counter when one exists. Duplicate paragraphs are observations, not instructions to cut refrains.

The event model is in [continuity](workflow-continuity.md). It checks sequence, prior knowledge and object custody, not prose semantics, historical dates or truthfulness of testimony. Failed state checks and malformed input return a nonzero exit code.

`lint-hu` flags exact English headwords with distinct Hungarian equivalents. It does not reliably detect every inflection, alias, quotation or code-switch, so a warning is a review prompt, not an error verdict. Deliberate project overrides take precedence. Warnings leave the exit code at zero; malformed input fails.

## Agent access and Git ignore

The repository ignores the source folder. Ordinary recursive `rg` searches may skip it; use the source CLI or explicitly opt into ignored files with `rg --no-ignore` scoped to the selected source path. Do not force-add the books to make them searchable.

Local storage does not mean model processing is offline: passages read by an agent can enter its provider context. Tools themselves perform no upload.
