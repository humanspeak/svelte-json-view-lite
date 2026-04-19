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

    // Memoize the children tuple array so ExpandableObject receives a
    // stable reference on parent re-renders when `value` itself hasn't
    // changed — otherwise a fresh array identity on every parent tick
    // invalidates the {#each} and cascades re-renders down the tree.
    const children = $derived.by<Array<[string | undefined, unknown]>>(() => {
        if (isArr) return (value as unknown[]).map((el) => [undefined, el])
        if (isObj) {
            const obj = value as Record<string, unknown>
            return Object.keys(obj).map((k) => [k, obj[k]])
        }
        return []
    })
</script>

{#if isArr}
    <ExpandableObject
        {...props}
        value={value as unknown[]}
        data={children}
        openBracket="["
        closeBracket="]"
    />
{:else if isObj}
    <ExpandableObject
        {...props}
        value={value as object}
        data={children}
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
