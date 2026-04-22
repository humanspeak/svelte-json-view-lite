import type { DocsKitConfig } from '@humanspeak/docs-kit'

export const docsConfig: DocsKitConfig = {
    name: 'Svelte JSON View Lite',
    slug: 'jsonview',
    npmPackage: '@humanspeak/svelte-json-view-lite',
    repo: 'humanspeak/svelte-json-view-lite',
    url: 'https://jsonview.svelte.page',
    description:
        'Fast, tiny JSON tree viewer for Svelte 5 — port of react-json-view-lite with runes, SSR, per-type Snippet overrides, CSS-variable theming, and zero runtime dependencies.',
    keywords: [
        'svelte',
        'svelte5',
        'sveltekit',
        'json',
        'json-view',
        'json-tree',
        'viewer',
        'tree',
        'runes',
        'typescript',
        'lite'
    ],
    defaultFeatures: [
        'Svelte 5 Runes',
        'Per-type Snippet Overrides',
        'CSS-Variable Theming',
        'WAI-ARIA Treeview'
    ],
    fallbackStars: 0
}
