<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import EdgeCases from '$lib/examples/edge-cases/demos/EdgeCases.svelte'
    import { Binary, Boxes, Braces } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Edge Cases | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Edge Cases' }
        seo.description =
            'Render every supported value type — dates, bigints, functions, nulls, empty containers, long strings — against the same canonical fixture as the react-json-view-lite Storybook.'
        seo.ogTitle = 'Edge Cases'
        seo.ogTagline = 'Every value type the viewer handles, in one payload.'
        seo.ogFeatures = ['BigInt', 'Dates', 'Functions', 'Nested Objects']
        seo.ogSlug = 'examples-edge-cases'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'VALUES',
            title: { accent: 'edge cases', end: '.' },
            description:
                'Render dates, bigints, functions, nulls, empty containers, nested arrays, and long strings in one payload.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'fixture', v: 'mixed values' },
                { k: 'coverage', v: 'all values' }
            ],
            sourceUrl: `${SOURCE_URL}edge-cases/demos/EdgeCases.svelte`
        }
    ]
</script>

{#snippet demo()}
    <EdgeCases />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <Binary />
            <span>
                Non-JSON primitives — <code>BigInt</code>, <code>Date</code>, <code>function</code>,
                <code>undefined</code>, <code>null</code> — each get their own typed renderer.
            </span>
        </li>
        <li>
            <Boxes />
            <span>
                Empty objects and arrays, deeply nested containers, and long strings all render
                without collapsing the layout.
            </span>
        </li>
        <li>
            <Braces />
            <span>
                Driven by the same canonical fixture as the react-json-view-lite Storybook, so
                behavior is directly comparable.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample('edge-cases/demos/EdgeCases.svelte', 'edge-cases', 'EdgeCases.svelte')
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
