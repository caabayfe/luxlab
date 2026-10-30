import {html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';

// Agents link to records and lists on this instance; anything that is not http(s) or relative stays text
function safeHref(url) {
  return /^(https?:\/\/|\/)/i.test(url) ? url : null;
}

// Renders **bold** spans
function bold(text) {
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((part, index) =>
      index % 2 ? html`<strong class="font-semibold">${part}</strong>` : part
    );
}

// Renders [label](url) links and **bold**; AI answers only rely on headings, lists, tables, links and bold
function inline(text) {
  const parts = text.split(/\[([^\]]+)\]\(([^)\s]+)\)/g);
  const nodes = [];
  for (let index = 0; index < parts.length; index += 3) {
    nodes.push(...bold(parts[index]));
    if (index + 2 >= parts.length) break;
    const href = safeHref(parts[index + 2]);
    const label = bold(parts[index + 1]);
    nodes.push(
      href
        ? html`<a
            class="aiux-link aiux-link-primary"
            href=${href}
            target="_blank"
            rel="noopener noreferrer"
            >${label}</a
          >`
        : label
    );
  }
  return nodes;
}

function cells(line) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(cell => cell.trim());
}

function renderList(list) {
  const items = list.items.map(item => html`<li>${inline(item)}</li>`);
  return list.ordered
    ? html`<ol class="list-decimal space-y-1 pl-5">${items}</ol>`
    : html`<ul class="list-disc space-y-1 pl-5">${items}</ul>`;
}

function renderTable(rows) {
  const [head, ...body] = rows;
  return html`<div class="overflow-x-auto">
    <table class="aiux-table aiux-table-sm">
      <thead>
        <tr>
          ${head.map(cell => html`<th scope="col">${inline(cell)}</th>`)}
        </tr>
      </thead>
      <tbody>
        ${body.map(
          row => html`<tr>
            ${row.map(cell => html`<td>${inline(cell)}</td>`)}
          </tr>`
        )}
      </tbody>
    </table>
  </div>`;
}

function blocksOf(text) {
  const blocks = [];
  let list = null;
  let table = [];
  const flush = () => {
    if (list) {
      blocks.push(renderList(list));
      list = null;
    }
    if (table.length) {
      blocks.push(renderTable(table));
      table = [];
    }
  };
  (text || '').split('\n').forEach(raw => {
    const line = raw.trim();
    if (/^\|.*\|$/.test(line)) {
      if (list) flush();
      // Skip the |---|---| separator row
      if (!/^\|[\s:|-]+\|$/.test(line)) table.push(cells(line));
      return;
    }
    const bullet = line.match(/^[-*] (.*)$/);
    const numbered = line.match(/^\d+[.)] (.*)$/);
    if (bullet || numbered) {
      const ordered = !!numbered;
      if (table.length || (list && list.ordered !== ordered)) flush();
      if (!list) list = {ordered, items: []};
      list.items.push((bullet || numbered)[1]);
      return;
    }
    flush();
    if (!line) return;
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    blocks.push(
      heading
        ? html`<h4 class="mt-2 text-sm font-semibold text-text-primary">
            ${inline(heading[1])}
          </h4>`
        : html`<p>${inline(line)}</p>`
    );
  });
  flush();
  return blocks;
}

// Markdown rendered as Lit templates, never as HTML strings, so agent output cannot inject markup
@customElement('luxlab-markdown')
export class LuxlabMarkdown extends AIUXElement {
  @property({type: String}) text = '';

  static styles = css`
    :host {
      display: block;
    }
  `;

  render() {
    return html`<div
      class="flex flex-col gap-2 text-sm leading-relaxed text-text-primary break-words"
    >
      ${blocksOf(this.text)}
    </div>`;
  }
}
