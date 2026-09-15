# Version 0.2.0 evaluation record

Date: 2026-09-16.

## Independent forward tests

Two separate agents used the evolving skill on realistic tasks without an answer key. They inherited the parent model; the delegation tool did not supply a distinct model identifier. The main developer reviewed the results. These tests provide narrower evidence than a blinded multi-model benchmark.

| Test | Actual outcome | Assessment |
|---|---|---|
| [Canon research](forward-0.2.0-1.md) | Retrieved passages on food, electronics, memory reliability and Tournament obligations; distinguished later author knowledge from fifth-year character knowledge; proposed usable changes | Passed the requested research task with qualified evidence |
| [Original chapter](forward-0.2.0-2.md) | Delivered a 721-word scene, disclosed the damage before Ivo reacts to it, transferred the key explicitly, preserved the survival AU and gave Ivo an independent boundary | Passed the requested scope and continuity checks; literary quality remains editorial judgment |

The main developer independently recounted the returned chapter as 721 whitespace-delimited words. The research agent reported and recovered from ignored-file discovery, truncated output and an exact-phrase miss; these are recorded in its response.

The writing agent reported using chapter production, character, continuity and scene-craft modules. The research agent reported using canon research, mystery, magic, source and evidence references plus primary passages. Resource use is agent-reported; the transcripts do not claim comprehensive per-tool telemetry.

## Deterministic checks

The automated test suite covers text conversion, Unicode/entity handling, literal search and pagination, manuscript counts, missing knowledge routes, object custody, stale catalogues, invalid input and source-free data retrieval. Source integration checks cover the supported seven-book EPUB collection and all 199 chapters.

The local source test compares normalized letters/numbers across original chapter HTML and converted Markdown, verifies titles, order, hashes and public catalogue alignment, and checks the 44 evidence-card locators. It also looks for exact 30-word source sequences in public Markdown/JSON. This is a specific leak check, not a legal conclusion or exhaustive similarity analysis.

## What is not established

No benchmark shows that this skill outperforms another skill or an unassisted model. Two successful tasks do not establish universal canon accuracy, long-novel continuity or multi-client compatibility. The full corpus was indexed; selective passages were read for development and evaluation. Future work can add new test prompts and evidence cards where observed needs justify them.
