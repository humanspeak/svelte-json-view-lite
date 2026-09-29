<script lang="ts">
    import JsonView from '../JsonView.svelte'
    import type { Props } from '../types.js'

    const {
        data,
        holdClosed = false,
        shouldExpandNode,
        beforeExpandChange,
        compactTopLevel = true
    }: Pick<Props, 'data' | 'shouldExpandNode' | 'beforeExpandChange' | 'compactTopLevel'> & {
        holdClosed?: boolean
    } = $props()
</script>

<JsonView {data} {shouldExpandNode} {beforeExpandChange} {compactTopLevel} clickToExpandNode>
    {#snippet row({ attrs, children, field, level, isContainer })}
        <section {...attrs} data-field={field} data-level={level} data-container={isContainer}>
            {@render children()}
        </section>
    {/snippet}
    {#snippet expander({ expanded, hovered, focused, count })}
        <i data-expander data-hovered={hovered} data-focused={focused} data-count={count}>
            {expanded ? 'open' : 'closed'}
        </i>
    {/snippet}
    {#snippet collapsed({ expanded, count })}
        <span data-summary data-expanded={expanded} data-count={count}>{expanded ? '' : '…'}</span>
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
