<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'

    const collapseAll = () => false
</script>

<h1>Collapsed root</h1>
<p class="blurb">
    Matches the <em>Collapsed root</em> story — custom strategy <code>() =&gt; false</code>
    keeps even the root closed. Clicking the expander opens it lazily.
</p>
<JsonView data={jsonData} style={defaultStyles} shouldExpandNode={collapseAll} />
