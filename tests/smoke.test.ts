import { expect, test } from '@playwright/test'

/**
 * Minimal end-to-end smoke test so the Playwright job in CI has at least
 * one test to run on an otherwise-empty tests/ directory. Covers the core
 * rendering path: the Storybook-parity playground loads, the root tree is
 * present with WAI-ARIA semantics, and a sample value is rendered.
 */
test('basic story renders the JsonView tree with ARIA semantics', async ({ page }) => {
    await page.goto('/test/basic')

    await expect(page.getByRole('heading', { level: 1, name: 'Basic' })).toBeVisible()

    const tree = page.getByRole('tree', { name: 'JSON view' })
    await expect(tree).toBeVisible()

    await expect(tree.getByText('"my string"')).toBeVisible()
    await expect(tree.getByText('9007199254740991n')).toBeVisible()
})
