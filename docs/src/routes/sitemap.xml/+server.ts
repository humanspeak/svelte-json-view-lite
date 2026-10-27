import manifestData from '#lib/sitemap-manifest.json'
import { PUBLIC_SITE_URL } from '$app/env/public'
import { createSitemapResponse } from '@humanspeak/docs-kit/server'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
    return createSitemapResponse({
        manifest: manifestData,
        siteUrl: PUBLIC_SITE_URL || url.origin
    })
}
