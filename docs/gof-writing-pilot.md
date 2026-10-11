# GoF retrieval and writing pilot — 2026-10-11

This contributor diagnostic used seven first drafts and two fresh model judges.
It did not establish that more Markdown improves writing. The existing optional
references remain available; no substantial craft or book-dossier expansion was
made. The CLI supplied useful bounded facts, but successful lookup and correct
use of those facts are separate requirements.

The [frozen scenario suite](../tools/quality-suite-gof.json) contains the complete
original prompts, resource conditions and judge-only invariants. The
[review bundle](../samples/gof-retrieval-pilot/results.json) preserves all seven
original narratives, first judgments, flagged factual findings and descriptive results.
It omits private source passages, catalogues, snapshots and raw resource notes.
This is a reviewed summary bundle, not an executable harness export.

## Design and resources

The Hungarian scene places two original fourth-year pupils before the first
task. It tests an audible Summoning attempt with an initially unseen result,
an unexplained green flash, a secondhand classroom report, apparent teacher
identity, edition-specific terms, object custody and a costly decision.
The English scene takes place after the third task, before the final feast.
It tests repair versus document accuracy, the real/impostor distinction,
unavailable fresh testimony, recovered equipment, an electrical substitute,
observable information routes and final custody. Neither prompt supplies the
edition spelling or the requested equipment detail.

Each writer received a fresh context, the same scenario brief and a 450–600
word range. The primary comparison held the router, scripts and data constant:
30 common files had identical frozen hashes. The candidate added only five
existing references: `book-gof.md`, `magic-constraints-and-tools.md`,
`context-and-evidence.md`, `scene-state.md` and `hungarian-terminology.md`.
Consultation was optional. No new guidance was added before the comparison.

| Condition | Available resources | Scenarios |
|---|---|---|
| CLI/data | Router, scripts and bundled data; no optional references or books | HU practice; EN ward record |
| Existing Markdown | Same CLI/data plus the five references | HU practice; EN ward record |
| Unaided | Brief only; prior model knowledge uncontrolled | HU practice |
| Optional sources | Existing Markdown condition plus bounded EN/HU primary context | HU practice |
| Required sources | Same resources; relevant paired GoF14/20/35 context required before drafting | HU practice |

Source windows were limited to GoF14/18/20/35, 4,000 characters per read and
12,000 returned source characters per language, including search snippets.
The optional writer reported 6,805 HU characters and no EN passage reading;
the required writer reported approximately 11,280 EN and 10,200 HU characters.
The largest reported read was 3,500 characters. A separate resource-only agent
checked notes and budget arithmetic; no forbidden access was reported.
Access restrictions were instructions on a shared filesystem, not an enforced
sandbox. Complete execution traces and exact snippet totals were not independently
audited. The optional writer also reported truncated reference display.

All outputs were saved before judging; held-out English drafts were saved
before any practice judgment. First drafts were retained, including failures.
Judges received anonymised narratives in opposite orders, identical factual
context and the same rubric, without resource conditions or author notes.
The five dimensions were language, character, causality, continuity and terminology,
each scored 0–4. Word counts were mechanical checks, outside literary scores.
Scores are model judgments, not measured literary quality or human editorial approval.
The inherited model settings were retained; the exact served model revision
and reasoning-effort identifiers were unavailable and were recorded as unknown.

## Recorded outcomes

Vectors below follow language / character / causality / continuity / terminology.
Counts use the harness's whitespace tokens, excluding punctuation-only markers.

| Draft | Words | Length check | Judge 1 | Judge 2 |
|---|---:|---|---|---|
| CLI/data, HU | 495 | Pass | 4/4/4/4/3 | 4/4/4/4/3 |
| Existing Markdown, HU | 460 | Pass | 4/4/4/4/3 | 4/4/4/4/3 |
| CLI/data, EN | 538 | Pass | 4/4/4/3/4 | 4/3/4/4/4 |
| Existing Markdown, EN | 554 | Pass | 3/4/4/4/4 | 4/4/4/4/4 |
| Unaided, HU | 445 | Fail | 4/4/3/4/3 | 4/4/4/4/3 |
| Optional sources, HU | 492 | Pass | 3/4/4/4/4 | 3/4/4/4/4 |
| Required sources, HU | 471 | Pass | 4/4/4/3/4 | 3/4/4/4/4 |

| Paired comparison | Judge 1 | Judge 2 |
|---|---|---|
| Existing Markdown vs CLI/data, HU — primary | Existing Markdown | Tie |
| Existing Markdown vs CLI/data, EN — primary | Tie | Existing Markdown |
| Existing Markdown vs unaided, HU — exploratory | Existing Markdown | Existing Markdown |
| Existing Markdown vs optional sources, HU — exploratory | Existing Markdown | Existing Markdown |
| Existing Markdown vs required sources, HU — exploratory | Required sources | Tie |

The primary comparisons have no agreed preference. The exploratory source
comparisons separate terminology from prose: both source-reading drafts used
the indexed Hungarian `Adava Kedavra` form, while both source-free drafts and
the unaided draft used `Avada Kedavra`. Judges assigned that local departure
to terminology only. Better terminology did not consistently produce a preferred
scene. Both judges noted an awkward sentence in the optional-source draft.

Judge 1 flagged an ambiguous bench sightline in the required-source draft and
prospective final drawer storage in the CLI/data English draft; Judge 2 did
not find those material continuity defects. Judge 2 requested verification
of McGonagall's invented eyewitness report. Subsequent bounded GoF36 context
supports that report: she was assigned guard duty and describes the Dementor's
immediate attack in the room. First ratings/findings remain unchanged; no
numeric rescoring was performed. Judge 1 also identified a quotation error
in its own first evidence: `El fog szakadni` was a paraphrase; the actual
story quotation is `Elszakad`, also cited in that judgment. The preserved
first record and coordinator clarification keep that distinction visible.

## Tool sufficiency and Markdown decision

The CLI/data English writer retrieved the needed identity, testimony,
equipment and electrical-limit records. The source-free Hungarian writers
instead obtained the curse spelling from the selective, unfiltered series
glossary. The baseline did not consult the GoF typed spell route; the candidate
queried the typed Summoning record but not the typed Killing Curse record.
The GoF spell data already supplies the edition-specific spelling.

There were three failed GoF-filtered glossary calls in the HU baseline,
two failed GoF-filtered facts calls in the EN baseline and one in the EN
candidate. Both legacy layers still have PS-only book projections. Their
errors now explain that scope and direct callers to `semantic --book GoF`.
These error-message changes were made after the writing snapshot froze and
were checked mechanically; this pilot does not measure their effect on writers.
The installed router and GoF JSON line endings were also normalised to LF after
freezing, without changing guidance or data content. Typed GoF records were
unchanged during writing and judging.

`hp.mjs` is usable for scoped referent/formula lookup and bounded primary
reading. It does not decide what a viewpoint character knows, certify an
unseen effect or guarantee natural prose. Keep the existing optional craft
references and use the appropriate book-specific route for authoritative terms.
No repeated gap after correct typed retrieval demonstrated a benefit from
expanding Markdown, so none was added. Tool-routing failures were addressed
in the CLI rather than by duplicating facts into another prose guide.

This is a small diagnostic pilot, with one draft per cell and two judges using
the same inherited model family. Strongly scaffolded briefs, high scores near
the scale ceiling and scenario/language confounding limit inference. Opposite
orders do not separate positional bias from reviewer variation. The English
brief is held out from tuning, not an independent replication. No general
superiority or open-ended chapter-writing sufficiency is established.
Blinded Hungarian-speaking human review remains pending. A future substantial
Markdown addition needs a specific unresolved need and a new frozen, held-out
paired test before any benefit claim.

## Mechanical validation

All 88 automated tests passed. Package and book-data validation passed. Source
verification checked 997 records and 6,956 semantic locators against the local
EN/HU sources; those checks do not establish exhaustive semantic reading.
An isolated `npx skills add` copy installation contained 104 identical product
files, no books, and passed PS/CoS/PoA/GoF lookups without `HP_SOURCES`.
The installation used a local source-free snapshot, not a GitHub publication.
