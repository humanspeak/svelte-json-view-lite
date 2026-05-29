<script lang="ts">
    import { CompareIndexV2 } from '@humanspeak/docs-kit'
    import { competitors, ours } from '$lib/compare-data'
</script>

<CompareIndexV2
    {competitors}
    {ours}
    introHtml="Honest, side-by-side comparisons of <b>@humanspeak/svelte-json-view-lite</b> against JSON tree viewers and editors you might consider — including <b>react-json-view-lite</b>, <b>svelte-jsoneditor</b>, <b>vanilla-jsoneditor</b>, <b>react-json-view</b>, <b>@uiw/react-json-view</b>, and <b>@textea/json-viewer</b>. Feature matrices, pros / cons, verdicts. No spin."
/>
