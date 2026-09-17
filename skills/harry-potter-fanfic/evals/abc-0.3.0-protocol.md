# Hungarian A/B/C writing evaluation protocol

## Design

Two fixed scenarios, each run once in a fresh independent agent context under three resource conditions. This is a small qualitative smoke test, not a statistical estimate of skill effectiveness or an author-similarity benchmark.

- A: scenario only, no writing skills, reference files, web or primary text.
- B: identical scenario plus the complete installed skill, no books or external material.
- C: identical scenario plus the same skill snapshot and both local source collections. Source access is available, not compulsory full-corpus reading.

All conditions use the inherited parent model without a model override. Record identifiers when exposed; do not infer a model version from prose. Give B and C permission to proceed with built-in writing support so companion-installation prompts do not prevent the writing test. Allow all conditions mechanical word counting and saving their own output. No access to other runs, evaluation notes or expected answers. Preserve original outputs, report resources actually used and any resource violations.

Use two independent judges with anonymised, reordered outputs and the same scenario/rubric. Judges receive no condition labels, preferred result or developer diagnosis. Record disagreements and their evidence. The coordinator checks word counts and explicit constraints separately. Model-based judgments are not independent human literary validation.

Resource-use notes are withheld from judges to preserve blinding; the coordinator checks them separately, so their absence from a blind packet must not reduce scene-compliance scores. If a harness error or unsupported terminology premise affects judging, preserve the original ratings, disclose the issue and issue the same correction to both judges. Save calibrated ratings separately; do not rewrite the scenes or silently replace original scores.

## Scenario 1: a school mishap

Write an original 450–600-word scene in Hungarian, set at Hogwarts in October 1993. Two original third-year students, Lina and Tobias, must return a library permission slip before dinner. The slip is stuck behind a high corridor grille. Tobias proposes using a Summoning Charm, but neither student has learned it. Let their attempted solution produce one small, plausible magical complication and require a real choice. Lina is the sole close-third-person viewpoint. Include a short encounter with the caretaker and his cat, and mention the Charms teacher. Use the Hungarian book terminology for the setting and named canon people. Give Tobias his own practical motive. Start mildly comic, then let the deadline matter. End with a concrete consequence, not a stated moral. Do not introduce knowledge of later-book revelations. Return only the finished scene, followed by a separate brief resource-use note. Do not imitate a named author or translator.

## Scenario 2: custody and trust

Write an original 450–600-word scene in Hungarian, set in November 1996. Eszter, a sixth-year Hufflepuff student, and her friend Ben are waiting outside the hospital wing after Ben's younger sister has been injured in an ordinary school accident. Eszter narrates in close third person. At the opening Ben alone holds a sealed letter from his sister; he has not read it. Eszter knows only that the sister asked for her schoolbag. During the scene Ben hands the letter to Eszter, and she reads its request aloud with his agreement: bring a small repaired wooden bird from the bag. The bird is a keepsake, not a miraculous cure. Include the nurse, a reference to the Head of Hufflepuff and a planned trip to Hogsmeade. Use Hungarian book terminology for canon people, house and places. Give the friends distinct ways of managing worry, with one gentle joke that does not belittle the injury. Keep the letter's ownership and both characters' knowledge consistent. End on a small action; do not resolve the medical situation or deliver a moral. Return only the finished scene, followed by a separate brief resource-use note. Do not imitate a named author or translator.

## Scoring

Each judge scores five dimensions from 0 to 4, supplying specific textual evidence for deductions. Total 0–20; retain the dimension scores, not just a single ranking.

| Dimension | What the judge checks |
|---|---|
| Hungarian language | Idiomatic syntax, natural word order, inflection, dialogue punctuation; distinguish actual errors from editorial preference |
| Terminology and canon | Consistent Hungarian names/referents, plausible school magic, date-appropriate knowledge, no invented universal rule |
| Continuity and viewpoint | Information routes, object custody, chronology, Lina/Eszter-only interior access |
| Narrative quality | Character-specific motives, causality, scene turn, rhythm, earned tonal shift, restrained ending |
| Brief compliance | Required beats, length, finished prose, no artificial resolution or missing constraint |

Scale: 4 = meets the dimension with no material defect; 3 = one local weakness; 2 = repeated/local material defects; 1 = serious failure; 0 = absent or incompatible. A high total cannot erase a clear continuity or canon failure. Report averages only as descriptive summaries of these runs.

## Improvement rule

Fix an observed recurring or material failure in the smallest relevant module. Do not teach the evaluation's plot as a universal story formula. Preserve pre-fix outputs. If retesting, use a fresh agent and a held-out scenario, label it as a retest, and keep it out of the original A/B/C comparison. Do not claim an improvement from a rewritten example alone.
