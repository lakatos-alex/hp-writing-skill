# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

> *"Words are, in my not-so-humble opinion, our most inexhaustible source of magic."*
> — Albus Dumbledore (DH pt 2, movie)

**Version 0.3.1.** A craft framework and deterministic canon/reference engine for researching, planning, writing, and revising original Harry Potter fiction in **English** and **Hungarian**, using a seven-book indexed baseline with selective passage verification and semantic knowledge.

---

## ⚡ Why This Skill Exists

In the baseline scenes that motivated this project, recurring failure modes included:

- **Bodily and stylistic clichés:** Characters take constant *deep, shuddering breaths*, knuckles turn white on wands every other paragraph, and narration lapses into generic purple melodrama.
- **Caricatured personalities:** Ron is reduced to loud quips about food, Hermione recites textbook definitions like a search engine, and Draco delivers flat comic-book villainy.
- **Unearned magic:** Students use spells beyond their established abilities without a learning history, practical limits, or consequences. A spell's first appearance in the books does not by itself establish a curriculum restriction.
- **Hollywood banter over British boarding school reality:** Snappy contemporary dialogue replaces the dry situational comedy, institutional absurdity, practical student motives, and social hierarchy of British school life.
- **Broken Hungarian localization:** Without explicit craft rules, models produce awkward machine calques, misplace Hungarian focus and word order, use English quotation marks instead of dialogue dashes (`–`), and mangle canonical terms (*Madam Pince* becoming *"Pince asszony"*, or using literal translations instead of Tóth Tamás Boldizsár's established book vocabulary).

The skill provides primary-book lookup guidance, point-of-view and continuity checks, physical cause-and-effect prompts, and age-appropriate magical constraints.

---

## 🕯️ How It Started: From Ephemeral Chats to a Canon Engine

This project didn't start in an abstract laboratory or as a generic prompt collection. It grew out of a very real, frustrating creative hurdle.

Over many months, a substantial volume of original Harry Potter fanfiction chapters had accumulated inside ephemeral LLM chat threads. But as the story deepened across dozens of scenes, working purely within conversational chats broke down:
- The context window repeatedly lost the thread, dropping established character arcs and the custody of key magical artifacts.
- Unique character voices slowly degraded into homogenized AI chatter.
- Every other paragraph began leaning on lazy physical mannerisms and unearned melodrama.

To save the story and sustain it over the long haul, the entire endeavor had to be **projectified**—brought into a proper repository with version control, persistent tracking, and deterministic rules.

The turning point came when using **Astra** to comb through the archive of already-written chapters. Instead of prompting an AI from scratch each time, the project recorded accepted continuity decisions, craft preferences, and recurring failure modes so later work could be checked against them.

From that initial archive analysis, the framework expanded piece by piece to solve each craft breakdown as it occurred:
1. **Literary Craft Rules:** Codifying strict point-of-view discipline, physical cause and effect, and age-appropriate magical mechanics while outlawing generic purple prose.
2. **Character Continuity & Knowledge Custody:** Implementing custody chains and information tracking so characters never act on clues they haven't personally uncovered.
3. **Bilingual Canon Glossary:** Honoring the official Hungarian translations by Tóth Tamás Boldizsár—eradicating clumsy machine calques (*"Pince asszony"*, *"Roxmocs"*) and establishing canonical vocabulary (*Invito*, *Madam Cvikker*, *zárolt szekció*) alongside proper Hungarian topic-focus word order.
4. **Deterministic Canon Engine:** Developing pure, zero-dependency Node tools (`hp.mjs`) for literal searches, bilingual chapter alignment, knowledge/custody checks, and terminology linting against the indexed references.

What began as an effort to protect a private ongoing story became an open, rigorous craft skill designed for anyone serious about writing in the wizarding world.

---

## 📦 Quick Install

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

## 🏰 Core Principles

- **Primary Seven-Book Canon:** The seven original novels outrank films, companion books, wiki summaries, and model recollection. Exact claims still need passage verification.
- **Grounded British Boarding School Realism:** Student actions are constrained by class schedules, physical exhaustion, school rules, caretaker patrols, and genuine social friction.
- **Progressive Disclosure (11 Subskills):** Agents load only the specific reference modules required for their task rather than polluting context with unnecessary lore.
- **Deterministic Local Engine (`hp.mjs`):** A zero-dependency Node.js CLI providing literal text searches, bilingual passage alignment, knowledge/custody state validation, and Hungarian terminology linting.
- **Bilingual References:** Indexed English and Hungarian chapter pairs, topical indices, evidence cards, and terminology locators support targeted lookup in both languages.

---

## 🧭 Subskill Directory

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

## 🧪 Evaluation Record

The repository preserves an immutable v0.3.0 archive of exploratory scenes and historical coordinator summaries. Those archived summaries contain conflicting Hungarian totals and word counts and are not presented here as a verified ranking. The traceable release evaluation used two scenarios and six preserved judge records; after shared factual calibration, its means were A 18.25, B 17.75, and C 18.00 out of 20. It did not establish an overall advantage for the skill. See the [evaluation note](samples/EVALUATION-NOTE.md), the [release record](skills/harry-potter-fanfic/evals/release-0.3.0.md), and the [current sample index](samples/README.md).

---

## 🇭🇺 Roxforti kalauz magyar alkotóknak / For Hungarian Writers

> *„A gyűjtemény zárolt részéből azonban csak azok vehettek ki egy-egy könyvet, akik külön tanári engedéllyel rendelkeztek...”*
> — *Bölcsek köve*, 12. fejezet (Tóth Tamás Boldizsár fordítása)

A v0.3.0-as magyar mintákban visszatérő problémák voltak a felületes tükörfordítások:
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
2. **Kanonikus kifejezéstár:** A dokumentált magyar szóhasználatban a kimondott varázsige *Invito*, a bűbáj neve *begyűjtőbűbáj*, a lebegtetés *Vingardium Leviosa*, a könyvtárosnő pedig *Madam Cvikker*.
3. **Száraz iskolai helyzetkomikum:** A Roxfort valódi ízét nem a cirkuszi varázslatok adják, hanem a szigorú házirend, a büntetőmunkák valós veszélye, a tanárok sajátos szokásai és a kamaszos gyakorlati érdekek.

---

## 📜 Example Prompts

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

## 🛠️ Local Tools & Command-Line Engine (`hp.mjs`)

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

## 🔮 The Restricted Section: Roadmap

No overengineered fluff—just practical, book-grounded craft improvements planned for upcoming revisions:

- **Granular Book-by-Book Deep Dive:** Systematically working through the core seven novels volume by volume to extract finer-grained evidence cards, castle geography, classroom logistics, faculty routines, and subtle period details.
- **The Restricted Section (Extra Canonical Texts):** Expanding the corpus beyond the main septology to include the Hogwarts library companion volumes (*Fantastic Beasts and Where to Find Them*, *Quidditch Through the Ages*, *The Tales of Beedle the Bard*) with full bilingual indexing and lore integration.

---

## 🚀 Publication and Maintenance

The skill package is self-contained. Local book files, extracted texts, and user manuscripts are excluded from version control and distribution packages. Consult [`skills/harry-potter-fanfic/PUBLISHING.md`](skills/harry-potter-fanfic/PUBLISHING.md) for archive validation and release guidelines.

---

## ⚖️ Legal & License

Original framework, tools, and documentation are licensed under the [MIT License](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). See [acknowledgments](ACKNOWLEDGMENTS.md).

*Disclaimer:* This is an independent fan-created development tool. It is not affiliated with, authorized, or endorsed by J.K. Rowling, Warner Bros. Entertainment, or any rightsholders of the Harry Potter franchise. All trademarks and copyright in characters, names, and related indicia belong to their respective owners.
