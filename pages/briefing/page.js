import {html, css, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {AIUXElement, decorators} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {api} from '../../utils/api.js';
import {setDocumentTitle} from '../../utils/document-title.js';
import '../../components/luxlab-agent-run.js';
import '../../components/luxlab-time.js';

const {acl, title} = decorators;

// Each tool runs an AI agent; today's latest run is kept, so reopening a tool costs no new agent run
@customElement('x-everi-luxlab-briefing-page')
@title('Daily Briefing')
@acl([{roles: ['x_everi_luxlab.user']}])
export default class BriefingPage extends AIUXElement {
  @state() _tools = null;
  @state() _selected = null;
  @state() _starting = null;
  @state() _error = '';

  _prevLoaderData = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  static async loader() {
    try {
      const {tools} = await api('/briefing/tools');
      return {tools, error: ''};
    } catch (error) {
      return {tools: null, error: error.message || 'Unknown error'};
    }
  }

  willUpdate() {
    if (this.loaderData !== this._prevLoaderData) {
      this._prevLoaderData = this.loaderData;
      this._tools = this.loaderData?.tools || null;
      this._error = this.loaderData?.error || '';
    }
  }

  firstUpdated() {
    setDocumentTitle(i18n.getMessage('Daily Briefing'));
  }

  _updateRun(run) {
    this._tools = this._tools?.map(tool =>
      tool.id === run.tool ? {...tool, lastRun: run} : tool
    );
  }

  async _start(tool) {
    try {
      this._starting = tool.id;
      this._error = '';
      const {run} = await api(`/briefing/tools/${tool.id}/run`, {method: 'POST'});
      this._updateRun(run);
      this._selected = tool.id;
    } catch (error) {
      this._error = error.message || 'Unknown error';
    } finally {
      this._starting = null;
    }
  }

  // Runs listed with the tools carry no steps; load the full trace when one is opened
  async _open(tool) {
    this._selected = tool.id;
    const run = tool.lastRun;
    if (!run || run.steps.length || run.state === 'running') return;
    try {
      const {run: traced} = await api(`/briefing/runs/${run.id}`);
      this._updateRun(traced);
    } catch (error) {
      this._error = error.message || 'Unknown error';
    }
  }

  _runLabel(run) {
    if (!run) return i18n.getMessage('Not run today');
    if (run.state === 'running') return i18n.getMessage('Running…');
    return html`${run.state === 'completed'
        ? i18n.getMessage('Answered')
        : i18n.getMessage('Failed')}
      <luxlab-time value=${run.finishedOn || run.startedOn}></luxlab-time>`;
  }

  _renderTool(tool) {
    const run = tool.lastRun;
    const busy = this._starting === tool.id || run?.state === 'running';
    const selected = tool.id === this._selected;
    return html`<li
      class=${classMap({
        'aiux-card bg-base-100 shadow-sm border-2': true,
        'border-primary': selected,
        'border-transparent': !selected
      })}
    >
      <div class="aiux-card-body gap-2 p-4">
        <button
          type="button"
          class="flex flex-col gap-1 text-left disabled:cursor-default"
          ?disabled=${!run}
          aria-pressed=${selected ? 'true' : 'false'}
          @click=${() => this._open(tool)}
        >
          <h3 class="text-sm font-semibold text-text-primary">${tool.name}</h3>
          <p class="text-sm text-text-secondary">${tool.description}</p>
          <p
            class=${classMap({
              'text-xs': true,
              'text-success': run?.state === 'completed',
              'text-error': run?.state === 'failed',
              'text-primary': run?.state === 'running',
              'text-text-tertiary': !run
            })}
          >
            ${this._runLabel(run)}
          </p>
        </button>
        <div class="mt-auto flex items-center justify-between gap-2 pt-2">
          <span class="text-xs text-text-tertiary">${tool.agentName}</span>
          <button
            type="button"
            class=${classMap({
              'aiux-btn aiux-btn-sm': true,
              'aiux-btn-primary': !run,
              'aiux-btn-outline': !!run
            })}
            ?disabled=${busy}
            @click=${() => this._start(tool)}
          >
            ${this._starting === tool.id
              ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
                  ${i18n.getMessage('Starting…')}`
              : run
                ? i18n.getMessage('Run again')
                : i18n.getMessage('Run')}
          </button>
        </div>
      </div>
    </li>`;
  }

  render() {
    const current = this._tools?.find(tool => tool.id === this._selected);
    return html`<div class="mx-auto flex max-w-7xl flex-col gap-6 p-4 lg:p-8">
      <header>
        <h1 class="text-2xl font-bold text-text-primary">
          ${i18n.getMessage('Daily briefing')}
        </h1>
        <p class="max-w-3xl text-sm text-text-tertiary">
          ${i18n.getMessage(
            "Each tool runs a ServiceNow AI agent on your work. You see its steps live, and today's answer is kept until you run it again."
          )}
        </p>
      </header>
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            ${this._error}
          </div>`
        : nothing}
      ${this._tools
        ? html`<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            ${this._tools.map(tool => this._renderTool(tool))}
          </ul>`
        : nothing}
      ${current?.lastRun
        ? html`<luxlab-agent-run
            .run=${current.lastRun}
            heading=${current.name}
            agent-name=${current.agentName}
            @luxlab-agent-run:update=${e => this._updateRun(e.detail.run)}
          ></luxlab-agent-run>`
        : nothing}
    </div>`;
  }
}
