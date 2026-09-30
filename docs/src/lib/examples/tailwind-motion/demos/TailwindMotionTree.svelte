<script lang="ts">
    import CheckIcon from '@lucide/svelte/icons/check'
    import XIcon from '@lucide/svelte/icons/x'
    import { JsonView, type Props, type StyleProps } from '@humanspeak/svelte-json-view-lite'
    import {
        AnimatePresence,
        MotionButton,
        MotionDiv,
        MotionSpan,
        MotionUl,
        useReducedMotion
    } from '@humanspeak/svelte-motion'

    const motionId = $props.id()
    const copyHintId = `${motionId}-copy-hint`
    const reducedMotion = useReducedMotion()
    let animateDemo = $state(true)
    const motionEnabled = $derived(animateDemo && !reducedMotion.current)
    let palette = $state('dusk')
    let compact = $state(false)
    let hoveredRow = $state<string | null>(null)
    let feedback = $state<{ id: string; status: 'copied' | 'failed' } | null>(null)
    let feedbackTimer: ReturnType<typeof setTimeout> | undefined
    let copyRequest = 0

    async function copyValue(id: string, value: unknown) {
        const request = ++copyRequest
        clearTimeout(feedbackTimer)
        feedback = null
        try {
            // Copy the full value, even when its descendants are collapsed.
            const text =
                typeof value === 'object' && value !== null
                    ? JSON.stringify(value, null, 2)
                    : String(value)
            await navigator.clipboard.writeText(text)
            if (request !== copyRequest) return
            feedback = { id, status: 'copied' }
        } catch {
            if (request !== copyRequest) return
            feedback = { id, status: 'failed' }
        }
        feedbackTimer = setTimeout(() => (feedback = null), 2000)
    }

    function copyClickedRow(event: MouseEvent, id: string, value: unknown) {
        const target = event.target
        if (!(target instanceof Element)) return
        // Summary expansion is disabled on JsonView, so ordinary bubbling clicks
        // can copy. Descendants copy their own value; chevrons keep expansion.
        if (target.closest('.tw-row') !== event.currentTarget || target.closest('[role="button"]'))
            return
        if (window.getSelection()?.isCollapsed === false) return
        void copyValue(id, value)
    }

    $effect(() => () => {
        copyRequest++
        clearTimeout(feedbackTimer)
    })
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
        basicChildStyle: 'tw-row relative flex flex-wrap items-start',
        label: 'tw-label shrink-0 font-medium text-[var(--tree-label)]',
        clickableLabel: 'tw-label shrink-0 cursor-pointer font-medium text-[var(--tree-label)]',
        stringValue: 'tw-value min-w-0 flex-1 text-[var(--tree-string)]',
        numberValue: 'tw-value min-w-0 flex-1 text-[var(--tree-number)]',
        booleanValue: 'tw-value min-w-0 flex-1 text-[var(--tree-boolean)]',
        nullValue: 'tw-value min-w-0 flex-1 italic text-[var(--tree-muted)]',
        undefinedValue: 'tw-value min-w-0 flex-1 italic text-[var(--tree-muted)]',
        otherValue: 'tw-value min-w-0 flex-1 text-[var(--tree-container)]',
        punctuation: 'tw-punctuation text-[var(--tree-container)]',
        hideCommas: true,
        expandIcon: 'tw-toggle tw-closed',
        collapseIcon: 'tw-toggle tw-open',
        collapsedContent: 'tw-summary cursor-pointer text-[var(--tree-muted)]',
        childFieldsContainer: 'tw-children order-last basis-full list-none'
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
    <span id={copyHintId} class="sr-only">
        Click a row or press Enter or Space to copy its value. Use the chevron to expand or
        collapse.
    </span>
    <span class="sr-only" role="status">
        {feedback ? (feedback.status === 'copied' ? 'Copied!' : 'Could not copy. Try again.') : ''}
    </span>
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

        <div class="px-3 pb-4 sm:px-4">
            <JsonView
                data={payload}
                style={treeStyle}
                {shouldExpandNode}
                clickToExpandSummary={false}
                compactTopLevel
                aria-label="Styled workspace JSON"
            >
                {#snippet row({ id, value, attrs, children })}
                    <MotionDiv
                        {...attrs}
                        tabindex={0}
                        aria-describedby={copyHintId}
                        data-hovered={hoveredRow === id}
                        data-copy-state={feedback?.id === id ? feedback.status : undefined}
                        onclick={(event: MouseEvent) => copyClickedRow(event, id, value)}
                        onkeydown={(event: KeyboardEvent) => {
                            if (
                                event.target !== event.currentTarget ||
                                !['Enter', ' '].includes(event.key)
                            )
                                return
                            event.preventDefault()
                            event.stopPropagation()
                            void copyValue(id, value)
                        }}
                        initial={false}
                        animate={{ x: motionEnabled && hoveredRow === id ? 2 : 0 }}
                        transition={{ duration: motionEnabled ? 0.15 : 0 }}
                        onpointerover={(event: PointerEvent) => {
                            event.stopPropagation()
                            if (event.pointerType !== 'touch') hoveredRow = id
                        }}
                        onpointerout={(event: PointerEvent) => {
                            event.stopPropagation()
                            // Moving between a row's label and icons is still inside it.
                            if (
                                event.relatedTarget instanceof Element &&
                                event.relatedTarget.closest('.tw-row') === event.currentTarget
                            )
                                return
                            if (hoveredRow === id) hoveredRow = null
                        }}
                    >
                        {@render children()}
                        {#each ['copied', 'failed'] as status (status)}
                            <AnimatePresence
                                present={feedback?.id === id && feedback.status === status}
                            >
                                {#snippet child()}
                                    <MotionSpan
                                        class="tw-copy-feedback"
                                        data-status={status}
                                        initial={{ opacity: 0, scale: motionEnabled ? 0.4 : 1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{
                                            opacity: 0,
                                            scale: motionEnabled ? 0.8 : 1,
                                            transition: {
                                                type: 'tween',
                                                duration: motionEnabled ? 0.18 : 0
                                            }
                                        }}
                                        transition={motionEnabled
                                            ? {
                                                  scale: {
                                                      type: 'spring',
                                                      stiffness: 500,
                                                      damping: 22
                                                  },
                                                  opacity: { duration: 0.12 }
                                              }
                                            : { duration: 0 }}
                                        aria-hidden="true"
                                    >
                                        {#if status === 'copied'}
                                            <CheckIcon class="size-4" />
                                        {:else}
                                            <XIcon class="size-4" />
                                        {/if}
                                    </MotionSpan>
                                {/snippet}
                            </AnimatePresence>
                        {/each}
                    </MotionDiv>
                {/snippet}
                {#snippet expander({ expanded, hovered, focusVisible })}
                    <MotionSpan
                        class="tw-caret"
                        initial={false}
                        animate={{
                            rotate: expanded
                                ? motionEnabled && (hovered || focusVisible)
                                    ? 20
                                    : 45
                                : motionEnabled && (hovered || focusVisible)
                                  ? -20
                                  : -45
                        }}
                        transition={{ duration: motionEnabled ? 0.18 : 0 }}
                        aria-hidden="true"
                    />
                {/snippet}
                {#snippet collapsed({ expanded })}
                    <MotionSpan
                        class="tw-dots"
                        initial={false}
                        animate={{
                            width: expanded ? '0em' : '1em',
                            marginLeft: expanded ? '0em' : '0.25em',
                            marginRight: expanded ? '0em' : '0.25em',
                            opacity: expanded ? 0 : 1
                        }}
                        transition={{ duration: motionEnabled ? 0.18 : 0 }}
                        aria-hidden="true">…</MotionSpan
                    >
                {/snippet}
                {#snippet childGroup({ expanded, attrs, children })}
                    <AnimatePresence present={expanded} initial={false}>
                        {#snippet child()}
                            <MotionUl
                                {...attrs}
                                initial={{ height: 0, marginTop: 0 }}
                                animate={{ height: 'auto', marginTop: compact ? 5 : 9 }}
                                exit={{ height: 0, marginTop: 0 }}
                                transition={{
                                    duration: motionEnabled ? 0.24 : 0,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                style={{ overflow: 'hidden' }}
                            >
                                {@render children()}
                            </MotionUl>
                        {/snippet}
                    </AnimatePresence>
                {/snippet}
            </JsonView>
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
                >Click a row to copy · Chevrons to expand · ↑ ↓ ← → to explore</span
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
        --tree-success: #6ee7b7;
        --tree-error: #fda4af;
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
        --tree-success: #08734b;
        --tree-error: #be123c;
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
        padding: calc((var(--tree-height) - 24px) / 2) 32px calc((var(--tree-height) - 24px) / 2)
            12px;
        border-radius: 10px;
        background: var(--tree-row);
        box-shadow: inset 0 0 0 1px var(--tree-border);
        cursor: pointer;
    }

    /* Filled boundaries keep an expanded object or array together visually. */
    .tailwind-demo :global(.tw-row[aria-expanded='true']) {
        background: color-mix(in oklab, var(--tree-row) 70%, var(--tree-hover));
    }

    /* Descendants own their hover state, so ancestors keep their normal fill. */
    .tailwind-demo :global(.tw-row[data-hovered='true']) {
        background: var(--tree-hover);
        box-shadow: inset 0 0 0 1px var(--tree-number);
    }

    /* Copy feedback wins over hover, including while the pointer stays put. */
    .tailwind-demo :global(.tw-row[data-copy-state='copied']) {
        --row-feedback: var(--tree-success);
    }

    .tailwind-demo :global(.tw-row[data-copy-state='failed']) {
        --row-feedback: var(--tree-error);
    }

    .tailwind-demo :global(.tw-row[data-copy-state]) {
        box-shadow: inset 0 0 0 1px var(--row-feedback);
    }

    .tailwind-demo :global(.tw-copy-feedback) {
        position: absolute;
        inset-inline-end: 10px;
        top: calc((var(--tree-height) - 16px) / 2);
        color: var(--tree-success);
        pointer-events: none;
    }

    .tailwind-demo :global(.tw-copy-feedback[data-status='failed']) {
        color: var(--tree-error);
    }

    .tailwind-demo :global(.tw-row:focus-visible) {
        outline: 2px solid var(--tree-number);
        outline-offset: -2px;
    }

    .tailwind-demo :global(.tw-row:not([aria-expanded])) {
        padding-left: 40px;
    }

    .tailwind-demo :global(.tw-value) {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
    }

    .tailwind-demo :global(.tw-label) {
        margin-inline-end: 8px;
    }

    /* Inline flex ignores whitespace around the animated snippet, keeping
       delimiters together. Only labels and chevrons need a flex gap. */
    .tailwind-demo :global(.tw-punctuation) {
        display: inline-flex;
        align-items: center;
    }

    .tailwind-demo :global(.tw-children) {
        min-width: 0;
        flex-basis: calc(100% + 20px);
        flex-shrink: 0;
        margin: calc((var(--tree-height) - 24px) / 2) -20px 0 0;
        /* Reserve the hover nudge inside the group's animation clip. */
        padding: 0 2px 0 var(--tree-indent);
    }

    .tailwind-demo :global(.tw-toggle) {
        display: inline-flex;
        width: 20px;
        height: 24px;
        margin-inline-end: 8px;
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

    .tailwind-demo :global(.tw-dots) {
        display: inline-block;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;
    }

    @media (max-width: 480px) {
        .tailwind-demo {
            --tree-indent: 12px;
        }
    }
</style>
