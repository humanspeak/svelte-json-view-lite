<script lang="ts">
    import { CompareIndexV2 } from '@humanspeak/docs-kit'
    import { comparisons, ours } from '$lib/compare-data'
</script>

<CompareIndexV2
    competitors={comparisons}
    {ours}
    introHtml="Start with the installable choices: <b>svelte-jsoneditor</b> is Svelte-native and <b>vanilla-jsoneditor</b> is framework-agnostic. <b>react-json-view-lite</b> is our React upstream. The remaining React-only pages are migration, feature, and search references — <b>not native Svelte alternatives</b>."
/>
