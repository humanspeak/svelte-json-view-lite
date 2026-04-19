<script lang="ts">
    import { defaultStyles, JsonView, type NodeExpandingEvent } from '$lib/index.js'
    import { jsonData } from '../sample.js'

    let veto = $state(false)
    let lastEvent = $state<NodeExpandingEvent | null>(null)

    function beforeExpandChange(event: NodeExpandingEvent): boolean {
        lastEvent = event
        return !veto
    }
</script>

<h1>Click on field name to expand</h1>
<p class="blurb">
    Matches the <em>Click on field name to expand</em> story — <code>clickToExpandNode</code>
    makes the label text a second click-target alongside the ▸ icon. The
    <code>beforeExpandChange</code> observer records the last event so you can inspect it below.
</p>

<p class="blurb">
    <button type="button" data-testid="toggle-veto" onclick={() => (veto = !veto)}>
        {veto ? 'Veto is ON (next click will be blocked)' : 'Enable veto'}
    </button>
</p>

<JsonView data={jsonData} style={defaultStyles} clickToExpandNode {beforeExpandChange} />
{#if lastEvent}
    <pre class="event" data-testid="last-event">last event = {JSON.stringify(
            lastEvent,
            null,
            2
        )}</pre>
{/if}

<style>
    button {
        font-family: system-ui, sans-serif;
        padding: 0.3rem 0.7rem;
        border: 1px solid currentColor;
        background: transparent;
        border-radius: 4px;
        cursor: pointer;
    }
    pre.event {
        font-size: 12px;
        background: #f4f4f4;
        padding: 0.5rem;
        border-radius: 4px;
        margin-top: 1rem;
    }
</style>
