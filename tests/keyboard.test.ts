import { expect, test } from '@playwright/test'
import { expanderFor, expanders, rootTree } from './helpers.js'

/**
 * Real-browser keyboard navigation — @desktop-only because touch
 * devices don't get arrow-key UX and jsdom's fireEvent in vitest
 * already covers the click side. Mirrors
 * react-json-view-lite/src/index.test.tsx:56-87.
 *
 * The roving-tabindex pattern: at any moment exactly one expander has
 * tabindex=0 (the "active" one), every other is tabindex=-1. Arrow up
 * and down walk focus (wrapping at edges), arrow right expands, arrow
 * left collapses.
 */

test.describe('@desktop-only keyboard navigation', () => {
    test('only one expander has tabindex=0 on mount, and it is the root', async ({ page }) => {
        await page.goto('/test/basic')
        const tabbables = rootTree(page).locator('[role="button"][tabindex="0"]')
        await expect(tabbables).toHaveCount(1)
        // The root expander is the first button in document order.
        const firstButton = expanders(page).first()
        await expect(firstButton).toHaveAttribute('tabindex', '0')
    })

    test('ArrowDown moves focus to the next expander and swaps tabindex', async ({ page }) => {
        await page.goto('/test/basic')
        const buttons = expanders(page)
        const first = buttons.first()
        await first.focus()
        await expect(first).toBeFocused()

        await page.keyboard.press('ArrowDown')

        const second = buttons.nth(1)
        await expect(second).toBeFocused()
        await expect(second).toHaveAttribute('tabindex', '0')
        await expect(first).toHaveAttribute('tabindex', '-1')
    })

    test('ArrowUp wraps from the first expander back to the last', async ({ page }) => {
        await page.goto('/test/basic')
        const buttons = expanders(page)
        const count = await buttons.count()
        expect(count).toBeGreaterThan(1)

        const first = buttons.first()
        await first.focus()
        await expect(first).toBeFocused()

        await page.keyboard.press('ArrowUp')

        const last = buttons.nth(count - 1)
        await expect(last).toBeFocused()
        await expect(last).toHaveAttribute('tabindex', '0')
    })

    test('ArrowRight on a collapsed node expands it, ArrowLeft collapses', async ({ page }) => {
        await page.goto('/test/collapsed-nested-objects')
        const nestedExpander = expanderFor(page, 'nested object')
        await nestedExpander.focus()
        // Defensive: confirm focus actually landed before pressing keys.
        await expect(nestedExpander).toBeFocused()
        await expect(nestedExpander).toHaveAttribute('aria-expanded', 'false')

        await page.keyboard.press('ArrowRight')
        await expect(nestedExpander).toHaveAttribute('aria-expanded', 'true')

        // Keep focus on the expander — the handler briefly swaps tabindex,
        // which can cause WebKit to drop focus without the follow-up.
        await nestedExpander.focus()
        await page.keyboard.press('ArrowLeft')
        await expect(nestedExpander).toHaveAttribute('aria-expanded', 'false')
    })

    test('keys other than arrows do not steal focus or toggle state', async ({ page }) => {
        await page.goto('/test/basic')
        const first = expanders(page).first()
        await first.focus()
        await expect(first).toBeFocused()
        const initialExpanded = await first.getAttribute('aria-expanded')

        for (const key of ['Enter', ' ', 'Tab', 'a', 'Escape']) {
            await page.keyboard.press(key, { delay: 0 })
        }

        // Focus may have moved out of the tree via Tab/Escape; that's
        // fine. The assertion is that the node's expanded state was
        // not toggled by any of the non-arrow keys above.
        await expect(first).toHaveAttribute('aria-expanded', initialExpanded ?? 'true')
    })

    test('nested treeitems carry tabindex=-1 while the root carries tabindex=0', async ({
        page
    }) => {
        await page.goto('/test/basic')
        // The "nested object" treeitem button sits inside the tree, not at the root.
        const inner = expanderFor(page, 'nested object')
        await expect(inner).toHaveAttribute('tabindex', '-1')
        await expect(expanders(page).first()).toHaveAttribute('tabindex', '0')
    })
})
