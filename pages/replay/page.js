import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import '@servicenow/aiux/aiux-components-empty-state-content';
import {api} from '../../utils/api.js';
import {priorityBadge} from '../../utils/format.js';
import {setDocumentTitle} from '../../utils/document-title.js';
import '../../components/luxlab-time.js';

const {acl, title} = decorators;

@customElement('x-everi-luxlab-replay-page')
@title('Incident Replay')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class ReplayPage extends AIUXElement {
  @state() _search = '';

  _prevLoaderData = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  // ?search= narrows the candidates; the list is rendered on the server
  static async loader(ctx) {
    const search = ctx.query?.search || '';
    try {
      const params = new URLSearchParams({search});
      const {candidates} = await api(`/replay/candidates?${params}`);
      return {search, candidates, error: ''};
    } catch (error) {
      return {search, candidates: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._search = this.loaderData?.search || '';
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('Incident Replay'));
  }

  _handleSearch(e) {
    e.preventDefault();
    const search = this._search.trim();
    navigate('/replay', search ? {query: {search}} : undefined);
  }

  _renderCandidate(item) {
    return html`<li class="flex flex-wrap items-center gap-3 border-b border-base-300 py-3 last:border-b-0">
      <span class="aiux-badge aiux-badge-sm aiux-badge-soft ${priorityBadge(item.priority)}"
        >P${item.priority}</span
      >
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <p class="text-sm text-text-primary break-words">
          <strong class="font-semibold">${item.number}</strong> ${item.shortDescription}
        </p>
        <p class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-tertiary">
          ${item.majorState
            ? html`<span class="aiux-badge aiux-badge-xs aiux-badge-error"
                >${i18n.getMessage('Major: {0}', item.majorState)}</span
              >`
            : nothing}
          <span>${item.group || i18n.getMessage('No group')}</span>
          <span
            >${i18n.getMessage('Opened')}
            <luxlab-time value=${item.openedAt}></luxlab-time
          ></span>
          <span
            >${item.active
              ? i18n.getMessage('Still open')
              : html`${i18n.getMessage('Resolved')}
                  <luxlab-time value=${item.resolvedAt}></luxlab-time>`}</span
          >
          ${item.replayStatus
            ? html`<span
                >${i18n.getMessage('Replay built')}
                <luxlab-time value=${item.replayBuiltOn}></luxlab-time
              ></span>`
            : nothing}
        </p>
      </div>
      <button
        type="button"
        class="aiux-btn aiux-btn-sm ${item.replayStatus
          ? 'aiux-btn-outline'
          : 'aiux-btn-primary'}"
        @click=${() => navigate(`/replay/${item.sysId}`)}
      >
        ${item.replayStatus
          ? i18n.getMessage('Open replay')
          : i18n.getMessage('Replay')}
      </button>
    </li>`;
  }

  render() {
    const {candidates, error} = this.loaderData || {};
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="replay-title">
        <div class="aiux-card-body gap-4">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 id="replay-title" class="text-2xl font-bold text-text-primary">
                ${i18n.getMessage('Incident Replay')}
              </h1>
              <p class="max-w-2xl text-sm text-text-tertiary">
                ${i18n.getMessage(
                  'Major incidents and P1/P2 incidents. Pick one to rebuild its timeline and see where the time went.'
                )}
              </p>
            </div>
            <form class="flex gap-2" role="search" @submit=${this._handleSearch}>
              <label class="aiux-input aiux-input-sm">
                <span class="sr-only">${i18n.getMessage('Search incidents')}</span>
                <input
                  type="search"
                  .value=${this._search}
                  placeholder=${i18n.getMessage('Number or description')}
                  @input=${e => (this._search = e.target.value)}
                />
              </label>
              <button type="submit" class="aiux-btn aiux-btn-sm aiux-btn-outline">
                ${i18n.getMessage('Search')}
              </button>
            </form>
          </div>
          ${error
            ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
                ${i18n.getMessage('Could not load incidents: {0}', error)}
              </div>`
            : nothing}
          ${candidates && !candidates.length
            ? html`<aiux-empty-state-content
                icon="circle-question-outline"
                heading-text=${i18n.getMessage('No matching incidents.')}
                .showBodyText=${false}
              ></aiux-empty-state-content>`
            : nothing}
          ${candidates?.length
            ? html`<ul aria-label=${i18n.getMessage('Incidents to replay')}>
                ${candidates.map(item => this._renderCandidate(item))}
              </ul>`
            : nothing}
        </div>
      </section>
    </div>`;
  }
}
