<script lang="ts">
    import { darkStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Dark theme</h1>
<p class="blurb">
    Matches the <em>Dark theme</em> story — same canonical payload rendered with
    <code>darkStyles</code>.
</p>
<JsonView data={jsonData} style={darkStyles} />
