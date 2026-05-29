import type { Breadcrumb, NavSection } from '@humanspeak/docs-kit'
import {
    Accessibility,
    ArrowRightLeft,
    BookOpen,
    Braces,
    FlaskConical,
    MousePointerClick,
    Paintbrush,
    Play,
    Puzzle,
    Rocket,
    SquarePen,
    Swords
} from '@lucide/svelte'

export const headerNav: { label: string; href: string }[] = [
    { label: 'docs', href: '/docs' },
    { label: 'examples', href: '/examples' },
    { label: 'compare', href: '/compare' },
    { label: 'blog', href: '/blog' }
]

const itemBreadcrumbOverrides: Record<string, string> = {
    '/docs/api/json-view': 'JsonView',
    '/docs/api/types': 'Types',
    '/docs/migration': 'Migration'
}

const blogPostTitles: Record<string, string> = {
    'accessible-json-treeviews': 'Accessible JSON Treeviews'
}

export function buildBreadcrumbs(pathname: string): Breadcrumb[] {
    if (pathname === '/docs') return [{ title: 'Docs' }]
    if (pathname === '/examples') return [{ title: 'Examples' }]
    if (pathname === '/compare') return [{ title: 'Compare' }]
    if (pathname === '/blog' || pathname === '/blog/') return [{ title: 'Blog' }]
    if (pathname.startsWith('/blog/')) {
        const slug = pathname.replace('/blog/', '').replace(/\/$/, '')
        return [{ title: 'Blog', href: '/blog' }, { title: blogPostTitles[slug] ?? slug }]
    }

    for (const section of docsSections) {
        for (const item of section.items) {
            if (item.href !== pathname) continue
            const itemTitle = itemBreadcrumbOverrides[pathname] ?? item.title

            if (pathname.startsWith('/compare/')) {
                return [{ title: 'Compare', href: '/compare' }, { title: itemTitle }]
            }

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
        title: 'Get Started',
        icon: Rocket,
        items: [
            { title: 'Getting Started', href: '/docs/getting-started', icon: Rocket },
            { title: 'Migration Guide', href: '/docs/migration', icon: ArrowRightLeft }
        ]
    },
    {
        title: 'API Reference',
        icon: BookOpen,
        items: [
            { title: 'JsonView props', href: '/docs/api/json-view', icon: Braces },
            { title: 'Types & snippets', href: '/docs/api/types', icon: BookOpen }
        ]
    },
    {
        title: 'Customization',
        icon: Paintbrush,
        items: [
            { title: 'Themes & CSS variables', href: '/docs/themes', icon: Paintbrush },
            { title: 'Snippet overrides', href: '/docs/snippet-overrides', icon: Puzzle }
        ]
    },
    {
        title: 'Accessibility',
        icon: Accessibility,
        items: [{ title: 'Treeview pattern', href: '/docs/accessibility', icon: Accessibility }]
    },
    {
        title: 'Interactive Demos',
        icon: Play,
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
    },
    {
        title: 'Compare',
        icon: Swords,
        items: [
            { title: 'All Comparisons', href: '/compare', icon: Swords },
            {
                title: 'vs react-json-view-lite',
                href: '/compare/vs-react-json-view-lite',
                icon: Swords
            },
            { title: 'vs svelte-jsoneditor', href: '/compare/vs-svelte-jsoneditor', icon: Swords },
            {
                title: 'vs vanilla-jsoneditor',
                href: '/compare/vs-vanilla-jsoneditor',
                icon: Swords
            },
            { title: 'vs react-json-view', href: '/compare/vs-react-json-view', icon: Swords },
            {
                title: 'vs @uiw/react-json-view',
                href: '/compare/vs-uiw-react-json-view',
                icon: Swords
            },
            {
                title: 'vs @textea/json-viewer',
                href: '/compare/vs-textea-json-viewer',
                icon: Swords
            }
        ]
    }
]
