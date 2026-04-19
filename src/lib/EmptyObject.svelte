<script lang="ts">
    import type { EmptyRenderProps } from './types.js'
    import { quoteString } from './utils/quoteString.js'

    const { field, openBracket, closeBracket, lastElement, style }: EmptyRenderProps = $props()
    const hasField = $derived(field !== undefined)
    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))
</script>

<!--
    Label + brackets collapsed onto one prettier-ignored line because Svelte
    preserves template whitespace between adjacent elements as visible spaces
    under the container's `white-space: pre-wrap`. React/JSX strips that
    whitespace natively; we hand-collapse it. Brackets and trailing comma also
    live in a single punctuation span so the `.punctuation-base + .punctuation-base`
    adjacent-sibling margin rule isn't needed here.
-->
<div class={style.basicChildStyle} role="treeitem" aria-selected={false}>
    <!-- prettier-ignore -->
    {#if hasField}<span class={style.label}>{labelText}:</span>{/if}<span class={style.punctuation}
        >{openBracket}{closeBracket}{lastElement ? '' : ','}</span
    >
</div>
