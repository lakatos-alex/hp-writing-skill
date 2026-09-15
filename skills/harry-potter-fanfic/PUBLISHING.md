# Release procedure

The self-contained skill folder includes its license and attribution. Private books, manuscripts, personal overlays and dormant skills do not belong in this package.

## Validate

1. From the repository root run `python tools/validate_package.py` and `git diff --check`.
2. Run relevant [evaluation cases](evals/cases.md) for changed behaviour. Save actual prompts, responses, model, date and limitations. The [initial smoke record](evals/smoke-2026-09-15.md) is a small same-session check, not independent evaluation.
3. Inspect staged files for unintended material. Keep root and bundled license/attribution files identical.
4. Confirm README and SKILL.md versions agree, then commit the reviewed package.

## Package

The `0.1.0-rc.1` candidate is published in the public repository. No versioned GitHub release tag is currently recorded. Before promoting it to a stable release, review the full Git history, confirm that no private material is present, and verify the public README, license, and artwork attribution.

Create an output directory outside the repository, then run:

```sh
git archive --format=zip --prefix=harry-potter-fanfic/ --output=/path/to/output/harry-potter-fanfic-0.1.0-rc.1.zip HEAD:skills/harry-potter-fanfic
```

Inspect ZIP entries before distributing: SKILL.md, references, metadata, evaluations, license and attribution must be present; local books must be absent. Whole-repository archives made with `git archive` exclude `original-sources/` via `.gitattributes`. Arbitrary filesystem ZIP tools may include ignored files, so use the documented command.

Create a versioned GitHub release from a verified commit when the owner accepts a stable version. No automatic publishing workflow is enabled by this candidate.
