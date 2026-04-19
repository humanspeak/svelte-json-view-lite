<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Render field names with quotes</h1>
<p class="blurb">
    Matches the <em>Render field names with quotes</em> story — field labels become JSON-style with
    <code>quotesForFieldNames: true</code>.
</p>
<JsonView data={jsonData} style={{ ...defaultStyles, quotesForFieldNames: true }} />
