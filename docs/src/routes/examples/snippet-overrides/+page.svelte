<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import SnippetOverrides from '$lib/examples/snippet-overrides/demos/SnippetOverrides.svelte'
    import { Braces, Calendar, Link } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Snippet Overrides | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'Snippet Overrides' }
        seo.description =
            'See typed per-type Snippet overrides in action — URL linkification, relative dates, number formatting, boolean badges.'
        seo.ogTitle = 'Snippet Overrides'
        seo.ogTagline = 'Per-type renderers, flipped on and off live.'
        seo.ogFeatures = ['URL Links', 'Relative Dates', 'Number Format', 'Boolean Badges']
        seo.ogSlug = 'examples-snippet-overrides'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'SNIPPETS',
            title: { accent: 'snippet overrides', end: '.' },
            description:
                'Flip typed snippet renderers on and off to customize URLs, dates, booleans, numbers, and labels.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'api', v: 'snippets' },
                { k: 'slots', v: 'typed' }
            ],
            sourceUrl: `${SOURCE_URL}snippet-overrides/demos/SnippetOverrides.svelte`
        }
    ]
</script>

{#snippet demo()}
    <SnippetOverrides />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <Link />
            <span>
                Each value type has its own <code>Snippet</code> slot — here strings become clickable
                links and get relative-date formatting.
            </span>
        </li>
        <li>
            <Calendar />
            <span>
                Overrides are opt-in per type: turn one on to customize numbers or booleans and
                leave the rest on the default renderer.
            </span>
        </li>
        <li>
            <Braces />
            <span>
                The snippet props are fully typed, so the value handed to each renderer matches the
                node it decorates.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'snippet-overrides/demos/SnippetOverrides.svelte',
                'snippet-overrides',
                'SnippetOverrides.svelte'
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
