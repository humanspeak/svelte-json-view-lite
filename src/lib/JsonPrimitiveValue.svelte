<script lang="ts">
    import type { JsonRenderProps } from './types.js'
    import {
        isBigInt,
        isBoolean,
        isDate,
        isFunction,
        isNumber,
        isString
    } from './utils/dataTypeDetection.js'
    import { quoteString, quoteStringValue } from './utils/quoteString.js'

    // trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
    type Primitive = string | number | boolean | bigint | Date | Function | null | undefined
    const { field, value, style, lastElement, level, snippets }: JsonRenderProps<Primitive> =
        $props()

    const hasField = $derived(field !== undefined)
    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))

    type Rendered = { text: string; valueStyle: string }
    const rendered = $derived.by<Rendered>(() => {
        if (value === null) return { text: 'null', valueStyle: style.nullValue }
        if (value === undefined) return { text: 'undefined', valueStyle: style.undefinedValue }
        if (isString(value))
            return {
                text: quoteStringValue(
                    value,
                    !style.noQuotesForStringValues,
                    style.stringifyStringValues
                ),
                valueStyle: style.stringValue
            }
        if (isBoolean(value))
            return { text: value ? 'true' : 'false', valueStyle: style.booleanValue }
        if (isNumber(value)) return { text: value.toString(), valueStyle: style.numberValue }
        if (isBigInt(value)) return { text: `${value.toString()}n`, valueStyle: style.numberValue }
        if (isDate(value)) return { text: value.toISOString(), valueStyle: style.otherValue }
        if (isFunction(value)) return { text: 'function() { }', valueStyle: style.otherValue }
        return { text: String(value), valueStyle: style.otherValue }
    })

    const snippetForValue = $derived.by(() => {
        if (value === null) return snippets.null
        if (value === undefined) return snippets.undefined
        if (isString(value)) return snippets.string
        if (isBoolean(value)) return snippets.boolean
        if (isNumber(value)) return snippets.number
        if (isBigInt(value)) return snippets.bigint
        if (isDate(value)) return snippets.date
        if (isFunction(value)) return snippets.function
        return undefined
    })
</script>

<!--
    The entire row body lives on a single prettier-ignored line because Svelte
    preserves template whitespace between adjacent elements (e.g. between the
    label span and the value span, or between the value and the trailing
    comma). Those whitespace text nodes render as visible spaces under the
    container's `white-space: pre-wrap`. React/JSX strips that whitespace
    natively; we have to hand-collapse it. Every margin we need is provided
    by the CSS module (e.g. `.label { margin-right: 5px; }`).
-->
<div class={style.basicChildStyle} role="treeitem" aria-selected={false}>
    <!-- prettier-ignore -->
    {#if hasField}{#if snippets.label}{@render snippets.label({ field: field ?? '', level })}{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}{#if snippetForValue && value === null}{@render snippets.null?.(
            { value: null, field, level }
        )}{:else if snippetForValue && value === undefined}{@render snippets.undefined?.({
            value: undefined,
            field,
            level
        })}{:else if snippetForValue && isString(value)}{@render snippets.string?.({
            value,
            field,
            level
        })}{:else if snippetForValue && isBoolean(value)}{@render snippets.boolean?.({
            value,
            field,
            level
        })}{:else if snippetForValue && isNumber(value)}{@render snippets.number?.({
            value,
            field,
            level
        })}{:else if snippetForValue && isBigInt(value)}{@render snippets.bigint?.({
            value,
            field,
            level
        })}{:else if snippetForValue && isDate(value)}{@render snippets.date?.({
            value,
            field,
            level
        })}{:else if snippetForValue && isFunction(value)}{@render snippets.function?.({
            value,
            field,
            level
        })}{:else}<span class={rendered.valueStyle}>{rendered.text}</span
        >{/if}{#if !lastElement}<span class={style.punctuation}>,</span>{/if}
</div>
