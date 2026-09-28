// Shared order for the examples gallery and previous/next navigation.
type ExampleTag = 'DEMO' | 'SNIPPETS' | 'THEMING' | 'INTERACTION' | 'VALUES' | 'A11Y'

type Example = {
    slug: string
    title: string
    tag: ExampleTag
    description: string
}

export const examples: Example[] = [
    {
        slug: 'playground',
        title: 'Live Playground',
        tag: 'DEMO',
        description:
            'Edit JSON in real time and see the tree render instantly with inline parse errors.'
    },
    {
        slug: 'snippet-overrides',
        title: 'Snippet Overrides',
        tag: 'SNIPPETS',
        description:
            'Decorate strings, numbers, dates, booleans, labels, and primitive values with typed Svelte snippets.'
    },
    {
        slug: 'css-variables',
        title: 'CSS Variable Themer',
        tag: 'THEMING',
        description: 'Tune the --sjv-* theme tokens live without replacing the viewer style map.'
    },
    {
        slug: 'tailwind',
        title: 'Tailwind Tree',
        tag: 'THEMING',
        description:
            'Rounded rows, vivid value colors, three palettes, and compact spacing with Tailwind CSS.'
    },
    {
        slug: 'tailwind-motion',
        title: 'Tailwind + Svelte Motion',
        tag: 'INTERACTION',
        description:
            'The styled tree with gentle entrances, animated palettes, and smoother layout changes.'
    },
    {
        slug: 'click-to-expand',
        title: 'Click to Expand',
        tag: 'INTERACTION',
        description:
            'Toggle label-click expansion and watch beforeExpandChange decisions stream into a live event log.'
    },
    {
        slug: 'edge-cases',
        title: 'Edge Cases',
        tag: 'VALUES',
        description:
            'Render dates, bigints, functions, nulls, empty containers, nested arrays, and long strings.'
    },
    {
        slug: 'accessibility',
        title: 'ARIA Treeview',
        tag: 'A11Y',
        description:
            'Inspect tree roles, expanded state, labelled controls, and keyboard-ready focus behavior.'
    }
]
