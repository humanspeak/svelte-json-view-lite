import type { Breadcrumb, NavSection } from '@humanspeak/docs-kit'
import {
    Accessibility,
    BookOpen,
    Braces,
    FlaskConical,
    MousePointerClick,
    Paintbrush,
    Play,
    Puzzle,
    Rocket,
    SquarePen
} from '@lucide/svelte'

const itemBreadcrumbOverrides: Record<string, string> = {
    '/docs/api/json-view': 'JsonView',
    '/docs/api/types': 'Types'
}

export function buildBreadcrumbs(pathname: string): Breadcrumb[] {
    if (pathname === '/docs') return [{ title: 'Docs' }]
    if (pathname === '/examples') return [{ title: 'Examples' }]

    for (const section of docsSections) {
        for (const item of section.items) {
            if (item.href !== pathname) continue
            const itemTitle = itemBreadcrumbOverrides[pathname] ?? item.title

            if (pathname.startsWith('/examples/')) {
                return [{ title: 'Examples', href: '/examples' }, { title: itemTitle }]
            }

            if (pathname.startsWith('/docs/')) {
                const depth = pathname.replace('/docs/', '').split('/').length
                if (depth === 1) {
                    return [{ title: 'Docs', href: '/docs/getting-started' }, { title: itemTitle }]
                }
                return [
                    { title: 'Docs', href: '/docs/getting-started' },
                    { title: section.title },
                    { title: itemTitle }
                ]
            }
        }
    }

    return [{ title: 'Docs' }]
}

export const docsSections: NavSection[] = [
    {
        title: 'Getting Started',
        items: [{ title: 'Quick start', href: '/docs/getting-started', icon: Rocket }]
    },
    {
        title: 'API Reference',
        items: [
            { title: 'JsonView props', href: '/docs/api/json-view', icon: Braces },
            { title: 'Types & snippets', href: '/docs/api/types', icon: BookOpen }
        ]
    },
    {
        title: 'Customization',
        items: [
            { title: 'Themes & CSS variables', href: '/docs/themes', icon: Paintbrush },
            { title: 'Snippet overrides', href: '/docs/snippet-overrides', icon: Puzzle }
        ]
    },
    {
        title: 'Accessibility',
        items: [{ title: 'Treeview pattern', href: '/docs/accessibility', icon: Accessibility }]
    },
    {
        title: 'Interactive Demos',
        items: [
            { title: 'All examples', href: '/examples', icon: Play },
            { title: 'Live playground', href: '/examples/playground', icon: SquarePen },
            { title: 'Snippet overrides', href: '/examples/snippet-overrides', icon: Puzzle },
            { title: 'CSS variable themer', href: '/examples/css-variables', icon: Paintbrush },
            {
                title: 'Click to expand',
                href: '/examples/click-to-expand',
                icon: MousePointerClick
            },
            { title: 'Edge cases', href: '/examples/edge-cases', icon: FlaskConical }
        ]
    }
]
