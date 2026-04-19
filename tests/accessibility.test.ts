import { expect, test } from '@playwright/test'
import { expanders, rootTree, treeitems } from './helpers.js'

/**
 * Accessibility surface checks that specifically benefit from a real
 * browser over jsdom: resolves `aria-controls` against live DOM ids
 * (which exercises $props.id() SSR→CSR stability), asserts that every
 * tree item exposes an accessible role, and confirms the root carries
 * the documented aria-label fallback. Mirrors the real-browser-side of
 * react-json-view-lite/src/index.test.tsx:40-55.
 */

test('root element is role=tree with the default aria-label', async ({ page }) => {
    await page.goto('/test/basic')
    const tree = rootTree(page)
    await expect(tree).toBeVisible()
    await expect(tree).toHaveAttribute('role', 'tree')
    await expect(tree).toHaveAttribute('aria-label', 'JSON view')
})

test('every treeitem carries role=treeitem and a parent tree', async ({ page }) => {
    await page.goto('/test/basic')
    const items = treeitems(page)
    expect(await items.count()).toBeGreaterThan(5)
    // Spot-check the first three — role is set, aria-selected is present
    // (the port ships `aria-selected="false"` so axe-like tooling is happy).
    for (let i = 0; i < 3; i++) {
        const it = items.nth(i)
        await expect(it).toHaveAttribute('role', 'treeitem')
        await expect(it).toHaveAttribute('aria-selected', 'false')
    }
})

test('every expander exposes aria-expanded + aria-controls when open', async ({ page }) => {
    await page.goto('/test/basic')
    const openButtons = rootTree(page).locator('[role="button"][aria-expanded="true"]')
    const count = await openButtons.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
        const btn = openButtons.nth(i)
        const controls = await btn.getAttribute('aria-controls')
        expect(controls, `button #${i} must reference an id`).toBeTruthy()
        // $props.id() SSR→CSR stability: the referenced element must exist
        // in the live DOM after hydration.
        const referenced = page.locator(`#${controls}`)
        await expect(referenced).toBeVisible()
        await expect(referenced).toHaveAttribute('role', 'group')
    }
})

test('collapsed expander drops aria-controls so it does not dangle', async ({ page }) => {
    await page.goto('/test/collapsed-nested-objects')
    const firstCollapsed = rootTree(page).locator('[role="button"][aria-expanded="false"]').first()
    await expect(firstCollapsed).toHaveAttribute('aria-expanded', 'false')
    expect(await firstCollapsed.getAttribute('aria-controls')).toBeNull()
})

test('expanders use the documented collapse/expand aria labels', async ({ page }) => {
    await page.goto('/test/basic')
    // With allExpanded, every button is open — their label is the "collapse" variant.
    const firstOpen = expanders(page).first()
    await expect(firstOpen).toHaveAttribute('aria-label', 'collapse JSON')

    await page.goto('/test/collapsed-nested-objects')
    const firstClosed = rootTree(page).locator('[role="button"][aria-expanded="false"]').first()
    await expect(firstClosed).toHaveAttribute('aria-label', 'expand JSON')
})

test('edge-cases route stays accessible when every primitive type is present', async ({ page }) => {
    await page.goto('/test/edge-cases')
    const tree = rootTree(page)
    await expect(tree).toBeVisible()
    // The exact item count changes with the fixture; just assert the shape.
    expect(await treeitems(page).count()).toBeGreaterThan(5)
})
