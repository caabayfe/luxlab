import {html, css, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {api} from '../utils/api.js';
import {seconds} from '../utils/format.js';
import './luxlab-markdown.js';
import './luxlab-time.js';

// Step statuses that are not failures: done, or still being worked
const OK_STATUSES = ['success', 'ongoing', 'in_progress', 'pending', 'queued'];
const POLL_MS = 2000;
// Agents normally answer within a minute or two; stop polling a run that looks stuck
const MAX_POLLS = 150;

function stepLabel(type) {
  switch (type) {
    case 'access_verification':
      return i18n.getMessage('Access check');
    case 'gen_ai':
      return i18n.getMessage('Reasoning');
    case 'agent':
      return i18n.getMessage('Agent');
    case 'tool':
      return i18n.getMessage('Tool');
    case 'communicator':
      return i18n.getMessage('Answer');
    default:
      return type;
  }
}

function stepName(step) {
  if (step.type !== 'gen_ai') return step.name;
  return (
    step.actions.filter(action => action !== 'FALLBACK').join(', ') ||
    i18n.getMessage('Preparing the answer')
  );
}

/**
 * Follows a run's execution plan until the agent answers, showing each step as it is written.
 * The run belongs to the parent: every refresh is sent up as `luxlab-agent-run:update` and comes
 * back down through the `run` property.
 */
@customElement('luxlab-agent-run')
export class LuxlabAgentRun extends AIUXElement {
  @property({attribute: false}) run = null;
  @property({type: String}) heading = '';
  @property({type: String, attribute: 'agent-name'}) agentName = '';
  // Inside another card: no own frame or heading
  @property({type: Boolean}) embedded = false;
  @state() _polls = 0;
  @state() _error = '';

  _timer = null;

  static styles = css`
    :host {
      display: block;
    }
  `;

  updated(changed) {
    if (!changed.has('run')) return;
    if (changed.get('run')?.id !== this.run?.id) this._polls = 0;
    this._schedule();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this._timer);
  }

  get _running() {
    return this.run?.state === 'running';
  }

  get _stuck() {
    return this._running && this._polls >= MAX_POLLS;
  }

  _schedule() {
    clearTimeout(this._timer);
    if (!this._running || this._stuck) return;
    this._timer = setTimeout(() => this._poll(), this._polls ? POLL_MS : 0);
  }

  async _poll() {
    const id = this.run.id;
    try {
      const {run} = await api(`/briefing/runs/${id}`);
      this._error = '';
      this._polls += 1;
      if (run && run.id === this.run?.id) {
        this.dispatchEvent(
          new CustomEvent('luxlab-agent-run:update', {
            detail: {run},
            bubbles: true,
            composed: true
          })
        );
      }
    } catch (error) {
      this._error = error.message;
      this._polls += 1;
      this._schedule();
    }
  }

  _status() {
    const run = this.run;
    if (this._running) {
      return this._stuck
        ? i18n.getMessage(
            'Still running. Come back later to see the answer.'
          )
        : i18n.getMessage('Running {0}…', this.agentName);
    }
    return html`${run.state === 'completed'
      ? i18n.getMessage('Answered')
      : i18n.getMessage('Stopped')}
    <luxlab-time value=${run.finishedOn}></luxlab-time>${run.ms
      ? ` · ${seconds(run.ms)}`
      : nothing}`;
  }

  _renderStep(step) {
    const failed = !!step.status && !OK_STATUSES.includes(step.status);
    return html`<li
      class=${classMap({
        'border-l-4 py-2 pl-3': true,
        'border-primary': step.type === 'gen_ai',
        'border-info': step.type === 'tool',
        'border-success': step.type === 'communicator',
        'border-base-300': !['gen_ai', 'tool', 'communicator'].includes(
          step.type
        ),
        'border-error bg-error/5': failed
      })}
    >
      <div class="flex flex-wrap items-baseline gap-2 text-sm">
        <span
          class="font-mono text-xs uppercase tracking-wide text-text-tertiary"
          >${stepLabel(step.type)}</span
        >
        <span class="font-medium text-text-primary break-words"
          >${stepName(step)}</span
        >
        <span class="ml-auto text-xs text-text-tertiary"
          >${failed ? `${step.status} · ` : nothing}${seconds(step.ms)}</span
        >
      </div>
      ${step.thought
        ? html`<p
            class="mt-1 text-sm leading-relaxed text-text-secondary break-words"
          >
            ${step.thought}
          </p>`
        : nothing}
    </li>`;
  }

  _renderBody() {
    const run = this.run;
    return html`
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-warning aiux-alert-soft" role="alert">
            ${i18n.getMessage('Could not refresh the run: {0}', this._error)}
          </div>`
        : nothing}
      ${run.error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            ${run.error}
          </div>`
        : nothing}
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-label=${i18n.getMessage('Steps')}>
          <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            ${i18n.getMessage('Steps')}
          </h4>
          ${run.steps.length
            ? html`<ol class="flex flex-col gap-1">
                ${run.steps.map(step => this._renderStep(step))}
                ${this._running && !this._stuck
                  ? html`<li class="flex items-center gap-2 py-2 pl-3 text-sm text-text-tertiary">
                      <span class="aiux-loading aiux-loading-dots aiux-loading-xs"></span>
                      ${i18n.getMessage('Working…')}
                    </li>`
                  : nothing}
              </ol>`
            : html`<p class="text-sm text-text-tertiary">
                ${this._running
                  ? i18n.getMessage('Waiting for the agent to start…')
                  : i18n.getMessage('No steps were recorded.')}
              </p>`}
        </section>
        <section aria-label=${i18n.getMessage('Answer')}>
          <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            ${i18n.getMessage('Answer')}
          </h4>
          ${run.output
            ? html`<luxlab-markdown .text=${run.output}></luxlab-markdown>`
            : html`<p class="text-sm text-text-tertiary">
                ${this._running
                  ? i18n.getMessage(
                      'The answer appears here when the agent finishes.'
                    )
                  : i18n.getMessage('The agent gave no answer.')}
              </p>`}
        </section>
      </div>
    `;
  }

  render() {
    if (!this.run) return nothing;
    const status = html`<p class="text-sm text-text-secondary" aria-live="polite">
      ${this.agentName} · ${this._status()}
    </p>`;
    if (this.embedded) {
      return html`<div class="mt-3 flex flex-col gap-3 border-t border-base-300 pt-3">
        ${status} ${this._renderBody()}
      </div>`;
    }
    return html`<section
      class="aiux-card bg-base-100 shadow-sm"
      aria-label=${i18n.getMessage('{0} run', this.heading)}
    >
      <div class="aiux-card-body flex flex-col gap-3">
        <div>
          <h3 class="aiux-card-title text-base text-text-primary">
            ${this.heading}
          </h3>
          ${status}
        </div>
        ${this._renderBody()}
      </div>
    </section>`;
  }
}
