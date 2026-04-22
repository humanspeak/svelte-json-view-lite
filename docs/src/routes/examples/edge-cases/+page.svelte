<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import EdgeCases from '$lib/examples/EdgeCases.svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Edge Cases | Examples | Svelte JSON View Lite'
        seo.description =
            'Render every supported value type — dates, bigints, functions, nulls, empty containers, long strings — against the same canonical fixture as the react-json-view-lite Storybook.'
        seo.ogTitle = 'Edge Cases'
        seo.ogTagline = 'Every value type the viewer handles, in one payload.'
        seo.ogFeatures = ['BigInt', 'Dates', 'Functions', 'Nested Objects']
        seo.ogSlug = 'examples-edge-cases'
    }
</script>

<Example
    title="Edge Cases"
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/EdgeCases.svelte"
>
    <EdgeCases />
</Example>
