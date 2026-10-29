// handles importing scss as modules
declare module '*.scss' {
    const content: string
    export default content
}

interface Window {
    g_ck: string
    CustomEvent: typeof CustomEvent & {
        fireTop?: (name: string, payload: { relativePath: string; title: string }) => void
    }
}
