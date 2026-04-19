# @humanspeak/svelte-json-view-lite

Fast, tiny JSON tree viewer for Svelte 5 — a port of
[react-json-view-lite](https://github.com/AnyRoad/react-json-view-lite)
(MIT © 2024 AnyRoad) with runes, SSR, per-type snippet overrides, and zero
runtime dependencies.

## Features

- Svelte 5 runes throughout (`$props`, `$state`, `$derived`, `$effect`).
- Drop-in API parity with `react-json-view-lite`: same prop names, themes,
  and strategy helpers.
- Per-type `Snippet` overrides for custom value rendering (strings, numbers,
  dates, etc.) — new in the Svelte port.
- SSR-safe: uses `$props.id()` for stable `aria-controls` linkage across
  server/client.
- Keyboard accessible: roving tabindex + `ArrowUp`/`ArrowDown`/`ArrowLeft`/
  `ArrowRight` navigation, full WAI-ARIA treeview semantics.
- Ships built-in light and dark themes via CSS Modules.

## Installation

```bash
npm i -S @humanspeak/svelte-json-view-lite
# or
pnpm add @humanspeak/svelte-json-view-lite
```

## Basic usage

```svelte
<script lang="ts">
    import { JsonView, defaultStyles } from '@humanspeak/svelte-json-view-lite'

    const data = {
        name: 'Ada Lovelace',
        tags: ['admin', 'beta'],
        active: true,
        joined: new Date('2024-01-15')
    }
</script>

<JsonView {data} style={defaultStyles} />
```

## Props

| Prop                    | Type                                     | Default         | Description                                                                        |
| ----------------------- | ---------------------------------------- | --------------- | ---------------------------------------------------------------------------------- |
| `data`                  | `object \| unknown[]`                    | —               | The JSON-shaped value to render.                                                   |
| `style`                 | `Partial<StyleProps>`                    | `defaultStyles` | Classname-map that themes every slot.                                              |
| `shouldExpandNode`      | `(level, value, field?) => boolean`      | `allExpanded`   | Initial-expand strategy per node.                                                  |
| `clickToExpandNode`     | `boolean`                                | `false`         | When true, clicking the field label also toggles the node.                         |
| `beforeExpandChange`    | `(event: NodeExpandingEvent) => boolean` | —               | Return `false` to veto an expand/collapse transition.                              |
| `compactTopLevel`       | `boolean`                                | `false`         | Spread root-object entries instead of nesting them under a single root expander.   |
| `string`, `number`, ... | `Snippet<[{ value, field?, level }]>`    | —               | Optional per-type renderer overrides. See [Snippet overrides](#snippet-overrides). |

Any additional HTML attributes (`aria-*`, `data-*`, `id`, `class`, etc.) are
forwarded onto the root `<div role="tree">`.

## Themes

Two themes ship out of the box:

```svelte
<script lang="ts">
    import { JsonView, defaultStyles, darkStyles } from '@humanspeak/svelte-json-view-lite'
</script>

<JsonView data={json} style={darkStyles} />
```

Override individual slots by spreading:

```svelte
<JsonView
    {data}
    style={{
        ...defaultStyles,
        stringValue: 'my-custom-string-class',
        punctuation: 'my-custom-punctuation-class'
    }}
/>
```

## Snippet overrides

Unlike the React lib, `svelte-json-view-lite` exposes typed `Snippet`
overrides for every primitive type plus the field label. Each snippet
receives `{ value, field?, level }`; omit the snippet to fall through to
the default rendering.

```svelte
<script lang="ts">
    import {
        JsonView,
        type DateSnippetProps,
        type StringSnippetProps
    } from '@humanspeak/svelte-json-view-lite'

    const data = {
        joined: new Date('2024-01-15'),
        docs: 'https://example.com/docs'
    }

    function relative(d: Date): string {
        const days = Math.round((d.getTime() - Date.now()) / 86_400_000)
        return new Intl.RelativeTimeFormat('en').format(days, 'day')
    }
</script>

<JsonView {data}>
    {#snippet date({ value }: DateSnippetProps)}
        <span title={value.toISOString()}>{relative(value)}</span>
    {/snippet}
    {#snippet string({ value }: StringSnippetProps)}
        {#if /^https?:/.test(value)}
            <a href={value}>{value}</a>
        {:else}
            "{value}"
        {/if}
    {/snippet}
</JsonView>
```

Available snippets: `string`, `number`, `boolean`, `null`, `undefined`,
`bigint`, `date`, `function`, `label`. Their typed prop interfaces
(`StringSnippetProps`, `LabelSnippetProps`, etc.) are all exported from
the package root.

## Expand strategies

```svelte
<script lang="ts">
    import { JsonView, collapseAllNested, allExpanded } from '@humanspeak/svelte-json-view-lite'
</script>

<!-- expand only the root, collapse every child -->
<JsonView {data} shouldExpandNode={collapseAllNested} />

<!-- expand everything (default) -->
<JsonView {data} shouldExpandNode={allExpanded} />

<!-- custom: expand up to depth 2 -->
<JsonView {data} shouldExpandNode={(level) => level < 2} />
```

## Migrating from `react-json-view-lite`

The Svelte API preserves the React prop names and theme-object shape. Only
two differences exist:

| React                       | Svelte                                                     |
| --------------------------- | ---------------------------------------------------------- |
| `style.ariaLables` (typoed) | `style.ariaLabels` (fixed; typo still honored with a warn) |
| — (not supported)           | Per-type `Snippet` overrides                               |

Everything else — `style`, `clickToExpandNode`, `compactTopLevel`,
`beforeExpandChange`, `shouldExpandNode`, `defaultStyles`, `darkStyles`,
`allExpanded`, `collapseAllNested` — works identically.

## Accessibility

- Root element has `role="tree"` with `aria-label="JSON view"` (overridable).
- Every expandable node is a `role="treeitem"` with live `aria-expanded`
  and, when open, `aria-controls` pointing at its child `<ul role="group">`.
- Keyboard support follows the [WAI-ARIA 1.2 Treeview pattern]:
    - `ArrowRight` expands, `ArrowLeft` collapses.
    - `ArrowDown` / `ArrowUp` move focus between expanders (wrapping).
    - Roving `tabindex` keeps only one expander in the tab order.

[WAI-ARIA 1.2 Treeview pattern]: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## Development

```bash
pnpm install
pnpm dev          # launch SvelteKit playground on :8233
pnpm check        # svelte-check
pnpm test         # vitest + coverage
pnpm build        # vite build + svelte-package + publint
```

## License

MIT. Copyright © 2024-2026 Humanspeak, Inc. Original
`react-json-view-lite` © 2024 AnyRoad.
