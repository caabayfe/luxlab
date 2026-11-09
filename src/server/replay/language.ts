import { GlideRecordSecure } from '@servicenow/glide'

// Common words that rarely appear in the other languages; enough to tell apart a one-line short description
const STOPWORDS: { [language: string]: string[] } = {
    Spanish: ['el', 'la', 'los', 'las', 'del', 'de', 'que', 'por', 'para', 'con', 'una', 'un', 'se', 'al', 'y', 'es', 'está', 'están', 'llegan', 'funciona', 'sin', 'desde', 'usuarios', 'acceso', 'caído', 'lento'],
    English: ['the', 'of', 'and', 'to', 'is', 'are', 'not', 'for', 'with', 'from', 'users', 'cannot', "can't", 'unable', 'down', 'slow', 'failing', 'working', 'access'],
    Portuguese: ['os', 'as', 'do', 'da', 'dos', 'das', 'não', 'em', 'um', 'uma', 'com', 'está', 'estão', 'usuários', 'acesso', 'lento'],
    French: ['le', 'les', 'des', 'du', 'et', 'est', 'sont', 'pas', 'pour', 'avec', 'une', 'utilisateurs', 'accès', 'lent'],
    Italian: ['il', 'gli', 'della', 'delle', 'che', 'non', 'per', 'con', 'una', 'sono', 'utenti', 'accesso', 'lento'],
    German: ['der', 'die', 'das', 'und', 'ist', 'sind', 'nicht', 'für', 'mit', 'ein', 'eine', 'benutzer', 'zugriff', 'langsam'],
}

// sys_user.preferred_language codes, used when the text gives no clear answer
const LANGUAGE_CODES: { [code: string]: string } = {
    es: 'Spanish',
    en: 'English',
    pt: 'Portuguese',
    pb: 'Portuguese',
    fr: 'French',
    it: 'Italian',
    de: 'German',
}

const DEFAULT_LANGUAGE = 'English'

function textLanguage(text: string): string {
    // Latin-1 letters cover the accents of these languages; the platform's engine has no Unicode property escapes
    const words = text.toLowerCase().match(/[a-zß-öø-ÿ']+/g) || []
    const scores: { [language: string]: number } = {}
    Object.keys(STOPWORDS).forEach((language) => {
        const list = STOPWORDS[language]
        scores[language] = words.filter((word) => list.indexOf(word) >= 0).length
    })
    // ñ, ¿ and ¡ only occur in Spanish
    if (/[ñ¿¡]/.test(text)) scores.Spanish += 2
    const ranked = Object.keys(scores).sort((a, b) => scores[b] - scores[a])
    return scores[ranked[0]] > 0 && scores[ranked[0]] > scores[ranked[1]] ? ranked[0] : ''
}

// The language customers were written to: the incident's own text first, then the caller's preferred language
export function incidentLanguage(incident: GlideRecordSecure<'incident'>): string {
    const detected = textLanguage(`${incident.getValue('short_description') || ''} ${incident.getValue('description') || ''}`)
    if (detected) return detected
    const code = String(incident.getValue('caller_id.preferred_language' as any) || '').toLowerCase()
    return LANGUAGE_CODES[code.substring(0, 2)] || DEFAULT_LANGUAGE
}
