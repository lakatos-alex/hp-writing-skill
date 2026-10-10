# Book knowledge contract v1

This is the data and private-research contract for the book datasets. It
does not certify semantic completeness. Policy-2 validation requires the scoped
PS inventory to represent all 17 chapters; this does not certify full reading.

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

## Published pilot schema (superseded by policy 2 below)

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

## Policy 2 retrieval extensions

The PS entity envelopes remain schema version 1 with `policyVersion: 2`.
`magic.json` is now an identified-spell index: all entries have `kind: spell`.
The historical wider magic taxonomy above describes the superseded pilot.
Each occurrence needs non-empty human `practitionerIds`, `vocalisation`
(`spoken`, `non-verbal`, `unreported`) and `wand` (`used`, `not-used`,
`unreported`). Proven non-verbal events additionally need `nonVerbalEvidence`.
Missing dialogue is not that evidence. Spell `identification` has a basis
(`named-in-book`, `named-effect-in-book`, `later-explicit-identification`) and
paired evidence. Later identifications require `availableFrom` and evidence at
that later anchor. Optional `laterIncantation` keeps its own provenance.
Occurrence anchors remain PS-only. Do not infer an incantation from an effect.

All four indexes (`characters`, `magic`, `places`, `objects`) have original
`description`, `aliases` and bilingual `searchTerms`. Identity IDs are unique
across the indexes. `termMentions` contain short paired locators, an anchor and
`status: paired-term-checked`; they indicate literal mentions, not appearances.
Presence and contextual evidence remain separate. Character animals are typed
as `animal` and omitted from the `people` category.

Place entries have `placeKind`, labels, evidence and limits. Object entries have
`objectKind` and `magicStatus` (`demonstrated`, `ordinary`, `not-established`).
`demonstrated` means the property is established by an event or explicit book
description/testimony; it does not mean every advertised property was tested on
the page. Evidence kinds retain that distinction. `ordinary` records have no
object-specific magical property described; `not-established` leaves the
question open for that book.
Optional `classificationSource` links to a checked Wiki object classification;
it cannot establish book events, translations or enchantment. Notable ordinary
objects are eligible; unspecified furniture does not automatically merit rows.

Coverage policy version 2 counts `places` and `objects` as well as the older
categories. `retrievalPass` records the scoped inventory, chapter anchors,
review method and source hashes. Reading states remain partial unless actual
full-chapter reading supports a stronger claim. `legacyPilot` preserves the
earlier counters as history; it is not the active candidate ledger. Current
accepted counts refer to the finalized four-index records, not legacy glossary
or fact cards. `terms` and `facts` count cards with explicit `bookUsage.PS`,
not every headword with a lexical PS reference. Excluded observations are documented in the contributor review,
not counted as finalized index entries. The scoped inventory is not a claim of
exhaustive literary or independent semantic review.

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
