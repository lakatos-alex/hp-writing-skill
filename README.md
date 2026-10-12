# Harry Potter Writing Skill

![An illuminated map-book and magical academy architecture in a study](assets/harry-potter-writing-skill-social-preview.png)

**Version 1.0.1.** An agent skill for researching, planning, writing and revising
original Harry Potter fanfiction. It combines writing guidance, continuity checks
and searchable book references, with support for English and Hungarian.

## Why I made it

I started this for my own fanfiction. Over months of writing in AI chats, the
same problems kept coming back: a character forgot something they had learned,
an object changed hands without a scene, or everyone began to sound alike.
The prose also picked up habits I wanted to lose, from repeated gestures to
long explanations of feelings that the scene had already shown.

Moving the story into a repository gave me somewhere to keep chapters and
continuity notes. Astra helped me review the existing archive. I then started
collecting the writing guidance and reference tools that were useful enough to
reuse. Hungarian names, spell wording and sentence structure became part of
that work too.

This is a hobby project, developed alongside the stories I write. I'm sharing it
because the same tools may help someone else keep a longer story together.
The references support a shared writing experience across all seven novels.

## Install

Install from GitHub with the [skills CLI](https://skills.sh/docs/cli):

```sh
npx skills add lakatos-alex/hp-writing-skill --skill harry-potter-fanfic
```

To stay on this release:

```sh
npx skills add https://github.com/lakatos-alex/hp-writing-skill/tree/v1.0.1 --skill harry-potter-fanfic
```

You can also copy the [skill folder](skills/harry-potter-fanfic/SKILL.md) into
your agent's skills directory. The guidance has no runtime requirement.
The optional tools need **Node.js 22 or newer** and have no third-party runtime
dependencies. Availability and skill invocation depend on your agent.

## Tool language

Reference output defaults to English. To remember a story project's language,
run the installed script with the project's directory:

```sh
node /path/to/harry-potter-fanfic/scripts/hp.mjs config --lang en --project /path/to/story
```

Use `hu` for Hungarian names and source locators, or `both` for paired output.
The preference lives in `.hp-writing.json` in the story project. Run subsequent
queries from that project, or pass `--project` from elsewhere. An explicit
`--lang` overrides the preference for one call. Explanatory summaries remain
English; selecting Hungarian does not translate them.

## Working with it

Give the agent your brief, accepted story notes and the chapter or scene you want
to work on. Set the era, viewpoint, language and any deliberate departures from
canon. For example:

```text
Use harry-potter-fanfic to revise this scene. Keep Lina's close-third-person
viewpoint and the ending. Check what each character knows, who has the key,
and whether the failed spell has a consequence in the next scene.
```

```text
Use harry-potter-fanfic to research a fourth-year scene. Find the relevant
book references for the spell and object involved. Separate what the reader
learns later from what the students can know at this point.
```

The [entrypoint](skills/harry-potter-fanfic/SKILL.md) routes the agent to the
relevant workflow. There are guides for chapter production, revision, character
work, mysteries, daily life, magic, canon research and continuity. They are
loaded as needed. For a short scene, the agent checks two to four consequential
canon facts, then writes through character choices and practical action. The new
[selected canon reference](skills/harry-potter-fanfic/references/selected-canon-constraints.md)
brings 20 useful constraints from all seven books into one readable guide.

Start drafting with the included workflows and references. The tool provides
optional search and evidence retrieval, and an existing general writing skill
can complement the project when useful. No companion installation or language
configuration is required for manual reference use.

The seven novels are the primary canon baseline. Film or other adaptations can
be used when you choose them, with the difference recorded. Writing guidance
focuses on original prose, character motives, viewpoint and cause and effect.
Your accepted story decisions govern an alternate universe.

## Searchable references

The package includes a **199-chapter English–Hungarian catalogue** for all seven
books, **192 selective series glossary entries** and **72 evidence cards**.
Typed semantic inventories now cover all seven core novels:

| Book | Chapters | Characters | Places | Objects | Spells | Records |
|---|---:|---:|---:|---:|---:|---:|
| Philosopher's Stone (PS) | 17 | 117 | 53 | 70 | 6 | 246 |
| Chamber of Secrets (CoS) | 18 | 97 | 47 | 75 | 8 | 227 |
| Prisoner of Azkaban (PoA) | 22 | 89 | 56 | 72 | 14 | 231 |
| Goblet of Fire (GoF) | 37 | 129 | 61 | 66 | 37 | 293 |
| Order of the Phoenix (OotP) | 38 | 143 | 50 | 61 | 45 | 299 |
| Half-Blood Prince (HBP) | 30 | 116 | 36 | 36 | 32 | 220 |
| Deathly Hallows (DH) | 37 | 118 | 41 | 42 | 39 | 240 |
| Total | 199 | 809 | 344 | 422 | 181 | 1756 |

These are per-book records: a person or object can appear in more than one
inventory. Characters include 59 separately typed animals. Objects include
notable ordinary items and book titles; their inclusion does not establish that
they are magical.

Spell records require identified human casting, including known failed attempts.
Object behaviour, accidental magic and unidentified effects are separate.
Missing spoken words do not establish a non-verbal cast; silent casting needs
evidence of both the spell and its use. Later identification is labelled.
The records contain 365 casting, practice or reported-event rows and 14
separate spell-class reports. Grouped practice is not a count of individual casts.

The inventories store 2173 contextual evidence pairs and 3586 literal-mention pairs
across English and Hungarian. These can reuse passages. They measure stored references,
not independent readings. Inventory completion is reported separately from
full-book semantic reading and editorial review, which remain incomplete.

From the installed skill folder, try:

```sh
node scripts/hp.mjs glossary --book all --query "float feather" --limit 3
node scripts/hp.mjs glossary --book GoF --category spell --query "Killing Curse" --limit 3
node scripts/hp.mjs semantic --book PoA --query "travel time"
node scripts/hp.mjs objects --book PS --magic-status ordinary --limit 5
node scripts/hp.mjs semantic --book all --id object:deluminator
node scripts/hp.mjs glossary --book HBP --query "Prince" --limit 3
node scripts/hp.mjs stats
node scripts/hp.mjs coverage --book GoF
```

Book-scoped glossary lookup works for **PS, CoS, PoA, GoF, OotP, HBP and DH**. It returns compact
terms and evidence in the selected language, plus a command for the full record.
Hungarian DH labels carry a transcription warning and need edition verification.
Use `--lang both` to compare the English and Hungarian forms. A spell
class name is distinguished from its spoken formula. Unfiltered glossary
lookup uses the separate, selective series glossary. Evidence-card queries
support all seven books with `facts --book BOOK`; `facts --book all` returns
the selective series collection. Each result retains its evidence and scope.
The [manual inventory index](skills/harry-potter-fanfic/references/book-dossiers.md#typed-inventory-navigation)
links directly to every book's characters, spells, places, objects and coverage.

Whole-book records can contain later revelations. A chapter filter is useful
for finding evidence, but does not enforce a character's knowledge at that point.
If a narrow search has no match, the tool can suggest relevant records from
another book for inspection. These suggestions retain their original book and
knowledge limits. Try a shorter query or the unified view for broader discovery.
Use `semantic --book all` to search across books. Shared referent IDs connect
known identities while preserving separate evidence, properties and reveal anchors.

## Using your own book files

The package contains no novels or full-text passages. Bundled reference queries
work without books. For passage searches and chapter reading, provide your own
local EPUB, text or Markdown files:

```sh
node scripts/hp.mjs import --sources /path/to/books --lang en
node scripts/hp.mjs search --sources /path/to/books --lang en --book PS --query "Restricted Section"
```

The [tool guide](skills/harry-potter-fanfic/references/tools.md) explains import,
bounded reading, bilingual chapter access and manuscript checks. The continuity
checker validates supplied story events; it does not understand an entire draft
on its own. Book files and manuscripts stay outside the distributed package.

## Magyar olvasóknak

Magyarul is használhatod a skillt kutatásra, tervezésre, írásra és javításra.
A [magyar írási útmutató](skills/harry-potter-fanfic/references/workflow-hungarian-writing.md)
a természetes szórenddel, a mondathangsúllyal, a párbeszédek írásmódjával és a
szereplők eltérő beszédmódjával foglalkozik. A cél saját magyar próza.

A kereső alapértelmezésben angol neveket és hivatkozásokat ad vissza.
A `config --lang hu --project /path/to/story` paranccsal mentheted a magyar
beállítást; összehasonlításhoz használd a `--lang both` kapcsolót.
A magyarázó összefoglalók továbbra is angolul szerepelnek.
A magyar terminológia Tóth Tamás Boldizsár fordításának ellenőrzött
szóhasználatára támaszkodik; az adott kötet és szöveghely számít. Mind a hét
könyvhöz van könyvre szűkített keresés. A hetedik kötet magyar átírása azonban
hibás ékezeteket és szóalakokat tartalmaz: a keresési kulcsokat és a megadott
neveket ellenőrizd megbízható kiadásban. A `lint-hu --book DH` ezért nem ajánl
névcseréket. A saját történetedben elfogadott
névváltozatokat is add meg az agentnek.

```text
Használd a harry-potter-fanfic skillt a jelenet javításához. Maradjon a szűk
nézőpont és a befejezés. Ellenőrizd a magyar neveket a harmadik könyv alapján,
és húzd meg azokat a mondatokat, amelyek újra elmagyarázzák a már látható érzést.
```

A `lint-hu --file /path/to/draft.md --book PoA` ellenőrzés felhívhatja a
figyelmet az angol névalakokra. A szöveget nem írja át; az idézeteket, a
fejezetenként eltérő alakokat és a saját névhasználatot külön kell mérlegelni.

## Release 1.0.1

This patch makes the seven-book experience easier to use: one compact canon
reference, equal manual navigation, unified terminology lookup and safe fact
queries across all seven books. The evidence-card library now contains 72 cards.

In a targeted comparison using the same writing prompt, a fresh Luna Medium draft
with the expanded manual references scored **16/20**, compared with **13/20** for
the previous skill-only draft under a blinded Sol 6.1 Medium judge. The gain came
from canon accuracy. This describes the observed comparison rather than a
percentage estimate of general writing quality.

The release is checked with automated tool tests, package and source validation,
and an installation smoke test. See the [release notes](docs/releases/v1.0.1.md)
and [changelog](CHANGELOG.md). Development procedures live in
[contributing](CONTRIBUTING.md) and the [release guide](skills/harry-potter-fanfic/PUBLISHING.md).

## License and credits

Original guidance, tools and documentation are available under the
[MIT License](LICENSE). Maintained by [Alex Lakatos](https://lakatosalex.hu).
See [acknowledgments](ACKNOWLEDGMENTS.md).

This is an independent fan project, with no affiliation or endorsement from
the Harry Potter rightsholders. Rights in the books, characters and trademarks
remain with their respective owners.
