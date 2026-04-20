import { expect, test } from '@playwright/test'
import { expanders, rootTree, treeitems } from './helpers.js'

/**
 * compactTopLevel shape — mirrors the DOM half of
 * react-json-view-lite/src/DataRenderer.test.tsx:320-370. No outer
 * expander, no wrapping braces; each top-level key is its own row.
 */

test('compactTopLevel removes the outer expander and braces', async ({ page }) => {
    await page.goto('/test/compact')

    const tree = rootTree(page)
    // Every top-level key renders as its own row.
    const topLevelCount = await treeitems(page).count()
    expect(topLevelCount).toBeGreaterThan(5)

    // Each top-level row may host its own expander for object/array values,
    // but there is no single "root" expander governing the whole tree.
    const buttons = expanders(page)
    const firstButtonLabel = await buttons.first().getAttribute('aria-label')
    expect(['collapse JSON', 'expand JSON']).toContain(firstButtonLabel)

    // Root-level braces are absent. `jsonData` has bracket characters
    // inside child rows (e.g. `[` for arrays) so we scope to the tree's
    // *direct* children — they are the individual treeitems, not a
    // brace span.
    const directChildren = await tree.evaluate((el) =>
        Array.from(el.children).map((c) => c.tagName.toLowerCase())
    )
    expect(directChildren).not.toContain('span')
})
