<script lang="ts">
    import { JsonView, allExpanded } from '@humanspeak/svelte-json-view-lite'
    import { docsDarkJsonViewStyles, docsDefaultJsonViewStyles } from '$lib/json-view-docs-style'
    import { mode } from 'mode-watcher'
    import { jsonData } from '../../../../src/routes/test/sample'

    let stringifyStringValues = $state(false)
    let quotesForFieldNames = $state(false)
    let noQuotesForStringValues = $state(false)
    let compactTopLevel = $state(false)

    const demoData = {
        'escaped string': 'line one\nline two\t"quoted"',
        ...jsonData
    }

    const style = $derived({
        ...(mode.current === 'light' ? docsDefaultJsonViewStyles : docsDarkJsonViewStyles),
        stringifyStringValues,
        quotesForFieldNames,
        noQuotesForStringValues
    })
</script>

<div class="json-demo column">
    <div class="json-demo-controls">
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={stringifyStringValues} />
            stringifyStringValues
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={quotesForFieldNames} />
            quotesForFieldNames
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={noQuotesForStringValues} />
            noQuotesForStringValues
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={compactTopLevel} />
            compactTopLevel
        </label>
    </div>

    <div class="json-demo-body">
        <JsonView data={demoData} {style} shouldExpandNode={allExpanded} {compactTopLevel} />
    </div>
</div>
