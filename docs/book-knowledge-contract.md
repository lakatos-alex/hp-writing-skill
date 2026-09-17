# Book knowledge contract v1

This is the frozen data and private-research contract for the book datasets. It
does not certify semantic completeness: an empty dataset is valid but remains
unreviewed.

## Private PS candidates

Private files live under `original-sources/research/ps/` and must end in
`.local.json`. A chapter worker writes `candidates-PSN.local.json` using:

```json
{
  "schemaVersion": 1,
  "book": "PS",
  "anchor": "PS1",
  "sourceHashes": {"en": "sha256", "hu": "sha256"},
  "categories": {
    "characters": {"checkedEmpty": false, "candidates": []},
    "magic": {"checkedEmpty": false, "candidates": []},
    "terms": {"checkedEmpty": false, "candidates": []},
    "facts": {"checkedEmpty": false, "candidates": []}
  }
}
```

Every category is present. It has either `checkedEmpty: true` and no
candidates, or `checkedEmpty: false` and its candidate list. Each candidate has
`id`, `chapter`, `category`, `provisionalReferent`, `locators`, `disposition`,
`reason`, and `acceptedId` (nullable). `id` is a stable kebab-case local ID;
`chapter` equals the envelope anchor; `category` equals its containing key;
`disposition` is `pending`, `accepted`, `merged`, `excluded`, or `unresolved`.
`locators` has `en` and `hu` minimal non-empty locator strings. Add original,
concise `claim` or `summary`, `ambiguities`, and proposed merge target fields as
needed. Candidates without a reliable paired locator stay `unresolved` or are
excluded; they do not become published evidence.

The aggregate `progress.local.json` remains compatible with T0. Per language,
each reviewed interval contains `start`, `end`, `totalCharacters`,
`sourceHash`, and `reader`; it is valid only when its hash equals the aggregate
`sourceHashes` value. Intervals may overlap, but their union must be continuous
from zero to `totalCharacters` before that language can be `reviewed` or
`independently-reviewed`. Candidate dispositions in the aggregate must equal
the sum of candidate files when those files are supplied to validation.

The private validator also accepts a single-chapter progress file with the
shape `{schemaVersion, book, anchor, sourceHashes, languages: {en, hu}}`,
where each language contains `reviewedIntervals` and `semanticStatus`. When
this per-chapter shape omits `candidateDisposition`, candidate files are still
schema-checked but no aggregate disposition reconciliation is required; when
the counters are present, they must reconcile with the supplied candidate
files.

## Published datasets

`data/books/ps/characters.json` and `magic.json` have
`{ "schemaVersion": 1, "book": "PS", "entries": [] }`.

Character records have stable `id`, nullable `glossaryId`, `labelEn`,
`labelHu`, `labelKind` (`canonical-term` or `editorial-label`), `entityKind`,
`presence`, `evidence`, `factIds`, `writingNotes`, and `limits`. Presence is a
non-empty PS-only list of `{anchor, mode}` where mode is `appears` or
`mentioned`. `entityKind` is `human`, `ghost`, `portrait`, `animal`,
`magical-being`, `group`, or `unknown`. Writing-note kinds and evidence kinds
are `event`, `testimony`, or `interpretation`.

Magic records have stable `id`, `kind`, nullable `nameGlossaryId` and
`incantationGlossaryId`, `labelEn`, `labelHu`, `labelKind`, `occurrences`,
`factIds`, and `limits`. Kind is `spell`, `accidental`, `potion`,
`enchanted-object`, `magical-effect`, or `claimed-magic`. Each occurrence has a
PS anchor, mode (`performed`, `practised`, `reported`, `explained`, or
`attempted`), outcome (`success`, `failure`, `uncertain`, or
`not-demonstrated`), actor-ID arrays, original concise summary, and paired
evidence.

Evidence is `{anchor, kind, enLocator, huLocator, scope, status}` with optional
`speakerId`. Its status is exactly `paired-context-reviewed`; it contains short
locators rather than excerpts. Published PS records must use NFC strings,
resolve glossary, fact, and character references, and cannot contain a
non-PS anchor. `editorial-label` requires its corresponding glossary ID to be
null.

`coverage.json` lists all PS1--PS17 in both languages. Review states are
`not-started`, `partial`, `reviewed`, and `independently-reviewed`; the empty
scaffold is deliberately `not-started` and never represents complete coverage.

## Validation commands

Run `node tools/validate_book_knowledge.mjs` for published records. Add
`--private-progress original-sources/research/ps/progress.local.json` to verify
the private ledger, and `--candidates DIR` to reconcile private candidate
counts. Source checking is separate: `node tools/verify_sources.mjs
original-sources` verifies every published PS evidence locator in both supplied
languages when PS evidence exists.

To check private chapter candidate files against the actual bilingual PS
catalogues, run:

```text
node tools/check_research_candidates.mjs --sources original-sources --candidates original-sources/research/ps
node tools/check_research_candidates.mjs --sources original-sources --candidates original-sources/research/ps --anchor PS10
```

The candidate checker verifies catalogue source hashes, chapter existence, and
that each English and Hungarian locator is a non-empty contiguous literal
match after the same NFKC and case-insensitive handling used by `search()`.
This is lexical retrieval verification only. It reports neither source reading
coverage nor semantic or editorial completeness; those remain separate review
questions.
