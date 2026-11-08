# Response patterns

Status: built and verified on everisspainsludemo2, 2026-11-08 (Accept/Dismiss and the nightly job not exercised yet).

Goal: learn across incidents, which ServiceNow's PIR doesn't do (it reviews one major incident at a time).
LuxLab replays every P1/P2 and major incident, mines where the response keeps losing time, and an agent proposes a fix for each pattern for a LuxLab manager to accept.
Accepted patterns become the before/after anchor for the next feature, "Did the fix work?".

## Data

- **Window**: incidents resolved in the last 90 days that are P1/P2 or accepted major incidents. On everisspainsludemo2 that is 362 incidents, 63 of them reassigned; 14 had replays.
- **Backfill**: `replayBatch()` builds missing replays (and ones built while the incident was still open), up to 15 per call or 20 s.
  The Patterns page calls it in a loop with progress; a nightly scheduled job runs the same loop, then mines.
  Failed builds count as attempted, so the loop always ends.

## Pattern types (deterministic, `src/server/replay/patterns.ts`)

The group in charge at any moment comes from walking the `assignment_group` replay events (the first one's `from_value` is the initial group).

| Type | Key | Minutes counted |
|---|---|---|
| misroute | `misroute:<wrong group>><resolving group>` | time spent with an intermediate group that did not resolve it (first-line triage excluded, matching the misrouted phase) |
| silent gaps | `gaps:<group in charge>` | gap minutes above the priority's limit |
| detection | `detection:<service, else CI, else category>` | impact start (first alert) to incident opened, when 5 min or more |
| waiting | `waiting:<resolving group>` | on-hold minutes, when 30 min or more |

- A pattern needs at least 2 incidents.
- Each incident's contribution is capped at 3 days, so a years-old outlier can't dominate.
- Ranked by minutes lost.
- Benchmark: median time to resolve of the pattern's incidents vs the other incidents in the window.
- Facets: top services and categories of its incidents, which the routing fix needs.

## Storage: `x_everi_luxlab_pattern`

- **Identity**: `key` (unique), `type`, `title`, `group`, `target` (resolving group), `dimension`.
- **Stats**: `incident_count`, `minutes_lost`, `median_minutes`, `median_ttr`, `baseline_ttr`, `incidents` (JSON evidence), `facets` (JSON), `active` (found by the latest mining), `first_seen`, `mined_on`.
- **Decision**: `state` (new/proposed/accepted/dismissed), `proposal` (markdown), `fix_type` (routing/knowledge/monitoring/process/problem), `proposed_on`, `decided_by`, `decided_on`, `problem`.

## AI

The **LuxLab Pattern Analyst** agent:
- Tools: Get response pattern (stats plus up to 8 evidence incidents, blameless), and Save pattern proposal.
- Proposal sections: What is happening, Evidence, Recommended fix, How to check it worked.
- It goes through the `LuxLabReplayAI` bridge, like the Replay Analyst.

Accepting a proposal is for managers only. A `problem` fix creates a problem record.

## API (`/replay/patterns...`)

- `GET /patterns`
- `POST /patterns/refresh` (one batch; mines when nothing remains)
- `POST /patterns/{pattern}/agent`
- `POST /patterns/{pattern}/decision`

## UI

- New Lux page `/patterns` ("Response patterns" in the nav): coverage, Analyse incidents, ranked pattern cards with evidence links to replays, Propose fix (agent run), and Accept/Dismiss.
- Replay page: a chip for each active pattern the incident belongs to.

## Caveats

- Patterns aggregate incidents mined with system read, so evidence lists incident numbers and descriptions to every LuxLab user (all of them are itil).
- Overlap: Process Mining (Process Optimization) also shows reassignment loops, but it needs its own license and has no blameless, AI-proposed fix tied to replays.

## Findings from the first run (2026-11-08)

- 362 incidents replayed in about 3 minutes. 196 of them were opened and resolved in the same second (bulk-loaded demo data, no audit history), so mining skips replays with `minutes_to_resolve` 0 and the page says how many it left out.
- Only 3 replays have group changes (the incident `reassignment_count` field says 63, but those changes were never audited), so no misrouting pattern reaches 2 incidents on this instance.
- 10 patterns: 4 silent gaps, 5 waiting, 1 late detection. The top one is ZT Soporte ERP on hold, with a median time to resolve of 1d 15h vs 3h 47m.
