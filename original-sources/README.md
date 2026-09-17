# Source workspace

This directory is for corpus development and local primary-text retrieval. Only this README is tracked; books, extracted text, provenance and QA artifacts are Git-ignored and excluded from release archives. See the repository's [development rules](../AGENTS.md).

## Layout

```text
original-sources/
  en/                         English editions and generated Markdown
  hu/                         Hungarian editions and generated Markdown
  _archive/                   Superseded catalogues; recoverable, not active inputs
  organisation-*.local.json    Original-to-normalized filename and hash records
```

Use the same stable filename stems in both languages: `01-philosophers-stone`, `02-chamber-of-secrets`, `03-prisoner-of-azkaban`, `04-goblet-of-fire`, `05-order-of-the-phoenix`, `06-half-blood-prince`, `07-deathly-hallows`. Preserve diacritics in document contents. Filenames identify volumes, not translation choices.

Each language folder contains original `.epub` or `.pdf` files, same-stem `.md` narrative text, and `catalogue.local.json`. PDF extraction also retains raw page/text sidecars and a QA report. Those are provenance, not disposable junk. The original editions retain omitted covers, contents and publisher material.

## Import and verify

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import --lang en
node skills/harry-potter-fanfic/scripts/hp.mjs import --lang hu
node tools/build_catalogue.mjs original-sources
node tools/verify_sources.mjs original-sources
```

Import refreshes generated Markdown and catalogues, not original books. It supports documented English Pottermore and Hungarian NCX/spine EPUB layouts. Use `tools/organize_sources.ps1` to preview catalogue-based renames and `-Apply` to carry them out; it records hashes and refuses existing destinations. Re-import after renaming.

The edition-specific Hungarian DH converter needs Python with `pypdf`; the optional second-engine check needs `pdfplumber`:

```sh
python tools/import_hu_pdf.py --input original-sources/hu/07-deathly-hallows.pdf --output original-sources/hu/07-deathly-hallows.md --verify-with-pdfplumber
```

It preserves raw extraction and records source defects. The degraded PDF is not a trusted Hungarian spelling or prose standard. Do not silently correct it or represent text-layer coverage as editorial verification.

## Search

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs search --lang hu --query Roxfort
node skills/harry-potter-fanfic/scripts/hp.mjs read --lang en --anchor PS6 --full
node skills/harry-potter-fanfic/scripts/hp.mjs align --sources original-sources --anchor PS6
```

General recursive searches may skip ignored files. Use the source CLI or scoped `rg --no-ignore`; never force-add books to make them searchable. See [tools](../skills/harry-potter-fanfic/references/tools.md) and [coverage](../skills/harry-potter-fanfic/references/coverage.md). Passages read by an agent can enter its model-provider context.
