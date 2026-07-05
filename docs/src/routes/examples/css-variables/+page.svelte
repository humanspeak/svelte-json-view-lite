<script lang="ts">
    import {
        CodeReferenceV2,
        ExampleV2,
        formatSheetLabel,
        getSeoContext,
        type ExampleSection
    } from '@humanspeak/docs-kit'
    import { demoCodeSample } from '$lib/demo-loaders'
    import CssVariableThemer from '$lib/examples/css-variables/demos/CssVariableThemer.svelte'
    import { Eye, Palette, SwatchBook } from '@lucide/svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'CSS Variable Themer | Examples | Svelte JSON View Lite'
        seo.h1 = { title: 'CSS Variable Themer' }
        seo.description =
            'Color-pick every --sjv-* token or apply a Solarized, Dracula, or GitHub preset. Theming without swapping the style prop.'
        seo.ogTitle = 'CSS Variable Themer'
        seo.ogTagline = 'Every --sjv-* color, wired to a color picker.'
        seo.ogFeatures = ['Color Pickers', 'Named Presets', '10 Tokens', 'Live Preview']
        seo.ogSlug = 'examples-css-variables'
    }

    const SOURCE_URL =
        'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/'
    const sections: ExampleSection[] = [
        {
            figId: 'FIG-001',
            tag: 'THEMING',
            title: { accent: 'css variable themer', end: '.' },
            description:
                'Tune the --sjv-* theme tokens live without replacing the viewer style map.',
            snippet: demo,
            codeSnippet: code,
            notes: exampleNotes,
            barCells: [
                { k: 'theme', v: 'css variables' },
                { k: 'preview', v: 'live' }
            ],
            sourceUrl: `${SOURCE_URL}css-variables/demos/CssVariableThemer.svelte`
        }
    ]
</script>

{#snippet demo()}
    <CssVariableThemer />
{/snippet}

{#snippet exampleNotes()}
    <ul>
        <li>
            <Palette />
            <span>
                Every <code>--sjv-*</code> token maps to a color picker, so you can retheme punctuation,
                keys, and each value type independently.
            </span>
        </li>
        <li>
            <SwatchBook />
            <span>
                Named presets (Solarized, Dracula, GitHub) apply a full palette in one click as a
                starting point.
            </span>
        </li>
        <li>
            <Eye />
            <span>
                Themes are pure CSS custom properties — no <code>style</code> prop swap and no rebuild,
                so the preview updates instantly.
            </span>
        </li>
    </ul>
{/snippet}

{#snippet code()}
    <CodeReferenceV2
        samples={[
            demoCodeSample(
                'css-variables/demos/CssVariableThemer.svelte',
                'css-variable-themer',
                'CssVariableThemer.svelte'
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
