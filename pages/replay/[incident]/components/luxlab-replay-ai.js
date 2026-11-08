import {html, css, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {api, recordUrl} from '../../../../utils/api.js';
import '../../../../components/luxlab-agent-run.js';
import '../../../../components/luxlab-markdown.js';
import '../../../../components/luxlab-time.js';

const ANALYST = 'LuxLab Replay Analyst';

function typeLabel(type) {
  switch (type) {
    case 'problem':
      return i18n.getMessage('Problem');
    case 'knowledge':
      return i18n.getMessage('Knowledge');
    default:
      return i18n.getMessage('Action');
  }
}

function approveLabel(type) {
  switch (type) {
    case 'problem':
      return i18n.getMessage('Approve and raise problem');
    case 'knowledge':
      return i18n.getMessage('Approve and draft article');
    default:
      return i18n.getMessage('Approve');
  }
}

/**
 * Blameless review and follow-ups for one replay. Both run on the LuxLab Replay Analyst agent,
 * whose steps stream in through luxlab-agent-run; the replay itself belongs to the page and every
 * change is sent up as `luxlab-replay:change`.
 */
@customElement('luxlab-replay-ai')
export class LuxlabReplayAi extends AIUXElement {
  @property({attribute: false}) replay = null;
  @state() _runs = {};
  @state() _deciding = false;
  @state() _error = '';

  static styles = css`
    :host {
      display: block;
    }
  `;

  get _busy() {
    return (
      this._deciding ||
      Object.values(this._runs).some(run => run?.state === 'running')
    );
  }

  _emit(replay) {
    this.dispatchEvent(
      new CustomEvent('luxlab-replay:change', {
        detail: {replay},
        bubbles: true,
        composed: true
      })
    );
  }

  async _analyse(kind) {
    try {
      this._error = '';
      this._runs = {...this._runs, [kind]: undefined};
      const {run} = await api(
        `/replay/${this.replay.incident.sysId}/agent/${kind}`,
        {method: 'POST'}
      );
      this._runs = {...this._runs, [kind]: run};
    } catch (error) {
      this._error = error.message || 'Unknown error';
    }
  }

  // When the agent finishes, its tools have saved the result on the replay
  async _onRun(kind, run) {
    this._runs = {...this._runs, [kind]: run};
    if (run.state === 'running') return;
    try {
      const {replay} = await api(`/replay/${this.replay.incident.sysId}`);
      if (replay) this._emit(replay);
    } catch (error) {
      this._error = error.message || 'Unknown error';
    }
  }

  async _decide(followUp, decision) {
    try {
      this._deciding = true;
      this._error = '';
      const {replay} = await api(
        `/replay/${this.replay.incident.sysId}/follow-ups/${followUp.sysId}`,
        {method: 'POST', body: {decision}}
      );
      this._emit(replay);
    } catch (error) {
      this._error = error.message || 'Unknown error';
    } finally {
      this._deciding = false;
    }
  }

  _renderRun(kind, heading) {
    const run = this._runs[kind];
    if (!run) return nothing;
    return html`<luxlab-agent-run
      embedded
      .run=${run}
      heading=${heading}
      agent-name=${ANALYST}
      @luxlab-agent-run:update=${e => this._onRun(kind, e.detail.run)}
    ></luxlab-agent-run>`;
  }

  _renderDecision(followUp) {
    return html`<p class="text-xs text-text-tertiary">
      ${i18n.getMessage('Approved by {0}', followUp.decidedBy)} ·
      <luxlab-time value=${followUp.decidedOn}></luxlab-time>
      ${followUp.problem
        ? html` ·
            <a
              class="aiux-link aiux-link-primary"
              href=${recordUrl('problem', followUp.problem.sysId)}
              target="_blank"
              rel="noopener noreferrer"
              >${followUp.problem.number}</a
            >`
        : nothing}
      ${followUp.knowledge
        ? html` · ${i18n.getMessage('draft article')}
            <a
              class="aiux-link aiux-link-primary"
              href=${recordUrl('kb_knowledge', followUp.knowledge.sysId)}
              target="_blank"
              rel="noopener noreferrer"
              >${followUp.knowledge.number}</a
            >`
        : nothing}
    </p>`;
  }

  _renderFollowUp(followUp) {
    const approved = followUp.state === 'approved';
    return html`<li
      class=${classMap({
        'flex flex-col gap-2 rounded-box border p-3': true,
        'border-success bg-success/5': approved,
        'border-base-300': !approved
      })}
    >
      <div class="flex flex-wrap items-center gap-2">
        <span class="aiux-badge aiux-badge-sm aiux-badge-soft aiux-badge-primary"
          >${typeLabel(followUp.type)}</span
        >
        <strong class="text-sm font-semibold text-text-primary break-words"
          >${followUp.title}</strong
        >
      </div>
      ${followUp.description
        ? html`<p class="text-sm text-text-secondary break-words">
            ${followUp.description}
          </p>`
        : nothing}
      ${followUp.rationale
        ? html`<p class="text-xs text-text-tertiary break-words">
            ${i18n.getMessage('Why: {0}', followUp.rationale)}
          </p>`
        : nothing}
      ${followUp.article && !followUp.knowledge
        ? html`<details class="rounded-box bg-base-200 p-2">
            <summary class="cursor-pointer text-sm font-medium text-text-primary">
              ${approved
                ? i18n.getMessage('Draft article')
                : i18n.getMessage('Draft article, created in draft when approved')}
            </summary>
            <div class="pt-2">
              <luxlab-markdown .text=${followUp.article}></luxlab-markdown>
            </div>
          </details>`
        : nothing}
      ${approved
        ? this._renderDecision(followUp)
        : this.replay.canDecide
          ? html`<div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="aiux-btn aiux-btn-primary aiux-btn-sm"
                ?disabled=${this._busy}
                @click=${() => this._decide(followUp, 'approve')}
              >
                ${approveLabel(followUp.type)}
              </button>
              <button
                type="button"
                class="aiux-btn aiux-btn-ghost aiux-btn-sm"
                ?disabled=${this._busy}
                @click=${() => this._decide(followUp, 'dismiss')}
              >
                ${i18n.getMessage('Dismiss')}
              </button>
            </div>`
          : nothing}
    </li>`;
  }

  _renderButton(kind, label, busyLabel, primary) {
    const running = this._runs[kind]?.state === 'running';
    return html`<button
      type="button"
      class="aiux-btn aiux-btn-sm ${primary ? 'aiux-btn-primary' : 'aiux-btn-outline'}"
      ?disabled=${this._busy}
      @click=${() => this._analyse(kind)}
    >
      ${running
        ? html`<span class="aiux-loading aiux-loading-spinner aiux-loading-xs"></span>
            ${busyLabel}`
        : label}
    </button>`;
  }

  render() {
    const replay = this.replay;
    if (!replay) return nothing;
    const proposed = replay.followUps.filter(f => f.state === 'proposed').length;
    const reviewRunning = this._runs.review?.state === 'running';
    return html`<div class="flex flex-col gap-6">
      ${this._error
        ? html`<div class="aiux-alert aiux-alert-error aiux-alert-soft" role="alert">
            ${this._error}
          </div>`
        : nothing}
      <section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="review-title">
        <div class="aiux-card-body gap-3">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 id="review-title" class="aiux-card-title text-base text-text-primary">
                ${i18n.getMessage('Incident review')}
              </h2>
              <p class="text-sm text-text-tertiary">
                ${replay.reviewedOn
                  ? html`${i18n.getMessage('Written by Replay AI')}
                      <luxlab-time value=${replay.reviewedOn}></luxlab-time>`
                  : i18n.getMessage(
                      'Written by Replay AI from this timeline, without naming people'
                    )}
              </p>
            </div>
            ${this._renderButton(
              'review',
              replay.review
                ? i18n.getMessage('Rewrite review')
                : i18n.getMessage('Write review'),
              i18n.getMessage('Writing…'),
              !replay.review
            )}
          </div>
          ${this._renderRun('review', i18n.getMessage('Blameless review'))}
          ${replay.review && !reviewRunning
            ? html`<luxlab-markdown .text=${replay.review}></luxlab-markdown>`
            : nothing}
        </div>
      </section>
      <section class="aiux-card bg-base-100 shadow-sm" aria-labelledby="follow-ups-title">
        <div class="aiux-card-body gap-3">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 id="follow-ups-title" class="aiux-card-title text-base text-text-primary">
                ${i18n.getMessage('Follow-ups')}
              </h2>
              <p class="text-sm text-text-tertiary">
                ${replay.followUpsOn
                  ? html`${i18n.getMessage('{0} awaiting a manager · suggested', proposed)}
                      <luxlab-time value=${replay.followUpsOn}></luxlab-time>`
                  : i18n.getMessage(
                      'Problems, knowledge and actions proposed by Replay AI, approved by a LuxLab manager'
                    )}
              </p>
            </div>
            ${this._renderButton(
              'follow-ups',
              replay.followUpsOn
                ? i18n.getMessage('Suggest again')
                : i18n.getMessage('Suggest follow-ups'),
              i18n.getMessage('Thinking…'),
              !replay.followUpsOn
            )}
          </div>
          ${this._renderRun('follow-ups', i18n.getMessage('Follow-ups'))}
          ${replay.followUps.length
            ? html`<ul class="flex flex-col gap-3">
                ${replay.followUps.map(followUp => this._renderFollowUp(followUp))}
              </ul>`
            : nothing}
        </div>
      </section>
    </div>`;
  }
}
