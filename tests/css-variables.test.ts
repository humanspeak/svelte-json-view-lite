import { expect, test } from '@playwright/test'
import { getComputedColor } from './helpers.js'

/**
 * CSS custom property overrides — @desktop-only because this is a
 * pixel-level computed-style assertion. /test/css-variables renders
 * the same JSON twice, once inside `.vapor` (overriding `defaultStyles`
 * via `--sjv-*` tokens) and once inside `.solarized` (overriding
 * `darkStyles`). Both panels share the CSS-module classes from the
 * library; only the declared custom properties differ. A green test
 * here proves the `var(--sjv-*)` plumbing in styles.module.css
 * resolves through scoped overrides.
 *
 * No React analogue — the CSS-var layer is a Svelte-port addition
 * (commit 11d6364).
 */

test.describe('@desktop-only CSS variable overrides', () => {
    test('the two themed panels resolve different string-value colors', async ({ page }) => {
        await page.goto('/test/css-variables')

        const vaporString = page.locator('.vapor [role="tree"] span[class*="value-string"]').first()
        const solaString = page
            .locator('.solarized [role="tree"] span[class*="value-string"]')
            .first()

        const vaporColor = await getComputedColor(vaporString)
        const solaColor = await getComputedColor(solaString)

        // --sjv-string is `#01cdfe` (vapor) vs `#859900` (solarized).
        expect(vaporColor).toContain('1, 205, 254')
        expect(solaColor).toContain('133, 153, 0')
        expect(vaporColor).not.toBe(solaColor)
    })

    test('the two themed panels resolve different container backgrounds', async ({ page }) => {
        await page.goto('/test/css-variables')
        const vaporTree = page.locator('.vapor [role="tree"]')
        const solaTree = page.locator('.solarized [role="tree"]')

        const vaporBg = await getComputedColor(vaporTree, 'background-color')
        const solaBg = await getComputedColor(solaTree, 'background-color')

        // --sjv-background: vapor `#2b1055`, solarized `#001e26`.
        expect(vaporBg).toContain('43, 16, 85')
        expect(solaBg).toContain('0, 30, 38')
        expect(vaporBg).not.toBe(solaBg)
    })
})
