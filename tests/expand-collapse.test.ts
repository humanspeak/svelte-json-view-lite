import { expect, test } from '@playwright/test'
import { expanders, expectCollapsed, expectExpanded, rootTree, treeItemFor } from './helpers.js'

/**
 * Expand/collapse interaction — mirrors the click-path tests from
 * react-json-view-lite/src/DataRenderer.test.tsx:180-310 and the
 * beforeExpandChange veto test at L450-500. vitest already covers
 * aria-expanded state; these assertions specifically exercise real
 * click events and post-hydration DOM mutation in Chromium/Firefox/
 * WebKit and the two mobile projects.
 */

test('clicking an expanded node collapses it and hides descendants', async ({ page }) => {
    await page.goto('/test/basic')
    const nested = treeItemFor(page, 'nested object')
    const expander = nested.getByRole('button').first()
    await expectExpanded(expander)

    await expander.click()
    await expectCollapsed(expander)
    // Child row from the collapsed subtree must no longer be visible.
    await expect(rootTree(page).getByText('sub nested').first()).toBeHidden()

    await expander.click()
    await expectExpanded(expander)
    await expect(rootTree(page).getByText('sub nested').first()).toBeVisible()
})

test('shouldExpandNode=collapseAllNested starts nested rows closed', async ({ page }) => {
    await page.goto('/test/collapsed-nested-objects')
    const nested = treeItemFor(page, 'nested object')
    const expander = nested.getByRole('button').first()
    await expectCollapsed(expander)

    // Clicking opens it — and the child row is then visible.
    await expander.click()
    await expectExpanded(expander)
    await expect(rootTree(page).getByText('sub nested').first()).toBeVisible()
})

test('shouldExpandNode=()=>false keeps the root closed, click opens it', async ({ page }) => {
    await page.goto('/test/collapsed-root')
    const rootButton = expanders(page).first()
    await expectCollapsed(rootButton)
    // No children visible while closed.
    await expect(rootTree(page).getByText('string property')).toBeHidden()

    await rootButton.click()
    await expectExpanded(rootButton)
    await expect(rootTree(page).getByText('string property').first()).toBeVisible()
})

test('beforeExpandChange returning true records the event and allows the transition', async ({
    page
}) => {
    await page.goto('/test/click-to-expand')
    const nested = treeItemFor(page, 'nested object')
    const expander = nested.getByRole('button').first()
    await expectExpanded(expander)

    await expander.click()
    await expectCollapsed(expander)
    // The page displays `last event = {...}` once the callback fires.
    const eventPane = page.getByTestId('last-event')
    await expect(eventPane).toContainText('newExpandValue')
    await expect(eventPane).toContainText('"nested object"')
})

test('beforeExpandChange returning false vetoes the transition', async ({ page }) => {
    await page.goto('/test/click-to-expand')
    // Flip the "Enable veto" button on the playground so beforeExpandChange
    // starts returning false.
    await page.getByTestId('toggle-veto').click()

    const nested = treeItemFor(page, 'nested object')
    const expander = nested.getByRole('button').first()
    await expectExpanded(expander)

    await expander.click()
    // State must NOT have changed despite the click — veto path.
    await expectExpanded(expander)
    // But the observer still captured the attempt.
    const eventPane = page.getByTestId('last-event')
    await expect(eventPane).toContainText('newExpandValue')
    await expect(eventPane).toContainText('false')
})
