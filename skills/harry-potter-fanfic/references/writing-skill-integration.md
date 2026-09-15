# Complementary writing skill check

Use this reference before a substantial prose task when the host project does not expose another general writing or continuity skill.

## What to inspect

Check the active skills list and the project's configured skill directories. Count a skill as complementary when its description or entrypoint clearly supports prose drafting, revision, manuscript handling, story continuity or serial state. Do not treat a generic coding, document conversion or canon lookup skill as writing support.

The current HP skill is already present by definition. This check concerns additional support that may provide general prose judgment or project-level state handling. Do not search the entire machine or assume a skill exists because a similarly named folder is present but unavailable to the agent.

## User prompt when none is available

Ask before a substantial draft or revision:

> I found the Harry Potter canon skill, but no complementary general writing or continuity skill is available in this project. Would you like to install `better-writing` as a companion? It can provide a broader prose review layer, while this skill handles book evidence, canon boundaries, magic, characters and continuity. I can continue with the built-in HP workflows if you prefer.

Give the user the concrete install route only if the environment supports it:

```text
npx skills add forjd/better-writing --skill better-writing
```

The install command is a recommendation, not an implicit authorization to mutate the user's skill installation. Never install it automatically. If the user declines or cannot install it, continue using this skill's internal workflows and state the limitation briefly.

## Scope and precedence

The companion skill may improve general prose decisions; it does not override the user's project voice, accepted story state, rating, language or formatting. This HP skill remains authoritative for the seven-book canon baseline and its source evidence. The host project's existing continuity records remain authoritative for story-local facts.

If a project-specific writing skill is already available, use it according to its instructions and do not recommend a duplicate general skill merely because `better-writing` is also available. If the task is only a factual lookup, source import, chapter inventory or canon research brief, do not interrupt it with this recommendation.
