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
| Evidence cards | 62 original cards | Selected passage readings with claim type and limitations |
| Bilingual terminology | Searchable paired entries | Short term locators in EN/HU chapters, referents checked in context |
| Typed semantic retrieval | 1296 per-book records across PS1–PS17, CoS1–CoS18, PoA1–PoA22, GoF1–GoF37 and OotP1–OotP38 | Curated identities, concepts, objects and identified human spells with selected paired evidence |
| Hungarian craft analysis | 12 paired chapter samples across the first six books | Selected windows actually examined, listed in the prose guide |
| Behavioural evaluation | Preserved A/B/C evaluations and an eight-story four-condition comparison | Observed writing behaviour under stated resource conditions |

The [Hungarian prose sampling table](hungarian-prose.md#paired-evidence-sampling) identifies the examined windows. These findings describe broad craft functions and support original writing. They are not a translator fingerprint, a signature phrase collection or full-book literary verification.

## Limits

The [PS coverage record](../data/books/ps/coverage.json), [CoS coverage record](../data/books/cos/coverage.json), [PoA coverage record](../data/books/poa/coverage.json), [GoF coverage record](../data/books/gof/coverage.json) and [OotP coverage record](../data/books/ootp/coverage.json) distinguish completed scoped inventories from incomplete independent full-book semantic reading. The earlier PS1/PS10 pilot is superseded for retrieval; its counters are historical. PS has 117 characters, 53 places, 70 objects and six identified spells; CoS has 97 characters, 47 places, 75 objects and eight spells; PoA has 89 characters, 56 places, 72 objects and 14 spells; GoF has 129 characters, 61 places, 66 objects and 37 spells; OotP has 143 characters, 50 places, 61 objects and 45 spells. All 132 chapters are represented through selected evidence or literal mentions. Chapter reading states remain `partial`. The shared glossary contains 192 paired entries and retains separate selective coverage. These counts do not establish exhaustive semantic coverage or improved writing quality.

An indexed chapter is not a chapter semantically read by an agent. A locator match is not independent proof of a claim. The source check re-finds evidence-card and glossary locators; interpretive accuracy still needs contextual judgment. The no-long-match publication scan catches exact 30-word source sequences, not every possible copyright or editorial issue.

Without local books, use the bundled dossiers, evidence cards, glossary and workflows. Do not claim fresh passage verification or invent exact quotations. A missing glossary entry is a coverage gap. A missed literal search is not evidence that a concept is absent.

The library grows through supported claims and demonstrated needs. Re-run realistic tests after material changes and report observed failures as well as successes. More files or a larger model context do not by themselves establish better writing.
