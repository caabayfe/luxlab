import React, { ReactNode } from 'react'
import './Markdown.css'

// Agents link to records and lists on this instance; anything that is not http(s) or relative stays text
function safeHref(url: string): string | null {
    return /^(https?:\/\/|\/)/i.test(url) ? url : null
}

// Renders **bold** spans
function bold(text: string, key: string): ReactNode[] {
    return text.split(/\*\*(.+?)\*\*/g).map((part, index) => (index % 2 ? <strong key={`${key}-${index}`}>{part}</strong> : part))
}

// Renders [label](url) links and **bold**; AI answers only rely on headings, lists, tables, links and bold
function inline(text: string): ReactNode[] {
    const parts = text.split(/\[([^\]]+)\]\(([^)\s]+)\)/g)
    const nodes: ReactNode[] = []
    for (let index = 0; index < parts.length; index += 3) {
        nodes.push(...bold(parts[index], `t${index}`))
        if (index + 2 >= parts.length) break
        const href = safeHref(parts[index + 2])
        const label = bold(parts[index + 1], `l${index}`)
        nodes.push(
            href ? (
                <a key={`a${index}`} href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                </a>
            ) : (
                label
            )
        )
    }
    return nodes
}

function cells(line: string): string[] {
    return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
}

export default function Markdown({ text, className }: { text: string; className?: string }) {
    const blocks: ReactNode[] = []
    let list: { ordered: boolean; items: string[] } | null = null
    let table: string[][] = []
    const flush = () => {
        if (list) {
            const items = list.items.map((item, index) => <li key={index}>{inline(item)}</li>)
            blocks.push(list.ordered ? <ol key={blocks.length}>{items}</ol> : <ul key={blocks.length}>{items}</ul>)
            list = null
        }
        if (table.length) {
            const [head, ...rows] = table
            blocks.push(
                <div key={blocks.length} className="lux-markdown__table">
                    <table>
                        <thead>
                            <tr>{head.map((cell, index) => <th key={index}>{inline(cell)}</th>)}</tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex}>{row.map((cell, index) => <td key={index}>{inline(cell)}</td>)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            table = []
        }
    }
    text.split('\n').forEach((raw) => {
        const line = raw.trim()
        if (/^\|.*\|$/.test(line)) {
            if (list) flush()
            // Skip the |---|---| separator row
            if (!/^\|[\s:|-]+\|$/.test(line)) table.push(cells(line))
            return
        }
        const bullet = line.match(/^[-*] (.*)$/)
        const numbered = line.match(/^\d+[.)] (.*)$/)
        if (bullet || numbered) {
            const ordered = !!numbered
            if (table.length || (list && list.ordered !== ordered)) flush()
            if (!list) list = { ordered, items: [] }
            list.items.push((bullet || numbered)![1])
            return
        }
        flush()
        if (!line) return
        const heading = line.match(/^#{1,6}\s+(.*)$/)
        blocks.push(heading ? <h4 key={blocks.length}>{inline(heading[1])}</h4> : <p key={blocks.length}>{inline(line)}</p>)
    })
    flush()
    return <div className={className ? `lux-markdown ${className}` : 'lux-markdown'}>{blocks}</div>
}
