<script lang="ts">
    import type { JsonRenderProps, SnippetOverrides } from './types.js'
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

    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))

    // `text`/`valueStyle` are common to every kind; only the discriminant and
    // its snippet type vary. The intersection keeps `primitive.kind === 'x'`
    // narrowing `primitive.snippet` to the one correct Snippet in the template.
    type PrimitiveRender = { text: string; valueStyle: string } & (
        | { kind: 'null'; snippet: SnippetOverrides['null'] }
        | { kind: 'undefined'; snippet: SnippetOverrides['undefined'] }
        | { kind: 'string'; snippet: SnippetOverrides['string'] }
        | { kind: 'boolean'; snippet: SnippetOverrides['boolean'] }
        | { kind: 'number'; snippet: SnippetOverrides['number'] }
        | { kind: 'bigint'; snippet: SnippetOverrides['bigint'] }
        | { kind: 'date'; snippet: SnippetOverrides['date'] }
        | { kind: 'function'; snippet: SnippetOverrides['function'] }
        | { kind: 'other'; snippet: undefined }
    )

    // One predicate walk returns everything the row needs, avoiding three
    // separate reactions for the same primitive classification.
    const primitive = $derived.by<PrimitiveRender>(() => {
        if (value === null) {
            return {
                kind: 'null',
                text: 'null',
                valueStyle: style.nullValue,
                snippet: snippets.null
            }
        }
        if (value === undefined) {
            return {
                kind: 'undefined',
                text: 'undefined',
                valueStyle: style.undefinedValue,
                snippet: snippets.undefined
            }
        }
        if (isString(value)) {
            return {
                kind: 'string',
                text: quoteStringValue(
                    value,
                    !style.noQuotesForStringValues,
                    style.stringifyStringValues
                ),
                valueStyle: style.stringValue,
                snippet: snippets.string
            }
        }
        if (isBoolean(value)) {
            return {
                kind: 'boolean',
                text: value ? 'true' : 'false',
                valueStyle: style.booleanValue,
                snippet: snippets.boolean
            }
        }
        if (isNumber(value)) {
            return {
                kind: 'number',
                text: String(value),
                valueStyle: style.numberValue,
                snippet: snippets.number
            }
        }
        if (isBigInt(value)) {
            return {
                kind: 'bigint',
                text: `${value.toString()}n`,
                valueStyle: style.numberValue,
                snippet: snippets.bigint
            }
        }
        if (isDate(value)) {
            return {
                kind: 'date',
                text: value.toISOString(),
                valueStyle: style.otherValue,
                snippet: snippets.date
            }
        }
        if (isFunction(value)) {
            return {
                kind: 'function',
                text: 'function() { }',
                valueStyle: style.otherValue,
                snippet: snippets.function
            }
        }
        return {
            kind: 'other',
            text: String(value),
            valueStyle: style.otherValue,
            snippet: undefined
        }
    })
</script>

<!--
    The entire row body lives on a single prettier-ignored line because Svelte
    preserves template whitespace between adjacent elements as visible spaces
    under the container's `white-space: pre-wrap`. React/JSX strips that
    whitespace natively; we hand-collapse it. Per-type snippet branches key
    off the merged primitive render model rather than re-running predicates.
-->
<!-- Upstream parity: unselected treeitems omit aria-selected entirely. -->
<!-- svelte-ignore a11y_role_has_required_aria_props -->
<div class={style.basicChildStyle} role="treeitem">
    <!-- prettier-ignore -->
    {#if field !== undefined}{#if snippets.label}{@render snippets.label({ field: field ?? '', level })}{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}{#if primitive.snippet && primitive.kind === 'null'}{@render primitive.snippet(
            { value: null, field, level }
        )}{:else if primitive.snippet && primitive.kind === 'undefined'}{@render primitive.snippet({
            value: undefined,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'string'}{@render primitive.snippet({
            value: value as string,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'boolean'}{@render primitive.snippet({
            value: value as boolean,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'number'}{@render primitive.snippet({
            value: value as number,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'bigint'}{@render primitive.snippet({
            value: value as bigint,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'date'}{@render primitive.snippet({
            value: value as Date,
            field,
            level
        })}{:else if primitive.snippet && primitive.kind === 'function'}{@render primitive.snippet({
            // trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
            value: value as Function,
            field,
            level
        })}{:else}<span class={primitive.valueStyle}>{primitive.text}</span
        >{/if}{#if !lastElement}<span class={style.punctuation}>,</span>{/if}
</div>
