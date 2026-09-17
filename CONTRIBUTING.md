# Contributing

Develop substantial capabilities when they solve a real writing or research problem. Keep discovery metadata precise and route detailed work into on-demand modules.

This workspace develops the skill; its consumer writing workflows are testable product files, not instructions for repository maintenance. Read [AGENTS.md](AGENTS.md) for development boundaries and [source organisation](original-sources/README.md) for corpus procedures.

## Canon and evidence

Use the seven novels as primary authority. Add a concise paraphrase, chapter anchor, evidence type and meaningful limitation for each maintained claim. Distinguish events from testimony and interpretation. Record exact source coverage; a keyword match is not semantic verification.

For new evidence cards, follow [facts.json](skills/harry-potter-fanfic/data/facts.json). For lexical topics, edit [topics.json](skills/harry-potter-fanfic/data/topics.json) and regenerate with `node tools/build_catalogue.mjs /path/to/books`. This writes public metadata without copying passages. Read the [development workflow](skills/harry-potter-fanfic/references/workflow-knowledge-development.md) for the full process.

## Structure

Keep the installed folder self-contained. Shared routing belongs in SKILL.md; substantial task methods belong in workflow modules; domain knowledge belongs in references; deterministic helpers belong in scripts. Add a route for every new resource. Preserve host projects' own records, language, voice and build cadence.

Do not submit novels, extracted passages, full local catalogues or private manuscript overlays. Public examples should be original and minimal.

For bilingual terminology, add a referent, category, English/Hungarian headwords, aliases, paired chapter locators and a usage limitation to `data/hu-glossary.json`. Check surrounding text in both languages. Match stems only when the note explains the inflected form. Use factual names and short terms, not a harvested phrase bank. Exclude degraded transcriptions from orthographic authority.

Future model support should preserve portable files and stable anchor/schema contracts while adapting retrieval depth. Re-test capabilities instead of claiming that a larger context window guarantees better reasoning. The project is designed for frontier models and has been developed and tested with ChatGPT models; record actual evaluation conditions rather than inferring an exact model ID.

## Tests and evidence

Run `node tools/validate_package.mjs`, `node --test tools/tests/*.test.mjs` and `git diff --check`. When local books are available, run `node tools/verify_sources.mjs /path/to/books`.

For changed behaviour, run realistic prompts and record the actual agent response, model when known, date, resources used and limitations. Keep expected results distinct from observed results. A test case is not a pass merely because it is written down.

Use independent forward evaluation for substantial changes when available. Give the evaluator the skill and realistic task, without the intended answer. Keep private source passages out of published transcripts.

The [A/B/C protocol](skills/harry-potter-fanfic/evals/abc-0.3.0-protocol.md) compares scenario-only, skill-only and skill-plus-sources conditions. `node tools/evaluate_writing.mjs prepare /absolute/temp/path` freezes a skill snapshot and preserves existing outputs. `status` verifies the snapshot and measures saved scenes; `blind` creates an anonymised packet; `score` validates two independent judge files and calculates descriptive summaries. Add `calibrated` after the directory to score separately saved corrected ratings. `export /absolute/temp/path /new/artifact/directory` preserves the v0.3.0 protocol's writing/judging artifacts and manifests, including its held-out follow-up, without exporting books or full skill snapshots. These commands do not call models or invent scores. Resume missing runs only; a usage-limit failure does not invalidate a complete artifact saved beforehand. See the [recorded results](skills/harry-potter-fanfic/evals/release-0.3.0.md).

## Documentation and releases

For writing-quality iterations, use [the regression protocol](skills/harry-potter-fanfic/evals/writing-quality-protocol.md) and the versioned development briefs in `tools/quality-suite.json`. Freeze the baseline before changing guidance and the candidate before judging. Preserve the older A/B/C evidence. Separate mechanical correctness, editorial dimensions and blind preference; record resource access rather than assuming it. Extend the glossary from failed real lookups with checked evidence, not speculative volume. Broader quality claims need held-out replication and human review.

Update the root README, entrypoint version, relevant guides, coverage and release notes together. Keep root and bundled notices identical. See the [release procedure](skills/harry-potter-fanfic/PUBLISHING.md). Preserve historical evaluation records as dated history; mark their scope rather than rewriting old results as new successes.
