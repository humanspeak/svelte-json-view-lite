import { expect, test } from '@playwright/test'

/**
 * E2E regression for issue #21 — collapsed nodes must not eagerly
 * materialize their children tuple array.
 *
 * The `/test/lazy-children` harness instruments every child value with a
 * getter that ticks a probe, and surfaces the probe as a live counter.
 * A collapsed tree should read ZERO child values; expanding materializes
 * them lazily.
 */

test('collapsed tree reads zero child values on load', async ({ page }) => {
    await page.goto('/test/lazy-children')

    // The whole point of #21: a collapsed 1,000-element tree touches no
    // child values. RED before the fix (reads all 1,000 at mount).
    await expect(page.getByTestId('read-count')).toHaveText('0')
    await expect(page.getByTestId('status')).toHaveAttribute('data-state', 'lazy')
})

test('expanding the root materializes its children', async ({ page }) => {
    await page.goto('/test/lazy-children')

    await page.getByTestId('expand-root').click()

    // Opening the node reads each child value exactly once.
    await expect(page.getByTestId('read-count')).toHaveText('1,000')
    await expect(page.getByTestId('status')).toHaveAttribute('data-state', 'open')
})
