# Seven-book semantic retrieval roadmap

## Scope and acceptance policy

Develop source-free, bilingual retrieval for people, places, objects and spells.
Keep one record per referent, with searchable aliases, original descriptions,
concept terms and short chapter locators. The novels establish events and names;
the Harry Potter Wiki supplies object classification pointers only. Film and
game details never become novel evidence.

A spell occurrence requires deliberate casting by a human, an identifiable
spell and evidence of the event (including a specifically reported casting).
Wands are optional. Record spoken casting, explicitly non-verbal casting and
unreported vocalisation separately: an omitted incantation does not prove
non-verbal casting. A non-verbal identification needs explicit supporting
evidence, which may come from a later novel. Keep the occurrence chapter and
the identification chapter separate. Never infer a named spell from a similar
effect alone. Failed casts of real spells qualify; dubious rhymes do not.

Exclude accidental childhood magic, Animagus transformations, Apparition,
creature abilities, potions, object activation, unexplained wand effects,
rumours and uncast theoretical references from spell results. Keep exclusion
decisions auditable rather than turning each observation into a new spell.

People include named humans and individually identifiable speaking beings;
named animals remain character records, separately typed. Do not manufacture
individuals from anonymous crowds. Preserve names as known in the indexed book.
Places include named locations and distinct, useful story spaces. Do not create
a place for every doorway. Objects include notable named artefacts, catalogued
types and book titles used in the narrative. An object record is not a claim of
enchantment: use `demonstrated`, `not-established` or `ordinary` magic status.

## Implementation order

Phases 1–7 have completed scoped retrieval inventories; see the
[PS review](ps-semantic-review.md), [CoS review](cos-semantic-review.md),
[PoA review](poa-semantic-review.md), [GoF review](gof-semantic-review.md) and
[five-book checkpoint](ootp-semantic-review.md).
Their independent full-book reading/review gates remain incomplete. Phases
6–7 are recorded in the [1.0 milestone review](core-books-milestone.md).
Phase 8 has shared identity links and cross-book retrieval; fresh evaluation,
installation testing and independent reading remain pending.

| Phase | Book / chapters | Main work | Completion gate |
|---|---|---|---|
| 1 | Philosopher's Stone / PS1–PS17 | Replace the PS1/PS10 magic pilot; curate all four categories; bilingual concepts and aliases; ranked unified retrieval; explicit exclusions and later identification | All 17 chapters represented in the scoped inventory; paired locators pass; taxonomy and retrieval regressions pass |
| 2 | Chamber of Secrets / CoS1–CoS18 | Dueling and memory spells; distinguish diary, possession and basilisk effects; Burrow, Knockturn Alley and Chamber; new people and object identities | Same checks, plus no adaptation-only spell names |
| 3 | Prisoner of Azkaban / PoA1–PoA22 | Patronus casting and failed practice; separate Animagus and time travel from spells; Map, Time-Turner, Hogsmeade and aliases | Alias merges and time/knowledge boundaries pass |
| 4 | Goblet of Fire / GoF1–GoF37 | Unforgivable Curses, Summoning and tournament spells; caster identity versus disguise; Portkey and Cup | Link justified earlier spell identifications without rewriting earlier scene knowledge |
| 5 | Order of the Phoenix / OotP1–OotP38 | DA practice and Ministry battle; distinguish performed, attempted and reported spells; Ministry rooms and Order members | Dense battle events preserve caster, target and outcome; no event multiplication from repeated narration |
| 6 | Half-Blood Prince / HBP1–HBP30 | Explicit non-verbal instruction; invented spells and counter-spells; potion effects and cursed artefacts | Unknown versus proven non-verbal casting remains distinct; provenance of invented names retained |
| 7 | Deathly Hallows / DH1–DH36 and epilogue | Wand ownership, protective enchantments, Horcrux/Hallow objects and final identities | Scoped inventory complete; degraded Hungarian wording is not certified spelling authority |
| 8 | Cross-book consolidation | Shared identity links, separate book projections, explicit reveal anchors, alias review; later quality benchmark and installation check | Retrieval implemented; whole-book results are not a strict scene knowledge filter; new tests deferred for 1.0 |

Each book has a separate inventory completion state and reading/review state.
Targeted evidence review, lexical source verification and independent full-book
semantic reading are different gates. Report them separately. Mechanical passes
do not certify an exhaustive literary reading or independent editorial review.

## Validation and release

The user explicitly deferred new tests for the 1.0 milestone. Record the local
suite, writing evaluation and installation check as pending; historical checks
do not certify the new inventories. The normal procedure below resumes when
testing is requested. Preserve source privacy and inspect the release archive.

Run the automated suite, package validation and source verification after data
changes. Regression cases cover natural-language concepts, bilingual aliases,
accent handling, exact-name ranking, empty results, pagination, chapter/category
filters and taxonomy false positives. Inspect the public diff for private text.
Test installation from a source-free copy. Publication and a release/version
bump require a separate publication request.
