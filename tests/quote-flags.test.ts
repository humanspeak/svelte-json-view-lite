import { expect, test } from '@playwright/test'
import { rootTree } from './helpers.js'

/**
 * Quote-flag matrix — mirrors the DOM half of
 * react-json-view-lite/src/DataRenderer.test.tsx:620-750. Each flag
 * (quotesForFieldNames, noQuotesForStringValues, stringifyStringValues)
 * gets its own playground route, so each test just navigates and
 * asserts the visible punctuation.
 */

test('quotesForFieldNames wraps every field label in double quotes', async ({ page }) => {
    await page.goto('/test/field-names-with-quotes')
    const tree = rootTree(page)
    // Labels include the trailing colon — `"string property":` is present.
    await expect(tree.getByText('"string property":').first()).toBeVisible()
    await expect(tree.getByText('"bigint property":').first()).toBeVisible()
})

test('noQuotesForStringValues drops the surrounding double quotes on string values', async ({
    page
}) => {
    await page.goto('/test/strings-without-quotes')
    const tree = rootTree(page)
    // The raw string is visible without its wrapping `"..."`.
    await expect(tree.getByText('my string', { exact: true }).first()).toBeVisible()
    // And the quoted form is NOT present.
    await expect(tree.getByText('"my string"', { exact: true })).toHaveCount(0)
})

test('stringifyStringValues escapes control characters visibly', async ({ page }) => {
    await page.goto('/test/stringify-string-values')
    const tree = rootTree(page)
    // The escaped payload renders as a visible string containing `\n`,
    // `\t`, `\r`, `\"` — not collapsed whitespace.
    const rendered = await tree.locator('span[class*="value-string"]').first().textContent()
    expect(rendered).toContain('\\n')
    expect(rendered).toContain('\\t')
    expect(rendered).toContain('\\r')
    expect(rendered).toContain('\\"')
})
