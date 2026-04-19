<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'

    const data = {
        nullValue: null,
        undefinedValue: undefined,
        emptyString: '',
        emptyObject: {},
        emptyArray: [],
        bigint: 9_007_199_254_740_993n,
        date: new Date('2025-06-15T12:00:00Z'),
        fn: function doThing(n: number) {
            return n * n
        },
        regex: /a-z+/gi,
        error: new Error('boom'),
        nested: { very: { deeply: { nested: { value: 42 } } } }
    }
</script>

<main>
    <h1>JsonView — edge cases</h1>
    <p>
        Covers every primitive type plus empty containers, functions, errors, regex, and a deeply
        nested structure.
    </p>
    <JsonView {data} style={defaultStyles} />
</main>

<style>
    main {
        padding: 2rem;
        font-family: system-ui, sans-serif;
        max-width: 720px;
        margin: 0 auto;
    }
</style>
