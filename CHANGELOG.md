# Changelog

Release history for `harry-potter-fanfic`. Counts describe the data included in
each release; they do not measure literary quality or independent reading.

## 0.4.1 — 2026-10-11

The reference tools now provide typed retrieval for the first four books and
a common book-scoped terminology lookup. See the [release notes](docs/releases/v0.4.1.md)
for examples, compatibility details and limits.

### Reference data and tools

- Added PS, CoS, PoA and GoF inventories: 997 per-book records across characters,
  places, notable objects and identified human-cast spells, covering 94 chapters.
- Added bilingual concept ranking, category routes, chapter evidence filters,
  object magic status, record statistics and separate coverage reporting.
- Made `glossary --book PS|CoS|PoA|GoF` use compact typed terminology results,
  with paired evidence, formula/class distinctions and full-record commands.
- Added book-aware advisory Hungarian lint, explicit retrieval scope and
  focused glossary/facts help. Unfiltered glossary lookup retains series coverage;
  evidence-card book projections remain PS-only.
- Expanded the selective series glossary and evidence cards to 192 and 62 entries.

### Corrections and guidance

- Restricted spell retrieval to identified human casting. Kept unknown speech,
  later identification, spell-class reports and object behaviour distinct.
- Corrected first-book categories and presence records, including the Put-Outer,
  locations, broom models, Baruffio and Charlie. Retained book-specific Hungarian forms.
- Recorded PoA identity reveals and the lake rescue's two viewpoints without
  duplicating the cast. Separated real Moody from Crouch Junior in GoF, and
  distinguished wand inspection, the linked-wand effect and Portkey operation.
- Simplified Hungarian workflow selection and added a book-scoped lookup default.
  Added a seven-book retrieval roadmap and preserved a small blind GoF diagnostic.
- Rewrote the README and release notes around installation, everyday use,
  data coverage and known limits.

## 0.3.1 — 2026-09-17

- Expanded staff and student reference notes, including Flitwick, Sprout,
  Pomfrey, Filch, Percy, Zabini and Theodore Nott.
- Added six evidence cards and six bilingual terms, bringing the release totals
  to 50 cards and 151 glossary entries.
- Preserved the v0.3.0 writing samples in a versioned archive and updated the sample index.
- Fixed CLI help handling.

## 0.3.0 — 2026-09-17

- Added Hungarian prose, terminology and writing workflows, with a 145-entry
  bilingual glossary and a paired 199-chapter catalogue.
- Expanded import to permissive EPUB layouts and plain text/Markdown books,
  retaining strict validation as an option.
- Added advisory Hungarian terminology lint and writing-evaluation protocols.

## 0.2.2 — 2026-09-16

- Clarified public documentation and separated private source handling from user guides.

## 0.2.1 — 2026-09-16

- Added integration guidance for the complementary `better-writing` skill.

## 0.2.0 — 2026-09-16

- Introduced seven-book dossiers, craft references and 11 task workflows.
- Added local tools for search, chapter reading, paired access, continuity and manuscript checks.
- Included 44 evidence cards and 33 lexical topic categories.
