// LuxLab demo seeder: plays three major-incident scenarios through normal incident updates,
// then backdates the audit and journal rows each step produced so the platform history
// spans hours instead of seconds. Run in GLOBAL scope (sys_audit is not writable from the app scope):
//   npx now-sdk exec --file scripts/seed-replay-demo.js --scope global --reason "LuxLab replay demo data"
// Idempotent: scenarios whose short description already exists are skipped.
(function () {
    var TAG = '[LuxLab demo] ';
    var MINUTE = 60 * 1000;

    function sysIdOf(table, field, value) {
        var gr = new GlideRecord(table);
        return gr.get(field, value) ? gr.getUniqueValue() : '';
    }

    function group(name) {
        var id = sysIdOf('sys_user_group', 'name', name);
        if (!id) throw new Error('Missing assignment group ' + name);
        return id;
    }

    function user(userName) {
        return sysIdOf('sys_user', 'user_name', userName);
    }

    function timeAt(base, minutes) {
        var gdt = new GlideDateTime();
        gdt.setNumericValue(base + minutes * MINUTE);
        return gdt;
    }

    // Rows created since `mark` belong to the step just run; move them to the scenario time
    function backdate(table, keyField, key, mark, when) {
        var gr = new GlideRecord(table);
        gr.addQuery(keyField, key);
        gr.addQuery('sys_created_on', '>=', mark);
        gr.query();
        var count = 0;
        while (gr.next()) {
            gr.autoSysFields(false);
            gr.setWorkflow(false);
            gr.setValue('sys_created_on', when);
            gr.update();
            count++;
        }
        return count;
    }

    function stepMark() {
        var mark = new GlideDateTime();
        mark.addSeconds(-1);
        return mark;
    }

    function backdateStep(incidentId, mark, when) {
        backdate('sys_audit', 'documentkey', incidentId, mark, when);
        backdate('sys_journal_field', 'element_id', incidentId, mark, when);
    }

    function applyFields(gr, fields) {
        for (var name in fields) {
            gr.setValue(name, fields[name]);
        }
    }

    function addChild(parentId, base, step) {
        var child = new GlideRecord('incident');
        child.initialize();
        child.setValue('short_description', TAG + step.child);
        child.setValue('caller_id', user(step.caller || 'abel.tuter'));
        child.setValue('parent_incident', parentId);
        child.setValue('opened_at', timeAt(base, step.t));
        child.setValue('impact', 3);
        child.setValue('urgency', 3);
        var childId = child.insert();
        child.autoSysFields(false);
        child.setWorkflow(false);
        child.setValue('sys_created_on', timeAt(base, step.t));
        child.update();
        return childId;
    }

    function addTask(incidentId, base, step) {
        var task = new GlideRecord('incident_task');
        task.initialize();
        task.setValue('incident', incidentId);
        task.setValue('short_description', step.task.title);
        task.setValue('assignment_group', group(step.task.group));
        task.setValue('state', 2);
        task.insert();
        task.autoSysFields(false);
        task.setWorkflow(false);
        task.setValue('opened_at', timeAt(base, step.t));
        task.setValue('sys_created_on', timeAt(base, step.t));
        if (step.task.closedAt) {
            task.setValue('state', 3);
            task.setValue('active', false);
            task.setValue('closed_at', timeAt(base, step.task.closedAt));
        }
        task.update();
    }

    // The SLA engine attached SLAs at seeding time; shift them onto the scenario clock
    function realignSlas(incidentId, base, resolvedAt) {
        var sla = new GlideRecord('task_sla');
        sla.addQuery('task', incidentId);
        sla.query();
        while (sla.next()) {
            var start = new GlideDateTime(sla.getValue('start_time')).getNumericValue();
            var planned = new GlideDateTime(sla.getValue('planned_end_time')).getNumericValue();
            var budget = planned - start;
            var end = base + resolvedAt * MINUTE;
            var newPlanned = base + budget;
            sla.autoSysFields(false);
            sla.setWorkflow(false);
            sla.setValue('start_time', timeAt(base, 0));
            sla.setValue('planned_end_time', timeAt(newPlanned, 0));
            sla.setValue('end_time', timeAt(end, 0));
            sla.setValue('has_breached', end > newPlanned);
            sla.setValue('stage', 'completed');
            sla.setValue('active', false);
            sla.update();
        }
    }

    function play(scenario) {
        var title = TAG + scenario.title;
        if (sysIdOf('incident', 'short_description', title)) {
            gs.print('Skipped (already seeded): ' + title);
            return;
        }
        var base = scenario.base;
        var mark = stepMark();
        var inc = new GlideRecord('incident');
        inc.initialize();
        inc.setValue('short_description', title);
        inc.setValue('description', scenario.description);
        inc.setValue('caller_id', user(scenario.caller));
        inc.setValue('opened_at', timeAt(base, 0));
        applyFields(inc, scenario.open);
        var id = inc.insert();
        backdateStep(id, mark, timeAt(base, 0));

        var lastStep = 0;
        for (var i = 0; i < scenario.steps.length; i++) {
            var step = scenario.steps[i];
            lastStep = step.t;
            if (step.child) {
                addChild(id, base, step);
                continue;
            }
            if (step.task) {
                addTask(id, base, step);
                continue;
            }
            mark = stepMark();
            inc = new GlideRecord('incident');
            inc.get(id);
            if (step.set) applyFields(inc, step.set);
            if (step.note) inc.work_notes = step.note;
            if (step.comment) inc.comments = step.comment;
            if (step.set && step.set.state == 6) inc.setValue('resolved_at', timeAt(base, step.t));
            if (step.set && step.set.state == 7) inc.setValue('closed_at', timeAt(base, step.t));
            inc.update();
            backdateStep(id, mark, timeAt(base, step.t));
        }

        realignSlas(id, base, scenario.resolvedAt);
        inc = new GlideRecord('incident');
        inc.get(id);
        inc.autoSysFields(false);
        inc.setWorkflow(false);
        inc.setValue('sys_created_on', timeAt(base, 0));
        inc.setValue('sys_updated_on', timeAt(base, lastStep));
        inc.update();
        gs.print('Seeded ' + inc.getValue('number') + ': ' + title);
    }

    var now = new GlideDateTime().getNumericValue();
    var DAY = 24 * 60 * MINUTE;
    var SD = group('Service Desk');
    var NET = group('Network');
    var SW = group('Software');
    var HW = group('Hardware');
    var DB = group('Database');
    var APPDEV = group('Application Development');

    // Most recent Saturday 02:10 UTC at least two days back, for the weekend scenario
    var saturday = new Date(now - 2 * DAY);
    saturday.setUTCHours(2, 10, 0, 0);
    while (saturday.getUTCDay() !== 6) saturday.setTime(saturday.getTime() - DAY);

    var scenarios = [
        {
            title: 'Corporate email down for EMEA users',
            description: 'Users across EMEA cannot send or receive email in Outlook, OWA or mobile.',
            caller: 'abel.tuter',
            base: now - 3 * DAY,
            resolvedAt: 196,
            open: { impact: 2, urgency: 2, assignment_group: SD, state: 1, category: 'inquiry' },
            steps: [
                { t: 4, note: 'Several users report Outlook showing "Disconnected". Checking OWA.' },
                { t: 9, child: 'Outlook keeps asking for my password', caller: 'abel.tuter' },
                { t: 12, child: 'Cannot send email from my phone', caller: 'abel.tuter' },
                { t: 18, set: { impact: 1, urgency: 1 }, note: 'Impact widened: all EMEA mailboxes affected. Raising to P1.' },
                { t: 22, set: { assigned_to: user('beth.anglin'), state: 2 }, note: 'OWA also down. Mail flow appears stopped.' },
                { t: 31, set: { major_incident_state: 'proposed' }, note: 'Proposed as major incident: business-wide email outage.' },
                { t: 38, set: { major_incident_state: 'accepted' }, note: 'Major incident accepted. Bridge opened.' },
                { t: 40, set: { assignment_group: NET, assigned_to: '' }, note: 'Firewall change last night is the main suspect. Routing to Network.' },
                { t: 52, child: 'Teams meeting invites not delivered', caller: 'abel.tuter' },
                { t: 61, set: { assigned_to: user('allie.pumphrey') }, note: 'Network: firewall rules unchanged, traffic to the mail cluster is normal.' },
                { t: 95, set: { assignment_group: SW, assigned_to: '' }, note: 'Not network. Exchange services failing health checks. Routing to the messaging team.' },
                { t: 104, comment: 'We are investigating an email outage affecting EMEA. Next update in 30 minutes.' },
                { t: 118, set: { assigned_to: user('don.goodliffe') }, note: 'Exchange transport service crashing: SMTP certificate expired at 06:00 UTC.' },
                { t: 121, task: { title: 'Renew Exchange SMTP certificate', group: 'Software', closedAt: 168 } },
                { t: 130, set: { state: 3, hold_reason: 4 }, note: 'Waiting on the certificate authority to reissue the certificate.' },
                { t: 172, set: { state: 2, hold_reason: '' }, note: 'Certificate received and installed. Restarting transport services.' },
                { t: 185, comment: 'Email is recovering. Queued messages are being delivered.' },
                { t: 196, set: { state: 6, close_code: 'Solution provided', close_notes: 'Expired SMTP certificate on the Exchange transport tier. Certificate renewed and services restarted. Follow-up: certificate expiry monitoring.' }, note: 'Mail flow confirmed for all regions.' },
                { t: 196 + DAY / MINUTE, set: { state: 7 } },
            ],
        },
        {
            title: 'VPN drops for the remote sales team',
            description: 'Remote sales staff lose VPN connectivity every 10-15 minutes.',
            caller: 'abel.tuter',
            base: now - 2 * DAY,
            resolvedAt: 545,
            open: { impact: 2, urgency: 1, assignment_group: SD, state: 1, category: 'network' },
            steps: [
                { t: 35, set: { assigned_to: user('david.loo'), state: 2 }, note: 'Reproduced with two users. Suspect laptop VPN client.' },
                { t: 50, set: { assignment_group: HW, assigned_to: '' }, note: 'Routing to Hardware to check the laptop image.' },
                { t: 140, set: { assigned_to: user('bow.ruggeri') }, note: 'Laptop image is current. Client logs show tunnel resets from the gateway side.' },
                { t: 150, set: { assignment_group: NET, assigned_to: '' }, note: 'Gateway-side resets. Routing to Network.' },
                { t: 175, set: { assigned_to: user('fred.luddy') }, note: 'Gateway healthy. Asking caller for exact drop times.' },
                { t: 180, set: { state: 3, hold_reason: 1 }, comment: 'Could you send the exact times of the next three disconnections?' },
                { t: 300, set: { state: 2, hold_reason: '' }, comment: 'Drops at 11:02, 11:14 and 11:27 today.' },
                { t: 310, set: { assignment_group: HW, assigned_to: user('bow.ruggeri') }, note: 'Times match Wi-Fi power-saving on the new docks. Back to Hardware.' },
                { t: 330, set: { assignment_group: NET, assigned_to: user('fred.luddy') }, note: 'Dock firmware is fine. Network: DPD timeout on the gateway is 60s, too aggressive for hotel Wi-Fi.' },
                { t: 520, note: 'Change approved to raise the DPD timeout to 300s.' },
                { t: 545, set: { state: 6, close_code: 'Resolved by change', close_notes: 'VPN gateway dead peer detection timeout raised from 60s to 300s.' }, comment: 'VPN is stable after the gateway change.' },
                { t: 545 + 3 * 60, set: { state: 7 } },
            ],
        },
        {
            title: 'Payroll batch job failed before cut-off',
            description: 'The nightly payroll export failed; the bank cut-off is at 10:00.',
            caller: 'abel.tuter',
            base: now - 1 * DAY,
            resolvedAt: 95,
            open: { impact: 1, urgency: 1, assignment_group: DB, state: 1, category: 'database' },
            steps: [
                { t: 3, set: { assigned_to: user('carla.humble'), state: 2 }, note: 'On it. Batch failed on a tablespace full error.' },
                { t: 8, set: { major_incident_state: 'accepted' }, note: 'Accepted as major incident due to the payroll cut-off.' },
                { t: 10, comment: 'Payroll export failed. The database team is working on it; next update in 20 minutes.' },
                { t: 22, note: 'Tablespace extended by 50 GB. Re-running the export.' },
                { t: 31, comment: 'Fix applied, export is re-running. Next update in 20 minutes.' },
                { t: 52, note: 'Export at 70%. No errors.' },
                { t: 74, note: 'Export completed. Validating totals with payroll.' },
                { t: 95, set: { state: 6, close_code: 'Solution provided', close_notes: 'Payroll tablespace was full. Extended and export re-run before the bank cut-off.' }, comment: 'Payroll file delivered to the bank at 09:41.' },
                { t: 95 + 4 * 60, set: { state: 7 } },
            ],
        },
        {
            // Pattern: change-induced outage, resolved too early, reopened by the business, fixed by rollback
            title: 'Online checkout errors after Friday release',
            description: 'Customers get HTTP 500 at payment step since the 18:00 release.',
            caller: 'abel.tuter',
            base: now - 5 * DAY,
            resolvedAt: 214,
            open: { impact: 1, urgency: 1, assignment_group: SD, state: 1, category: 'software' },
            steps: [
                { t: 6, set: { assigned_to: user('david.loo'), state: 2 }, note: 'Checkout failing for every card type. Release 4.12 went live at 18:00.' },
                { t: 11, set: { major_incident_state: 'accepted' }, note: 'Major incident: revenue impacting.' },
                { t: 14, set: { assignment_group: APPDEV, assigned_to: user('andrew.och') }, note: 'Routing to the release team.' },
                { t: 20, comment: 'Checkout is failing for customers. Engineers are investigating. Next update in 30 minutes.' },
                { t: 47, note: 'Payment service pods restarted; error rate dropped to zero.' },
                { t: 52, set: { state: 6, close_code: 'Workaround provided', close_notes: 'Payment pods restarted.' }, comment: 'Checkout is working again.' },
                { t: 118, set: { state: 2 }, comment: 'Checkout is failing again for many customers. Please reopen.' },
                { t: 121, note: 'Errors returned 60 minutes after restart: memory leak in the 4.12 payment client. Restart only masked it.' },
                { t: 126, task: { title: 'Roll back release 4.12 payment service', group: 'Application Development', closedAt: 198 } },
                { t: 140, comment: 'We are rolling back the release. Next update in 30 minutes.' },
                { t: 198, note: 'Rollback to 4.11 completed. Error rate zero for 15 minutes.' },
                { t: 214, set: { state: 6, close_code: 'Resolved by change', close_notes: 'Release 4.12 rolled back (memory leak in payment client). Fix tracked in problem record.' }, comment: 'Checkout is stable after rolling back the release.' },
                { t: 214 + 2 * 24 * 60, set: { state: 7 } },
            ],
        },
        {
            // Pattern: out-of-hours incident nobody picks up until the morning shift
            title: 'Saturday night: warehouse scanners offline',
            description: 'Handheld scanners in the Zaragoza warehouse cannot reach the WMS. Night shift picking stopped.',
            caller: 'abel.tuter',
            base: saturday.getTime(),
            resolvedAt: 412,
            open: { impact: 2, urgency: 1, assignment_group: HW, state: 1, category: 'hardware' },
            steps: [
                { t: 15, comment: 'Still no scanners, the whole night shift is idle.' },
                { t: 95, comment: 'Calling the service desk number goes to voicemail. Please help.' },
                { t: 383, set: { assigned_to: user('bow.ruggeri'), state: 2 }, note: 'Picked up by morning shift. On-call rota had no Saturday night entry for Hardware.' },
                { t: 396, note: 'Warehouse Wi-Fi controller rebooted overnight after a power cut and lost its config. Restoring backup.' },
                { t: 412, set: { state: 6, close_code: 'Solution provided', close_notes: 'Wi-Fi controller config restored from backup. Follow-up: on-call rota gap and UPS for the controller.' }, comment: 'Scanners are back online.' },
                { t: 412 + 24 * 60, set: { state: 7 } },
            ],
        },
        {
            // Pattern: no group bouncing, but the ticket changes hands at every shift change
            title: 'CRM search extremely slow for service agents',
            description: 'Customer search in CRM takes 30-60 seconds for all agents.',
            caller: 'abel.tuter',
            base: now - 8 * DAY,
            resolvedAt: 1530,
            open: { impact: 2, urgency: 1, assignment_group: SW, state: 1, category: 'software' },
            steps: [
                { t: 20, set: { assigned_to: user('don.goodliffe'), state: 2 }, note: 'Reproduced. Search API p95 at 42s.' },
                { t: 300, set: { assigned_to: user('beth.anglin') }, note: 'Handing over at end of shift. Ruled out network. Look at the search index next.' },
                { t: 330, note: 'Picked up handover. Re-checking network before looking at the index.' },
                { t: 610, set: { assigned_to: user('david.loo') }, note: 'Handing over. Index looks fine, maybe the database?' },
                { t: 900, set: { assigned_to: user('don.goodliffe') }, note: 'Back on shift, taking it again. What was tried overnight?' },
                { t: 1200, set: { assigned_to: user('beth.anglin') }, note: 'Handover: suspect the nightly re-index job is still running into business hours.' },
                { t: 1260, note: 'Confirmed: re-index job now takes 14h after data growth and overlaps with business hours.' },
                { t: 1530, set: { state: 6, close_code: 'Solution provided', close_notes: 'Re-index switched to incremental mode; full re-index moved to weekend.' }, comment: 'Search is back to under 2 seconds.' },
                { t: 1530 + 24 * 60, set: { state: 7 } },
            ],
        },
        {
            // Pattern: priority underestimated at logging time, escalated only after an executive complaint
            title: 'Building access badges rejected at HQ entrance',
            description: 'Some employees cannot open the main entrance turnstiles with their badges.',
            caller: 'abel.tuter',
            base: now - 6 * DAY,
            resolvedAt: 318,
            open: { impact: 3, urgency: 3, assignment_group: SD, state: 1, category: 'hardware' },
            steps: [
                { t: 40, set: { assigned_to: user('beth.anglin'), state: 2 }, note: 'Low priority: reception is letting people in manually.' },
                { t: 180, comment: 'Queue at reception is now 80 people, it is 9:00.' },
                { t: 255, set: { impact: 1, urgency: 1 }, note: 'Escalated to P1 after the COO was blocked at the entrance. Badges issued after Monday are all rejected.' },
                { t: 258, set: { assignment_group: HW, assigned_to: user('bow.ruggeri') }, note: 'Routing to Hardware: badge controller sync.' },
                { t: 290, note: 'Badge controller stopped syncing with HR on Monday (expired service account password).' },
                { t: 318, set: { state: 6, close_code: 'Solution provided', close_notes: 'Service account password rotated, badge sync re-run. Follow-up: monitor sync job and service account expiry.' }, comment: 'All badges work again.' },
                { t: 318 + 24 * 60, set: { state: 7 } },
            ],
        },
    ];

    for (var s = 0; s < scenarios.length; s++) {
        play(scenarios[s]);
    }
})();
