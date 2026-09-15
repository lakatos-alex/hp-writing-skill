# Release procedure

Version 0.2.2 is prepared for publication from the GitHub repository for installation through the skills CLI. This is a GitHub-hosted Agent Skill, not a separately published npm package.

## Validate the actual release

From the repository root:

```sh
node tools/validate_package.mjs
node --test tools/tests/hp.test.mjs
node tools/verify_sources.mjs /path/to/books
git diff --check
```

The source check requires a local source directory containing the supported EPUB collection. Public CI runs package checks and synthetic tool tests on Windows/Linux with Node.js 22/24. The Python validation entrypoint remains a compatibility wrapper around the Node validator.

Read [coverage](references/coverage.md) and [release evaluation](evals/release-0.2.0.md). Keep observed behaviour separate from a planned test and structural import separate from semantic reading.

When source conversion or topic vocabulary changes, import and regenerate:

```sh
node skills/harry-potter-fanfic/scripts/hp.mjs import --sources /path/to/books
node tools/build_catalogue.mjs /path/to/books
```

## Review and commit

Inspect staged changes, public data and notices. The skill folder must remain self-contained. Confirm version agreement, valid relative links, source exclusions and no private manuscripts or full-text catalogues. Root and bundled licenses/acknowledgments must agree.

Stage the intended package files, commit the reviewed result and tag the verified commit as `v0.2.2`. Push the commit and tag through the repository's normal release process. Do not overwrite an existing release tag.

## Archive

Create the archive in a release-output directory outside the repository:

```sh
git archive --format=zip --prefix=harry-potter-fanfic/ --output=/path/to/output/harry-potter-fanfic-0.2.2.zip v0.2.2:skills/harry-potter-fanfic
```

Inspect actual ZIP entries. The archive should contain SKILL.md, references, data, scripts, metadata, evaluation records and notices. EPUBs, local catalogues, generated book Markdown and private story files must be absent. Whole-repository Git archives exclude `original-sources/` through .gitattributes.

## Verify installation

Use a fresh temporary directory for an installation smoke test:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v0.2.2 --skill harry-potter-fanfic --agent codex --copy -y
```

Inspect the installed files, version and routes, then run its `chapters` and `facts` commands. Where local sources are available, exercise a primary-source read through the installed copy too.

The ordinary install command tracks the repository's default branch:

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

The [skills.sh FAQ](https://www.skills.sh/docs/faq) describes listing through installation telemetry. A successful GitHub publication and CLI install do not guarantee immediate leaderboard visibility. Verify and report those outcomes separately.
