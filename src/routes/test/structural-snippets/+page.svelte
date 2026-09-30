<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'

    const data = { object: { leaf: 1 }, array: [1, 2] }
    const initiallyCollapsed = () => false
    // Deliberate whitespace emitted by the consumer around its indicator.
    const padding = ' '
</script>

<main>
    <h1>Structural snippet layout and focus</h1>
    <button type="button">Before the trees</button>
    {#each ['default', 'custom'] as theme (theme)}
        <section aria-label={`${theme} punctuation`}>
            <JsonView
                {data}
                compactTopLevel
                shouldExpandNode={initiallyCollapsed}
                clickToExpandSummary={false}
                style={{
                    hideCommas: true,
                    punctuation:
                        theme === 'default'
                            ? `${defaultStyles.punctuation} test-punctuation`
                            : 'test-punctuation'
                }}
            >
                {#snippet row({ attrs, field, children })}
                    <div {...attrs} data-field={field}>
                        {@render children()}
                    </div>
                {/snippet}
                {#snippet expander({ expanded, focused, focusVisible })}
                    <span
                        class="caret"
                        data-caret
                        data-focused={focused}
                        data-focus-visible={focusVisible}
                        style:transform={`rotate(${expanded ? (focusVisible ? 20 : 45) : focusVisible ? -20 : -45}deg)`}
                        aria-hidden="true">▸</span
                    >
                {/snippet}
                {#snippet collapsed({ expanded })}
                    {padding}
                    <span
                        class="summary"
                        data-summary
                        style:width={expanded ? '0px' : '16px'}
                        style:margin-left={expanded ? '0px' : '4px'}
                        style:margin-right={expanded ? '0px' : '4px'}
                        style:opacity={expanded ? 0 : 1}
                        aria-hidden="true">…</span
                    >
                    {padding}
                {/snippet}
            </JsonView>
        </section>
    {/each}
    <button type="button">After the trees</button>
</main>

<style>
    section {
        margin-block: 1rem;
    }

    /* Neither theme supplies inline-flex punctuation: the library must contain
       the snippet's whitespace even with ordinary inline consumer styles. */
    :global(.test-punctuation) {
        display: inline;
    }

    .summary {
        display: inline-block;
        overflow: hidden;
        text-align: center;
        transition:
            width 100ms linear,
            margin 100ms linear,
            opacity 100ms linear;
    }

    .caret {
        display: inline-block;
        transition: transform 100ms linear;
    }
</style>
