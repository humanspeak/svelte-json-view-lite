<script lang="ts">
    import { DocsLayoutV2 } from '@humanspeak/docs-kit'
    import { docsConfig } from '$lib/docs-config'
    import { buildBreadcrumbs, docsSections, headerNav } from '$lib/docsNav'
    import favicon from '$lib/assets/logo.svg'
    import sitemapManifest from '$lib/sitemap-manifest.json'
    import rootPkg from '../../../../package.json'
    import '@fontsource-variable/inter/index.css'
    import '@fontsource-variable/jetbrains-mono/index.css'

    const { children, data } = $props()

    const SITE_URL = 'https://jsonview.svelte.page'
    const PKG_VERSION = rootPkg.version

    const faqs = [
        {
            q: 'Is @humanspeak/svelte-json-view-lite an editor?',
            a: 'No. It is a read-only JSON tree viewer for Svelte 5. Use a full JSON editor when users need to mutate, validate, or save JSON.'
        },
        {
            q: 'How close is it to react-json-view-lite?',
            a: 'The public API intentionally mirrors react-json-view-lite for mechanical migrations: style props, expand strategies, compactTopLevel, clickToExpandNode, and beforeExpandChange keep the same shape.'
        },
        {
            q: 'What is new in the Svelte port?',
            a: 'The Svelte port uses Svelte 5 runes, SSR-safe ids, and typed snippet overrides for strings, numbers, booleans, null, undefined, bigint, dates, functions, and labels.'
        },
        {
            q: 'Does it support keyboard navigation?',
            a: 'Yes. Expandable nodes use WAI-ARIA tree semantics, roving tabindex, and ArrowRight, ArrowLeft, ArrowDown, and ArrowUp keyboard navigation.'
        }
    ]
</script>

<DocsLayoutV2
    config={docsConfig}
    {favicon}
    sections={docsSections}
    otherProjects={data.otherProjects}
    version={PKG_VERSION}
    nav={headerNav}
    siteUrl={SITE_URL}
    breadcrumbResolver={buildBreadcrumbs}
    {faqs}
    sitemapManifest={sitemapManifest as Record<string, string>}
>
    {@render children()}
</DocsLayoutV2>
