<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import TailwindTree from '$lib/examples/tailwind/demos/TailwindTree.svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Tailwind JSON Tree | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Tailwind Tree' }
        seo.description =
            'Style a Svelte JSON viewer with Tailwind utilities: rounded rows, colorful values, three palettes, and keyboard navigation.'
        seo.ogTitle = 'Tailwind Tree'
        seo.ogTagline = 'Your data. Dressed up.'
        seo.ogFeatures = ['Rounded Rows', 'Three Palettes', 'Tailwind CSS', 'Keyboard Navigation']
        seo.ogSlug = 'examples-tailwind'
    }

    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'THEMING',
            title: { accent: 'tailwind tree', end: '.' },
            description:
                'A little polish goes a long way. Rounded rows, vivid values, and a palette that makes structured data feel at home in your app.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'style', v: 'tailwind + css' },
                { k: 'palettes', v: '3' }
            ],
            sourceUrl:
                'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/tailwind/demos/TailwindTree.svelte'
        }
    ]
</script>

{#snippet demo()}
    <TailwindTree />
{/snippet}

{#snippet exampleNotes()}
    <p>
        Inspired by the rounded rows in
        <a href="https://teemukoivisto.github.io/svelte-tree-view/tailwind"
            >svelte-tree-view’s Tailwind example</a
        >. This version uses <code>JsonView</code> with its public <code>style</code> map, Tailwind utilities,
        and scoped CSS for the nested rows.
    </p>
    <p>
        Copy the demo into a Svelte 5 project with Tailwind CSS configured. Keep the utility class
        names as complete strings so Tailwind can detect them. The palette is local to this viewer
        and does not change your site theme.
    </p>
    <p>
        Want animation too? Try the separate <a href="/examples/tailwind-motion"
            >Tailwind + Svelte Motion example</a
        >. This version uses no animation dependency.
    </p>
    <p>
        Click a field name or chevron to toggle a container. Tab to a chevron and use the arrow keys
        to navigate. Palette and spacing changes preserve your expanded nodes. Long values wrap;
        arrays and objects retain their brackets. The source below is the running example.
    </p>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'tailwind/demos/TailwindTree.svelte',
                'tailwind-tree',
                'TailwindTree.svelte'
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
        sheetLabel={formatSheetLabel(i, sections.length)}
        filename="TailwindTree.svelte"
        barCells={section.barCells}
        sourceUrl={section.sourceUrl}
        codeSnippet={section.codeSnippet}
        codeLabel="show code"
        notes={section.notes}
    >
        {@render section.snippet()}
    </ExampleV2>
{/each}
