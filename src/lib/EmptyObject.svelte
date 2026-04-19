<script lang="ts">
    import type { EmptyRenderProps } from './types.js'
    import { quoteString } from './utils/quoteString.js'

    const { field, openBracket, closeBracket, lastElement, style }: EmptyRenderProps = $props()
    const hasField = $derived(field !== undefined)
    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))
</script>

<div class={style.basicChildStyle} role="treeitem" aria-selected={false}>
    {#if hasField}
        <span class={style.label}>{labelText}:</span>
    {/if}
    <span class={style.punctuation}>{openBracket}</span>
    <span class={style.punctuation}>{closeBracket}</span>
    {#if !lastElement}<span class={style.punctuation}>,</span>{/if}
</div>
