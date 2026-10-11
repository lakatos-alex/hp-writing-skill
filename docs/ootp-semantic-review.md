# Five-book inventory checkpoint

The development datasets for PS, CoS, PoA, GoF and OotP use the same policy-2
character, spell, place, object and coverage contracts. All 132 chapters have
representation in these scoped inventories. This is an inventory checkpoint,
not certification of exhaustive reading or a published release.

| Book | Characters | Spells | Places | Objects | Records |
|---|---:|---:|---:|---:|---:|
| PS | 117 | 6 | 53 | 70 | 246 |
| CoS | 97 | 8 | 47 | 75 | 227 |
| PoA | 89 | 14 | 56 | 72 | 231 |
| GoF | 129 | 37 | 61 | 66 | 293 |
| OotP | 143 | 45 | 50 | 61 | 299 |
| Total | 575 | 110 | 267 | 344 | 1296 |

Counts are stored per-book records. They include recurring referents and do not
measure a globally deduplicated database. Characters include animals and
separately typed non-human beings. Objects retain explicit magic status.

## OotP decisions

The 143 character records include 116 humans, 10 magical beings, 10 animals,
five portraits and two ghosts. Individually identifiable unnamed human casters
have editorial labels; anonymous crowds are not multiplied into people.
The 61 objects comprise 38 with demonstrated magic, 18 ordinary objects and
five whose magic is not established in this book.

The 45 identified spell families contain 113 grouped casting, practice or
reported-event rows and seven separate spell-class reports. No occurrence is
certified as non-verbal merely because speech is absent. Dolohov's unnamed
purple attack remains outside identified-spell results. Object operation,
Apparition and Animagus changes remain separate. James lifting Snape is linked
to later explicit Levicorpus identification without inventing the original
vocalisation or giving earlier characters the later name.

Targeted paired context review reached selected passages in all 38 chapters,
including the final chapter. Corrections removed misleading generic locators,
stale descriptions copied from earlier books and unsupported certainty about
particular object properties. Inventory descriptions can summarize whole-book
developments; chapter filters do not establish what a character knew then.

## Checks and continuation

All five typed contracts, package validation, source verification and the four
OotP regression tests pass. Source checks resolve 10,342 semantic-index locator
endpoints, including later identifications. Normalized text comparisons ignore
punctuation and whitespace; Hungarian PDF conversion has separate limitations.
These checks do not independently establish every interpretive claim.

Before the writing comparison, the automated suite passed 104 of 105 tests.
The remaining assertion compared README counts; that update was held until
the requested favourable writing result. The [writing review](ootp-writing-review.md)
reports evaluation outcomes separately from retrieval checks.

After that update, all 105 automated tests pass. Package and source checks
pass, and an isolated `npx skills add` installation copies all 110 skill files
byte-for-byte and supports the five inventories without book files.

Follow the same typed process for HBP and DH, then selected supplementary books
with explicit edition and canon status. Cross-book consolidation must review
referent identity, aliases, edition variants and later knowledge before merging
records. Keep extraction fidelity, inventory completion and independent reading
as separate states. The contributor sequence is recorded in AGENTS.md and the
book-knowledge contract.
