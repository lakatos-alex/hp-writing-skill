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
| `facts` | Filter bundled original evidence cards | None |
| `audit` | Count manuscript words and find long duplicate paragraphs | None |
| `check-state` | Check explicit knowledge routes and object transfers | None |

The data-only commands `chapters` and `facts` work without books. The manuscript commands need only the selected input file.

## Import

```sh
node scripts/hp.mjs import --sources /path/to/sources
```

The source directory defaults to `HP_SOURCES`, then `original-sources` under the working directory. `--sources` takes precedence. The importer supports the documented English Pottermore EPUB layout with `hpNN_chNNN` filenames. It validates the primary chapter sequence and expected counts, including DH's epilogue. Other edition layouts fail clearly rather than guessing chapter boundaries.

Each import overwrites generated same-stem Markdown and `catalogue.local.json`. EPUBs are read only. All sources are parsed before output writing begins. An operating-system write failure can still leave a partial refresh; rerun after resolving it.

The catalogue contains full chapter text and belongs with the private source files. It records EPUB and extracted-text SHA-256 hashes, language, titles, source entries and excluded spine entries. Cover/front matter, advertisements and next-book previews are excluded from the narrative Markdown. The original EPUB retains them.

The ZIP reader supports stored and deflated entries, rejects encryption and unsafe paths, and caps expanded size. It does not implement DRM, OCR, ZIP64, arbitrary ebook formats or universal EPUB layout recognition. Paragraphs, chapter headings and simple emphasis are retained; typography and illustration layout are not reproduced.

## Find a chapter without books

```sh
node scripts/hp.mjs chapters --book PoA --limit 30
node scripts/hp.mjs chapters --topic food --limit 5
node scripts/hp.mjs chapters --query "Wandmaker"
node scripts/hp.mjs facts --query "Fidelius"
node scripts/hp.mjs facts --kind testimony --query "food"
```

Topics are keys from [topics.json](../data/topics.json). Topic ranking is lexical frequency, not semantic relevance or proof. A chapter with many references to telephones may outrank the chapter that explains Hogwarts' electrical interference. Use evidence cards and specific searches to resolve the claim.

## Search and read

```sh
node scripts/hp.mjs search --sources /path/to/books --book GoF --query electricity
node scripts/hp.mjs search --sources /path/to/books --anchor DH15 --query Gamp --context 700
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --offset 12000 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH-epilogue --full
```

Search defaults to 12 hits and 180 characters of context on each side. `--offset` paginates hits; `--limit` controls page size. Read defaults to 12,000 characters and reports `nextOffset`; `--full` returns the whole selected chapter. These are adjustable output defaults, not limits on research depth.

All commands emit JSON except ordinary `read`; use `read --json` for structured output. Search offsets refer to NFKC-normalized text; read offsets refer to the saved chapter text. Use a search hit's anchor and matching phrase to relocate it if normalization changes character length.

Every local read verifies the source and extracted-text hashes. If a source or catalogue changes, import again. There is no semantic-search model or embedding store. Exact query misses require alternate terms or chapter reading.

## Manuscripts and continuity

```sh
node scripts/hp.mjs audit --file /path/to/chapter.md
node scripts/hp.mjs check-state --file /path/to/events.json
```

Audit counts Unicode letters/numbers with internal apostrophes and hyphens; markup can affect other counting methods. Prefer the host's accepted counter when one exists. Duplicate paragraphs are observations, not instructions to cut refrains.

The event model is in [continuity](workflow-continuity.md). It checks sequence, prior knowledge and object custody, not prose semantics, historical dates or truthfulness of testimony. Failed state checks and malformed input return a nonzero exit code.

## Agent access and Git ignore

The repository ignores the source folder. Ordinary recursive `rg` searches may skip it; use the source CLI or explicitly opt into ignored files with `rg --no-ignore` scoped to the selected source path. Do not force-add the books to make them searchable.

Local storage does not mean model processing is offline: passages read by an agent can enter its provider context. Tools themselves perform no upload.
