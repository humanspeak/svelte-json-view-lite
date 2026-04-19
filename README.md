# @humanspeak/svelte-json-view-lite

Fast, tiny JSON tree viewer for Svelte 5 — a port of
[react-json-view-lite](https://github.com/AnyRoad/react-json-view-lite)
(MIT © 2024 AnyRoad) with runes, SSR, per-type snippet overrides, and zero
runtime dependencies.

[![NPM version](https://img.shields.io/npm/v/@humanspeak/svelte-json-view-lite.svg)](https://www.npmjs.com/package/@humanspeak/svelte-json-view-lite)
[![Build Status](https://github.com/humanspeak/svelte-json-view-lite/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/humanspeak/svelte-json-view-lite/actions/workflows/npm-publish.yml)
[![Coverage Status](https://coveralls.io/repos/github/humanspeak/svelte-json-view-lite/badge.svg?branch=main)](https://coveralls.io/github/humanspeak/svelte-json-view-lite?branch=main)
[![License](https://img.shields.io/npm/l/@humanspeak/svelte-json-view-lite.svg)](https://github.com/humanspeak/svelte-json-view-lite/blob/main/LICENSE)
[![Downloads](https://img.shields.io/npm/dm/@humanspeak/svelte-json-view-lite.svg)](https://www.npmjs.com/package/@humanspeak/svelte-json-view-lite)
[![CodeQL](https://github.com/humanspeak/svelte-json-view-lite/actions/workflows/codeql.yml/badge.svg)](https://github.com/humanspeak/svelte-json-view-lite/actions/workflows/codeql.yml)
[![Install size](https://packagephobia.com/badge?p=@humanspeak/svelte-json-view-lite)](https://packagephobia.com/result?p=@humanspeak/svelte-json-view-lite)
[![Code Style: Trunk](https://img.shields.io/badge/code%20style-trunk-blue.svg)](https://trunk.io)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Types](https://img.shields.io/npm/types/@humanspeak/svelte-json-view-lite.svg)](https://www.npmjs.com/package/@humanspeak/svelte-json-view-lite)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/humanspeak/svelte-json-view-lite/graphs/commit-activity)

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

## Retheme via CSS variables

Every color in the built-in themes is declared as a CSS custom property
on the root container, so you can tweak one or more colors without
swapping the entire `style` prop or bringing your own classname map.
The variables all live under the `--sjv-*` namespace:

| Variable            | Default (light)    | Default (dark)       | Applies to                                 |
| ------------------- | ------------------ | -------------------- | ------------------------------------------ |
| `--sjv-background`  | `#eee`             | `rgb(0, 43, 54)`     | Root container background                  |
| `--sjv-label`       | `#000000`          | `rgb(253, 246, 227)` | Field label text                           |
| `--sjv-punctuation` | `#000000`          | `rgb(253, 246, 227)` | Brackets, colons, commas                   |
| `--sjv-string`      | `rgb(42, 63, 60)`  | `rgb(203, 75, 22)`   | String values                              |
| `--sjv-number`      | `#0b75f5`          | `rgb(211, 54, 130)`  | Number & BigInt values                     |
| `--sjv-boolean`     | `rgb(70, 144, 56)` | `rgb(174, 129, 255)` | Boolean values                             |
| `--sjv-null`        | `#df113a`          | `rgb(129, 181, 172)` | `null` literal                             |
| `--sjv-undefined`   | `#df113a`          | `rgb(129, 181, 172)` | `undefined` literal                        |
| `--sjv-other`       | `#43413d`          | `rgb(38, 139, 210)`  | Dates, functions, symbols, etc.            |
| `--sjv-expander`    | `#000000`          | `rgb(253, 246, 227)` | `▸` / `▾` icons and collapsed `...` marker |

**Global override** — applies to every `JsonView` on the page:

```css
:root {
    --sjv-string: lavender;
    --sjv-number: #ff71ce;
}
```

**Scoped override** — target one component (or a subtree):

```svelte
<div class="vaporwave">
    <JsonView {data} style={defaultStyles} />
</div>

<style>
    .vaporwave :global(div[role='tree']) {
        --sjv-background: #2b1055;
        --sjv-string: #01cdfe;
        --sjv-number: #05ffa1;
        --sjv-boolean: #b967ff;
    }
</style>
```

**Per-instance override** — forward inline styles via the root div (ARIA
attrs and `style` on `<JsonView>` are spread onto the wrapper):

```svelte
<JsonView {data} style={defaultStyles} style:--sjv-number="tomato" />
```

All three patterns work with either `defaultStyles` or `darkStyles` —
the variables are defined on both container classes with theme-specific
fallback defaults, so one override applies to whichever theme is active.

See the `/test/css-variables` playground route for a live example.

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

MIT © [Humanspeak, Inc.](LICENSE) Original `react-json-view-lite`
© 2024 AnyRoad.

## Credits

Made with ❤️ by [Humanspeak](https://humanspeak.com)
