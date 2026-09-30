import { expect, test, type Locator } from '@playwright/test'

async function expectBalancedSummary(row: Locator) {
    await expect(row.locator('[data-summary]')).toHaveCSS('width', '16px')
    const spacing = await row.evaluate((element) => {
        const [opening, closing] = element.querySelectorAll(':scope > .test-punctuation')
        const indicator = closing.querySelector<HTMLElement>('[data-summary]')!
        const wrapper = indicator.parentElement!
        const closingText = [...closing.childNodes].find(
            (node) => node.nodeType === Node.TEXT_NODE && /[}\]]/.test(node.textContent ?? '')
        )!
        const textBounds = (node: Node) => {
            const range = document.createRange()
            range.selectNodeContents(node)
            return range.getBoundingClientRect()
        }
        const open = textBounds(opening)
        const close = textBounds(closingText)
        const marker = indicator.getBoundingClientRect()
        const glyph = textBounds(indicator)
        return {
            punctuationDisplay: getComputedStyle(closing).display,
            // Confirm the whitespace really exists; layout must suppress it.
            whitespaceNodes: [...wrapper.childNodes].filter(
                (node) => node.nodeType === Node.TEXT_NODE && /^\s+$/.test(node.textContent ?? '')
            ).length,
            left: marker.left - open.right,
            right: close.left - marker.right,
            glyphLeft: glyph.left - open.right,
            glyphRight: close.left - glyph.right,
            verticalOffset: marker.top - open.top,
            closingText: closingText.textContent
        }
    })
    expect(spacing.punctuationDisplay).toBe('inline')
    expect(spacing.whitespaceNodes).toBeGreaterThan(0)
    expect(spacing.left).toBeCloseTo(4, 0)
    expect(spacing.right).toBeCloseTo(4, 0)
    expect(Math.abs(spacing.glyphLeft - spacing.glyphRight)).toBeLessThan(1)
    expect(Math.abs(spacing.verticalOffset)).toBeLessThan(2)
    expect(spacing.closingText).toMatch(/^[}\]]$/)
}

async function expectCaretAngle(caret: Locator, angle: number) {
    await expect
        .poll(() =>
            caret.evaluate((element) => {
                const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
                return Math.round((Math.atan2(matrix.b, matrix.a) * 180) / Math.PI)
            })
        )
        .toBe(angle)
}

test.describe('@desktop-only structural snippet layout and focus', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/test/structural-snippets')
    })

    test('contains consumer whitespace with default and custom inline punctuation', async ({
        page
    }) => {
        for (const theme of ['default', 'custom']) {
            const tree = page.getByRole('region', { name: `${theme} punctuation` })
            for (const field of ['object', 'array']) {
                await expectBalancedSummary(tree.locator(`[data-field="${field}"]`))
            }
        }
    })

    test('keeps summary spacing balanced after expansion and animation reversals', async ({
        page
    }) => {
        for (const theme of ['default', 'custom']) {
            const tree = page.getByRole('region', { name: `${theme} punctuation` })
            for (const field of ['object', 'array']) {
                const row = tree.locator(`[data-field="${field}"]`)
                const button = row.getByRole('button').first()
                const indicator = row.locator('[data-summary]').first()
                await button.click()
                await expect(row).toHaveAttribute('aria-expanded', 'true')
                await expect(indicator).toHaveCSS('width', '0px')
                await button.press('ArrowLeft')
                await button.press('ArrowRight')
                await button.press('ArrowLeft')
                await expect(row).toHaveAttribute('aria-expanded', 'false')
                await expect(indicator).toHaveCount(1)
                await expectBalancedSummary(row)
            }
        }
    })

    test('retains native mouse focus without showing keyboard caret tilt', async ({ page }) => {
        const row = page
            .getByRole('region', { name: 'default punctuation' })
            .locator('[data-field="object"]')
        const button = row.getByRole('button')
        const caret = button.locator('[data-caret]')
        await row.locator('[data-summary]').click()
        await expect(row).toHaveAttribute('aria-expanded', 'false')
        await button.click()
        await page.getByRole('heading').hover()
        await expect(button).toBeFocused()
        await expect(caret).toHaveAttribute('data-focused', 'true')
        await expect(caret).toHaveAttribute('data-focus-visible', 'false')
        await expectCaretAngle(caret, 45)
        await button.press('ArrowLeft')
        await expect(button).toBeFocused()
        await expect(caret).toHaveAttribute('data-focus-visible', 'true')
        await expectCaretAngle(caret, -20)
    })

    test('exposes keyboard focus through Tab, arrow navigation, and blur', async ({ page }) => {
        const tree = page.getByRole('region', { name: 'default punctuation' })
        const object = tree.locator('[data-field="object"] > [role="button"]')
        const array = tree.locator('[data-field="array"] > [role="button"]')
        const before = page.getByRole('button', { name: 'Before the trees' })
        await before.click()
        await before.focus()
        await page.keyboard.press('Tab')
        await expect(object).toBeFocused()
        await expect(object.locator('[data-caret]')).toHaveAttribute('data-focus-visible', 'true')
        await expectCaretAngle(object.locator('[data-caret]'), -20)
        await page.keyboard.press('ArrowRight')
        await expect(object).toHaveAttribute('aria-expanded', 'true')
        await expectCaretAngle(object.locator('[data-caret]'), 20)
        await page.keyboard.press('ArrowDown')
        await expect(array).toBeFocused()
        await expect(array.locator('[data-caret]')).toHaveAttribute('data-focus-visible', 'true')
        await expect(object.locator('[data-caret]')).toHaveAttribute('data-focused', 'false')
        await expect(object.locator('[data-caret]')).toHaveAttribute('data-focus-visible', 'false')
        await page.keyboard.press('ArrowUp')
        await expect(object).toBeFocused()
        await expect(object.locator('[data-caret]')).toHaveAttribute('data-focus-visible', 'true')
    })

    test('clears keyboard-only tilt when the already-focused chevron is clicked', async ({
        page
    }) => {
        const row = page
            .getByRole('region', { name: 'default punctuation' })
            .locator('[data-field="object"]')
        const button = row.getByRole('button')
        const caret = button.locator('[data-caret]')
        await button.click()
        await button.press('ArrowLeft')
        await expect(caret).toHaveAttribute('data-focus-visible', 'true')
        await expectCaretAngle(caret, -20)
        await button.click()
        await page.getByRole('heading').hover()
        await expect(button).toBeFocused()
        await expect(caret).toHaveAttribute('data-focused', 'true')
        await expect(caret).toHaveAttribute('data-focus-visible', 'false')
        await expectCaretAngle(caret, 45)
    })
})
