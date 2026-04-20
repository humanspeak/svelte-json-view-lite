import { expect, test } from '@playwright/test'
import { expectCollapsed, expectExpanded, labelFor, treeItemFor } from './helpers.js'

/**
 * clickToExpandNode behaviour — mirrors
 * react-json-view-lite/src/DataRenderer.test.tsx:550-620. The label span
 * alongside the icon must also toggle the node when clickToExpandNode
 * is on.
 */

test('the label span receives a clickable-label class when clickToExpandNode is on', async ({
    page
}) => {
    await page.goto('/test/click-to-expand')
    const label = labelFor(page, 'nested object')
    await expect(label).toHaveClass(/clickable-label/)
})

test('clicking the label toggles the parent treeitem', async ({ page }) => {
    await page.goto('/test/click-to-expand')
    const nested = treeItemFor(page, 'nested object')
    const expander = nested.getByRole('button').first()
    const label = nested.locator('span[class*="clickable-label"]').first()

    await expectExpanded(expander)
    await label.click()
    await expectCollapsed(expander)
    await label.click()
    await expectExpanded(expander)
})
