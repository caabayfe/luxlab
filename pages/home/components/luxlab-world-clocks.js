import {html, css} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';

// Follow-the-sun hubs; the first entry is shown as the local hub
const CLOCKS = [
  {city: 'Madrid', timeZone: 'Europe/Madrid'},
  {city: 'London', timeZone: 'Europe/London'},
  {city: 'Bangalore', timeZone: 'Asia/Kolkata'},
  {city: 'New York', timeZone: 'America/New_York'}
];

function timeIn(timeZone, now) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit'
  }).format(now);
}

function offsetOf(timeZone, now) {
  const part = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    timeZoneName: 'shortOffset'
  })
    .formatToParts(now)
    .find(item => item.type === 'timeZoneName');
  return part ? part.value.replace('GMT', 'UTC') : '';
}

// Clocks tick in the browser only; the server render shows placeholders so hydration matches
@customElement('luxlab-world-clocks')
export class LuxlabWorldClocks extends AIUXElement {
  @state() _now = null;

  _timer = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  firstUpdated() {
    this._now = new Date();
    this._timer = setInterval(() => {
      this._now = new Date();
    }, 30 * 1000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  render() {
    return html`<ul
      class="flex flex-wrap gap-2"
      aria-label=${i18n.getMessage('World clocks')}
    >
      ${CLOCKS.map(
        (clock, index) => html`<li
          class=${classMap({
            'flex min-w-24 flex-col rounded-box border px-3 py-1.5': true,
            'border-primary bg-primary/5': index === 0,
            'border-base-300 bg-base-100': index !== 0
          })}
        >
          <span class="text-xs text-text-tertiary">${clock.city}</span>
          <span class="font-mono text-lg font-semibold text-text-primary"
            >${this._now ? timeIn(clock.timeZone, this._now) : '--:--'}</span
          >
          <span class="text-xs text-text-tertiary"
            >${this._now ? offsetOf(clock.timeZone, this._now) : ''}</span
          >
        </li>`
      )}
    </ul>`;
  }
}
