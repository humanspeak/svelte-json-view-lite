<script lang="ts">
    import ExpandableObject from './ExpandableObject.svelte'
    import JsonPrimitiveValue from './JsonPrimitiveValue.svelte'
    import type { JsonRenderProps } from './types.js'
    import { isArray, isDate, isFunction, isObject } from './utils/dataTypeDetection.js'

    // Svelte parses `"{"` as an expression opener; stashing the braces as
    // constants avoids the parse error and the no-useless-mustaches lint.
    const OBJECT_OPEN = '{'
    const OBJECT_CLOSE = '}'

    const props: JsonRenderProps<unknown> = $props()
    const value = $derived(props.value)

    // Array check first — arrays are also objects, so order matters.
    const isArr = $derived(isArray(value))
    const isObj = $derived(isObject(value) && !isDate(value) && !isFunction(value))

    // The children tuple array is NOT built here: a collapsed node only needs
    // its child *count*, and materializing `Array<[key, value]>` for every
    // node (a 100k-element array = 100k throwaway tuples at mount under
    // collapseAllNested) is pure waste. ExpandableObject derives the tuples
    // lazily, gated on its own `expanded` state. See issue #21.
</script>

{#if isArr}
    <ExpandableObject
        {...props}
        value={value as unknown[]}
        isArray={true}
        openBracket="["
        closeBracket="]"
    />
{:else if isObj}
    <ExpandableObject
        {...props}
        value={value as object}
        isArray={false}
        openBracket={OBJECT_OPEN}
        closeBracket={OBJECT_CLOSE}
    />
{:else}
    <JsonPrimitiveValue
        {...props}
        value={value as
            | string
            | number
            | boolean
            | bigint
            | Date
            // trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
            | Function
            | null
            | undefined}
    />
{/if}
