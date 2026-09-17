# Writing Samples and Comparative Evaluation

This directory documents empirical, side-by-side writing evaluations of the **Harry Potter Writing Skill** (`harry-potter-fanfic`). The evaluation measures the skill's impact on literary voice, canon fidelity, magical constraints, and prose mechanics across both **English** (primary) and **Hungarian** (localized).

---

## Evaluation Methodology & Conditions

All tests are conducted under the standardized protocol defined in [abc-0.3.0-protocol.md](../skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md). Each condition is run in a fresh, isolated agent context with the same model:

| Condition | Description | Available Resources |
|---|---|---|
| **Condition A (Unaided)** | Baseline prompt generation without skill guidance or corpus access. | Parametric model memory only. |
| **Condition B (Skill Only)** | Generation guided by the complete skill, task workflows, and style rules. | `SKILL.md`, craft references, and bilingual glossary. Zero book files. |
| **Condition C (Skill + Books)** | Generation guided by the skill **and** grounded in the primary book corpus. | Complete skill plus searchable English & Hungarian 7-book corpus (`original-sources`). |

---

## Benchmark Scenario: The Library Slip (Hogwarts, October 1993)

**The Brief:**
> Write an original 450–600-word scene set at Hogwarts in October 1993. Two original third-year students, Lina and Tobias, must return a library permission slip before dinner. The slip is stuck behind a high corridor grille. Tobias proposes using a Summoning Charm, but neither student has learned it. Let their attempted solution produce one small, plausible magical complication and require a real choice. Lina is the sole close-third-person viewpoint. Include a short encounter with the caretaker and his cat, and mention the Charms teacher. Use canon book terminology for the setting and named canon people. Give Tobias his own practical motive. Start mildly comic, then let the deadline matter. End with a concrete consequence, not a stated moral. Do not introduce knowledge of later-book revelations.

---

## Part 1: English Benchmark Evaluation (Primary)

### Scorecard (0–4 scale per dimension, max 20)

| Dimension | Condition A ([test-run-A-en](test-run-A-en-unaided.md)) | Condition B ([test-run-B-en](test-run-B-en-skill.md)) | Condition C ([test-run-C-en](test-run-C-en-skill-books.md)) |
|---|:---:|:---:|:---:|
| **1. Prose Style, Rhythm & Voice** | 3.2 / 4 | 3.8 / 4 | **4.0 / 4** |
| **2. Terminology & Canon Fidelity** | 3.5 / 4 | 3.9 / 4 | **4.0 / 4** |
| **3. Continuity & Viewpoint** | 3.5 / 4 | 3.8 / 4 | **3.9 / 4** |
| **4. Narrative Quality & Craft** | 2.8 / 4 | 3.8 / 4 | **4.0 / 4** |
| **5. Brief Compliance** | 3.8 / 4 | 4.0 / 4 | **4.0 / 4** |
| **Total Score** | **16.8 / 20** | **19.3 / 20** | **19.9 / 20** |
| **Word Count** | 528 words | 543 words | 581 words |

### Qualitative Findings (English)

1. **Restraint over Generic AI Melodrama:**
   - **Condition A (Unaided)** defaulted to generic action-film tropes: *"Lina sighed"*, sharp echoing clangs, visceral bodily responses, and generic dialogue (*"Dropped a quill, Mr. Filch"*).
   - **Conditions B & C (Skill-Aided)** established genuine British boarding-school rhythm: Tobias balancing on his upturned satchel, heels slipping on the brass buckles, smelling faintly of crushed beetles from afternoon Potions.
2. **Pedantic Canon Accuracy (Curriculum & Character Lore):**
   - In **Condition C**, primary book grounding introduced authentic period lore:
     - Miranda Goshawk's *Standard Book of Spells, Grade Four* as the actual textbook where *Accio* is first introduced.
     - Ravenclaw Quidditch captain Roger Davies as the specific student in line for the reserved book.
     - Filch's specific October 1993 threat of locking the castle gates and leaving rule-breakers out for the Dementors.
     - Flitwick's canonical purple ink flourish on the counter-signature.
3. **Plausible Magical Mechanics & Earned Consequence:**
   - Rather than arbitrary spell damage, the complication stems from castle physical geography: the flue's counterweight plate tilting open over the foundation drop. Lina's choice has immediate physical cost (a torn slip resulting in a strict thirty-minute counter-study restriction while roast beef aromas drift from the Great Hall).

---

## Part 2: Hungarian Benchmark Evaluation (Magyar változat)

### Scorecard (0–4 scale per dimension, max 20)

| Dimension | Condition A ([test-run-A-hu](test-run-A-unaided.md)) | Condition B ([test-run-B-hu](test-run-B-skill.md)) | Condition C ([test-run-C-hu](test-run-C-skill-books.md)) |
|---|:---:|:---:|:---:|
| **1. Magyar nyelv és mondatritmus** | 3.0 / 4 | 3.8 / 4 | **4.0 / 4** |
| **2. Terminológia és kánonhűség** | 1.5 / 4 | 3.9 / 4 | **4.0 / 4** |
| **3. Folytonosság és nézőpont** | 3.2 / 4 | 3.8 / 4 | **3.9 / 4** |
| **4. Irodalmi és narratív minőség** | 2.5 / 4 | 3.7 / 4 | **4.0 / 4** |
| **5. Brief / követelmények betartása** | 3.8 / 4 | 4.0 / 4 | **4.0 / 4** |
| **Összpontszám** | **14.0 / 20** | **19.2 / 20** | **19.9 / 20** |
| **Szószám** | 506 szó | 511 szó | 557 szó |

### Főbb tanulságok (Hungarian Highlights)

1. **Gépi fordítási hibák és hallucinációk kiszűrése:**
   - **Condition A (Unaided)** súlyos hibákat vétett: *Madam Pince* nevét tükörfordította (*"Pince asszony"*), Hogsmeade-nek kitalált egy nem létező hibrid nevet (*"Roxmocs"*), és az angol *Accio* formulát használta.
   - **Conditions B & C (Skill-Aided)** a hivatalos kánoni neveket alkalmazta: **Madam Cvikker**, **Roxmorts**, **Invito** (mint kimondott ige), és **begyűjtőbűbáj** (mint leíró varázslatnév).
2. **Természetes magyar topik-fókusz és központozás:**
   - Az angolos mondatszerkezetek helyett érvényesült a magyar információszerkezet, a gondolatjeles dialógustipográfia (`–`), és a felesleges mutató névmások mellőzése.
3. **Kánonhű könyves rétegek (Condition C):**
   - Flitwick ikonikus varázslástan-utasítása: *„Huss és pöcc!”*.
   - Mrs Norris pontos regénybeli leírása (*„ványadt, porszürke macska”*, *„lámpaszerű, sárga szemével”*).
   - Frics fenyegetőzése a bagolyház-ganéztatással, és Madam Cvikker kérlelhetetlen bürokráciája.

---

## File Index

### English Sample Texts (Primary)
- [test-run-A-en-unaided.md](test-run-A-en-unaided.md): Condition A finished scene and resource note (528 words).
- [test-run-B-en-skill.md](test-run-B-en-skill.md): Condition B finished scene and resource note (543 words).
- [test-run-C-en-skill-books.md](test-run-C-en-skill-books.md): Condition C finished scene and resource note (581 words).

### Hungarian Sample Texts (Magyar szövegek)
- [test-run-A-unaided.md](test-run-A-unaided.md): Condition A finished scene and resource note (506 words).
- [test-run-B-skill.md](test-run-B-skill.md): Condition B finished scene and resource note (511 words).
- [test-run-C-skill-books.md](test-run-C-skill-books.md): Condition C finished scene and resource note (557 words).

### Exploratory Samples
- [sample-1-unaided.md](sample-1-unaided.md): Exploratory baseline drafting sample.
- [sample-2-skill-no-books.md](sample-2-skill-no-books.md): Exploratory skill-only drafting sample.
- [sample-3-skill-with-books.md](sample-3-skill-with-books.md): Exploratory skill-plus-corpus drafting sample.
