<script lang="ts">
    import DataRender from './DataRender.svelte'
    import { defaultStyles } from './index.js'
    import type { OuterRef, Props, StyleProps } from './types.js'
    import { isObject } from './utils/dataTypeDetection.js'
    import { allExpanded } from './utils/expandStrategies.js'

    const {
        data,
        style = {},
        shouldExpandNode = allExpanded,
        clickToExpandNode = false,
        beforeExpandChange,
        compactTopLevel = false,
        string,
        number,
        boolean,
        null: nullSnippet,
        undefined: undefinedSnippet,
        bigint,
        date,
        function: functionSnippet,
        label,
        'aria-label': ariaLabel = 'JSON view',
        ...rest
    }: Props = $props()

    let outerElement = $state<HTMLDivElement | null>(null)

    // Merge user theme onto defaults. Also emit a deprecation warning when the
    // legacy `ariaLables` key (typo in react-json-view-lite) is supplied
    // without the corrected `ariaLabels`; the typoed value is still honored
    // during 1.x so React migrators have a soft landing.
    const mergedStyle = $derived.by<StyleProps>(() => {
        const merged: StyleProps = { ...defaultStyles, ...style }
        if (style && 'ariaLables' in style && !('ariaLabels' in style) && style.ariaLables) {
            if (typeof console !== 'undefined') {
                console.warn(
                    '[svelte-json-view-lite] StyleProps.ariaLables is deprecated (typo preserved from react-json-view-lite); use ariaLabels.'
                )
            }
            merged.ariaLabels = style.ariaLables
        }
        return merged
    })

    // Getter wrapper so children always see the current bind:this target
    // rather than a frozen snapshot from the first render.
    const outerRef: OuterRef = {
        get current() {
            return outerElement
        }
    }

    const snippets = $derived({
        string,
        number,
        boolean,
        null: nullSnippet,
        undefined: undefinedSnippet,
        bigint,
        date,
        function: functionSnippet,
        label
    })
</script>

<div
    bind:this={outerElement}
    role="tree"
    aria-label={ariaLabel}
    {...rest}
    class={mergedStyle.container}
>
    {#if compactTopLevel && isObject(data)}
        {#each Object.entries(data) as [key, value] (key)}
            <DataRender
                field={key}
                {value}
                style={mergedStyle}
                lastElement={true}
                level={1}
                {shouldExpandNode}
                {clickToExpandNode}
                {beforeExpandChange}
                {outerRef}
                {snippets}
            />
        {/each}
    {:else}
        <DataRender
            value={data}
            style={mergedStyle}
            lastElement={true}
            level={0}
            {shouldExpandNode}
            {clickToExpandNode}
            {beforeExpandChange}
            {outerRef}
            {snippets}
        />
    {/if}
</div>
