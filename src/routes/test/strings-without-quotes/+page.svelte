<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'
    import { jsonData } from '../sample.js'
</script>

<h1>Render strings without quotes</h1>
<p class="blurb">
    Matches the <em>Render strings without quotes</em> story — strings drop their surrounding
    double-quotes via <code>noQuotesForStringValues: true</code>.
</p>
<JsonView data={jsonData} style={{ ...defaultStyles, noQuotesForStringValues: true }} />
