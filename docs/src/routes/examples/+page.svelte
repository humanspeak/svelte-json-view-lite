<script lang="ts">
    import { examples } from '$lib/examplesIndex'
    import { BrutIndexV2 } from '@humanspeak/docs-kit'
    import { getBreadcrumbContext } from '$lib/components/contexts/Breadcrumb/Breadcrumb.context'
    import { getSeoContext } from '$lib/components/contexts/Seo/Seo.context'
    import rootPkg from '../../../../package.json'

    const PKG_NAME = rootPkg.name

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
