import { expect, test } from '@playwright/test'
import { rootTree } from './helpers.js'

/**
 * Navigation sweep — one pass per playground route verifying the page
 * boots, SvelteKit hydrates, and the core pieces (the page heading plus
 * the `role="tree"` root) are visible. Replaces the original smoke
 * test; interaction and assertion depth lives in the topic-specific
 * suites.
 */

type Route = {
    path: string
    heading: string | RegExp
    sampleText?: string | RegExp
}

const routes: Route[] = [
    { path: '/test/basic', heading: 'Basic', sampleText: '"my string"' },
    { path: '/test/dark-theme', heading: 'Dark theme', sampleText: '9007199254740991n' },
    {
        path: '/test/collapsed-nested-objects',
        heading: 'Collapsed nested objects',
        sampleText: 'nested object'
    },
    { path: '/test/collapsed-root', heading: 'Collapsed root' },
    { path: '/test/compact', heading: 'Compact root level', sampleText: 'string property' },
    {
        path: '/test/click-to-expand',
        heading: 'Click on field name to expand',
        sampleText: 'string property'
    },
    {
        path: '/test/strings-without-quotes',
        heading: 'Render strings without quotes',
        sampleText: 'my string'
    },
    {
        path: '/test/field-names-with-quotes',
        heading: 'Render field names with quotes',
        sampleText: '"string property"'
    },
    {
        path: '/test/stringify-string-values',
        heading: 'Stringify string values',
        sampleText: 'valueWithEscapedCharacters'
    },
    {
        path: '/test/snippets',
        heading: /snippet overrides/i,
        sampleText: 'Ada Lovelace'
    },
    {
        path: '/test/css-variables',
        heading: /CSS variables/i,
        sampleText: '"my string"'
    },
    { path: '/test/edge-cases', heading: /edge cases/i, sampleText: 'deeply' }
]

for (const { path, heading, sampleText } of routes) {
    test(`renders ${path}`, async ({ page }) => {
        await page.goto(path)

        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()

        // At least one tree must be visible; /test/css-variables has two.
        const trees = rootTree(page)
        await expect(trees.first()).toBeVisible()
        expect(await trees.count()).toBeGreaterThanOrEqual(1)

        if (sampleText !== undefined) {
            await expect(page.getByText(sampleText).first()).toBeVisible()
        }
    })
}

test('index page lists every parity + svelte-addition story', async ({ page }) => {
    await page.goto('/')
    await expect(
        page.getByRole('heading', { level: 1, name: '@humanspeak/svelte-json-view-lite' })
    ).toBeVisible()
    for (const { path } of routes) {
        await expect(page.locator(`a[href="${path}"]`)).toBeVisible()
    }
})
