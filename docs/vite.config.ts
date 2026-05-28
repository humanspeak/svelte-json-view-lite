import {
    demoManifestPlugin,
    docMirrorsPlugin,
    llmsFullPlugin,
    llmsPlugin,
    sitemapManifestPlugin,
    socialCardsPlugin
} from '@humanspeak/docs-kit/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

import { competitors } from './src/lib/compare-data'
import { docsConfig } from './src/lib/docs-config'

export default defineConfig({
    plugins: [
        sitemapManifestPlugin({ blogDir: false }),
        demoManifestPlugin(),
        docMirrorsPlugin({ siteUrl: 'https://jsonview.svelte.page' }),
        llmsFullPlugin({
            siteUrl: 'https://jsonview.svelte.page',
            pkgName: '@humanspeak/svelte-json-view-lite'
        }),
        llmsPlugin({
            siteUrl: 'https://jsonview.svelte.page',
            pkgName: 'Svelte JSON View Lite',
            description:
                'A fast, tiny JSON tree viewer for Svelte 5 with react-json-view-lite API parity, typed snippet overrides, SSR-safe ARIA tree semantics, CSS-variable theming, and zero runtime dependencies.',
            prepend: 'static/llms-prepend.md',
            append: 'static/llms-append.md'
        }),
        socialCardsPlugin({
            npmPackage: docsConfig.npmPackage,
            defaultTitle: docsConfig.name,
            defaultDescription:
                'Fast, accessible JSON tree viewing for Svelte 5 with typed snippets and zero runtime dependencies.',
            defaultFeatures: docsConfig.defaultFeatures,
            extraPages: [
                ...competitors.map((c) => ({
                    ogSlug: `compare-${c.slug}`,
                    ogTitle: `vs ${c.name}`,
                    ogTagline: c.tagline,
                    ogFeatures: [
                        'Feature Comparison',
                        'Pros & Cons',
                        'Migration Guide',
                        'Honest Verdict'
                    ]
                })),
                {
                    ogSlug: 'blog-accessible-json-treeviews',
                    ogTitle: 'Accessible JSON Tree Viewers in Svelte 5',
                    ogTagline:
                        'How to inspect structured data with tree semantics, typed snippets, and Svelte 5 runes.',
                    ogFeatures: ['ARIA Treeview', 'Svelte 5', 'Snippet Overrides', 'Zero Deps']
                }
            ]
        }),
        tailwindcss(),
        sveltekit()
    ],
    server: {
        port: 8234,
        fs: {
            // Allow the docs site to import from the sibling library and
            // the root-level test/ playground (used as a fixture source).
            allow: ['..']
        }
    },
    optimizeDeps: {
        exclude: [
            '@humanspeak/docs-kit',
            '@humanspeak/svelte-satori-fix',
            '@resvg/resvg-js',
            'satori',
            'satori-html'
        ]
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Heavy deps isolated so they only load on pages that need them.
                    if (id.includes('node_modules/shiki')) {
                        return 'shiki'
                    }
                    if (id.includes('node_modules/@humanspeak/svelte-motion')) {
                        return 'svelte-motion'
                    }
                }
            }
        }
    }
})
