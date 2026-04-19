<script lang="ts">
    const routes = [
        {
            path: '/test/basic',
            label: 'Basic',
            blurb: 'Sample JSON with a light/dark theme toggle.'
        },
        {
            path: '/test/compact',
            label: 'Compact top level',
            blurb: 'compactTopLevel=true spreads root keys without an outer expander.'
        },
        {
            path: '/test/click-to-expand',
            label: 'Click-to-expand',
            blurb: 'clickToExpandNode lets you toggle by clicking field labels.'
        },
        {
            path: '/test/snippets',
            label: 'Snippet overrides',
            blurb: 'Custom date + string rendering via typed snippet props (new).'
        },
        {
            path: '/test/edge-cases',
            label: 'Edge cases',
            blurb: 'null, undefined, BigInt, Date, Function, circular refs.'
        }
    ]
</script>

<main>
    <h1>@humanspeak/svelte-json-view-lite</h1>
    <p>
        Fast, tiny JSON tree viewer for Svelte 5. Port of
        <a href="https://github.com/AnyRoad/react-json-view-lite">react-json-view-lite</a>
        with runes, SSR support, per-type snippet overrides, and zero runtime dependencies.
    </p>
    <ul>
        {#each routes as { path, label, blurb } (path)}
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
