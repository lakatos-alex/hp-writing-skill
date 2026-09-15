# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

**Version 0.2.2.** A substantial, progressively loaded skill for researching, planning, writing and revising original Harry Potter fanfiction.

The seven novels supply the complete primary canon baseline. The skill combines detailed reference material with practical writing workflows and local source tools. Agents load the entrypoint first, then the modules and evidence needed for the task.

## Install with skills

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

For the versioned release:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.2.2 --skill harry-potter-fanfic
```

The [skills CLI](https://www.skills.sh/docs/cli) installs skills from GitHub. This repository is the published source; it is not a separate npm package. See the [skills.sh FAQ](https://www.skills.sh/docs/faq) for discovery and listing behaviour.

For manual installation, copy the entire [skill folder](skills/harry-potter-fanfic/SKILL.md) into your agent's skill directory. Copy references, data, scripts and bundled notices together. Restart the agent session if its skill discovery is cached.

## What is included

- Ten on-demand subskills: canon research, story architecture, chapter production, mystery design, character workshop, magic engineering, worldbuilding, continuity/AU, revision and knowledge development.
- Seven book dossiers examining narrative mechanisms, character changes, world constraints and continuation questions.
- Specialist references covering characters, institutions, daily life, education, magical limits, information, objects, nonhuman communities and post-war open space.
- A structured catalogue of all 199 primary chapters, including the epilogue, with 33 topic vocabularies for retrieval.
- 44 original evidence cards with chapter anchors, evidence type, verification status and meaningful limits.
- Eight local commands for importing books, listing sources, finding chapters, searching passages, reading chapters, filtering facts, measuring manuscripts and checking continuity events.

The skill preserves the host project's language, file layout, approved prose voice, continuity records and build cadence. Its reference library is in English; the writing output follows the user's language and conventions.

Before a substantial draft or revision, it checks for a complementary general writing or continuity skill. If none is available, it asks whether the user wants to install `better-writing`; the user may continue with the built-in HP workflows instead. See [writing skill integration](skills/harry-potter-fanfic/references/writing-skill-integration.md).

## Large library, selective loading

Only the skill's discovery metadata is needed before selection. The entrypoint routes to substantial modules; those modules, structured data and book passages are read when needed. These files are on-demand workflow modules within one portable skill, not ten competing global activators.

A scene check can use a short passage. A requested full-book study can read complete chapters with continuation offsets. Larger model context can support deeper comparisons and broader arcs without changing the architecture. No fixed token ceiling or automatic full-corpus preload is imposed.

This follows the [Agent Skills format](https://agentskills.io/specification). Actual client loading behaviour can vary.

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

The public package distributes original guidance and tools. A project can provide its own primary-text sources to the optional local importer when exact textual verification is needed.

Guidance and bundled reference data need no runtime. Optional tools require **Node.js 22+**, have no external dependencies and make no network requests:

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books
node skills/harry-potter-fanfic/scripts/hp.mjs chapters --topic food --limit 5
node skills/harry-potter-fanfic/scripts/hp.mjs facts --query Fidelius
node skills/harry-potter-fanfic/scripts/hp.mjs search --sources /path/to/books --book GoF --query electricity
node skills/harry-potter-fanfic/scripts/hp.mjs read --sources /path/to/books --anchor DH29 --full
```

Import supports the documented English Pottermore EPUB layout. It creates narrative Markdown and a local catalogue with source hashes; front matter and next-book previews are excluded. See the [tool reference](skills/harry-potter-fanfic/references/tools.md) for every command, output, limit and side effect.

## Evidence and quality

The novels outrank adaptations, summaries and recollection for book-canon claims. Character testimony, narrative events, interpretations and AU choices remain distinct. Outside knowledge can enrich a story with an explicit source and adoption boundary.

All 199 chapters were structurally indexed. The [coverage record](skills/harry-potter-fanfic/references/coverage.md) distinguishes complete machine coverage, selected passage checks, broader analysis and behavioural evaluation. This is not a claim of an independent cover-to-cover literary verification.

Run the release checks:

```sh
node tools/validate_package.mjs
node --test tools/tests/*.test.mjs
node tools/verify_sources.mjs /path/to/books
git diff --check
```

The source check requires a source directory; public CI uses synthetic fixtures and packaged data. See [evaluation cases](skills/harry-potter-fanfic/evals/cases.md), the [release evaluation](skills/harry-potter-fanfic/evals/release-0.2.0.md), and [contributing](CONTRIBUTING.md).

## Publication and maintenance

The whole skill folder is self-contained. Local books, generated source text and private manuscript material are excluded from Git and release archives. Follow the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md) for validation, archive inspection and a tagged publication.

The reference library is designed to grow through supported claims, useful procedures and observed evaluation results. It does not require every agent to read every module, nor promise exhaustive canon coverage or a literary-quality score.

## Artwork and credits

The [artwork](assets/README.md) is an original AI-generated editorial illustration of a generic magical academy, with no franchise characters, logos or book text.

Original guidance and code are [MIT licensed](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). See [acknowledgments](ACKNOWLEDGMENTS.md). The license does not grant rights to the novels, characters or trademarks. This independent fan project is unaffiliated with the franchise's creators or rightsholders and was developed with AI assistance and editorial direction.
