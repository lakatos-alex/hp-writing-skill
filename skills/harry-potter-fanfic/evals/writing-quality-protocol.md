# Writing-quality regression protocol

This protocol compares revisions without replacing the preserved [0.3.0 A/B/C evidence](release-0.3.0.md). Freeze prompts, criteria and the baseline before editing the product. The development suite is `tools/quality-suite.json`; copy it into each isolated run directory with hashes. A test rewrite means redesigning the evaluation, not rewriting saved outputs to improve their scores.

## Conditions and sample

Four paired scenes compare the frozen pre-iteration candidate with the revised skill, both without books: Hungarian social comedy, quiet emotional negotiation, spatial action, and English investigative tension. A separate source-use probe compares unaided, revised skill without books, optional retrieval and required paired-language retrieval on the same practice brief. There are eleven fresh writer contexts, one output per cell. This is a diagnostic pilot, not a statistical effectiveness claim. Do not choose the best of several generations.

The earlier public release and the pre-iteration candidate are different baselines. Identify which one was tested. For later releases, retain the last released snapshot as an additional regression baseline. Keep the exact model identifier if exposed; otherwise record inherited model/unknown version. Keep effort and output constraints consistent. Record failures, interruptions and missing cells. Resume complete artifacts instead of rerunning them.

Give writers only their brief, assigned skill snapshot and resource instructions. Do not give them the comparison, rubric findings, preferred result or another writer's scene. Resource restrictions are instructions unless enforced by a sandbox; never claim stronger isolation than exists. The no-books groups cannot use source material. Required retrieval must read relevant context in both languages, then explain outside the prose which decision it informed. Optional retrieval may legitimately choose not to read. Availability, access and useful use are separate observations.

## Separate three kinds of evidence

1. Mechanical checks: saved artifact, immutable hash, 350–450 narrative words, resource-note presence, snapshot identity. Notes and planning do not count toward scene length. These are not prose-quality scores.
2. Editorial dimensions: language and rhythm, character agency/dialogue, causality and scene movement, viewpoint/continuity, terminology/canon. Grade each 0–4 with a cited strength and specific weakness or explicit no-material-defect finding. Score 4 means strong execution, not merely no detectable error; 3 competent with a local weakness; 2 mixed with a material weakness; 1 repeated serious defects; 0 unusable for the brief. Keep dimensions separate rather than treating a total as objective literary quality.
3. Blind paired preference: which scene better fulfils the brief as readable fiction, or tie, with quoted evidence and confidence. The primary signal is the four baseline/candidate comparisons. The source probe is exploratory and reported separately.

Two independent model reviewers see anonymised scenes in opposite presentation orders. Hide condition names, skill resources and resource notes. Explicitly tell judges notes are withheld and mechanically checked. Give the same scenario invariants to both. Do not tell them that any change is intended to improve quality. Order reversal across two reviewers does not isolate position bias from reviewer variability; describe it accurately.

An issue has one primary dimension. Do not subtract again from a generic compliance score. Word count and missing notes stay outside literary dimensions. A reader preference for restraint, exuberance, short sentences or a particular ending is not a universal rule. Explain how a passage helps or hurts this brief. Distinguish contradiction from grammatical ambiguity and stylistic dislike. Accept multiple defensible Hungarian readings; give the exact conflicting propositions before declaring an impossible transfer or knowledge leak. Mark uncertain terminology for verification rather than guessing a correction.

## Decisions and stopping rules

Before reading judgments, freeze the candidate. Keep all outputs and original ratings. If a factual grading key is wrong, give the same correction to all judges and save calibrated ratings separately. Never hide the first result. Report per-dimension changes, both judges' paired preferences, disagreement, mechanical failures and actual retrieval use. Do not collapse four scenes into a claim of general superiority.

Retain a proposed change when it addresses an observed failure or provides a requested controllable behaviour, and the pilot shows no clear new defect attributable to it. Reconsider any change both reviewers identify as harming a paired scene. A split judgment is unresolved, not a win. A quality-gain claim requires replication on fresh held-out briefs and human editorial review; until then describe observed outcomes only. Do not repeatedly tune against the same four scenes. Further revisions after judging need new held-out validation or an explicit untested label.

A Hungarian-speaking human editor should review a blinded pair before public claims of Hungarian naturalness or release-wide quality improvement. Model reviewers are not substitutes for that sign-off. If no human review is available, preserve a ready-to-review packet and record the gate as pending; engineering preparation can continue.

## Method sources

The separation of deterministic checks, model judgments and human review follows [Anthropic's evaluation guidance](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents). Small task-specific context and question-led retrieval follow [context engineering guidance](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). The particular briefs, scoring boundaries and decision rules above are this project's test design, not findings established by those sources.
