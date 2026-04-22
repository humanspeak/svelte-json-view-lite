<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import {
        ArrowRight,
        FlaskConical,
        MousePointerClick,
        Paintbrush,
        Puzzle,
        SquarePen
    } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Interactive Examples | Svelte JSON View Lite'
        seo.description =
            'Live playgrounds for @humanspeak/svelte-json-view-lite — editor, snippet overrides, CSS-variable theming, click-to-expand, and edge cases.'
        seo.ogTitle = 'Interactive Examples'
        seo.ogTagline = 'Five live playgrounds for the tree viewer.'
        seo.ogFeatures = ['Live Editor', 'Snippet Overrides', 'CSS Variables', 'Edge Cases']
        seo.ogSlug = 'examples'
    }

    type ExampleIcon = typeof SquarePen
    const examples: {
        slug: string
        title: string
        description: string
        icon: ExampleIcon
    }[] = [
        {
            slug: 'playground',
            title: 'Live Playground',
            description:
                'Edit JSON (or JS expressions) and see the tree render instantly. Switch expand strategies and toggle click-to-expand.',
            icon: SquarePen
        },
        {
            slug: 'snippet-overrides',
            title: 'Snippet Overrides',
            description:
                'Flip switches to linkify URLs, relative-format dates, badge booleans, and localize numbers — all via typed Snippet props.',
            icon: Puzzle
        },
        {
            slug: 'css-variables',
            title: 'CSS Variable Themer',
            description:
                'Color-pick every --sjv-* token or jump to a named preset. Theming without swapping the style prop.',
            icon: Paintbrush
        },
        {
            slug: 'click-to-expand',
            title: 'Click to Expand',
            description:
                'Toggle label clicks and watch beforeExpandChange veto decisions stream into a live event log.',
            icon: MousePointerClick
        },
        {
            slug: 'edge-cases',
            title: 'Edge Cases',
            description:
                'Every supported value type in one payload — dates, bigints, functions, nulls, empty containers, long strings.',
            icon: FlaskConical
        }
    ]
</script>

<div class="mx-auto w-full max-w-6xl px-6 py-12">
    <div class="mb-10 text-center">
        <h1 class="text-foreground text-4xl font-bold md:text-5xl">Interactive Examples</h1>
        <p class="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm md:text-base">
            Live playgrounds for every feature the viewer ships. All demos run client-side — no
            network round trips, no build step.
        </p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each examples as example (example.slug)}
            <a
                href={`/examples/${example.slug}`}
                class="group border-border bg-card hover:border-brand-500/50 hover:shadow-brand-500/10 relative flex flex-col overflow-hidden rounded-lg border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
                <div
                    class="from-brand-500 to-brand-600 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br text-white"
                >
                    <example.icon class="size-5" />
                </div>
                <h2 class="text-foreground mb-1 font-semibold">{example.title}</h2>
                <p class="text-muted-foreground flex-1 text-sm leading-relaxed">
                    {example.description}
                </p>
                <span class="text-brand-500 mt-3 inline-flex items-center text-xs font-medium">
                    Open demo
                    <ArrowRight
                        class="ml-1 size-3 transition-transform group-hover:translate-x-0.5"
                    />
                </span>
            </a>
        {/each}
    </div>
</div>
