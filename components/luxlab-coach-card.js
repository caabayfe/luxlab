import {html, css, nothing, svg} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import {api, recordUrl} from '../utils/api.js';
import {formatMinutes, priorityBadge} from '../utils/format.js';

const MINUTE_MS = 60 * 1000;
const WARN_SHARE = 0.8;
// Under an hour the countdown shows seconds, so a breach can be watched happening
const SECONDS_UNDER_MINUTES = 60;
const RING_RADIUS = 26;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const LEVEL_COLORS = {ok: '#16a34a', warn: '#f59e0b', breach: '#dc2626', paused: '#94a3b8'};

function kindLabel(kind) {
  switch (kind) {
    case 'silence':
      return i18n.getMessage('Silence');
    case 'comms':
      return i18n.getMessage('Customer update');
    case 'routing':
      return i18n.getMessage('Routing');
    case 'pattern':
      return i18n.getMessage('Known pattern');
    case 'sla':
      return i18n.getMessage('SLA');
    default:
      return kind;
  }
}

function countdown(minutes) {
  const abs = Math.abs(minutes);
  if (abs >= SECONDS_UNDER_MINUTES) return formatMinutes(abs);
  const whole = Math.floor(abs);
  const secs = Math.floor((abs - whole) * 60);
  return `${whole}:${String(secs).padStart(2, '0')}`;
}

function clockLevel(elapsed, limit) {
  if (elapsed >= limit) return 'breach';
  return elapsed >= limit * WARN_SHARE ? 'warn' : 'ok';
}

/**
 * One live incident: its clocks tick every second from the server's timestamps, and its nudges can be acted on.
 * The coach belongs to the parent: after an action the new state is sent up as `luxlab-coach:update`
 * (detail.coach is null once the incident is no longer live).
 */
@customElement('luxlab-coach-card')
export class LuxlabCoachCard extends AIUXElement {
  @property({attribute: false}) coach = null;
  // Server time when the coach was read, so clocks don't depend on the browser's clock
  @property({type: Number, attribute: 'server-now'}) serverNow = 0;
  // On the Replay page the incident is already the page's subject
  @property({type: Boolean}) embedded = false;
  @state() _now = 0;
  @state() _busy = '';
  @state() _error = '';
  @state() _draft = null;

  _offset = 0;
  _timer = null;

  static styles = css`
    :host {
      display: block;
    }
    @keyframes luxlab-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.45;
      }
    }
    .pulse {
      animation: luxlab-pulse 1.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .pulse {
        animation: none;
      }
    }
  `;

  willUpdate(changed) {
    if (changed.has('serverNow') && this.serverNow) {
      this._offset = typeof window === 'undefined' ? 0 : this.serverNow - Date.now();
      if (!this._now) this._now = this.serverNow;
    }
  }

  firstUpdated() {
    this._timer = setInterval(() => {
      this._now = Date.now() + this._offset;
    }, 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  _changed(coach) {
    this.dispatchEvent(
      new CustomEvent('luxlab-coach:update', {
        detail: {incident: this.coach.sysId, coach},
        bubbles: true,
        composed: true
      })
    );
  }

  async _call(label, path, body) {
    this._busy = label;
    this._error = '';
    try {
      return await api(`/coach/incidents/${this.coach.sysId}/${path}`, {method: 'POST', body});
    } catch (error) {
      this._error = error.message;
      return null;
    } finally {
      this._busy = '';
    }
  }

  async _act(nudge) {
    const result = await this._call(nudge.key, 'act', {key: nudge.key});
    if (result) this._changed(result.coach);
  }

  async _dismiss(nudge) {
    const result = await this._call(nudge.key, 'dismiss', {key: nudge.key});
    if (result) this._changed(result.coach);
  }

  async _startDraft(nudge) {
    this._draft = {key: nudge.key, text: '', loading: true};
    const result = await this._call(nudge.key, 'draft', {});
    this._draft = result ? {key: nudge.key, text: result.draft, loading: false} : null;
  }

  async _postDraft() {
    const {key, text} = this._draft;
    const result = await this._call(key, 'update', {key, text});
    if (!result) return;
    this._draft = null;
    this._changed(result.coach);
  }

  _ring(label, minutesLeft, limitMinutes, level, caption) {
    const share = limitMinutes ? Math.min(1, Math.max(0, 1 - minutesLeft / limitMinutes)) : 1;
    const color = LEVEL_COLORS[level];
    return html`<div class="flex flex-col items-center gap-1" role="group" aria-label=${label}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        class=${level === 'breach' ? 'pulse' : ''}
        aria-hidden="true"
      >
        ${svg`<circle cx="32" cy="32" r=${RING_RADIUS} fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="6"></circle>
        <circle cx="32" cy="32" r=${RING_RADIUS} fill="none" stroke=${color} stroke-width="6" stroke-linecap="round"
          stroke-dasharray=${`${share * RING_LENGTH} ${RING_LENGTH}`} transform="rotate(-90 32 32)"></circle>`}
      </svg>
      <span class="font-mono text-sm font-semibold" style=${`color: ${color}`}>${caption}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  _renderClocks(coach, now) {
    const silenceElapsed = (now - coach.silence.since) / MINUTE_MS;
    const silenceLeft = coach.silence.limitMinutes - silenceElapsed;
    const commsElapsed = (now - coach.comms.since) / MINUTE_MS;
    const commsLeft = coach.comms.limitMinutes - commsElapsed;
    const slaLeft = coach.sla ? (coach.sla.dueAt - now) / MINUTE_MS : 0;
    const over = minutes => (minutes >= 0 ? countdown(minutes) : `+${countdown(minutes)}`);
    return html`<div class="flex flex-wrap justify-around gap-4 rounded-box bg-base-200 px-3 py-3">
      ${coach.silence.paused
        ? this._ring(i18n.getMessage('Silence'), 0, 0, 'paused', i18n.getMessage('On hold'))
        : this._ring(
            i18n.getMessage('Silence'),
            silenceLeft,
            coach.silence.limitMinutes,
            clockLevel(silenceElapsed, coach.silence.limitMinutes),
            over(silenceLeft)
          )}
      ${this._ring(
        i18n.getMessage('Customer update'),
        commsLeft,
        coach.comms.limitMinutes,
        clockLevel(commsElapsed, coach.comms.limitMinutes),
        over(commsLeft)
      )}
      ${coach.sla
        ? this._ring(
            coach.sla.name,
            slaLeft,
            0,
            coach.sla.breached || slaLeft <= 0 ? 'breach' : slaLeft <= 30 ? 'warn' : 'ok',
            over(slaLeft)
          )
        : nothing}
    </div>`;
  }

  _renderDraft() {
    const draft = this._draft;
    if (draft.loading) {
      return html`<p class="flex items-center gap-2 text-sm text-text-tertiary">
        <span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
        ${i18n.getMessage('LuxLab Comms Drafter is writing the update…')}
      </p>`;
    }
    return html`<div class="flex flex-col gap-2">
      <label class="text-xs text-text-tertiary" for="draft">${i18n.getMessage('Customer update (edit before posting)')}</label>
      <textarea
        id="draft"
        class="aiux-textarea w-full"
        rows="5"
        .value=${draft.text}
        @input=${event => (this._draft = {...draft, text: event.target.value})}
      ></textarea>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="aiux-btn aiux-btn-sm aiux-btn-primary"
          ?disabled=${!!this._busy || !draft.text.trim()}
          @click=${() => this._postDraft()}
        >
          ${this._busy ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>` : nothing}
          ${i18n.getMessage('Post as customer update')}
        </button>
        <button type="button" class="aiux-btn aiux-btn-sm aiux-btn-ghost" @click=${() => (this._draft = null)}>
          ${i18n.getMessage('Discard')}
        </button>
      </div>
    </div>`;
  }

  _renderAction(nudge) {
    const action = nudge.action;
    if (!action) return nothing;
    const busy = this._busy === nudge.key;
    const disabled = !!this._busy || !this.coach.canWrite || !!this._draft;
    const run = action.type === 'draft_update' ? () => this._startDraft(nudge) : () => this._act(nudge);
    return html`<button
      type="button"
      class="aiux-btn aiux-btn-xs aiux-btn-primary"
      ?disabled=${disabled}
      title=${this.coach.canWrite ? '' : i18n.getMessage('You are not allowed to update this incident')}
      @click=${run}
    >
      ${busy && action.type !== 'draft_update' ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>` : nothing}
      ${action.label}
    </button>`;
  }

  _renderNudge(nudge) {
    return html`<li
      class=${classMap({
        'flex flex-col gap-1.5 rounded-box border-l-4 bg-base-100 px-3 py-2': true,
        'border-error': nudge.level === 'breach',
        'border-warning': nudge.level === 'warn'
      })}
    >
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="aiux-badge aiux-badge-xs aiux-badge-soft ${nudge.level === 'breach' ? 'aiux-badge-error' : 'aiux-badge-warning'}"
          >${kindLabel(nudge.kind)}</span
        >
        <span class="text-sm font-semibold text-text-primary">${nudge.message}</span>
      </div>
      <p class="text-xs text-text-secondary">${nudge.detail}</p>
      ${nudge.evidence.length
        ? html`<ul class="flex flex-wrap gap-1" aria-label=${i18n.getMessage('Evidence')}>
            ${nudge.evidence.map(
              item => html`<li>
                <button type="button" class="aiux-btn aiux-btn-xs aiux-btn-outline" @click=${() => navigate(`/replay/${item.sysId}`)}>
                  ${item.number}
                </button>
              </li>`
            )}
          </ul>`
        : nothing}
      <div class="flex flex-wrap items-center gap-2">
        ${this._renderAction(nudge)}
        ${nudge.pattern
          ? html`<button
              type="button"
              class="aiux-btn aiux-btn-xs aiux-btn-ghost"
              @click=${() => navigate('/patterns', {query: {pattern: nudge.pattern}})}
            >
              ${i18n.getMessage('See pattern')}
            </button>`
          : nothing}
        <button
          type="button"
          class="aiux-btn aiux-btn-xs aiux-btn-ghost"
          ?disabled=${!!this._busy}
          @click=${() => this._dismiss(nudge)}
        >
          ${i18n.getMessage('Dismiss')}
        </button>
      </div>
    </li>`;
  }

  _renderHeader(coach, now) {
    if (this.embedded) return nothing;
    return html`<div class="flex flex-col gap-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="aiux-badge aiux-badge-sm ${priorityBadge(coach.priority)}">P${coach.priority}</span>
        ${coach.majorState
          ? html`<span class="aiux-badge aiux-badge-sm aiux-badge-error aiux-badge-soft"
              >${i18n.getMessage('Major incident: {0}', coach.majorState)}</span
            >`
          : nothing}
        <button
          type="button"
          class="aiux-link aiux-link-hover font-semibold text-text-primary"
          @click=${() => navigate(`/replay/${coach.sysId}`)}
        >
          ${coach.number}
        </button>
        <a
          class="aiux-link aiux-link-hover text-xs text-text-tertiary"
          href=${recordUrl('incident', coach.sysId)}
          target="_blank"
          rel="noopener noreferrer"
          >${i18n.getMessage('Open in ServiceNow')}</a
        >
      </div>
      <p class="text-sm text-text-primary">${coach.shortDescription}</p>
      <p class="text-xs text-text-tertiary">
        ${[coach.group || i18n.getMessage('No group'), coach.service, coach.state].filter(Boolean).join(' · ')}
        · ${i18n.getMessage('open {0}', formatMinutes((now - coach.openedAt) / MINUTE_MS))}
      </p>
    </div>`;
  }

  render() {
    const coach = this.coach;
    if (!coach) return nothing;
    const now = this._now || this.serverNow;
    return html`<article
      class=${classMap({
        'aiux-card h-full bg-base-100 shadow-sm': true,
        'border-2 border-error': coach.level === 'breach',
        'border-2 border-warning': coach.level === 'warn'
      })}
      aria-label=${coach.number}
    >
      <div class="aiux-card-body gap-3 ${this.embedded ? 'p-0' : ''}">
        ${this._renderHeader(coach, now)} ${this._renderClocks(coach, now)}
        ${coach.nudges.length
          ? html`<ul class="flex flex-col gap-2" aria-label=${i18n.getMessage('Coach nudges')}>
              ${coach.nudges.map(nudge => this._renderNudge(nudge))}
            </ul>`
          : html`<p class="text-sm text-success">${i18n.getMessage('On track: nothing needs attention right now.')}</p>`}
        ${this._draft ? this._renderDraft() : nothing}
        ${this._error ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">${this._error}</div>` : nothing}
      </div>
    </article>`;
  }
}
