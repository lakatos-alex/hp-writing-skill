# Broad-context writing comparison — 11 October 2026

The eight-story comparison passed its preset favourable criteria. Both judges
preferred the book-access draft over the bare draft on both briefs. However,
all eight stories passed the factual checks, including the bare drafts, and
more resources did not consistently beat the intermediate conditions. This
supports continuing the project; it does not establish general superiority.

## What was tested

Two coherent briefs were written under four matched conditions, with one story
per fresh writer. The Hungarian brief followed Hermione and Ron handling
borrowed school materials after the fifth-year Ministry encounter. The Map,
DA coins, wizard chess and Summoning drew relevant context from the first five
books without requiring a retrospective tour. The English brief followed
Fleur and Bill providing supper at Shell Cottage, using HBP/DH context about
food, annotated instructions, provenance and private knowledge.

| Condition | Available resources |
|---|---|
| Bare | Brief and general model knowledge |
| Skill | Router, selected reference Markdown and the public JSON library; manual reads, no scripts |
| Tool | The same guidance and public data, plus source-free `hp.mjs` retrieval |
| Books | The same tool resources, plus bounded primary context in English and Hungarian |

The five-book typed inventory passed its gate before writing. Resource bytes,
briefs, rubric and source-supported factual key were frozen beforehand. The
key had seven checks per brief, including the difference between a character's
guess and an identified casting. First drafts were retained unchanged.

Two independent judges received opaque story IDs, briefs, the same rubric and
factual key, with reversed ordering. Resource assignments and usage notes were
withheld. Writers necessarily knew their own resources, so this was blinded
judging with separated writers rather than strict double blindness.

## Results

Scores use five dimensions on a 0–4 rubric. Each mean below combines two
stories and two judges; these small ordinal averages are descriptive.

| Condition | Language | Character | Causality | Continuity | Terminology |
|---|---:|---:|---:|---:|---:|
| Bare | 3.50 | 3.75 | 3.50 | 4.00 | 4.00 |
| Skill | 4.00 | 4.00 | 4.00 | 3.50 | 4.00 |
| Tool | 4.00 | 3.50 | 4.00 | 4.00 | 4.00 |
| Books | 4.00 | 4.00 | 3.75 | 4.00 | 4.00 |

Every draft met the 450–600-word requirement. Mechanical counts ranged from
491 to 552 words; resource notes were excluded. Author estimates sometimes
used different counters, and were preserved alongside these measurements.
Neither judge flagged a factual failure or unresolved factual finding.
Facts not asserted were marked not applicable rather than treated as failures.

All twelve pairwise preferences are retained below. A split is disagreement,
not a win or a tie. “Books” means the complete fourth resource condition.

| Pair | First-five brief: judge 1 / judge 2 | Later-book brief: judge 1 / judge 2 |
|---|---|---|
| Bare / Skill | Skill / tie | Skill / Skill |
| Bare / Tool | Tool / Tool | Tool / tie |
| Bare / Books | Books / Books | Books / Books |
| Skill / Tool | Tool / Tool | Skill / Skill |
| Skill / Books | Skill / Books | Skill / Books |
| Tool / Books | Tool / Tool | Tool / Books |

The favourable gate required complete artifacts, factual competence, no agreed
material canon failure in the book condition, no agreed craft regression
against bare, and at least one agreed book-condition win with no agreed bare
win or split in those two comparisons. All components passed. This gate does
not require the book condition to dominate Skill or Tool; the table shows
that it did not.

The judges agreed on a spatial weakness in the Skill Hungarian draft: its
close viewpoint reports precise placement in Harry's trunk without clearly
establishing Hermione's sightline. One judge found the Books version's practical
cost too deferred. Both marked an explicit cost explanation in the bare
English draft as less effective than its surrounding action. One found Bill's
title-based argument in the Tool draft simplistic. These are local craft
findings, not proof that a resource condition caused a defect.

## What this says about the tool and guidance

For the first-five brief, the tool retrieved the relevant edition formula,
Map, coins, chess and diary records. The manual-data writer also found those
facts, with more direct file handling. This shows that the tool can serve this
lookup workload; it does not show that every natural-language query works.

For the later brief, `facts --query food` returned useful evidence. Prince and
non-verbal queries returned no matching fact or glossary entries. HBP/DH have
dossiers and selective references, but not typed inventories. These empty
results identify data coverage limits, not missing canon. Completing those
inventories is the appropriate next step.

Primary reading confirmed or changed practical decisions: Hermione's recovery
became a physical cost; the later writer corrected Bill's immediate purpose
and kept private information out of Fleur's viewpoint. The fourth-condition
writers used meaningful paired context, rather than merely inspecting an index.

There is no demonstrated need for a larger SKILL router or another compulsory
writing workflow. Existing continuity guidance already covers the sightline
problem. The useful documentation correction is narrower: list OotP as a
supported typed scope, describe its limits, and update counts. Writers had
noticed that the old documentation stopped at GoF while OotP queries worked.
README and consumer reference updates followed the favourable result; no
writing workflow was expanded.

## Checks and limits

Reported primary access was reconstructed against the frozen sources. The
first-five writer returned 13,835 English and 13,832 Hungarian characters;
the later writer returned 13,560 and 12,355. Searches count toward those totals,
including repeated excerpts. All stayed below 16,000 per language, with read
windows below 4,000. The drafts had no exact normalized 30-token overlaps with
the selected source chapters. This is a limited overlap check, not an
originality or style certification.

Resource auditing checked writer reports and reconstructable budgets. It did
not capture a complete independent tool trace or enforce filesystem isolation.
General model knowledge remains uncontrolled. The exact served model and
reasoning effort were unavailable; inherited settings were used. Antigravity
and Gemini were not used. These are model judgments, without human Hungarian
editorial signoff, cross-model replication or statistical claims. Differences
between the two briefs also involve language, setting and difficulty; they
cannot be attributed solely to which books have typed inventories.

A usage-limit interruption left one complete judgment saved. It was retained;
only the missing second evaluator was restarted with the identical packet.
No completed story or judgment was replaced. The unused earlier large design
was never run. Original stories, packets, mappings, resource notes and scores
remain preserved as private development artifacts.

The [five-book inventory checkpoint](ootp-semantic-review.md) records data
scope and review limits. Independent full-book reading remains incomplete.
HBP and DH should follow the same inventory method before cross-book
consolidation and subsequently selected supplementary editions.

After the documentation update, all 105 automated tests, package validation
and source checks passed locally on Node.js 26.4.0. An isolated `npx skills add`
installation matched all 110 candidate skill files byte-for-byte, contained
no books or private catalogues, and passed five-book and language lookup
smoke checks. This work remains local; no new version, tag or remote release
was published.
