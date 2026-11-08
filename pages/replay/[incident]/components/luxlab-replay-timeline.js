import {html, css, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {repeat} from 'lit/directives/repeat.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {offsetLabel, phaseColor, phaseLabel} from '../../../../utils/format.js';
import '../../../../components/luxlab-time.js';

// Stored replay events, already ordered by the replay engine
@customElement('luxlab-replay-timeline')
export class LuxlabReplayTimeline extends AIUXElement {
  @property({attribute: false}) events = [];
  @property({type: String}) origin = '';
  @state() _keyOnly = false;
  @state() _open = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  _toggle(sequence) {
    this._open = this._open === sequence ? null : sequence;
  }

  // Curation done in the Post Incident Review
  _renderPirBadge(event) {
    if (event.hidden) {
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-ghost"
        >${i18n.getMessage('Hidden in PIR')}</span
      >`;
    }
    if (event.pirFlagged) {
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-soft aiux-badge-info"
        >${i18n.getMessage('Flagged in PIR')}</span
      >`;
    }
    if (event.source === 'pir') {
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-soft aiux-badge-secondary"
        >${i18n.getMessage('PIR note')}</span
      >`;
    }
    return nothing;
  }

  _renderEvent(event) {
    const gap = event.kind === 'silent_gap';
    const open = this._open === event.sequence;
    return html`<li
      class=${classMap({
        'grid grid-cols-[6.5rem_1fr] gap-3 border-l-4 py-2 pl-3': true,
        'opacity-60': event.hidden,
        'border-warning bg-warning/5': gap,
        'border-primary': event.keyMoment && !gap,
        'border-base-300': !event.keyMoment && !gap
      })}
    >
      <div class="flex flex-col text-xs">
        <span class="font-mono font-semibold text-text-primary"
          >${offsetLabel(event.occurredAt, this.origin)}</span
        >
        <span class="text-text-tertiary"
          ><luxlab-time value=${event.occurredAt}></luxlab-time
        ></span>
      </div>
      <div class="flex min-w-0 flex-col gap-1">
        <p class="flex flex-wrap items-center gap-2 text-sm text-text-primary">
          ${event.phase
            ? html`<span
                class="rounded px-1.5 py-0.5 text-xs font-medium text-white"
                style="background: ${phaseColor(event.phase)}"
                >${phaseLabel(event.phase)}</span
              >`
            : nothing}
          <span class=${classMap({'break-words': true, 'font-semibold': event.keyMoment})}
            >${event.summary}</span
          >
          ${this._renderPirBadge(event)}
        </p>
        ${event.actor
          ? html`<p class="text-xs text-text-tertiary">${event.actor}</p>`
          : nothing}
        ${event.detail && open
          ? html`<p
              id="detail-${event.sequence}"
              class="whitespace-pre-line rounded-box bg-base-200 p-2 text-sm text-text-secondary break-words"
            >
              ${event.detail}
            </p>`
          : nothing}
        ${event.detail
          ? html`<button
              type="button"
              class="aiux-btn aiux-btn-ghost aiux-btn-xs w-fit"
              aria-expanded=${open ? 'true' : 'false'}
              aria-controls="detail-${event.sequence}"
              @click=${() => this._toggle(event.sequence)}
            >
              ${open ? i18n.getMessage('Hide details') : i18n.getMessage('Show details')}
            </button>`
          : nothing}
      </div>
    </li>`;
  }

  render() {
    const shown = this._keyOnly
      ? this.events.filter(
          event => !event.hidden && (event.keyMoment || event.kind === 'silent_gap')
        )
      : this.events;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="timeline-title">
      <div class="aiux-card-body gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 id="timeline-title" class="aiux-card-title text-base text-text-primary">
            ${i18n.getMessage('Timeline ({0})', shown.length)}
          </h2>
          <label class="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              role="switch"
              class="aiux-toggle aiux-toggle-sm aiux-toggle-primary"
              .checked=${this._keyOnly}
              aria-checked=${this._keyOnly ? 'true' : 'false'}
              @change=${e => (this._keyOnly = e.target.checked)}
            />
            ${i18n.getMessage('Key moments only')}
          </label>
        </div>
        <ol class="flex flex-col gap-1">
          ${repeat(
            shown,
            event => event.sequence,
            event => this._renderEvent(event)
          )}
        </ol>
      </div>
    </section>`;
  }
}
