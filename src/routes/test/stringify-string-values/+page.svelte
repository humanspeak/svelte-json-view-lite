<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'

    const data = {
        valueWithEscapedCharacters: 'one\n\'two\'\tthree.\r\n"another line"'
    }
</script>

<h1>Stringify string values</h1>
<p class="blurb">
    Matches the <em>Stringify string values</em> story — values containing control characters are
    piped through <code>JSON.stringify</code> so escapes render visibly.
</p>
<JsonView {data} style={{ ...defaultStyles, stringifyStringValues: true }} />
