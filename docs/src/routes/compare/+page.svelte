<script lang="ts">
    import { CompareIndexV2 } from '@humanspeak/docs-kit'
    import { comparisons, ours } from '$lib/compare-data'

    const introHtml =
        'Start with the installable choices: <a href="/compare/vs-zerodevx-svelte-json-view"><b>@zerodevx/svelte-json-view</b></a> is a fellow lightweight Svelte 5 viewer, <b>svelte-jsoneditor</b> is a Svelte-native editor, and <b>vanilla-jsoneditor</b> is framework-agnostic. <a href="/compare/vs-react-json-view-lite"><b>react-json-view-lite</b></a> is our API-defining React upstream. The remaining React-only pages are migration, feature, and search references — <b>not native Svelte alternatives</b>.'
</script>

<CompareIndexV2 competitors={comparisons} {ours} {introHtml} />
