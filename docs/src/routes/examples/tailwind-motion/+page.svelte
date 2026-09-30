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
            'Style a Svelte JSON viewer with Tailwind utilities and Svelte Motion: rounded rows, hover borders, click-to-copy feedback, animated palettes, and keyboard navigation.'
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
                'A little polish goes a long way. Rounded rows, vivid values, hover borders, and click-to-copy feedback that makes structured data feel at home in your app.',
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
        and scoped CSS for the nested rows. Expanded objects and arrays have a filled boundary around
        their children to keep each group together visually.
    </p>
    <p>
        Copy the demo into a Svelte 5 project with Tailwind CSS configured and
        <code>@humanspeak/svelte-motion</code> and <code>@lucide/svelte</code> installed. Keep the utility
        class names as complete strings so Tailwind can detect them. The palette is local to this viewer
        and does not change your site theme.
    </p>
    <p>
        <a href="https://motion.svelte.page/">Svelte Motion</a> adds a spring-driven palette
        indicator, a gentle entrance and button feedback. The viewer’s <code>row</code>,
        <code>expander</code>, <code>collapsed</code>, and <code>childGroup</code> snippets let
        <code>MotionDiv</code>, <code>MotionSpan</code>, and <code>MotionUl</code> animate the tree
        directly. <code>AnimatePresence</code> owns the live child group during exit and reversal. The
        viewer keeps control of expansion, keyboard navigation, and focus. Turn off Motion for a still
        preview. Your system’s reduced-motion preference disables animations automatically.
    </p>
    <p>
        Child rows slide vertically without scaling. Hover a caret or focus it with the keyboard to
        see it lean toward its next state. The ellipsis fades with expansion, and hovering a row
        nudges it and its subtree two pixels to the right. Rapid toggles reverse the slide smoothly.
        For styling alone, see the <a href="/examples/tailwind">Tailwind-only example</a>. Hover a
        row to highlight its border, then click its label or value to copy. Strings copy as plain
        text; containers copy complete, formatted JSON, even when collapsed. A successful copy
        flashes a green border and a spring-animated checkmark for two seconds. If copying fails, a
        red border and cross invite a retry. Selecting text leaves your clipboard alone. Tab to a
        row and press Enter or Space to copy, or use its chevron to expand and the arrow keys to
        navigate. Palette and spacing changes preserve your expanded nodes. Long values wrap; arrays
        and objects retain their brackets. <code>clickToExpandSummary=&#123;false&#125;</code> lets
        row clicks copy using a normal bubbling handler while chevrons expand.
        <code>style.hideCommas</code>
        removes separators from the bordered rows. The viewer contains collapsed-snippet whitespace, and
        inline-flex punctuation keeps the animated ellipsis and brackets together. The caret uses
        <code>focusVisible</code> for keyboard-only tilt, so mouse focus does not leave it tilted. The
        source below is the running example.
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
