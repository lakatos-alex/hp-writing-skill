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
| Evidence cards | 64 original cards | Selected passage readings with claim type and limitations |
| Bilingual terminology | Searchable paired entries | Short term locators in EN/HU chapters, referents checked in context |
| Typed semantic retrieval | 1756 per-book records across all seven novels and 199 chapter anchors | Curated identities, concepts, objects and identified human spells with selected paired evidence |
| Hungarian craft analysis | 12 paired chapter samples across the first six books | Selected windows actually examined, listed in the prose guide |
| Behavioural evaluation | Preserved A/B/C evaluations and an eight-story four-condition comparison | Observed writing behaviour under stated resource conditions |

The [Hungarian prose sampling table](hungarian-prose.md#paired-evidence-sampling) identifies the examined windows. These findings describe broad craft functions and support original writing. They are not a translator fingerprint, a signature phrase collection or full-book literary verification.

## Limits

The per-book coverage records ([PS](../data/books/ps/coverage.json), [CoS](../data/books/cos/coverage.json), [PoA](../data/books/poa/coverage.json), [GoF](../data/books/gof/coverage.json), [OotP](../data/books/ootp/coverage.json), [HBP](../data/books/hbp/coverage.json), [DH](../data/books/dh/coverage.json)) distinguish completed scoped inventories from incomplete independent full-book semantic reading. All 199 anchors have selected contextual evidence or literal mentions; chapter reading states remain `partial`. HBP adds 220 records and DH adds 240 to the earlier 1296 records. The inventories store 2173 contextual evidence pairs and 3586 literal-mention pairs, with possible passage reuse. The separate series glossary remains 192 selective paired terms. These counts establish neither exhaustive coverage nor improved writing quality.

DH typed records use English context with paired retrieval keys from the degraded Hungarian transcription. Their Hungarian labels may inherit earlier reliable book forms or use editorial forms; they are not newly certified spellings. `glossary --book DH` exposes this limitation, and `lint-hu --book DH` supplies no spelling replacements. HBP spelling and silent-casting evidence use the paired EPUB editions. Where editions describe speech differently, retain both language-specific statuses.

The preserved four-condition comparison used the five-book inventory. The 1.0 HBP/DH additions and tool changes have no fresh writing evaluation or local automated-suite result: new tests were explicitly deferred. Earlier source-conversion checks remain historical evidence, not a new release-wide pass.


An indexed chapter is not a chapter semantically read by an agent. A locator match is not independent proof of a claim. The source check re-finds evidence-card and glossary locators; interpretive accuracy still needs contextual judgment. The no-long-match publication scan catches exact 30-word source sequences, not every possible copyright or editorial issue.

Without local books, use the bundled dossiers, evidence cards, glossary and workflows. Do not claim fresh passage verification or invent exact quotations. A missing glossary entry is a coverage gap. A missed literal search is not evidence that a concept is absent.

The library grows through supported claims and demonstrated needs. Re-run realistic tests after material changes and report observed failures as well as successes. More files or a larger model context do not by themselves establish better writing.
