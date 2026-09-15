# Contributing

Prefer a focused correction with a specific failure case over more general rules. For canon corrections, identify the book and chapter, distinguish event from testimony or interpretation, and paraphrase evidence. Do not submit books, extracted passages, private manuscripts or personal character overlays.

Preserve the skill name, reference routes and host-workflow precedence. Put conditional detail in the relevant reference. The local-source option must remain optional and excluded from releases.

Run `python tools/validate_package.py`. For changed behaviour, run a small relevant evaluation prompt and record the actual response, model, date and limitations. Keep expected results distinct from generated output. A checklist is not a passed test; label same-session checks accurately.

The installable skill folder is self-contained. Copy its license and acknowledgments with it. Follow `skills/harry-potter-fanfic/PUBLISHING.md` when preparing a release.
