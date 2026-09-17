# Changelog

All notable changes to the **Harry Potter Writing Skill** (`harry-potter-fanfic`) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-09-17

### Added
- **Hungarian Language & Localization**: Craft guidance for Hungarian narration, free indirect discourse, information order, dialogue mechanics, and register (`hungarian-prose.md`, `hungarian-terminology.md`, `workflow-hungarian-writing.md`).
- **Bilingual Terminology Glossary**: 145-entry searchable English–Hungarian dictionary covering characters, places, spells, and concepts with paired chapter locators and usage notes (`hu-glossary.json`).
- **Hungarian Chapter Catalogue**: Aligned 199-chapter Hungarian corpus index (`chapters-hu.json`) with bilingual topic mapping.
- **Permissive Importer**: Support for arbitrary EPUB layouts (EPUB 3 Navigation, fragment links, heuristic spine fallback) and direct plain text / Markdown novel files (`.txt`, `.md`).
- **Advisory Hungarian Linter**: `hp.mjs lint-hu` command to scan drafts for unintended English headwords.
- **Evaluation & Quality Harness**: A/B/C protocol with automated blind testing and scoring harness (`abc-0.3.0-protocol.md`, `writing-quality-protocol.md`).
- **`--strict` Mode Flag**: Preserves exact benchmark validation against official editions while keeping permissive mode as default for user files.

## [0.2.2] - 2026-09-16

### Changed
- Refined public documentation boundaries and cleanly decoupled private source references from public guides.

## [0.2.1] - 2026-09-16

### Added
- Integration prompt for complementary general writing skills (`better-writing`).

## [0.2.0] - 2026-09-16

### Added
- **Canon Dossiers & Guides**: Seven comprehensive book dossiers and specialist reference guides for magic constraints, institutions, worldbuilding, and character arcs.
- **Offline Deterministic Tools (`hp.mjs`)**: Node.js CLI for chapter search, text retrieval, paired reading, continuity checking, and manuscript auditing with zero third-party dependencies.
- **Evidence System**: 44 verified canon evidence cards (`facts.json`) and 33 lexical topic categories (`topics.json`).
- **Multi-task Routing**: 11 on-demand subskills for story architecture, character workshop, magic engineering, and continuity tracking.
