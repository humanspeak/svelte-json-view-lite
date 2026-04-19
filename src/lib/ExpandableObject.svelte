<script lang="ts">
    import DataRender from './DataRender.svelte'
    import EmptyObject from './EmptyObject.svelte'
    import type { AriaLabels, ExpandableRenderProps } from './types.js'
    import { quoteString } from './utils/quoteString.js'

    const {
        field,
        value,
        data,
        lastElement,
        openBracket,
        closeBracket,
        level,
        style,
        shouldExpandNode,
        clickToExpandNode,
        outerRef,
        beforeExpandChange,
        snippets
    }: ExpandableRenderProps = $props()

    // Initial expand state captured once on mount; the effect below
    // re-runs only when the callback identity changes so level/value/
    // field mutations from ancestor re-renders don't collapse the node.
    // svelte-ignore state_referenced_locally
    let expanded = $state(shouldExpandNode(level, value, field))

    let shouldExpandNodeCalled = false

    $effect(() => {
        const fn = shouldExpandNode
        if (!shouldExpandNodeCalled) {
            shouldExpandNodeCalled = true
            return
        }
        expanded = fn(level, value, field)
    })

    // SSR-stable id for aria-controls linkage.
    const contentsId = $props.id()

    let expanderButton = $state<HTMLSpanElement | null>(null)

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
    const childLevel = $derived(level + 1)
    const lastIndex = $derived(data.length - 1)
    const hasField = $derived(field !== undefined)
    const labelText = $derived(quoteString(field ?? '', style.quotesForFieldNames))

    function setExpandWithCallback(newExpandValue: boolean) {
        if (expanded === newExpandValue) return
        if (beforeExpandChange && !beforeExpandChange({ level, value, field, newExpandValue })) {
            return
        }
        expanded = newExpandValue
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
        const outer = outerRef.current
        if (!outer) return
        const buttons = outer.querySelectorAll<HTMLElement>('[role=button]')
        let currentIndex = -1
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].tabIndex === 0) {
                currentIndex = i
                break
            }
        }
        if (currentIndex < 0) return
        const nextIndex = (currentIndex + direction + buttons.length) % buttons.length
        buttons[currentIndex].tabIndex = -1
        buttons[nextIndex].tabIndex = 0
        buttons[nextIndex].focus()
    }

    function onClick() {
        setExpandWithCallback(!expanded)
        if (!expanderButton) return
        const prev = outerRef.current?.querySelector<HTMLElement>('[role=button][tabindex="0"]')
        if (prev) prev.tabIndex = -1
        expanderButton.tabIndex = 0
        expanderButton.focus()
    }
</script>

{#if data.length === 0}
    <EmptyObject {field} {openBracket} {closeBracket} {lastElement} {style} />
{:else}
    <div
        class={style.basicChildStyle}
        role="treeitem"
        aria-expanded={expanded}
        aria-selected={false}
    >
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
        <span bind:this={expanderButton} class={expanderIconStyle} role="button" aria-label={ariaLabel} aria-expanded={expanded} aria-controls={expanded ? contentsId : undefined} tabindex={level === 0 ? 0 : -1} onclick={onClick} onkeydown={onKeyDown}></span>{#if hasField}{#if snippets.label}{@render snippets.label(
                    { field: field ?? '', level }
                )}{:else if clickToExpandNode}<!-- svelte-ignore a11y_no_static_element_interactions --><span
                    class={style.clickableLabel}
                    onclick={onClick}
                    onkeydown={onKeyDown}>{labelText}:</span
                >{:else}<span class={style.label}>{labelText}:</span>{/if}{/if}<span
            class={style.punctuation}>{openBracket}</span
        >{#if expanded}<ul id={contentsId} role="group" class={style.childFieldsContainer}>
                {#each data as [childField, childValue], index (childField ?? index)}<DataRender
                        field={childField}
                        value={childValue}
                        {style}
                        lastElement={index === lastIndex}
                        level={childLevel}
                        {shouldExpandNode}
                        {clickToExpandNode}
                        {beforeExpandChange}
                        {outerRef}
                        {snippets}
                    />{/each}
            </ul>{:else}<!-- svelte-ignore a11y_no_static_element_interactions --><span
                class={style.collapsedContent}
                onclick={onClick}
                onkeydown={onKeyDown}
            ></span>{/if}<span class={style.punctuation}
            >{closeBracket}{lastElement ? '' : ','}</span
        >
    </div>
{/if}
