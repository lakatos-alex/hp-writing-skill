# Philosopher's Stone retrieval pass — 2026-10-10

The policy-2 inventory spans PS1–PS17: 117 distinct character records (including
seven separately typed named animals), 53 places, 70 notable object types,
artefacts and titles, and six identified spells. Anonymous crowds, generic
furniture and every incidental ordinary noun are outside this inventory.

The spell index contains Alohomora, Wingardium Leviosa, Bluebell Flames,
Locomotor Mortis, Petrificus Totalus and the retrospectively identified Killing
Curse. Bluebell Flames has unknown spoken words; it is not assigned Incendio.
The Killing Curse has PS4 reported occurrences and separate GoF14 identification
evidence. No occurrence in this pass is certified non-verbal. `unreported`
means the passage does not establish whether words were spoken.

## Evidence and review limits

This pass checks selected bilingual passages supporting identities, roles,
object properties and casting events. Literal term mentions are separately
labelled and do not establish physical presence or a complete event inventory.
An anchor filter selects records with evidence or literal mentions at that
chapter; it does not remove later events within the same book from the record's
description. This is not a scene knowledge-cutoff feature.

The earlier PS1/PS10 pilot is superseded for retrieval classification. Its
private source and research files remain recoverable. Historical candidate
counters remain under `legacyPilot`; current index counts describe policy 2.
Chapter reading states are `partial`: this pass did not perform independent
full-book semantic reading. Inventory completion is reported separately from
that review gate by `coverage`.

The supplied Hungarian edition uses Badarus (Fudge), Ampók (Griphook), Shintlats
Hotel (Railview Hotel), and several early textbook-author translations. These
are preserved with English identities. The Cokeworth hotel-address counterpart
is not verified in Hungarian and is excluded from the paired index. The
GoF14 incantation locator is `Adava Kedavra` in this supplied edition; this is
an edition observation, not a recommendation to change spellings in other
editions. Descriptive Hungarian labels are marked editorial when no formal
headword is established.

## Removed and excluded observations

| Chapters | Observation | Decision |
|---|---|---|
| PS1 | Put-Outer, flying motorbike | Object records, not casts |
| PS1 | McGonagall's cat transformation | Animagus ability, not an identified cast spell |
| PS1 | Dumbledore's arrival/departure | Method unnamed; no assigned Apparition spell |
| PS1 | Shooting-star report | Speculation about Diggle; no identified cast |
| PS1, PS4 | Scar, survival, broken power | Consequences, not separate spells; the reported attack is indexed separately |
| PS2 | Hair regrowth, shrinking jumper, roof escape, vanishing glass | Accidental magic; exclude from deliberate spells |
| PS3 | Letter delivery through eggs and chimney | Delivery phenomena; no identified caster/spell |
| PS4 | Hagrid lighting a fire, giving Dudley a tail | Deliberate magic, but exact spells unidentified; no inferred Incendio or named transformation |
| PS5 | Boat propulsion, alley-wall opening, wand-fitting sparks | Unknown casting mechanism or object operation; no invented spell identities |
| PS6 | Ron's rat-colouring rhyme | Failed, questioned as a real spell; exclude rather than certify |
| PS7 | Floating candles, ceiling, feast and golden wand ribbon | Enchantments/effects without identified casting spells |
| PS8 | Desk-to-pig, match-to-needle and potion-spill cleanup | Unidentified transformations/cleanup; exclude named guesses |
| PS9 | Broom `Up!` | Activating a broom; object behaviour, not a separately identified spell |
| PS9 | Switching Spells and Curse of the Bogies | Theoretical references without an identified casting event |
| PS10 | Nimbus flight, Bludgers, Snitch | Object records |
| PS10 | Flitwick's earlier toad demonstration | Similarity to the levitation lesson does not identify the precise spell |
| PS10 | Seamus igniting the feather | Failed levitation practice recorded; ignition is not promoted to a fire spell |
| PS10 | Dumbledore's firecrackers | Unidentified wand effect |
| PS11, PS17 | Quirrell's broom jinx and Snape's counter-curse | PS17 establishes actors, but not spell identities; no named guesses |
| PS11 | Colour-flashing banner | Unidentified charm |
| PS12 | Pursuing snowballs, Flitwick's golden bubbles, Dumbledore's invisibility | No specific spell identity or proven casting vocalisation |
| PS12 | Cloak, Mirror, moving cards/chess and screaming book | Object properties, not casts |
| PS13 | Hermione's Leg-Locker counter-curse | The action is clear, but no incantation or separately identified counter-spell; do not invent Finite |
| PS14 | Ministry wizards making dragon witnesses forget | Generic reported effect; no explicit link establishing the specific incantation here |
| PS15 | Red/green signal sparks | No Vermillious or other adaptation-derived name assigned |
| PS15 | Unicorn blood and scar pain | Biological/protective effects, not human cast spells |
| PS16 | Anti-Cheating quills, winged keys, giant chess | Enchanted objects; no witnessed manufacture or exact casting spells |
| PS16 | Dancing pineapple and mouse-to-snuffbox exams | Unidentified practical magic |
| PS16 | Devil's Snare, troll, potion puzzle and fire barriers | Plant/creature/potion effects or protections with unknown casting identities |
| PS17 | Conjured ropes, threatened deadly curse, burning Quirrell | Unknown spell, uncompleted threat, or protective consequence; no inferred Incarcerous/Avada cast |

Object classification follows notable catalogue types, including ordinary
objects. For example, the Wiki explicitly treats the [flute](https://harrypotter.fandom.com/wiki/Flute),
[Sickle](https://harrypotter.fandom.com/wiki/Sickle), and
[Quaffle](https://harrypotter.fandom.com/wiki/Quaffle) as objects. These pointers
do not establish enchantment in PS or authorise importing film/game details.
The [official first-book magic guide](https://www.harrypotter.com/features/guide-to-the-spells-creatures-and-potions-of-philosophers-stone)
provides a cross-check; its broader use of “spells” is not this index's stricter
casting policy. Novel passages remain the authority for events and translations.

Named confectionery and reading titles are object types, rather than new spells.
The harp beside Fluffy has `not-established` enchantment: the novel does not
show the film's self-playing mechanism. Explicitly described object properties
can qualify as `demonstrated` without a witnessed manufacturing cast; the index
does not claim every advertised feature was tested in the story.

## Validation record

- `node --test tools/tests/*.test.mjs`: 67/67 passed on Node.js 26.4.0.
- Package validation: passed; 193 files, links, metadata and data boundaries.
- Book knowledge validation: 117 characters, six spells, 53 places and 70 objects
  across 17 represented chapters; 246 finalized records.
- Local source verification: 1,292 EN/HU semantic-index locators passed, including
  the later Killing Curse identification. Existing EPUB fidelity/hash and
  public source-text checks also passed; PDF visual fidelity is a separate gate.
- Isolated `npx skills add` copy installation and source-free CLI queries passed.
- `git diff --check`: passed. No release, push or remote CI run was requested.

Structural validation and literal locator success do not substitute for
independent full-book review. The Node.js 22/24 matrix was not rerun in this pass.
