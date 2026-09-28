<script lang="ts">
    import { JsonView, type Props, type StyleProps } from '@humanspeak/svelte-json-view-lite'
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
    // handles the recursive row geometry; no library internals are changed.
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

    // A fresh strategy also reapplies an action after manual node toggles.
    function setExpansion(expanded: boolean) {
        shouldExpandNode = () => expanded
    }
</script>

<div class="tailwind-demo" data-palette={palette} data-compact={compact}>
    <div class="flex flex-wrap items-center justify-between gap-4 px-5 pt-6 sm:px-8">
        <div class="flex items-center gap-3">
            <span
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--tree-border)] font-mono text-lg text-[var(--tree-container)]"
                aria-hidden="true">{'{ }'}</span
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
            </div>
        </div>
        <div
            class="palette-switch flex gap-1 rounded-full p-1"
            aria-label="Tree palette"
            role="group"
        >
            {#each ['dusk', 'ocean', 'daylight'] as name (name)}
                <button
                    class="palette-button relative isolate rounded-full px-3 py-1.5 text-xs font-medium capitalize"
                    aria-pressed={palette === name}
                    onclick={() => (palette = name)}
                >
                    {#if palette === name}
                        <span
                            class="absolute inset-0 -z-10 rounded-full bg-[var(--tree-hover)]"
                            aria-hidden="true"
                        ></span>
                    {/if}
                    {name}
                </button>
            {/each}
        </div>
    </div>

    <div class="tree-window mx-3 my-6 overflow-hidden rounded-2xl border sm:mx-8">
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
                <button class="tree-action" onclick={() => setExpansion(true)}>Expand all</button>
                <button class="tree-action" onclick={() => setExpansion(false)}>Collapse all</button
                >
            </div>
            <div class="flex flex-wrap gap-4">
                <label
                    class="flex cursor-pointer items-center gap-2 text-xs text-[var(--tree-muted)]"
                >
                    <input type="checkbox" bind:checked={compact} class="accent-violet-400" />
                    Compact
                </label>
            </div>
        </div>

        <div class="px-3 pb-4 sm:px-4">
            <JsonView
                data={payload}
                style={treeStyle}
                {shouldExpandNode}
                compactTopLevel
                clickToExpandNode
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
    </div>
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

    .tailwind-demo :global(.tw-toggle::after) {
        width: 7px;
        height: 7px;
        transform: rotate(-45deg);
        border-right: 2px solid currentColor;
        border-bottom: 2px solid currentColor;
        content: '';
    }

    .tailwind-demo :global(.tw-open::after) {
        transform: rotate(45deg) translate(-1px, -1px);
    }

    .tailwind-demo :global(.tw-toggle:focus-visible) {
        outline: 2px solid var(--tree-number);
        outline-offset: 2px;
    }

    .tailwind-demo :global(.tw-summary::after) {
        content: '…';
    }

    @media (max-width: 480px) {
        .tailwind-demo {
            --tree-indent: 12px;
        }
    }
</style>
