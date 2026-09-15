# Continuity and AU propagation

Use for audits, delayed reveals, survival AUs, changed relationships, time travel and revisions that affect more than one scene.

## Establish accepted state

Read the affected passage, adjacent scenes and existing story records. Separate accepted events from outline alternatives. Track time, place, knowledge, possessions, physical condition, obligations and relationship agreements.

An AU is a deliberate change to baseline, not an error to remove. Canon facts identify dependencies; the user decides the premise. If Sirius survives, ask what now happens to Harry's isolation, available advice, headquarters, Kreacher and the information route that depended on loss. Do not preserve every later consequence mechanically.

## Information has a date

Distinguish event date, discovery date, belief and public acknowledgement. The reader may know Voldemort has returned while the Ministry denies it. A character may have seen a clue without understanding it. A confession may change belief without supplying independent verification.

For each secret record who knows, who suspects, who believes the wrong account, and how new information moves. A transferred fact needs a scene, message, observation or supported inference. Audit the next dependent action after a revelation moves.

## Objects and bodies

Track custody and condition: a wand borrowed, broken, repaired or won; a cloak lent; a letter destroyed; a person unable to run; medicine taken or missed. Physical possession and magical allegiance are different fields when relevant.

Inventory is useful only for consequential objects. Don't create a ledger for every cup unless its movement matters.

## Optional deterministic check

The local `check-state` command checks a small explicit model. Use it when several scenes share knowledge or object dependencies; existing prose notes remain valid. Example input:

```json
{
  "initialKnowledge": {"Mara": ["meeting-location"]},
  "initialObjects": {"brass-key": "Mara"},
  "events": [
    {"id": "warning", "order": 1,
     "learns": [{"character": "Ivo", "fact": "meeting-location", "via": "Mara's letter"}],
     "transfers": [{"object": "brass-key", "from": "Mara", "to": "Ivo"}]},
    {"id": "arrival", "order": 2,
     "requires": [{"character": "Ivo", "fact": "meeting-location"}]}
  ]
}
```

Requirements are checked before new learning within the same event. Use separate events if a fact is learned and then used. Orders must increase; they are sequence numbers, not inferred calendar dates. The tool does not parse a manuscript or decide whether a witness is credible.

## Revision findings

Give the conflict, the two locations or facts that establish it, its consequence and the smallest repair. Distinguish contradictions from ambiguities, missing setup and optional improvements. Once edits are authorised, repair dependent scenes and update existing records from the saved text.

A compaction handoff needs the current scene, accepted changes, unresolved questions and exact artifact paths. Preserve the host's build and review cadence.
