<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import CssVariableThemer from '$lib/examples/CssVariableThemer.svelte'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'CSS Variable Themer | Examples | Svelte JSON View Lite'
        seo.description =
            'Color-pick every --sjv-* token or apply a Solarized, Dracula, or GitHub preset. Theming without swapping the style prop.'
        seo.ogTitle = 'CSS Variable Themer'
        seo.ogTagline = 'Every --sjv-* color, wired to a color picker.'
        seo.ogFeatures = ['Color Pickers', 'Named Presets', '10 Tokens', 'Live Preview']
        seo.ogSlug = 'examples-css-variables'
    }
</script>

<Example
    title="CSS Variable Themer"
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/CssVariableThemer.svelte"
>
    <CssVariableThemer />
</Example>
