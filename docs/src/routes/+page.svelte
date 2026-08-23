<script lang="ts">
    import { HeaderV2, FooterV2, getBreadcrumbContext, getSeoContext } from '@humanspeak/docs-kit'
    import { JsonView } from '@humanspeak/svelte-json-view-lite'
    import { AnimatePresence, MotionButton, MotionSpan } from '@humanspeak/svelte-motion'
    import { docsDarkJsonViewStyles, docsDefaultJsonViewStyles } from '$lib/json-view-docs-style'
    import { comparisons } from '$lib/compare-data'
    import { docsConfig } from '$lib/docs-config'
    import { headerNav } from '$lib/docsNav'
    import favicon from '$lib/assets/logo.svg'
    import { mode } from 'mode-watcher'
    import '@fontsource-variable/inter/index.css'
    import '@fontsource-variable/jetbrains-mono/index.css'
    import type { PageData } from './$types'

    const { data }: { data: PageData } = $props()
    const packageStats = $derived(data.packageStats)

    const breadcrumbContext = getBreadcrumbContext()
    if (breadcrumbContext) breadcrumbContext.breadcrumbs = []

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Svelte JSON Viewer for Svelte 5 | Zero Dependencies'
        seo.description =
            'Read-only Svelte JSON viewer for Svelte 5 with zero runtime dependencies, typed snippets, accessible tree navigation, and react-json-view-lite API compatibility.'
    }

    const PKG_NAME = $derived(packageStats.name)
    const PKG_VERSION = $derived(packageStats.version)
    const TARBALL_KB = $derived(
        packageStats.tarballBytes !== null
            ? Math.round(packageStats.tarballBytes / 102.4) / 10
            : null
    )

    const stats = $derived([
        { k: 'themes', v: '2', n: 'light + dark', ac: true },
        { k: 'snippets', v: '9', n: 'typed overrides' },
        { k: 'aria', v: 'tree', n: 'keyboard-ready', ac: true },
        {
            k: 'tarball',
            v: TARBALL_KB !== null ? String(TARBALL_KB) : '—',
            sup: TARBALL_KB !== null ? 'kB' : undefined,
            n: 'packed (npm gz)'
        },
        { k: 'runtime deps', v: '0', n: 'zero dependencies' },
        { k: 'licence', v: 'MIT', n: 'upstream MIT' }
    ])

    const sampleJson = {
        user: {
            id: 42,
            name: 'Ada Lovelace',
            roles: ['admin', 'beta'],
            joined: '2024-01-15T09:00:00.000Z'
        },
        metrics: {
            requests: 1523,
            errors: 0,
            latencyMs: 12.4
        },
        featureFlags: {
            compactTopLevel: true,
            clickToExpandNode: true,
            snippets: ['string', 'number', 'date', 'label']
        },
        active: true,
        nextReview: null
    }

    const viewerStyle = $derived(
        mode.current === 'dark' ? docsDarkJsonViewStyles : docsDefaultJsonViewStyles
    )
    const sampleJsonText = JSON.stringify(sampleJson, null, 4)
    let editorText = $state(sampleJsonText)

    type ParseResult = { value: unknown; error: string | null }
    const parseResult = $derived.by<ParseResult>(() => {
        try {
            return { value: JSON.parse(editorText), error: null }
        } catch (err) {
            return { value: null, error: err instanceof Error ? err.message : String(err) }
        }
    })
    const jsonPreviewData = $derived(
        parseResult.value && typeof parseResult.value === 'object'
            ? (parseResult.value as object | unknown[])
            : null
    )
    const currentRootKeys = $derived(
        jsonPreviewData && !Array.isArray(jsonPreviewData) ? Object.keys(jsonPreviewData).length : 0
    )
    const currentLineCount = $derived(editorText.split('\n').length)
    const sampleSnippetCount = sampleJson.featureFlags.snippets.length
    const resetJson = () => {
        editorText = sampleJsonText
    }

    const features = [
        {
            title: 'React API Parity',
            body: 'Keep the familiar react-json-view-lite prop shape while moving rendering into Svelte 5.'
        },
        {
            title: 'Svelte 5 Runes',
            body: '$props, $state, $derived, and $effect throughout — no Svelte 4 compatibility layer.'
        },
        {
            title: 'Typed Snippet Overrides',
            body: 'Customize strings, numbers, booleans, dates, functions, null, undefined, bigint, and labels inline.'
        },
        {
            title: 'Accessible Treeview',
            body: 'role="tree", aria-expanded, aria-controls, and roving tabindex keyboard navigation.'
        },
        {
            title: 'CSS Variable Themes',
            body: 'Built-in light and dark themes expose every color through the --sjv-* namespace.'
        },
        {
            title: 'Zero Runtime Dependencies',
            body: 'A compact viewer for dashboards, docs, logs, API explorers, and generated JSON artifacts.'
        }
    ]

    const compareRows = comparisons.map((c) => {
        const featureMap = new Map(c.features.map((f) => [f.name, f]))
        const find = (name: string) => featureMap.get(name)?.them
        const framework = () => {
            if (
                find('Svelte 5 Native') === true ||
                find('Svelte 5 Native') === 'Svelte component'
            ) {
                return 'Svelte'
            }
            if (find('Framework Agnostic')) return 'agnostic'
            return 'React'
        }
        return {
            slug: c.slug,
            name: c.name,
            relationship: c.relationshipLabel,
            framework: framework(),
            readOnly: find('Read-only Tree View') ?? true,
            editing: find('JSON Editing') ?? find('Editing Callbacks') ?? false,
            snippets: find('Snippet Overrides') ?? find('Svelte Snippets') ?? false,
            theming:
                find('Theme Customization') ?? (c.name.includes('jsoneditor') ? true : 'theme'),
            deps: find('Zero Runtime Dependencies') ?? false
        }
    })

    const formatCell = (v: string | boolean): { text: string; cls: string } => {
        if (v === true) return { text: 'yes', cls: 'y' }
        if (v === false) return { text: 'no', cls: 'n' }
        return { text: String(v), cls: '' }
    }

    const featuredExamples = [
        {
            slug: 'playground',
            title: 'Live Playground',
            body: 'Edit JSON and watch the tree update with parse errors surfaced inline.'
        },
        {
            slug: 'snippet-overrides',
            title: 'Snippet Overrides',
            body: 'Decorate URLs, dates, labels, booleans, and primitive values with Svelte snippets.'
        },
        {
            slug: 'css-variables',
            title: 'CSS Variable Themer',
            body: 'Tune --sjv-* variables live without replacing the style map.'
        },
        {
            slug: 'click-to-expand',
            title: 'Click to Expand',
            body: 'Make labels toggle nodes in addition to the disclosure control.'
        },
        {
            slug: 'edge-cases',
            title: 'Edge Cases',
            body: 'Dates, functions, undefined, bigint, nested arrays, and compact top-level output.'
        },
        {
            slug: 'accessibility',
            title: 'ARIA Treeview',
            body: 'Inspect roles, expanded state, keyboard focus, and labelled node controls in context.'
        }
    ]

    const installCmd = $derived(`npm i ${PKG_NAME}`)
    let copied = $state(false)
    let copiedTimeout: ReturnType<typeof setTimeout> | undefined
    const copyInstall = async () => {
        copied = true
        if (copiedTimeout) clearTimeout(copiedTimeout)
        copiedTimeout = setTimeout(() => (copied = false), 1500)

        if (typeof navigator === 'undefined' || !navigator.clipboard) return
        try {
            await navigator.clipboard.writeText(installCmd)
        } catch {
            /* clipboard blocked */
        }
    }
</script>

<div class="brut-wrap flex min-h-svh flex-col">
    <HeaderV2 config={docsConfig} {favicon} version={PKG_VERSION} nav={headerNav} />

    <main class="brut">
        <div class="brut-coord" aria-hidden="true">
            {#each Array(12) as _, i (i)}
                <div>{String(i + 1).padStart(2, '0')}</div>
            {/each}
        </div>

        <section class="brut-hero">
            <div class="corner tr">FIG-001 · MASTHEAD</div>
            <aside class="meta">
                <div><span class="k">pkg</span> · <span class="v">{PKG_NAME}</span></div>
                <div><span class="k">version</span> · <span class="v">{PKG_VERSION}</span></div>
                <div>
                    <span class="k">tarball</span> ·
                    <span class="v">{TARBALL_KB !== null ? `${TARBALL_KB} kB gz` : '—'}</span>
                </div>
                <div><span class="k">deps</span> · <span class="v">0</span></div>
                <div><span class="k">licence</span> · <span class="v">MIT</span></div>
                <hr />
                <div><span class="k">themes</span> · <span class="v">light / dark</span></div>
                <div><span class="k">snippets</span> · <span class="v">9 typed</span></div>
                <div><span class="k">aria</span> · <span class="v accent">treeview</span></div>
                <hr />
                <div class="k">// scroll for full spec</div>
            </aside>
            <div class="hero-body">
                <h1>
                    <span>svelte</span><span class="slash">/</span><span>json</span><span
                        class="end">.</span
                    >
                </h1>
                <p class="sub">
                    A <b>fast, tiny</b> JSON tree viewer for Svelte 5 — built for API explorers, dashboards,
                    logs, docs, and generated JSON artifacts. React API parity, typed snippets, SSR-safe
                    ARIA tree semantics, CSS-variable theming, and zero runtime dependencies.
                </p>
                <div class="cta-row">
                    <a class="pri" href="/docs/getting-started">get started ↗</a>
                    <a href="/docs/api/json-view">api reference</a>
                    <a href="/examples">examples</a>
                    <a href="/compare">compare</a>
                    <a href="/blog">blog</a>
                    <MotionButton
                        class="inst"
                        type="button"
                        onclick={copyInstall}
                        aria-label="Copy install command"
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                    >
                        <span class="inst-prompt">$</span>
                        <span class="inst-cmd">npm i <span class="pkg">{PKG_NAME}</span></span>
                        <span class="inst-copy {copied ? 'is-copied' : ''}">
                            <AnimatePresence initial={false}>
                                <MotionSpan
                                    key={copied ? 'copied' : 'idle'}
                                    class="inst-copy-label"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                >
                                    {copied ? '✓ copied' : 'copy'}
                                </MotionSpan>
                            </AnimatePresence>
                        </span>
                    </MotionButton>
                </div>
            </div>
            <div class="corner bl">FIG-001</div>
            <div class="corner br">SHEET 01 / 07</div>
        </section>

        <section class="brut-stats">
            {#each stats as s, i (s.k)}
                <div class="s {s.ac ? 'ac' : ''}" data-idx="/0{i + 1}">
                    <div class="k">{s.k}</div>
                    <div class="v">
                        <span class="v-num">{s.v}</span>{#if s.sup}<span class="v-unit"
                                >{s.sup}</span
                            >{/if}
                    </div>
                    <div class="note">{s.n}</div>
                </div>
            {/each}
        </section>

        <section class="brut-demo" id="playground">
            <div class="lede">
                <div class="k">FIG-002 / JSON TREE</div>
                <h2>inspect <span>structured data</span>.</h2>
                <p>
                    Render object and array payloads as an accessible Svelte tree. The viewer
                    follows the active site theme through <code>mode-watcher</code>; no separate
                    theme toggle lives inside the demo.
                </p>
            </div>
            <div class="panel">
                <div class="bar">
                    <span><span class="lbl">file</span> · <span class="v">payload.json</span></span>
                    <span
                        ><span class="lbl">root keys</span>
                        <span class="v">{currentRootKeys}</span></span
                    >
                    <span
                        ><span class="lbl">snippet slots</span>
                        <span class="v">{sampleSnippetCount}</span></span
                    >
                    <span><span class="lbl">theme</span> <span class="v">{mode.current}</span></span
                    >
                    <span class="live">● ARIA TREE</span>
                </div>
                <div class="stage json-stage">
                    <div class="hint">click disclosure controls</div>
                    <div class="json-card">
                        <div class="json-card-head">
                            <span>JsonView</span>
                            <code>data={currentLineCount} lines</code>
                        </div>
                        {#if jsonPreviewData}
                            <JsonView
                                data={jsonPreviewData}
                                style={viewerStyle}
                                clickToExpandNode
                            />
                        {:else if parseResult.error}
                            <div class="json-placeholder">{parseResult.error}</div>
                        {:else}
                            <pre class="json-placeholder">{JSON.stringify(
                                    parseResult.value,
                                    null,
                                    2
                                )}</pre>
                        {/if}
                    </div>
                </div>
                <div class="source-tray">
                    <label for="home-json-source">
                        <span class="lbl">source</span>
                        <span class="v">paste or edit JSON</span>
                    </label>
                    <textarea
                        id="home-json-source"
                        bind:value={editorText}
                        spellcheck="false"
                        aria-label="JSON source"></textarea>
                    <button type="button" onclick={resetJson}>↻ reset sample</button>
                </div>
                <div class="footer">
                    <div>component · <span class="v">JsonView</span></div>
                    <div>expansion · <span class="v">clickToExpandNode</span></div>
                    <div>
                        style · <span class="v">docs theme</span>
                    </div>
                    <div>
                        status · <span class="v accent">read-only tree viewer</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="brut-feat">
            <div class="lede">
                <div class="k">FIG-003 / CAPABILITIES</div>
                <h2>why <span>svelte-json-view-lite</span>.</h2>
                <p>The React viewer API you know, rendered through Svelte 5 primitives.</p>
            </div>
            <div class="grid">
                {#each features as f, i (f.title)}
                    <div class="cell">
                        <div class="id">№ {String(i + 1).padStart(2, '0')} / 06</div>
                        <div class="corner">▢</div>
                        <h3>{f.title}</h3>
                        <p>{f.body}</p>
                        <div class="marker"></div>
                    </div>
                {/each}
            </div>
        </section>

        <section class="brut-comp">
            <div class="k">FIG-005 / COMPARISON MATRIX</div>
            <h2>how we <span>compare</span>.</h2>
            <p class="lede-p">
                Direct Svelte-compatible choices come first. The upstream and React-only rows are
                migration and feature references, not native Svelte alternatives.
            </p>
            <div class="comp-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>library</th>
                            <th>relationship</th>
                            <th>framework</th>
                            <th>read-only</th>
                            <th>editing</th>
                            <th>snippets</th>
                            <th>theming</th>
                            <th>zero deps</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="us-row">
                            <td class="us">{PKG_NAME} <span aria-hidden="true">●</span></td>
                            <td class="us">this package</td>
                            <td class="us">Svelte 5</td>
                            <td class="y">yes</td>
                            <td class="n">no</td>
                            <td class="y">yes</td>
                            <td class="y">CSS vars</td>
                            <td class="y">yes</td>
                        </tr>
                        {#each compareRows as row (row.slug)}
                            {@const readOnly = formatCell(row.readOnly)}
                            {@const editing = formatCell(row.editing)}
                            {@const snippets = formatCell(row.snippets)}
                            {@const theming = formatCell(row.theming)}
                            {@const deps = formatCell(row.deps)}
                            <tr>
                                <td>
                                    <a href="/compare/{row.slug}" class="comp-link">{row.name}</a>
                                </td>
                                <td>{row.relationship}</td>
                                <td>{row.framework}</td>
                                <td class={readOnly.cls}>{readOnly.text}</td>
                                <td class={editing.cls}>{editing.text}</td>
                                <td class={snippets.cls}>{snippets.text}</td>
                                <td class={theming.cls}>{theming.text}</td>
                                <td class={deps.cls}>{deps.text}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
            <a class="comp-all" href="/compare">view all comparisons →</a>
        </section>

        <section class="brut-ai" id="ai-ready">
            <div class="lede">
                <div class="k">FIG-006 / AI-READY</div>
                <h2>built for <span>ai-assisted</span> code.</h2>
                <p>
                    Point Cursor, Claude Code, or any LLM at the manifests below and they know the
                    full Svelte JSON View Lite API — props, types, snippets, themes, accessibility
                    notes. Migration prompts from React JSON viewers have ground truth.
                </p>
            </div>
            <div class="ai-panel">
                <div class="ai-head">
                    <span class="ai-tab on">llms.txt</span>
                    <span class="ai-tab">llms-full.txt</span>
                    <span class="grow"></span>
                    <span class="ai-meta">/llmstxt.org</span>
                </div>
                <div class="ai-grid">
                    <a class="ai-cell" href="/llms.txt" target="_blank" rel="noopener">
                        <div class="ai-cell-k">01 · index</div>
                        <h3><code>/llms.txt</code></h3>
                        <p>
                            Compact map. Project blurb, feature list, prop catalogue, snippet slots,
                            doc URLs. Drop into any agent for ground-truth lookup.
                        </p>
                        <div class="ai-cell-foot">~4 kB · open ↗</div>
                    </a>
                    <a class="ai-cell" href="/llms-full.txt" target="_blank" rel="noopener">
                        <div class="ai-cell-k">02 · full</div>
                        <h3><code>/llms-full.txt</code></h3>
                        <p>
                            Full reference. Every prop, exported type, theme hook, snippet override,
                            and accessibility note — with code snippets. Optimised for LLM context
                            windows.
                        </p>
                        <div class="ai-cell-foot">~32 kB · open ↗</div>
                    </a>
                    <a class="ai-cell" href="/docs" target="_blank" rel="noopener">
                        <div class="ai-cell-k">03 · per-page mirrors</div>
                        <h3><code>/docs/&lt;slug&gt;.md</code></h3>
                        <p>
                            Every doc page mirrored as raw markdown. Append <code>.md</code> to any doc
                            URL to fetch the source the chatbot can quote verbatim.
                        </p>
                        <div class="ai-cell-foot">7 docs · open ↗</div>
                    </a>
                </div>
                <div class="ai-prompt">
                    <span class="ai-prompt-k">// example prompt</span>
                    <code
                        >Use https://jsonview.svelte.page/llms.txt as the source for Svelte JSON
                        View Lite APIs. Rewrite this React JSON viewer snippet for Svelte 5 using
                        <em>&lt;JsonView&gt;</em>, typed snippet overrides, and the same expansion
                        behavior.</code
                    >
                </div>
            </div>
        </section>

        <section class="brut-ex">
            <div class="lede">
                <div class="k">FIG-007 / EXAMPLES</div>
                <h2>explore <span>interactive examples</span>.</h2>
                <p>Playground, snippets, themes, click-to-expand behavior, and edge-case values.</p>
            </div>
            <div>
                <div class="grid">
                    {#each featuredExamples as ex, i (ex.slug)}
                        <a class="cell" href="/examples/{ex.slug}">
                            <div class="id">
                                № {String(i + 1).padStart(2, '0')} / {String(
                                    featuredExamples.length
                                ).padStart(2, '0')}
                            </div>
                            <div class="corner">↗</div>
                            <h3>{ex.title}</h3>
                            <p>{ex.body}</p>
                            <div class="marker"></div>
                        </a>
                    {/each}
                </div>
                <a class="ex-all" href="/examples">view all examples →</a>
            </div>
        </section>

        <section class="brut-foot">
            <div class="info">
                <div>SET / JETBRAINS MONO + INTER</div>
                <div>HUMANSPEAK · 2026</div>
                <div>MIT LICENCE</div>
                <div class="v">● {PKG_VERSION}</div>
            </div>
            <MotionButton
                class="big"
                type="button"
                onclick={copyInstall}
                aria-label="Copy install command"
                whileTap={{ scale: 0.985 }}
                whileHover={{ scale: 1.005 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
                npm&nbsp;i&nbsp;<span>@humanspeak/</span><br />svelte-json-view-lite
                <span class="copy-hint">
                    <AnimatePresence initial={false}>
                        <MotionSpan
                            key={copied ? 'copied' : 'idle'}
                            class="copy-hint-label"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                        >
                            {copied ? '✓ copied to clipboard' : 'click to copy'}
                        </MotionSpan>
                    </AnimatePresence>
                </span>
            </MotionButton>
            <div class="info right">
                <div>SHEET 07 / 07</div>
                <div>END OF DOCUMENT</div>
                <a class="v" href="#top">↩ TO TOP</a>
            </div>
        </section>
    </main>

    <FooterV2 version={PKG_VERSION} />
</div>

<style>
    .brut-coord {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        border-bottom: 1px solid var(--brut-rule);
        font-size: 10px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-coord div {
        padding: 6px 8px;
        border-right: 1px solid var(--brut-rule);
    }
    .brut-hero {
        position: relative;
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 24px;
        padding: 80px 24px 32px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin: 0;
        color: var(--brut-ink-3);
        font-size: 11px;
    }
    .meta .v,
    .sub b {
        color: var(--brut-ink);
    }
    .meta .accent,
    h1 .slash,
    .brut h2 span {
        color: var(--brut-accent);
    }
    .meta hr {
        width: 100%;
        border: 0;
        border-top: 1px dashed var(--brut-rule);
    }
    h1 {
        margin: 0;
        font-family: 'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace;
        font-size: clamp(56px, 11vw, 152px);
        font-weight: 500;
        line-height: 0.88;
        letter-spacing: -0.06em;
        text-transform: lowercase;
    }
    h1 .end {
        color: var(--brut-ink-3);
    }
    .sub {
        max-width: 760px;
        margin: 28px 0 0;
        color: var(--brut-ink-2);
        font-size: 17px;
        line-height: 1.5;
    }
    .brut-hero .cta-row {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        width: fit-content;
        max-width: 100%;
        margin-top: 28px;
    }
    .brut-hero .cta-row > * {
        padding: 10px 14px;
        border: 1px solid var(--brut-rule);
        background: var(--brut-bg);
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--brut-ink);
        cursor: pointer;
        font-family: inherit;
        text-decoration: none;
        position: relative;
        z-index: 1;
        transition:
            background 0.15s,
            border-color 0.15s;
    }
    .brut-hero .cta-row > * + * {
        margin-left: -1px;
    }
    .brut-hero .cta-row > *:hover {
        z-index: 2;
    }
    .brut-hero .cta-row .pri {
        background: var(--brut-accent);
        color: var(--brut-accent-ink);
        font-weight: 600;
        border-color: var(--brut-accent);
    }
    .brut-hero .cta-row .pri:hover {
        background: var(--brut-accent-hover);
        border-color: var(--brut-accent-hover);
    }
    .brut-hero .cta-row a:not(.pri):hover,
    .brut-hero .cta-row :global(.inst:hover) {
        background: var(--brut-bg-2);
        border-color: var(--brut-rule-2);
    }
    .brut-hero .cta-row :global(.inst) {
        padding: 10px 18px;
        border: 1px solid var(--brut-rule);
        background: var(--brut-bg-2);
        color: var(--brut-ink-2);
        font-family: inherit;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        position: relative;
        z-index: 1;
        margin-left: -1px;
        transition:
            background 0.15s,
            border-color 0.15s;
    }
    .brut-hero .cta-row :global(.inst:hover) {
        z-index: 2;
    }
    .brut-hero .cta-row :global(.inst .inst-prompt) {
        color: var(--brut-ink-3);
    }
    .brut-hero .cta-row :global(.inst .inst-cmd) {
        color: var(--brut-ink-2);
    }
    .brut-hero .cta-row :global(.inst .inst-cmd .pkg) {
        color: var(--brut-ink);
    }
    .brut-hero .cta-row :global(.inst .inst-copy) {
        margin-left: 4px;
        padding: 2px 8px;
        font-size: 10.5px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--brut-accent);
        border: 1px solid var(--brut-rule);
        display: inline-grid;
        align-items: center;
        justify-items: center;
        min-width: 84px;
        height: 20px;
        overflow: hidden;
        transition:
            border-color 0.2s,
            background 0.2s;
    }
    .brut-hero .cta-row :global(.inst .inst-copy.is-copied) {
        border-color: var(--brut-accent);
        background: var(--brut-accent-soft);
    }
    .brut-hero .cta-row :global(.inst .inst-copy-label) {
        grid-area: 1 / 1;
        display: inline-block;
        white-space: nowrap;
        will-change: transform, opacity;
    }
    .corner {
        position: absolute;
        color: var(--brut-ink-3);
        font-size: 10px;
        letter-spacing: 0.14em;
    }
    .corner.tr {
        top: 12px;
        right: 24px;
    }
    .corner.bl {
        bottom: 12px;
        left: 24px;
    }
    .corner.br {
        right: 24px;
        bottom: 12px;
    }
    .brut-stats {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-stats .s {
        min-height: 160px;
        padding: 28px 24px;
        border-right: 1px solid var(--brut-rule);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .brut-stats .s:last-child {
        border-right: 0;
    }
    .brut-stats .s::after {
        content: attr(data-idx);
        position: absolute;
        top: 12px;
        right: 14px;
        font-size: 10px;
        color: var(--brut-ink-3);
    }
    .brut-ex .grid,
    .ai-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border-bottom: 1px solid var(--brut-rule);
    }
    .cell,
    .ai-cell {
        min-height: 160px;
        padding: 28px 24px;
        border-right: 1px solid var(--brut-rule);
        border-bottom: 1px solid var(--brut-rule);
        color: var(--brut-ink-2);
        text-decoration: none;
    }
    .s .k,
    .id,
    .lede .k,
    .brut-comp .k,
    .ai-cell-k,
    .ai-prompt-k,
    .info {
        color: var(--brut-ink-3);
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .v-num {
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: clamp(36px, 5vw, 72px);
        line-height: 1;
    }
    .v-unit {
        margin-left: 4px;
        color: var(--brut-ink-3);
    }
    .note {
        margin-top: 20px;
    }
    .brut-demo,
    .brut-feat {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 24px;
        padding: 28px 24px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-demo .lede,
    .brut-feat .lede,
    .brut-ai .lede,
    .brut-ex .lede {
        padding: 0;
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-ex .lede {
        padding: 56px 24px 24px;
    }
    .brut-demo .lede h2,
    .brut-feat .lede h2,
    .brut-ai .lede h2 {
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 28px;
        color: var(--brut-ink);
        margin: 12px 0 0;
        letter-spacing: -0.02em;
        text-transform: lowercase;
        font-weight: 500;
    }
    .brut-ex .lede h2 {
        max-width: 900px;
        margin: 10px 0;
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: clamp(34px, 7vw, 92px);
        font-weight: 500;
        line-height: 0.95;
        letter-spacing: 0;
        text-transform: lowercase;
    }
    .brut-demo .lede p,
    .brut-feat .lede p,
    .brut-ai .lede p {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        color: var(--brut-ink-2);
        margin: 12px 0 0;
        font-size: 13px;
        line-height: 1.55;
        letter-spacing: 0;
    }
    .brut-ex .lede p,
    .lede-p {
        max-width: 680px;
        color: var(--brut-ink-2);
        font-size: 16px;
        line-height: 1.55;
    }
    .brut-demo .panel,
    .ai-panel {
        border: 1px solid var(--brut-rule);
        background: var(--brut-bg);
    }
    .ai-panel {
        margin: 0 24px 56px;
    }
    .brut-demo .panel .bar {
        display: flex;
        flex-wrap: wrap;
        gap: 18px;
        align-items: center;
        padding: 8px 14px;
        border-bottom: 1px solid var(--brut-rule);
        background: var(--brut-bg-2);
        color: var(--brut-ink-2);
        font-size: 11px;
    }
    .brut-demo .panel .bar .lbl {
        color: var(--brut-ink-3);
    }
    .brut-demo .panel .bar .v {
        color: var(--brut-ink);
    }
    .brut-demo .panel .bar .live {
        margin-left: auto;
        color: var(--brut-accent);
    }
    .brut-demo .panel .stage {
        position: relative;
        height: 420px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-image:
            linear-gradient(var(--brut-rule) 1px, transparent 1px),
            linear-gradient(90deg, var(--brut-rule) 1px, transparent 1px);
        background-size: 32px 32px;
        background-position: center center;
    }
    .brut-demo .panel .stage .hint {
        position: absolute;
        bottom: 12px;
        left: 14px;
        color: var(--brut-ink-3);
        font-size: 10.5px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .json-card {
        display: flex;
        flex-direction: column;
        width: min(620px, calc(100% - 72px));
        height: 328px;
        border: 1px solid var(--brut-rule);
        background: var(--brut-bg);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        overflow: hidden;
    }
    :global(html.dark) .json-card {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .json-card-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 12px;
        border-bottom: 1px solid var(--brut-rule);
        background: var(--brut-bg-2);
        color: var(--brut-ink-2);
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }
    .json-card :global(.sjv-container-light),
    .json-card :global(.sjv-container-dark) {
        flex: 1;
        min-height: 0;
        padding: 18px;
        overflow: auto;
    }
    .json-placeholder {
        min-height: 220px;
        margin: 0;
        padding: 18px;
        color: var(--brut-ink-2);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 13px;
        line-height: 1.5;
        white-space: pre-wrap;
    }
    .source-tray {
        display: grid;
        grid-template-columns: 180px minmax(0, 1fr) auto;
        gap: 0;
        border-top: 1px solid var(--brut-rule);
        background: var(--brut-bg);
    }
    .source-tray label,
    .source-tray button {
        padding: 10px 14px;
        border-right: 1px solid var(--brut-rule);
        color: var(--brut-ink-2);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 11px;
    }
    .source-tray label {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .source-tray .lbl {
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .source-tray .v {
        color: var(--brut-ink);
    }
    .source-tray textarea {
        width: 100%;
        min-height: 132px;
        max-height: 220px;
        resize: vertical;
        border: 0;
        border-right: 1px solid var(--brut-rule);
        outline: 0;
        padding: 10px 12px;
        background: var(--brut-bg-2);
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 12px;
        line-height: 1.45;
    }
    .source-tray button {
        background: var(--brut-bg);
        cursor: pointer;
    }
    .source-tray button:hover {
        background: var(--brut-bg-2);
        color: var(--brut-ink);
    }
    .brut-demo .panel .footer {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--brut-rule);
        color: var(--brut-ink-2);
        font-size: 11px;
    }
    .brut-demo .panel .footer > div {
        padding: 8px 14px;
        border-right: 1px solid var(--brut-rule);
    }
    .brut-demo .panel .footer > div:last-child {
        border-right: 0;
    }
    .brut-demo .panel .footer .v {
        color: var(--brut-ink);
    }
    .brut-demo .panel .footer .accent {
        color: var(--brut-accent);
    }
    .brut-feat {
        padding: 28px 24px;
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 24px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-feat .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0;
        border-left: 1px solid var(--brut-rule);
        border-top: 1px solid var(--brut-rule);
    }
    .brut-feat .cell {
        border-right: 1px solid var(--brut-rule);
        border-bottom: 1px solid var(--brut-rule);
        padding: 20px 22px;
        min-height: 200px;
        position: relative;
        color: var(--brut-ink);
        text-decoration: none;
    }
    .brut-feat .cell::after {
        content: '';
        position: absolute;
        inset: 8px;
        border: 1px solid transparent;
        pointer-events: none;
        transition: border-color 0.2s;
    }
    .brut-feat .cell:hover::after {
        border-color: var(--brut-accent);
    }
    .brut-feat .cell .id {
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-feat .cell h3 {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        font-size: 22px;
        font-weight: 500;
        letter-spacing: -0.02em;
        margin: 30px 0 8px;
        color: var(--brut-ink);
        text-transform: none;
    }
    .brut-feat .cell p {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        font-size: 13.5px;
        color: var(--brut-ink-2);
        line-height: 1.55;
        margin: 0;
        max-width: 320px;
    }
    .brut-feat .cell .corner {
        position: absolute;
        top: 14px;
        right: 16px;
        font-size: 10.5px;
        color: var(--brut-ink-3);
    }
    .brut-feat .cell .marker {
        width: 14px;
        height: 14px;
        border: 1px solid var(--brut-ink-3);
        position: absolute;
        bottom: 16px;
        right: 16px;
    }
    .brut-feat .cell:nth-child(3n + 1) .marker {
        background: var(--brut-accent);
        border-color: var(--brut-accent);
    }
    .head,
    .ai-head {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 10px 12px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .grow {
        flex: 1;
    }
    .tab,
    .ai-tab,
    .ctrl {
        border: 1px solid var(--brut-rule);
        padding: 5px 9px;
        background: var(--brut-bg-2);
        color: var(--brut-ink-2);
        font: inherit;
        font-size: 12px;
    }
    .tab.on,
    .ai-tab.on {
        color: var(--brut-accent);
    }
    .cell h3 {
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 24px;
        letter-spacing: -0.03em;
        text-transform: lowercase;
    }
    .brut-comp {
        padding: 28px 24px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-comp h2 {
        margin: 12px 0 24px;
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 28px;
        font-weight: 500;
        letter-spacing: -0.02em;
        line-height: 1.12;
        text-transform: lowercase;
    }
    .brut-comp h2 span {
        color: var(--brut-accent);
    }
    .brut-comp .lede-p {
        max-width: 760px;
        margin-bottom: 28px;
        font-size: 14px;
        line-height: 1.6;
    }
    .comp-scroll {
        overflow-x: auto;
    }
    .brut-comp table {
        width: 100%;
        min-width: 1080px;
        border-collapse: collapse;
        font-size: 13px;
        font-family: 'JetBrains Mono Variable', monospace;
    }
    .brut-comp th,
    .brut-comp td {
        border-bottom: 1px solid var(--brut-rule);
        padding: 13px 14px;
        text-align: left;
        color: var(--brut-ink);
    }
    .brut-comp th {
        color: var(--brut-ink-3);
        font-size: 10.5px;
        font-weight: 400;
        letter-spacing: 0.14em;
        text-transform: lowercase;
    }
    .brut-comp tr.us-row {
        background: var(--brut-accent-soft);
    }
    .brut-comp tr:not(.us-row):hover {
        background: var(--brut-bg-2);
    }
    .brut-comp .us,
    .brut-comp .y {
        color: var(--brut-accent);
    }
    .brut-comp .n {
        color: var(--brut-ink-3);
    }
    .brut-comp .comp-link {
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid var(--brut-rule-2);
        transition:
            color 0.15s,
            border-color 0.15s;
    }
    .brut-comp .comp-link:hover {
        color: var(--brut-accent);
        border-bottom-color: var(--brut-accent);
    }
    .comp-all,
    .ex-all {
        display: inline-block;
        margin-top: 16px;
        color: var(--brut-accent);
    }
    .brut-ai {
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 24px;
        padding: 28px 24px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-ai .ai-panel {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--brut-rule);
        background: var(--brut-bg);
    }
    .brut-ai .ai-head {
        display: flex;
        align-items: center;
        gap: 0;
        padding: 0;
        border-bottom: 1px solid var(--brut-rule);
        background: var(--brut-bg-2);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 11px;
        letter-spacing: 0.14em;
        color: var(--brut-ink-3);
        text-transform: uppercase;
    }
    .brut-ai .ai-tab {
        padding: 9px 14px;
        border: 0;
        border-right: 1px solid var(--brut-rule);
        background: transparent;
        color: var(--brut-ink-3);
        font-size: 11px;
    }
    .brut-ai .ai-tab.on {
        background: var(--brut-bg);
        color: var(--brut-ink);
    }
    .brut-ai .ai-meta {
        padding: 9px 14px;
        border-left: 1px solid var(--brut-rule);
    }
    .brut-ai .ai-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    .brut-ai .ai-cell {
        position: relative;
        min-height: 200px;
        padding: 20px 22px 56px;
        border-right: 1px solid var(--brut-rule);
        color: var(--brut-ink);
        text-decoration: none;
        transition: background-color 0.15s;
    }
    .brut-ai .ai-cell:last-child {
        border-right: 0;
    }
    .brut-ai .ai-cell:hover {
        background: color-mix(in oklab, var(--brut-accent) 6%, transparent);
    }
    .brut-ai .ai-cell-k {
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .brut-ai .ai-cell h3 {
        font-family: 'Inter Variable', system-ui, sans-serif;
        font-size: 22px;
        font-weight: 500;
        letter-spacing: -0.02em;
        margin: 22px 0 10px;
        color: var(--brut-ink);
    }
    .brut-ai .ai-cell h3 code {
        font-family: 'JetBrains Mono Variable', monospace;
        background: transparent;
        padding: 0;
        font-size: 0.85em;
        color: var(--brut-accent);
    }
    .brut-ai .ai-cell p {
        margin: 0;
        color: var(--brut-ink-2);
        font-size: 13.5px;
        line-height: 1.55;
    }
    .brut-ai .ai-cell p code {
        font-family: 'JetBrains Mono Variable', monospace;
        background: var(--brut-bg-2);
        padding: 1px 4px;
        border-radius: 2px;
        font-size: 0.92em;
    }
    .brut-ai .ai-cell-foot {
        position: absolute;
        left: 22px;
        bottom: 18px;
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 11px;
        color: var(--brut-ink-3);
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }
    .brut-ai .ai-prompt {
        margin: 0;
        padding: 16px 22px;
        border: 0;
        border-top: 1px solid var(--brut-rule);
        background: var(--brut-bg-2);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 13px;
        line-height: 1.6;
        color: var(--brut-ink-2);
    }
    .brut-ai .ai-prompt-k {
        display: block;
        margin-bottom: 6px;
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
        text-transform: uppercase;
    }
    .brut-ai .ai-prompt code {
        background: transparent;
        padding: 0;
        color: var(--brut-ink);
    }
    .brut-ai .ai-prompt em {
        color: var(--brut-accent);
        font-style: normal;
    }
    .brut-ex {
        padding: 28px 24px;
        display: grid;
        grid-template-columns: 220px 1fr;
        gap: 24px;
        border-bottom: 1px solid var(--brut-rule);
    }
    .brut-ex .lede {
        padding: 0;
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-ex .lede .k {
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-ex .lede h2 {
        font-family: 'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace;
        font-size: 28px;
        color: var(--brut-ink);
        margin: 12px 0 0;
        letter-spacing: -0.02em;
        text-transform: lowercase;
        font-weight: 500;
        line-height: normal;
        max-width: none;
    }
    .brut-ex .lede h2 span {
        color: var(--brut-accent);
    }
    .brut-ex .lede p {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        color: var(--brut-ink-2);
        margin: 12px 0 0;
        font-size: 13px;
        line-height: 1.55;
        max-width: 640px;
        letter-spacing: 0;
    }
    .brut-ex .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        border-left: 1px solid var(--brut-rule);
        border-top: 1px solid var(--brut-rule);
        border-bottom: 0;
    }
    .brut-ex .cell {
        display: block;
        border-right: 1px solid var(--brut-rule);
        border-bottom: 1px solid var(--brut-rule);
        padding: 20px 22px;
        min-height: 200px;
        position: relative;
        color: var(--brut-ink);
        text-decoration: none;
    }
    .brut-ex .cell::after {
        content: '';
        position: absolute;
        inset: 8px;
        border: 1px solid transparent;
        pointer-events: none;
        transition: border-color 0.2s;
    }
    .brut-ex .cell:hover::after {
        border-color: var(--brut-accent);
    }
    .brut-ex .cell .id {
        font-size: 10.5px;
        color: var(--brut-ink-3);
        letter-spacing: 0.14em;
    }
    .brut-ex .cell h3 {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        font-size: 22px;
        font-weight: 500;
        letter-spacing: -0.02em;
        margin: 30px 0 8px;
        color: var(--brut-ink);
        text-transform: none;
    }
    .brut-ex .cell p {
        font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
        font-size: 13.5px;
        color: var(--brut-ink-2);
        line-height: 1.55;
        margin: 0;
        max-width: 320px;
    }
    .brut-ex .cell .corner {
        position: absolute;
        top: 14px;
        right: 16px;
        font-size: 14px;
        color: var(--brut-ink-3);
        transition: color 0.2s;
    }
    .brut-ex .cell:hover .corner {
        color: var(--brut-accent);
    }
    .brut-ex .cell .marker {
        width: 14px;
        height: 14px;
        border: 1px solid var(--brut-ink-3);
        position: absolute;
        bottom: 16px;
        right: 16px;
    }
    .brut-ex .cell:nth-child(3n + 1) .marker {
        background: var(--brut-accent);
        border-color: var(--brut-accent);
    }
    .brut-ex .ex-all {
        display: inline-block;
        margin-top: 18px;
        color: var(--brut-accent);
        text-decoration: none;
        font-size: 12px;
        letter-spacing: 0.08em;
    }
    .brut-ex .ex-all:hover {
        text-decoration: underline;
    }
    .brut-foot {
        padding: 60px 24px 36px;
        display: grid;
        grid-template-columns: 200px 1fr 200px;
        gap: 24px;
        border-top: 1px solid var(--brut-rule);
        align-items: end;
    }
    .brut-foot :global(.big) {
        font-family: 'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace;
        font-size: clamp(40px, 7vw, 96px);
        line-height: 0.9;
        letter-spacing: -0.06em;
        text-transform: lowercase;
        background: transparent;
        border: 0;
        color: var(--brut-ink);
        text-align: left;
        cursor: pointer;
        padding: 0;
        position: relative;
    }
    .brut-foot :global(.big span) {
        color: var(--brut-accent);
    }
    .brut-foot :global(.big .copy-hint) {
        display: inline-grid;
        align-items: center;
        justify-items: start;
        margin-top: 16px;
        height: 16px;
        font-size: 11px;
        letter-spacing: 0.14em;
        color: var(--brut-ink-3);
        text-transform: uppercase;
        overflow: hidden;
        min-width: 200px;
    }
    .brut-foot :global(.big .copy-hint-label) {
        grid-area: 1 / 1;
        display: inline-block;
        white-space: nowrap;
        will-change: transform, opacity;
    }
    .brut-foot :global(.big:hover .copy-hint) {
        color: var(--brut-accent);
    }
    .brut-foot .info {
        font-size: 11px;
        color: var(--brut-ink-3);
        letter-spacing: 0.12em;
        line-height: 1.8;
    }
    .brut-foot .info.right {
        text-align: right;
    }
    .brut-foot .info .v,
    .brut-foot .info a.v {
        color: var(--brut-ink);
        text-decoration: none;
        display: block;
        margin-top: 12px;
    }
    .brut-foot .info a.v:hover {
        color: var(--brut-accent);
    }
    @media (max-width: 900px) {
        .brut-hero,
        .body,
        .brut-foot {
            grid-template-columns: 1fr;
        }
        .brut-stats,
        .brut-feat .grid,
        .brut-ex .grid,
        .ai-grid {
            grid-template-columns: 1fr;
        }
        .meta {
            order: 2;
        }
    }
</style>
