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

<div class="json-demo grid">
    <aside class="json-demo-rail">
        <div class="mb-4">
            <div class="json-demo-k">Presets</div>
            <div class="json-demo-actions">
                {#each Object.keys(presets) as name (name)}
                    <button onclick={() => applyPreset(name)}>
                        {name}
                    </button>
                {/each}
            </div>
        </div>

        <div>
            {#each tokenKeys as key (key)}
                <label class="json-demo-color-row">
                    <span>{tokenLabels[key]}</span>
                    <span>
                        <input type="color" bind:value={tokens[key]} />
                    </span>
                    <span>
                        <input type="text" bind:value={tokens[key]} />
                    </span>
                </label>
            {/each}
        </div>
    </aside>

    <div
        class="themer-preview json-demo-body"
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
