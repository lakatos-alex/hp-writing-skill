# Contributing

Develop substantial capabilities when they solve a real writing or research problem. Keep discovery metadata precise and route detailed work into on-demand modules.

## Canon and evidence

Use the seven novels as primary authority. Add a concise paraphrase, chapter anchor, evidence type and meaningful limitation for each maintained claim. Distinguish events from testimony and interpretation. Record exact source coverage; a keyword match is not semantic verification.

For new evidence cards, follow [facts.json](skills/harry-potter-fanfic/data/facts.json). For lexical topics, edit [topics.json](skills/harry-potter-fanfic/data/topics.json) and regenerate with `node tools/build_catalogue.mjs /path/to/books`. This writes public metadata without copying passages. Read the [development workflow](skills/harry-potter-fanfic/references/workflow-knowledge-development.md) for the full process.

## Structure

Keep the installed folder self-contained. Shared routing belongs in SKILL.md; substantial task methods belong in workflow modules; domain knowledge belongs in references; deterministic helpers belong in scripts. Add a route for every new resource. Preserve host projects' own records, language, voice and build cadence.

Do not submit novels, extracted passages, full local catalogues or private manuscript overlays. Public examples should be original and minimal.

## Tests and evidence

Run `node tools/validate_package.mjs`, `node --test tools/tests/*.test.mjs` and `git diff --check`. When local books are available, run `node tools/verify_sources.mjs /path/to/books`.

For changed behaviour, run realistic prompts and record the actual agent response, model when known, date, resources used and limitations. Keep expected results distinct from observed results. A test case is not a pass merely because it is written down.

Use independent forward evaluation for substantial changes when available. Give the evaluator the skill and realistic task, without the intended answer. Keep private source passages out of published transcripts.

## Documentation and releases

Update the root README, entrypoint version, relevant guides, coverage and release notes together. Keep root and bundled notices identical. See the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md). Preserve historical evaluation records as dated history; mark their scope rather than rewriting old results as new successes.
