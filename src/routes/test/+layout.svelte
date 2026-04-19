<script lang="ts">
    import type { Snippet } from 'svelte'

    interface Props {
        children: Snippet
    }

    const { children }: Props = $props()
</script>

<div class="story">
    <nav>
        <a href="/">&larr; All stories</a>
    </nav>
    {@render children()}
</div>

<style>
    /*
     * Matches the Storybook decorator wrapping every story on
     * anyroad.github.io/react-json-view-lite so the two viewers render
     * identically side-by-side.
     */
    .story {
        font-size: 14px;
        font-family:
            ui-monospace, Menlo, Monaco, 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace',
            'Source Code Pro', 'Droid Sans Mono', 'Courier New', monospace;
        padding: 1.5rem;
        max-width: 960px;
        margin: 0 auto;
    }
    nav {
        font-family: system-ui, sans-serif;
        font-size: 13px;
        margin-bottom: 1.5rem;
    }
    nav a {
        color: #0b75f5;
        text-decoration: none;
    }
    nav a:hover {
        text-decoration: underline;
    }
    :global(.story h1) {
        font-family: system-ui, sans-serif;
        font-size: 1.1rem;
        margin: 0 0 0.25rem;
    }
    :global(.story .blurb) {
        font-family: system-ui, sans-serif;
        font-size: 13px;
        color: #555;
        margin: 0 0 1rem;
    }
</style>
