import type { DocsKitConfig } from '@humanspeak/docs-kit'

export const docsConfig: DocsKitConfig = {
    name: 'Svelte JSON View Lite',
    slug: 'jsonview',
    npmPackage: '@humanspeak/svelte-json-view-lite',
    repo: 'humanspeak/svelte-json-view-lite',
    url: 'https://jsonview.svelte.page',
    description:
        'Fast, tiny JSON tree viewer for Svelte 5 with runes, SSR-safe ARIA tree semantics, per-type snippet overrides, CSS-variable theming, a migration-friendly API, and zero runtime dependencies.',
    keywords: [
        'svelte',
        'svelte5',
        'sveltekit',
        'json',
        'json-view',
        'json-tree',
        'json-inspector',
        'json-viewer',
        'viewer',
        'tree',
        'runes',
        'typescript',
        'lite',
        'accessibility',
        'svelte-snippets'
    ],
    defaultFeatures: [
        'Svelte 5 Runes',
        'Per-type Snippet Overrides',
        'CSS-Variable Theming',
        'WAI-ARIA Treeview',
        'Zero Dependencies',
        'React API Parity'
    ],
    fallbackStars: 0
}
