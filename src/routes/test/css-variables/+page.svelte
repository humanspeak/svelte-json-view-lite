<script lang="ts">
    import { darkStyles, defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Override internal colors via CSS variables</h1>
<p class="blurb">
    Every color in the built-in themes is defined as a CSS custom property on the root container (<code
        >--sjv-background</code
    >, <code>--sjv-string</code>,
    <code>--sjv-number</code>, …). Override them at any ancestor selector to retheme a single
    instance without swapping the whole <code>style</code> prop. The two panels below share the same
    JSON and the same <code>defaultStyles</code> / <code>darkStyles</code>; only the CSS variables
    differ.
</p>

<div class="grid">
    <section class="vapor">
        <h2>Vaporwave (overrides defaultStyles)</h2>
        <JsonView data={jsonData} style={defaultStyles} />
    </section>

    <section class="solarized">
        <h2>Softer solarized (overrides darkStyles)</h2>
        <JsonView data={jsonData} style={darkStyles} />
    </section>
</div>

<style>
    .grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: 1fr;
    }
    @media (min-width: 900px) {
        .grid {
            grid-template-columns: 1fr 1fr;
        }
    }
    section h2 {
        font-family: system-ui, sans-serif;
        font-size: 13px;
        margin: 0 0 0.5rem;
    }

    /*
     * Vaporwave palette — only the custom properties are redefined. The
     * component CSS classes are untouched; `defaultStyles` still applies
     * its *-light classes, which resolve `var(--sjv-*)` against this block.
     */
    .vapor :global(div[role='tree']) {
        --sjv-background: #2b1055;
        --sjv-label: #ffb3f1;
        --sjv-punctuation: #ff71ce;
        --sjv-string: #01cdfe;
        --sjv-number: #05ffa1;
        --sjv-boolean: #b967ff;
        --sjv-null: #fffb96;
        --sjv-undefined: #fffb96;
        --sjv-other: #ffffff;
        --sjv-expander: #ff71ce;
    }

    /* Softer solarized — tuned contrasts but darkStyles' -dark classes stay in effect. */
    .solarized :global(div[role='tree']) {
        --sjv-background: #001e26;
        --sjv-label: #eee8d5;
        --sjv-punctuation: #93a1a1;
        --sjv-string: #859900;
        --sjv-number: #2aa198;
        --sjv-boolean: #d33682;
        --sjv-null: #dc322f;
        --sjv-undefined: #dc322f;
        --sjv-other: #b58900;
        --sjv-expander: #eee8d5;
    }
</style>
