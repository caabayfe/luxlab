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
    ];

    for (var s = 0; s < scenarios.length; s++) {
        play(scenarios[s]);
    }
})();
