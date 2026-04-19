import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'

/**
 * Event payload passed to `beforeExpandChange`. Return `false` to veto the
 * expand/collapse transition.
 */
export interface NodeExpandingEvent {
    level: number
    value: unknown
    field?: string
    newExpandValue: boolean
}

/** Screen-reader labels applied to expander buttons. */
export interface AriaLabels {
    collapseJson: string
    expandJson: string
}

/**
 * Classname-map used to theme every slot in the viewer. The `defaultStyles`
 * and `darkStyles` exports provide ready-made instances; consumers can spread
 * and override individual keys to customize the theme.
 */
export interface StyleProps {
    container: string
    basicChildStyle: string
    label: string
    clickableLabel: string
    nullValue: string
    undefinedValue: string
    numberValue: string
    stringValue: string
    booleanValue: string
    otherValue: string
    punctuation: string
    expandIcon: string
    collapseIcon: string
    collapsedContent: string
    childFieldsContainer: string
    noQuotesForStringValues?: boolean
    quotesForFieldNames?: boolean
    /**
     * Correctly-spelled aria labels. New in the Svelte port; `ariaLables`
     * (sic) continues to be accepted at runtime for one minor version with a
     * deprecation warning.
     */
    ariaLabels: AriaLabels
    /**
     * @deprecated Use `ariaLabels` (correctly spelled). The typoed key is
     * accepted at runtime for parity with `react-json-view-lite`; it will be
     * removed in 2.0.
     */
    ariaLables?: AriaLabels
    stringifyStringValues: boolean
}

/** Data passed to every per-type snippet override. */
export interface ValueSnippetProps<T> {
    value: T
    field?: string
    level: number
}

export type StringSnippetProps = ValueSnippetProps<string>
export type NumberSnippetProps = ValueSnippetProps<number>
export type BooleanSnippetProps = ValueSnippetProps<boolean>
export type NullSnippetProps = ValueSnippetProps<null>
export type UndefinedSnippetProps = ValueSnippetProps<undefined>
export type BigIntSnippetProps = ValueSnippetProps<bigint>
export type DateSnippetProps = ValueSnippetProps<Date>
// trunk-ignore(eslint/@typescript-eslint/no-unsafe-function-type)
export type FunctionSnippetProps = ValueSnippetProps<Function>

/** Data passed to the `label` snippet override for field names. */
export interface LabelSnippetProps {
    field: string
    level: number
}

/**
 * Bag of optional per-type snippets that replace default value rendering.
 * Each snippet receives the typed value, its field name (if any), and the
 * depth of the node.
 */
export interface SnippetOverrides {
    string?: Snippet<[StringSnippetProps]>
    number?: Snippet<[NumberSnippetProps]>
    boolean?: Snippet<[BooleanSnippetProps]>
    null?: Snippet<[NullSnippetProps]>
    undefined?: Snippet<[UndefinedSnippetProps]>
    bigint?: Snippet<[BigIntSnippetProps]>
    date?: Snippet<[DateSnippetProps]>
    function?: Snippet<[FunctionSnippetProps]>
    label?: Snippet<[LabelSnippetProps]>
}

/** Public props accepted by `<JsonView>`. */
export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'data' | 'style'> {
    data: object | unknown[]
    style?: Partial<StyleProps>
    shouldExpandNode?: (_level: number, _value: unknown, _field?: string) => boolean
    clickToExpandNode?: boolean
    beforeExpandChange?: (_event: NodeExpandingEvent) => boolean
    compactTopLevel?: boolean
    string?: Snippet<[StringSnippetProps]>
    number?: Snippet<[NumberSnippetProps]>
    boolean?: Snippet<[BooleanSnippetProps]>
    null?: Snippet<[NullSnippetProps]>
    undefined?: Snippet<[UndefinedSnippetProps]>
    bigint?: Snippet<[BigIntSnippetProps]>
    date?: Snippet<[DateSnippetProps]>
    function?: Snippet<[FunctionSnippetProps]>
    label?: Snippet<[LabelSnippetProps]>
}

/**
 * Reference wrapper passed from the root down to every expandable node so
 * that cross-sibling keyboard navigation can query `[role=button]` elements
 * scoped to the tree. Using a getter ensures the child always reads the
 * current `bind:this` target rather than a frozen snapshot.
 */
export interface OuterRef {
    readonly current: HTMLDivElement | null
}

/** Internal shared props threaded through every renderer. Not exported. */
export interface CommonRenderProps {
    lastElement: boolean
    level: number
    style: StyleProps
    shouldExpandNode: (_level: number, _value: unknown, _field?: string) => boolean
    clickToExpandNode: boolean
    outerRef: OuterRef
    beforeExpandChange?: (_event: NodeExpandingEvent) => boolean
    snippets: SnippetOverrides
}

export interface JsonRenderProps<T> extends CommonRenderProps {
    field?: string
    value: T
}

export interface ExpandableRenderProps extends CommonRenderProps {
    field?: string
    value: object | unknown[]
    data: Array<[string | undefined, unknown]>
    openBracket: string
    closeBracket: string
}

export interface EmptyRenderProps {
    field?: string
    openBracket: string
    closeBracket: string
    lastElement: boolean
    style: StyleProps
}
