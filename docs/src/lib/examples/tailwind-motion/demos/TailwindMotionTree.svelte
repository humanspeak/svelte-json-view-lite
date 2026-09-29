<script lang="ts">
    import { JsonView, type Props, type StyleProps } from '@humanspeak/svelte-json-view-lite'
    import {
        animate,
        MotionButton,
        MotionDiv,
        MotionSpan,
        useReducedMotion
    } from '@humanspeak/svelte-motion'

    const motionId = $props.id()
    const reducedMotion = useReducedMotion()
    let animateDemo = $state(true)
    const motionEnabled = $derived(animateDemo && !reducedMotion.current)
    let palette = $state('dusk')
    let compact = $state(false)
    let shouldExpandNode = $state<NonNullable<Props['shouldExpandNode']>>((level) => level < 3)

    const payload = {
        user: {
            id: 12345,
            name: 'Ada Lovelace',
            email: 'ada@example.com',
            verified: true,
            profile: {
                role: 'Creative developer',
                bio: 'Building thoughtful interfaces, one small detail at a time.',
                preferences: { theme: 'dark', notifications: true, language: 'en' }
            }
        },
        workspace: {
            name: 'The good stuff',
            plan: 'pro',
            members: 8,
            tags: ['design', 'engineering', 'a little bit of magic'],
            usage: { projects: 24, storageGB: 3.8, unlimited: false }
        },
        delivery: {
            endpoint: 'https://api.example.com/v1/workspaces/creative-studio/events',
            retries: 3,
            lastError: null,
            enabled: true
        }
    }

    // Tailwind scans these complete class names. The small CSS block below
    // handles the recursive row geometry.
    const treeStyle: Partial<StyleProps> = {
        container: 'font-sans text-sm leading-6',
        basicChildStyle: 'tw-row relative flex flex-wrap items-start gap-x-2',
        label: 'tw-label shrink-0 font-medium text-[var(--tree-label)]',
        clickableLabel: 'tw-label shrink-0 cursor-pointer font-medium text-[var(--tree-label)]',
        stringValue: 'tw-value min-w-0 flex-1 text-[var(--tree-string)]',
        numberValue: 'tw-value min-w-0 flex-1 text-[var(--tree-number)]',
        booleanValue: 'tw-value min-w-0 flex-1 text-[var(--tree-boolean)]',
        nullValue: 'tw-value min-w-0 flex-1 italic text-[var(--tree-muted)]',
        undefinedValue: 'tw-value min-w-0 flex-1 italic text-[var(--tree-muted)]',
        otherValue: 'tw-value min-w-0 flex-1 text-[var(--tree-container)]',
        punctuation: 'tw-punctuation text-[var(--tree-container)]',
        expandIcon: 'tw-toggle tw-closed',
        collapseIcon: 'tw-toggle tw-open',
        collapsedContent: 'tw-summary cursor-pointer text-[var(--tree-muted)]',
        childFieldsContainer: 'tw-children order-last basis-full list-none'
    }

    // Playback registries are imperative cleanup bookkeeping, not rendered state.
    // trunk-ignore(eslint/svelte/prefer-svelte-reactivity)
    const groupAnimations = new Map<HTMLElement, ReturnType<typeof animate>>()

    // Motion owns playback and completion. The viewer keeps a closing group
    // mounted until finished resolves, and calls stop before a rapid reversal.
    function animateChildren(node: HTMLElement, expanded: boolean) {
        const style = getComputedStyle(node)
        const margin = compact ? 5 : 9
        const startHeight = node.style.height ? node.getBoundingClientRect().height : 0
        const startMargin = node.style.height ? parseFloat(style.marginTop) : 0
        node.style.overflow = 'hidden'
        const playback = animate(
            node,
            {
                height: [startHeight, expanded ? 'auto' : 0],
                marginTop: [startMargin, expanded ? margin : 0]
            },
            { duration: motionEnabled ? 0.24 : 0, ease: [0.22, 1, 0.36, 1] }
        )
        groupAnimations.set(node, playback)
        let stopped = false
        const finished = playback.then(() => {
            if (stopped) return
            groupAnimations.delete(node)
            if (expanded) {
                node.style.height = 'auto'
                node.style.marginTop = ''
                node.style.overflow = ''
            }
        })
        return {
            finished,
            stop() {
                stopped = true
                // Capture the displayed geometry before stopping so reversal
                // begins at the current frame, including a fully open group.
                const height = node.getBoundingClientRect().height
                const marginTop = getComputedStyle(node).marginTop
                playback.stop()
                node.style.height = `${height}px`
                node.style.marginTop = marginTop
                groupAnimations.delete(node)
            }
        }
    }

    // JsonView owns its rows. This action supplies decorative elements and
    // animates them with Motion without replacing its buttons or focus model.
    function animateTree(root: HTMLElement, enabled: boolean) {
        // trunk-ignore(eslint/svelte/prefer-svelte-reactivity)
        const decorations = new Map<HTMLElement, { caret: HTMLElement; dots: HTMLElement }>()
        // trunk-ignore(eslint/svelte/prefer-svelte-reactivity)
        const animations = new Map<HTMLElement, ReturnType<typeof animate>>()
        // trunk-ignore(eslint/svelte/prefer-svelte-reactivity)
        const targets = new Map<HTMLElement, string>()
        let hoveredRow: HTMLElement | null = null
        let hoveredCaret: HTMLElement | null = null

        function move(
            node: HTMLElement,
            values: {
                rotate?: number
                width?: string
                marginRight?: string
                opacity?: number
                x?: number
            },
            instant = false
        ) {
            const key = JSON.stringify(values)
            if (!instant && targets.get(node) === key) return
            targets.set(node, key)
            animations.get(node)?.stop()
            animations.set(
                node,
                animate(node, values, {
                    duration: enabled && !instant ? 0.18 : 0,
                    ease: [0.22, 1, 0.36, 1]
                })
            )
        }

        function refresh(instant = false) {
            for (const [node, playback] of animations) {
                if (!root.contains(node)) {
                    playback.stop()
                    animations.delete(node)
                    targets.delete(node)
                }
            }
            for (const row of decorations.keys()) {
                if (!root.contains(row)) decorations.delete(row)
            }
            for (const row of root.querySelectorAll<HTMLElement>('.tw-row[aria-expanded]')) {
                const button = row.querySelector<HTMLElement>(':scope > .tw-toggle')!
                const closing = row.querySelector<HTMLElement>(
                    ':scope > .tw-punctuation:last-child'
                )!
                let parts = decorations.get(row)
                const fresh = !parts
                if (!parts) {
                    const caret = document.createElement('span')
                    caret.className = 'tw-caret'
                    caret.setAttribute('aria-hidden', 'true')
                    button.appendChild(caret)
                    const dots = document.createElement('span')
                    dots.className = 'tw-dots'
                    dots.textContent = '…'
                    dots.setAttribute('aria-hidden', 'true')
                    closing.insertBefore(dots, closing.firstChild)
                    parts = { caret, dots }
                    decorations.set(row, parts)
                }
                const expanded = row.getAttribute('aria-expanded') === 'true'
                const leaning =
                    enabled && (hoveredCaret === button || document.activeElement === button)
                move(
                    parts.caret,
                    { rotate: expanded ? (leaning ? 20 : 45) : leaning ? -20 : -45 },
                    instant || fresh
                )
                move(
                    parts.dots,
                    {
                        width: expanded ? '0em' : '1em',
                        marginRight: expanded ? '0em' : '0.4em',
                        opacity: expanded ? 0 : 1,
                        x: expanded ? -2 : 0
                    },
                    instant || fresh
                )
            }
        }

        function pointAt(target: EventTarget | null) {
            const element = target instanceof Element ? target : null
            const row = element?.closest<HTMLElement>('.tw-row') ?? null
            const nextRow = row && root.contains(row) ? row : null
            if (hoveredRow !== nextRow) {
                if (hoveredRow) move(hoveredRow, { x: 0 })
                hoveredRow = nextRow
                if (hoveredRow) move(hoveredRow, { x: enabled ? 2 : 0 })
            }
            hoveredCaret = element?.closest<HTMLElement>('.tw-toggle') ?? null
            refresh()
        }
        const over = (event: PointerEvent) => {
            if (event.pointerType !== 'touch') pointAt(event.target)
        }
        const out = (event: PointerEvent) => pointAt(event.relatedTarget)
        const focus = () => refresh()
        const observer = new MutationObserver(() => refresh())
        observer.observe(root, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['aria-expanded']
        })
        root.addEventListener('pointerover', over)
        root.addEventListener('pointerout', out)
        root.addEventListener('focusin', focus)
        root.addEventListener('focusout', focus)
        refresh(true)
        return {
            update(next: boolean) {
                enabled = next
                if (!enabled) {
                    for (const playback of groupAnimations.values()) playback.complete()
                    for (const playback of animations.values()) playback.complete()
                    if (hoveredRow) move(hoveredRow, { x: 0 }, true)
                }
                refresh(true)
            },
            destroy() {
                observer.disconnect()
                root.removeEventListener('pointerover', over)
                root.removeEventListener('pointerout', out)
                root.removeEventListener('focusin', focus)
                root.removeEventListener('focusout', focus)
                for (const playback of animations.values()) playback.stop()
                for (const { caret, dots } of decorations.values()) {
                    caret.remove()
                    dots.remove()
                }
            }
        }
    }

    // The persistent closing bracket hosts the fading ellipsis. Forward its
    // click to the viewer's expander so focus and veto behavior stay intact.
    function expandFromSummary(event: MouseEvent) {
        const target = event.target
        if (!(target instanceof HTMLElement)) return
        const closing = target.closest(
            '.tw-row[aria-expanded="false"] > .tw-punctuation:last-child'
        )
        closing?.parentElement?.querySelector<HTMLElement>(':scope > .tw-toggle')?.click()
    }

    // A fresh strategy also reapplies an action after manual node toggles.
    function setExpansion(expanded: boolean) {
        shouldExpandNode = () => expanded
    }
</script>

<div
    class="tailwind-demo"
    data-palette={palette}
    data-compact={compact}
    data-motion={motionEnabled}
>
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 pt-6 sm:px-8">
        <div class="flex items-center gap-3">
            <MotionSpan
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--tree-border)] font-mono text-lg text-[var(--tree-container)]"
                initial={false}
                whileInView={motionEnabled
                    ? { rotate: [0, -12, 8, 0], y: [0, -4, 0, 0] }
                    : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                aria-hidden="true">{'{ }'}</MotionSpan
            >
            <div>
                <div
                    class="mb-1 text-[10px] font-semibold tracking-[0.2em] text-[var(--tree-muted)]"
                >
                    A DIFFERENT POINT OF VIEW
                </div>
                <h3 class="m-0 text-xl font-semibold tracking-tight text-[var(--tree-label)]">
                    Your data. Dressed up.
                </h3>
                <a
                    href="https://motion.svelte.page/"
                    class="mt-1 inline-block text-xs text-[var(--tree-muted)] underline underline-offset-4 hover:text-[var(--tree-label)]"
                    >Powered by Svelte Motion ↗</a
                >
            </div>
        </div>
        <div
            class="palette-switch flex gap-1 rounded-full p-1"
            aria-label="Tree palette"
            role="group"
        >
            {#each ['dusk', 'ocean', 'daylight'] as name (name)}
                <MotionButton
                    class="palette-button relative isolate rounded-full px-3 py-1.5 text-xs font-medium capitalize"
                    aria-pressed={palette === name}
                    whileTap={motionEnabled ? { scale: 0.95 } : undefined}
                    onclick={() => (palette = name)}
                >
                    {#if palette === name}
                        <MotionSpan
                            class="absolute inset-0 -z-10 rounded-full bg-[var(--tree-hover)]"
                            layoutId={motionEnabled ? `${motionId}-palette` : undefined}
                            initial={false}
                            transition={motionEnabled
                                ? { type: 'spring', stiffness: 420, damping: 32 }
                                : { duration: 0 }}
                            aria-hidden="true"
                        />
                    {/if}
                    {name}
                </MotionButton>
            {/each}
        </div>
    </div>

    <MotionDiv
        class="tree-window mx-3 my-6 overflow-hidden rounded-2xl border sm:mx-8"
        initial={false}
        whileInView={motionEnabled ? { y: [12, 0], opacity: [0.7, 1] } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
    >
        <div
            class="window-bar flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3"
        >
            <div class="flex items-center gap-3">
                <span class="flex gap-1.5" aria-hidden="true">
                    <span class="h-2 w-2 rounded-full bg-rose-400/80"></span>
                    <span class="h-2 w-2 rounded-full bg-amber-400/80"></span>
                    <span class="h-2 w-2 rounded-full bg-emerald-400/80"></span>
                </span>
                <span class="font-mono text-xs text-[var(--tree-muted)]">workspace.json</span>
            </div>
            <span class="text-[10px] font-medium tracking-widest text-[var(--tree-muted)]">
                READ ONLY
            </span>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div class="flex gap-2">
                <MotionButton
                    class="tree-action"
                    whileHover={motionEnabled ? { y: -1 } : undefined}
                    whileTap={motionEnabled ? { scale: 0.96 } : undefined}
                    onclick={() => setExpansion(true)}>Expand all</MotionButton
                >
                <MotionButton
                    class="tree-action"
                    whileHover={motionEnabled ? { y: -1 } : undefined}
                    whileTap={motionEnabled ? { scale: 0.96 } : undefined}
                    onclick={() => setExpansion(false)}>Collapse all</MotionButton
                >
            </div>
            <div class="flex flex-wrap gap-4">
                <label
                    class="flex cursor-pointer items-center gap-2 text-xs text-[var(--tree-muted)]"
                >
                    <input type="checkbox" bind:checked={compact} class="accent-violet-400" />
                    Compact
                </label>
                <label
                    class="flex cursor-pointer items-center gap-2 text-xs text-[var(--tree-muted)]"
                >
                    <input
                        type="checkbox"
                        checked={motionEnabled}
                        disabled={reducedMotion.current}
                        onchange={(event) => (animateDemo = event.currentTarget.checked)}
                        class="accent-violet-400"
                    />
                    {reducedMotion.current ? 'Reduced motion' : 'Motion'}
                </label>
            </div>
        </div>

        <div class="px-3 pb-4 sm:px-4" use:animateTree={motionEnabled}>
            <JsonView
                data={payload}
                style={treeStyle}
                {shouldExpandNode}
                childrenAnimation={animateChildren}
                compactTopLevel
                clickToExpandNode
                onclick={expandFromSummary}
                aria-label="Styled workspace JSON"
            />
        </div>

        <div
            class="window-bar flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
        >
            <div class="flex flex-wrap gap-3 font-mono text-[10px]" aria-label="Value colors">
                <span class="text-[var(--tree-string)]">Aa string</span>
                <span class="text-[var(--tree-number)]"># number</span>
                <span class="text-[var(--tree-boolean)]">◐ boolean</span>
                <span class="text-[var(--tree-container)]">{'{ }'} container</span>
            </div>
            <span class="text-[10px] text-[var(--tree-muted)]"
                >Tab to a chevron · ↑ ↓ ← → to explore</span
            >
        </div>
    </MotionDiv>
</div>

<style>
    .tailwind-demo {
        --tree-bg: #28263f;
        --tree-panel: #222233;
        --tree-row: #303043;
        --tree-hover: #3b3a52;
        --tree-border: #49465f;
        --tree-label: #e5e3f1;
        --tree-muted: #b0acc7;
        --tree-string: #6ee7b7;
        --tree-number: #7dbbff;
        --tree-boolean: #d8a0ff;
        --tree-container: #fbbf75;
        --tree-height: 42px;
        --tree-indent: 22px;
        min-width: 0;
        width: 100%;
        background:
            radial-gradient(ellipse at top right, #8572b51a, transparent 60%), var(--tree-bg);
        font-family: 'Inter Variable', system-ui, sans-serif;
    }

    .tailwind-demo[data-palette='ocean'] {
        --tree-bg: #142d38;
        --tree-panel: #12242d;
        --tree-row: #1d3540;
        --tree-hover: #284550;
        --tree-border: #3b5662;
        --tree-label: #e1eef4;
        --tree-muted: #9fbcc9;
        --tree-string: #67e8d0;
        --tree-number: #7dd3fc;
        --tree-boolean: #c4b5fd;
        --tree-container: #fcd39c;
    }

    .tailwind-demo[data-palette='daylight'] {
        --tree-bg: #eeedf5;
        --tree-panel: #faf9fd;
        --tree-row: #ffffff;
        --tree-hover: #eeeafa;
        --tree-border: #d5d0e2;
        --tree-label: #352e49;
        --tree-muted: #6c617e;
        --tree-string: #08734b;
        --tree-number: #195cbd;
        --tree-boolean: #8435b0;
        --tree-container: #9a520b;
    }

    .tailwind-demo[data-compact='true'] {
        --tree-height: 34px;
        --tree-indent: 16px;
    }

    .tailwind-demo :global(.tree-window) {
        border-color: var(--tree-border);
        background: var(--tree-panel);
        box-shadow: 0 12px 32px #00000015;
    }

    .window-bar {
        border-color: var(--tree-border);
    }

    .palette-switch {
        background: var(--tree-panel);
    }

    .tailwind-demo :global(.palette-button) {
        color: var(--tree-muted);
    }

    .tailwind-demo :global(.palette-button[aria-pressed='true']) {
        color: var(--tree-label);
    }

    .tailwind-demo :global(.tree-action) {
        border: 1px solid var(--tree-border);
        border-radius: 6px;
        padding: 4px 9px;
        color: var(--tree-label);
        font-size: 11px;
    }

    .tailwind-demo :global(.tree-action:hover),
    .tailwind-demo :global(.palette-button:hover) {
        background: var(--tree-hover);
    }

    .tailwind-demo :global(button:focus-visible),
    .tailwind-demo input:focus-visible {
        outline: 2px solid var(--tree-number);
        outline-offset: 3px;
    }

    .tailwind-demo :global(.tw-row) {
        isolation: isolate;
        min-height: var(--tree-height);
        margin-top: 6px;
        padding: calc((var(--tree-height) - 24px) / 2) 12px;
        border-radius: 10px;
        background: var(--tree-row);
        box-shadow: inset 0 0 0 1px var(--tree-border);
    }

    /* A container's painted row stays above its children, not around them. */
    .tailwind-demo :global(.tw-row[aria-expanded]) {
        /* The container also spans every child and gap. Hit-test its painted
           header and descendants instead of that entire invisible rectangle. */
        pointer-events: none;
        padding-bottom: 0;
        background: none;
        box-shadow: none;
    }

    .tailwind-demo :global(.tw-row[aria-expanded]::before) {
        position: absolute;
        z-index: -1;
        inset: 0 0 auto;
        height: var(--tree-height);
        border: 1px solid var(--tree-border);
        border-radius: 10px;
        background: var(--tree-row);
        content: '';
    }

    .tailwind-demo :global(.tw-row[aria-expanded]::before),
    .tailwind-demo :global(.tw-row[aria-expanded] > :not(.tw-children)),
    .tailwind-demo :global(.tw-row:not([aria-expanded])) {
        pointer-events: auto;
    }

    .tailwind-demo :global(.tw-row[aria-expanded]:has(> .tw-label:hover)::before),
    .tailwind-demo :global(.tw-row[aria-expanded]:has(> .tw-toggle:hover)::before) {
        background: var(--tree-hover);
    }

    .tailwind-demo :global(.tw-row:not([aria-expanded])) {
        padding-left: 40px;
    }

    .tailwind-demo :global(.tw-value) {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
    }

    /* Hide leaf commas; keep object/array delimiters, including empty values. */
    .tailwind-demo :global(.tw-value + .tw-punctuation) {
        display: none;
    }

    .tailwind-demo :global(.tw-children) {
        min-width: 0;
        flex-basis: calc(100% + 12px);
        flex-shrink: 0;
        margin: calc((var(--tree-height) - 24px) / 2) -12px 0 0;
        padding: 0 0 0 var(--tree-indent);
    }

    .tailwind-demo :global(.tw-toggle) {
        display: inline-flex;
        width: 20px;
        height: 24px;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        color: var(--tree-muted);
        cursor: pointer;
    }

    .tailwind-demo :global(.tw-caret) {
        width: 7px;
        height: 7px;
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        pointer-events: none;
    }

    .tailwind-demo :global(.tw-toggle:focus-visible) {
        outline: 2px solid var(--tree-number);
        outline-offset: 2px;
    }

    .tailwind-demo :global(.tw-summary) {
        display: none;
    }

    .tailwind-demo :global(.tw-dots) {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
    }

    .tailwind-demo :global(.tw-row[aria-expanded='false'] > .tw-punctuation:last-child) {
        cursor: pointer;
    }

    @media (max-width: 480px) {
        .tailwind-demo {
            --tree-indent: 12px;
        }
    }
</style>
