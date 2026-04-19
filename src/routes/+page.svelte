<script lang="ts">
    // Story names mirror the react-json-view-lite Storybook at
    // https://anyroad.github.io/react-json-view-lite so demos can be compared
    // side-by-side. `/test/snippets` and `/test/edge-cases` are additions
    // unique to the Svelte port.
    const storybookParity = [
        {
            path: '/test/basic',
            label: 'Basic',
            blurb: 'defaultStyles + allExpanded, with a light/dark toggle.'
        },
        {
            path: '/test/dark-theme',
            label: 'Dark theme',
            blurb: 'darkStyles.'
        },
        {
            path: '/test/collapsed-nested-objects',
            label: 'Collapsed nested objects',
            blurb: 'Only the root is expanded — collapseAllNested strategy.'
        },
        {
            path: '/test/collapsed-root',
            label: 'Collapsed root',
            blurb: 'Custom () => false strategy — nothing is open by default.'
        },
        {
            path: '/test/strings-without-quotes',
            label: 'Render strings without quotes',
            blurb: 'noQuotesForStringValues — raw text instead of "..."'
        },
        {
            path: '/test/field-names-with-quotes',
            label: 'Render field names with quotes',
            blurb: 'quotesForFieldNames — JSON-style "label":'
        },
        {
            path: '/test/stringify-string-values',
            label: 'Stringify string values',
            blurb: 'stringifyStringValues — newlines, tabs, and quotes escape visibly.'
        },
        {
            path: '/test/click-to-expand',
            label: 'Click on field name to expand',
            blurb: 'clickToExpandNode makes the field label clickable alongside the icon.'
        },
        {
            path: '/test/compact',
            label: 'Compact root level',
            blurb: 'compactTopLevel spreads root keys without an outer expander.'
        }
    ]

    const svelteAdditions = [
        {
            path: '/test/snippets',
            label: 'Snippet overrides',
            blurb: 'Typed per-type Snippet overrides — custom date + url rendering. (Svelte-only)'
        },
        {
            path: '/test/edge-cases',
            label: 'Edge cases',
            blurb: 'null, undefined, BigInt, Date, Function, Error, RegExp, empty containers, deep nesting.'
        }
    ]
</script>

<main>
    <h1>@humanspeak/svelte-json-view-lite</h1>
    <p>
        Fast, tiny JSON tree viewer for Svelte 5 — port of
        <a href="https://github.com/AnyRoad/react-json-view-lite">react-json-view-lite</a>
        (MIT © 2024 AnyRoad) with runes, SSR support, per-type snippet overrides, and zero runtime dependencies.
    </p>

    <h2>Storybook parity</h2>
    <p class="sub">
        Every story at
        <a href="https://anyroad.github.io/react-json-view-lite" target="_blank" rel="noopener">
            anyroad.github.io/react-json-view-lite
        </a>
        has a matching route below, sharing one canonical fixture for easy side-by-side comparison.
    </p>
    <ul>
        {#each storybookParity as { path, label, blurb } (path)}
            <li>
                <a href={path}><strong>{label}</strong></a>
                <span>— {blurb}</span>
            </li>
        {/each}
    </ul>

    <h2>Svelte additions</h2>
    <ul>
        {#each svelteAdditions as { path, label, blurb } (path)}
            <li>
                <a href={path}><strong>{label}</strong></a>
                <span>— {blurb}</span>
            </li>
        {/each}
    </ul>
</main>

<style>
    main {
        padding: 2rem;
        max-width: 720px;
        margin: 0 auto;
        font-family: system-ui, sans-serif;
        line-height: 1.5;
    }
    h1 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    h2 {
        font-size: 1.1rem;
        margin-top: 2rem;
        margin-bottom: 0.25rem;
    }
    p.sub {
        color: #555;
        font-size: 0.9rem;
        margin-top: 0;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin: 0.5rem 0;
    }
    a {
        color: #0b75f5;
    }
</style>
