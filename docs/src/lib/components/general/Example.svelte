<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        type DemoManifestEntry,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { Code, Keyboard, MousePointerClick } from '@lucide/svelte'
    import type { Snippet } from 'svelte'

    type BarCell = {
        k: string
        v: string
    }

    type ExampleProps = {
        children: Snippet
        title: string
        description: string
        tag?: string
        figId?: string
        sourceUrl?: string | null
        filename?: string
        sourceCode?: string
        barCells?: BarCell[]
    }

    const {
        children,
        title,
        description,
        tag = 'DEMO',
        figId = 'FIG-001',
        sourceUrl = null,
        filename,
        sourceCode,
        barCells = [{ k: 'mode', v: 'live' }]
    }: ExampleProps = $props()

    const codeEntry = $derived<DemoManifestEntry | null>(
        sourceCode
            ? {
                  code: sourceCode,
                  lang: 'svelte'
              }
            : null
    )

    const section = $derived<ExampleSection>({
        figId,
        tag,
        title: { accent: title.toLowerCase(), end: '.' },
        description,
        snippet: children,
        codeSnippet: codeEntry ? codeSnippet : undefined,
        notes,
        barCells,
        sourceUrl: sourceUrl ?? undefined
    })
</script>

{#snippet notes()}
    <ul>
        <li>
            <Code />
            <span>
                The demo is a focused Svelte component wired to
                <code>@humanspeak/svelte-json-view-lite</code>.
            </span>
        </li>
        <li>
            <MousePointerClick />
            <span>
                Interactions stay local to the example so you can copy the pattern without pulling
                in the docs shell.
            </span>
        </li>
        <li>
            <Keyboard />
            <span>
                Viewer behavior keeps the same keyboard-ready tree semantics as the packaged
                component.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet codeSnippet()}
    {#if codeEntry}
        <CodeReferenceV2
            samples={[
                {
                    id: 'source',
                    label: filename ?? `${title}.svelte`,
                    ...codeEntry
                }
            ]}
            columns={1}
        />
    {/if}
{/snippet}

<ExampleV2
    figId={section.figId}
    tag={section.tag}
    title={section.title}
    description={section.description}
    mode={section.mode ?? 'live'}
    sheetLabel="SHEET 01 / 01"
    barCells={section.barCells}
    sourceUrl={section.sourceUrl}
    {filename}
    codeSnippet={section.codeSnippet}
    codeLabel="show code"
    notes={section.notes}
>
    {@render section.snippet()}
</ExampleV2>
