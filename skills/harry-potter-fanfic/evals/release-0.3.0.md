# Version 0.3.0 evaluation

Date: 2026-09-16. Scope: bilingual retrieval, Hungarian guidance and terminology, independent short-scene writing, and release-candidate validation.

## Outcome

The tooling and corpus checks pass. The writing sample does **not** establish an overall advantage for the skill: the calibrated two-scenario means are A 18.25, B 17.75 and C 18.00 out of 20. Judge disagreement is large enough to change the ranking. These are descriptive model judgments, not statistically reliable quality estimates.

The evaluation identified useful, specific improvements: missing common-name lookups, the distinction between an incantation and its descriptive spell name, ambiguous Hungarian handoff/kinship references, and a harness error involving withheld resource notes. The original scenes and scores remain unchanged.

## Runs and resources

The [protocol](abc-0.3.0-protocol.md) defines two identical scenario prompts across three conditions. Each writer started in a fresh independent agent context. All inherited the parent model with no override; an exact model/version identifier was not exposed by the agent results. Development used ChatGPT models, but these results should not be attributed to an inferred model ID.

The initial skill candidate contained 140 glossary records. Its [snapshot manifest](abc-0.3.0/snapshot.json) records file hashes. Resources were restricted by instructions, not a filesystem sandbox; resource-use compliance is based on agent notes and observable artifacts, not proof that unreported access was impossible. Both judges saw anonymised scenes without condition labels; the second read them in reverse order.

| Run | Words | Actual resource use | Judge 1 | Judge 2 | Mean / 20 |
|---|---:|---|---:|---:|---:|
| [A1](abc-0.3.0/A1.md) | 500 | Scenario and general model knowledge only | 19 | 18 | 18.5 |
| [A2](abc-0.3.0/A2.md) | 490 | Scenario and general model knowledge only | 19 | 17 | 18.0 |
| [B1](abc-0.3.0/B1.md) | 485 | Skill guidance and glossary; no books | 19 | 18 | 18.5 |
| [B2](abc-0.3.0/B2.md) | 452 | Skill guidance and glossary; no books | 20 | 14 | 17.0 |
| [C1](abc-0.3.0/C1.md) | 485 | Skill plus selected HU PS8, PS10 and GoF6 contexts | 20 | 19 | 19.5 |
| [C2](abc-0.3.0/C2.md) | 468 | Skill only; books were available but not opened | 19 | 14 | 16.5 |

C is a source-available condition, not guaranteed source use. C1 consulted Hungarian passages, not English passages. C2 cannot demonstrate a benefit from primary-text reading. There was one generation per scenario/condition, no seed control, no human judge and no independent-model-family replication.

A1 and A2 were recovered as complete saved scenes with resource notes after their agents hit a usage limit. Their hashes were fixed before blinding. B/C runs completed normally. No completed A/B/C writing run was repeated after interruption.

## Scoring and calibration

Five dimensions receive 0–4 each: Hungarian language, terminology/canon, continuity/viewpoint, narrative quality and brief compliance. The [calibrated score record](abc-0.3.0/scores-calibrated.json) includes every dimension and each judge's evidence. The [original scores](abc-0.3.0/scores-original.json) and individual judge files are retained for comparison; [artifact hashes](abc-0.3.0/artifact-manifest.json) identify the preserved files.

Two judging issues required the same correction to both judges:

1. The first blind packet omitted resource-use notes without explicitly saying that their presence was checked separately. Both judges deducted for this. All six notes existed; the corrected harness states the judging boundary. Notes remained hidden to preserve blinding.
2. One judge incorrectly preferred `hívóbűbáj` over `begyűjtőbűbáj`. A paired GoF6 check confirms the latter as the edition's descriptive term, distinct from `Accio` / `Invito`. Both judges received this same factual key and saved new ratings separately.

Calibration did not make the judges agree. In B2/C2, `Ben felé nyújtotta a levelet` can be read with Ben as the subject and pronominal `felé`, or initially grouped as an omitted subject acting toward Ben. One judge accepted the contextual reading; the other treated the latter reading as a custody failure. The coordinator treats this as a possible clarity issue, **not a demonstrated object-transfer contradiction**. Kinship references received similarly different readings. One judge also counted some local issues under both their specialist dimension and brief compliance. Those differences are visible in the records; the means are not adjudicated truth.

The clearer shared finding in C2 is reported speech that obscures who promised to act. C1's inspected terminology is supported by the primary text. The sample supports targeted lookup and clarity improvements, not a claim that more source context automatically improves every scene.

## Changes supported by observations

- Added Flitwick, Mrs Norris, Madam Pomfrey, hospital wing and the descriptive Summoning Charm term after unsuccessful B/C lookups. Each was checked in paired source context, bringing the glossary to 145 entries.
- Added a short grammar review for consequential handoffs, possessive references and reported speech. Revised its first wording after judge disagreement so it distinguishes ambiguity from a proven contradiction.
- Corrected blind-packet instructions and added end-to-end harness tests for interrupted-run preservation, immutable snapshots, repeated blinding, scoring and export.
- Kept original scene outputs unchanged. No general ban on pronouns, mandatory name repetition or test-specific plot template was introduced.

## Held-out follow-up

The separate [follow-up scene](abc-0.3.0/retest.md) used a fresh agent and a [post-change skill snapshot](abc-0.3.0/retest-snapshot.json), without books. Its prompt was:

> Write original Hungarian prose 350–450 words: October 1993, two original third-year pupils Nóra and Dénes in an empty classroom. Nóra has borrowed a telescope for her cousin; it is initially in her hands. Dénes offers to carry it upstairs before his practice starts. Nóra must decide whether to entrust it to him, and the scene must show the resulting handoff. Nóra alone knows their Charms teacher promised to collect the telescope after lunch; convey that information to Dénes during the scene. A small non-dangerous mishap complicates the agreement. Stay in Nóra's close-third-person viewpoint, use Hungarian book terminology for any canonical names or spells, give both pupils a practical motive, and end on a concrete action rather than a moral. No imitation of an author or translator.

The complete 385-word artifact and resource note were recovered after another usage-limit interruption. The coordinator verified that Nóra keeps the telescope during the fallen-cap incident, explicitly places it in Dénes's hands, and tells him the teacher's promise before their plan changes. The new Flitwick lookup was used. No books were read. This is an observed, unscored follow-up, not a repeated A/B/C run or proof of a causal improvement. The final ambiguity clarification was made after this follow-up and was not separately regenerated.

## Engineering checks

- Thirty automated tests pass on Windows with Node.js 22.23.2, covering source-free lookup, synthetic EPUB imports, Hungarian navigation/Unicode, corrupt archives, stale hashes, PDF sidecar integration, chapter-pair reading, terminology scanning, continuity events and the evaluation harness.
- Package validation passes: metadata, 199 paired anchors, 145 glossary entries, 44 evidence cards, links and source-publication boundaries.
- The skill-creator frontmatter validator passes. Its PyYAML dependency was installed in an isolated temporary directory, not added to the product.
- Source integration passes: 199 English chapters, 162 Hungarian EPUB chapters, 37 Hungarian PDF chapters, all term/card locators, and no exact 30-word source sequence in public Markdown/JSON.
- The PDF converter's complete page/line accounting and two-engine extraction checks are recorded in [coverage](../references/coverage.md). This does not repair the PDF's original defects.
- A local candidate installation through `npx skills add` succeeded in a separate temporary workspace. Installed glossary lookup, Hungarian chapter lookup, primary-text reading and paired reading succeeded.

An initial attempt to obtain Node 22 through npm failed because of npm's nested install-script configuration. The test run used the official Node binary after SHA-256 verification instead. No project or global npm setting was changed.

These are local candidate checks. They do not establish a published v0.3.0 tag, remote installation, remote CI success or skills.sh listing. Follow the [release procedure](../PUBLISHING.md) for authorised publication.
