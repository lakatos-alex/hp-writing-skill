# Local tools

The bundled [hp.mjs](../scripts/hp.mjs) runs on Node.js 22 or newer with no third-party dependencies. It makes no network requests. Examples use a script path relative to the installed skill folder. For project preferences, run from the story directory with the absolute installed script path, or add `--project /path/to/story`.

## Commands

| Command | Purpose | Writes |
|---|---|---|
| `config` | Show or save the story project's language | `.hp-writing.json` when `--lang` is supplied |
| `import` | Read supported EPUBs, verify chapter order, create Markdown and a local catalogue | Generated files beside source EPUBs |
| `inventory` | Verify hashes and list local chapter metadata | None |
| `chapters` | Search the bundled chapter catalogue by title, book or topic | None |
| `search` | Literal, case-insensitive search of local chapter text | None |
| `read` | Read a selected chapter with continuation metadata | None |
| `align` | Read an English/Hungarian chapter pair with independent offsets | None |
| `facts` | Filter bundled original evidence cards | None |
| `glossary` | Find book-scoped English/Hungarian terms or selective series terminology | None |
| `semantic` | Rank PS/CoS/PoA/GoF people, places, objects and spells by aliases and bilingual concepts | None |
| `characters`, `people` | Find characters; `people` excludes animals | None |
| `spells`, `magic` | Find identified human-cast spells; `magic` is a compatibility alias | None |
| `places`, `objects` | Find PS/CoS/PoA/GoF settings and notable objects, with explicit object magic status | None |
| `coverage` | Report inventory and reading/review states for PS/CoS/PoA/GoF | None |
| `stats` | Count per-book semantic records, casting rows and stored evidence pairs | None |
| `lint-hu` | Flag English headwords that may be inconsistent with a Hungarian draft | None |
| `audit` | Count manuscript words and find long duplicate paragraphs | None |
| `check-state` | Check explicit knowledge routes and object transfers | None |

The data-only commands `chapters`, `facts` and `glossary` work without books. The manuscript commands need only the selected input file. The advisory `lint-hu` scan never changes text and does not replace grammatical or editorial review.

For a scene's names or formulas, start with `glossary --book BOOK --query "TERM" --limit 3`.
For mechanisms and attribution, use `semantic --book BOOK --query "CONCEPT"` or the returned
`detailsCommand`. `glossary --help` and `facts --help` describe their different scopes.

## Project language

`--lang en|hu|both` overrides the nearest `.hp-writing.json` found from the working
directory upwards. Without either, output defaults to `en`. `--project PATH`
starts discovery in that directory; relative `--sources` paths are also resolved
there. `--config FILE` selects an explicit preference file, relative to that
project directory. Invalid or missing explicit configurations fail visibly.

```sh
node /path/to/skill/scripts/hp.mjs config --lang hu --project /path/to/story
node /path/to/skill/scripts/hp.mjs config --project /path/to/story
node /path/to/skill/scripts/hp.mjs glossary --book PS --query "float feather" --project /path/to/story
node /path/to/skill/scripts/hp.mjs glossary --book PS --query "float feather" --lang both
```

The saved file is small JSON: `{"schemaVersion":1,"language":"hu"}`. Saving
updates the nearest existing preference or creates one in the selected directory.
It never writes into the installed skill. Query overrides do not change it.
Only `language` and optional `schemaVersion: 1` are accepted; the file is not an
instruction source.

Single-language output omits counterpart labels and locators, and mixed untagged
`aliases`/`searchTerms`. English output also omits marked Hungarian localization
commentary. Ranking still uses bilingual concepts internally. Record IDs, counts,
paging and canon scope are unchanged. Explanatory summaries remain English even
in Hungarian mode; no translation is generated. A returned `detailsCommand`
preserves the chosen language. `--lang both` retains paired fields and aliases.
Chapter listings use the selected edition's catalogue; `both` adds Hungarian
titles and word counts to the English records.

These settings apply to source access, chapter metadata, terminology, evidence
cards, semantic records and coverage. `import`, `inventory`, `search` and `read`
require one language; `align --lang both` reads both. Statistics always count the
full reference dataset. Manuscript audit, state checks and deliberate `lint-hu`
checks do not use the language setting. Direct JavaScript data APIs retain their
bilingual return values; this projection is a CLI behavior.

## Concept retrieval

The source-free inventories represent PS1–PS17, CoS1–CoS18, PoA1–PoA22 and GoF1–GoF37. PS contains 117 characters (seven typed as animals), 53 places, 70 objects and six identified spells. CoS contains 97 characters (nine typed as animals), 47 places, 75 objects and eight spells. PoA contains 89 characters (11 typed as animals), 56 places, 72 objects and 14 spells. GoF contains 129 characters (12 typed as animals), 61 places, 66 objects and 37 spells. These are curated inventories of named and significant referents, not every noun. Targeted passage review and literal bilingual mentions are separate from independent full-book semantic reading, which remains incomplete. Query `coverage` for both states and `stats` for counts. Other typed book datasets are planned; unsupported book requests fail visibly.

```sh
node scripts/hp.mjs characters --book PS --id harry-potter
node scripts/hp.mjs semantic --book PS --query "object that tells you something is forgotten"
node scripts/hp.mjs people --book PS --query "bájitaltan tanára"
node scripts/hp.mjs places --book PS --query "where can I buy a wand"
node scripts/hp.mjs spells --book PS --query "float feather" --anchor PS10
node scripts/hp.mjs objects --book PS --magic-status ordinary --limit 10
node scripts/hp.mjs glossary --book PS --query Harry
node scripts/hp.mjs glossary --book GoF --category spell --query "Killing Curse" --limit 3
node scripts/hp.mjs facts --book PS --page --limit 10 --offset 0
node scripts/hp.mjs coverage --book PS
node scripts/hp.mjs spells --book CoS --query "erase memory"
node scripts/hp.mjs people --book CoS --query "Tom Denem"
node scripts/hp.mjs objects --book CoS --query "diary memory possession"
node scripts/hp.mjs coverage --book CoS
node scripts/hp.mjs spells --book PoA --query "repel Dementors"
node scripts/hp.mjs objects --book PoA --query "travel time"
node scripts/hp.mjs people --book PoA --query "Makesz"
node scripts/hp.mjs coverage --book PoA
node scripts/hp.mjs spells --book GoF --query "Invito"
node scripts/hp.mjs people --book GoF --query "Mad-Eye Moody" --anchor GoF14
node scripts/hp.mjs objects --book GoF --query "seven-lock trunk"
node scripts/hp.mjs stats
```

Entity results use `total`, `offset`, `nextOffset` and `entries`; choose either `--id` or `--query`. Each hit includes its category, ranking score, matched fields and chapter anchors. `--category person|animal|place|object|spell` filters unified retrieval; `--kind` filters entity kinds, and `--anchor PS1`, `--anchor CoS11` `--anchor PoA21` or `--anchor GoF35` selects evidence or literal mentions within the chosen book. Characters include animals; people exclude them. `objects --magic-status demonstrated|ordinary|not-established` separates demonstrated properties from ordinary objects and uncertain enchantment. Object classification alone never establishes magic.

Ranking uses curated aliases, concept synonym groups and original descriptions, with exact names first and accent-insensitive English/Hungarian matching. It requires every meaningful query term; it does not embed the novels or call a model. Common request words are ignored; a single explicit category word, or `who`/`where`, can select a category. Unmapped wording can return no results. Use simpler concepts or literal source search when necessary. Scores are ranking weights, not confidence probabilities. Negative results are not canon-absence proof.

Spells require identified deliberate human casting, with or without a wand. Known failed casts qualify. Accidental magic, creature abilities, potions, object behaviour, uncast theory and unidentified effects do not. `vocalisation` is `spoken`, `non-verbal` or `unreported`; missing words do not prove silence. Bluebell Flames and the CoS Freezing Charm have unknown incantations. The Killing Curse's PS4 reports have separate GoF14 identification and incantation evidence. Later identification is explicit metadata, not knowledge available to a PS character. No PS/CoS/PoA/GoF occurrence currently has proven non-verbal casting. CoS Memory Charm class reports appear under `reportedClassUses`; they do not certify the formula `Obliviate` for those events. Its attested attempt uses Hungarian `Exmemoriam`; `Expelliarmus` uses `Capitulatus`. PoA uses `Exlukhops` for Waddiwasi, `Comikulissimus` for Riddikulus and `Leperex` for Impervius.

The chapter filter selects whole records; descriptions may contain later events within the chosen book, and explicitly marked later spell identification. It is not a scene knowledge cutoff. Tom Riddle and Voldemort share one CoS identity, including that book's reveal. Scabbers/Peter Pettigrew share one human identity in PoA; Sirius and his dog form share a record. The lake rescue Patronus has one PoA21 casting row with PoA20 `observationEvidence` for the other viewpoint. Map and Time-Turner operation are objects, and Animagus transformations are abilities. Paged facts use the pagination fields and `facts`; legacy unpaged facts return an array, and `--limit`/`--offset` require `--page`. Evidence-card book projections remain PS-only. Book-scoped glossary queries use typed terms for PS/CoS/PoA/GoF. Unfiltered cards and glossary terms have selective series coverage; the typed inventories do not certify all older claims.

`stats [--book PS|CoS|PoA|GoF]` returns per-book counts. `people` plus `animals` gives the character count. `castingRecords` includes grouped practice and reports, not individual cast counts; `classReportRecords` counts qualified class-level reports. `contextEvidencePairs` and `literalMentionPairs` count stored bilingual references, including observation evidence, which may reuse source passages. These are separate from reading coverage and seven-book chapter metadata.

## Import books

```sh
node scripts/hp.mjs import --sources /path/to/sources
node scripts/hp.mjs import --sources /path/to/sources --strict
```

The source directory defaults to `HP_SOURCES`, then `original-sources` under the selected project directory (otherwise the working directory). `--sources` takes precedence. A bilingual root contains `en/` and `hu/`; `--lang en` or `--lang hu` selects the child. Without `--lang`, the project preference selects the child, defaulting to English. A flat single-language directory remains supported. Use separate catalogues for separate languages and one edition per book per catalogue.

By default, the importer operates in permissive mode: it accepts arbitrary EPUBs (via EPUB 3 Navigation documents, standard NCX with fragment links, or spine fallback) and direct novel text files (`.txt` / `.md`). If a non-canonical edition contains preview chapters or minor discrepancies, non-fatal warnings are recorded instead of halting the import. Passing `--strict` enforces exact verification against official benchmark editions (Pottermore `hpNN_chNNN` layout for English, documented strict NCX layout for Hungarian, and exact canonical chapter counts).

Each import overwrites generated same-stem Markdown and `catalogue.local.json`. EPUBs and text sources are read only. All sources are parsed before output writing begins. An operating-system write failure can still leave a partial refresh; rerun after resolving it.

The catalogue contains full chapter text and belongs with the private source files. It records EPUB and extracted-text SHA-256 hashes, language, titles, source entries and excluded spine entries. Cover/front matter, advertisements and next-book previews are excluded from the narrative Markdown. The original EPUB retains them.

The ZIP reader supports stored and deflated entries, rejects encryption and unsafe paths, verifies CRCs and caps expanded size. It does not implement DRM, OCR, ZIP64, arbitrary ebook formats or universal EPUB layout recognition. Paragraphs, chapter headings and simple emphasis are retained; typography and illustration layout are not reproduced.

### Converted PDF sidecars

PDF bytes are not parsed by the Node tool. An edition-specific converter may provide a `*.pdf.local.json` single-book sidecar with `code`, `title`, `language`, PDF basename in `source`, source SHA-256, `chapters` and `excluded`. Chapter records contain `anchor`, `number`, `title`, page locator in `entry`, `words`, UTF-8 text SHA-256 and `text`. Keep all outputs private. Import checks the PDF hash, expected anchor sequence and text hashes, then writes the same-stem Markdown and catalogue. It cannot certify OCR accuracy or repair a damaged edition.

The Hungarian DH index describes a degraded 1,140-page PDF transcription. Its titles preserve the source's spelling; paragraph boundaries are inferred and missing accents are not guessed. Use it for locating material, not as a Hungarian orthographic or translator-style authority. The repository's contributor converter requires Python and pypdf; that dependency is separate from the installed Node tools.

## Find a chapter without books

```sh
node scripts/hp.mjs chapters --book PoA --limit 30
node scripts/hp.mjs chapters --topic food --limit 5
node scripts/hp.mjs chapters --query "Wandmaker"
node scripts/hp.mjs chapters --lang hu --query "Titok"
node scripts/hp.mjs glossary --query "Accio"
node scripts/hp.mjs glossary --book GoF --query "Accio" --limit 3
node scripts/hp.mjs glossary --category person --limit 10 --offset 0
node scripts/hp.mjs facts --query "Fidelius"
node scripts/hp.mjs facts --kind testimony --query "food"
```

Topics are keys from [topics.json](../data/topics.json). Topic ranking is lexical frequency, not semantic relevance or proof. A chapter with many references to telephones may outrank the chapter that explains Hogwarts' electrical interference. Use evidence cards and specific searches to resolve the claim.

Hungarian chapter topic ranks use the aligned English chapter's counts, labelled `topicBasis`. They are not Hungarian word frequencies. Unfiltered glossary queries search headwords, aliases and IDs, case-insensitively with Unicode normalization; accents remain significant. PS/CoS/PoA/GoF glossary queries use typed bilingual concept ranking with accent folding and return compact terms: `en`, `hu`, class/name labels, `termKind`, paired evidence and `detailsCommand`. Supported typed categories are `person`, `place`, `object`, `spell` and `creature` (individually indexed animals). Other series glossary categories remain available without a book filter. An editorial label is not a printed headword; an unknown incantation stays a class/name rather than gaining a guessed formula. The default glossary page size is 20; use a smaller explicit limit for a narrow question. Read scope and usage evidence before adopting a term, especially an incantation or an ambiguous name.

`lint-hu --file DRAFT --book PS|CoS|PoA|GoF` uses the chosen book's terminology.
Without `--book`, it retains the selective series glossary scan. Warnings are
review leads: an English quotation, chapter variant or accepted project override
can be correct. Neither mode changes the file or verifies natural prose.

## Search and read

```sh
node scripts/hp.mjs search --sources /path/to/books --book GoF --query electricity
node scripts/hp.mjs search --sources /path/to/books --anchor DH15 --query Gamp --context 700
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH15 --offset 12000 --max-chars 12000
node scripts/hp.mjs read --sources /path/to/books --anchor DH-epilogue --full
node scripts/hp.mjs search --sources /path/to/books --lang hu --query "Roxfort"
node scripts/hp.mjs align --sources /path/to/books --lang both --anchor PS6 --max-chars 4000
```

Search defaults to 12 hits and 180 characters of context on each side. `--offset` paginates hits; `--limit` controls page size. Read defaults to 12,000 characters and reports `nextOffset`; `--full` returns the whole selected chapter. These are adjustable output defaults, not limits on research depth.

All commands emit JSON except ordinary `read`; use `read --json` for structured output. Search offsets refer to NFKC-normalized text; read offsets refer to the saved chapter text. Use a search hit's anchor and matching phrase to relocate it if normalization changes character length.

Every local read verifies the source and extracted-text hashes. If a source or catalogue changes, import again. There is no semantic-search model or embedding store. Exact query misses require alternate terms or chapter reading.

`align` reads the selected language from its child catalogue under a source root. Use `align --lang both` with a bilingual root to return one passage per language. Its default window is 4,000 characters per language; `--offset` starts that numeric offset independently in both texts. Alignment is chapter-level, not sentence-level. Locate a matching event separately when comparing translation choices. Hungarian suffixes can change word endings; stem searches can help but require referent checks.

## Manuscripts and continuity

```sh
node scripts/hp.mjs audit --file /path/to/chapter.md
node scripts/hp.mjs check-state --file /path/to/events.json
node scripts/hp.mjs lint-hu --file /path/to/chapter.md
```

Audit counts Unicode letters/numbers with internal apostrophes and hyphens; markup can affect other counting methods. Prefer the host's accepted counter when one exists. Duplicate paragraphs are observations, not instructions to cut refrains.

The event model is in [continuity](workflow-continuity.md). It checks sequence, prior knowledge and object custody, not prose semantics, historical dates or truthfulness of testimony. Failed state checks and malformed input return a nonzero exit code.

`lint-hu` flags exact English headwords with distinct Hungarian equivalents. It does not reliably detect every inflection, alias, quotation or code-switch, so a warning is a review prompt, not an error verdict. Deliberate project overrides take precedence. Warnings leave the exit code at zero; malformed input fails.

## Agent access and Git ignore

The repository ignores the source folder. Ordinary recursive `rg` searches may skip it; use the source CLI or explicitly opt into ignored files with `rg --no-ignore` scoped to the selected source path. Do not force-add the books to make them searchable.

Local storage does not mean model processing is offline: passages read by an agent can enter its provider context. Tools themselves perform no upload.

GoF keeps Crouch Junior, the apparent teacher, separate from the real captive Moody. The recovered eye and leg lie on the bedside table at GoF36 and are fitted by GoF37. The GoF9 EN `Prior Incantato` / HU `Priori incantatem` inspection is a human spell; the exceptional GoF34 linked-wand effect is not another casting of it. Edition forms include `Invito`, `Piroinitio`, `Baziteo`, `Carbunculus`, `Relaxo`, `Stimula`, `Obstructo` and HU `Adava Kedavra`. Named Shield, Banishing and Confundus classes do not import unattested formulas from later books or adaptations.
