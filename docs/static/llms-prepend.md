# Svelte JSON View Lite

`@humanspeak/svelte-json-view-lite` is a fast, tiny JSON tree viewer for Svelte 5. It mirrors the `react-json-view-lite` public API closely so React migrations stay mechanical, while adding typed Svelte snippet overrides for per-value rendering.

```bash
npm i @humanspeak/svelte-json-view-lite
```

```svelte
<script lang="ts">
    import { JsonView, defaultStyles } from '@humanspeak/svelte-json-view-lite'

    const data = {
        user: { id: 42, name: 'Ada Lovelace' },
        flags: ['admin', 'beta'],
        active: true
    }
</script>

<JsonView {data} style={defaultStyles} />
```

## What To Use It For

- Render read-only JSON in API explorers, dashboards, logs, docs, and AI-generated artifacts.
- Port existing `react-json-view-lite` usage into Svelte 5 without switching mental models.
- Customize labels, strings, numbers, booleans, dates, functions, null, undefined, and bigint values with typed snippets.
- Keep JSON inspection accessible with tree semantics, disclosure controls, keyboard navigation, and SSR-safe markup.
- Theme the viewer with the built-in light/dark maps or the `--sjv-*` CSS variables.

## Key API

- `data`: required object or array to render.
- `style`: style map such as `defaultStyles`, `darkStyles`, or a merged custom style object.
- `shouldExpandNode`: callback controlling initial expansion by level and value.
- `clickToExpandNode`: lets row labels toggle their object or array node.
- `compactTopLevel`: renders root object entries without an extra wrapper.
- `snippets`: per-type Svelte snippets for custom primitive and label rendering.

## Accessibility Notes

The component renders a navigable JSON tree rather than a static `<pre>`. Object and array nodes expose expansion state, controls receive stable ids, and keyboard handling is scoped through the root element so multiple viewers can coexist on one page.
