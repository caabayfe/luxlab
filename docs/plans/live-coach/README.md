# Live incident coach

Status: built and deployed to everisspainsludemo2, 2026-11-08. War room, Overview strip, Replay coach, Reassign, Dismiss, customer update post and work-note job verified in the browser; Draft update waits for the LuxLab Comms Drafter skill to be activated in Now Assist Admin.

Goal: act *during* the incident, not after it. ServiceNow's PIR and LuxLab's Replay and Response patterns all look back.
The coach watches every live P1/P2 and major incident and nudges the team before time is lost, using what Replay and the patterns already know.

## What the coach watches (deterministic, no AI)

| Signal | Rule | Nudge |
|---|---|---|
| **Silence clock** | Minutes since the last non-passive activity vs the priority's gap limit (`gapLimitMinutes`: P1 30m, P2 60m) | Amber at 80%, red at the limit: "No update for 24m · P1 limit is 30m" |
| **Routing check** | Resolved incidents in the 90-day window with the same service (else CI, else category): if 3 or more and at least 60% were resolved by a different group than the current one | "4 of 5 similar incidents were resolved by Messaging · currently with Network" with **Reassign** |
| **Known pattern** | The incident's group/service matches an active pattern; accepted patterns carry their fix and problem | "Looks like *Long on-hold time with ZT Soporte ERP* · known problem PRB0040134" with **Link to problem** |
| **Comms cadence** | Minutes since the last customer-visible update (additional comments) vs cadence (P1 30m, P2 60m) | "Comms update due in 6m" with **Draft update** |
| **SLA** | Running `task_sla` closest to `planned_end_time` | "Resolution SLA breaches in 18m" |

Live window: active, not resolved, P1/P2 or major incident state proposed/accepted, opened in the last 7 days.
The 7 days keep years-old open demo incidents (2017) off the board.

## Surfaces

1. **War room** (`/live`, new Lux page, first in the nav)
   - One tile per live incident, ordered by the most urgent nudge.
   - Countdown rings for the silence clock and comms cadence.
   - The tile goes amber, then red.
   - The page refreshes every 30 s with no reload.
   - Tile actions: Reassign, Link to problem, Draft update, Open replay, Dismiss nudge.
2. **Overview**: a "Live now" strip with the live incidents and their worst nudge.
3. **Replay page** of an open incident: the same nudges above the timeline.
4. **Work-note nudges** (on for P1 and P2; property `x_everi_luxlab.coach.work_notes` turns them off): the job below posts one work note per breached nudge, e.g. "LuxLab coach: no update for 31m (P1 limit 30m)". This reaches agents in SOW and the classic form without new UI.

## Actions

- **Reassign**:
  - sets `assignment_group` to the suggested group
  - adds a work note with the evidence (similar incidents)
  - uses `GlideRecordSecure`, so the user's own rights apply
- **Link to problem**: sets `problem_id` to the pattern's problem.
- **Draft update**:
  - A Now Assist skill, *LuxLab Comms Drafter*, writes a short customer-facing update from the live replay context (impact, what's been done, next step, next update time).
  - The user edits it and posts it as an additional comment.
  - It is never posted without a click.
- **Dismiss** stops that nudge for this incident.

## Storage: `x_everi_luxlab_nudge`

- **Fields**: `incident`, `kind` (silence/routing/pattern/comms/sla), `key` (unique per incident, kind and episode, e.g. one per silence gap), `level` (warn/breach), `message`, `evidence` (JSON), `state` (open/acted/dismissed/expired), `acted_by`, `acted_on`, `work_note_posted`.
- **Purpose**:
  - nudges aren't repeated
  - Dismiss is remembered
  - it measures value: nudges raised, acted on, and minutes of silence avoided

## Engine

- `src/server/coach/coach.ts`:
  - `liveIncidents()`
  - `nudgesOf(incident)`, which reuses the replay sources for the last activity and adds the similar-incident lookup over the replay samples and the pattern store
  - `refreshNudges()`
- A scheduled job runs every 5 min and calls `refreshNudges()`.
  - It updates the nudge table and expires nudges that no longer apply.
  - If the work-note option is on, it posts work notes for new breaches.
- The war room reads live (`GET /coach/live`), so its clocks are exact between job runs.
- API:
  - `GET /coach/live`
  - `GET /coach/incidents/{incident}`
  - `POST /coach/nudges/{nudge}/act`
  - `POST /coach/nudges/{nudge}/dismiss`
  - `POST /coach/incidents/{incident}/draft-update`

## AI and assists

Only **Draft update** uses AI: one skill run per click (a fixed number of assists, like the other LuxLab skills, 1–2 on this instance).
Everything else is ordinary code. The AI usage page gets a "Live coach" feature row.

## Demo

The live window on everisspainsludemo2 has a handful of open P1/P2 incidents, mostly in a single group.
A good demo needs an incident going live while you watch:
- A scripted scenario (needs approval) opens a P1 with a service whose history resolves elsewhere.
- It produces a routing nudge, then crosses the silence and comms clocks within minutes.

## Order

1. Engine and `GET /coach/live`, war room page with silence, comms and SLA clocks.
2. Routing check and known-pattern nudges with Reassign and Link to problem.
3. Comms Drafter skill and Draft update.
4. Nudge table and job, Overview strip, Replay page nudges, optional work notes, usage row.
5. Demo scenario.

## Findings from the first run (2026-11-08)

- **Gone quiet**: 26 of 30 open P1/P2s in the window had no update for days (demo backlog). Incidents silent for over 24 h are listed apart on the War room and get no work notes, so the board shows only the incidents being worked.
- **Pattern match**: matching on group plus category hit 25 of 30 incidents ("Inquiry / Help" fits most). It now needs the same service.
- **Automated notes**: an Otto triage agent (`itsm.aia.worker`, identity type `ai_agent`) posts work notes. Notes by AI-agent identities or `system` do not break the silence clock.
- **Insert audit rows** hold initial values, so they don't count as activity either.
- **Journal writes**: `setValue('work_notes')` from module code is silently dropped. The coach assigns the field instead.
- **New skills need Activate** in Now Assist Admin after install; until then Draft update is refused as "no permission".

## Decisions (2026-11-08)

- Work-note nudges are on for P1 and P2.
- Reassign and Link to problem are open to anyone who can edit the incident (`GlideRecordSecure`, so no ACL is bypassed).
- The scripted live P1 demo scenario is approved, to run once other sessions are done writing to everisspainsludemo2.
- Comms cadence is fixed at P1 30m and P2 60m, because Communication Management isn't installed on the instance.
