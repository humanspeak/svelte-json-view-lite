import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { TransitionConfig } from 'svelte/transition'

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
    /** Omit separator commas between rows. Brackets and string content are preserved. @default false */
    hideCommas?: boolean
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

/** A row wrapper. Spread attrs on its root and render children exactly once. */
export interface RowSnippetProps {
    /** Stable node identity, suitable for animation keys or local selection. */
    id: string
    field?: string
    value: unknown
    level: number
    isContainer: boolean
    /** Present only for non-empty containers. */
    expanded?: boolean
    attrs: { class: string; role: 'treeitem'; 'aria-expanded'?: boolean }
    children: Snippet
}

/** State shared by container decoration and child-group snippets. */
export interface ContainerSnippetProps {
    field?: string
    value: object | unknown[]
    level: number
    expanded: boolean
    count: number
    isArray: boolean
}

/** Content inside the viewer-owned keyboard/ARIA expander button. */
export interface ExpanderSnippetProps extends ContainerSnippetProps {
    hovered: boolean
    focused: boolean
    /** Keyboard-visible focus, independent of native focus retained after a mouse click. */
    focusVisible: boolean
}

/** A persistent child-group rendering boundary that can own exit animations. */
export interface ChildGroupSnippetProps extends ContainerSnippetProps {
    /** Spread on the group element to retain its id, role, class and inert state. */
    attrs: { id: string; class: string; role: 'group'; 'aria-hidden'?: boolean; inert?: boolean }
    /** Render inside the group. Child values remain lazy until first expansion. */
    children: Snippet
}

/**
 * Optional structural and value renderers. Value snippets receive typed node
 * data; structural snippets additionally expose rendering/state contracts.
 */
export interface SnippetOverrides {
    row?: Snippet<[RowSnippetProps]>
    expander?: Snippet<[ExpanderSnippetProps]>
    collapsed?: Snippet<[ContainerSnippetProps]>
    childGroup?: Snippet<[ChildGroupSnippetProps]>
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

/** Optional local transition for each expandable node's child group. */
export type ChildrenTransition = (_node: HTMLElement) => TransitionConfig

/** Public props accepted by `<JsonView>`. */
export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'data' | 'style'> {
    row?: Snippet<[RowSnippetProps]>
    expander?: Snippet<[ExpanderSnippetProps]>
    collapsed?: Snippet<[ContainerSnippetProps]>
    childGroup?: Snippet<[ChildGroupSnippetProps]>
    data: object | unknown[]
    style?: Partial<StyleProps>
    shouldExpandNode?: (_level: number, _value: unknown, _field?: string) => boolean
    clickToExpandNode?: boolean
    /** Allow collapsed summary/punctuation to expand a node. Chevron behavior is unchanged. @default true */
    clickToExpandSummary?: boolean
    beforeExpandChange?: (_event: NodeExpandingEvent) => boolean
    compactTopLevel?: boolean
    /** Animate child groups on expansion/collapse. Omitted means instant updates. */
    childrenTransition?: ChildrenTransition
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

/** Internal expansion callbacks shared by one viewer's controller. */
export type ExpansionStrategy = NonNullable<Props['shouldExpandNode']>
export type ExpansionListener = (_strategy: ExpansionStrategy) => void

/**
 * Tree-local controller for roving tabindex across expandable nodes.
 *
 * The controller is intentionally passed through internal render props instead
 * of discovered from the DOM on every keypress. Each expander registers its
 * button while mounted, unregisters on `$effect` cleanup, and asks this helper
 * to activate or move focus when the user clicks or presses ArrowUp/ArrowDown.
 */
export interface ExpanderNavigation {
    /**
     * Add a mounted expander button to the navigation order.
     *
     * @param _button - Expander button element rendered by an expandable node.
     * @returns Cleanup callback that removes the button on component unmount.
     *
     * @example
     * ```ts
     * const cleanup = navigation.register(button)
     * cleanup()
     * ```
     */
    register(_button: HTMLElement): () => void

    /**
     * Make a registered button the only expander with `tabIndex=0`.
     *
     * @param _button - Registered expander button to activate.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * navigation.activate(button)
     * ```
     */
    activate(_button: HTMLElement): void

    /**
     * Move focus to the next or previous registered expander.
     *
     * @param _button - Current registered expander button.
     * @param _direction - `1` for ArrowDown, `-1` for ArrowUp.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * navigation.move(button, 1)
     * ```
     */
    move(_button: HTMLElement, _direction: -1 | 1): void
}

/**
 * Reference wrapper passed from the root down to every expandable node. Using
 * a getter ensures the child always reads the current `bind:this` target rather
 * than a frozen snapshot; the navigation helper keeps roving tabindex state
 * tree-local without doing live DOM sweeps on every keypress.
 */
export interface OuterRef {
    readonly current: HTMLDivElement | null
    readonly navigation: ExpanderNavigation
    readonly expansionListeners: Set<ExpansionListener>
}

/** Internal shared props threaded through every renderer. Not exported. */
export interface CommonRenderProps {
    childrenTransition?: ChildrenTransition
    lastElement: boolean
    level: number
    style: StyleProps
    shouldExpandNode: (_level: number, _value: unknown, _field?: string) => boolean
    clickToExpandNode: boolean
    clickToExpandSummary: boolean
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
    /** Whether `value` is an array. Resolved once by DataRender (the type
     *  dispatcher) so ExpandableObject never re-tests the value's shape. */
    isArray: boolean
    openBracket: string
    closeBracket: string
}
