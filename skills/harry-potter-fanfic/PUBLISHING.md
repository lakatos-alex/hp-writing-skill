# Release procedure

Publish this GitHub-hosted Agent Skill through the skills CLI. It is not a separate npm package. The commands below use version 0.3.1; create a tag only after its checks pass and publication is authorised.

## Validate the actual release

From the repository root:

```sh
node tools/validate_package.mjs
node --test tools/tests/*.test.mjs
node tools/verify_sources.mjs /path/to/books
git diff --check
```

The source check accepts a bilingual root containing `en/` and `hu/` catalogues. It verifies EPUB fidelity, paired metadata, glossary locators and publication overlap. PDF extraction has separate page/line and visual checks. Public CI runs source-free package checks and synthetic tool tests on Windows/Linux with Node.js 22/24. The Python validation entrypoint remains a compatibility wrapper around the Node validator.

Read [coverage](references/coverage.md), the [A/B/C protocol](evals/abc-0.3.0-protocol.md) and [release evaluation](evals/release-0.3.0.md). Keep observed behaviour separate from a planned test and structural import separate from semantic reading. Preserve raw and calibrated judge results, snapshot hashes and resource-use notes. Do not retry completed writing runs after an interruption merely to obtain a cleaner score.

For changes to writing guidance, use the [writing-quality regression protocol](evals/writing-quality-protocol.md). Compare against an identified frozen baseline on identical briefs; keep source-access experiments separate from the main comparison. Record literary preferences and disagreements alongside deterministic checks. A clean test suite proves tool behaviour, not improved fiction. Require fresh held-out replication and Hungarian human editorial review before making a general writing-quality claim; an unavailable review remains an explicit pending gate.

When source conversion or topic vocabulary changes, import and regenerate:

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang en
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books --lang hu
node tools/build_catalogue.mjs /path/to/books
```

## Review and commit

Inspect staged changes, public data and notices. The skill folder must remain self-contained. Confirm version agreement, valid relative links, source exclusions and no private manuscripts or full-text catalogues. Root and bundled licenses/acknowledgments must agree.

Stage the intended package files, commit the reviewed result and tag the verified commit as `v0.3.1`. Push the commit and tag through the repository's normal release process. Do not overwrite an existing release tag. A request for release preparation alone does not authorise publication; report the prepared state separately from a live release.

## Archive

Create the archive in a release-output directory outside the repository:

```sh
git archive --format=zip --prefix=harry-potter-fanfic/ --output=/path/to/output/harry-potter-fanfic-0.3.1.zip v0.3.1:skills/harry-potter-fanfic
```

Inspect actual ZIP entries. The archive should contain SKILL.md, references, data, scripts, metadata, evaluation records and notices. EPUBs, local catalogues, generated book Markdown and private story files must be absent. Whole-repository Git archives exclude `original-sources/` through .gitattributes.

## Verify installation

Use a fresh temporary directory for an installation smoke test:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.3.1 --skill harry-potter-fanfic --agent codex --copy -y
```

Before publication, the same CLI accepts an absolute local repository path for a candidate smoke test. After publication, test the exact remote tag. Actually change into the temporary directory before installing; creating a temporary directory while running the installer in the checkout is not isolation.

Inspect the installed files, version and routes, then run `chapters --lang hu`, `facts`, `glossary` and an advisory `lint-hu` fixture. Where local sources are available, exercise a primary-source read and paired chapter access through the installed copy too. Confirm no books or developer-only files entered the installed skill. A local candidate install does not establish remote tag availability or CI success.

The ordinary install command tracks the repository's default branch:

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

The [skills.sh FAQ](https://www.skills.sh/docs/faq) describes listing through installation telemetry. A successful GitHub publication and CLI install do not guarantee immediate leaderboard visibility. Verify and report those outcomes separately.
