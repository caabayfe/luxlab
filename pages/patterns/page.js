import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import '@servicenow/aiux/aiux-components-empty-state-content';
import {api, recordUrl} from '../../utils/api.js';
import {formatMinutes} from '../../utils/format.js';
import {setDocumentTitle} from '../../utils/document-title.js';
import '../../components/luxlab-agent-run.js';
import '../../components/luxlab-markdown.js';
import '../../components/luxlab-time.js';

const {acl, title} = decorators;

const ANALYST = 'LuxLab Pattern Analyst';
// Evidence chips shown before "more"
const EVIDENCE_SHOWN = 6;

function typeLabel(type) {
  switch (type) {
    case 'misroute':
      return i18n.getMessage('Misrouting');
    case 'gaps':
      return i18n.getMessage('Silent gaps');
    case 'detection':
      return i18n.getMessage('Late detection');
    case 'waiting':
      return i18n.getMessage('Waiting');
    default:
      return type;
  }
}

// What the minutes of each pattern type measure
function minutesLabel(type) {
  switch (type) {
    case 'misroute':
      return i18n.getMessage('with the wrong group');
    case 'gaps':
      return i18n.getMessage('of silence above the limit');
    case 'detection':
      return i18n.getMessage('from first alert to incident');
    case 'waiting':
      return i18n.getMessage('on hold');
    default:
      return '';
  }
}

function fixTypeLabel(fixType) {
  switch (fixType) {
    case 'routing':
      return i18n.getMessage('Routing fix');
    case 'knowledge':
      return i18n.getMessage('Knowledge fix');
    case 'monitoring':
      return i18n.getMessage('Monitoring fix');
    case 'process':
      return i18n.getMessage('Process fix');
    case 'problem':
      return i18n.getMessage('Problem investigation');
    default:
      return '';
  }
}

function stateBadge(pattern) {
  if (!pattern.active) {
    return html`<span class="aiux-badge aiux-badge-sm aiux-badge-success aiux-badge-soft"
      >${i18n.getMessage('No longer seen')}</span
    >`;
  }
  switch (pattern.state) {
    case 'proposed':
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-info aiux-badge-soft"
        >${i18n.getMessage('Fix proposed')}</span
      >`;
    case 'accepted':
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-success aiux-badge-soft"
        >${i18n.getMessage('Fix accepted')}</span
      >`;
    case 'dismissed':
      return html`<span class="aiux-badge aiux-badge-sm aiux-badge-ghost"
        >${i18n.getMessage('Dismissed')}</span
      >`;
    default:
      return nothing;
  }
}

@customElement('x-everi-luxlab-patterns-page')
@title('Response Patterns')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class PatternsPage extends AIUXElement {
  @state() _data = null;
  @state() _error = '';
  // Coverage while missing incidents are being replayed; null when idle
  @state() _refreshing = null;
  @state() _filter = 'all';
  @state() _runs = {};
  @state() _deciding = '';
  @state() _expanded = {};

  _prevLoaderData = null;
  _focused = false;

  static styles = css`
    :host {
      display: block;
    }
  `;

  // ?pattern= highlights the pattern a replay linked to
  static async loader(ctx) {
    const focus = ctx.query?.pattern || '';
    try {
      return {focus, data: await api('/patterns'), error: ''};
    } catch (error) {
      return {focus, data: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._data = this.loaderData?.data || null;
      this._error = this.loaderData?.error || '';
      this._focused = false;
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('Response Patterns'));
  }

  updated() {
    const focus = this.loaderData?.focus;
    if (!focus || this._focused) return;
    const card = this.renderRoot.querySelector(`[data-pattern="${focus}"]`);
    if (!card) return;
    this._focused = true;
    // Proposals above render their markdown a moment later and would push the card down mid-scroll
    setTimeout(() => card.scrollIntoView({block: 'start'}), 300);
  }

  get _busy() {
    return (
      !!this._refreshing ||
      !!this._deciding ||
      Object.values(this._runs).some(run => run?.state === 'running')
    );
  }

  // Each call replays one batch; the last one mines and returns the patterns
  async _refresh() {
    try {
      this._error = '';
      this._refreshing = this._data?.coverage || {pending: 0, incidents: 0, replayed: 0};
      for (;;) {
        const result = await api('/patterns/refresh', {method: 'POST'});
        if (result.patterns) {
          this._data = result;
          break;
        }
        if (result.coverage.pending >= this._refreshing.pending && this._refreshing.incidents) {
          throw new Error(i18n.getMessage('Replaying stopped making progress'));
        }
        this._refreshing = result.coverage;
      }
    } catch (error) {
      this._error = error.message || 'Unknown error';
    } finally {
      this._refreshing = null;
    }
  }

  async _reload() {
    try {
      this._data = await api('/patterns');
    } catch (error) {
      this._error = error.message || 'Unknown error';
    }
  }

  async _propose(pattern) {
    try {
      this._error = '';
      this._runs = {...this._runs, [pattern.sysId]: undefined};
      const {run} = await api(`/patterns/${pattern.sysId}/agent`, {method: 'POST'});
      this._runs = {...this._runs, [pattern.sysId]: run};
    } catch (error) {
      this._error = error.message || 'Unknown error';
    }
  }

  // When the agent finishes, its tool has saved the proposal on the pattern
  _onRun(pattern, run) {
    this._runs = {...this._runs, [pattern.sysId]: run};
    if (run.state !== 'running') this._reload();
  }

  async _decide(pattern, decision) {
    try {
      this._deciding = pattern.sysId;
      this._error = '';
      await api(`/patterns/${pattern.sysId}/decision`, {method: 'POST', body: {decision}});
      await this._reload();
    } catch (error) {
      this._error = error.message || 'Unknown error';
    } finally {
      this._deciding = '';
    }
  }

  _renderStat(label, value) {
    return html`<div class="flex flex-col rounded-box bg-base-200 px-4 py-2">
      <span class="text-xl font-semibold text-text-primary">${value}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  _renderCoverage(coverage, patterns) {
    const minedOn = patterns
      .map(pattern => pattern.minedOn)
      .sort()
      .pop();
    const progress = this._refreshing;
    return html`<div class="flex flex-col gap-2">
      <p class="text-sm text-text-tertiary">
        ${i18n.getMessage(
          '{0} of {1} incidents replayed (P1/P2 and major incidents resolved in the last {2} days)',
          String((progress || coverage).replayed),
          String((progress || coverage).incidents),
          String(coverage.windowDays)
        )}${coverage.withoutHistory
          ? html` ·
              ${i18n.getMessage(
                '{0} left out: resolved the minute they were opened, so there is no response to learn from',
                String(coverage.withoutHistory)
              )}`
          : nothing}${minedOn
          ? html` · ${i18n.getMessage('patterns mined')}
              <luxlab-time value=${minedOn}></luxlab-time>`
          : nothing}
      </p>
      ${progress
        ? html`<progress
            class="aiux-progress aiux-progress-primary w-full"
            value=${progress.replayed}
            max=${progress.incidents || 1}
            aria-label=${i18n.getMessage('Replaying incidents')}
          ></progress>`
        : nothing}
    </div>`;
  }

  _renderHeader(data) {
    const {coverage, patterns} = data;
    const active = patterns.filter(pattern => pattern.active);
    const lost = active.reduce((sum, pattern) => sum + pattern.minutesLost, 0);
    const incidents = new Set(
      active.flatMap(pattern => pattern.incidents.map(item => item.sysId))
    ).size;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="patterns-title">
      <div class="aiux-card-body gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex max-w-3xl flex-col gap-1">
            <h1 id="patterns-title" class="text-2xl font-bold text-text-primary">
              ${i18n.getMessage('Response patterns')}
            </h1>
            <p class="text-sm text-text-tertiary">
              ${i18n.getMessage(
                'Where the incident response keeps losing time across many incidents: the same wrong group, the same silences, alerts nobody turned into an incident. The post incident review looks at one incident; this looks at all of them.'
              )}
            </p>
          </div>
          <button
            type="button"
            class="aiux-btn aiux-btn-sm aiux-btn-primary"
            ?disabled=${this._busy}
            @click=${this._refresh}
          >
            ${this._refreshing
              ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
                  ${i18n.getMessage('Analysing...')}`
              : i18n.getMessage('Analyse incidents')}
          </button>
        </div>
        ${this._renderCoverage(coverage, patterns)}
        ${active.length
          ? html`<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
              ${this._renderStat(i18n.getMessage('Patterns'), active.length)}
              ${this._renderStat(i18n.getMessage('Time lost'), formatMinutes(lost))}
              ${this._renderStat(i18n.getMessage('Incidents involved'), incidents)}
            </div>`
          : nothing}
      </div>
    </section>`;
  }

  _renderFilters(patterns) {
    const types = ['all', 'misroute', 'gaps', 'detection', 'waiting'];
    return html`<div role="tablist" class="aiux-tabs aiux-tabs-box w-fit" aria-label=${i18n.getMessage('Pattern type')}>
      ${types.map(type => {
        const count = patterns.filter(pattern => type === 'all' || pattern.type === type).length;
        return html`<button
          type="button"
          role="tab"
          class="aiux-tab ${this._filter === type ? 'aiux-tab-active' : ''}"
          aria-selected=${this._filter === type}
          @click=${() => (this._filter = type)}
        >
          ${type === 'all' ? i18n.getMessage('All') : typeLabel(type)} (${count})
        </button>`;
      })}
    </div>`;
  }

  _renderBenchmark(pattern) {
    if (!pattern.baselineTtr || !pattern.medianTtr) return nothing;
    const slower = pattern.medianTtr > pattern.baselineTtr;
    return html`<span class=${slower ? 'text-error' : ''}
      >${i18n.getMessage(
        'Median time to resolve {0} vs {1} for other incidents',
        formatMinutes(pattern.medianTtr),
        formatMinutes(pattern.baselineTtr)
      )}</span
    >`;
  }

  _renderFacets(pattern) {
    const facets = [...pattern.facets.services, ...pattern.facets.categories];
    if (!facets.length) return nothing;
    return html`<p class="text-xs text-text-tertiary">
      ${i18n.getMessage('Mostly')}:
      ${facets.map(facet => `${facet.name} (${facet.count})`).join(' · ')}
    </p>`;
  }

  _renderEvidence(pattern) {
    const expanded = this._expanded[pattern.sysId];
    const shown = expanded ? pattern.incidents : pattern.incidents.slice(0, EVIDENCE_SHOWN);
    const more = pattern.incidents.length - shown.length;
    return html`<ul class="flex flex-wrap gap-2" aria-label=${i18n.getMessage('Incidents in this pattern')}>
      ${shown.map(
        item => html`<li>
          <button
            type="button"
            class="aiux-btn aiux-btn-xs aiux-btn-outline"
            title=${item.shortDescription}
            @click=${() => navigate(`/replay/${item.sysId}`)}
          >
            ${item.number} · ${formatMinutes(item.minutes)}
          </button>
        </li>`
      )}
      ${more > 0
        ? html`<li>
            <button
              type="button"
              class="aiux-btn aiux-btn-xs aiux-btn-ghost"
              @click=${() => (this._expanded = {...this._expanded, [pattern.sysId]: true})}
            >
              ${i18n.getMessage('{0} more', String(more))}
            </button>
          </li>`
        : nothing}
    </ul>`;
  }

  _renderDecision(pattern, canDecide) {
    if (pattern.state === 'accepted' || pattern.state === 'dismissed') {
      return html`<p class="text-xs text-text-tertiary">
        ${pattern.state === 'accepted'
          ? i18n.getMessage('Accepted by {0}', pattern.decidedBy)
          : i18n.getMessage('Dismissed by {0}', pattern.decidedBy)}
        · <luxlab-time value=${pattern.decidedOn}></luxlab-time>
        ${pattern.problem
          ? html` ·
              <a
                class="aiux-link aiux-link-primary"
                href=${recordUrl('problem', pattern.problem.sysId)}
                target="_blank"
                rel="noopener noreferrer"
                >${pattern.problem.number}</a
              >`
          : nothing}
      </p>`;
    }
    if (!canDecide) return nothing;
    const deciding = this._deciding === pattern.sysId;
    return html`<div class="flex flex-wrap gap-2">
      ${pattern.state === 'proposed'
        ? html`<button
            type="button"
            class="aiux-btn aiux-btn-sm aiux-btn-primary"
            ?disabled=${this._busy}
            @click=${() => this._decide(pattern, 'accept')}
          >
            ${deciding
              ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>`
              : nothing}
            ${pattern.fixType === 'problem'
              ? i18n.getMessage('Accept and open problem')
              : i18n.getMessage('Accept fix')}
          </button>`
        : nothing}
      <button
        type="button"
        class="aiux-btn aiux-btn-sm aiux-btn-ghost"
        ?disabled=${this._busy}
        @click=${() => this._decide(pattern, 'dismiss')}
      >
        ${i18n.getMessage('Dismiss pattern')}
      </button>
    </div>`;
  }

  _renderProposal(pattern) {
    if (!pattern.proposal) return nothing;
    return html`<div class="flex flex-col gap-2 rounded-box bg-base-200 p-4">
      <p class="flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
        <span class="aiux-badge aiux-badge-sm aiux-badge-secondary aiux-badge-soft"
          >${fixTypeLabel(pattern.fixType)}</span
        >
        ${i18n.getMessage('Proposed by {0}', ANALYST)}
        <luxlab-time value=${pattern.proposedOn}></luxlab-time>
      </p>
      <luxlab-markdown .text=${pattern.proposal}></luxlab-markdown>
    </div>`;
  }

  _renderPattern(pattern, canDecide) {
    const run = this._runs[pattern.sysId];
    const open = pattern.state === 'new' || pattern.state === 'proposed';
    const focused = this.loaderData?.focus === pattern.sysId;
    return html`<li
      data-pattern=${pattern.sysId}
      class="aiux-card scroll-mt-4 bg-base-100 shadow-sm ${focused ? 'ring-2 ring-info' : ''}"
    >
      <div class="aiux-card-body gap-3">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="flex flex-wrap items-center gap-2">
              <span class="aiux-badge aiux-badge-sm aiux-badge-outline">${typeLabel(pattern.type)}</span>
              ${stateBadge(pattern)}
            </p>
            <h2 class="text-lg font-semibold text-text-primary break-words">${pattern.title}</h2>
            <p class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-text-secondary">
              <span
                ><strong class="text-text-primary">${formatMinutes(pattern.minutesLost)}</strong>
                ${minutesLabel(pattern.type)}</span
              >
              <span
                >${i18n.getMessage(
                  '{0} incidents, {1} each (median)',
                  String(pattern.incidentCount),
                  formatMinutes(pattern.medianMinutes)
                )}</span
              >
              ${this._renderBenchmark(pattern)}
            </p>
            ${this._renderFacets(pattern)}
          </div>
          ${open
            ? html`<button
                type="button"
                class="aiux-btn aiux-btn-sm ${pattern.proposal ? 'aiux-btn-outline' : 'aiux-btn-primary'}"
                ?disabled=${this._busy}
                @click=${() => this._propose(pattern)}
              >
                ${pattern.proposal ? i18n.getMessage('Propose again') : i18n.getMessage('Propose fix')}
              </button>`
            : nothing}
        </div>
        ${this._renderEvidence(pattern)}
        ${run
          ? html`<luxlab-agent-run
              embedded
              .run=${run}
              heading=${i18n.getMessage('Proposing a fix')}
              agent-name=${ANALYST}
              @luxlab-agent-run:update=${e => this._onRun(pattern, e.detail.run)}
            ></luxlab-agent-run>`
          : nothing}
        ${this._renderProposal(pattern)} ${this._renderDecision(pattern, canDecide)}
      </div>
    </li>`;
  }

  render() {
    const data = this._data;
    const patterns = data?.patterns || [];
    const shown = patterns.filter(pattern => this._filter === 'all' || pattern.type === this._filter);
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">${this._error}</div>`
        : nothing}
      ${data ? this._renderHeader(data) : nothing}
      ${data && !patterns.length && !this._refreshing
        ? html`<aiux-empty-state-content
            icon="circle-question-outline"
            heading-text=${data.coverage.pending
              ? i18n.getMessage('Analyse the incidents to find patterns.')
              : i18n.getMessage('No patterns found yet.')}
            .showBodyText=${false}
          ></aiux-empty-state-content>`
        : nothing}
      ${patterns.length
        ? html`${this._renderFilters(patterns)}
            <ul class="flex flex-col gap-4" aria-label=${i18n.getMessage('Response patterns')}>
              ${shown.map(pattern => this._renderPattern(pattern, data.canDecide))}
            </ul>`
        : nothing}
    </div>`;
  }
}
