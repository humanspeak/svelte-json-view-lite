<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Compact root level</h1>
<p class="blurb">
    Matches the <em>Compact root level</em> story — <code>compactTopLevel</code> spreads each top-level
    key as its own row without an outer expander or braces.
</p>
<JsonView data={jsonData} style={defaultStyles} compactTopLevel />
