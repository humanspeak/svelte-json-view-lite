<script lang="ts">
    import { defaultStyles, JsonView } from '@humanspeak/svelte-json-view-lite'

    const placeholder = {
        package: '@humanspeak/svelte-json-view-lite',
        version: '0.1.1',
        nested: { ready: true, routes: ['/docs/getting-started', '/examples'] }
    }
</script>

<main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="mb-4 text-4xl font-bold">Svelte JSON View Lite</h1>
    <p class="text-muted-foreground mb-8 text-lg">
        Fast, tiny JSON tree viewer for Svelte 5. Landing page, feature grid, and live playground
        ship in the next commit — this is the scaffold.
    </p>
    <JsonView data={placeholder} style={defaultStyles} />
</main>
