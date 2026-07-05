<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import AccessibilityTree from '$lib/examples/accessibility/demos/AccessibilityTree.svelte'
    import { Accessibility, Keyboard, ListTree } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'ARIA Treeview | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'ARIA Treeview' }
        seo.description =
            'Inspect how @humanspeak/svelte-json-view-lite renders accessible JSON trees with labelled controls, expanded state, and keyboard focus.'
        seo.ogTitle = 'ARIA Treeview'
        seo.ogTagline = 'Keyboard-ready JSON tree semantics.'
        seo.ogFeatures = ['role="tree"', 'aria-expanded', 'aria-controls', 'Roving tabindex']
        seo.ogSlug = 'examples-accessibility'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'A11Y',
            title: { accent: 'aria treeview', end: '.' },
            description:
                'Inspect how the viewer exposes tree roles, expansion state, labelled controls, and keyboard-ready focus behavior.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'role', v: 'tree' },
                { k: 'focus', v: 'roving' }
            ],
            sourceUrl: `${SOURCE_URL}accessibility/demos/AccessibilityTree.svelte`
        }
    ]
</script>

{#snippet demo()}
    <AccessibilityTree />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <ListTree />
            <span>
                Containers render as <code>role="tree"</code> / <code>role="group"</code> nodes with
                <code>aria-expanded</code> and <code>aria-controls</code> wiring each disclosure to its
                children.
            </span>
        </li>
        <li>
            <Keyboard />
            <span>
                Arrow keys walk the tree and <code>Enter</code> / <code>Space</code> toggle a node — the
                same keyboard model ships in the packaged component.
            </span>
        </li>
        <li>
            <Accessibility />
            <span>
                A roving <code>tabindex</code> keeps a single tab stop for the whole tree so focus never
                gets trapped inside deep nesting.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'accessibility/demos/AccessibilityTree.svelte',
                'accessibility-tree',
                'AccessibilityTree.svelte'
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
