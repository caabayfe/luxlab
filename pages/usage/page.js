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
  return new Intl.NumberFormat().format(value);
}

// 57300 -> 57.3k: token counts are only read as orders of magnitude
function compact(value) {
  return new Intl.NumberFormat(undefined, {notation: 'compact', maximumFractionDigits: 1}).format(
    value
  );
}

// Rates are typed with either decimal separator
function decimal(value) {
  return Number(String(value).trim().replace(',', '.'));
}

function rateValue(rate) {
  return rate === null || rate === undefined ? '' : String(rate);
}

@customElement('x-everi-luxlab-usage-page')
@title('AI Usage')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class UsagePage extends AIUXElement {
  @state() _usage = null;
  @state() _error = '';
  @state() _agentRate = '';
  @state() _skillRate = '';
  @state() _saving = false;
  @state() _notice = '';

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
      this._setUsage(this.loaderData?.usage || null);
      this._error = this.loaderData?.error || '';
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('AI Usage'));
  }

  _setUsage(usage) {
    this._usage = usage;
    this._agentRate = rateValue(usage?.rates.agent);
    this._skillRate = rateValue(usage?.rates.skill);
  }

  async _saveRates(e) {
    e.preventDefault();
    try {
      this._saving = true;
      this._error = '';
      this._notice = '';
      await api('/usage/rates', {
        method: 'POST',
        body: {agent: decimal(this._agentRate), skill: decimal(this._skillRate)}
      });
      const {usage} = await api(`/usage?${new URLSearchParams({days: String(this._usage.days)})}`);
      this._setUsage(usage);
      this._notice = i18n.getMessage('Assist rates saved.');
    } catch (error) {
      this._error = error.message || 'Unknown error';
    } finally {
      this._saving = false;
    }
  }

  _renderStat(label, value) {
    return html`<div class="flex flex-col rounded-box bg-base-200 px-4 py-2">
      <span class="text-xl font-semibold text-text-primary">${value}</span>
      <span class="text-xs text-text-tertiary">${label}</span>
    </div>`;
  }

  _renderHeader(usage) {
    const runs = usage.rows.reduce((sum, row) => sum + row.runs, 0);
    const calls = usage.rows.reduce((sum, row) => sum + row.llmCalls, 0);
    const tokens = usage.rows.reduce((sum, row) => sum + row.inputTokens + row.outputTokens, 0);
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-title">
      <div class="aiux-card-body gap-4">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex max-w-3xl flex-col gap-1">
            <h1 id="usage-title" class="text-2xl font-bold text-text-primary">
              ${i18n.getMessage('AI usage')}
            </h1>
            <p class="text-sm text-text-tertiary">
              ${i18n.getMessage(
                'What the LuxLab AI features use: agent and skill runs, the LLM calls they make and their tokens, read from the platform\'s generative AI log. Replays, response patterns and the cockpit use no AI.'
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
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          ${this._renderStat(i18n.getMessage('AI runs'), number(runs))}
          ${this._renderStat(i18n.getMessage('LLM calls'), number(calls))}
          ${this._renderStat(i18n.getMessage('Tokens'), compact(tokens))}
          ${this._renderStat(
            i18n.getMessage('Estimated assists per month'),
            usage.monthlyAssists === null ? i18n.getMessage('Set the rates') : number(usage.monthlyAssists)
          )}
        </div>
      </div>
    </section>`;
  }

  _renderRow(row) {
    const perRun = row.runs ? (row.inputTokens + row.outputTokens) / row.runs : 0;
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
      </td>
      <td class="text-right">
        ${number(row.llmCalls)}
        ${row.runs
          ? html`<span class="block text-xs text-text-tertiary"
              >${i18n.getMessage('{0} per run', (row.llmCalls / row.runs).toFixed(1))}</span
            >`
          : nothing}
      </td>
      <td class="text-right">
        ${compact(row.inputTokens)} / ${compact(row.outputTokens)}
        <span class="block text-xs text-text-tertiary"
          >${i18n.getMessage('{0} per run', compact(perRun))}</span
        >
      </td>
      <td class="text-right">
        ${row.estimatedAssists === null ? '—' : number(row.estimatedAssists)}
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
                <th class="text-right">${i18n.getMessage('LLM calls')}</th>
                <th class="text-right">${i18n.getMessage('Tokens in / out')}</th>
                <th class="text-right">${i18n.getMessage('Estimated assists')}</th>
              </tr>
            </thead>
            <tbody>
              ${usage.rows.map(row => this._renderRow(row))}
            </tbody>
          </table>
        </div>
      </div>
    </section>`;
  }

  _renderRates(usage) {
    const editable = usage.canSetRates;
    return html`<section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="usage-rates">
      <form class="aiux-card-body gap-3" @submit=${this._saveRates}>
        <div class="flex flex-col gap-1">
          <h2 id="usage-rates" class="text-lg font-semibold text-text-primary">
            ${i18n.getMessage('Assist rates')}
          </h2>
          <p class="max-w-3xl text-sm text-text-tertiary">
            ${i18n.getMessage(
              'Assists are what Now Assist bills. Take the assists per AI agent run and per skill run from the rate card in your ServiceNow contract; the estimates are runs times rate. Only a licensed production instance reports actual assists.'
            )}
          </p>
        </div>
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex flex-col gap-1 text-sm">
            <span class="text-text-secondary">${i18n.getMessage('Assists per agent run')}</span>
            <input
              class="aiux-input aiux-input-sm w-40"
              type="text"
              inputmode="decimal"
              pattern="[0-9]+([.,][0-9]+)?"
              required
              ?disabled=${!editable || this._saving}
              .value=${this._agentRate}
              @input=${e => (this._agentRate = e.target.value)}
            />
          </label>
          <label class="flex flex-col gap-1 text-sm">
            <span class="text-text-secondary">${i18n.getMessage('Assists per skill run')}</span>
            <input
              class="aiux-input aiux-input-sm w-40"
              type="text"
              inputmode="decimal"
              pattern="[0-9]+([.,][0-9]+)?"
              required
              ?disabled=${!editable || this._saving}
              .value=${this._skillRate}
              @input=${e => (this._skillRate = e.target.value)}
            />
          </label>
          ${editable
            ? html`<button type="submit" class="aiux-btn aiux-btn-sm aiux-btn-primary" ?disabled=${this._saving}>
                ${this._saving
                  ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>`
                  : nothing}
                ${i18n.getMessage('Save rates')}
              </button>`
            : html`<p class="text-xs text-text-tertiary">
                ${i18n.getMessage('Only LuxLab managers can change the rates.')}
              </p>`}
        </div>
      </form>
    </section>`;
  }

  render() {
    const usage = this._usage;
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">${this._error}</div>`
        : nothing}
      ${this._notice
        ? html`<div class="aiux-alert aiux-alert-success aiux-alert-soft" role="status">${this._notice}</div>`
        : nothing}
      ${usage
        ? html`${this._renderHeader(usage)} ${this._renderTable(usage)} ${this._renderRates(usage)}`
        : nothing}
    </div>`;
  }
}
