# Writing Samples & Versioned Evaluation Archive

This directory preserves versioned writing samples and evaluation records for selected releases and scenarios of the **Harry Potter Writing Skill** (`harry-potter-fanfic`). The archive is evidence for those recorded runs, not a claim that every release has been benchmarked or that the scores establish a general quality ranking. See the [current evaluation note](EVALUATION-NOTE.md).

---

## Test Bench Harness & Methodology

All evaluations follow the standardized empirical testing protocol defined in [`skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md`](../skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md).

For each versioned test, independent agent contexts execute identical briefs under three isolated resource conditions:

| Condition | Description | Available Resources |
|---|---|---|
| **Condition A (Unaided)** | Baseline prompt execution without skill guidance or book access. | Parametric model memory only. |
| **Condition B (Skill Only)** | Execution guided by the complete installed skill, task workflows, and style rules. | `SKILL.md`, craft references, and bilingual glossary. Zero book files. |
| **Condition C (Skill + Books)** | Execution guided by the skill and any primary-text resources explicitly made available for that run. | Skill plus the recorded source resources. |

### Standardized Benchmark Scenario: The Library Slip (October 1993)

> Write an original 450–600-word scene set at Hogwarts in October 1993. Two original third-year students, Lina and Tobias, must return a library permission slip before dinner. The slip is stuck behind a high corridor grille. Tobias proposes using a Summoning Charm, but neither student has learned it. Let their attempted solution produce one small, plausible magical complication and require a real choice. Lina is the sole close-third-person viewpoint. Include a short encounter with the caretaker and his cat, and mention the Charms teacher. Use canon book terminology for the setting and named canon people. Give Tobias his own practical motive. Start mildly comic, then let the deadline matter. End with a concrete consequence, not a stated moral. Do not introduce knowledge of later-book revelations.

---

## Versioned Test Archive

An archived release stores its raw model outputs, resource-use logs, and blind scorecards in an immutable versioned directory:

- [**`v0.3.0` Benchmark Archive**](v0.3.0/README.md):
  - English and Hungarian scene files, resource notes, and historical score summaries are retained unchanged in the archive. Their disputed totals are documented in the [evaluation note](EVALUATION-NOTE.md) rather than repeated as a current ranking.
  - Preliminary exploratory runs: [Sample 1](v0.3.0/sample-1-unaided.md), [Sample 2](v0.3.0/sample-2-skill-no-books.md), [Sample 3](v0.3.0/sample-3-skill-with-books.md).

---

## Traceable release evaluation

The preserved [v0.3.0 release record](../skills/harry-potter-fanfic/evals/release-0.3.0.md) describes two matched scenarios, six judge records, and a shared factual calibration. Its condition means are A 18.25, B 17.75, and C 18.00 out of 20, so this small evaluation did not establish an overall advantage for the skill. The archived scene files remain useful qualitative examples, but they are separate from that traceable two-scenario record. See the [evaluation note](EVALUATION-NOTE.md) for the conflicting historical totals and word counts.

---

## Procedure for Testing Future Updates

When validating subsequent skill releases (e.g. `v0.3.1`, `v0.4.0`):
1. **Spawn Independent Contexts**: Execute the standardized scenario under Conditions A, B, and C in isolated sessions.
2. **Preserve Raw Outputs**: Save completed manuscripts into a dedicated directory (`samples/v<version>/`).
3. **Run Blind Rubric**: Score across the 5 dimensions without condition labels.
4. **Append to Archive**: Document findings in `samples/v<version>/README.md` and add the entry to the index above.
