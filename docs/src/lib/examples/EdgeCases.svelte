<script lang="ts">
    import {
        JsonView,
        allExpanded,
        darkStyles,
        defaultStyles
    } from '@humanspeak/svelte-json-view-lite'
    import { mode } from 'mode-watcher'
    import { jsonData } from '../../../../src/routes/test/sample'

    let stringifyStringValues = $state(false)
    let quotesForFieldNames = $state(false)
    let noQuotesForStringValues = $state(false)
    let compactTopLevel = $state(false)

    const style = $derived({
        ...(mode.current === 'dark' ? darkStyles : defaultStyles),
        stringifyStringValues,
        quotesForFieldNames,
        noQuotesForStringValues
    })
</script>

<div
    class="border-border bg-card mx-auto flex h-[calc(100vh-10rem)] min-h-[640px] w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-sm"
>
    <div
        class="border-border bg-muted/40 flex flex-wrap items-center gap-4 border-b px-4 py-2 text-xs"
    >
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={stringifyStringValues} class="accent-brand-500" />
            stringifyStringValues
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={quotesForFieldNames} class="accent-brand-500" />
            quotesForFieldNames
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input
                type="checkbox"
                bind:checked={noQuotesForStringValues}
                class="accent-brand-500"
            />
            noQuotesForStringValues
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={compactTopLevel} class="accent-brand-500" />
            compactTopLevel
        </label>
    </div>

    <div class="bg-background flex-1 overflow-auto p-6">
        <JsonView data={jsonData} {style} shouldExpandNode={allExpanded} {compactTopLevel} />
    </div>
</div>
