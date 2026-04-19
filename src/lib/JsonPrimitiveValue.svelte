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

    type ValueKind =
        | 'null'
        | 'undefined'
        | 'string'
        | 'boolean'
        | 'number'
        | 'bigint'
        | 'date'
        | 'function'
        | 'other'

    // A single predicate walk picks the discriminant; `rendered`, the
    // snippet lookup, and the template all key off `kind` so the 8-way
    // type ladder is evaluated once per render instead of three times.
    const kind = $derived.by<ValueKind>(() => {
        if (value === null) return 'null'
        if (value === undefined) return 'undefined'
        if (isString(value)) return 'string'
        if (isBoolean(value)) return 'boolean'
        if (isNumber(value)) return 'number'
        if (isBigInt(value)) return 'bigint'
        if (isDate(value)) return 'date'
        if (isFunction(value)) return 'function'
        return 'other'
    })

    type Rendered = { text: string; valueStyle: string }
    const rendered = $derived.by<Rendered>(() => {
        switch (kind) {
            case 'null':
                return { text: 'null', valueStyle: style.nullValue }
            case 'undefined':
                return { text: 'undefined', valueStyle: style.undefinedValue }
            case 'string':
                return {
                    text: quoteStringValue(
                        value as string,
                        !style.noQuotesForStringValues,
                        style.stringifyStringValues
                    ),
                    valueStyle: style.stringValue
                }
            case 'boolean':
                return {
                    text: (value as boolean) ? 'true' : 'false',
                    valueStyle: style.booleanValue
                }
            case 'number':
                return { text: String(value), valueStyle: style.numberValue }
            case 'bigint':
                return {
                    text: `${(value as bigint).toString()}n`,
                    valueStyle: style.numberValue
                }
            case 'date':
                return { text: (value as Date).toISOString(), valueStyle: style.otherValue }
            case 'function':
                return { text: 'function() { }', valueStyle: style.otherValue }
            default:
                return { text: String(value), valueStyle: style.otherValue }
        }
    })

    const activeSnippet = $derived.by(() => {
        switch (kind) {
            case 'null':
                return snippets.null
            case 'undefined':
                return snippets.undefined
            case 'string':
                return snippets.string
            case 'boolean':
                return snippets.boolean
            case 'number':
                return snippets.number
            case 'bigint':
                return snippets.bigint
            case 'date':
                return snippets.date
            case 'function':
                return snippets.function
            default:
                return undefined
        }
    })
</script>

<!--
    The entire row body lives on a single prettier-ignored line because Svelte
    preserves template whitespace between adjacent elements as visible spaces
    under the container's `white-space: pre-wrap`. React/JSX strips that
    whitespace natively; we hand-collapse it. Per-type snippet branches key
    off `kind` rather than re-running predicates.
-->
<div class={style.basicChildStyle} role="treeitem" aria-selected={false}>
    <!-- prettier-ignore -->
    {#if hasField}{#if snippets.label}{@render snippets.label({ field: field ?? '', level })}{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}{#if activeSnippet && kind === 'null'}{@render snippets.null?.(
            { value: null, field, level }
        )}{:else if activeSnippet && kind === 'undefined'}{@render snippets.undefined?.({
            value: undefined,
            field,
            level
        })}{:else if activeSnippet && kind === 'string'}{@render snippets.string?.({
            value: value as string,
            field,
            level
        })}{:else if activeSnippet && kind === 'boolean'}{@render snippets.boolean?.({
            value: value as boolean,
            field,
            level
        })}{:else if activeSnippet && kind === 'number'}{@render snippets.number?.({
            value: value as number,
            field,
            level
        })}{:else if activeSnippet && kind === 'bigint'}{@render snippets.bigint?.({
            value: value as bigint,
            field,
            level
        })}{:else if activeSnippet && kind === 'date'}{@render snippets.date?.({
            value: value as Date,
            field,
            level
        })}{:else if activeSnippet && kind === 'function'}{@render snippets.function?.({
            // trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
            value: value as Function,
            field,
            level
        })}{:else}<span class={rendered.valueStyle}>{rendered.text}</span
        >{/if}{#if !lastElement}<span class={style.punctuation}>,</span>{/if}
</div>
