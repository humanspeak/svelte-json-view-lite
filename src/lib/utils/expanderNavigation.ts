import type { ExpanderNavigation } from '../types.js'

interface ExpanderNode {
    element: HTMLElement
    previous: ExpanderNode | null
    next: ExpanderNode | null
}

/**
 * Create the tree-local roving tabindex controller for expandable JSON nodes.
 *
 * Each expander registers its own button on mount and receives a cleanup
 * callback for unmount. The controller stores buttons in document order as a
 * linked list, so ArrowUp/ArrowDown can move from the current button to its
 * neighbor without querying `[role=button]` or scanning `tabIndex` across the
 * whole tree on every keypress.
 *
 * @returns A navigation controller shared by every expandable node in one
 * `JsonView` tree.
 *
 * @example
 * ```ts
 * const navigation = createExpanderNavigation()
 * const cleanup = navigation.register(button)
 * navigation.move(button, 1)
 * cleanup()
 * ```
 */
export const createExpanderNavigation = (): ExpanderNavigation => {
    const nodes = new WeakMap<HTMLElement, ExpanderNode>()
    let first: ExpanderNode | null = null
    let last: ExpanderNode | null = null
    let active: ExpanderNode | null = null

    /**
     * Detach a node from the linked list while preserving the surrounding
     * neighbors. The caller owns deleting it from the lookup table.
     *
     * @param node - Registered expander node to remove from document order.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * unlink(node)
     * ```
     */
    const unlink = (node: ExpanderNode) => {
        if (node.previous) node.previous.next = node.next
        else first = node.next

        if (node.next) node.next.previous = node.previous
        else last = node.previous

        node.previous = null
        node.next = null
    }

    /**
     * Insert a registered node before another registered node in document
     * order.
     *
     * @param node - Expander node being inserted.
     * @param before - Existing expander node that currently follows `node`.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * insertBefore(node, before)
     * ```
     */
    const insertBefore = (node: ExpanderNode, before: ExpanderNode) => {
        node.previous = before.previous
        node.next = before
        if (before.previous) before.previous.next = node
        else first = node
        before.previous = node
    }

    /**
     * Append a registered node to the end of the document-order list.
     *
     * @param node - Expander node being appended.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * append(node)
     * ```
     */
    const append = (node: ExpanderNode) => {
        node.previous = last
        if (last) last.next = node
        else first = node
        last = node
    }

    /**
     * Make one registered button the active roving tabindex target.
     *
     * @param button - Expander button that should receive `tabIndex=0`.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * navigation.activate(button)
     * ```
     */
    const activate = (button: HTMLElement) => {
        const node = nodes.get(button)
        if (!node) return

        if (active && active !== node) active.element.tabIndex = -1
        active = node
        node.element.tabIndex = 0
    }

    /**
     * Remove a button from the controller and keep a usable roving target when
     * the active button unmounts.
     *
     * @param button - Expander button previously returned by `register`.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * unregister(button)
     * ```
     */
    const unregister = (button: HTMLElement) => {
        const node = nodes.get(button)
        if (!node) return

        const fallback = node.next ?? node.previous
        const wasActive = active === node
        nodes.delete(button)
        unlink(node)

        if (wasActive) {
            active = null
            if (fallback) activate(fallback.element)
        }
    }

    /**
     * Register a mounted expander button in document order.
     *
     * @param button - Expander button rendered by an `ExpandableObject`.
     * @returns Cleanup callback that unregisters `button` on component unmount.
     *
     * @example
     * ```ts
     * const cleanup = navigation.register(button)
     * cleanup()
     * ```
     */
    const register = (button: HTMLElement) => {
        const existing = nodes.get(button)
        if (existing) return () => unregister(button)

        const node: ExpanderNode = { element: button, previous: null, next: null }
        nodes.set(button, node)

        let before: ExpanderNode | null = null
        for (let cursor = first; cursor; cursor = cursor.next) {
            if (button.compareDocumentPosition(cursor.element) & Node.DOCUMENT_POSITION_FOLLOWING) {
                before = cursor
                break
            }
        }

        if (before) insertBefore(node, before)
        else append(node)

        if (!active || button.tabIndex === 0) activate(button)

        return () => unregister(button)
    }

    /**
     * Move focus to the adjacent registered expander, wrapping at list edges.
     *
     * @param button - Current expander button handling the keypress.
     * @param direction - `1` for ArrowDown, `-1` for ArrowUp.
     * @returns Nothing.
     *
     * @example
     * ```ts
     * navigation.move(button, 1)
     * ```
     */
    const move = (button: HTMLElement, direction: -1 | 1) => {
        const current = nodes.get(button)
        if (!current) return

        const next = direction === 1 ? (current.next ?? first) : (current.previous ?? last)
        if (!next) return

        activate(next.element)
        next.element.focus()
    }

    return { register, activate, move }
}
