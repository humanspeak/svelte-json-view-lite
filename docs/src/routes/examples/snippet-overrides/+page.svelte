<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import SnippetOverrides from '$lib/examples/SnippetOverrides.svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Snippet Overrides | Examples | Svelte JSON View Lite'
        seo.description =
            'See typed per-type Snippet overrides in action — URL linkification, relative dates, number formatting, boolean badges.'
        seo.ogTitle = 'Snippet Overrides'
        seo.ogTagline = 'Per-type renderers, flipped on and off live.'
        seo.ogFeatures = ['URL Links', 'Relative Dates', 'Number Format', 'Boolean Badges']
        seo.ogSlug = 'examples-snippet-overrides'
    }
</script>

<Example
    title="Snippet Overrides"
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/SnippetOverrides.svelte"
>
    <SnippetOverrides />
</Example>
