<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import ClickToExpand from '$lib/examples/ClickToExpand.svelte'
    import sourceCode from '$lib/examples/ClickToExpand.svelte?raw'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Click to Expand | Examples | Svelte JSON View Lite'
        seo.description =
            'Toggle clickToExpandNode and beforeExpandChange veto strategies against a live tree, with an event log streaming every decision.'
        seo.ogTitle = 'Click to Expand'
        seo.ogTagline = 'Veto expand/collapse events with a live event log.'
        seo.ogFeatures = ['Veto Strategies', 'Event Log', 'clickToExpandNode', 'Confirm Dialog']
        seo.ogSlug = 'examples-click-to-expand'
    }
</script>

<Example
    title="Click to Expand"
    description="Toggle label-click expansion and watch beforeExpandChange veto decisions stream into a live event log."
    tag="INTERACTION"
    filename="ClickToExpand.svelte"
    {sourceCode}
    barCells={[
        { k: 'prop', v: 'clickToExpandNode' },
        { k: 'hook', v: 'beforeExpandChange' }
    ]}
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/ClickToExpand.svelte"
>
    <ClickToExpand />
</Example>
