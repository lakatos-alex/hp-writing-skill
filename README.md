# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

A writing skill for original Harry Potter fanfiction. It supports book-aware character decisions, consequence-bearing magic, long-form continuity, and revision that respects each story's own voice.

**Version:** 0.1.0-rc.1. Published public release candidate.

The repository is publicly available on GitHub. The package remains marked `rc.1` until a versioned stable release is tagged.

## Capabilities

- Plan and continue chapters using the story's era, established choices and character knowledge.
- Check magic, institutions, locations and returning characters against the seven novels while preserving deliberate alternate-universe decisions.
- Trace changed reveals through earlier reactions and later consequences.
- Polish repetitive prose without erasing deliberate imagery, ambiguity or individual voices.

The skill follows an existing project's layout, documentation and workflow. A review request remains a review unless the author authorizes edits. The package provides writing guidance and references; it does not include the novels, a hosted generation service, or an exhaustive lore database.

## Install

Copy the whole [`skills/harry-potter-fanfic`](skills/harry-potter-fanfic/SKILL.md) folder, including its references, into your agent's skills directory. Keep the folder name `harry-potter-fanfic` and avoid overlapping copies with the same name.

For a Codex project using `.agents/skills/`, run from your story project's root after cloning this repository separately:

```powershell
New-Item -ItemType Directory -Force .agents/skills | Out-Null
Copy-Item -Recurse 'C:/path/to/hp-writing-skill/skills/harry-potter-fanfic' .agents/skills/
```

Unix shell equivalent:

```sh
mkdir -p .agents/skills
cp -R /path/to/hp-writing-skill/skills/harry-potter-fanfic .agents/skills/
```

These commands assume a new installation; inspect an existing copy before replacing it. Start a new agent session if discovery was already cached. Other Agent Skills-compatible clients can use this folder in their documented discovery location; cross-client behaviour has not been independently tested. Python is needed only for repository validation, not ordinary skill use.

## Example requests

```text
Use $harry-potter-fanfic to plan the next chapter. Read my existing story
state and preceding chapter. Preserve my AU, voice and workflow. Give
Hermione and Ron different reasons to oppose the proposed plan.
```

```text
Use $harry-potter-fanfic to audit this scene without editing it.
Check what each character knows and whether the magical solution is established.
```

```text
Use $harry-potter-fanfic for a light prose pass. Preserve the events, clues,
deliberate repetition and Hungarian dialogue format. Calibrate against
the two approved passages I supplied.
```

The seven novels supply the default canon. Film details, fanon, and later material remain separate sources. Explicit alternate-universe decisions remain valid. Write in the requested language; the included reference notes and chapter navigation are in English.

## Optional book sources

Keep your own accessible copies in [`original-sources/`](original-sources/README.md), or leave them in your existing source folder. Point the agent to a relevant book when a fact needs checking. Nothing is downloaded or loaded automatically; the index guides retrieval of a bounded passage.

The folder is ignored by Git except its README, and excluded from Git-generated release archives. This repository distributes no book text. There is no bundled EPUB/PDF reader or DRM support. See the [source guide](skills/harry-potter-fanfic/references/local-sources.md) for formats, privacy and limits.

## Validation and limitations

The initial record contains [three behavioural smoke tests](skills/harry-potter-fanfic/evals/smoke-2026-09-15.md) with complete prompts and responses. They were generated and reviewed in the same GPT-6 session, so they are not independent evaluations or proof of comparative quality. The [larger scenario set](skills/harry-potter-fanfic/evals/cases.md) remains available. No long-chapter or performance benchmark is claimed.

Run package checks from the repository root:

```sh
python tools/validate_package.py
```

The 199-entry chapter index states its [evidence coverage](skills/harry-potter-fanfic/references/source-index.md). It does not imply every canon assertion was freshly verified. Recheck decisive facts against primary text when available.

## Artwork

The repository artwork is an original AI-generated editorial illustration created for this project. It depicts a generic magical academy and contains no franchise characters, logos, or book text. Its [source details](assets/README.md) record its intended use and prompt.

## Maintenance and credits

See [CONTRIBUTING.md](CONTRIBUTING.md), the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md), and [acknowledgments](ACKNOWLEDGMENTS.md).

Original guidance and tooling are [MIT licensed](LICENSE), copyright 2026 Alex Lakatos. Maintainer: [Alex Lakatos](https://lakatosalex.hu). The license does not grant rights to the Harry Potter books, characters, or trademarks. This independent fan project is unaffiliated with and not endorsed by the franchise's creators or rightsholders. It was developed with AI assistance and editorial direction.
