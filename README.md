# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

**Version 0.3.0.** Research, plan, write and revise original Harry Potter fanfiction in English or Hungarian, with book-grounded continuity and on-demand reference tools.

The seven novels supply the complete primary canon baseline. The skill combines detailed reference material with practical writing workflows and local source tools. Agents load the entrypoint first, then the modules and evidence needed for the task.

## Install with skills

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

For the versioned release:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.3.0 --skill harry-potter-fanfic
```

The [skills CLI](https://www.skills.sh/docs/cli) installs skills from GitHub. This repository is the published source; it is not a separate npm package. See the [skills.sh FAQ](https://www.skills.sh/docs/faq) for discovery and listing behaviour.

For manual installation, copy the entire [skill folder](skills/harry-potter-fanfic/SKILL.md) into your agent's skill directory. Copy references, data, scripts and bundled notices together. Restart the agent session if its skill discovery is cached.

## What is included

- Eleven on-demand subskills: canon research, story architecture, chapter production, Hungarian writing, mystery design, character workshop, magic engineering, worldbuilding, continuity/AU, revision and knowledge development.
- Seven book dossiers examining narrative mechanisms, character changes, world constraints and continuation questions.
- Specialist references covering characters, institutions, daily life, education, magical limits, information, objects, nonhuman communities and post-war open space.
- Paired English and Hungarian catalogues covering 199 chapters per language, including the epilogue, with 33 English topic vocabularies for retrieval.
- A searchable 145-entry English–Hungarian glossary of people, places, houses, incantations, objects, creatures and concepts, with paired source locators and usage notes.
- 44 original evidence cards with chapter anchors, evidence type, verification status and meaningful limits.
- Eleven local commands, including bilingual chapter comparison, glossary lookup and an advisory Hungarian terminology scan.

The skill preserves the host project's language, file layout, approved prose voice, continuity records and build cadence. Hungarian support covers narrative viewpoint, idiomatic information order, dialogue, forms of address, name inflection and translated spell formulas. The guides use English explanations and original Hungarian examples; output follows the user's language and conventions.

Before a substantial draft or revision, it checks for a complementary general writing or continuity skill. If none is available, it asks whether the user wants to install `better-writing`; the user may continue with the built-in HP workflows instead. See [writing skill integration](skills/harry-potter-fanfic/references/writing-skill-integration.md).

## Large library, selective loading

Only the skill's discovery metadata is needed before selection. The entrypoint routes to substantial modules; those modules, structured data and book passages are read when needed. The workflows live within one portable skill.

A scene check can use a short passage. A requested full-book study can read complete chapters with continuation offsets. Larger model context can support deeper comparisons and broader arcs without changing the architecture. No fixed token ceiling or automatic full-corpus preload is imposed.

This follows the [Agent Skills format](https://agentskills.io/specification). Actual client loading behaviour can vary.

The skill is designed for frontier models and has been developed and tested with ChatGPT models. Context depth and review effort adapt to the task; results for a tested model are not a guarantee for other models or future versions.

## Hungarian writing

Use [Hungarian writing](skills/harry-potter-fanfic/references/workflow-hungarian-writing.md) for original scenes or revisions, [prose guidance](skills/harry-potter-fanfic/references/hungarian-prose.md) for narration and tone, and [terminology](skills/harry-potter-fanfic/references/hungarian-terminology.md) for names and conventions. These references work without the books. Project-specific naming choices override glossary defaults.

```text
Írj magyarul egy jelenetet a történetem következő fejezetéhez.
Őrizd meg a nézőpontot és a szereplők tudását. Használd a magyar
könyvneveket és varázsigéket; a humor a helyzetből és a szereplők
eltérő szándékaiból fakadjon.
```

## Example requests

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

## Local books and tools

Use the bundled references directly, or run the optional tools with **Node.js 22+**:

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang en
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang hu
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --topic food --limit 5
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --lang hu --book PoA
node skills/harry-potter-fanfic/scripts/hp.mjs glossary --query Accio
node skills/harry-potter-fanfic/scripts/hp.mjs facts --query Fidelius
node skills/harry-potter-fanfic/scripts/hp.mjs search --sources /path/to/books --lang hu --query Roxfort
node skills/harry-potter-fanfic/scripts/hp.mjs align --sources /path/to/books --anchor PS6 --max-chars 3000
node skills/harry-potter-fanfic/scripts/hp.mjs lint-hu --file /path/to/chapter.md
```

The importer supports documented English Pottermore and Hungarian NCX/spine EPUB layouts. Keep one edition per book in each language directory. Import creates narrative Markdown and a hash-checked catalogue; front matter and previews are excluded. The [tool reference](skills/harry-potter-fanfic/references/tools.md) documents formats, paths, side effects and PDF sidecars. Tools have no third-party Node dependencies and make no network requests.

## Evidence and quality

The novels outrank adaptations, summaries and recollection for book-canon claims. Character testimony, narrative events, interpretations and AU choices remain distinct. Outside knowledge can enrich a story with an explicit source and adoption boundary.

The [coverage record](skills/harry-potter-fanfic/references/coverage.md) separates structural indexing, paired term checks, sampled craft analysis and behavioural evaluation. The Hungarian DH PDF transcription has documented source defects and is not a verified spelling or prose standard. Indexed coverage is not a claim of cover-to-cover literary verification.

Run the release checks:

```sh
node tools/validate_package.mjs
node --test tools/tests/*.test.mjs
node tools/verify_sources.mjs /path/to/books
git diff --check
```

The source check requires a source directory; public CI uses synthetic fixtures and packaged data. See [evaluation cases](skills/harry-potter-fanfic/evals/cases.md), the [A/B/C results and limitations](skills/harry-potter-fanfic/evals/release-0.3.0.md), and [contributing](CONTRIBUTING.md). The small writing test found useful terminology and clarity gaps, but did not establish an overall quality gain over the unaided baseline.

## Publication and maintenance

The whole skill folder is self-contained. Local books, generated source text and private manuscript material are excluded from Git and release archives. Follow the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md) for validation, archive inspection and a tagged publication.

The reference library is designed to grow through supported claims, useful procedures and observed evaluation results. It does not require every agent to read every module, nor promise exhaustive canon coverage or a literary-quality score.

## Artwork and credits

The [artwork](assets/README.md) is an original AI-generated editorial illustration of a generic magical academy, with no franchise characters, logos or book text.

Original guidance and code are [MIT licensed](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). See [acknowledgments](ACKNOWLEDGMENTS.md). The license does not grant rights to the novels, characters or trademarks. This independent fan project is unaffiliated with the franchise's creators or rightsholders and was developed with AI assistance and editorial direction.
