# Writing Samples and Comparative Evaluation

This directory contains comparative original writing samples produced across three distinct conditions to evaluate the practical impact of the **Harry Potter Writing Skill** on prose style, canon accuracy, and narrative craft.

## Evaluation Conditions

| Condition | Description | Resources |
|---|---|---|
| **Condition A (Unaided)** | Baseline prompt generation without skill guidance or book access. | Standard frontier model memory only. |
| **Condition B (Skill Only)** | Generation guided by the full skill, craft workflows, and bilingual glossary. | `SKILL.md`, `hungarian-prose.md`, `hungarian-terminology.md`, `hu-glossary.json`. No book files. |
| **Condition C (Skill + Books)** | Generation guided by the skill **and** grounded in the primary book corpus. | Complete skill plus searchable Hungarian & English 7-book corpus (`original-sources`). |

---

## Benchmark Scenario: The Library Slip (Hogwarts, October 1993)

**Prompt Brief:**
> Write an original 450–600-word scene in Hungarian, set at Hogwarts in October 1993. Two original third-year students, Lina and Tobias, must return a library permission slip before dinner. The slip is stuck behind a high corridor grille. Tobias proposes using a Summoning Charm, but neither student has learned it. Let their attempted solution produce one small, plausible magical complication and require a real choice. Lina is the sole close-third-person viewpoint. Include a short encounter with the caretaker and his cat, and mention the Charms teacher. Use Hungarian book terminology for the setting and named canon people. Give Tobias his own practical motive. Start mildly comic, then let the deadline matter. End with a concrete consequence, not a stated moral. Do not introduce knowledge of later-book revelations.

---

## Evaluation Results

Scored on a 0–4 scale across the five dimensions defined in [abc-0.3.0-protocol.md](../skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md):

| Dimension | Condition A ([test-run-A](test-run-A-unaided.md)) | Condition B ([test-run-B](test-run-B-skill.md)) | Condition C ([test-run-C](test-run-C-skill-books.md)) |
|---|:---:|:---:|:---:|
| **1. Hungarian Language & Rhythm** | 3.0 / 4 | 3.8 / 4 | **4.0 / 4** |
| **2. Terminology & Canon Fidelity** | 1.5 / 4 | 3.9 / 4 | **4.0 / 4** |
| **3. Continuity & Viewpoint** | 3.2 / 4 | 3.8 / 4 | **3.9 / 4** |
| **4. Narrative Quality & Craft** | 2.5 / 4 | 3.7 / 4 | **4.0 / 4** |
| **5. Brief Compliance** | 3.8 / 4 | 4.0 / 4 | **4.0 / 4** |
| **Total Score** | **14.0 / 20** | **19.2 / 20** | **19.9 / 20** |
| **Word Count** | 506 words | 511 words | 557 words |

---

## Key Qualitative Findings

### 1. Eliminating Machine-Translation and Hallucinated Names
- **Condition A (Unaided)** fell into classic LLM translation pitfalls:
  - Translated *Madam Pince* literally as *"Pince asszony"* (unaware that the canonical Hungarian name is **Madam Cvikker**).
  - Hallucinated a hybrid village name *"Roxmocs"* instead of the canonical **Roxmorts** (*Hogsmeade*).
  - Used the English incantation *"Accio"* instead of the official Hungarian translation **Invito**.
- **Conditions B & C (Skill-Aided)** correctly used the verified bilingual glossary (`hu-glossary.json`): **Madam Cvikker**, **Roxmorts**, **Invito**, and the descriptive term **begyűjtőbűbáj**, with zero translation discrepancies.

### 2. Replacing Melodrama with Authentic Prose Rhythm
- **Condition A** relied on standard AI prose tropes: visceral organ reactions (*"Lina gyomra összerándult"*), puffed breaths (*"hátraszegte a fejét, és fújtatott"*), and exaggerated dialogue tags (*"hangja már-már hisztérikusan csengett"*).
- **Conditions B & C** implemented the syntactic focus and restraint outlined in `hungarian-prose.md`:
  - Natural Hungarian information order (*"Nem a tudásszomj hajtotta: Madam Cvikker zálogként megtartotta az átváltoztatástan-vázlatát..."*).
  - Free indirect discourse replacing internal exposition.
  - Urgency driven by physical mechanics and time constraints rather than emotional overstatement.

### 3. Deepening Sensory Texture with Primary Book Grounding
- In **Condition C**, direct access to the 7-book corpus introduced specific, resonant canon details:
  - Professor Flitwick's exact levitation lesson formulation: *"Huss és pöcc!"* (*Bölcsek köve*, Chapter 10).
  - Exact physical portrayal of Mrs Norris: *"ványadt, porszürke macska"*, *"lámpaszerű, sárga szemével"* (*Bölcsek köve*, Chapter 8).
  - Authentic caretaker threat: forcing students to clean out the owlery (*"kiganézni a bagolyházat"*).
  - A vivid, physically grounded magical complication: the levitation charm catches the heavy, rusted flue damper, forcing a choice between ruined robes and lost notes, culminating in soot-covered faces and missed dinner.

---

## File Index

- [test-run-A-unaided.md](test-run-A-unaided.md): Condition A finished scene and resource note (506 words).
- [test-run-B-skill.md](test-run-B-skill.md): Condition B finished scene and resource note (511 words).
- [test-run-C-skill-books.md](test-run-C-skill-books.md): Condition C finished scene and resource note (557 words).
- [sample-1-unaided.md](sample-1-unaided.md): Exploratory unaided drafting sample.
- [sample-2-skill-no-books.md](sample-2-skill-no-books.md): Exploratory skill-only drafting sample.
- [sample-3-skill-with-books.md](sample-3-skill-with-books.md): Exploratory skill-plus-corpus drafting sample.
