<!-- Source: https://jsonview.svelte.page/docs/migration -->

# Migration

> Port react-json-view-lite usage to Svelte JSON View Lite with matching prop names and Svelte snippets.

**Source:** [https://jsonview.svelte.page/docs/migration](https://jsonview.svelte.page/docs/migration)

---

Svelte JSON View Lite intentionally follows `react-json-view-lite` closely. Most migrations are a component import change plus replacing React render functions with Svelte snippets when you need custom values.

## Install

```bash
npm i @humanspeak/svelte-json-view-lite
```

## Basic Component

```svelte
<script lang="ts">
    import { JsonView, defaultStyles } from '@humanspeak/svelte-json-view-lite'

    const data = { status: 'ok', count: 3 }
</script>

<JsonView {data} style={defaultStyles} />
```

## Prop Mapping

| React JSON View Lite | Svelte JSON View Lite | Notes |
| --- | --- | --- |
| `data` | `data` | Object or array JSON root. |
| `style` | `style` | Use `defaultStyles`, `darkStyles`, or a merged style map. |
| `shouldExpandNode` | `shouldExpandNode` | Same purpose: decide initial expansion by level and value. |
| `clickToExpandNode` | `clickToExpandNode` | Same interaction model. |
| `compactTopLevel` | `compactTopLevel` | Same root rendering option. |
| custom renderers | `snippets` | Svelte snippets replace React render callbacks. |

## Snippet Override

```svelte
<script lang="ts">
    import { JsonView, defaultStyles } from '@humanspeak/svelte-json-view-lite'

    const data = { url: 'https://jsonview.svelte.page' }
</script>

{#snippet stringValue(value: string)}
    {#if value.startsWith('https://')}
        <a href={value}>{value}</a>
    {:else}
        <span>{value}</span>
    {/if}
{/snippet}

<JsonView
    {data}
    style={defaultStyles}
    snippets={{ string: stringValue }}
/>
```

## Deliberate Difference

The original React package includes a typoed `ariaLables` style key. Svelte JSON View Lite uses `ariaLabels`, while still honoring the typoed key at runtime with a warning for compatibility.
