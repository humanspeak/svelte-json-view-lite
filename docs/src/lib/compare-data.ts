import type { ComparisonOurs, Competitor } from '@humanspeak/docs-kit'

export type { ComparisonFeature, ComparisonOurs, Competitor } from '@humanspeak/docs-kit'

export type ComparisonRelationship = 'direct' | 'upstream' | 'reference'

export interface ComparisonEntry extends Competitor {
    relationship: ComparisonRelationship
    relationshipLabel: string
    scopeNote: string
    verifiedAgainst?: string
    sources?: { label: string; href: string }[]
}

export const ours: ComparisonOurs = {
    name: 'Svelte JSON View Lite',
    npmPackage: '@humanspeak/svelte-json-view-lite',
    slug: 'svelte-json-view-lite',
    url: 'https://jsonview.svelte.page'
}

const shared = {
    prosUs: [
        'Svelte 5 runes-native implementation',
        'Familiar API shape for cross-framework migrations',
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

const comparisonRecords: ComparisonEntry[] = [
    {
        slug: 'vs-zerodevx-svelte-json-view',
        name: '@zerodevx/svelte-json-view',
        relationship: 'direct',
        relationshipLabel: 'Direct Svelte alternative',
        scopeNote:
            'Both are lightweight, read-only Svelte 5 viewers with runes, CSS-variable theming, and zero runtime dependencies. Compare rendering overrides and tree navigation with a minimal json/depth API and a standalone JavaScript bundle.',
        seoTitle: '@zerodevx/svelte-json-view vs Svelte JSON View Lite',
        tagline: 'Two Svelte 5 Viewers · Minimal Props or Typed Snippets',
        description:
            'Compare @zerodevx/svelte-json-view with Svelte JSON View Lite: Svelte 5 runes, typed snippets, keyboard navigation, depth controls, and vanilla-JS support.',
        website: 'https://github.com/zerodevx/svelte-json-view',
        github: 'https://github.com/zerodevx/svelte-json-view',
        npm: '@zerodevx/svelte-json-view',
        type: 'Direct Svelte alternative',
        approach: 'Svelte 5 read-only viewer with an optional standalone JavaScript bundle',
        features: [
            { name: 'Svelte 5 Native', us: true, them: true },
            { name: 'Read-only Tree View', us: true, them: true },
            { name: 'Zero Runtime Dependencies', us: true, them: true },
            { name: 'Theme Customization', us: true, them: true },
            {
                name: 'CSS Variable Overrides',
                us: '--sjv-* variables + style maps',
                them: 'Ten --json* variables'
            },
            {
                name: 'Expansion Policy',
                us: 'shouldExpandNode(level, value, field)',
                them: 'Numeric depth prop',
                note: 'Both expand all nodes by default. In zerodevx, depth={0} leaves the root expanded and collapses nested containers.'
            },
            { name: 'Expansion Veto Callback', us: 'beforeExpandChange', them: false },
            {
                name: 'Snippet Overrides',
                us: '9 typed value and label snippets',
                them: false,
                note: 'The zerodevx public API exposes json and depth, with no custom-renderer prop.'
            },
            {
                name: 'Keyboard Navigation',
                us: 'Arrow keys, roving tabindex, Enter/Space',
                them: 'Tab to brackets; Enter/Space to toggle',
                note: 'Both support keyboard interaction; their navigation models differ.'
            },
            {
                name: 'ARIA Tree Semantics',
                us: 'Tree roles and expansion state',
                them: 'Lists and bracket buttons',
                note: 'The inspected zerodevx 2.0.0 component has no tree roles or aria-expanded. This comparison is not an accessibility certification.'
            },
            { name: 'TypeScript Support', us: true, them: true },
            {
                name: 'Standalone Vanilla-JS Bundle',
                us: false,
                them: 'createJsonView, update, destroy',
                note: 'zerodevx also documents CDN usage; our package is a Svelte component.'
            },
            { name: 'JSON Editing', us: false, them: false },
            { name: 'Virtualization', us: false, them: false }
        ],
        prosUs: [
            'Typed snippets for primitive values and field labels',
            'Tree roles, expansion state, and arrow-key navigation with roving tabindex',
            'Expansion policies can inspect level, value, and field name',
            'beforeExpandChange can veto a toggle',
            'Familiar react-json-view-lite API and built-in light/dark style maps'
        ],
        prosThem: [
            'Small public API: json and depth',
            'Svelte 5 runes-native implementation',
            'Standalone JavaScript bundle with update and destroy methods',
            'CSS-variable theming and zero runtime dependencies',
            'Svelte 4 and earlier users can stay on the v1 release line'
        ],
        consUs: [
            'No standalone vanilla-JS or CDN widget API',
            'Requires Svelte 5; no Svelte 4 compatibility',
            'More configuration choices than a two-prop viewer',
            'No editing or virtualization'
        ],
        consThem: [
            'No public snippet or custom-renderer API',
            'No field-aware expansion policy or expansion veto callback',
            'No arrow-key tree navigation, tree roles, or aria-expanded in 2.0.0',
            'No editing or virtualization'
        ],
        verdict:
            'Choose @zerodevx/svelte-json-view for a minimal json/depth interface or a standalone vanilla-JS widget. Choose Svelte JSON View Lite when typed snippets, tree keyboard navigation, expansion callbacks, or react-json-view-lite API familiarity matter. Both use Svelte 5 runes and have zero runtime dependencies; no speed or bundle-size advantage is claimed here. To migrate basic usage, change the import and rename json to data. Map depth={d} to shouldExpandNode={(level) => level <= d} for the initial expansion threshold, then adapt CSS variable names and verify dynamic expansion behavior.',
        keywords: [
            '@zerodevx/svelte-json-view',
            'zerodevx json view',
            'zerodevx svelte-json-view alternative',
            'svelte json viewer comparison'
        ],
        verifiedAgainst: 'Compared against @zerodevx/svelte-json-view 2.0.0 on September 23, 2026.',
        sources: [
            {
                label: 'v2.0.0 release',
                href: 'https://github.com/zerodevx/svelte-json-view/releases/tag/v2.0.0'
            },
            {
                label: 'Documented props, themes, and standalone usage',
                href: 'https://github.com/zerodevx/svelte-json-view/blob/v2.0.0/README.md'
            },
            {
                label: 'Component source and keyboard behavior',
                href: 'https://github.com/zerodevx/svelte-json-view/blob/v2.0.0/src/lib/JsonView.svelte'
            },
            {
                label: 'Published package metadata',
                href: 'https://registry.npmjs.org/@zerodevx/svelte-json-view/2.0.0'
            }
        ]
    },
    {
        slug: 'vs-react-json-view-lite',
        name: 'react-json-view-lite',
        relationship: 'upstream',
        relationshipLabel: 'React upstream',
        scopeNote:
            'This is the React upstream that defines this port’s API, not a competing Svelte package. A migration changes the import and component syntax while retaining the core prop names, theme exports, expansion helpers, and keyboard model.',
        seoTitle: 'react-json-view-lite for Svelte 5 | API-Compatible Port',
        tagline: 'React 18/19 Original → API-Parity Svelte 5 Port',
        description:
            'react-json-view-lite for Svelte 5: keep its familiar props, themes, and keyboard navigation in a runes-native port with typed snippets and SSR-safe IDs.',
        website: 'https://github.com/AnyRoad/react-json-view-lite',
        github: 'https://github.com/AnyRoad/react-json-view-lite',
        npm: 'react-json-view-lite',
        type: 'React upstream — not Svelte-native',
        approach: 'React 18/19 source API; mechanical migration target for Svelte 5',
        features: [
            {
                name: 'Framework Runtime',
                us: 'Svelte 5',
                them: 'React 18/19',
                note: 'Separate native implementations; the Svelte port does not ship React.'
            },
            {
                name: 'JsonView API',
                us: 'Same component + core props',
                them: 'Original API',
                note: 'data, style, shouldExpandNode, clickToExpandNode, compactTopLevel, and beforeExpandChange retain their names and purpose.'
            },
            {
                name: 'Theme API',
                us: 'Same style-map shape',
                them: 'defaultStyles + darkStyles',
                note: 'The built-in theme exports and StyleProps surface port directly.'
            },
            {
                name: 'Expand Strategies',
                us: 'Same helpers',
                them: 'allExpanded + collapseAllNested',
                note: 'Existing expansion logic can move across without a new mental model.'
            },
            {
                name: 'Keyboard Navigation',
                us: 'WAI-ARIA treeview',
                them: 'WAI-ARIA treeview',
                note: 'Both support arrow-key navigation through expandable nodes.'
            },
            { name: 'TypeScript Support', us: true, them: true },
            {
                name: 'Per-type Rendering',
                us: '9 typed Svelte snippets',
                them: false,
                note: 'The Svelte port adds overrides for labels and every primitive value type.'
            },
            {
                name: 'SSR-safe ARIA IDs',
                us: 'Svelte $props.id()',
                them: 'React useId',
                note: 'Each implementation uses its framework-native stable-id primitive.'
            },
            {
                name: 'CSS Variable Overrides',
                us: true,
                them: false,
                note: 'The Svelte port layers --sjv-* custom properties onto the familiar style map.'
            },
            { name: 'Zero Runtime Dependencies', us: true, them: true },
            { name: 'JSON Editing', us: false, them: false }
        ],
        prosUs: [
            'Same JsonView component name and core prop names',
            'Same defaultStyles, darkStyles, allExpanded, and collapseAllNested exports',
            'Svelte 5 runes-native implementation with no React compatibility layer',
            'Typed Svelte snippet overrides for primitive values and labels',
            'SSR-safe ids through $props.id()',
            'WAI-ARIA tree semantics with keyboard navigation',
            'Light and dark themes with CSS-variable overrides',
            'Zero runtime dependencies'
        ],
        prosThem: [
            'Original project and source of the shared API',
            'Established package for React applications',
            'React 18/19-native implementation',
            'Accessible tree navigation with zero runtime dependencies'
        ],
        consUs: shared.consUs,
        consThem: [
            'Requires React 18 or 19',
            'Cannot render as a native Svelte component',
            'No typed Svelte snippet overrides',
            'No --sjv-* CSS-variable override layer'
        ],
        verdict:
            'Stay with react-json-view-lite in a React 18 or 19 application. When moving to Svelte 5, switch the package import and component syntax, keep the familiar props, theme maps, and expansion helpers, then opt into typed snippets where useful. The migration is mechanical because this port deliberately preserves the upstream API shape.',
        keywords: [
            'react-json-view-lite',
            'react-json-view-lite svelte',
            'react json view lite svelte',
            'svelte react-json-view-lite port',
            'react-json-view-lite alternative'
        ]
    },
    {
        slug: 'vs-svelte-jsoneditor',
        name: 'svelte-jsoneditor',
        relationship: 'direct',
        relationshipLabel: 'Direct Svelte alternative',
        scopeNote:
            'This is a direct Svelte-compatible choice: use it when editing and validation matter more than a small read-only display surface.',
        tagline: 'Direct Svelte Alternative · Full Editor vs Lightweight Viewer',
        description:
            'svelte-jsoneditor is a direct Svelte 5 alternative with tree, text, table, editing, and validation workflows. @humanspeak/svelte-json-view-lite is the smaller read-only choice for display surfaces.',
        website: 'https://github.com/josdejong/svelte-jsoneditor',
        github: 'https://github.com/josdejong/svelte-jsoneditor',
        npm: 'svelte-jsoneditor',
        type: 'Direct Svelte alternative',
        approach: 'Svelte 5 full editing environment',
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
        relationship: 'direct',
        relationshipLabel: 'Svelte-compatible alternative',
        scopeNote:
            'This framework-agnostic editor can be integrated into Svelte, making it a real alternative when users need editing rather than a Svelte-native read-only component.',
        tagline: 'Svelte-Compatible Alternative · Agnostic Editor vs Svelte Component',
        description:
            'vanilla-jsoneditor is a Svelte-compatible, framework-agnostic editor. @humanspeak/svelte-json-view-lite is a native Svelte component for read-only rendering with snippets and idiomatic props.',
        website:
            'https://github.com/josdejong/svelte-jsoneditor/tree/main/packages/vanilla-jsoneditor',
        github: 'https://github.com/josdejong/svelte-jsoneditor',
        npm: 'vanilla-jsoneditor',
        type: 'Svelte-compatible alternative',
        approach: 'Framework-agnostic imperative editor instance',
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
        relationship: 'reference',
        relationshipLabel: 'React-only reference',
        scopeNote:
            'This is a React-only search and feature reference, not a native Svelte alternative. Using it in a Svelte app would require React and an integration layer.',
        seoTitle: 'react-json-view vs Svelte 5 | React-Only',
        tagline: 'React-Only Reference · Legacy Inspector vs Svelte 5 Viewer',
        description:
            'react-json-view is a React-only JSON inspector, not a native Svelte alternative, and its last npm release was March 2021. This page exists for cross-framework evaluation and migration research.',
        website: 'https://github.com/mac-s-g/react-json-view',
        github: 'https://github.com/mac-s-g/react-json-view',
        npm: 'react-json-view',
        type: 'React-only reference — not a Svelte option',
        approach: 'Legacy React component; last npm release March 2021',
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
            'No npm release since March 2021',
            'Larger surface than display-only viewers need'
        ],
        verdict:
            'These are not drop-in alternatives within one framework. Choose react-json-view only for an existing React inspector workflow; choose @humanspeak/svelte-json-view-lite for a native Svelte 5 read-only tree.',
        keywords: ['react-json-view', 'json inspector', 'svelte json viewer']
    },
    {
        slug: 'vs-uiw-react-json-view',
        name: '@uiw/react-json-view',
        relationship: 'reference',
        relationshipLabel: 'React-only reference',
        scopeNote:
            'This is a React-only search and feature reference, not a native Svelte alternative. Using it in a Svelte app would require React and an integration layer.',
        seoTitle: '@uiw/react-json-view vs Svelte 5 | React-Only',
        tagline: 'React-Only Reference · UIW Viewer vs Svelte 5 Port',
        description:
            '@uiw/react-json-view is a React-only viewer, not a native Svelte alternative. Its current release is a 2.0 alpha; this page exists for cross-framework feature and search comparison.',
        website: 'https://github.com/uiwjs/react-json-view',
        github: 'https://github.com/uiwjs/react-json-view',
        npm: '@uiw/react-json-view',
        type: 'React-only reference — not a Svelte option',
        approach: 'React 18+ component; current release is a 2.0 alpha',
        features: [
            { name: 'Svelte 5 Native', us: true, them: false },
            { name: 'React Support', us: false, them: true },
            { name: 'Theme Customization', us: true, them: true },
            { name: 'Snippet Overrides', us: true, them: false },
            { name: 'ARIA Tree Keyboarding', us: true, them: 'Different model' },
            { name: 'Zero Runtime Dependencies', us: true, them: true }
        ],
        prosUs: shared.prosUs,
        prosThem: ['Attractive React defaults', 'Broad UIW ecosystem', 'Good React fit'],
        consUs: shared.consUs,
        consThem: ['React-only', 'Not API-compatible with react-json-view-lite migrations'],
        verdict:
            'These are not drop-in alternatives within one framework. Choose @uiw/react-json-view for React apps; choose @humanspeak/svelte-json-view-lite for native Svelte 5 integration and snippet overrides.',
        keywords: ['@uiw/react-json-view', 'react json viewer', 'svelte json viewer']
    },
    {
        slug: 'vs-textea-json-viewer',
        name: '@textea/json-viewer',
        relationship: 'reference',
        relationshipLabel: 'React-only reference',
        scopeNote:
            'This is a React-only search and feature reference, not a native Svelte alternative. Using it in a Svelte app would require React and an integration layer.',
        seoTitle: '@textea/json-viewer vs Svelte 5 | React-Only',
        tagline: 'React-Only Reference · Rich Inspector vs Tiny Svelte Viewer',
        description:
            '@textea/json-viewer is a React-only inspector, not a native Svelte alternative, with no npm release since December 2024. This page exists for cross-framework feature and search comparison.',
        website: 'https://viewer.textea.io',
        github: 'https://github.com/TexteaInc/json-viewer',
        npm: '@textea/json-viewer',
        type: 'React-only reference — not a Svelte option',
        approach: 'React component; last npm release December 2024',
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
            'Interactive inspector controls',
            'Good theming options'
        ],
        consUs: shared.consUs,
        consThem: ['React-only', 'More package surface than tiny read-only views require'],
        verdict:
            'These are not drop-in alternatives within one framework. Choose @textea/json-viewer for an existing React inspector; choose @humanspeak/svelte-json-view-lite for a small, native Svelte 5 read-only tree.',
        keywords: ['@textea/json-viewer', 'react json viewer', 'json tree viewer']
    }
]

export const comparisons = [
    ...comparisonRecords.filter((entry) => entry.relationship === 'direct'),
    ...comparisonRecords.filter((entry) => entry.relationship === 'upstream'),
    ...comparisonRecords.filter((entry) => entry.relationship === 'reference')
]

export const getCompetitor = (slug: string): ComparisonEntry | undefined =>
    comparisons.find((comparison) => comparison.slug === slug)
