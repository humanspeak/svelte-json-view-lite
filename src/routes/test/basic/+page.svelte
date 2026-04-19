<script lang="ts">
    import { darkStyles, defaultStyles, JsonView } from '$lib/index.js'

    const sample = {
        string: 'hello world',
        number: 42,
        float: 3.14159,
        negative: -17,
        bigint: 9007199254740993n,
        boolean: true,
        falsey: false,
        nullish: null,
        undef: undefined,
        date: new Date('2025-06-15T12:00:00Z'),
        fn: function pow(n: number) {
            return n * n
        },
        emptyArray: [],
        emptyObject: {},
        array: [1, 'two', true, null, { nested: 'yes' }],
        nested: {
            level: {
                deeper: {
                    list: [{ name: 'alice' }, { name: 'bob' }]
                }
            }
        }
    }

    let theme = $state<'light' | 'dark'>('light')
    const activeStyle = $derived(theme === 'light' ? defaultStyles : darkStyles)
</script>

<main>
    <header>
        <h1>JsonView — basic</h1>
        <button type="button" onclick={() => (theme = theme === 'light' ? 'dark' : 'light')}>
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
        </button>
    </header>
    <JsonView data={sample} style={activeStyle} />
</main>

<style>
    main {
        padding: 2rem;
        font-family: system-ui, sans-serif;
        max-width: 960px;
        margin: 0 auto;
    }
    header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    h1 {
        font-size: 1.25rem;
        margin: 0;
    }
    button {
        padding: 0.4rem 0.8rem;
        border: 1px solid currentColor;
        background: transparent;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
