import { env } from '$env/dynamic/public'
import manifestData from '$lib/sitemap-manifest.json'
import type { RequestHandler } from '@sveltejs/kit'

const manifest: Record<string, string> = manifestData

// Eager=false keeps build light; we only need the keys for paths.
const pageFiles = Object.keys(
    import.meta.glob('/src/routes/**/+page.{svelte,svx,md}', { eager: false })
)

function toPath(file: string): string {
    const p = file.replace('/src/routes', '').replace(/\/\+page\.(svelte|svx|md)$/i, '')
    return p === '' ? '/' : p
}

/** Priority tuned to our route shape. */
function getPriority(path: string): string {
    if (path === '/') return '1.0'
    if (path === '/docs/getting-started' || path.startsWith('/docs/api/')) return '0.9'
    if (path.startsWith('/docs/')) return '0.8'
    if (path.startsWith('/examples')) return '0.7'
    return '0.5'
}

function getChangefreq(path: string): string {
    if (path === '/') return 'weekly'
    return 'monthly'
}

export const GET: RequestHandler = async ({ url }) => {
    const base = (env.PUBLIC_SITE_URL || `${url.origin}`).replace(/\/$/, '')

    const routes = [...new Set(pageFiles.map(toPath))]
        .filter((p) => !/\/_(?:.*)|\/(?:\+|__)/.test(p) && p.startsWith('/social-cards') === false)
        .sort()

    const today = new Date().toISOString().slice(0, 10)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
        .map(
            (p) =>
                `  <url>\n    <loc>${base}${p}</loc>\n    <lastmod>${manifest[p] || today}</lastmod>\n    <changefreq>${getChangefreq(p)}</changefreq>\n    <priority>${getPriority(p)}</priority>\n  </url>`
        )
        .join('\n')}\n</urlset>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            // CDN caches for 1 hour; browsers get latest on next request.
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    })
}
