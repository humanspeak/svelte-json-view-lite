<script lang="ts">
    import { JsonView, defaultStyles } from '@humanspeak/svelte-json-view-lite'

    type TokenKey =
        | 'background'
        | 'label'
        | 'punctuation'
        | 'string'
        | 'number'
        | 'boolean'
        | 'null'
        | 'undefined'
        | 'other'
        | 'expander'

    type Preset = Record<TokenKey, string>

    const presets: Record<string, Preset> = {
        Default: {
            background: '#eeeeee',
            label: '#000000',
            punctuation: '#000000',
            string: '#2a3f3c',
            number: '#0b75f5',
            boolean: '#469038',
            null: '#df113a',
            undefined: '#df113a',
            other: '#43413d',
            expander: '#000000'
        },
        Solarized: {
            background: '#002b36',
            label: '#fdf6e3',
            punctuation: '#fdf6e3',
            string: '#cb4b16',
            number: '#d33682',
            boolean: '#ae81ff',
            null: '#81b5ac',
            undefined: '#81b5ac',
            other: '#268bd2',
            expander: '#fdf6e3'
        },
        Dracula: {
            background: '#282a36',
            label: '#f8f8f2',
            punctuation: '#6272a4',
            string: '#f1fa8c',
            number: '#bd93f9',
            boolean: '#50fa7b',
            null: '#ff5555',
            undefined: '#ff5555',
            other: '#ffb86c',
            expander: '#8be9fd'
        },
        GitHub: {
            background: '#ffffff',
            label: '#24292f',
            punctuation: '#6e7781',
            string: '#0a3069',
            number: '#0550ae',
            boolean: '#116329',
            null: '#82071e',
            undefined: '#82071e',
            other: '#953800',
            expander: '#24292f'
        }
    }

    let tokens = $state<Preset>({ ...presets.Default })

    const payload = {
        name: 'Ada Lovelace',
        level: 42,
        active: true,
        gamma: null,
        tags: ['admin', 'beta'],
        meta: { created: '2024-01-15', notes: undefined }
    }

    const applyPreset = (name: string) => {
        tokens = { ...presets[name] }
    }

    const tokenLabels: Record<TokenKey, string> = {
        background: '--sjv-background',
        label: '--sjv-label',
        punctuation: '--sjv-punctuation',
        string: '--sjv-string',
        number: '--sjv-number',
        boolean: '--sjv-boolean',
        null: '--sjv-null',
        undefined: '--sjv-undefined',
        other: '--sjv-other',
        expander: '--sjv-expander'
    }

    const tokenKeys = Object.keys(tokenLabels) as TokenKey[]
</script>

<div
    class="border-border bg-card mx-auto grid h-[calc(100vh-10rem)] min-h-[640px] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border shadow-sm lg:grid-cols-[320px_1fr]"
>
    <aside class="border-border bg-muted/40 overflow-auto border-b p-4 lg:border-r lg:border-b-0">
        <div class="mb-4">
            <div class="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Presets
            </div>
            <div class="flex flex-wrap gap-2">
                {#each Object.keys(presets) as name (name)}
                    <button
                        onclick={() => applyPreset(name)}
                        class="border-border text-foreground hover:border-brand-500/50 rounded-md border bg-white px-2.5 py-1 text-xs font-medium transition-colors"
                    >
                        {name}
                    </button>
                {/each}
            </div>
        </div>

        <div class="space-y-2">
            {#each tokenKeys as key (key)}
                <label class="flex items-center justify-between gap-2 text-xs">
                    <span class="text-muted-foreground font-mono">{tokenLabels[key]}</span>
                    <span class="flex items-center gap-2">
                        <input
                            type="color"
                            bind:value={tokens[key]}
                            class="border-border h-6 w-8 cursor-pointer rounded border"
                        />
                        <input
                            type="text"
                            bind:value={tokens[key]}
                            class="border-border bg-background text-foreground w-20 rounded border px-1.5 py-0.5 font-mono text-xs"
                        />
                    </span>
                </label>
            {/each}
        </div>
    </aside>

    <div
        class="themer-preview bg-background overflow-auto p-6"
        style:--sjv-background={tokens.background}
        style:--sjv-label={tokens.label}
        style:--sjv-punctuation={tokens.punctuation}
        style:--sjv-string={tokens.string}
        style:--sjv-number={tokens.number}
        style:--sjv-boolean={tokens.boolean}
        style:--sjv-null={tokens.null}
        style:--sjv-undefined={tokens.undefined}
        style:--sjv-other={tokens.other}
        style:--sjv-expander={tokens.expander}
    >
        <JsonView data={payload} style={defaultStyles} />
    </div>
</div>

<style>
    .themer-preview :global([role='tree']) {
        --sjv-background: inherit;
        --sjv-label: inherit;
        --sjv-punctuation: inherit;
        --sjv-string: inherit;
        --sjv-number: inherit;
        --sjv-boolean: inherit;
        --sjv-null: inherit;
        --sjv-undefined: inherit;
        --sjv-other: inherit;
        --sjv-expander: inherit;
    }
</style>
