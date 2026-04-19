<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'

    const data = {
        name: 'Humanspeak',
        version: '0.1.0',
        license: 'MIT',
        status: { online: true, requests: 1_523 }
    }
</script>

<main>
    <h1>JsonView — compact top level</h1>
    <p>Each top-level key is rendered inline; no outer expander button.</p>
    <JsonView {data} compactTopLevel style={defaultStyles} />
</main>

<style>
    main {
        padding: 2rem;
        font-family: system-ui, sans-serif;
        max-width: 720px;
        margin: 0 auto;
    }
</style>
