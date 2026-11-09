import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {navigate} from '@servicenow/aiux/aiux-client';
import '@servicenow/aiux/aiux-components-empty-state-content';
import {api} from '../../utils/api.js';
import {setDocumentTitle} from '../../utils/document-title.js';

const {acl, title} = decorators;

const PERIODS = [7, 30, 90];

function number(value) {
  return new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}).format(value);
}

@customElement('x-everi-luxlab-usage-page')
@title('AI Usage')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class UsagePage extends AIUXElement {
  @state() _usage = null;
  @state() _error = '';

  _prevLoaderData = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  static async loader(ctx) {
    const days = ctx.query?.days || '30';
    try {
      const {usage} = await api(`/usage?${new URLSearchParams({days})}`);
      return {usage, error: ''};
    } catch (error) {
      return {usage: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._usage = this.loaderData?.usage || null;
      this._error = this.loaderData?.error || '';
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('AI Usage'));
  }

  _renderStat(label, value) {
    return html`<div class="flex flex-col rounded-box bg-base-200 px-4 py-2">
      <span class="text-xl font-semibold text-text-primary">${value}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  _renderHeader(usage) {
    const runs = usage.rows.reduce((sum, row) => sum + row.runs, 0);
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-title">
      <div class="aiux-card-body gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex max-w-3xl flex-col gap-1">
            <h1 id="usage-title" class="text-2xl font-bold text-text-primary">
              ${i18n.getMessage('AI usage')}
            </h1>
            <p class="text-sm text-text-tertiary">
              ${i18n.getMessage(
                'The assists the platform metered for each LuxLab AI feature, read from its Now Assist usage log. Replays, response patterns, the live coach clocks and the cockpit use no AI.'
              )}
            </p>
          </div>
          <div role="tablist" class="aiux-tabs aiux-tabs-box" aria-label=${i18n.getMessage('Period')}>
            ${PERIODS.map(
              days => html`<button
                type="button"
                role="tab"
                class="aiux-tab ${usage.days === days ? 'aiux-tab-active' : ''}"
                aria-selected=${usage.days === days}
                @click=${() => navigate('/usage', {query: {days: String(days)}})}
              >
                ${i18n.getMessage('{0} days', String(days))}
              </button>`
            )}
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          ${this._renderStat(i18n.getMessage('AI runs'), number(runs))}
          ${this._renderStat(
            i18n.getMessage('Assists in the last {0} days', String(usage.days)),
            number(usage.assists)
          )}
          ${this._renderStat(i18n.getMessage('Assists per month at this pace'), number(usage.monthlyAssists))}
        </div>
        ${usage.trialAssists
          ? html`<p class="text-xs text-text-tertiary">
              ${i18n.getMessage(
                '{0} of these assists were counted against a trial allowance rather than the licence.',
                number(usage.trialAssists)
              )}
            </p>`
          : nothing}
      </div>
    </section>`;
  }

  _renderActions(row, smallMax) {
    if (row.kind !== 'agent') return html`<span class="text-text-tertiary">—</span>`;
    const overSmall = row.maxToolActions > smallMax;
    return html`${i18n.getMessage('up to {0}', String(row.maxToolActions))}
      <span class="block text-xs ${overSmall ? 'text-warning' : 'text-text-tertiary'}"
        >${overSmall
          ? i18n.getMessage('above the Small tier')
          : i18n.getMessage('Small tier')}</span
      >`;
  }

  _renderRow(row, smallMax) {
    const unmetered = row.runs - row.metered;
    return html`<tr>
      <td>${row.feature}</td>
      <td>
        <span class="flex flex-col">
          <span class="text-text-primary">${row.name}</span>
          <span class="text-xs text-text-tertiary"
            >${row.kind === 'agent' ? i18n.getMessage('AI agent') : i18n.getMessage('Now Assist skill')}</span
          >
        </span>
      </td>
      <td class="text-right">
        ${number(row.runs)}
        ${row.failed
          ? html`<span class="block text-xs text-text-tertiary"
              >${i18n.getMessage('{0} failed', String(row.failed))}</span
            >`
          : nothing}
        ${unmetered
          ? html`<span class="block text-xs text-text-tertiary"
              >${i18n.getMessage('{0} not metered', String(unmetered))}</span
            >`
          : nothing}
      </td>
      <td class="text-right">${this._renderActions(row, smallMax)}</td>
      <td class="text-right">
        ${number(row.assists)}
        ${row.metered
          ? html`<span class="block text-xs text-text-tertiary"
              >${i18n.getMessage('{0} per run', number(row.assists / row.metered))}</span
            >`
          : nothing}
      </td>
    </tr>`;
  }

  _renderTable(usage) {
    if (!usage.rows.length) {
      return html`<aiux-empty-state-content
        icon="circle-question-outline"
        heading-text=${i18n.getMessage('No AI runs in this period.')}
        .showBodyText=${false}
      ></aiux-empty-state-content>`;
    }
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-features">
      <div class="aiux-card-body gap-3">
        <h2 id="usage-features" class="text-lg font-semibold text-text-primary">
          ${i18n.getMessage('By feature')}
        </h2>
        <div class="overflow-x-auto">
          <table class="aiux-table aiux-table-sm">
            <thead>
              <tr>
                <th>${i18n.getMessage('Feature')}</th>
                <th>${i18n.getMessage('Run')}</th>
                <th class="text-right">${i18n.getMessage('Runs')}</th>
                <th class="text-right">${i18n.getMessage('Tool actions per run')}</th>
                <th class="text-right">${i18n.getMessage('Assists')}</th>
              </tr>
            </thead>
            <tbody>
              ${usage.rows.map(row => this._renderRow(row, usage.smallMaxActions))}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
  }

  // Skills only run once an admin activates them in Now Assist Admin, which a fresh install does not do
  _renderSkills(skills) {
    if (!skills?.length) return nothing;
    const inactive = skills.filter(skill => !skill.active).length;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-skills">
      <div class="aiux-card-body gap-3">
        <div class="flex flex-col gap-1">
          <h2 id="usage-skills" class="text-lg font-semibold text-text-primary">
            ${i18n.getMessage('Skill activation')}
          </h2>
          <p class="text-sm text-text-tertiary">
            ${inactive
              ? i18n.getMessage(
                  '{0} of the LuxLab skills are not activated, so the buttons that use them fail until an admin activates them in Now Assist Admin.',
                  String(inactive)
                )
              : i18n.getMessage('All LuxLab skills are activated.')}
          </p>
        </div>
        <ul class="flex flex-col divide-y divide-base-200">
          ${skills.map(
            skill => html`<li class="flex flex-wrap items-center gap-3 py-2">
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="text-sm text-text-primary">${skill.name}</span>
                <span class="text-xs text-text-tertiary">${skill.feature}</span>
              </span>
              ${skill.active
                ? html`<span class="aiux-badge aiux-badge-sm aiux-badge-success aiux-badge-soft"
                    >${i18n.getMessage('Active')}</span
                  >`
                : html`<span class="aiux-badge aiux-badge-sm aiux-badge-warning aiux-badge-soft"
                      >${i18n.getMessage('Not activated')}</span
                    >
                    <a class="aiux-link text-sm" href=${skill.setupPath} target="_blank" rel="noopener"
                      >${i18n.getMessage('Activate in Now Assist Admin')}</a
                    >`}
            </li>`
          )}
        </ul>
      </div>
    </section>`;
  }

  _renderHowCounted() {
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-how">
      <div class="aiux-card-body gap-2">
        <h2 id="usage-how" class="text-lg font-semibold text-text-primary">
          ${i18n.getMessage('How assists are counted')}
        </h2>
        <ul class="flex max-w-3xl list-disc flex-col gap-1 pl-5 text-sm text-text-secondary">
          <li>
            ${i18n.getMessage(
              'A skill run costs a fixed number of assists set for that skill, whatever the prompt or answer length.'
            )}
          </li>
          <li>
            ${i18n.getMessage(
              'An AI agent run is billed by its tool actions: up to 4 is Small (25 assists), 5 to 8 Medium (50), 9 to 20 Large (150). Orchestrator and answer steps do not count, and LLM calls and tokens do not change the price.'
            )}
          </li>
          <li>
            ${i18n.getMessage(
              'Sub-production instances and AI Agent Studio tests consume assists too.'
            )}
          </li>
        </ul>
      </div>
    </section>`;
  }

  render() {
    const usage = this._usage;
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">${this._error}</div>`
        : nothing}
      ${usage
        ? html`${this._renderHeader(usage)} ${this._renderTable(usage)} ${this._renderSkills(usage.skills)}
          ${this._renderHowCounted()}`
        : nothing}
    </div>`;
  }
}
