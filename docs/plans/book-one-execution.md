# Book-one implementation execution

Started 2026-09-17 after the user authorized delegation of the implementation plan. This supersedes the planning-only status of the original plan; publication remains unauthorized. No commit, tag, push or GitHub Release is part of this run.

## Usage controls

Initial live allowance: 80% of the five-hour core window and 32% of the weekly core window remaining. The separate Luna reserve reported exhausted; actual model execution availability is checked through dispatch, without retry loops. Use Luna for bounded extraction when available, Terra for engineering and review, and no frontier-model full-corpus rereads. No exact savings claim is made from account-wide usage.

Run dependent stages sequentially, use fresh extraction/review contexts, and give shared files one owner. Preserve progress in ignored research records. Check usage between major stages; keep a resumable checkpoint if allowance prevents completion. Never downgrade an incomplete review to a complete coverage claim.

## Current execution

| Task | Status | Assignment |
|---|---|---|
| T0 baseline | Complete; baseline checks passed | Luna medium |
| T1 contracts and tools | Implemented bounded foundation; 51 tests pass | Terra medium |
| T2 pilot | Repaired; paired locator checks and independent reviews passed | Luna extraction, Terra remediation/review |
| T3 chapter extraction | PS2 extracted; remaining chapters queued | Bounded chapter tasks |
| T4 consolidation | PS1/PS10 promoted; PS2 still private | Terra |
| T5 independent audit | PS1/PS10 reviewed; PS2 private review saved, promotion review pending | Terra |
| T6 routing and references | Partial pilot routes linked and documented | Coordinator |
| T7 documentation | Current score claims corrected; full release revision pending | Luna edits, coordinator check |
| T8 candidate validation | Pending implementation | Terra |

## Additional documentation evidence found during coordination

The Hungarian score totals in the root/sample index (15.2/18.9/19.8) differ from the versioned samples README (14.0/19.2/19.9), which also lists different word counts. The calibrated release report is a separate two-scenario artifact set. Reconcile these distinct sources rather than choosing the most favorable table. Keep historical artifacts intact and add a dated qualification where needed.

## Quota checkpoint and exact resume point

Stopped expansion after live five-hour remaining allowance moved from 80% to 36%, then 11%; weekly remaining moved from 32% to 21%. These are account-wide snapshots, not measured task-only consumption. Do not infer savings from the lower-tier assignments. No additional chapter workers were launched after the quota checkpoint decision.

The implemented foundation adds bounded PS glossary/fact retrieval, characters/magic/coverage commands, public record validation and private coverage reconciliation. A coordinator review found and requested fixes for empty evidence acceptance, later-scope fact leakage, incomplete coverage reported as complete, and missing-Hungarian verification. The worker reports those fixes and a passing 51-test suite, package/source validation and diff checks. The expanded overlap scan found no 30-word matches. The full planned synthetic schema matrix and supported runtime/OS matrix still need final release review; this is not a release-ready implementation.

Public character/magic datasets remain empty and explicitly incomplete. No candidate knowledge was promoted, no version was bumped, no tag or release was created, and current README corrections remain pending.

Private resumable artifacts are in `original-sources/research/ps/`:

- `baseline.local.json`, aggregate `progress.local.json`, and `docs-audit.local.json`.
- `candidates-PS1.raw.local.json` and `candidates-PS10.raw.local.json`: immutable extraction first passes.
- Working candidate files and per-chapter progress for PS1 and PS10. Both workers recorded full EN/HU chapter reading; that is not independent semantic approval.
- `review-PS1.local.json`: independent full paired read, preserved findings, and corrected working candidates. Unresolved items remain explicit. The raw first pass is unchanged.
- `pilot-locator-check.local.json`: initial mechanical failure evidence; this predates the PS1 review corrections and must not be mistaken for current results.

**Next task:** remediate PS10 before any further extraction. Its worker used scene descriptions instead of literal source locators, so most locator checks fail despite the JSON being valid. Some individually named characters/Quidditch terms are grouped and need separate identity/term records; full names and claims need PS-only review. Retain this first-pass failure as pilot evidence. Require a literal source check of every candidate before another agent reports a chapter complete. Reconcile PS1's remaining uncertainty without inventing spell mechanisms or translations, then independently review PS10. Only after the pilot gate passes should T3 begin.

When resuming, first check live quota, current git status, the frozen contract, and these private artifacts. Do not repeat the completed baseline or accepted source reads merely to reconstruct context. Keep pending/unresolved dispositions and incomplete public coverage until the actual acceptance checks pass.

## Resumed batch after five-hour reset

The user authorized continuation. Initial live allowance was 96% five-hour / 19% weekly remaining; the closing work checkpoint was 15% / 6%. No further chapter workers were dispatched after that checkpoint.

- Added `tools/check_research_candidates.mjs` with synthetic regressions. It requires actual contiguous paired locators, rejects empty candidate directories and filename/anchor mismatches, verifies edition hashes, and excludes immutable raw backups.
- Normalized per-chapter progress support in the private validator; workers no longer need manual ledger conversion.
- Repaired and independently reviewed PS10, including separate identities and Quidditch terms. The failed first pass remains preserved.
- Promoted the PS1/PS10 pilot: 42 character records, 14 magic records. Shared registries now contain 192 terms and 62 evidence cards. Fixed duplicate identities, Hungarian editorial labels and public manifest references during coordinator review.
- Added explicit partial-coverage links to the router, PS dossier and tools/coverage documentation. Full-book coverage remains incomplete.
- Corrected README and current samples index, preserving historical scenes/scores; added `samples/EVALUATION-NOTE.md` for unsupported/conflicting score provenance. No new writing-quality experiment was run.
- PS2 extraction and independent review are private: 52 candidates, with exclusions recorded. Its source locator and progress checks pass. No PS2 knowledge has been promoted.
- Full automated suite passed 57/57; package validation and all source checks passed on Node 26.4.0. Supported Node 22/24 OS matrix, isolated installation, full knowledge completeness and release gates remain pending.

**Current next action:** review PS2 exclusions for over-narrow interpretation of unnamed/accidental magic before promotion, then consolidate PS2 and begin PS3. Do not equate an unknown mechanism with an absent event. Read the saved review and decisive passages only. PS3–PS9 and PS11–PS17 still need complete paired extraction/review. The earlier quota checkpoint section is history, not the current next task.

All changes remain uncommitted, with version 0.3.1 unchanged. No tag, push, GitHub release or external publication occurred.
