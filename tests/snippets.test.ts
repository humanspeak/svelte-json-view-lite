import { expect, test } from '@playwright/test'
import { rootTree } from './helpers.js'

/**
 * Per-type snippet overrides — no React analogue; the Svelte port
 * introduces {#snippet string}/{#snippet date}/etc. The /test/snippets
 * page registers a custom date renderer (relative time) and a custom
 * string renderer (clickable URL links). We verify the custom output
 * actually replaces the default primitive rendering in a real browser.
 */

test('date snippet renders a span with an ISO title attribute', async ({ page }) => {
    await page.goto('/test/snippets')
    const tree = rootTree(page)
    // The `joined` value is rendered by the custom date snippet as a
    // <span title={iso}>relative-time</span>.
    const dateSpan = tree.locator('span[title*="2024-01-15"]').first()
    await expect(dateSpan).toBeVisible()
    // Content is the relative-time string, not the raw ISO.
    const text = await dateSpan.textContent()
    expect(text).not.toContain('2024-01-15T09:00:00')
})

test('string snippet renders URLs as anchor tags while leaving other strings as text', async ({
    page
}) => {
    await page.goto('/test/snippets')
    const tree = rootTree(page)
    // The URL value renders as <a href=..> target=_blank.
    const link = tree.getByRole('link', { name: 'https://example.com/ada' })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', 'https://example.com/ada')
    await expect(link).toHaveAttribute('target', '_blank')
    // And a non-URL string ('Ada Lovelace') is NOT rendered as a link.
    await expect(tree.getByRole('link', { name: /Ada Lovelace/ })).toHaveCount(0)
})
