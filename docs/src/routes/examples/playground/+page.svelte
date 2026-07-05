<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import JsonPlayground from '$lib/examples/playground/demos/JsonPlayground.svelte'
    import { Eye, Pencil, SlidersHorizontal } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Live Playground | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Live Playground' }
        seo.description =
            'Edit JSON or JS expressions and see a live JsonView render. Swap expand strategies, toggle click-to-expand, all in the browser.'
        seo.ogTitle = 'Live Playground'
        seo.ogTagline = 'Edit JSON, render a tree, tweak every knob.'
        seo.ogFeatures = ['Live Editor', 'JSON + JS Modes', 'Expand Strategies', 'Click to Expand']
        seo.ogSlug = 'examples-playground'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'DEMO',
            title: { accent: 'live playground', end: '.' },
            description:
                'Edit JSON in real time, switch expansion behavior, and preview the rendered tree without leaving the page.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'input', v: 'json' },
                { k: 'preview', v: 'JsonView' }
            ],
            sourceUrl: `${SOURCE_URL}playground/demos/JsonPlayground.svelte`
        }
    ]
</script>

{#snippet demo()}
    <JsonPlayground />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <Pencil />
            <span>
                Edit raw JSON or a JS expression and the tree re-renders as you type, with inline
                parse errors when the input is invalid.
            </span>
        </li>
        <li>
            <SlidersHorizontal />
            <span>
                Swap the expand strategy between <code>allExpanded</code> and
                <code>collapseAllNested</code>, and toggle <code>clickToExpandNode</code> live.
            </span>
        </li>
        <li>
            <Eye />
            <span>
                The preview is the real packaged <code>JsonView</code> — what you see is exactly what
                ships in your app.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'playground/demos/JsonPlayground.svelte',
                'json-playground',
                'JsonPlayground.svelte'
            )
        ]}
        columns={1}
    />
{/snippet}

{#each sections as section, i (section.figId)}
    <ExampleV2
        figId={section.figId}
        tag={section.tag}
        title={section.title}
        description={section.description}
        mode={section.mode ?? 'live'}
        sheetLabel={formatSheetLabel(i, sections.length)}
        barCells={section.barCells}
        sourceUrl={section.sourceUrl}
        codeSnippet={section.codeSnippet}
        codeLabel="show code"
        notes={section.notes}
    >
        {@render section.snippet()}
    </ExampleV2>
{/each}
