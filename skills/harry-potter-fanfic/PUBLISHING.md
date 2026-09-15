# Release procedure

The self-contained skill folder includes its license and attribution. Private books, manuscripts, personal overlays and dormant skills do not belong in this package.

## Validate

1. From the repository root run `python tools/validate_package.py` and `git diff --check`.
2. Run relevant [evaluation cases](evals/cases.md) for changed behaviour. Save actual prompts, responses, model, date and limitations. The [initial smoke record](evals/smoke-2026-09-15.md) is a small same-session check, not independent evaluation.
3. Inspect staged files for unintended material. Keep root and bundled license/attribution files identical.
4. Confirm README and SKILL.md versions agree, then commit the reviewed package.

## Package

The initial candidate is `0.1.0-rc.1`. Keep repository visibility private until the owner decides to publish. Changing visibility is a separate owner decision, never automatic maintenance.

Create an output directory outside the repository, then run:

```sh
git archive --format=zip --prefix=harry-potter-fanfic/ --output=/path/to/output/harry-potter-fanfic-0.1.0-rc.1.zip HEAD:skills/harry-potter-fanfic
```

Inspect ZIP entries before distributing: SKILL.md, references, metadata, evaluations, license and attribution must be present; local books must be absent. Whole-repository archives made with `git archive` exclude `original-sources/` via `.gitattributes`. Arbitrary filesystem ZIP tools may include ignored files, so use the documented command.

When public release is authorized, review repository history and create a versioned release from the verified commit. No public release or automatic publishing workflow is enabled by this candidate.
