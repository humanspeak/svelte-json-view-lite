<script lang="ts">
    import {
        collapseAllNested,
        defaultStyles,
        JsonView,
        type NodeExpandingEvent
    } from '$lib/index.js'

    const data = {
        user: { id: 1, name: 'Ada', tags: ['admin', 'beta'] },
        secrets: { apiKey: 'redacted' }
    }

    let lastEvent = $state<NodeExpandingEvent | null>(null)

    function beforeExpandChange(event: NodeExpandingEvent): boolean {
        lastEvent = event
        // Block expansion of any node whose field name is "secrets".
        return event.field !== 'secrets'
    }
</script>

<main>
    <h1>JsonView — click-to-expand + beforeExpandChange</h1>
    <p>
        Click the <em>label text</em> (not just the ▸) to toggle a node. The
        <code>secrets</code> branch is vetoed by <code>beforeExpandChange</code>.
    </p>
    <JsonView
        {data}
        style={defaultStyles}
        shouldExpandNode={collapseAllNested}
        clickToExpandNode
        {beforeExpandChange}
    />
    {#if lastEvent}
        <pre>last event = {JSON.stringify(lastEvent, null, 2)}</pre>
    {/if}
</main>

<style>
    main {
        padding: 2rem;
        font-family: system-ui, sans-serif;
        max-width: 720px;
        margin: 0 auto;
    }
    pre {
        background: #f4f4f4;
        padding: 0.5rem;
        border-radius: 4px;
        margin-top: 1rem;
    }
</style>
