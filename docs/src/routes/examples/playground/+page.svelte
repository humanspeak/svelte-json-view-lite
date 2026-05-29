<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import JsonPlayground from '$lib/examples/JsonPlayground.svelte'
    import sourceCode from '$lib/examples/JsonPlayground.svelte?raw'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Live Playground | Examples | Svelte JSON View Lite'
        seo.description =
            'Edit JSON or JS expressions and see a live JsonView render. Swap expand strategies, toggle click-to-expand, all in the browser.'
        seo.ogTitle = 'Live Playground'
        seo.ogTagline = 'Edit JSON, render a tree, tweak every knob.'
        seo.ogFeatures = ['Live Editor', 'JSON + JS Modes', 'Expand Strategies', 'Click to Expand']
        seo.ogSlug = 'examples-playground'
    }
</script>

<Example
    title="Live Playground"
    description="Edit JSON in real time, switch expansion behavior, and preview the rendered tree without leaving the page."
    tag="DEMO"
    filename="JsonPlayground.svelte"
    {sourceCode}
    barCells={[
        { k: 'input', v: 'json' },
        { k: 'preview', v: 'JsonView' }
    ]}
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/JsonPlayground.svelte"
>
    <JsonPlayground />
</Example>
