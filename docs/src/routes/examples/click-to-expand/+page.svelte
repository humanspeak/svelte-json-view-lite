<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import ClickToExpand from '$lib/examples/click-to-expand/demos/ClickToExpand.svelte'
    import { Ban, MousePointerClick, ScrollText } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Click to Expand | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Click to Expand' }
        seo.description =
            'Toggle clickToExpandNode and beforeExpandChange veto strategies against a live tree, with an event log streaming every decision.'
        seo.ogTitle = 'Click to Expand'
        seo.ogTagline = 'Veto expand/collapse events with a live event log.'
        seo.ogFeatures = ['Veto Strategies', 'Event Log', 'clickToExpandNode', 'Confirm Dialog']
        seo.ogSlug = 'examples-click-to-expand'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'INTERACTION',
            title: { accent: 'click to expand', end: '.' },
            description:
                'Toggle label-click expansion and watch beforeExpandChange veto decisions stream into a live event log.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'prop', v: 'clickToExpandNode' },
                { k: 'hook', v: 'beforeExpandChange' }
            ],
            sourceUrl: `${SOURCE_URL}click-to-expand/demos/ClickToExpand.svelte`
        }
    ]
</script>

{#snippet demo()}
    <ClickToExpand />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <MousePointerClick />
            <span>
                <code>clickToExpandNode</code> makes the whole field label a toggle, not just the disclosure
                arrow.
            </span>
        </li>
        <li>
            <Ban />
            <span>
                <code>beforeExpandChange</code> runs before every expand or collapse and can veto
                the change — return <code>false</code> to keep a node as-is.
            </span>
        </li>
        <li>
            <ScrollText />
            <span>
                Each decision streams into a live event log so you can see exactly which node fired
                and whether it was allowed.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'click-to-expand/demos/ClickToExpand.svelte',
                'click-to-expand',
                'ClickToExpand.svelte'
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
