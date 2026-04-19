# CLAUDE.md

This file provides guidance for AI assistants working with this codebase.

## Project Overview

**@humanspeak/svelte-json-view-lite** is a Svelte 5 port of
[react-json-view-lite](https://github.com/AnyRoad/react-json-view-lite)
(MIT © 2024 AnyRoad). It mirrors the React lib's public API surface
closely so migrations are mechanical, and adds per-type `Snippet`
overrides as the one deliberate extension.

- **Package**: `@humanspeak/svelte-json-view-lite`
- **Repository**: <https://github.com/humanspeak/svelte-json-view-lite>
- **Sister library**: [`@humanspeak/svelte-markdown`](https://github.com/humanspeak/svelte-markdown)
  shares tooling, CI, Prettier/ESLint/Trunk config, and the SvelteKit
  packaging approach.

## Key Technologies

- Svelte 5 (runes required; no Svelte 4 compat)
- TypeScript strict mode with `checkJs: true`
- `@sveltejs/package` for library builds
- Vite + SvelteKit for the playground/dev server
- Vitest + `@testing-library/svelte` for unit tests
- Playwright for e2e (when wired up)
- Trunk for lint orchestration (prettier + eslint + actionlint + others)

## Project structure

```text
src/
├── lib/
│   ├── index.ts                   # Public exports + defaultStyles/darkStyles
│   ├── JsonView.svelte            # Root component
│   ├── DataRender.svelte          # Type dispatcher
│   ├── ExpandableObject.svelte    # Collapsible container (hot path)
│   ├── EmptyObject.svelte         # Empty {}/[] placeholder
│   ├── JsonPrimitiveValue.svelte  # Leaf renderer + snippet dispatch
│   ├── types.ts                   # All public + internal types
│   ├── styles.module.css          # Light + dark themes (verbatim port)
│   └── utils/
│       ├── dataTypeDetection.ts   # 10 type predicates (unknown-input)
│       ├── expandStrategies.ts    # allExpanded, collapseAllNested
│       └── quoteString.ts         # Field-label and string-value formatters
└── routes/
    ├── +page.svelte               # Playground index
    └── test/
        ├── basic/+page.svelte
        ├── compact/+page.svelte
        ├── click-to-expand/+page.svelte
        ├── snippets/+page.svelte
        └── edge-cases/+page.svelte
```

## Development commands

```bash
pnpm dev              # SvelteKit dev server on :8233
pnpm dev:pkg          # Rebuild the package in watch mode
pnpm check            # svelte-check
pnpm test             # vitest run --coverage
pnpm test:watch       # vitest watch
pnpm test:e2e         # playwright (when configured)
pnpm build            # vite build && svelte-package && publint
pnpm lint             # prettier --check + eslint
pnpm lint:fix         # prettier --write + eslint --fix
```

## Code style

- 4-space indentation, single quotes, no semicolons, 100-col width
  (enforced by `.prettierrc`).
- camelCase enforced by ESLint (`camelcase: 'error'`).
- No `eslint-disable` comments — use `// trunk-ignore(eslint/rule-name)`
  via Trunk. Same convention as svelte-markdown.
- Function-type parameter names must be prefixed with `_` if unused
  (e.g. `(_level: number, _value: unknown) => boolean` in the public
  `shouldExpandNode` signature).
- Co-locate tests next to source: `Foo.svelte` gets `Foo.test.ts`.
- Import Svelte 5 helpers from `svelte`, types from `./types.js`
  (NodeNext `.js` extension on TS imports).

## Architecture notes

### Component rendering

- `JsonView` merges the user theme onto `defaultStyles`, owns the
  `outerRef` getter wrapper, and dispatches the root `DataRender` (or
  multiple `DataRender` calls when `compactTopLevel` is true).
- `DataRender` is a pure dispatcher: `isArray` first, then
  `isObject && !isDate && !isFunction`, else `JsonPrimitiveValue`.
  Order matters — arrays are also objects.
- `ExpandableObject` is the hot path. It owns the `expanded` state,
  the `$props.id()` for `aria-controls`, the arrow-key handler, and
  the click handler that swaps the roving `tabindex`.
- `JsonPrimitiveValue` checks `snippets.<type>` before falling back to
  the default `<span class="{style.xxxValue}">...</span>`.

### Critical Svelte↔React translations

| React                       | Svelte                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `useState(() => fn())`      | `let x = $state(fn())` with `svelte-ignore state_referenced_locally` for the lazy init |
| `useRef<HTMLElement>(null)` | `let el = $state<T \| null>(null)` + `bind:this={el}`                                  |
| `useRef<boolean>(false)`    | Plain mutable `let` (no reactivity needed)                                             |
| `useEffect(fn, [dep])`      | `$effect(() => { const d = dep; ... })` reading only `dep`                             |
| `useId()`                   | `$props.id()`                                                                          |
| `onClick={fn}`              | `onclick={fn}` (no `on:` prefix in Svelte 5)                                           |
| `RefObject<T>` passed down  | `{ get current() { return el } }` getter wrapper                                       |

### OuterRef pattern

Children read `outerRef.current` to scope their
`querySelectorAll('[role=button]')` during keyboard navigation. The
root passes a **getter-backed** object, not a plain `{ current: el }`,
so children always see the current `bind:this` target rather than
whatever was captured at the first render.

### `ariaLables` vs `ariaLabels`

The React lib shipped a `StyleProps.ariaLables` typo. The Svelte port
fixes this to `ariaLabels` while still honoring the typoed key at
runtime (with `console.warn`) when the user provides it without
`ariaLabels`. This will be removed in 2.0.

## Testing guidelines

- Unit tests live beside source as `*.test.ts` (matched by
  `vite.config.ts` — `src/lib/**/*.test.ts`).
- Use `@testing-library/svelte`'s `render(Component, { props })` and
  `screen.getBy*` / `container.querySelector*` queries.
- Use `fireEvent` for click/keyboard — avoid `@testing-library/user-event`
  unless needed (jsdom focus model can be finicky).
- `vitest.setup.ts` enables fake timers by default; use
  `vi.useRealTimers()` inside `beforeEach` for keyboard-nav tests.
- Coverage target: ≥90%.

## Non-goals

- JSON editing / WYSIWYG.
- Virtualized / windowed rendering.
- Copy-to-clipboard helpers (users plug in via the `node` snippet or
  custom `string` renderer).
- Syntax highlighting — this is a tree viewer, not a code editor.

## Key files to understand

1. `src/lib/index.ts` — complete public surface.
2. `src/lib/ExpandableObject.svelte` — state, effects, keyboard, ARIA.
3. `src/lib/JsonView.svelte` — theme merge + outerRef plumbing.
4. `src/lib/JsonPrimitiveValue.svelte` — snippet-dispatch fallback chain.
5. `src/lib/styles.module.css` — theme source of truth.

## PR / commit guidelines

- Tests required for new features; coverage stays ≥90%.
- Never skip the pre-commit hook (`--no-verify`). The hook has a
  bootstrap guard so it safely no-ops on the very first commit in a
  fresh clone.
- README must be updated when the public API changes.
