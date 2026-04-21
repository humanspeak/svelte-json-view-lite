<script lang="ts">
    import { Footer, Header, getBreadcrumbContext } from '@humanspeak/docs-kit'
    import { defaultStyles, JsonView } from '@humanspeak/svelte-json-view-lite'
    import favicon from '$lib/assets/logo.svg'
    import { docsConfig } from '$lib/docs-config'
    import {
        Accessibility,
        ArrowRight,
        BookOpen,
        Braces,
        Code,
        FlaskConical,
        Paintbrush,
        Play,
        Puzzle,
        Rocket,
        ServerCog,
        Sparkles
    } from '@lucide/svelte'

    const breadcrumbContext = getBreadcrumbContext()
    if (breadcrumbContext) {
        breadcrumbContext.breadcrumbs = []
    }

    type FeatureIcon = typeof Sparkles
    const features: { title: string; description: string; icon: FeatureIcon }[] = [
        {
            title: 'Svelte 5 Runes',
            description:
                '$props, $state, $derived, $effect throughout — no Svelte 4 shims, no legacy reactivity syntax.',
            icon: Sparkles
        },
        {
            title: 'Familiar API',
            description:
                'Same prop names, themes, and strategy helpers as react-json-view-lite — proven ergonomics, idiomatic Svelte 5.',
            icon: ArrowRight
        },
        {
            title: 'Snippet Overrides',
            description:
                'Per-type Svelte snippets for string, number, date, boolean, and every other primitive.',
            icon: Puzzle
        },
        {
            title: 'CSS-Variable Theming',
            description:
                'Every color exposed as a --sjv-* custom property. Retheme without swapping the style prop.',
            icon: Paintbrush
        },
        {
            title: 'SSR Safe',
            description:
                '$props.id() keeps aria-controls stable across server render and client hydration.',
            icon: ServerCog
        },
        {
            title: 'WAI-ARIA Treeview',
            description:
                'role="tree" with roving tabindex, arrow-key navigation, and collapse/expand labels.',
            icon: Accessibility
        }
    ]

    const defaultPayload = `{
    "user": {
        "id": 42,
        "name": "Ada Lovelace",
        "tags": ["admin", "beta"],
        "joined": "2024-01-15T09:00:00.000Z"
    },
    "totals": {
        "requests": 1523,
        "errors": 0,
        "latencyMs": 12.4
    },
    "active": true,
    "nextReview": null
}`

    let editorText = $state(defaultPayload)

    type ParseResult = { value: unknown; error: string | null }
    const parseResult = $derived.by<ParseResult>(() => {
        try {
            return { value: JSON.parse(editorText), error: null }
        } catch (err) {
            return { value: null, error: err instanceof Error ? err.message : String(err) }
        }
    })
    const parsed = $derived(parseResult.value)
    const parseError = $derived(parseResult.error)
</script>

<div class="flex min-h-svh flex-col">
    <Header config={docsConfig} {favicon} />

    <div class="relative flex flex-1 flex-col overflow-hidden">
        <!-- Decorative layers -->
        <div class="bg-grid pointer-events-none absolute inset-0 -z-20"></div>
        <div class="bg-glow pointer-events-none absolute inset-0 -z-10"></div>
        <div
            class="orb-a-bg pointer-events-none absolute bottom-[-80px] left-[-80px] h-[320px] w-[320px] rounded-full opacity-50 blur-[30px]"
        ></div>
        <div
            class="orb-b-bg pointer-events-none absolute top-[20%] right-[-60px] h-[260px] w-[260px] rounded-full opacity-50 blur-[30px]"
        ></div>

        <!-- Hero -->
        <section class="relative">
            <div class="mx-auto w-full max-w-7xl px-6 py-12 md:py-20">
                <div class="mx-auto max-w-4xl text-center">
                    <h1
                        class="text-foreground text-5xl leading-tight font-semibold text-balance md:text-7xl"
                    >
                        <span class="block">Svelte</span>
                        <span class="text-brand-500 block">JSON View Lite</span>
                    </h1>
                    <p
                        class="text-muted-foreground mt-6 text-base leading-7 text-pretty md:text-lg"
                    >
                        Fast, tiny JSON tree viewer for Svelte 5. <br />A port of
                        <code class="text-foreground">react-json-view-lite</code> with runes, SSR, snippet
                        overrides, CSS-variable theming, and zero runtime dependencies.
                    </p>

                    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="/docs/getting-started"
                            class="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-600/30 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow transition-colors focus:outline-none focus-visible:ring-2"
                        >
                            Get Started
                            <Rocket class="ml-2 size-3" />
                        </a>
                        <a
                            href="/docs/api/json-view"
                            class="border-border bg-card text-foreground hover:border-brand-500/50 hover:text-brand-700 focus-visible:ring-brand-600/20 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                        >
                            API Reference
                            <BookOpen class="ml-2 size-3" />
                        </a>
                        <a
                            href="https://www.npmjs.com/package/@humanspeak/svelte-json-view-lite"
                            target="_blank"
                            rel="noopener"
                            class="border-border bg-card text-foreground hover:border-brand-500/50 hover:text-brand-700 focus-visible:ring-brand-600/20 inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2"
                        >
                            View on npm
                            <ArrowRight class="ml-2 size-3" />
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Playground -->
        <section class="relative px-6 py-10">
            <div class="container mx-auto max-w-7xl">
                <div class="mb-6 text-center">
                    <h2 class="text-foreground text-2xl font-bold md:text-3xl">Live playground</h2>
                    <p class="text-muted-foreground mt-2 text-sm">
                        Edit the JSON on the left; the tree on the right updates as you type.
                    </p>
                </div>

                <div class="border-border bg-card overflow-hidden rounded-xl border">
                    <div class="border-border flex items-center justify-between border-b px-4 py-2">
                        <div class="flex items-center gap-3 text-xs">
                            <span class="text-muted-foreground inline-flex items-center gap-1.5">
                                <Code class="size-3" /> JSON source
                            </span>
                            <span class="text-muted-foreground inline-flex items-center gap-1.5">
                                <Braces class="size-3" /> Rendered tree
                            </span>
                        </div>
                        <a
                            href="/examples/playground"
                            class="text-brand-600 hover:text-brand-700 inline-flex items-center text-xs font-medium transition-colors"
                        >
                            Full playground
                            <ArrowRight class="ml-1 size-3" />
                        </a>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2">
                        <div class="border-border bg-card lg:border-r">
                            <textarea
                                bind:value={editorText}
                                class="bg-card text-foreground h-[360px] w-full resize-none p-4 font-mono text-sm leading-relaxed focus:outline-none"
                                spellcheck="false"
                            ></textarea>
                            {#if parseError}
                                <div
                                    class="border-border bg-destructive/5 text-destructive border-t px-4 py-2 text-xs"
                                >
                                    {parseError}
                                </div>
                            {/if}
                        </div>
                        <div class="playground-tree bg-background h-[360px] overflow-auto p-4">
                            {#if parsed && typeof parsed === 'object'}
                                <JsonView data={parsed} style={defaultStyles} clickToExpandNode />
                            {:else if parsed !== null}
                                <pre class="text-muted-foreground text-sm">{JSON.stringify(
                                        parsed,
                                        null,
                                        2
                                    )}</pre>
                            {:else}
                                <p class="text-muted-foreground text-sm">
                                    Fix the JSON parse error to preview.
                                </p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature grid -->
        <section class="relative px-6 py-10">
            <div class="container mx-auto max-w-7xl">
                <div class="mb-8 text-center">
                    <h2 class="text-foreground text-2xl font-bold md:text-3xl">Why this port?</h2>
                    <p class="text-muted-foreground mx-auto mt-2 max-w-2xl text-sm">
                        The React API you already know, with Svelte 5 runes under the hood and
                        enough new surface to make the port worth the swap.
                    </p>
                </div>

                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {#each features as feature (feature.title)}
                        <div
                            class="group border-border bg-card hover:border-brand-500/50 hover:shadow-brand-500/10 relative overflow-hidden rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div
                                class="from-brand-500 to-brand-600 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br text-white"
                            >
                                <feature.icon class="size-5" />
                            </div>
                            <h3 class="text-foreground mb-1 font-semibold">{feature.title}</h3>
                            <p class="text-muted-foreground text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Examples CTA -->
        <section class="relative px-6 py-10">
            <div class="container mx-auto max-w-7xl">
                <div
                    class="border-brand-500/20 from-brand-500/10 to-brand-600/10 relative overflow-hidden rounded-2xl border bg-gradient-to-r p-8 text-center md:p-12"
                >
                    <div
                        class="from-brand-500 to-brand-600 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white"
                    >
                        <FlaskConical class="size-5" />
                    </div>
                    <h2 class="text-foreground mb-3 text-2xl font-bold md:text-3xl">
                        See every knob in action
                    </h2>
                    <p class="text-muted-foreground mx-auto mb-6 max-w-xl text-sm md:text-base">
                        Snippet overrides, CSS-variable themers, click-to-expand, edge cases, and
                        the full live playground — all with live code.
                    </p>
                    <a
                        href="/examples"
                        class="from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 inline-flex items-center rounded-lg bg-gradient-to-r px-5 py-2.5 font-medium text-white transition-all duration-200"
                    >
                        Browse Examples
                        <Play class="ml-2 size-4" />
                    </a>
                </div>
            </div>
        </section>
    </div>

    <Footer />
</div>

<style>
    /*
     * Theme the live JsonView with docs-kit tokens so the playground tracks
     * light/dark mode. The library's container declares --sjv-* defaults on
     * itself (specificity 0,1,0); the descendant combinator below is (0,2,0),
     * so these win without !important.
     */
    .playground-tree :global([role='tree']) {
        --sjv-background: transparent;
        --sjv-label: var(--color-foreground);
        --sjv-punctuation: var(--color-muted-foreground);
        --sjv-null: #ef4444;
        --sjv-undefined: #ef4444;
        --sjv-string: #f59e0b;
        --sjv-number: var(--color-brand-500);
        --sjv-boolean: #22c55e;
        --sjv-other: var(--color-muted-foreground);
        --sjv-expander: var(--color-muted-foreground);
    }

    /* Hero decorative layers (mirror svelte-markdown's pattern). */
    .bg-grid {
        background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
        background-size: 24px 24px;
        background-position: 50% 0;
        mask-image: radial-gradient(ellipse at center, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 0) 70%);
    }
    .bg-glow {
        background:
            radial-gradient(60% 50% at 50% 0%, rgba(84, 219, 188, 0.18), transparent 60%),
            radial-gradient(40% 40% at 90% 20%, rgba(84, 219, 188, 0.12), transparent 60%),
            radial-gradient(40% 40% at 10% 15%, rgba(84, 219, 188, 0.12), transparent 60%);
        filter: blur(0.2px);
    }
    .orb-a-bg {
        background: radial-gradient(
            circle at 30% 30%,
            color-mix(in oklab, var(--color-brand-500) 30%, transparent),
            color-mix(in oklab, var(--color-brand-500) 8%, transparent)
        );
        animation: orbA 28s ease-in-out infinite;
    }
    .orb-b-bg {
        background: radial-gradient(
            circle at 70% 50%,
            color-mix(in oklab, var(--color-brand-500) 30%, transparent),
            color-mix(in oklab, var(--color-brand-500) 8%, transparent)
        );
        animation: orbB 24s ease-in-out infinite;
        animation-delay: 3s;
    }

    @keyframes orbA {
        0%,
        100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(8vw, -10vh);
        }
        50% {
            transform: translate(-4vw, 6vh);
        }
        75% {
            transform: translate(2vw, -4vh);
        }
    }

    @keyframes orbB {
        0%,
        100% {
            transform: translate(0, 0);
        }
        25% {
            transform: translate(-6vw, -8vh);
        }
        50% {
            transform: translate(3vw, 4vh);
        }
        75% {
            transform: translate(-2vw, -6vh);
        }
    }
</style>
