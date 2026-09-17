# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

**Version 0.3.1.** A literary craft framework and deterministic canon engine for researching, planning, writing, and revising original Harry Potter fiction in **English** and **Hungarian**, grounded in the complete seven-book baseline.

---

## Why This Skill Exists

When asked to write fiction set at Hogwarts, standard large language models consistently drift into predictable failures:

- **Bodily and stylistic clichés:** Characters take constant *deep, shuddering breaths*, knuckles turn white on wands every other paragraph, and narration lapses into generic purple prose.
- **Caricatured personalities:** Ron is reduced to loud quips about food, Hermione recites textbook definitions like a search engine, and Draco delivers flat melodrama.
- **Unearned and anachronistic magic:** Third-year students cast non-verbal N.E.W.T.-level spells without consequence, or summon objects with *Accio* years before it appears in the curriculum.
- **Hollywood banter over British boarding school reality:** Snappy contemporary dialogue replaces the dry situational comedy, institutional absurdity, practical student motives, and social hierarchy of British school life.
- **Broken Hungarian localization:** Without explicit craft rules, models produce awkward machine calques, misplace Hungarian focus and word order, use English quotation marks instead of dialogue dashes (`–`), and mangle canonical terms (*Madam Pince* becoming *"Pince asszony"*, or using literal translations instead of Tóth Tamás Boldizsár's established book vocabulary).

This skill enforces primary book evidence, strict point-of-view discipline, physical cause and effect, and age-appropriate magical mechanics.

---

## Quick Install

Install directly via the [skills CLI](https://www.skills.sh/docs/cli) from GitHub:

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

For a pinned release:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.3.1 --skill harry-potter-fanfic
```

For manual installation, copy the self-contained [skill folder](skills/harry-potter-fanfic/SKILL.md) into your agent's skills directory.

---

## Core Principles

- **Primary Seven-Book Canon:** The seven original novels outrank films, companion books, wiki summaries, and model recollection.
- **Grounded British Boarding School Realism:** Student actions are constrained by class schedules, physical exhaustion, school rules, caretaker patrols, and genuine social friction.
- **Progressive Disclosure (11 Subskills):** Agents load only the specific reference modules required for their task rather than polluting context with unnecessary lore.
- **Deterministic Local Engine (`hp.mjs`):** A zero-dependency Node.js CLI providing literal text searches, bilingual passage alignment, knowledge/custody state validation, and Hungarian terminology linting.
- **Bilingual Canon Parity:** 199 paired English and Hungarian chapters, 33 topical indices, and 145 verified canon terms with exact chapter locators.

---

## Subskill Directory

Load only the workflow and reference matching your active task:

| Domain | Subskill | Purpose & Supporting References |
|---|---|---|
| **Canon & Evidence** | [Canon Research](skills/harry-potter-fanfic/references/workflow-canon-research.md) | Resolve contradictory claims and verify book evidence ([Source Index](skills/harry-potter-fanfic/references/source-index.md), [Evidence Rules](skills/harry-potter-fanfic/references/evidence-and-extensions.md)) |
| | [Story Architecture](skills/harry-potter-fanfic/references/workflow-story-architecture.md) | Plan multi-chapter arcs and book-length structures ([Book Dossiers](skills/harry-potter-fanfic/references/book-dossiers.md)) |
| | [Knowledge Development](skills/harry-potter-fanfic/references/workflow-knowledge-development.md) | Systematically research characters or themes across the series ([Coverage](skills/harry-potter-fanfic/references/coverage.md)) |
| **Craft & Production** | [Chapter Production](skills/harry-potter-fanfic/references/workflow-chapter-production.md) | Draft full chapters with pacing and turn mechanics ([Scene Craft](skills/harry-potter-fanfic/references/scene-craft-and-revision.md)) |
| | [Revision Studio](skills/harry-potter-fanfic/references/workflow-revision.md) | Tighten structure, polish rhythm, and audit voice ([Prose Profiles](skills/harry-potter-fanfic/references/prose-profiles.md)) |
| | [Character Workshop](skills/harry-potter-fanfic/references/workflow-character-workshop.md) | Calibrate voices, relationships, and distinct student motives ([Character Map](skills/harry-potter-fanfic/references/canon-character-map.md)) |
| | [Mystery Design](skills/harry-potter-fanfic/references/workflow-mystery.md) | Construct clues, false leads, and revelations ([Information Concealment](skills/harry-potter-fanfic/references/information-and-concealment.md)) |
| **Magic & World** | [Magic Engineering](skills/harry-potter-fanfic/references/workflow-magic-engineering.md) | Enforce curriculum limits, spell costs, and physical constraints ([Magic Constraints](skills/harry-potter-fanfic/references/magic-constraints-and-tools.md)) |
| | [Worldbuilding & Daily Life](skills/harry-potter-fanfic/references/workflow-worldbuilding.md) | Structure school routines, economy, and institutions ([Locations & Daily Life](skills/harry-potter-fanfic/references/locations-and-daily-life.md)) |
| | [Continuity & AU](skills/harry-potter-fanfic/references/workflow-continuity.md) | Track divergences, timelines, and knowledge custody ([Era Ledger](skills/harry-potter-fanfic/references/era-and-knowledge-ledger.md)) |
| **Localization** | [Hungarian Writing](skills/harry-potter-fanfic/references/workflow-hungarian-writing.md) | Produce original Hungarian prose matching the official book register ([Hungarian Prose](skills/harry-potter-fanfic/references/hungarian-prose.md), [Terminology](skills/harry-potter-fanfic/references/hungarian-terminology.md)) |

---

## Empirical Benchmark: A/B/C Evaluation

We evaluated the skill across three isolated conditions under a standardized testing protocol ([abc-0.3.0-protocol.md](skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md)).

**Scenario:** Two original third-year students (Lina and Tobias) in October 1993 must retrieve a stuck library permission slip before dinner without knowing the Summoning Charm. Strict close-third perspective, caretaker encounter, practical consequences.

| Condition | Description | English Score (max 20) | Hungarian Score (max 20) | Key Qualitative Difference |
|---|---|:---:|:---:|---|
| **A (Unaided)** | Raw model baseline without skills or corpus. | **16.8** | **15.2** | Relied on cinematic tropes (*"stomach dropped"*, echoing clangs), shallow banter, and awkward machine-translated phrasing in Hungarian. |
| **B (Skill Only)** | Guided by craft rules, subskills, and glossary; zero book texts. | **19.3** | **18.9** | Distinct student motives, proper topic-focus syntax, physical complications, and canonical Hungarian vocabulary. |
| **C (Skill + Books)** | Guided by the skill and grounded in the primary text corpus. | **19.9** | **19.8** | Exact period curriculum (Miranda Goshawk's Grade 4 textbook for *Accio/Invito*), authentic October 1993 Filch dialogue, and castle physical mechanics. |

Read the complete benchmark breakdown, blind judging criteria, and full generated scenes in [`samples/README.md`](samples/README.md).

---

## A könyvtár zárolt része: Magyar alkotóknak / For Hungarian Writers

> *„A gyűjtemény zárolt részéből azonban csak azok vehettek ki egy-egy könyvet, akik külön tanári engedéllyel rendelkeztek...”*
> — *Bölcsek köve*, 12. fejezet (Tóth Tamás Boldizsár fordítása)

A legtöbb nyelvi modell az angol Harry Potter szövegeken szocializálódott. Amikor magyar jelenetet kell írnia, szinte mindig felületes tükörfordításokhoz nyúl:
- Angol idézőjeleket (`"..."`) tesz a magyar párbeszéd-gondolatjelek (`–`) helyére.
- A mondatok elejét teletömi felesleges mutató névmásokkal és mesterkélt kötőszavakkal (*„hirtelen”*, *„miközben”*, *„úgy érezte, mintha”*).
- Gépiesen fordítja a neveket (*Madam Pince* helyett *„Pince asszony”*, *Hogsmeade* helyett *„Roxmocs”*).

### „Tiltott Részleg” vagy „Zárolt szekció”?

Ez a dilemma pontosan szemlélteti a skill létjogosultságát:
- A rajongói köznyelvben és a nyers tükörfordításokban elterjedt a **„Tiltott Részleg”** kifejezés (az angol *Restricted Section* szó szerinti átvételeként).
- A kanonikus magyar regényekben (PS12, CoS9) Tóth Tamás Boldizsár következetesen **a könyvtár zárolt részeként** vagy **zárolt szekciójaként** nevezi meg a helyet (a köteteket pedig egyszerűen *a tiltott könyvekként* említi).

A felkészületlen AI-memória a fórumok leggyakoribb szavait ismételgeti; ez a skill viszont az elsődleges regényszöveget tekinti referenciának.

### Magyar prózatechnikai alapelvek

1. **Topik-fókusz és szórend:** A magyar mondat hangsúlyát a szórend határozza meg, nem a dőlt betűs szavak halmozása.
   *(„A kulcsot Júlia vitte el” ≠ „Júlia elvitte a kulcsot”)*
2. **Kanonikus kifejezéstár:** A kimondott varázsige az *Invito* (nem *Accio*), a bűbáj neve *Begyejtő bűbáj*, a lebegtetés *Vingardium Leviosa*, a könyvtárosnő pedig *Madam Cvikker*.
3. **Száraz iskolai helyzetkomikum:** A Roxfort valódi ízét nem a cirkuszi varázslatok adják, hanem a szigorú házirend, a büntetőmunkák valós veszélye, a tanárok sajátos szokásai és a kamaszos gyakorlati érdekek.

---

## Example Prompts

```text
Use $harry-potter-fanfic to draft the next scene. Follow Lina's close-third-person
viewpoint, respect third-year curriculum limits, keep Tobias's motive practical,
and let their attempted shortcut lead to an earned physical consequence.

Use $harry-potter-fanfic to audit an upcoming reveal. Map which characters
currently hold the information, identify how the protagonist learns it,
and verify that no prior scene violates the custody chain.

Use $harry-potter-fanfic in Hungarian mode to write a dormitory discussion
following a missed curfew. Apply canonical Hungarian names, enforce topic-focus
sentence order, and use dialogue dashes (–).
```

---

## Local Tools & Command-Line Engine (`hp.mjs`)

Optional deterministic tools run on **Node.js 22+** with zero third-party dependencies:

```sh
# Display help and available commands
node skills/harry-potter-fanfic/scripts/hp.mjs --help

# Ingest books in permissive mode (handles non-standard EPUBs and text novels)
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang en
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang hu

# Search chapters, facts, and glossary entries
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --book PoA --topic food --limit 5
node skills/harry-potter-fanfic/scripts/hp.mjs glossary --query Accio
node skills/harry-potter-fanfic/scripts/hp.mjs facts --query Fidelius
node skills/harry-potter-fanfic/scripts/hp.mjs search --sources /path/to/books --lang en --query "Restricted Section"

# Compare aligned bilingual chapters with independent character offsets
node skills/harry-potter-fanfic/scripts/hp.mjs align --sources /path/to/books --anchor PS12 --max-chars 3000

# Advisory Hungarian terminology linter
node skills/harry-potter-fanfic/scripts/hp.mjs lint-hu --file /path/to/draft.md
```

---

## Roadmap: The Restricted Section (A zárolt szekció)

Planned extensions to the core framework:

1. **Universal Corpus Ingestion:** Native support for varied e-book editions, plaintext manuscripts, and page-aligned PDF sidecars with automated chapter detection.
2. **Character Voice Profiles:** Fine-grained lexical and syntactic guidelines for distinct viewpoints (e.g., Snape's clipped precision, Dumbledore's measured deflection, Hermione's structured explanations).
3. **Causality & Custody Visualizer:** Automated validation of object custody and information transmission across long multi-chapter stories.
4. **Expanded Multilingual Glossaries:** Extending the bilingual architecture to additional official translations (e.g., German, French, Spanish).
5. **Multi-Agent Collaborative Workflows:** Structured co-writing pipelines pairing an archivist agent (canon verification) with a stylist agent (rhythm and viewpoint auditing).

---

## Publication and Maintenance

The skill package is self-contained. Local book files, extracted texts, and user manuscripts are excluded from version control and distribution packages. Consult [`skills/harry-potter-fanfic/PUBLISHING.md`](skills/harry-potter-fanfic/PUBLISHING.md) for archive validation and release guidelines.

---

## Legal & License

Original framework, tools, and documentation are licensed under the [MIT License](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). See [acknowledgments](ACKNOWLEDGMENTS.md).

*Disclaimer:* This is an independent fan-created development tool. It is not affiliated with, authorized, or endorsed by J.K. Rowling, Warner Bros. Entertainment, or any rightsholders of the Harry Potter franchise. All trademarks and copyright in characters, names, and related indicia belong to their respective owners.
