<script lang="ts">
    import { darkStyles, defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'

    let theme = $state<'light' | 'dark'>('light')
    const activeStyle = $derived(theme === 'light' ? defaultStyles : darkStyles)
</script>

<h1>Basic</h1>
<p class="blurb">
    Matches the <em>Basic</em> story — <code>defaultStyles</code> with
    <code>allExpanded</code> (the implicit default). Toggle the theme to flip to
    <code>darkStyles</code>.
</p>
<p class="blurb">
    <button
        type="button"
        data-testid="theme-toggle"
        onclick={() => (theme = theme === 'light' ? 'dark' : 'light')}
    >
        Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
</p>
<JsonView data={jsonData} style={activeStyle} />

<style>
    button {
        font-family: system-ui, sans-serif;
        padding: 0.3rem 0.7rem;
        border: 1px solid currentColor;
        background: transparent;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
