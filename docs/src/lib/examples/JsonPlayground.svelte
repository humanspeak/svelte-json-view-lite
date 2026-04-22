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

    const style = $derived(mode.current === 'dark' ? darkStyles : defaultStyles)

    const swapMode = (next: ParseMode) => {
        if (next === parseMode) return
        parseMode = next
        source = next === 'js' ? jsDefault : defaultSource
    }
</script>

<div
    class="border-border bg-card mx-auto flex h-[calc(100vh-10rem)] min-h-[640px] w-full max-w-7xl flex-col overflow-hidden rounded-xl border shadow-sm"
>
    <div
        class="border-border bg-muted/40 flex flex-wrap items-center gap-3 border-b px-4 py-2 text-xs"
    >
        <div class="flex items-center gap-1">
            <span class="text-muted-foreground font-medium">Parse:</span>
            <button
                class="rounded-md px-2 py-1 font-medium transition-colors"
                class:bg-brand-500={parseMode === 'json'}
                class:text-white={parseMode === 'json'}
                class:text-muted-foreground={parseMode !== 'json'}
                onclick={() => swapMode('json')}>JSON</button
            >
            <button
                class="rounded-md px-2 py-1 font-medium transition-colors"
                class:bg-brand-500={parseMode === 'js'}
                class:text-white={parseMode === 'js'}
                class:text-muted-foreground={parseMode !== 'js'}
                onclick={() => swapMode('js')}>JS</button
            >
        </div>

        <div class="bg-border h-4 w-px"></div>

        <div class="flex items-center gap-1">
            <span class="text-muted-foreground font-medium">Expand:</span>
            <select
                bind:value={expandMode}
                class="border-border bg-background text-foreground rounded-md border px-2 py-1"
            >
                <option value="root">Root only</option>
                <option value="all">All</option>
                <option value="level">By level</option>
            </select>
            {#if expandMode === 'level'}
                <input
                    type="number"
                    min="0"
                    max="10"
                    bind:value={expandLevel}
                    class="border-border bg-background text-foreground w-14 rounded-md border px-2 py-1"
                />
            {/if}
        </div>

        <div class="bg-border h-4 w-px"></div>

        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={clickToExpand} class="accent-brand-500" />
            Click label to expand
        </label>
    </div>

    <div class="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div class="border-border flex flex-col lg:border-r">
            <textarea
                bind:value={source}
                spellcheck="false"
                class="bg-card text-foreground flex-1 resize-none p-4 font-mono text-sm leading-relaxed focus:outline-none"
            ></textarea>
            {#if parsed.error}
                <div
                    class="border-border bg-destructive/5 text-destructive border-t px-4 py-2 text-xs"
                >
                    {parsed.error}
                </div>
            {/if}
        </div>

        <div class="bg-background overflow-auto p-4">
            {#if parsed.value !== null && typeof parsed.value === 'object'}
                <JsonView
                    data={parsed.value as object}
                    {style}
                    shouldExpandNode={expand}
                    clickToExpandNode={clickToExpand}
                />
            {:else if parsed.error === null}
                <pre class="text-muted-foreground text-sm">{JSON.stringify(
                        parsed.value,
                        null,
                        2
                    )}</pre>
            {:else}
                <p class="text-muted-foreground text-sm">Fix the parse error to preview.</p>
            {/if}
        </div>
    </div>
</div>
