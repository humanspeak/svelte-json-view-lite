<script lang="ts">
    import ExpandableObject from './ExpandableObject.svelte'
    import JsonPrimitiveValue from './JsonPrimitiveValue.svelte'
    import type { JsonRenderProps } from './types.js'
    import { isArray, isDate, isFunction, isObject } from './utils/dataTypeDetection.js'

    // Declared as constants because Svelte markup parses `"{"` as an
    // expression opener, and eslint's no-useless-mustaches objects to
    // `{'{'}` inline.
    const OBJECT_OPEN = '{'
    const OBJECT_CLOSE = '}'

    const props: JsonRenderProps<unknown> = $props()
    const value = $derived(props.value)

    // Array check first — arrays are also objects, so order matters.
    const isArr = $derived(isArray(value))
    const isObj = $derived(isObject(value) && !isDate(value) && !isFunction(value))
</script>

{#if isArr}
    <ExpandableObject
        {...props}
        value={value as unknown[]}
        data={(value as unknown[]).map((el) => [undefined, el])}
        openBracket="["
        closeBracket="]"
    />
{:else if isObj}
    <ExpandableObject
        {...props}
        value={value as object}
        data={Object.keys(value as object).map((k) => [k, (value as Record<string, unknown>)[k]])}
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
