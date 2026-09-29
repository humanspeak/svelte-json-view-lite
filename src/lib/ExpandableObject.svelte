<script lang="ts">
    import { untrack } from 'svelte'
    import DataRender from './DataRender.svelte'
    import type { AriaLabels, ExpandableRenderProps, ExpansionStrategy } from './types.js'
    import { quoteString } from './utils/quoteString.js'

    const {
        field,
        value,
        isArray,
        lastElement,
        openBracket,
        closeBracket,
        level,
        style,
        shouldExpandNode,
        clickToExpandNode,
        outerRef,
        beforeExpandChange,
        childrenTransition,
        snippets
    }: ExpandableRenderProps = $props()

    // Capture initial expansion once; only a new strategy or a user toggle
    // changes it. Data/theme updates preserve the user's manual override.
    // svelte-ignore state_referenced_locally
    let expanded = $state(shouldExpandNode(level, value, field))

    // Once a node has been opened we keep its children materialized, even after
    // it collapses again: re-deriving the tuple array (and re-reading N child
    // values) on every re-expand would be its own waste. Latches true, stays true.
    // svelte-ignore state_referenced_locally
    let hasMaterialized = $state(expanded)

    let appliedStrategy = untrack(() => shouldExpandNode)

    // Preserve the child cache through both strategy changes and user toggles.
    function applyExpanded(next: boolean) {
        expanded = next
        if (next) hasMaterialized = true
    }

    const updateExpansion = (fn: ExpansionStrategy) => {
        if (appliedStrategy === fn) return
        appliedStrategy = fn
        applyExpanded(fn(level, value, field))
    }

    // SSR-stable id for aria-controls linkage.
    const contentsId = $props.id()

    let expanderButton = $state<HTMLSpanElement | null>(null)
    let expanderHovered = $state(false)
    let expanderFocused = $state(false)

    function containerSnippetProps() {
        return { field, value, level, expanded, count, isArray }
    }

    // A custom group may retain exiting children (for example AnimatePresence).
    // Move focus before its inert attribute is patched, and restore navigation
    // immediately on a reversal. The renderer only owns the visual lifecycle.
    $effect.pre(() => {
        if (!snippets.childGroup) return
        const opening = expanded
        untrack(() => {
            const group = outerRef.current?.querySelector<HTMLElement>(`[id="${contentsId}"]`)
            if (!group) return
            if (opening) group.removeAttribute('aria-hidden')
            else hideChildren(group)
        })
    })

    // Registration belongs to the component rather than its default DOM wrapper,
    // so replacing a row snippet cannot change expansion or keyboard behavior.
    $effect(() => {
        outerRef.expansionListeners.add(updateExpansion)
        return () => outerRef.expansionListeners.delete(updateExpansion)
    })
    $effect(() => {
        const button = expanderButton
        if (button) return untrack(() => outerRef.navigation.register(button))
    })

    const activeAriaLabels = $derived<AriaLabels>(
        style.ariaLabels ??
            style.ariaLables ?? {
                collapseJson: 'collapse JSON',
                expandJson: 'expand JSON'
            }
    )
    const expanderIconStyle = $derived(expanded ? style.collapseIcon : style.expandIcon)
    const ariaLabel = $derived(
        expanded ? activeAriaLabels.collapseJson : activeAriaLabels.expandJson
    )
    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))

    // Object keys resolved once and shared by the count and the tuple builder,
    // so an expanded object node enumerates its keys a single time. Arrays skip
    // this entirely — their length is free.
    const objectKeys = $derived(isArray ? null : Object.keys(value as Record<string, unknown>))

    // Child *count* is cheap — array length, or the key count for objects.
    // Neither touches child *values*, so a collapsed node stays allocation-free.
    const count = $derived(objectKeys ? objectKeys.length : (value as unknown[]).length)

    // The tuple array is materialized lazily on first open, then kept: a node
    // that is never expanded never allocates its N tuples or reads its N child
    // values (#21); one that has been opened doesn't re-read them on re-expand.
    const entries = $derived.by<Array<[string | undefined, unknown]>>(() => {
        if (!hasMaterialized) return []
        if (isArray) return (value as unknown[]).map((el) => [undefined, el])
        const obj = value as Record<string, unknown>
        return (objectKeys as string[]).map((k) => [k, obj[k]])
    })

    function transitionChildren(node: HTMLElement) {
        return childrenTransition?.(node) ?? { duration: 0 }
    }

    function hideExitingChildren(event: Event) {
        hideChildren(event.currentTarget as HTMLElement)
    }

    function hideChildren(group: HTMLElement) {
        group.setAttribute('aria-hidden', 'true')
        // Exiting children stay mounted visually, but leave keyboard navigation
        // immediately. Move a descendant's roving tab stop back to its parent.
        if (expanderButton && group.querySelector('[role="button"][tabindex="0"]')) {
            outerRef.navigation.activate(expanderButton)
            if (group.contains(document.activeElement)) expanderButton.focus()
        }
    }

    function showEnteringChildren(event: Event) {
        const group = event.currentTarget as HTMLElement
        group.removeAttribute('aria-hidden')
    }

    function setExpandWithCallback(newExpandValue: boolean) {
        if (expanded === newExpandValue) return
        if (beforeExpandChange && !beforeExpandChange({ level, value, field, newExpandValue })) {
            return
        }
        applyExpanded(newExpandValue)
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            setExpandWithCallback(e.key === 'ArrowRight')
            return
        }
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
        e.preventDefault()
        const direction = e.key === 'ArrowUp' ? -1 : 1
        if (expanderButton) outerRef.navigation.move(expanderButton, direction)
    }

    function onClick() {
        setExpandWithCallback(!expanded)
        if (!expanderButton) return
        outerRef.navigation.activate(expanderButton)
        expanderButton.focus()
    }
</script>

{#snippet childRows()}
    {#each entries as [childField, childValue], index (childField ?? index)}<DataRender
            field={childField}
            value={childValue}
            {style}
            lastElement={index === count - 1}
            level={level + 1}
            {shouldExpandNode}
            {clickToExpandNode}
            {beforeExpandChange}
            {childrenTransition}
            {outerRef}
            {snippets}
        />{/each}
{/snippet}

{#snippet rowContent()}
    {#if count === 0}
        <!-- prettier-ignore -->
        {#if field !== undefined}{#if snippets.label}{@render snippets.label({ field, level })}{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}<span
            class={style.punctuation}>{openBracket}{closeBracket}{lastElement ? '' : ','}</span
        >
    {:else}
        <!--
            The entire inline sequence inside a row lives on a single
            prettier-ignored line because Svelte preserves template whitespace
            between adjacent elements (expander→label→openBracket→children→
            closeBracket) as visible spaces under the container's
            `white-space: pre-wrap`. React/JSX strips that whitespace natively;
            we have to hand-collapse it. The `<ul>` of children is block-level
            so the whitespace around it is not layout-significant, but we keep
            it tight anyway for a consistent rule.
        -->
        <!-- prettier-ignore -->
        <span bind:this={expanderButton} class={expanderIconStyle} data-custom-expander={snippets.expander ? '' : undefined} role="button" aria-label={ariaLabel} aria-expanded={expanded} aria-controls={expanded ? contentsId : undefined} tabindex={level === 0 ? 0 : -1} onclick={onClick} onkeydown={onKeyDown} onpointerenter={snippets.expander ? () => (expanderHovered = true) : undefined} onpointerleave={snippets.expander ? () => (expanderHovered = false) : undefined} onfocus={snippets.expander ? () => (expanderFocused = true) : undefined} onblur={snippets.expander ? () => (expanderFocused = false) : undefined}>{#if snippets.expander}{@render snippets.expander({ ...containerSnippetProps(), hovered: expanderHovered, focused: expanderFocused })}{/if}</span>{#if field !== undefined}{#if snippets.label}{@render snippets.label(
                    { field: field ?? '', level }
                )}{:else if clickToExpandNode}<!-- svelte-ignore a11y_no_static_element_interactions --><span
                    class={style.clickableLabel}
                    onclick={onClick}
                    onkeydown={onKeyDown}>{labelText}:</span
                >{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}<span
            class={style.punctuation}>{openBracket}</span
        >{#if snippets.childGroup}{@render snippets.childGroup({
                ...containerSnippetProps(),
                attrs: {
                    id: contentsId,
                    role: 'group',
                    class: style.childFieldsContainer,
                    'aria-hidden': expanded ? undefined : true,
                    inert: expanded ? undefined : true
                },
                children: childRows
            })}{:else if expanded}<ul
                id={contentsId}
                role="group"
                class={style.childFieldsContainer}
                transition:transitionChildren
                onoutrostart={hideExitingChildren}
                onintrostart={showEnteringChildren}
            >
                {@render childRows()}
            </ul>{/if}{#if !expanded && !snippets.collapsed}<!-- svelte-ignore a11y_no_static_element_interactions --><span
                class={style.collapsedContent}
                onclick={onClick}
                onkeydown={onKeyDown}
            ></span>{/if}<!-- svelte-ignore a11y_no_static_element_interactions --><span
            class={style.punctuation}
            onclick={snippets.collapsed && !expanded ? onClick : undefined}
            onkeydown={snippets.collapsed && !expanded ? onKeyDown : undefined}
            >{#if snippets.collapsed}{@render snippets.collapsed(
                    containerSnippetProps()
                )}{/if}{closeBracket}{lastElement ? '' : ','}</span
        >
    {/if}
{/snippet}

{#if snippets.row}
    {@render snippets.row({
        id: `${contentsId}-row`,
        field,
        value,
        level,
        isContainer: true,
        expanded: count === 0 ? undefined : expanded,
        attrs: {
            class: style.basicChildStyle,
            role: 'treeitem',
            'aria-expanded': count === 0 ? undefined : expanded
        },
        children: rowContent
    })}
{:else}
    <!-- svelte-ignore a11y_role_has_required_aria_props -->
    <div
        class={style.basicChildStyle}
        role="treeitem"
        aria-expanded={count === 0 ? undefined : expanded}
    >
        {@render rowContent()}
    </div>
{/if}
