<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import TailwindMotionTree from '$lib/examples/tailwind-motion/demos/TailwindMotionTree.svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Tailwind + Svelte Motion | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Tailwind + Svelte Motion' }
        seo.description =
            'Style a Svelte JSON viewer with Tailwind utilities and Svelte Motion: rounded rows, colorful values, animated palettes, and keyboard navigation.'
        seo.ogTitle = 'Tailwind + Svelte Motion'
        seo.ogTagline = 'Your data. Dressed up.'
        seo.ogFeatures = ['Rounded Rows', 'Three Palettes', 'Tailwind CSS', 'Keyboard Navigation']
        seo.ogSlug = 'examples-tailwind-motion'
    }

    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'MOTION',
            title: { accent: 'tailwind + motion', end: '.' },
            description:
                'A little polish goes a long way. Rounded rows, vivid values, and a palette that makes structured data feel at home in your app.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'style', v: 'tailwind + motion' },
                { k: 'palettes', v: '3' }
            ],
            sourceUrl:
                'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/tailwind-motion/demos/TailwindMotionTree.svelte'
        }
    ]
</script>

{#snippet demo()}
    <TailwindMotionTree />
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
        Copy the demo into a Svelte 5 project with Tailwind CSS configured and
        <code>@humanspeak/svelte-motion</code> installed. Keep the utility class names as complete strings
        so Tailwind can detect them. The palette is local to this viewer and does not change your site
        theme.
    </p>
    <p>
        <a href="https://motion.svelte.page/">Svelte Motion</a> adds a spring-driven palette
        indicator, a gentle entrance and button feedback. Its <code>animate</code> API also animates
        child-group height, caret rotation, ellipsis width and opacity, and row hover movement. The
        <code>childrenAnimation</code> hook keeps closing rows mounted until Motion finishes and stops
        interrupted playback before reversing. Turn off Motion for a still preview. Your system’s reduced-motion
        preference disables the demo’s animations automatically.
    </p>
    <p>
        Child rows slide vertically without scaling. Hover or focus a caret to see it lean toward
        its next state. The ellipsis fades with expansion, and hovering a row nudges it and its
        subtree two pixels to the right. Rapid toggles reverse the slide smoothly. For styling
        alone, see the <a href="/examples/tailwind">Tailwind-only example</a>. Click a field name or
        chevron to toggle a container. Tab to a chevron and use the arrow keys to navigate. Palette
        and spacing changes preserve your expanded nodes. Long values wrap; arrays and objects
        retain their brackets. The source below is the running example.
    </p>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'tailwind-motion/demos/TailwindMotionTree.svelte',
                'tailwind-motion-tree',
                'TailwindMotionTree.svelte'
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
        filename="TailwindMotionTree.svelte"
        barCells={section.barCells}
        sourceUrl={section.sourceUrl}
        codeSnippet={section.codeSnippet}
        codeLabel="show code"
        notes={section.notes}
    >
        {@render section.snippet()}
    </ExampleV2>
{/each}
