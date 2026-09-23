# Competitive analysis: @zerodevx/svelte-json-view

Verified September 23, 2026 against the npm 2.0.0 package and tagged source.
Our baseline is @humanspeak/svelte-json-view-lite 0.2.2 at main commit e1a7052.

## What it is

@zerodevx/svelte-json-view is a small, read-only JSON tree component maintained
by Jason Lee (zerodevx), licensed ISC. It is a direct alternative for Svelte
applications displaying API responses, logs, and structured data. It is much
closer to our product than a full JSON editor or a React-only inspector.

The npm registry reports 2.0.0, published July 31, 2026, as latest. This release
uses Svelte 5 runes and declares an optional `svelte: ^5.0.0` peer. There are no
runtime dependencies. Search-indexed npm pages still showing 1.0.11 are stale.
The v2 release notes direct Svelte 4 and earlier users to v1.x.

It exports a Svelte `JsonView` component taking `json` and `depth` (default
`Infinity`). Its separate `bundled.js` entry exports `createJsonView` for
non-Svelte apps, with `update(json)` and `destroy()` methods. Ten CSS custom
properties control colors, indentation, borders, and bracket hover styling.

## Verified comparison

| Capability                                 | Humanspeak 0.2.2                                    | zerodevx 2.0.0                                              |
| ------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------- |
| Svelte 5 runes                             | Yes                                                 | Yes                                                         |
| Read-only expandable tree                  | Yes                                                 | Yes                                                         |
| Runtime dependencies                       | None                                                | None                                                        |
| CSS-variable theming                       | `--sjv-*`, plus style maps and light/dark exports   | Ten `--json*` variables                                     |
| Data prop                                  | `data`                                              | `json`                                                      |
| Expansion policy                           | `shouldExpandNode(level, value, field)`             | Numeric `depth`                                             |
| Expansion veto                             | `beforeExpandChange`                                | No public callback                                          |
| Custom rendering                           | Nine typed snippets for primitive values and labels | No public snippet/slot API                                  |
| Keyboard interaction                       | Arrow navigation, roving tabindex, Enter/Space      | Focusable brackets toggle with Enter/Space                  |
| Tree semantics                             | `tree`, `treeitem`, `group`, expansion state        | Lists and bracket buttons; no tree roles or `aria-expanded` |
| TypeScript declarations                    | Typed public props and snippet contexts             | Shipped declarations; `json` is `any`                       |
| Standalone vanilla-JS bundle               | No                                                  | Yes, including CDN usage                                    |
| Editing, schema validation, virtualization | No                                                  | No public APIs for these                                    |
| License                                    | MIT                                                 | ISC                                                         |

These are source/API observations, not an independent accessibility audit or
performance benchmark. Keyboard support is present in zerodevx; describing it
as having no keyboard support would be false. Runes, CSS variables, TypeScript
declarations, and zero dependencies are shared strengths, not unique advantages.

Our `$props.id()` supports stable ARIA relationships. Its component does not
generate comparable ARIA IDs, so this is not evidence that zerodevx has SSR or
hydration defects. Do not claim that it lacks SSR support. Do not claim that
our bundle is smaller or rendering is faster without a reproducible benchmark.

## Migration implications

A basic migration changes the import and renames `json` to `data`. Depth is
zero-based in the inspected zerodevx implementation: it collapses a container
when `depth < _cur`. Consequently `depth={0}` keeps the root expanded and
collapses nested containers. The corresponding initial policy is
`shouldExpandNode={(level) => level <= 0}`, or `collapseAllNested`.

For a general depth `d`, start with `shouldExpandNode={(level) => level <= d}`.
This maps the initial threshold, not every later user-toggle or prop-update
behavior. Recheck interactive behavior when migrating dynamic depth controls.
CSS variable names also differ and require deliberate theme mapping.

Source inspection identifies further edge-case differences: zerodevx formats
primitive children through `JSON.stringify` except functions, symbols, and
undefined. BigInt children therefore throw; Date objects are traversed as
objects and normally display as empty braces. Our explicit BigInt and Date
renderers avoid those particular paths. These observations have not been
browser-tested in zerodevx and should not headline the public comparison.

## Positioning and the missing page

Choose zerodevx for the minimal `json`/`depth` configuration or a standalone
vanilla-JS/CDN widget. Choose Humanspeak for typed rendering overrides,
tree keyboard navigation and ARIA relationships, expansion callbacks, or
react-json-view-lite API familiarity. Both are appropriate read-only choices;
neither provides the editing workflows of svelte-jsoneditor.

Add `/compare/vs-zerodevx-svelte-json-view` as a direct Svelte alternative,
with the scoped npm name in the title and copy. Target the package name and
“zerodevx json view” while keeping the homepage focused on generic viewer
queries. This is a relevance recommendation, not a measured search-volume claim.

The existing `compare-data.ts` collection feeds the comparison index, homepage
table, dynamic prerender entries, sitemap, social cards, and LLM comparison
mirrors. Add the record there and update the index introduction. Include dated
primary-source links on the public page. Promote the package from the state
watchlist into configured competitors so later digest runs track its releases.

The existing September 23 digest state reports 35,952 weekly downloads for
zerodevx versus 994 for us. Those are inherited report snapshots, not newly
verified measurements or a basis for a permanent public popularity claim.
Its requested Ahrefs keyword additions remain a separate outstanding action.

## Primary sources

- [npm registry metadata](https://registry.npmjs.org/@zerodevx/svelte-json-view)
  — latest tag, publish time, dependencies, peer range, license, export map.
- [v2.0.0 release](https://github.com/zerodevx/svelte-json-view/releases/tag/v2.0.0)
  — Svelte 5 runes migration and v1 compatibility guidance.
- [v2.0.0 README](https://github.com/zerodevx/svelte-json-view/blob/v2.0.0/README.md)
  — component API, CSS variables, standalone usage.
- [v2.0.0 component](https://github.com/zerodevx/svelte-json-view/blob/v2.0.0/src/lib/JsonView.svelte)
  — expansion threshold, rendering, keyboard handling, roles, props.
- [v2.0.0 standalone wrapper](https://github.com/zerodevx/svelte-json-view/blob/v2.0.0/src/lib/bundled.svelte.js)
  — create/update/destroy API.
- [Published npm archive](https://registry.npmjs.org/@zerodevx/svelte-json-view/-/svelte-json-view-2.0.0.tgz)
  — inspected `dist/JsonView.svelte`, declarations, and bundle declarations.
- [Our public types at the baseline](https://github.com/humanspeak/svelte-json-view-lite/blob/e1a7052/src/lib/types.ts)
  and [expansion helpers](https://github.com/humanspeak/svelte-json-view-lite/blob/e1a7052/src/lib/utils/expandStrategies.ts).
