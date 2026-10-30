import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import '@servicenow/aiux/aiux-components-score';
import '@servicenow/aiux/aiux-components-empty-state-content';
import {api, recordUrl} from '../../utils/api.js';
import {priorityBadge} from '../../utils/format.js';
import {setDocumentTitle} from '../../utils/document-title.js';
import './components/luxlab-world-clocks.js';

const {acl, title} = decorators;

const PAGE_SIZE = 5;
const STALE_AFTER_DAYS = 7;

const PRIORITY_COLORS = {
  1: '#dc2626',
  2: '#f59e0b',
  3: '#0891b2',
  4: '#64748b'
};

function attentionPage(page) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE)
  });
  return api(`/cockpit/attention?${params}`);
}

function score(label, value, sentiment) {
  return {
    label,
    value,
    formattedValue: String(value),
    format: 'plain',
    denominator: null,
    formattedDenominator: null,
    sentiment,
    color: null,
    change: null,
    target: null
  };
}

@customElement('x-everi-luxlab-home-page')
@title('Overview')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class HomePage extends AIUXElement {
  @state() _attention = null;
  @state() _paging = false;
  @state() _error = '';

  _prevLoaderData = null;

  static styles = css`
    :host {
      display: block;
      min-height: 100%;
      container-type: inline-size;
    }
  `;

  static async loader() {
    const [overview, attention] = await Promise.allSettled([
      api('/cockpit/overview'),
      attentionPage(1)
    ]);
    return {
      overview: overview.status === 'fulfilled' ? overview.value : null,
      attention: attention.status === 'fulfilled' ? attention.value : null,
      error:
        overview.status === 'rejected'
          ? overview.reason?.message || 'Unknown error'
          : ''
    };
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._attention = this.loaderData?.attention || null;
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('Overview'));
  }

  async _changePage(page) {
    try {
      this._paging = true;
      this._error = '';
      this._attention = await attentionPage(page);
    } catch (error) {
      this._error = i18n.getMessage('Could not load tickets: {0}', error.message);
    } finally {
      this._paging = false;
    }
  }

  _renderPriorities(priorities) {
    // P5 is rare in ops queues; fold it out to keep the bar readable
    const shown = priorities.filter(item => item.priority !== '5');
    const total = shown.reduce((sum, item) => sum + item.count, 0);
    return html`<div class="mt-3 flex flex-col gap-1.5">
      <div
        class="flex h-1.5 overflow-hidden rounded-full bg-base-200"
        aria-hidden="true"
      >
        ${total
          ? shown.map(item =>
              item.count
                ? html`<span
                    style="width: ${(item.count / total) * 100}%; background: ${PRIORITY_COLORS[
                      item.priority
                    ] || '#94a3b8'}"
                  ></span>`
                : nothing
            )
          : nothing}
      </div>
      <p class="flex flex-wrap gap-x-2 text-xs text-text-tertiary">
        ${shown.map(
          item => html`<span class=${item.count ? 'text-text-secondary' : ''}
            >P${item.priority} (${item.count})</span
          >`
        )}
      </p>
    </div>`;
  }

  _renderTile(data, caption, priorities) {
    return html`<li class="aiux-card bg-base-100 shadow-sm">
      <div class="aiux-card-body gap-1 p-4">
        <aiux-score size="sm" .data=${data}></aiux-score>
        <p class="text-xs text-text-tertiary">${caption}</p>
        ${priorities ? this._renderPriorities(priorities) : nothing}
      </div>
    </li>`;
  }

  _renderKpis(overview) {
    return html`<ul
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-label=${i18n.getMessage('Key figures')}
    >
      ${this._renderTile(
        score(i18n.getMessage('My tickets'), overview.myTickets.total, 'neutral'),
        i18n.getMessage('Active and assigned to me'),
        overview.myTickets.byPriority
      )}
      ${this._renderTile(
        score(
          i18n.getMessage('SLAs at risk'),
          overview.slaAtRisk,
          overview.slaAtRisk ? 'negative' : 'neutral'
        ),
        i18n.getMessage('75% or more elapsed')
      )}
      ${this._renderTile(
        score(
          i18n.getMessage('SLAs breached'),
          overview.slaBreached,
          overview.slaBreached ? 'negative' : 'positive'
        ),
        i18n.getMessage('On my active tickets')
      )}
      ${this._renderTile(
        score(
          i18n.getMessage('Changes'),
          overview.changesPendingApproval,
          'neutral'
        ),
        i18n.getMessage('My groups, pending approval')
      )}
      ${this._renderTile(
        score(i18n.getMessage('Changes (24h)'), overview.changesNext24h, 'neutral'),
        i18n.getMessage('Windows starting in the next 24h')
      )}
      ${this._renderTile(
        score(
          i18n.getMessage('Unassigned'),
          overview.unassigned.total,
          overview.unassigned.total ? 'negative' : 'neutral'
        ),
        i18n.getMessage("In my groups' queues"),
        overview.unassigned.byPriority
      )}
    </ul>`;
  }

  _renderAttentionItem(item) {
    return html`<li class="flex flex-col gap-1 border-b border-base-300 py-3 last:border-b-0">
      <div class="flex flex-wrap items-center gap-2">
        <span class="aiux-badge aiux-badge-sm aiux-badge-soft ${priorityBadge(item.priority)}"
          >P${item.priority}</span
        >
        <a
          class="aiux-link aiux-link-primary font-medium"
          href=${recordUrl(item.table, item.sysId)}
          target="_blank"
          rel="noopener noreferrer"
          >${item.number}</a
        >
        <span class="text-xs text-text-tertiary">${item.assignmentGroup}</span>
        <span class="ml-auto flex flex-wrap gap-1">
          ${item.slaBreached
            ? html`<span class="aiux-badge aiux-badge-sm aiux-badge-error"
                >${i18n.getMessage('SLA breached')}</span
              >`
            : nothing}
          ${item.slaAtRisk
            ? html`<span class="aiux-badge aiux-badge-sm aiux-badge-warning"
                >${i18n.getMessage('SLA at risk')}</span
              >`
            : nothing}
          ${item.staleDays >= STALE_AFTER_DAYS
            ? html`<span class="aiux-badge aiux-badge-sm aiux-badge-ghost"
                >${i18n.getMessage('Not updated for {0}d', item.staleDays)}</span
              >`
            : nothing}
        </span>
      </div>
      <p class="text-sm text-text-secondary break-words">${item.shortDescription}</p>
    </li>`;
  }

  _renderAttention() {
    const data = this._attention;
    if (!data) return nothing;
    const lastPage = Math.max(1, Math.ceil(data.total / data.pageSize));
    const first = data.total ? (data.page - 1) * data.pageSize + 1 : 0;
    const last = Math.min(data.page * data.pageSize, data.total);
    return html`<section
      class="aiux-card bg-base-100 shadow-sm lg:col-span-3"
      aria-labelledby="attention-title"
    >
      <div class="aiux-card-body gap-2">
        <h2 id="attention-title" class="aiux-card-title text-base text-text-primary">
          ${i18n.getMessage('Requires attention')}
        </h2>
        <p class="text-sm text-text-tertiary">
          ${i18n.getMessage(
            'My active tickets, most urgent first: breached SLA, SLA at risk, priority, then staleness.'
          )}
        </p>
        ${data.items.length
          ? html`<ol aria-busy=${this._paging ? 'true' : 'false'}>
              ${data.items.map(item => this._renderAttentionItem(item))}
            </ol>`
          : html`<aiux-empty-state-content
              icon="circle-check-outline"
              heading-text=${i18n.getMessage('Nothing needs attention right now.')}
              .showBodyText=${false}
            ></aiux-empty-state-content>`}
        <footer class="flex items-center justify-between text-sm text-text-tertiary">
          <span>${i18n.getMessage('{0}-{1} of {2}', first, last, data.total)}</span>
          <span class="flex gap-1">
            <button
              type="button"
              class="aiux-btn aiux-btn-ghost aiux-btn-sm"
              ?disabled=${this._paging || data.page <= 1}
              @click=${() => this._changePage(data.page - 1)}
            >
              ${i18n.getMessage('Prev')}
            </button>
            <button
              type="button"
              class="aiux-btn aiux-btn-ghost aiux-btn-sm"
              ?disabled=${this._paging || data.page >= lastPage}
              @click=${() => this._changePage(data.page + 1)}
            >
              ${i18n.getMessage('Next')}
            </button>
          </span>
        </footer>
      </div>
    </section>`;
  }

  _renderBriefingTeaser() {
    const tools = [
      i18n.getMessage('Analyze My Queue'),
      i18n.getMessage('Next Best Work Order'),
      i18n.getMessage('Stalled Work Detector'),
      i18n.getMessage('Customer Impact Brief'),
      i18n.getMessage('Update Draft Assistant'),
      i18n.getMessage('Weekly Summary')
    ];
    return html`<section
      class="aiux-card bg-base-100 shadow-sm lg:col-span-2"
      aria-labelledby="briefing-title"
    >
      <div class="aiux-card-body gap-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <h2 id="briefing-title" class="aiux-card-title text-base text-text-primary">
              ${i18n.getMessage('Daily briefing tools')}
            </h2>
            <p class="text-sm text-text-tertiary">
              ${i18n.getMessage('Each tool runs a ServiceNow AI agent on your work.')}
            </p>
          </div>
          <button
            type="button"
            class="aiux-btn aiux-btn-primary aiux-btn-sm"
            @click=${() => navigate('/briefing')}
          >
            ${i18n.getMessage('Open')}
          </button>
        </div>
        <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          ${tools.map(
            name => html`<li
              class="rounded-box border border-base-300 px-3 py-2 text-sm font-medium text-text-primary"
            >
              ${name}
            </li>`
          )}
        </ul>
      </div>
    </section>`;
  }

  render() {
    const {overview, error} = this.loaderData || {};
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text-primary">
            ${i18n.getMessage('Operations cockpit')}
          </h1>
          <p class="text-sm text-text-tertiary">
            ${overview
              ? i18n.getMessage(
                  'Real-time overview of your service desk activity · updated {0}',
                  overview.generatedAt
                )
              : i18n.getMessage('Real-time overview of your service desk activity')}
          </p>
        </div>
        <luxlab-world-clocks></luxlab-world-clocks>
      </header>
      ${error || this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            ${this._error ||
            i18n.getMessage('Could not load the cockpit: {0}', error)}
          </div>`
        : nothing}
      ${overview ? this._renderKpis(overview) : nothing}
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
        ${this._renderAttention()} ${this._renderBriefingTeaser()}
      </div>
    </div>`;
  }
}
