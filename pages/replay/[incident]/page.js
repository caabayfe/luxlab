import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import {api, recordUrl} from '../../../utils/api.js';
import {
  PHASES,
  RECOVERY_COLOR,
  formatMinutes,
  phaseHint,
  phaseLabel,
  priorityBadge
} from '../../../utils/format.js';
import {setDocumentTitle} from '../../../utils/document-title.js';
import '../../../components/luxlab-time.js';
import './components/luxlab-replay-ai.js';
import './components/luxlab-replay-timeline.js';

const {acl, title} = decorators;

@customElement('x-everi-luxlab-replay-detail-page')
@title('Replay')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class ReplayDetailPage extends AIUXElement {
  @state() _replay = null;
  @state() _busy = false;
  @state() _error = '';
  // 'timeline' or 'report' while that part is being sent to the PIR
  @state() _pirBusy = '';
  @state() _confirmReplace = false;
  @state() _notice = '';

  _prevLoaderData = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  // Only reads the stored replay; a first-time build is a write, so the browser starts it
  static async loader(ctx) {
    const incident = ctx.params.incident;
    try {
      const {replay} = await api(`/replay/${incident}`);
      return {incident, replay, error: ''};
    } catch (error) {
      return {incident, replay: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._replay = this.loaderData?.replay || null;
      this._error = this.loaderData?.error || '';
    }
  }

  firstUpdated() {
    this._titleFor(this._replay);
    if (!this._replay && !this._error) this._rebuild();
  }

  _titleFor(replay) {
    setDocumentTitle(
      replay
        ? i18n.getMessage('Replay {0}', replay.incident.number)
        : i18n.getMessage('Replay')
    );
  }

  async _rebuild() {
    try {
      this._busy = true;
      this._error = '';
      const {replay} = await api(`/replay/${this.loaderData.incident}/build`, {
        method: 'POST'
      });
      this._replay = replay;
      this._titleFor(replay);
    } catch (error) {
      this._error = i18n.getMessage('Could not load the replay: {0}', error.message);
    } finally {
      this._busy = false;
    }
  }

  async _sendToPir(part, body) {
    try {
      this._pirBusy = part;
      this._error = '';
      this._notice = '';
      this._confirmReplace = false;
      const path = part === 'report' ? 'pir/report' : 'pir';
      const {replay} = await api(`/replay/${this.loaderData.incident}/${path}`, {
        method: 'POST',
        body
      });
      this._replay = replay;
      this._notice =
        part === 'report'
          ? i18n.getMessage('The incident review is now the post incident review draft.')
          : i18n.getMessage(
              '{0} replay events are in the post incident review timeline.',
              replay.pir?.pushedCount || 0
            );
    } catch (error) {
      this._error = i18n.getMessage('Could not send the replay to the post incident review: {0}', error.message);
    } finally {
      this._pirBusy = '';
    }
  }

  // Text LuxLab did not write (the platform's starting summary or someone's edits) is only replaced after a confirmation
  _sendReport(pir) {
    if (pir.reportState === 'other' && !this._confirmReplace) {
      this._confirmReplace = true;
      return;
    }
    this._sendToPir('report', {replace: pir.reportState === 'other'});
  }

  _pirBlocker(pir) {
    if (pir.state !== 'draft') return i18n.getMessage('The post incident review is already published.');
    if (!pir.canWrite) return i18n.getMessage('You are not allowed to edit this post incident review.');
    return '';
  }

  _reportBlocker(replay) {
    if (!replay.review) return i18n.getMessage('Write the incident review first.');
    if (!replay.pir.canWriteReport) {
      return i18n.getMessage(
        'Only major incident managers, the assigned engineer and co-authors can edit the report.'
      );
    }
    return '';
  }

  _renderPirButton(part, label, blocker, onClick) {
    return html`<button
      type="button"
      class="aiux-btn aiux-btn-primary aiux-btn-sm shrink-0"
      ?disabled=${!!blocker || !!this._pirBusy || this._busy}
      title=${blocker || nothing}
      @click=${onClick}
    >
      ${this._pirBusy === part
        ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
            ${i18n.getMessage('Sending…')}`
        : label}
    </button>`;
  }

  _reportStatus(pir) {
    if (!pir.reportOn) {
      return pir.reportState === 'empty'
        ? i18n.getMessage('The report draft is empty')
        : i18n.getMessage('The report draft has the platform summary or text written in the PIR');
    }
    return html`${i18n.getMessage('Incident review sent')} ·
      <luxlab-time value=${pir.reportOn}></luxlab-time
      >${pir.reportState === 'other' ? ` · ${i18n.getMessage('edited in the PIR since')}` : nothing}`;
  }

  _renderReplaceConfirm(pir) {
    return html`<div
      class="aiux-alert aiux-alert-warning aiux-alert-soft flex flex-wrap items-center justify-between gap-2"
      role="alert"
    >
      <span
        >${pir.reportOn
          ? i18n.getMessage('The report draft was edited in the PIR after LuxLab sent it. Replace those edits?')
          : i18n.getMessage('The report draft has text LuxLab did not write. Replace it with the incident review?')}</span
      >
      <span class="flex gap-2">
        <button
          type="button"
          class="aiux-btn aiux-btn-ghost aiux-btn-sm"
          @click=${() => (this._confirmReplace = false)}
        >
          ${i18n.getMessage('Cancel')}
        </button>
        <button
          type="button"
          class="aiux-btn aiux-btn-warning aiux-btn-sm"
          @click=${() => this._sendReport(pir)}
        >
          ${i18n.getMessage('Replace draft')}
        </button>
      </span>
    </div>`;
  }

  // The replay feeds the platform's Post Incident Review; curation done there comes back on every rebuild
  _renderPir(replay) {
    const pir = replay.pir;
    if (!pir) {
      return replay.incident.majorState
        ? html`<p class="text-sm text-text-tertiary">
            ${i18n.getMessage(
              'The post incident review is created when the major incident is resolved and accepted.'
            )}
          </p>`
        : nothing;
    }
    const blocker = this._pirBlocker(pir);
    const reportBlocker = blocker || this._reportBlocker(replay);
    return html`<div class="flex flex-col gap-3 rounded-box bg-base-200 px-4 py-3">
      <p class="flex flex-wrap items-center gap-2 text-sm text-text-secondary">
        <a
          class="aiux-link aiux-link-primary font-medium"
          href=${recordUrl('sn_sow_inc_post_incident_review', pir.sysId)}
          target="_blank"
          rel="noopener noreferrer"
          >${i18n.getMessage('Post incident review')}</a
        >
        <span class="aiux-badge aiux-badge-sm aiux-badge-soft"
          >${pir.state === 'draft' ? i18n.getMessage('Draft') : i18n.getMessage('Published')}</span
        >
        ${blocker ? html`<span class="text-xs text-text-tertiary">${blocker}</span>` : nothing}
      </p>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-text-secondary">
          <strong class="font-medium text-text-primary">${i18n.getMessage('Timeline')}</strong> ·
          ${pir.pushedOn
            ? html`${i18n.getMessage('{0} replay events sent', pir.pushedCount)} ·
                <luxlab-time value=${pir.pushedOn}></luxlab-time>`
            : i18n.getMessage('No replay events sent yet')}
        </p>
        ${this._renderPirButton('timeline', i18n.getMessage('Send timeline'), blocker, () =>
          this._sendToPir('timeline')
        )}
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm text-text-secondary">
          <strong class="font-medium text-text-primary">${i18n.getMessage('Report')}</strong> ·
          ${this._reportStatus(pir)}
        </p>
        ${this._renderPirButton('report', i18n.getMessage('Send report'), reportBlocker, () =>
          this._sendReport(pir)
        )}
      </div>
      ${this._confirmReplace && !reportBlocker ? this._renderReplaceConfirm(pir) : nothing}
    </div>`;
  }

  _renderStat(label, value) {
    return html`<div class="flex flex-col rounded-box bg-base-200 px-4 py-2">
      <span class="text-xl font-semibold text-text-primary">${value}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  // Where the time went between first impact and resolution
  _renderPhases(replay) {
    const phases = PHASES.map(phase => ({
      ...phase,
      minutes: replay.phases[phase.id] || 0
    }));
    const total = phases.reduce((sum, phase) => sum + phase.minutes, 0);
    const recovery = replay.phases.recovery || 0;
    if (!total) {
      return html`<p class="text-sm text-text-tertiary">
        ${i18n.getMessage('Not enough history to split this incident into phases.')}
      </p>`;
    }
    return html`<div class="flex flex-col gap-2">
      <div
        class="flex h-3 overflow-hidden rounded-full bg-base-200"
        role="img"
        aria-label=${i18n.getMessage('Time spent per phase')}
      >
        ${phases.map(phase =>
          phase.minutes
            ? html`<span
                style="width: ${(phase.minutes / total) * 100}%; background: ${phase.color}"
                title="${phaseLabel(phase.id)}: ${formatMinutes(phase.minutes)}"
              ></span>`
            : nothing
        )}
      </div>
      <ul class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-secondary">
        ${phases.map(
          phase => html`<li class="flex items-center gap-1.5" title=${phaseHint(phase.id)}>
            <span
              class="inline-block h-2.5 w-2.5 rounded-full"
              style="background: ${phase.color}"
            ></span>
            ${phaseLabel(phase.id)}
            <strong class="font-semibold text-text-primary"
              >${formatMinutes(phase.minutes)}</strong
            >
            <span class="text-xs text-text-tertiary"
              >${Math.round((phase.minutes / total) * 100)}%</span
            >
          </li>`
        )}
        ${recovery > 0
          ? html`<li
              class="flex items-center gap-1.5"
              title=${i18n.getMessage('Resolved until closed; not counted in time to resolve')}
            >
              <span
                class="inline-block h-2.5 w-2.5 rounded-full"
                style="background: ${RECOVERY_COLOR}"
              ></span>
              ${phaseLabel('recovery')}
              <strong class="font-semibold text-text-primary"
                >${formatMinutes(recovery)}</strong
              >
            </li>`
          : nothing}
      </ul>
    </div>`;
  }

  // The response patterns this incident is evidence for
  _renderPatterns(replay) {
    if (!replay.patterns?.length) return nothing;
    return html`<p class="flex flex-wrap items-center gap-2 text-sm text-text-tertiary">
      ${i18n.getMessage('Part of a recurring pattern')}:
      ${replay.patterns.map(
        pattern => html`<button
          type="button"
          class="aiux-badge aiux-badge-warning aiux-badge-soft cursor-pointer"
          @click=${() => navigate('/patterns', {query: {pattern: pattern.sysId}})}
        >
          ${pattern.title}
        </button>`
      )}
    </p>`;
  }

  _renderHeader(replay) {
    const incident = replay.incident;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="incident-title">
      <div class="aiux-card-body gap-4">
        <div class="flex flex-col gap-1">
          <h1
            id="incident-title"
            class="flex flex-wrap items-center gap-2 text-xl font-bold text-text-primary"
          >
            <span class="aiux-badge aiux-badge-soft ${priorityBadge(incident.priority)}"
              >P${incident.priority}</span
            >
            <a
              class="aiux-link aiux-link-primary"
              href=${recordUrl('incident', incident.sysId)}
              target="_blank"
              rel="noopener noreferrer"
              >${incident.number}</a
            >
            <span class="font-normal break-words">${incident.shortDescription}</span>
          </h1>
          <p class="text-sm text-text-tertiary">
            ${incident.majorState
              ? html`${i18n.getMessage('Major incident ({0})', incident.majorState)} · `
              : nothing}
            ${i18n.getMessage('Impact from')}
            <luxlab-time value=${replay.impactStart}></luxlab-time> ·
            ${i18n.getMessage('built')}
            <luxlab-time value=${replay.builtOn}></luxlab-time>
          </p>
          ${this._renderPatterns(replay)}
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          ${this._renderStat(
            replay.ongoing
              ? i18n.getMessage('Open for')
              : i18n.getMessage('Time to resolve'),
            formatMinutes(replay.minutesToResolve)
          )}
          ${this._renderStat(i18n.getMessage('Group reassignments'), replay.reassignments)}
          ${this._renderStat(i18n.getMessage('Engineer handoffs'), replay.handoffs)}
          ${this._renderStat(i18n.getMessage('Silent gaps'), replay.silentGaps)}
          ${this._renderStat(i18n.getMessage('Events'), replay.events.length)}
        </div>
        ${this._renderPhases(replay)} ${this._renderPir(replay)}
      </div>
    </section>`;
  }

  render() {
    const replay = this._replay;
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          class="aiux-btn aiux-btn-ghost aiux-btn-sm"
          @click=${() => navigate('/replay')}
        >
          ← ${i18n.getMessage('All incidents')}
        </button>
        <button
          type="button"
          class="aiux-btn aiux-btn-outline aiux-btn-sm"
          ?disabled=${this._busy}
          @click=${() => this._rebuild()}
        >
          ${this._busy
            ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
                ${i18n.getMessage('Rebuilding…')}`
            : i18n.getMessage('Rebuild replay')}
        </button>
      </div>
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            ${this._error}
          </div>`
        : nothing}
      ${this._notice
        ? html`<div class="aiux-alert aiux-alert-success aiux-alert-soft" role="status">
            ${this._notice}
          </div>`
        : nothing}
      ${!replay && this._busy
        ? html`<div class="flex items-center gap-3 text-sm text-text-secondary" role="status">
            <span class="aiux-loading aiux-loading-spinner aiux-loading-md"></span>
            ${i18n.getMessage('Rebuilding the incident timeline')}
          </div>`
        : nothing}
      ${replay?.status === 'failed'
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            <strong>${i18n.getMessage('Replay failed')}</strong> ${replay.error}
          </div>`
        : nothing}
      ${replay
        ? html`${this._renderHeader(replay)}
          ${replay.status === 'ready'
            ? html`<luxlab-replay-ai
                .replay=${replay}
                @luxlab-replay:change=${e => (this._replay = e.detail.replay)}
              ></luxlab-replay-ai>`
            : nothing}
          <luxlab-replay-timeline
            .events=${replay.events}
            origin=${replay.impactStart}
          ></luxlab-replay-timeline>`
        : nothing}
    </div>`;
  }
}
