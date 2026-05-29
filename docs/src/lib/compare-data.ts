import type { ComparisonOurs, Competitor } from '@humanspeak/docs-kit'

export type { ComparisonFeature, ComparisonOurs, Competitor } from '@humanspeak/docs-kit'

export const ours: ComparisonOurs = {
    name: 'Svelte JSON View Lite',
    npmPackage: '@humanspeak/svelte-json-view-lite',
    slug: 'svelte-json-view-lite',
    url: 'https://jsonview.svelte.page'
}

const shared = {
    prosUs: [
        'Svelte 5 runes-native implementation',
        'Drop-in API shape for teams migrating from react-json-view-lite',
        'Typed Svelte snippet overrides for primitive values and labels',
        'SSR-safe ids through $props.id()',
        'WAI-ARIA tree semantics with keyboard navigation',
        'Light and dark CSS-module themes with CSS-variable overrides',
        'Zero runtime dependencies'
    ],
    consUs: [
        'Focused on viewing, not editing',
        'No virtualization for very large JSON documents',
        'Smaller ecosystem than older React JSON viewers'
    ]
}

export const competitors: Competitor[] = [
    {
        slug: 'vs-react-json-view-lite',
        name: 'react-json-view-lite',
        tagline: 'React Original vs Svelte 5 Port',
        description:
            'react-json-view-lite is the upstream React package this library ports. @humanspeak/svelte-json-view-lite keeps the familiar API while moving the renderer to Svelte 5 runes and adding typed snippet overrides.',
        website: 'https://github.com/AnyRoad/react-json-view-lite',
        github: 'https://github.com/AnyRoad/react-json-view-lite',
        npm: 'react-json-view-lite',
        type: 'React tree viewer',
        approach: 'React component',
        features: [
            { name: 'Svelte 5 Native', us: true, them: false },
            { name: 'React API Parity', us: true, them: true },
            { name: 'TypeScript Support', us: true, them: true },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'SSR-safe aria ids', us: true, them: 'React useId' },
            { name: 'Zero Runtime Dependencies', us: true, them: true },
            { name: 'JSON Editing', us: false, them: false }
        ],
        prosUs: [...shared.prosUs, 'Designed for SvelteKit and Svelte 5 SSR'],
        prosThem: ['Original project with established React users', 'Best fit for React apps'],
        consUs: shared.consUs,
        consThem: ['Requires React', 'No Svelte snippets', 'Not built for SvelteKit layouts'],
        verdict:
            'Choose react-json-view-lite for React applications. Choose @humanspeak/svelte-json-view-lite when you want the same lightweight tree-viewer ergonomics in Svelte 5.',
        keywords: ['react-json-view-lite', 'svelte json viewer', 'react json view lite svelte']
    },
    {
        slug: 'vs-svelte-jsoneditor',
        name: 'svelte-jsoneditor',
        tagline: 'Full Editor vs Lightweight Viewer',
        description:
            'svelte-jsoneditor is a powerful JSON editor with tree, text, table, and validation workflows. @humanspeak/svelte-json-view-lite is a small read-only tree viewer for display surfaces.',
        website: 'https://github.com/josdejong/svelte-jsoneditor',
        github: 'https://github.com/josdejong/svelte-jsoneditor',
        npm: 'svelte-jsoneditor',
        type: 'JSON editor',
        approach: 'Full editing environment',
        features: [
            { name: 'Svelte 5 Native', us: true, them: 'Svelte component' },
            { name: 'Read-only Tree View', us: true, them: true },
            { name: 'JSON Editing', us: false, them: true },
            { name: 'Schema Validation', us: false, them: true },
            { name: 'Tiny Display Surface', us: true, them: false },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'Zero Runtime Dependencies', us: true, them: false }
        ],
        prosUs: [
            ...shared.prosUs,
            'Much smaller mental model when you only need display',
            'No editor controls, validation, or mutation state to configure'
        ],
        prosThem: [
            'Excellent for editing JSON',
            'Schema validation and repair workflows',
            'Multiple editor modes'
        ],
        consUs: [...shared.consUs, 'No edit/save workflow'],
        consThem: [
            'Heavier than needed for read-only display',
            'More UI surface to theme and explain',
            'Not API-compatible with react-json-view-lite'
        ],
        verdict:
            'Choose svelte-jsoneditor when users need to edit JSON. Choose @humanspeak/svelte-json-view-lite when you need a fast read-only tree in docs, dashboards, inspectors, and logs.',
        keywords: ['svelte-jsoneditor', 'svelte json editor', 'svelte json viewer']
    },
    {
        slug: 'vs-vanilla-jsoneditor',
        name: 'vanilla-jsoneditor',
        tagline: 'Framework-Agnostic Editor vs Svelte Component',
        description:
            'vanilla-jsoneditor is framework-agnostic and editor-focused. @humanspeak/svelte-json-view-lite is a Svelte component for read-only rendering with Svelte snippets and idiomatic props.',
        website:
            'https://github.com/josdejong/svelte-jsoneditor/tree/main/packages/vanilla-jsoneditor',
        github: 'https://github.com/josdejong/svelte-jsoneditor',
        npm: 'vanilla-jsoneditor',
        type: 'Framework-agnostic editor',
        approach: 'Imperative editor instance',
        features: [
            { name: 'Svelte Component API', us: true, them: false },
            { name: 'Framework Agnostic', us: false, them: true },
            { name: 'JSON Editing', us: false, them: true },
            { name: 'Svelte Snippets', us: true, them: false },
            { name: 'Accessible Tree Semantics', us: true, them: 'Editor-dependent' },
            { name: 'Zero Runtime Dependencies', us: true, them: false }
        ],
        prosUs: shared.prosUs,
        prosThem: ['Works outside Svelte', 'Full editor feature set', 'Good for embedded tools'],
        consUs: shared.consUs,
        consThem: [
            'Imperative integration for Svelte apps',
            'Heavier than a read-only viewer',
            'No Svelte snippet override surface'
        ],
        verdict:
            'Choose vanilla-jsoneditor for framework-agnostic editing tools. Choose @humanspeak/svelte-json-view-lite for Svelte-native read-only rendering.',
        keywords: ['vanilla-jsoneditor', 'json editor', 'svelte json tree']
    },
    {
        slug: 'vs-react-json-view',
        name: 'react-json-view',
        tagline: 'Legacy React Inspector vs Svelte 5 Viewer',
        description:
            'react-json-view is a long-running React JSON inspector with editing-oriented features. @humanspeak/svelte-json-view-lite focuses on a smaller Svelte 5 read-only surface.',
        website: 'https://github.com/mac-s-g/react-json-view',
        github: 'https://github.com/mac-s-g/react-json-view',
        npm: 'react-json-view',
        type: 'React JSON inspector',
        approach: 'React component',
        features: [
            { name: 'Svelte 5 Native', us: true, them: false },
            { name: 'React Support', us: false, them: true },
            { name: 'Read-only Tree View', us: true, them: true },
            { name: 'Editing Callbacks', us: false, them: true },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'Zero Runtime Dependencies', us: true, them: false }
        ],
        prosUs: shared.prosUs,
        prosThem: ['Mature React ecosystem package', 'Inspector and edit callback features'],
        consUs: shared.consUs,
        consThem: [
            'React-only',
            'Older architecture',
            'Larger surface than display-only viewers need'
        ],
        verdict:
            'Choose react-json-view for React inspector workflows. Choose @humanspeak/svelte-json-view-lite for Svelte 5 display-only JSON trees.',
        keywords: ['react-json-view', 'json inspector', 'svelte json viewer']
    },
    {
        slug: 'vs-uiw-react-json-view',
        name: '@uiw/react-json-view',
        tagline: 'Polished React Viewer vs Svelte 5 Port',
        description:
            '@uiw/react-json-view is a polished React JSON viewer. @humanspeak/svelte-json-view-lite targets Svelte 5 with the react-json-view-lite API shape and Svelte snippets.',
        website: 'https://github.com/uiwjs/react-json-view',
        github: 'https://github.com/uiwjs/react-json-view',
        npm: '@uiw/react-json-view',
        type: 'React JSON viewer',
        approach: 'React component',
        features: [
            { name: 'Svelte 5 Native', us: true, them: false },
            { name: 'React Support', us: false, them: true },
            { name: 'Theme Customization', us: true, them: true },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'ARIA Tree Keyboarding', us: true, them: 'Different model' },
            { name: 'Zero Runtime Dependencies', us: true, them: false }
        ],
        prosUs: shared.prosUs,
        prosThem: ['Attractive React defaults', 'Broad UIW ecosystem', 'Good React fit'],
        consUs: shared.consUs,
        consThem: ['React-only', 'Not API-compatible with react-json-view-lite migrations'],
        verdict:
            'Choose @uiw/react-json-view in React apps. Choose @humanspeak/svelte-json-view-lite when Svelte 5 integration and snippet overrides matter.',
        keywords: ['@uiw/react-json-view', 'react json viewer', 'svelte json viewer']
    },
    {
        slug: 'vs-textea-json-viewer',
        name: '@textea/json-viewer',
        tagline: 'Feature-Rich React Viewer vs Tiny Svelte Viewer',
        description:
            '@textea/json-viewer is a feature-rich React JSON viewer with theming and interaction options. @humanspeak/svelte-json-view-lite keeps the Svelte surface compact and migration-friendly.',
        website: 'https://viewer.textea.io',
        github: 'https://github.com/TexteaInc/json-viewer',
        npm: '@textea/json-viewer',
        type: 'React JSON viewer',
        approach: 'React component',
        features: [
            { name: 'Svelte 5 Native', us: true, them: false },
            { name: 'React Support', us: false, them: true },
            { name: 'Read-only Tree View', us: true, them: true },
            { name: 'Rich Inspector Features', us: false, them: true },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'Zero Runtime Dependencies', us: true, them: false }
        ],
        prosUs: shared.prosUs,
        prosThem: [
            'Large React feature set',
            'Polished interactive inspector',
            'Good theming options'
        ],
        consUs: shared.consUs,
        consThem: ['React-only', 'More package surface than tiny read-only views require'],
        verdict:
            'Choose @textea/json-viewer for feature-rich React inspectors. Choose @humanspeak/svelte-json-view-lite for a tiny, Svelte-native, read-only JSON tree.',
        keywords: ['@textea/json-viewer', 'react json viewer', 'json tree viewer']
    }
]

export const getCompetitor = (slug: string): Competitor | undefined =>
    competitors.find((competitor) => competitor.slug === slug)
