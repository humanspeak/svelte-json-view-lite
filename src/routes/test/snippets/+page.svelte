<script lang="ts">
    import {
        defaultStyles,
        JsonView,
        type DateSnippetProps,
        type StringSnippetProps
    } from '$lib/index.js'

    const data = {
        name: 'Ada Lovelace',
        profile: 'https://example.com/ada',
        joined: new Date('2024-01-15T09:00:00Z'),
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 26)
    }

    function relative(d: Date): string {
        const diff = d.getTime() - Date.now()
        const days = Math.round(diff / 86_400_000)
        return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(days, 'day')
    }

    function isUrl(value: string): boolean {
        return /^https?:\/\//.test(value)
    }
</script>

<main>
    <h1>JsonView — snippet overrides (new in the Svelte port)</h1>
    <p>Dates render as relative time; URLs become clickable links.</p>
    <JsonView {data} style={defaultStyles}>
        {#snippet date({ value }: DateSnippetProps)}
            <span title={value.toISOString()}>{relative(value)}</span>
        {/snippet}
        {#snippet string({ value }: StringSnippetProps)}
            {#if isUrl(value)}
                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
            {:else}
                "{value}"
            {/if}
        {/snippet}
    </JsonView>
</main>

<style>
    main {
        padding: 2rem;
        font-family: system-ui, sans-serif;
        max-width: 720px;
        margin: 0 auto;
    }
</style>
