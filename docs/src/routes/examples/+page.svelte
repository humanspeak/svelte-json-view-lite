<script lang="ts">
    import { BrutIndexV2 } from '@humanspeak/docs-kit'
    import { getBreadcrumbContext } from '$lib/components/contexts/Breadcrumb/Breadcrumb.context'
    import { getSeoContext } from '$lib/components/contexts/Seo/Seo.context'
    import rootPkg from '../../../../package.json'

    const PKG_NAME = rootPkg.name

    type ExampleTag = 'DEMO' | 'SNIPPETS' | 'THEMING' | 'INTERACTION' | 'VALUES' | 'A11Y'

    type Example = {
        slug: string
        title: string
        tag: ExampleTag
        description: string
    }

    const examples: Example[] = [
        {
            slug: 'playground',
            title: 'Live Playground',
            tag: 'DEMO',
            description:
                'Edit JSON in real time and see the tree render instantly with inline parse errors.'
        },
        {
            slug: 'snippet-overrides',
            title: 'Snippet Overrides',
            tag: 'SNIPPETS',
            description:
                'Decorate strings, numbers, dates, booleans, labels, and primitive values with typed Svelte snippets.'
        },
        {
            slug: 'css-variables',
            title: 'CSS Variable Themer',
            tag: 'THEMING',
            description:
                'Tune the --sjv-* theme tokens live without replacing the viewer style map.'
        },
        {
            slug: 'click-to-expand',
            title: 'Click to Expand',
            tag: 'INTERACTION',
            description:
                'Toggle label-click expansion and watch beforeExpandChange decisions stream into a live event log.'
        },
        {
            slug: 'edge-cases',
            title: 'Edge Cases',
            tag: 'VALUES',
            description:
                'Render dates, bigints, functions, nulls, empty containers, nested arrays, and long strings.'
        },
        {
            slug: 'accessibility',
            title: 'ARIA Treeview',
            tag: 'A11Y',
            description:
                'Inspect tree roles, expanded state, labelled controls, and keyboard-ready focus behavior.'
        }
    ]

    const breadcrumbs = getBreadcrumbContext()
    const seo = getSeoContext()
    if (breadcrumbs) {
        breadcrumbs.breadcrumbs = [{ title: 'Examples' }]
    }
    if (seo) {
        seo.title = 'Interactive Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Interactive Examples' }
        seo.description =
            'Live demos for @humanspeak/svelte-json-view-lite: JSON editing, snippet overrides, CSS-variable theming, click-to-expand behavior, edge cases, and ARIA tree semantics.'
        seo.ogTitle = 'Interactive Examples'
        seo.ogTagline = 'Live JSON tree viewer demos for Svelte 5.'
        seo.ogFeatures = ['Live JSON', 'Snippet Overrides', 'CSS Variables', 'ARIA Treeview']
        seo.ogSlug = 'examples'
    }

    const pad2 = (n: number) => String(n).padStart(2, '0')

    const items = examples.map((e, i) => ({
        href: `/examples/${e.slug}`,
        id: `№ ${pad2(i + 1)} / ${pad2(examples.length)}`,
        title: `${e.title.toLowerCase()}.`,
        tag: e.tag,
        line: e.description
    }))
</script>

<BrutIndexV2
    hero={{
        figLabel: 'FIG-001 · EXAMPLES INDEX',
        figId: 'FIG-001',
        sheetLabel: 'SHEET 01 / 02',
        meta: [
            { k: 'demos', v: String(examples.length) },
            { k: 'format', v: 'live editors' },
            { k: 'tone', v: 'interactive' },
            { rule: 'dashed' },
            { k: 'library', v: PKG_NAME },
            { k: 'framework', v: 'svelte 5', accent: true }
        ],
        metaFooter: '// scroll for demos',
        kicker: '// examples / live demos',
        title: { accent: 'examples', end: '.' },
        subHtml:
            'Hands-on demos of <b>@humanspeak/svelte-json-view-lite</b> — live JSON editing, typed snippet overrides, CSS-variable theming, interaction hooks, value edge cases, and ARIA tree behavior. Edit, copy, ship.',
        ctas: [
            { label: 'open playground ↗', href: '/examples/playground', primary: true },
            { label: 'get started', href: '/docs/getting-started' },
            { label: 'compare', href: '/compare' }
        ]
    }}
    lede={{
        kicker: 'FIG-002 / DEMOS',
        title: { prefix: 'pick a ', accent: 'demo', suffix: '.' },
        body: 'Each page is a self-contained live example with the source you need to copy into your own project.'
    }}
    {items}
    footer={{
        big: {
            prefix: 'try ',
            accent: 'the playground',
            href: '/examples/playground',
            hint: 'edit JSON live'
        }
    }}
/>
