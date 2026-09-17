# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

> *"Words are, in my not-so-humble opinion, our most inexhaustible source of magic."*
> — Albus Dumbledore

**Version 0.3.0.** A precision craft and canon framework for researching, planning, writing, and revising original Harry Potter fiction in **English** and **Hungarian**, grounded in the complete seven-book baseline.

Ever asked an AI to write a Hogwarts scene, only to watch Harry take his seventeenth *deep, shuddering breath*, Ron morph into a cartoon caricature yelling about treacle tart, third-year students casually hurling N.E.W.T.-level *Accio* charms before breakfast, and Madam Pince speaking like a Victorian melodrama?

**This skill is the counter-curse.** It pairs detailed literary craft references with deterministic local tools to keep character voices authentic, magic grounded in its canonical curriculum, and school drama governed by genuine physical stakes.

---

## Quick Install

Install directly via the [skills CLI](https://www.skills.sh/docs/cli) from GitHub:

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

For a pinned, versioned release:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.3.0 --skill harry-potter-fanfic
```

For manual installation, copy the self-contained [skill folder](skills/harry-potter-fanfic/SKILL.md) into your agent's skills directory.

---

## What Makes It Magical

- **Grounded Seven-Book Canon Baseline:** Primary book authority outranks wiki trivia, film-only deviations, and AI recollection.
- **Genuine Boarding School Voice:** British cadence, dry situational comedy, practical schoolboy and schoolgirl motives, and earned emotional restraint over purple prose and visceral bodily clichés.
- **Eleven On-Demand Subskills:** Load only what your scene needs through progressive disclosure:
  - 🔍 [Canon Research](skills/harry-potter-fanfic/references/workflow-canon-research.md) & [Source Index](skills/harry-potter-fanfic/references/source-index.md)
  - 🏛️ [Story Architecture](skills/harry-potter-fanfic/references/workflow-story-architecture.md) & [Book Dossiers](skills/harry-potter-fanfic/references/book-dossiers.md)
  - ✍️ [Chapter Production](skills/harry-potter-fanfic/references/workflow-chapter-production.md) & [Scene Craft](skills/harry-potter-fanfic/references/scene-craft-and-revision.md)
  - 🇭🇺 [Hungarian Writing](skills/harry-potter-fanfic/references/workflow-hungarian-writing.md), [Prose Craft](skills/harry-potter-fanfic/references/hungarian-prose.md) & [Terminology](skills/harry-potter-fanfic/references/hungarian-terminology.md)
  - 🕵️ [Mystery Design](skills/harry-potter-fanfic/references/workflow-mystery.md) & [Information Concealment](skills/harry-potter-fanfic/references/information-and-concealment.md)
  - 🎭 [Character Workshop](skills/harry-potter-fanfic/references/workflow-character-workshop.md) & [Character Map](skills/harry-potter-fanfic/references/canon-character-map.md)
  - ⚡ [Magic Engineering](skills/harry-potter-fanfic/references/workflow-magic-engineering.md) & [Magic Constraints](skills/harry-potter-fanfic/references/magic-constraints-and-tools.md)
  - 🏰 [Worldbuilding](skills/harry-potter-fanfic/references/workflow-worldbuilding.md) & [Daily Life](skills/harry-potter-fanfic/references/locations-and-daily-life.md)
  - ⏳ [Continuity & AU](skills/harry-potter-fanfic/references/workflow-continuity.md) & [Era Ledger](skills/harry-potter-fanfic/references/era-and-knowledge-ledger.md)
  - ✂️ [Revision Studio](skills/harry-potter-fanfic/references/workflow-revision.md) & [Prose Profiles](skills/harry-potter-fanfic/references/prose-profiles.md)
  - 📚 [Knowledge Development](skills/harry-potter-fanfic/references/workflow-knowledge-development.md) & [Evidence Rules](skills/harry-potter-fanfic/references/evidence-and-extensions.md)
- **Zero-Dependency Deterministic Engine (`hp.mjs`):** Pure Node.js CLI for chapter retrieval, literal text searches, bilingual alignment, custody verification, and advisory Hungarian linting without third-party dependencies or network calls.
- **Bilingual Corpus & Verified Glossary:** 199 paired English and Hungarian chapters, 33 topical indices, and 145 verified canon terms with precise chapter locators.
- **Strict & Permissive Corpus Ingestion:** Flexible EPUB 3 / NCX importer and direct `.txt` / `.md` novel parser with non-fatal warning tolerance, alongside `--strict` mode for formal benchmarks.

---

## Writing Evaluation and Samples

See the difference for yourself. We rigorously tested the skill across three isolated conditions under our [A/B/C testing protocol](skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md):
- **Condition A (Unaided):** Raw base model without skills or book access.
- **Condition B (Skill Only):** Guided by the craft rules, subskills, and glossary; zero book files.
- **Condition C (Skill + Books):** Guided by the skill and grounded in the complete primary corpus.

Read the full evaluation breakdown, side-by-side scorecards, and complete scenes in both English and Hungarian in the [samples directory](samples/README.md).

---

## A Roxforti Könyvtár Magyar Részlege / For Hungarian Writers

> *„Roxfortban vagyunk, kérem szépen, nem a Hogwartsban.”*

A magyar nyelvű rajongói irodalom (fanfiction) különös kihívásokkal küzd a generatív modellek korában. A legtöbb AI angolul gondolkodik, és magyar szöveg írásakor gépies tükörfordításokat állít elő: *Madam Pince*-ből *"Pince asszony"* lesz, *Hogsmeade*-ből *"Roxmocs"*, a párbeszédeket angol idézőjelek közé szorítja, a mondatokat pedig teletömi felesleges mutató névmásokkal és teátrális amerikai melodrámával.

Ez a skill **Tóth Tamás Boldizsár legendás műfordítói hagyományára** építve tisztítja meg a magyar prózát:
- **Hivatalos kánoni nevek és formulák:** Ismeri a 145 legfontosabb magyar szakkifejezést. A kimondott varázsige az *Invito* (nem *Accio*), a lebegtetés *Vingardium Leviosa* (V-vel), a könyvtárosnő pedig *Madam Cvikker*.
- **Magyar mondatszerkezet és fókusz:** Érvényesíti a magyar topik-fókusz dinamikát (*„A kulcsot Júlia vitte el”* vs. *„Júlia a kulcsot vitte el”*), elhagyja a felesleges ragadvány-szavakat, és a magyar irodalmi gondolatjelet (`–`) használja a párbeszédekhez.
- **Száraz humor az olcsó giccs helyett:** A kora- és késő-kamaszkori Roxfort lényege az iskolai helyzetkomikum, a valódi felelősség, a tanári tekintély és a diákcsínyek súlya.

Próbáld ki bátran:
```text
Írj egy jelenetet 1993 októberéből a Roxfortban. Őrizd meg a harmadik személyű
közeli nézőpontot és a korabeli tanmenet határait. Használd a hivatalos magyar
könyvneveket; a humor a helyzetből fakadjon, a jelenet végén pedig legyen
kézzelfogható gyakorlati következmény.
```

---

## Example Requests

```text
Use $harry-potter-fanfic to continue my next chapter. Read the preceding
scene and accepted story notes, preserve my voice and AU, and meet the
requested length with meaningful scene development.

Use $harry-potter-fanfic to design a post-war magical communication
system. Ground its starting mechanism in the books, label inventions,
and test how its limits affect privacy and everyday use.

Use $harry-potter-fanfic to audit this reveal after moving it two
chapters later. Trace who knows what, when they learn it, and which
later actions now need repair. Review only.

Use $harry-potter-fanfic in knowledge-development mode to study a
character across the complete books. Read at the needed depth and
separate indexed coverage from passages actually examined.
```

---

## Local Books and Tools

Use the bundled references directly, or run the optional tools with **Node.js 22+**:

```sh
# Import books in permissive mode (accepts non-standard EPUBs and text novels)
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang en
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang hu

# Search local chapters and aligned bilingual passages
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --topic food --limit 5
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --lang hu --book PoA
node skills/harry-potter-fanfic/scripts/hp.mjs glossary --query Accio
node skills/harry-potter-fanfic/scripts/hp.mjs facts --query Fidelius
node skills/harry-potter-fanfic/scripts/hp.mjs search --sources /path/to/books --lang hu --query Roxfort
node skills/harry-potter-fanfic/scripts/hp.mjs align --sources /path/to/books --anchor PS6 --max-chars 3000

# Advisory Hungarian terminology linter
node skills/harry-potter-fanfic/scripts/hp.mjs lint-hu --file /path/to/chapter.md
```

---

## 🔮 The Restricted Section (Roadmap & Future Work)

> *„Aki a Tiltott Részlegbe kíván belépni, jobb, ha bemutatja a tanári engedélycéduláját. Kérjük, a sikoltozó könyveket ne etessék.”*

Future development on the skill explores deep literary modeling, multilingual craft, and autonomous editorial agents:

1. **📜 Universal Grimoire Ingestion (Permissive Pipeline)**
   - Broaden beyond strict Pottermore layouts to arbitrary e-books, direct `.txt` / `.md` ingestion (implemented in v0.3.1), and native clean PDF extraction without external dependencies.
2. **🌍 Multilingual Wandlore**
   - Extend our verified bilingual (EN/HU) engine to additional European translations (German, French, Spanish), matching canonical spellings and localized voice profiles.
3. **🧪 The Polyjuice Voice Engine (Granular Stylistic Sliders)**
   - Dial in distinct point-of-view cadences: Snape's surgical, cutting brevity; Dumbledore's deceptively gentle deflection; Hermione's rapid, encyclopedic cadence; and Luna's serenely unsettling matter-of-factness.
4. **🗺️ The Marauder's Map & Causality Ledger**
   - Automated timeline graphing, knowledge boundary validation, and object custody visualizer for complex alternate universes (AUs) and multi-chapter mysteries.
5. **🤝 Collaborative Writing Guilds (Multi-Agent Co-Writing)**
   - Autonomous agent pairing: an *Archivist* verifying canon rules, an *Editor* auditing sentence rhythm and viewpoint discipline, and a *Director* managing scene tension and turn mechanics.

---

## Publication and Maintenance

The whole skill folder is self-contained. Local books, generated source text and private manuscript material are excluded from Git and release archives. Follow the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md) for validation, archive inspection and a tagged publication.

The reference library is designed to grow through supported claims, useful procedures and observed evaluation results. It does not require every agent to read every module, nor promise exhaustive canon coverage or a literary-quality score.

---

## Artwork and Credits

The [artwork](assets/README.md) is an original AI-generated editorial illustration of a generic magical academy, with no franchise characters, logos or book text.

Original guidance and code are [MIT licensed](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). See [acknowledgments](ACKNOWLEDGMENTS.md). The license does not grant rights to the novels, characters or trademarks. This independent fan project is unaffiliated with the franchise's creators or rightsholders and was developed with AI assistance and editorial direction.
