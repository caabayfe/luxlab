import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import '@servicenow/aiux/aiux-components-empty-state-content';
import {api} from '../../utils/api.js';
import {formatMinutes, priorityBadge} from '../../utils/format.js';
import {setDocumentTitle} from '../../utils/document-title.js';
import '../../components/luxlab-coach-card.js';

const {acl, title} = decorators;

// Nudges are recomputed on the server this often; the clocks tick in the browser in between
const REFRESH_MS = 30 * 1000;

@customElement('x-everi-luxlab-live-page')
@title('War Room')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class LivePage extends AIUXElement {
  @state() _live = null;
  @state() _error = '';
  @state() _refreshing = false;

  _prevLoaderData = null;
  _timer = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  static async loader() {
    try {
      return {live: await api('/coach/live'), error: ''};
    } catch (error) {
      return {live: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._live = this.loaderData?.live || null;
      this._error = this.loaderData?.error || '';
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('War Room'));
    this._timer = setInterval(() => this._refresh(), REFRESH_MS);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  async _refresh() {
    if (this._refreshing) return;
    this._refreshing = true;
    try {
      this._live = await api('/coach/live');
      this._error = '';
    } catch (error) {
      this._error = error.message;
    } finally {
      this._refreshing = false;
    }
  }

  // A card acted on a nudge: take its new state, or drop the incident once it is no longer live
  _onCoachUpdate(event) {
    const {incident, coach} = event.detail;
    const incidents = this._live.incidents
      .map(item => (item.sysId === incident ? coach : item))
      .filter(Boolean);
    this._live = {...this._live, incidents};
  }

  _renderStat(label, value, tone) {
    return html`<div class="flex flex-col rounded-box bg-base-200 px-4 py-2">
      <span class="text-xl font-semibold ${tone || 'text-text-primary'}">${value}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  _renderHeader(live) {
    const active = live.incidents.filter(incident => !incident.stale);
    const count = level => active.filter(incident => incident.level === level).length;
    const quiet = live.incidents.length - active.length;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="live-title">
      <div class="aiux-card-body gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex max-w-3xl flex-col gap-1">
            <h1 id="live-title" class="flex items-center gap-2 text-2xl font-bold text-text-primary">
              <span class="inline-block size-2.5 rounded-full bg-error" aria-hidden="true"></span>
              ${i18n.getMessage('War room')}
            </h1>
            <p class="text-sm text-text-tertiary">
              ${i18n.getMessage(
                'Live P1/P2 and major incidents from the last {0} days. The coach watches the silence, customer update and SLA clocks, and compares each incident with how similar ones were resolved.',
                String(live.liveDays)
              )}
            </p>
          </div>
          <button
            type="button"
            class="aiux-btn aiux-btn-sm aiux-btn-outline"
            ?disabled=${this._refreshing}
            @click=${() => this._refresh()}
          >
            ${this._refreshing
              ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>`
              : nothing}
            ${i18n.getMessage('Refresh')}
          </button>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          ${this._renderStat(i18n.getMessage('Being worked'), active.length)}
          ${this._renderStat(i18n.getMessage('Breached'), count('breach'), count('breach') ? 'text-error' : '')}
          ${this._renderStat(i18n.getMessage('Need attention soon'), count('warn'), count('warn') ? 'text-warning' : '')}
          ${this._renderStat(i18n.getMessage('Gone quiet'), quiet, quiet ? 'text-text-tertiary' : '')}
        </div>
        <p class="text-xs text-text-tertiary">
          ${live.workNotes
            ? i18n.getMessage('The coach also posts breached clocks and routing hints as work notes on P1/P2 incidents being worked, every 5 minutes.')
            : i18n.getMessage('Work-note nudges are switched off.')}
          ${i18n.getMessage('This page refreshes every 30 seconds.')}
        </p>
      </div>
    </section>`;
  }

  // Silent for over a day: listed compactly so they don't drown the incidents being worked
  _renderQuiet(quiet, now) {
    if (!quiet.length) return nothing;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="quiet-title">
      <div class="aiux-card-body gap-2">
        <h2 id="quiet-title" class="text-base font-semibold text-text-primary">
          ${i18n.getMessage('Gone quiet')}
          <span class="text-sm font-normal text-text-tertiary"
            >${i18n.getMessage('No update for over a day: still open, but nobody is working them live')}</span
          >
        </h2>
        <ul class="flex flex-col divide-y divide-base-200">
          ${quiet.map(
            incident => html`<li class="flex flex-wrap items-center gap-2 py-2">
              <span class="aiux-badge aiux-badge-sm ${priorityBadge(incident.priority)}">P${incident.priority}</span>
              <button
                type="button"
                class="aiux-link aiux-link-hover text-sm font-semibold text-text-primary"
                @click=${() => navigate(`/replay/${incident.sysId}`)}
              >
                ${incident.number}
              </button>
              <span class="min-w-0 flex-1 truncate text-sm text-text-secondary">${incident.shortDescription}</span>
              <span class="text-xs text-text-tertiary"
                >${incident.group || i18n.getMessage('No group')} ·
                ${i18n.getMessage('silent {0}', formatMinutes((now - incident.silence.since) / 60000))}</span
              >
            </li>`
          )}
        </ul>
      </div>
    </section>`;
  }

  render() {
    const live = this._live;
    const active = live ? live.incidents.filter(incident => !incident.stale) : [];
    const quiet = live ? live.incidents.filter(incident => incident.stale) : [];
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">${this._error}</div>`
        : nothing}
      ${live ? this._renderHeader(live) : nothing}
      ${live && !active.length
        ? html`<aiux-empty-state-content
            icon="check"
            heading-text=${i18n.getMessage('No P1/P2 or major incidents are being worked right now.')}
            .showBodyText=${false}
          ></aiux-empty-state-content>`
        : nothing}
      ${active.length
        ? html`<ul
            class="grid grid-cols-1 gap-4 lg:grid-cols-2"
            aria-label=${i18n.getMessage('Live incidents')}
            @luxlab-coach:update=${this._onCoachUpdate}
          >
            ${active.map(
              incident => html`<li>
                <luxlab-coach-card .coach=${incident} server-now=${live.now}></luxlab-coach-card>
              </li>`
            )}
          </ul>`
        : nothing}
      ${live ? this._renderQuiet(quiet, live.now) : nothing}
    </div>`;
  }
}
