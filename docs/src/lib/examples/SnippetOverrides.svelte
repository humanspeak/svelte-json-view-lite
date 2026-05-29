<script lang="ts">
    import { JsonView } from '@humanspeak/svelte-json-view-lite'
    import { docsDarkJsonViewStyles, docsDefaultJsonViewStyles } from '$lib/json-view-docs-style'
    import { mode } from 'mode-watcher'

    let linkify = $state(true)
    let relativeDates = $state(true)
    let formatNumbers = $state(true)
    let badgeBooleans = $state(true)

    const payload = {
        user: {
            name: 'Ada Lovelace',
            email: 'ada@example.com',
            homepage: 'https://en.wikipedia.org/wiki/Ada_Lovelace',
            verified: true,
            blocked: false
        },
        stats: {
            views: 12_345_678,
            stars: 42_101,
            latencyMs: 12.4
        },
        events: {
            created: new Date('2020-12-10T09:15:00Z'),
            lastSeen: new Date(Date.now() - 3 * 86_400_000)
        },
        references: ['https://svelte.dev', 'https://github.com/humanspeak/svelte-json-view-lite']
    }

    const isUrl = (value: string) => /^https?:\/\//.test(value)
    const numberFormatter = new Intl.NumberFormat('en-US')
    const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const relative = (value: Date) => {
        const diff = value.getTime() - Date.now()
        const days = Math.round(diff / 86_400_000)
        if (Math.abs(days) >= 1) return relativeFormatter.format(days, 'day')
        const hours = Math.round(diff / 3_600_000)
        return relativeFormatter.format(hours, 'hour')
    }

    const style = $derived(
        mode.current === 'light' ? docsDefaultJsonViewStyles : docsDarkJsonViewStyles
    )
</script>

<div class="json-demo column">
    <div class="json-demo-controls">
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={linkify} />
            linkify URLs
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={relativeDates} />
            relative dates
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={formatNumbers} />
            format numbers
        </label>
        <label class="json-demo-control">
            <input type="checkbox" bind:checked={badgeBooleans} />
            badge booleans
        </label>
    </div>

    <div class="json-demo-body">
        <JsonView data={payload} {style}>
            {#snippet string({ value, field })}
                {#if linkify && isUrl(value)}
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="json-demo-link"
                    >
                        {value}
                    </a>
                {:else if linkify && field === 'email'}
                    <a href={`mailto:${value}`} class="json-demo-link">
                        {value}
                    </a>
                {:else}
                    "{value}"
                {/if}
            {/snippet}

            {#snippet number({ value })}
                {#if formatNumbers}
                    <span class="tabular-nums">{numberFormatter.format(value)}</span>
                {:else}
                    {value}
                {/if}
            {/snippet}

            {#snippet boolean({ value })}
                {#if badgeBooleans}
                    <span class="json-demo-badge {value ? 'true' : 'false'}">
                        {value ? 'yes' : 'no'}
                    </span>
                {:else}
                    {value}
                {/if}
            {/snippet}

            {#snippet date({ value })}
                {#if relativeDates}
                    <time
                        datetime={value.toISOString()}
                        title={value.toISOString()}
                        class="json-demo-muted"
                    >
                        {relative(value)}
                    </time>
                {:else}
                    "{value.toISOString()}"
                {/if}
            {/snippet}
        </JsonView>
    </div>
</div>

<style>
    .json-demo-link {
        color: var(--brut-accent);
        text-decoration: underline;
        text-decoration-style: dotted;
        text-underline-offset: 3px;
    }

    .json-demo-muted {
        color: var(--brut-ink-2);
        font-style: italic;
    }
</style>
