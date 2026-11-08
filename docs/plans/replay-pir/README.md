# Replay ⇄ PIR timeline sync (slice 1)

Status: built and verified end to end on everisspainsludemo2 (INC0026058), 2026-11-08.

Goal: the LuxLab Incident Replay becomes the evidence engine behind ServiceNow's Post Incident Review (PIR).
Replay pushes the moments only it can see into the PIR timeline, and reads back the curation people do in the PIR.

Out of scope for this slice: writing the report draft (`report_draft`), the merged 4+1-section report, the combined agent, follow-ups in Action Items, benchmarks. Those are slices 2–4.

## Platform facts this relies on

All from everis2 metadata (`spaces/everis2/instances/everis2/metadata/sn_sow_inc`):

- **PIR record**: `sn_sow_inc_post_incident_review` (one per incident, `incident_ref`), fields `timeline_events` (JSON `{events: [...]}`), `timeline_settings`, `report_draft`, `state` (draft | published), `co_authors`.
- **Created automatically** by the business rule *Insert PIR records on resolved* when `state=6^major_incident_state=accepted`. The same rule runs `updateSystemGeneratedEvent` on every later matching update.
- **Regeneration keeps only `CUSTOM_EVENT`s** (`PIRManagerSNC._getCustomEvents`, line 457). Milestones, task events and flagged activities are rebuilt from scratch. So **anything Replay pushes must be `eventType: "CUSTOM_EVENT"`**, or it gets wiped.
- **Custom event shape**: `{id, timestamp, message, eventType: "CUSTOM_EVENT", generatedBy: "USER"}`, plus `isHidden` / `isDeleted` set by the PIR UI. Their `message` is not re-translated (`getTranslatedEvents` only rewrites system types). They only display while `timeline_settings.showManuallyAddedEvents` is true (the default).
- **Flagged activities**: `sys_activity_supplemental` rows with `document_id` = incident, `event_id` = `sys_journal_field` sys_id, and `payload.flag` true. They exist **before** a PIR does (flags are set during the incident).
- **PIR ACLs**: create and table write = itil; only the `report_draft` field is limited to `major_incident_manager`, the incident's assignee or a co-author. So itil users can edit the timeline (verified 2026-11-08; the plan first assumed otherwise).
- **Cross-scope**: the table allows read, create and update from other scopes (`read_access`/`create_access`/`update_access: true`).

## Design

### 1. Stable event keys (replay side)

`TimelineEvent` gets `key: string`, and `x_everi_luxlab_replay_event` gets an `event_key` column. Every source sets it from the row it came from:

| Source | Key |
|---|---|
| record | `record:opened` / `record:resolved` / `record:closed` |
| audit | `audit:<sys_audit sys_id>` |
| journal | `journal:<sys_journal_field sys_id>` |
| sla | `sla:<task_sla sys_id>:start` / `:breach` |
| task | `task:<incident_task sys_id>:opened` / `:closed` |
| child | `child:<incident sys_id>` |
| alert | `alert:<em_alert sys_id>` |
| comms | `comms:<incident_alert sys_id>` |
| silent gap | `gap:<start epoch ms>` |
| PIR note (new) | `pir:<PIR event id>` |

Curation lives in the PIR and is re-read on every build, so `saveEvents` can keep its delete-and-insert approach. That fixes "refresh wipes curation" without an upsert. Upsert only becomes necessary if we later add curation inside Lux.

### 2. Pull: PIR → Replay (on every build)

New `src/server/replay/pir.ts`, guarded like `optionalSource` so instances without `sn_sow_inc` keep working:

- `flaggedJournalIds(incidentId)`: reads `sys_activity_supplemental` with a parsed `payload.flag`, then marks those journal events `keyMoment = true, pirFlagged = true`. This works before the PIR exists.
- `pirTimeline(incidentId)`: if a PIR exists, reads `timeline_events`:
  - `CUSTOM_EVENT`s **not** written by LuxLab, and not `isDeleted`, become `source: 'pir'`, `kind: 'pir_note'`, `keyMoment: true` (a human said it mattered).
  - LuxLab-pushed events with `isHidden` mark their replay event `hidden = true`.
- These are applied in `buildReplay` **before** `analyse`, so PIR notes get a phase. Add `pir_note` to `PASSIVE_KINDS` in `analysis.ts`: notes written after the fact must not close silent gaps.

New columns:
- **Event**: `hidden` (bool), `pir_flagged` (bool). Add a `pir` choice ("Post incident review") to `source`.
- **Replay**: `pir_id` (string sys_id, not a reference, so the app installs without `sn_sow_inc`), `pir_pushed_on` (datetime), `pir_pushed_count` (int).

### 3. Push: Replay → PIR (explicit action, never on build)

`pushToPir(incident)` in `pir.ts`:

1. **Preconditions** (each fails with a message the user can act on):
   - The PIR exists. Otherwise: "The PIR is created when the major incident is resolved and accepted."
   - `state = draft`.
   - `GlideRecordSecure` `canWrite()`, which respects the platform's PIR ACLs.
2. **Selection**:
   - Include key moments, silent gaps, SLA breaches, alerts and comms plans.
   - Exclude what the PIR already shows: `record` milestones, `task` events, journal events already flagged, `pir` notes, and hidden events.
3. **Message**: `[Replay · <Phase>] <summary>`, blameless.
   - Move the name-stripping out of `ai-context.ts` `eventLine` into a shared `blamelessSummary(event)` used by both, so engineers become "Engineer assigned".
   - Silent gaps append their detail.
4. **Merge, read-modify-write in one update**:
   - Keep every event LuxLab didn't write, untouched.
   - LuxLab events use `id: "lux:" + key` and carry `luxlabMessage` (the text we last wrote).
   - For an existing LuxLab event: keep `isHidden`/`isDeleted`. If `message !== luxlabMessage` (or `luxlabMessage` was lost in a PIR UI edit), the user edited it, so keep their text. Otherwise refresh the message and timestamp.
   - A LuxLab event that's no longer selected is removed, unless the user edited it.
   - Timestamps are UTC `YYYY-MM-DD HH:mm:ss`, like the system events.
5. Save `pir_pushed_on` and `pir_pushed_count` on the replay.

### 4. AI context

In `ai-context.ts`:
- Skip hidden events, mark PIR-flagged and PIR notes `[KEY]`, and label notes `(PIR note)`.
- Fix truncation: when there are more than `MAX_EVENTS`, keep every key moment and gap first, then fill chronologically. Today it keeps the first 150 events, so long incidents lose their ending.
- Payoff: people's curation in the PIR directly improves the AI review.

### 5. API and DTO

- `POST /api/x_everi_luxlab/v1/replay/{incident}/pir`: `pushToPir`, then `loadReplay`. Add the route in `replay-api.now.ts` and `replay-routes.ts`. Return 403 for ACL refusals and 409 for a missing or non-draft PIR.
- `ReplayDto.pir: { sysId, state, canWrite, pushedOn, pushedCount } | null`.
- `ReplayEventDto` gets `hidden` and `pirFlagged`.

### 6. Lux UI (`pages/replay/[incident]`)

- **Header**: a PIR status chip ("PIR draft · 14 replay events sent · 5 min ago", or "No PIR yet: created when the major incident is resolved and accepted"), plus a **Send to PIR** button. When it can't be used, it's disabled with the reason as a tooltip.
- **Timeline** (`luxlab-replay-timeline.js`):
  - "Flagged in PIR" badge, and a "PIR note" badge for `source: pir`.
  - Hidden events are dimmed with a "Hidden in PIR" badge and excluded from "Key moments only".
- The React cockpit (`src/client/components/replay`) only gets the optional DTO fields. Lux is the primary UI.

## Build order

0. **Verify the target.** Confirm `sn_sow_inc` (SOW Incident with PIR) is active on everisspainsludemo2, where LuxLab is deployed; the metadata above is from everis2. Also confirm a resolved, accepted major incident exists, or extend `scripts/seed-replay-demo.js` so one scenario ends resolved and accepted with two flagged work notes.
1. Event keys in `sources.ts` and `related.ts`, plus the new columns. Rebuild a replay and check that keys are populated.
2. Pull (`pir.ts` read side, applied in `buildReplay`). Flag a work note in SOW, rebuild, and confirm the key moment.
3. `blamelessSummary` refactor, then push, then the REST route.
4. AI context changes.
5. Lux UI.
6. `now-sdk build` + `install -a luxlabeveris`, reload, then E2E.

## E2E checks (Chrome on everisspainsludemo2, then verify with now-sdk query)

1. Flag a work note on the major incident, rebuild the replay, and check the event shows "Flagged in PIR" and is a key moment.
2. **Send to PIR** as a major incident manager. The PIR timeline in SOW shows the `[Replay · …]` events, and `timeline_events` holds `lux:` ids.
3. Click the PIR's *Regenerate timeline* (or update the incident). The LuxLab events survive.
4. In SOW, hide one LuxLab event, edit another's text, and add a custom note. Rebuild the replay: the hidden one is dimmed and the note is shown. Send again: the edited text is kept, the hidden one stays hidden, and nothing is duplicated.
5. As a plain itil user, **Send to PIR** is disabled with the ACL reason, and the API returns 403.
6. Write the AI review and check it uses the PIR note and omits the hidden event.
7. On a non-major P2 incident, the replay builds and shows "No PIR yet". No errors.

## Open questions / risks

- **Long ids**: the PIR UI may assume short ids (`lux:audit:<32 hex>` is about 45 characters). Check in E2E 2–4. Fallback: `lux_` plus an MD5 of the key via `GlideDigest`.
- **Write race**: the PIR business rule can rewrite `timeline_events` at the same moment. It preserves custom events, so the risk is small and accepted for this slice.
- **Display**: PIR UI edits may drop unknown properties (`luxlabMessage`). The design treats a missing property as "user edited", which is the safe direction.
- **Restricted caller access**: reading `sys_activity_supplemental` (global) from `x_everi_luxlab` may need a `sys_restricted_caller_access` approval on first run. Check the logs after install.
- **Names in the PIR timeline**: its system events name people ("Incident created by …"); ours stay blameless. That mix is acceptable unless the customer wants PIR names hidden too.
