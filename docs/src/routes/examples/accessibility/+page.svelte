<script lang="ts">
    import { getSeoContext } from '@humanspeak/docs-kit'
    import Example from '$lib/components/general/Example.svelte'
    import AccessibilityTree from '$lib/examples/AccessibilityTree.svelte'
    import sourceCode from '$lib/examples/AccessibilityTree.svelte?raw'

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'ARIA Treeview | Examples | Svelte JSON View Lite'
        seo.description =
            'Inspect how @humanspeak/svelte-json-view-lite renders accessible JSON trees with labelled controls, expanded state, and keyboard focus.'
        seo.ogTitle = 'ARIA Treeview'
        seo.ogTagline = 'Keyboard-ready JSON tree semantics.'
        seo.ogFeatures = ['role="tree"', 'aria-expanded', 'aria-controls', 'Roving tabindex']
        seo.ogSlug = 'examples-accessibility'
    }
</script>

<Example
    title="ARIA Treeview"
    description="Inspect how the viewer exposes tree roles, expansion state, labelled controls, and keyboard-ready focus behavior."
    tag="A11Y"
    filename="AccessibilityTree.svelte"
    {sourceCode}
    barCells={[
        { k: 'role', v: 'tree' },
        { k: 'focus', v: 'roving' }
    ]}
    sourceUrl="https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs/src/lib/examples/AccessibilityTree.svelte"
>
    <AccessibilityTree />
</Example>
