# Source and verification coverage

This release includes a complete structural index of the supported source collection.

## Available primary corpus

The supported English Pottermore EPUB layout contains 199 primary narrative chapters across the seven novels, including the Deathly Hallows epilogue. The importer follows EPUB spine order and excludes front matter and next-book promotional previews from narrative output.

The [source manifest](../data/source-coverage.json) records each source hash, language, chapter count, text word count and number of excluded entries. Word counts use whitespace-delimited extracted text and are not interchangeable with the manuscript audit counter.

## What the checks establish

| Layer | Coverage | Meaning |
|---|---|---|
| EPUB structure | All seven books | Reading order and expected complete chapter sequence |
| Chapter catalogue | All 199 chapters | Titles, anchors, text sizes and lexical topic counts |
| Extracted text comparison | All primary chapters in source integration checks | Normalized text preservation through conversion |
| Evidence cards | 44 cards | Selected relevant passages read; claim type and limitation recorded |
| Dossiers and broader references | All seven books represented | Original chapter-based analysis with selective passage verification |
| Behavioural tests | Recorded in release evaluation notes | Actual tested scenarios and limitations, not general proof |

The whole corpus is available to an agent through the local tools. This release does not claim that every word was reread by a model or every interpretive sentence independently verified. Machine import and keyword matching are not semantic reading.

## Verification approach

Evidence-card locators re-find a phrase in the cited chapter. Integration checks confirm that locators exist, but that alone is not proof that the paraphrase is sound; broad interpretation should be revisited against full chapters when it becomes decisive.

The new importer corrects the previous conversion's inclusion of promotional chapters and its heading structure. Original EPUBs remain unchanged.

## Known limits and expansion

The importer supports the documented edition layout, not arbitrary EPUBs. The chapter catalogue is a retrieval aid, not an exhaustive event chronology, spell dictionary or entity graph. Topic frequency can rank incidental references above decisive evidence.

The ten workflow modules allow deeper chapter reading, larger ensemble analysis and cross-book investigation without imposing a fixed model context budget. Future development should add useful, source-backed claims and concrete evaluations rather than treating library size itself as quality.
