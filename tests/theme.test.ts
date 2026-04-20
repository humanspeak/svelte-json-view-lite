import { expect, test } from '@playwright/test'
import { getComputedColor, rootTree } from './helpers.js'

/**
 * Theme switching — @desktop-only because computed-style assertions on
 * mobile-device emulators are noisy. /test/basic exposes a
 * data-testid="theme-toggle" button that flips `defaultStyles ↔
 * darkStyles`. We assert the computed background + string colour
 * actually change, not just the classname.
 */

test.describe('@desktop-only theme switching', () => {
    test('toggling the theme changes the container background and string color', async ({
        page
    }) => {
        await page.goto('/test/basic')
        const tree = rootTree(page)
        const stringValue = tree.locator('span[class*="value-string"]').first()

        const lightBackground = await getComputedColor(tree, 'background-color')
        const lightStringColor = await getComputedColor(stringValue)

        await page.getByTestId('theme-toggle').click()

        const darkBackground = await getComputedColor(tree, 'background-color')
        const darkStringColor = await getComputedColor(stringValue)

        expect(darkBackground).not.toBe(lightBackground)
        expect(darkStringColor).not.toBe(lightStringColor)
        // Dark theme's background is the `rgb(0, 43, 54)` tomography;
        // light is `#eee`. Easy, unambiguous comparison.
        expect(lightBackground).toContain('238, 238, 238')
        expect(darkBackground).toContain('0, 43, 54')
    })
})
