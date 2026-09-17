# Writing Samples & Versioned Evaluation Archive

This directory maintains the permanent, versioned test archive and test bench harness for the **Harry Potter Writing Skill** (`harry-potter-fanfic`).

Every major and minor release is benchmarked across standardized scenarios to measure the skill's impact on prose rhythm, canon fidelity, curriculum constraints, and bilingual localization across both **English** (primary) and **Hungarian** (localized).

---

## Test Bench Harness & Methodology

All evaluations follow the standardized empirical testing protocol defined in [`skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md`](../skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md).

For each versioned test, independent agent contexts execute identical briefs under three isolated resource conditions:

| Condition | Description | Available Resources |
|---|---|---|
| **Condition A (Unaided)** | Baseline prompt execution without skill guidance or book access. | Parametric model memory only. |
| **Condition B (Skill Only)** | Execution guided by the complete installed skill, task workflows, and style rules. | `SKILL.md`, craft references, and bilingual glossary. Zero book files. |
| **Condition C (Skill + Books)** | Execution guided by the skill **and** grounded in the primary book corpus. | Complete skill plus searchable English & Hungarian 7-book corpus (`original-sources`). |

### Standardized Benchmark Scenario: The Library Slip (October 1993)

> Write an original 450–600-word scene set at Hogwarts in October 1993. Two original third-year students, Lina and Tobias, must return a library permission slip before dinner. The slip is stuck behind a high corridor grille. Tobias proposes using a Summoning Charm, but neither student has learned it. Let their attempted solution produce one small, plausible magical complication and require a real choice. Lina is the sole close-third-person viewpoint. Include a short encounter with the caretaker and his cat, and mention the Charms teacher. Use canon book terminology for the setting and named canon people. Give Tobias his own practical motive. Start mildly comic, then let the deadline matter. End with a concrete consequence, not a stated moral. Do not introduce knowledge of later-book revelations.

---

## Versioned Test Archive

Each release stores its raw model outputs, resource-use logs, and blind scorecards in an immutable versioned directory:

- [**`v0.3.0` Benchmark Archive**](v0.3.0/README.md):
  - English benchmark: [Unaided](v0.3.0/test-run-A-en-unaided.md) (16.8/20), [Skill Only](v0.3.0/test-run-B-en-skill.md) (19.3/20), [Skill + Books](v0.3.0/test-run-C-en-skill-books.md) (19.9/20).
  - Hungarian benchmark: [Unaided](v0.3.0/test-run-A-unaided.md) (15.2/20), [Skill Only](v0.3.0/test-run-B-skill.md) (18.9/20), [Skill + Books](v0.3.0/test-run-C-skill-books.md) (19.8/20).
  - Preliminary exploratory runs: [Sample 1](v0.3.0/sample-1-unaided.md), [Sample 2](v0.3.0/sample-2-skill-no-books.md), [Sample 3](v0.3.0/sample-3-skill-with-books.md).

---

## Latest Executive Summary (v0.3.0 Baseline)

### English Benchmark Scorecard (0–4 scale per dimension, max 20)

| Dimension | Condition A ([test-run-A-en](v0.3.0/test-run-A-en-unaided.md)) | Condition B ([test-run-B-en](v0.3.0/test-run-B-en-skill.md)) | Condition C ([test-run-C-en](v0.3.0/test-run-C-en-skill-books.md)) |
|---|:---:|:---:|:---:|
| **1. Prose Style, Rhythm & Voice** | 3.2 / 4 | 3.8 / 4 | **4.0 / 4** |
| **2. Terminology & Canon Fidelity** | 3.5 / 4 | 3.9 / 4 | **4.0 / 4** |
| **3. Continuity & Viewpoint** | 3.5 / 4 | 3.8 / 4 | **3.9 / 4** |
| **4. Narrative Quality & Craft** | 2.8 / 4 | 3.8 / 4 | **4.0 / 4** |
| **5. Brief Compliance** | 3.8 / 4 | 4.0 / 4 | **4.0 / 4** |
| **Total Score** | **16.8 / 20** | **19.3 / 20** | **19.9 / 20** |
| **Word Count** | 528 words | 543 words | 581 words |

### Hungarian Benchmark Scorecard (0–4 scale per dimension, max 20)

| Dimension | Condition A ([test-run-A-hu](v0.3.0/test-run-A-unaided.md)) | Condition B ([test-run-B-hu](v0.3.0/test-run-B-skill.md)) | Condition C ([test-run-C-hu](v0.3.0/test-run-C-skill-books.md)) |
|---|:---:|:---:|:---:|
| **1. Magyar nyelvhelyesség és mondatritmus** | 3.0 / 4 | 3.8 / 4 | **4.0 / 4** |
| **2. Terminológia és kánonhűség** | 3.4 / 4 | 3.9 / 4 | **4.0 / 4** |
| **3. Időrend, nézőpont és kontinuitás** | 3.4 / 4 | 3.8 / 4 | **3.9 / 4** |
| **4. Narratív minőség és írástechnika** | 2.4 / 4 | 3.6 / 4 | **3.9 / 4** |
| **5. Brief megfelelés és korlátok** | 3.0 / 4 | 3.8 / 4 | **4.0 / 4** |
| **Összpontszám** | **15.2 / 20** | **18.9 / 20** | **19.8 / 20** |
| **Szószám** | 433 szó | 452 szó | 584 szó |

---

## Procedure for Testing Future Updates

When validating subsequent skill releases (e.g. `v0.3.1`, `v0.4.0`):
1. **Spawn Independent Contexts**: Execute the standardized scenario under Conditions A, B, and C in isolated sessions.
2. **Preserve Raw Outputs**: Save completed manuscripts into a dedicated directory (`samples/v<version>/`).
3. **Run Blind Rubric**: Score across the 5 dimensions without condition labels.
4. **Append to Archive**: Document findings in `samples/v<version>/README.md` and add the entry to the index above.
