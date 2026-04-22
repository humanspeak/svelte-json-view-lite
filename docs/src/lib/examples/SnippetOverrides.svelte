<script lang="ts">
    import { JsonView, darkStyles, defaultStyles } from '@humanspeak/svelte-json-view-lite'
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

    const style = $derived(mode.current === 'dark' ? darkStyles : defaultStyles)
</script>

<div
    class="border-border bg-card mx-auto flex h-[calc(100vh-10rem)] min-h-[600px] w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-sm"
>
    <div
        class="border-border bg-muted/40 flex flex-wrap items-center gap-4 border-b px-4 py-2 text-xs"
    >
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={linkify} class="accent-brand-500" />
            Linkify URLs
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={relativeDates} class="accent-brand-500" />
            Relative dates
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={formatNumbers} class="accent-brand-500" />
            Format numbers
        </label>
        <label class="text-foreground flex items-center gap-1.5 font-medium">
            <input type="checkbox" bind:checked={badgeBooleans} class="accent-brand-500" />
            Badge booleans
        </label>
    </div>

    <div class="bg-background flex-1 overflow-auto p-6">
        <JsonView data={payload} {style}>
            {#snippet string({ value, field })}
                {#if linkify && isUrl(value)}
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-brand-500 underline decoration-dotted underline-offset-2"
                    >
                        {value}
                    </a>
                {:else if linkify && field === 'email'}
                    <a
                        href={`mailto:${value}`}
                        class="text-brand-500 underline decoration-dotted underline-offset-2"
                    >
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
                    <span
                        class="rounded px-1.5 py-0.5 text-xs font-medium"
                        class:bg-green-100={value}
                        class:text-green-900={value}
                        class:bg-red-100={!value}
                        class:text-red-900={!value}
                    >
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
                        class="text-muted-foreground italic"
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
