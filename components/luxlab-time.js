import {html, css, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {formatTime, parseUtc} from '../utils/format.js';

// A UTC timestamp shown in the viewer's locale and time zone. The server does not know either,
// so it renders the raw UTC value and the browser swaps in the local one after hydration.
@customElement('luxlab-time')
export class LuxlabTime extends AIUXElement {
  @property({type: String}) value = '';
  @state() _local = false;

  static styles = css`
    :host {
      display: inline;
    }
  `;

  firstUpdated() {
    this._local = true;
  }

  render() {
    if (!this.value) return nothing;
    const date = parseUtc(this.value);
    return html`<time datetime=${date ? date.toISOString() : this.value}
      >${this._local ? formatTime(this.value) : `${this.value} UTC`}</time
    >`;
  }
}
