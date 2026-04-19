<script lang="ts">
    import { collapseAllNested, defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Collapsed nested objects</h1>
<p class="blurb">
    Matches the <em>Collapsed nested objects</em> story — only the root node is expanded, every
    nested object and array collapses under the built-in
    <code>collapseAllNested</code> strategy (<code>(level) =&gt; level &lt; 1</code>).
</p>
<JsonView data={jsonData} style={defaultStyles} shouldExpandNode={collapseAllNested} />
