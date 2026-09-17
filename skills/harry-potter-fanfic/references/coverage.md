# Source and verification coverage

## Corpus and retrieval

The English and Hungarian catalogues each cover 199 chapter anchors across seven books, including `DH-epilogue`. Anchors align chapters, not sentences or page numbers. The [English manifest](../data/source-coverage.json) and [Hungarian manifest](../data/source-coverage-hu.json) record edition hashes, formats, counts and extraction limits.

English EPUBs use the Pottermore chapter layout; six Hungarian EPUBs use matched NCX headings and consecutive spine entries. Front matter and previews are excluded from narrative Markdown. Whitespace-delimited source counts differ from the manuscript audit's Unicode word-count method.

The Hungarian DH source is a 1,140-page reflowed PDF with 523 embedded original folios. All pages have text. The converter accounts for every nonempty line, removes the validated folio sequence, retains all 37 narrative sections and preserves narrative characters with whitespace-only reflow. Independent pypdf/pdfplumber extraction agrees on non-whitespace character order on every narrative page. Word spacing differs on 270 pages. Representative first, middle, final and chapter-transition pages were visually checked.

That PDF already contains missing accents, displaced initials, inconsistent headings and damaged spacing. Its Markdown is a searchable transcription, not a corrected edition. Paragraphs are inferred. It is excluded from the paired Hungarian prose study and glossary verification; its titles must not be treated as an authoritative spelling list.

## What each check establishes

| Layer | Coverage | Meaning |
|---|---|---|
| English structure and normalized text | 7 EPUBs, 199 chapters | Ordered chapter coverage; letters/numbers compared to source XHTML |
| Hungarian EPUB structure and normalized text | 6 EPUBs, 162 chapters | NCX/spine agreement; letters/numbers compared to source XHTML |
| Hungarian PDF text layer | 1 PDF, 37 chapters | Page/line accounting, source defects retained, hashes and saved text checked |
| Topic retrieval | 33 English vocabularies | Lexical counts; Hungarian ranks inherit aligned English counts |
| Evidence cards | 44 original cards | Selected passage readings with claim type and limitations |
| Bilingual terminology | Searchable paired entries | Short term locators in EN/HU chapters, referents checked in context |
| Hungarian craft analysis | 12 paired chapter samples across the first six books | Selected windows actually examined, listed in the prose guide |
| Behavioural evaluation | Fixed A/B/C protocol and preserved outputs | Observed writing behaviour under stated resource conditions |

The [Hungarian prose sampling table](hungarian-prose.md#paired-evidence-sampling) identifies the examined windows. These findings describe broad craft functions and support original writing. They are not a translator fingerprint, a signature phrase collection or full-book literary verification.

## Limits

An indexed chapter is not a chapter semantically read by an agent. A locator match is not independent proof of a claim. The source check re-finds evidence-card and glossary locators; interpretive accuracy still needs contextual judgment. The no-long-match publication scan catches exact 30-word source sequences, not every possible copyright or editorial issue.

Without local books, use the bundled dossiers, evidence cards, glossary and workflows. Do not claim fresh passage verification or invent exact quotations. A missing glossary entry is a coverage gap. A missed literal search is not evidence that a concept is absent.

The library grows through supported claims and demonstrated needs. Re-run realistic tests after material changes and report observed failures as well as successes. More files or a larger model context do not by themselves establish better writing.
