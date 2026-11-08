// The agents write markdown; knowledge articles and the PIR report draft are HTML fields
export function markdownToHtml(markdown: string): string {
    const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const inline = (text: string) => escape(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    const html: string[] = []
    let list = ''
    const close = () => {
        if (list) html.push(`</${list}>`)
        list = ''
    }
    markdown.split('\n').forEach((raw) => {
        const line = raw.trim()
        const bullet = line.match(/^[-*] (.*)$/)
        const numbered = line.match(/^\d+[.)] (.*)$/)
        if (bullet || numbered) {
            const tag = bullet ? 'ul' : 'ol'
            if (list !== tag) {
                close()
                html.push(`<${tag}>`)
                list = tag
            }
            html.push(`<li>${inline((bullet || numbered)![1])}</li>`)
            return
        }
        close()
        if (!line) return
        const heading = line.match(/^#{1,6}\s+(.*)$/)
        html.push(heading ? `<h3>${inline(heading[1])}</h3>` : `<p>${inline(line)}</p>`)
    })
    close()
    return html.join('\n')
}
