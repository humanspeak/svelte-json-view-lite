import { env } from '$env/dynamic/public'
import manifestData from '$lib/sitemap-manifest.json'
import { createSitemapResponse } from '@humanspeak/docs-kit/server'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
    return createSitemapResponse({
        manifest: manifestData,
        siteUrl: env.PUBLIC_SITE_URL || url.origin
    })
}
