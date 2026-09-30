<script lang="ts">
    import JsonView from '../JsonView.svelte'
    import type { Props } from '../types.js'

    const {
        data,
        style,
        clickToExpandSummary,
        holdClosed = false,
        summaryWhitespace = false,
        shouldExpandNode,
        beforeExpandChange,
        compactTopLevel = true
    }: Pick<
        Props,
        | 'data'
        | 'shouldExpandNode'
        | 'beforeExpandChange'
        | 'compactTopLevel'
        | 'style'
        | 'clickToExpandSummary'
    > & {
        holdClosed?: boolean
        summaryWhitespace?: boolean
    } = $props()
</script>

<JsonView
    {data}
    {style}
    {clickToExpandSummary}
    {shouldExpandNode}
    {beforeExpandChange}
    {compactTopLevel}
    clickToExpandNode
>
    {#snippet row({ attrs, children, field, level, isContainer })}
        <section {...attrs} data-field={field} data-level={level} data-container={isContainer}>
            {@render children()}
        </section>
    {/snippet}
    {#snippet expander({ expanded, hovered, focused, focusVisible, count })}
        <i
            data-expander
            data-hovered={hovered}
            data-focused={focused}
            data-focus-visible={focusVisible}
            data-count={count}
        >
            {expanded ? 'open' : 'closed'}
        </i>
    {/snippet}
    {#snippet collapsed({ expanded, count })}
        {summaryWhitespace ? ' ' : ''}<span data-summary data-expanded={expanded} data-count={count}
            >{expanded ? '' : '…'}</span
        >{summaryWhitespace ? ' ' : ''}
    {/snippet}
    {#snippet childGroup({ expanded, attrs, children })}
        {#if expanded || holdClosed}
            <ul {...attrs} data-custom-group>
                {@render children()}
            </ul>
        {/if}
    {/snippet}
    {#snippet label({ field })}<em>{field}:</em>{/snippet}
    {#snippet string({ value })}<strong>{value}</strong>{/snippet}
</JsonView>
