<script lang="ts">
    import { ExampleLayoutV2, PagerV2, enhanceCodeBlocks } from '@humanspeak/docs-kit'
    import { examples } from '$lib/examplesIndex'
    import { docsConfig } from '$lib/docs-config'
    import favicon from '$lib/assets/logo.svg'
    import { buildBreadcrumbs, headerNav } from '$lib/docsNav'
    import rootPkg from '../../../../package.json'
    import '@fontsource-variable/inter/index.css'
    import '@fontsource-variable/jetbrains-mono/index.css'

    const { children } = $props()
    const PKG_VERSION = rootPkg.version
    const examplePages = examples.map((example) => ({
        href: `/examples/${example.slug}`,
        label: `${example.title.toLowerCase()}.`
    }))
</script>

<ExampleLayoutV2
    config={docsConfig}
    {favicon}
    version={PKG_VERSION}
    nav={headerNav}
    breadcrumbResolver={buildBreadcrumbs}
>
    <div class="flex flex-1 flex-col" use:enhanceCodeBlocks>
        {@render children?.()}
        <PagerV2 items={examplePages} ariaLabel="Example pagination" />
    </div>
</ExampleLayoutV2>
