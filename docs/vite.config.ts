import { rehypeKeepCase } from '@humanspeak/docs-kit/mdsvex'
import {
    demoManifestPlugin,
    docMirrorsPlugin,
    exampleMirrorsPlugin,
    indexNowPlugin,
    llmsFullPlugin,
    llmsPlugin,
    sitemapManifestPlugin,
    socialCardsPlugin
} from '@humanspeak/docs-kit/vite'
import adapter from '@sveltejs/adapter-cloudflare'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { mdsvex } from 'mdsvex'
import { createHighlighter } from 'shiki'
import { defineConfig } from 'vite'

import { comparisons, ours } from './src/lib/compare-data.js'
import { docsConfig } from './src/lib/docs-config.js'

// IndexNow verification key. The matching `static/<key>.txt` file must be
// deployed and publicly reachable at `${siteUrl}/<key>.txt`.
const indexNowKey = 'b655e901-d19a-4812-88a3-49781404940d'

const highlighter = await createHighlighter({
    themes: ['github-light', 'one-dark-pro'],
    langs: ['javascript', 'typescript', 'tsx', 'html', 'css', 'json', 'bash', 'shell', 'svelte']
})

export default defineConfig({
    plugins: [
        sitemapManifestPlugin({
            blogDir: false,
            extraPages: comparisons.map((c) => ({
                route: `/compare/${c.slug}`,
                source: 'src/lib/compare-data.ts'
            }))
        }),
        demoManifestPlugin({ split: true }),
        docMirrorsPlugin({ siteUrl: 'https://jsonview.svelte.page' }),
        exampleMirrorsPlugin({
            siteUrl: 'https://jsonview.svelte.page',
            sourceBaseUrl: 'https://github.com/humanspeak/svelte-json-view-lite/blob/main/docs'
        }),
        llmsFullPlugin({
            siteUrl: 'https://jsonview.svelte.page',
            pkgName: '@humanspeak/svelte-json-view-lite'
        }),
        llmsPlugin({
            siteUrl: 'https://jsonview.svelte.page',
            pkgName: 'Svelte JSON View Lite',
            description:
                'A fast, tiny JSON tree viewer for Svelte 5 with react-json-view-lite API parity, typed snippet overrides, SSR-safe ARIA tree semantics, CSS-variable theming, and zero runtime dependencies.',
            comparisons: { ours, competitors: comparisons },
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
                ...comparisons.map((c) => ({
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
                },
                {
                    ogSlug: 'blog-react-json-view-lite-to-svelte',
                    ogTitle: 'Coming to Svelte from React?',
                    ogTagline: 'Move react-json-view-lite to Svelte 5, step by step.',
                    ogFeatures: ['React Migration', 'API Parity', 'Typed Snippets', 'Svelte 5']
                }
            ]
        }),
        // Submits changed URLs to IndexNow (Bing, Yandex, etc.) on deploy.
        // Gated behind `--mode indexnow` so ordinary `vite build` never pings.
        indexNowPlugin({
            siteUrl: docsConfig.url,
            key: indexNowKey,
            productionMode: 'indexnow'
        }),
        tailwindcss(),
        sveltekit({
            preprocess: [
                vitePreprocess(),
                mdsvex({
                    rehypePlugins: [rehypeKeepCase],
                    extensions: ['.md', '.svx'],
                    highlight: {
                        highlighter: async (code, lang) => {
                            lang ??= 'text'
                            const lightHtml = highlighter.codeToHtml(code, {
                                lang,
                                theme: 'github-light'
                            })
                            const darkHtml = highlighter.codeToHtml(code, {
                                lang,
                                theme: 'one-dark-pro'
                            })
                            const encoded = Buffer.from(code).toString('base64')

                            const combinedHtml = `
                        <div class="shiki-container" data-code="${encoded}" data-lang="${lang}">
                            <div class="shiki-light">${lightHtml}</div>
                            <div class="shiki-dark">${darkHtml}</div>
                        </div>
                    `

                            return `{@html ${JSON.stringify(combinedHtml)}}`
                        }
                    }
                })
            ],
            extensions: ['.svelte', '.svx'],
            adapter: adapter(),
            csp: {
                mode: 'hash',
                directives: {
                    'default-src': ['self'],
                    'script-src': [
                        'self',
                        'https://*.ahrefs.com',
                        'https://j.svelte.page',
                        'unsafe-inline',
                        'wasm-unsafe-eval'
                    ],
                    'style-src': ['self', 'unsafe-inline'],
                    'img-src': ['self', 'data:', 'https:'],
                    'font-src': ['self', 'data:'],
                    'worker-src': ['self', 'blob:'],
                    'connect-src': ['self', 'https:'],
                    'frame-ancestors': ['none'],
                    'form-action': ['self'],
                    'base-uri': ['self'],
                    'upgrade-insecure-requests': true
                }
            }
        })
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
    }
})
