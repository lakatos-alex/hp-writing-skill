# Book-one knowledge expansion: implementation plan

Status: planned, not implemented. Prepared 2026-09-17 against clean commit `7ad1b74` (version 0.3.1). The user requested a complete plan and executable task briefs, not implementation or publication in this session. Use [agent tasks](book-one-agent-tasks.md) to execute this plan in fresh, bounded contexts.

## Objective and completion boundary

Expand Philosopher's Stone / Bölcsek köve into a systematically reviewed English–Hungarian knowledge slice. Cover all identifiable characters and all magic in that book, including named spells, unnamed effects, failed attempts and reported magic. Expand associated terminology and useful writing evidence. Preserve seven-book retrieval, existing IDs, source privacy and the concise skill router. Revise public documentation against actual evidence, then prepare a source-free v0.4.0 candidate.

“Complete” means every narrative chapter in both supplied editions has a recorded full review, every discovered candidate has a disposition, and independent omission review is finished. It does not mean every possible interpretation is settled or every edition has been covered. Do not invent a target entry count and fill to it. Publish the inclusion policy, reviewed editions, chapter coverage and remaining uncertainty with the result.

This iteration excludes companion books, films, games, later-book deep dives and a full rewrite of craft guidance. Later volumes reuse the contracts below. Existing later-book knowledge remains available but must not leak into a book-one answer.

## Verified starting point

| Area | Observed state | Consequence |
|---|---|---|
| Distribution | Self-contained `skills/harry-potter-fanfic`; GitHub / skills CLI; v0.3.1 tag exists locally | Keep installed resources inside that directory; development plans remain outside it |
| Router | 11 task workflows; question-led reference loading | Retain this architecture; add narrow book/entity routes |
| Runtime | Dependency-free Node CLI, documented Node 22+; CI Node 22/24 on Windows/Linux | No vector database, server, API dependency or mandatory Python for this work |
| Source structure | 199 paired chapter anchors; PS has 17 chapters in each language | Review PS1–PS17; alignment is chapter-level, not sentence-level |
| Glossary | 151 total; 60 have at least one PS anchor; those include 12 `person` records and 3 `spell` records | Counts are locator coverage, not a complete character census |
| PS spell records | Alohomora, Petrificus Totalus, Wingardium Leviosa / Vingardium Leviosa | Missing coverage is demonstrable: paired PS13 search finds Locomotor Mortis |
| Common names | `glossary --query Harry` returns zero records | Unchanged names also need glossary records; do not only collect translated names |
| Evidence | 50 cards overall, 6 with PS anchors | Expand decision-relevant claims; keep scope and limits |
| Character prose | Series-wide interpretive map | Useful for broad arcs, unsafe as the default first-year character packet |
| Retrieval | Glossary has pagination but no book filter; facts has no pagination or book filter | Add bounded retrieval without silently breaking existing output contracts |
| Verification | Existing source verifier checks the first anchor/locator, plus extraction and overlap | New evidence needs per-record, per-anchor validation; lexical hits still require semantic review |

Existing PS fact IDs: `currency-ratios`, `house-sorting`, `mirror-desire`, `trio-competence`, `lily-protection`, `pomfrey-medical-authority`.

Local validation during orientation: package validator passed; 48/48 automated tests passed; source verification passed for 199 EN chapters, 162 HU EPUB chapters and 37 HU PDF chapters; 151 paired term locators and 50 fact locators were found. Runtime was Node v26.4.0; this does not substitute for the release Node 22/24 matrix. No full semantic reading of book one or independent writing evaluation was performed in this planning session.

Private source inputs are the existing `original-sources/en/01-philosophers-stone.epub`, `original-sources/hu/01-philosophers-stone.epub`, matching Markdown and local catalogues. Preserve originals and conversion artifacts. Both PS sources are EPUBs; the known degraded HU Deathly Hallows PDF is irrelevant to PS terminology verification.

## Documentation audit to resolve

1. `references/coverage.md` still says 44 cards; actual data has 50. Generate or mechanically check current counts rather than introducing another hand-maintained count.
2. README and `samples/README.md` present 16.8/19.3/19.9 and 15.2/18.9/19.8 scores as an empirical comparison. The separate preserved `evals/release-0.3.0.md` reports calibrated two-scenario means A 18.25, B 17.75, C 18.00, judge disagreement, unknown exact writer model, and no demonstrated overall advantage. Trace each table to its own artifacts; do not assume the datasets are identical or erase either archive. Remove unsupported superiority claims and label illustrative/coordinator scores separately from the calibrated experiment.
3. The samples index says every major/minor release is benchmarked. Verify each release or replace that universal statement with the actual archive scope.
4. README uses `Begyejtő bűbáj`; the maintained glossary records `begyűjtőbűbáj`. Correct against the paired source. Audit spelling and distinguish formula from descriptive name throughout.
5. Replace categorical claims that the skill “enforces” prose quality or “verifies facts” with the actual boundary: guidance plus deterministic retrieval and structural checks. First attestation does not establish curriculum restriction; a scenario's explicit restriction is different from a universal canon rule.
6. Shorten repetitive promotional framing. Keep installation, capabilities, examples, source-free behavior, optional source setup, limits, evidence and license easy to find. Preserve the existing opening quote and project-origin narrative unless there is an evidence or attribution problem; the latest commits explicitly restored them. Tighten the origin story without adding model capability claims or private project details.
7. Avoid implying “official book register” means imitation of the translator. State original Hungarian prose with verified terms and broad craft guidance.
8. Keep historical evaluation files immutable. Corrections belong in current indexes or a dated erratum. Current coverage and release evidence must remain distinct from historical snapshots.

## Model and quota strategy

These are task-assignment recommendations, not measured performance claims for this repository. Official guidance describes Luna as suitable for clear extraction/classification work, Terra for everyday reasoning/tool use and Sol for difficult judgment. It recommends the lowest adequate reasoning effort. Model availability is also exposed in this local session. See [official model guidance](https://learn.chatgpt.com/docs/models) and [usage guidance](https://learn.chatgpt.com/docs/pricing), checked 2026-09-17.

| Work | Recommended model | Effort | Escalate when |
|---|---|---|---|
| Inventory, schema-shaped candidate extraction, mechanical documentation updates | `gpt-5.6-luna` | medium; low for mechanical edits | Repeated omissions, unclear referents or failed schema adherence |
| CLI/schema implementation, candidate consolidation, chapter omission review | `gpt-5.6-terra` | medium | Compatibility design or persistent cross-file failures |
| Hungarian ambiguity, attribution, magic taxonomy disputes | `gpt-5.6-sol` | medium | A decisive passage still leaves an architectural or interpretive conflict |
| Exceptional unresolved design dispute | `gpt-6-astra` | medium, only that dispute | Use a short evidence packet, not the entire project |
| Final docs and candidate packaging | Luna edits, Terra checks | low/medium | Unsupported claims or verification gaps |

Run sequentially by default: fresh context per task, one owner for shared JSON and CLI files. More agents do not inherently save quota. Do not use Max/Ultra by default, repeatedly reread whole corpora, or rerun completed prose tests for a better score. Track model, effort, source characters read, tool calls, retries, elapsed time and tokens/usage where exposed. Mark unavailable measurements unavailable. Account-wide quota changes are confounded by other tasks; do not claim exact savings from them or from API pricing.

Pilot Luna on PS1 and PS10, then have Terra independently check those chapters. Continue with Luna if the reconciled pilot has no unresolved omissions or unsupported promoted claims. If it misses an inclusion class, revise the prompt and recheck the affected pilot; use Terra for that class if the problem recurs. Escalate individual records, not the entire book. This is an operational quality gate, not proof of model equivalence.

## Book-one inclusion policy

### Terminology

Capture named people, nonhuman individuals, places, houses, objects, potions and ingredients, creatures, organizations, school subjects, magical sports/equipment, money and culturally specific expressions. Preserve the existing category enum; use `concept` for subjects or sports unless a demonstrated retrieval need justifies a compatible extension.

Record EN and HU separately from each edition. Unchanged terms count. Keep aliases and titles separate from canonical display forms. Search Hungarian inflections and inspect context; do not infer a translation from matching chapter membership. Record edition spelling/capitalization variants without globally replacing deliberate manuscript choices. Do not turn an unnamed effect into an invented official Hungarian term.

### Characters

Include everyone named or individually identifiable in PS: on-stage speakers, silent individuals, named animals/creatures, ghosts, portraits, historical or deceased people, book authors and chocolate-frog-card names, and people mentioned only in dialogue. Record appearance versus mention. Treat aliases as one identity where PS supports that identity; do not import later names or secret identities. Distinct unnamed participants get chapter-local IDs and descriptive labels only when the scene individuates them; crowds are groups, not invented people. Track these inclusion classes in the coverage ledger.

Keep a catalogue entry even if there is insufficient evidence for a psychological profile. Add concise PS-only writing notes only when supported; mark interpretation explicitly. Full-series interpretation stays in existing series references. Separate what the reader learns from what a character knows. Absence from a scene or search result does not prove ignorance.

### Magic

Capture four dimensions independently: the named effect, any spoken formula, what happened, and evidence status. Include unnamed/accidental magic, object enchantments, potions, transformations, counteractions, reported uses and unsuccessful or disputed attempts. Classify boasts, jokes and supposed spells as such; do not promote them to effective magic. A magical object's whole history is not a spell.

For each occurrence, distinguish demonstrated success, demonstrated failure, practice, explanation/testimony and uncertain result. Record practitioner/target only if supported. Do not infer a universal range, counterspell, skill level or year of instruction from one use. Later franchise incantations must not be attached to PS unnamed effects. The actual word count of spell formulas is not a coverage target.

### Additional knowledge worth promoting

Add original evidence cards for school access/rules and consequences, lessons actually shown, purchasing/money, transport, Quidditch procedures, geography that affects action, object custody, clue disclosure and relationships changed by specific acts. Treat explanations and suspicions as testimony where appropriate. Avoid a chapter-by-chapter retelling, exhaustive plot transcript, or speculative timetable. A fact earns a place if it changes a plausible writing/research decision.

## Architecture and data contracts

Keep `hu-glossary.json` and `facts.json` as the maintained cross-book registries. Do not shard or rename existing IDs merely to make the library larger. Add small per-book datasets:

```text
skills/harry-potter-fanfic/data/books/ps/
  characters.json
  magic.json
  coverage.json
```

Character and magic records reference glossary/fact IDs instead of copying terminology and claims. Existing English/Hungarian chapter catalogues remain unchanged unless an actual extraction defect is found. Add a short discoverable PS reference section to `book-ps.md`; split a reference only if it becomes too large for targeted reading. No embeddings or external service is needed.

### Shared evidence shape

Add optional `evidence` to legacy records and require it for every new or materially revised PS record. Each item contains:

- `anchor`: existing PS1–PS17 anchor.
- `kind`: `event`, `testimony`, or `interpretation`.
- `enLocator`, `huLocator`: minimal distinguishing text, verified in context; no long excerpts.
- `scope`: concise situational qualifier; optional `speakerId` for testimony.
- `status`: `paired-context-reviewed` only after both contexts were read and the referent checked.

An added legacy glossary/card record must also satisfy its existing required fields and statuses; keep `anchors[0]` consistent with its legacy locator. Evidence arrays allow different locators at different anchors. Existing untouched records remain valid without a fabricated retrospective upgrade. Edition hashes and detailed read offsets belong in private provenance; public coverage can point to existing source manifests.

No unresolved translation is marked verified. Candidate records with missing HU counterparts remain private and unresolved, or receive a documented exclusion. In character/magic datasets, a descriptive label may be explicitly `editorial-label` with `glossaryId: null`; that is not an official term. Evidence must still establish the underlying referent in both languages.

### Character record v1

Top-level file: `{ schemaVersion: 1, book: "PS", entries: [...] }`.

Each entry: `id`, `glossaryId` (string or null), `labelEn`, `labelHu`, `labelKind` (`canonical-term` or `editorial-label`), `entityKind` (`human`, `ghost`, `portrait`, `animal`, `magical-being`, `group`, `unknown`), `presence` (array of `{anchor, mode: "appears"|"mentioned"}`), `evidence`, `factIds`, `writingNotes` (array of `{text, kind, anchors}`), and `limits`.

`id` is stable kebab-case. Presence and evidence are PS-only. References must resolve. Separate unknown species from identity uncertainty in `limits`. A book-one reveal belongs with its revelation anchor; no implied knowledge inheritance between reader and characters. `writingNotes` may be empty for a mere mention. Avoid ungrounded birth dates, ages and later occupations.

### Magic record v1

Same file envelope. Each entry: `id`, `kind` (`spell`, `accidental`, `potion`, `enchanted-object`, `magical-effect`, `claimed-magic`), `nameGlossaryId` (nullable), `incantationGlossaryId` (nullable), `labelEn`, `labelHu`, `labelKind`, `occurrences`, `factIds`, `limits`.

Each occurrence: `anchor`, `mode` (`performed`, `practised`, `reported`, `explained`, `attempted`), `outcome` (`success`, `failure`, `uncertain`, `not-demonstrated`), `practitionerIds`, `targetIds`, original `summary`, and paired `evidence`. Empty actor arrays mean unspecified, not nobody. Group repeated occurrences of the same supported mechanism; do not merge distinct unnamed effects solely because a later source supplies a common spell name.

### Coverage and private work ledger

Public `coverage.json`: schema version, book, policy version, source-manifest references, all 17 chapter anchors, per-language review state, category counts generated from accepted records, unresolved/excluded counts, review date and declared limitations. Allowed review states: `not-started`, `partial`, `reviewed`, `independently-reviewed`. Mark complete only when the gate below passes. Do not include raw passages, absolute paths or private prompts.

Private `original-sources/research/ps/`: candidate files, chapter interval ledger, omission reviews and disputes. Each candidate records chapter, category, provisional referent, locators, disposition (`pending`, `accepted`, `merged`, `excluded`, `unresolved`), reason and accepted ID when applicable. Every chapter/category gets an explicit checked-empty or candidate list. The interval ledger records language, anchor, extraction hash, start/end character offsets and reader identity/model. Coverage union must span `[0, totalCharacters)` without gaps; that establishes recorded reading coverage, not understanding. The reviewer records semantic disposition separately.

## Retrieval and loading changes

Extend the current CLI, keeping old commands and exports compatible:

- `glossary --book PS`: filter by verified occurrence anchors; do not label a later-only entry book-one merely because an alias appears in its notes. Existing response envelope stays unchanged.
- `facts --book PS --limit 10 --offset 0 --page`: new opt-in paged envelope `{total, offset, nextOffset, facts}`. Preserve legacy array output when `--page` is absent; reject pagination flags without `--page` with a helpful error. Validate kinds and books, including empty results.
- `characters --book PS [--query TEXT] [--id ID] [--limit 10] [--offset 0]` and `magic` with the same shape: `{total, offset, nextOffset, entries}`. Matching an exact ID returns at most one entry; combining ID and query is an error. Limit query matching to public identity, label and summary fields, not hidden provenance.
- `coverage --book PS`: compact coverage report. Unsupported/unreviewed books produce a clear coverage response or error, not a false empty “complete” library. Define and test one convention.

Book filtering alone cannot make series-wide prose spoiler-safe. For legacy terms, return verified PS terminology plus PS-specific evidence, and suppress later-scope notes in explicit book mode unless a reviewed PS usage note exists. Keep ordinary unfiltered glossary output unchanged. For facts whose wording spans books, omit them from strict PS retrieval unless a separately reviewed PS-safe statement exists. Document this behavior; never equate a PS anchor with a spoiler-safe seven-book claim.

Start a normal scene with accepted story state and one workflow. Retrieve up to 10 relevant entities/terms/cards; read one focused reference if needed. Use PS character records before the series character map for first-year/cutoff tasks. Retrieve more pages only for unanswered questions. Comprehensive research may read the entire assigned chapter; it must not stop after the CLI's default 12,000 characters. Use `read --json` offsets until `nextOffset` is null, independently for EN and HU. A suggested 8,000-character window is a work-unit choice, not a model context-limit claim.

Do not put model IDs, private development procedure or quota promises in consumer `SKILL.md`. Keep its policy model-neutral. Resolve the present Hungarian routing ambiguity: one primary workflow, then only the necessary Hungarian section/lookup, rather than requiring two complete workflows after saying one is sufficient.

## Execution order and gates

| Task | Deliverable | Depends on | Owner recommendation |
|---|---|---|---|
| T0 | Frozen baseline, private ledger, pilot candidates | None | Luna medium |
| T1 | Final schema contracts, validators, bounded CLI, synthetic tests | T0 baseline | Terra medium |
| T2 | Independently reconciled PS1/PS10 pilot | T0, T1 contracts | Luna extraction; Terra review |
| T3 | Remaining 15 paired chapter candidate files | T2 pass | Luna medium, one chapter per context |
| T4 | Deduplicated glossary, characters, magic and facts | T3 | Terra medium, one shared-file owner |
| T5 | Independent full-book omission/semantic audit and corrections | T4 | Terra medium; Sol for disputes |
| T6 | Model-neutral routing, PS dossier, tool/coverage docs | T5 | Terra medium |
| T7 | README and sample-index evidence reconciliation | T5, T6 | Luna edits; Terra review |
| T8 | Integration, installed-copy smoke test, release candidate report | T7 | Terra medium |

T1 may be developed while research is pending only in an isolated branch/worktree; do not have agents concurrently edit shared files. Task prompts, allowlists and acceptance criteria are in the companion task file. No agents are dispatched by this plan.

### Test requirements

Public tests use synthetic original passages and fixtures, not copied book text. Add malformed schema, dangling IDs, duplicate IDs, invalid anchors, absent paired evidence, invalid enum, non-NFC diacritics, identity aliases, mention-only characters, unnamed effects, failed magic and later-book contamination tests. Verify output compatibility, pagination boundaries and errors; test a Unicode/HU query and source-free installed queries.

Source checks locally re-find every new evidence locator at its own anchor in both languages and detect stale source hashes. Validate reviewed interval coverage and candidate dispositions separately. Extend overlap scanning to all tracked publication Markdown/JSON, including root README and samples, rather than only the installed skill; exclude ignored sources and private ledgers. Keep explicit attribution/short-quote review separate from the exact 30-word scan.

For semantic acceptance: reviewer rereads all 17 paired chapters, including negatives/checked-empty cells; inspects every new character/magic record, translation and evidence card; reconciles aliases and finds omissions without relying solely on the extractor's candidate list. Keep initial reviewer findings before corrections. A native Hungarian editorial review is desirable and required before a broad naturalness/quality claim; if unavailable, report that limitation rather than blocking a factual package from honest release.

If actual writing guidance changes beyond retrieval instructions, apply the existing writing-quality protocol with fresh contexts, equal briefs and frozen baseline/candidate packages. Record exact model/effort when exposed and actual resources opened. Use held-out scenarios; do not reuse the library-slip scenario as the only evidence. Keep mechanical results separate from blinded judgments. No benchmark run is authorized or claimed by this planning artifact itself.

### Completion checklist

- [ ] All 34 language/chapter reviews and independent omission reviews recorded.
- [ ] All character/magic inclusion classes covered; candidate dispositions have no unexplained pending rows.
- [ ] Unresolved core identity/translation/effect claims resolved, excluded with reasons, or explicitly prevent the relevant completeness claim.
- [ ] All new published evidence context-reviewed in both editions; all cross-references and locators pass.
- [ ] Glossary includes unchanged names and separates incantations from effect names.
- [ ] PS retrieval excludes later revelations and is bounded; old commands remain compatible.
- [ ] Current docs reflect actual counts, limits, tests and evaluation provenance.
- [ ] Package validator, automated suite, source checks, diff review and installation smoke checks pass.
- [ ] Node 22/24 Windows/Linux checks recorded, or the missing environments explicitly pending.
- [ ] No original book, extracted passage collection or private ledger enters staged files or artifacts.

## Version and release plan

Recommend v0.4.0 for the additive book-one datasets and retrieval interface. Do not bump metadata or create a tag during planning. At implementation completion, check current local and remote tags again; choose an unused version if v0.4.0 has appeared. Never overwrite a tag.

Update SKILL metadata, current README pinned install, PUBLISHING examples and new release notes consistently. Do not rewrite version numbers in historical v0.3.0/v0.3.1 evaluations. Search for all version-bearing current files before editing. Keep the package self-contained and inspect staged paths/diff for private text.

Before any tag: run checks below, install the local candidate through the skills CLI from a separate temporary working directory, inspect installed files/version, and run installed glossary, facts, characters, magic and coverage queries without books. Separately test installed source reading with explicit local source path. Verify a source-free skill archive's actual members and commands. Record the tested commit hash and preserve the previous tag for rollback.

Publication requires a later explicit user request. Only then commit/review the approved candidate as appropriate, create an annotated unused tag on that exact commit, push and create the GitHub release, wait for remote CI, and smoke-test the exact remote tag in another temporary directory. Local validation, local tag, remote tag, GitHub Release, remote installation and skills.sh visibility are separate statuses.

```sh
node tools/validate_package.mjs
node --test tools/tests/*.test.mjs
node tools/verify_sources.mjs original-sources
git diff --check
```

Also run the new book-one schema/coverage checks delivered by T1. The source verifier must not silently skip required HU evidence. A candidate report lists actual commands, runtime versions, pass/fail counts, unresolved editorial issues and pending remote checks. A failed completeness gate means release notes say partial coverage or the candidate remains unfinished; never label it complete to meet a version milestone.
