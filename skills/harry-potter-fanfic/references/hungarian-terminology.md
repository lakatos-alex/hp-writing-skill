# Hungarian terminology and text conventions

Load when Hungarian writing needs name consistency, suffix handling, forms of address, speech typography or spell terminology. For narrative craft, use [Hungarian prose](hungarian-prose.md). The glossary is a factual lookup resource, not a phrase bank or a style model.

## Resolve a term in context

Use `data/hu-glossary.json` relative to the installed skill root, or query the installed `scripts/hp.mjs` glossary command:

```sh
node scripts/hp.mjs glossary --query "Hogwarts"
node scripts/hp.mjs glossary --query "Stupefy"
```

Run these examples from the installed skill directory, or substitute the actual path to the script. The command also accepts `--category`; use a category value present in the data rather than inventing one. These lookups do not require local books. Primary passage verification does require the user's source files and the retrieval commands documented in [tools](tools.md).

Read the returned `en`, `hu`, `category`, `aliases`, `anchors`, `notes` and `verification` together. A matching alias is a way to find an entry, not necessarily the preferred manuscript form. An anchor locates evidence; it does not by itself say that the spelling, referent or every inferred property was verified. Respect the record's stated verification scope.

For each consequential term:

1. Identify the referent and function: person, place, office, creature, object, spell name, spoken formula or described effect. The same word can occupy different roles.
2. Check the project for an accepted override. Preserve a deliberate mixed-language convention, including original spell formulas, and keep it distinct from a Hungarian-edition default.
3. Inspect the glossary record, including limitations. If meaning or spelling remains uncertain, read the anchored Hungarian passage and the matched English event.
4. Choose the lemma and its grammatical form for this sentence. Do not paste the lemma unchanged where a case ending is needed.
5. Search both language forms in the draft and inspect the hits. References to the English edition, a bilingual letter or a deliberate quotation may correctly retain the English form.

A missing entry is a coverage gap, not proof that no Hungarian term exists. For an invented institution or spell, choose an original term and mark it as a project invention. Do not label a newly coined Hungarian form as a published translation.

Treat confidence as specific to the claim. `paired-term-checked` verifies the recorded referent and locator, not every inflected form or the correctness of a newly written sentence. The usage examples below are grammatical guidance; they are not additional source quotations. Keep a project override, a source-verified lemma, an editorially checked inflection and an unresolved guess distinguishable in existing terminology notes. When a lookup fails during actual writing, retain the attempted query and intended referent for later dictionary development; do not add speculative synonyms merely to increase coverage.

## Project overrides and names

Keep overrides in the project's existing terminology notes. Record the English referent, preferred project form, scope and reason only as far as useful. For example, a project may use Hungarian place names but English incantations. That is a coherent choice when it is deliberate; no global replacement should erase it.

Use established Hungarian canonical name forms from the glossary; do not translate additional names creatively just because another name was localized. English personal-name order normally remains intact in Hungarian prose: `Harry Potter`, not `Potter Harry`. A Hungarian original character may use family-name-first order in a Hungarian context. Do not infer nationality, kinship or social distance merely from a name's order.

Title placement and name order are separate decisions: `McGalagony professzor`, `Piton professzor`, and direct `professzor úr`/`professzor asszony` address can coexist with the retained order of a full personal name. Use only the name components needed in the scene; do not repeatedly insert middle names because a formal record lists them.

Married forms, family plurals and collective expressions require context. `Dursleyék` refers to the family or associated group, not an ordinary English plural mechanically imported into Hungarian. Do not manufacture `-né` forms for every woman or treat a married title as proof of how the character privately identifies herself. Preserve an established project's convention for `Mr.`, `Mrs.`, `úr`, `asszony` and family references; do not mix them accidentally within the same narrative register.

## Suffixes, compounds and accents

Suffix a name according to its pronunciation and written ending; a foreign spelling does not automatically take a hyphen. Safe, common examples illustrate different decisions:

| Lemma | In a sentence | What to inspect |
|---|---|---|
| Harry | `Harrynek szólt.` | Direct attachment; no reflex hyphen after a foreign name |
| Ron | `Ronnal ment.` | Assimilation of `-val/-vel` |
| Hermione | `Hermionéval beszélt.` | Final vowel lengthening and a spoken vowel ending |
| Dumbledore | `Dumbledore-ral találkozott.` | Silent final letter; hyphen and pronunciation-based assimilation |
| Roxfort | `Roxfortban maradt.` / `roxforti diák` | Case suffix versus derived adjective and capitalization |
| Zárolt szekció | `A zárolt szekcióban kutatott.` / `a zárolt rész könyvei` | Canonical name for Restricted Section (PS12, CoS9); informal *tiltott könyvek* |
| Kvibli | `Frics kvibli mivolta kiderült.` | Direct suffix attachment for Squib (CoS9) |
| VillámVarázs | `A VillámVarázsból próbált tanulni.` | Canonical name for Kwikspell course (CoS8, CoS9) |

These examples do not constitute a universal suffix generator. Check unfamiliar spellings and uncertain pronunciation against a reliable Hungarian orthographic reference or the project's established forms. Do not extrapolate from the final written letter alone. Distinguish attaching a suffix from forming a compound; they do not share one blanket hyphen rule.

Choose the case ending from the actual spatial relation: arrival, location and departure are different. A spell affecting someone and a conversation addressed to someone also require different constructions. Check a full sentence when a suffix looks wrong, rather than replacing endings mechanically across names.

Preserve `ő` and `ű`, vowel length, and accepted capitalization. Search accentless variants as error candidates only; a filename, source title or quoted artifact may use a different convention intentionally. Uppercase typography in a chapter heading does not establish capitalization in running prose. Inflect the final appropriate component of a multiword name without detaching or reordering the name to make the suffix easier.

When an inflected incantation looks awkward, use a carrier noun: `az Expelliarmus varázsigét` or `a lefegyverző bűbájt`. The choice depends on whether the sentence discusses the words or the magical action. Do not change the actual uttered formula just to attach a suffix to it.

## Incantation, named spell and effect

Keep three layers separate:

- **Incantation:** the words a caster actually utters. Some published Hungarian formulas differ from English ones; consult the specific record.
- **Spell or category name:** how characters or the narrator refer to the magic. This can be a descriptive Hungarian noun phrase.
- **Effect:** what observably happens to the target. It may be partial, resisted, interrupted or absent.

GoF9 supplies a paired example for `Stupefy` / `Stupor` and the subsequent description of Stunning Spells. The observed bolts and their targets belong to the event; the words belong to the incantation layer. CoS6's classroom formula has no demonstrated success in that passage. Its presence in a book or glossary does not make it a reliable creature-control technique.

Do not backfill a spoken incantation merely because a spell's effect is named. HBP26's rescue passage describes fire and its control; that does not authorize inventing a canonical spoken formula for it. If a new scene needs an invented formula, identify it as a story choice and establish its limits through the magic workflow.

An epithet, office and personal name can also refer to the same entity with different effects. The chosen form may disclose fear, allegiance, politeness or access to a secret. Preserve those distinctions instead of normalizing every mention to one dictionary headword.

## Address is directional and situational

Track how A addresses B separately from how B addresses A. A pupil may use formal verb forms and a title while the teacher uses `te`; first-name address does not automatically entail mutual tegezés. CoS14 and OotP8 offer different power relations within the same scene. English `you`, `sir` or `Miss` does not map to one Hungarian form in every context.

For a consequential relationship, note the normal address and any motivated shift. Useful controls include title versus name, tegezés versus magázás, direct command versus mitigated request, and whether a familiar form is welcome or patronizing. `Ön` and `maga` are not interchangeable in emotional effect, but neither is universally polite or rude independent of context. A hostile official can use impeccably formal language; an intimate relationship can retain formal address by choice.

Original contrast:

> – Megmutatná a levelet, professzor úr?
>
> – Mutasd csak, mit hoztál.

The asymmetry is deliberate. If the same adult later asks `Megmutatná a levelét?`, decide whether it signals official procedure, distance, irony, or a different addressee. Do not let an accidental translation switch invent a relationship change.

## Speech punctuation

Follow the host project's established typography. For standard Hungarian literary dialogue, use a dialogue dash (`–`), normally with a space, and a new paragraph for a new speaker. Do not use the English quotation-mark system by default or replace dialogue dashes with list hyphens.

All examples below are original:

```text
– Hol a kulcs? – kérdezte Nóra.
– Nálam – felelte Áron.
– A kulcs – mondta Nóra – tegnap még a fiókban volt.
– Rendben. – Áron letette a csészét. – Megkeresem.
```

A question or exclamation mark stays before the closing dash when followed by a speech tag. A simple declarative utterance followed by a tag does not keep a full stop there. The speech tag starts lowercase; an independent action sentence starts uppercase. In the third example the inserted tag divides one spoken sentence, so the continuation remains lowercase. If syntax requires a comma at the interruption point, retain the appropriate comma after the closing dash.

Use Hungarian `„…”` quotation marks for a quotation inside a spoken line or a short quoted text according to project convention. A dash that marks an interruption, a dialogue-opening dash and a hyphen in an inflected name do different jobs. Preserve intentional trailing off, but do not turn every pause into an ellipsis. Imported EPUB typography may contain errors; source punctuation is not automatically a house style rule.

Finish by reading the scene for unintended changes of identity, formality and magical meaning. A uniform dictionary spelling is useful only when it preserves what the speaker means and what the story establishes.

## Check who gives, receives and owns

At a consequential transfer, inspect the sentence's actual grammar and context, not just the intended stage direction. `Máté Réka felé nyújtotta a kulcsot` names both giver and recipient. `Réka felé nyújtotta a kulcsot` can be ambiguous: Réka may be the recipient after an omitted subject, or the subject followed by pronominal `felé` referring to someone else. Context can resolve it. Do not call a possible reading a proven custody contradiction; name both participants when the ambiguity makes a consequential handoff hard to follow.

Apply the same check to kinship and possession: a nearby subject can make `a húga táskája` refer to the wrong family. Use a name when the ambiguity changes continuity. For reported speech, distinguish a promise (`azt mondta, hogy megkeres minket`) from a requested action (`azt kérte, hogy keressük meg`). Do not let a polished sentence reverse who acts, requests or knows.
