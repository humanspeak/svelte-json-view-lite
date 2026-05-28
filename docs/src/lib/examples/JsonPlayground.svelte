<script lang="ts">
    import {
        JsonView,
        allExpanded,
        collapseAllNested,
        darkStyles,
        defaultStyles
    } from '@humanspeak/svelte-json-view-lite'
    import { mode } from 'mode-watcher'

    type ParseMode = 'json' | 'js'
    type ExpandMode = 'root' | 'all' | 'level'

    const defaultSource = `{
    "user": {
        "id": 42,
        "name": "Ada Lovelace",
        "tags": ["admin", "beta"],
        "joined": "2024-01-15T09:00:00.000Z"
    },
    "totals": { "requests": 1523, "errors": 0, "latencyMs": 12.4 },
    "active": true,
    "nextReview": null
}`

    const jsDefault = `({
    user: { id: 42, name: 'Ada Lovelace', joined: new Date('2024-01-15') },
    counter: 9007199254740991n,
    active: true,
    render: () => 'hi',
    nextReview: null
})`

    let parseMode = $state<ParseMode>('json')
    let source = $state(defaultSource)
    let expandMode = $state<ExpandMode>('root')
    let expandLevel = $state(2)
    let clickToExpand = $state(true)

    type Parsed = { value: unknown; error: string | null }

    const parsed = $derived.by<Parsed>(() => {
        try {
            if (parseMode === 'json') {
                return { value: JSON.parse(source), error: null }
            }
            const value = new Function(`return ${source || 'undefined'}`)()
            return { value, error: null }
        } catch (err) {
            return { value: null, error: err instanceof Error ? err.message : String(err) }
        }
    })

    const expand = $derived.by(() => {
        if (expandMode === 'all') return allExpanded
        if (expandMode === 'root') return collapseAllNested
        return (level: number) => level < expandLevel
    })

    const style = $derived(mode.current === 'light' ? defaultStyles : darkStyles)

    const swapMode = (next: ParseMode) => {
        if (next === parseMode) return
        parseMode = next
        source = next === 'js' ? jsDefault : defaultSource
    }
</script>

<div class="json-demo column">
    <div class="json-demo-controls">
        <div class="json-demo-control-group">
            <span>parse</span>
            <button class:active={parseMode === 'json'} onclick={() => swapMode('json')}
                >JSON</button
            >
            <button class:active={parseMode === 'js'} onclick={() => swapMode('js')}>JS</button>
        </div>

        <div class="json-demo-divider"></div>

        <div class="json-demo-control-group">
            <span>expand</span>
            <select bind:value={expandMode}>
                <option value="root">Root only</option>
                <option value="all">All</option>
                <option value="level">By level</option>
            </select>
            {#if expandMode === 'level'}
                <input type="number" min="0" max="10" bind:value={expandLevel} />
            {/if}
        </div>

        <div class="json-demo-divider"></div>

        <label class="json-demo-control">
            <input type="checkbox" bind:checked={clickToExpand} />
            click label to expand
        </label>
    </div>

    <div class="json-demo grid">
        <div class="json-demo-source">
            <textarea bind:value={source} spellcheck="false"></textarea>
            {#if parsed.error}
                <div class="json-demo-error">
                    {parsed.error}
                </div>
            {/if}
        </div>

        <div class="json-demo-body">
            {#if parsed.value !== null && typeof parsed.value === 'object'}
                <JsonView
                    data={parsed.value as object}
                    {style}
                    shouldExpandNode={expand}
                    clickToExpandNode={clickToExpand}
                />
            {:else if parsed.error === null}
                <pre>{JSON.stringify(parsed.value, null, 2)}</pre>
            {:else}
                <p>Fix the parse error to preview.</p>
            {/if}
        </div>
    </div>
</div>
