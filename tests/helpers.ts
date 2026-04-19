import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Shared locator and assertion helpers for the e2e suite. Page-object
 * style: every suite file imports from here so the DOM-shape knowledge
 * (role=tree / treeitem, aria-label conventions, clickable-label class)
 * lives in one place.
 */

export function rootTree(page: Page): Locator {
    return page.getByRole('tree', { name: 'JSON view' })
}

export function treeitems(page: Page): Locator {
    return rootTree(page).getByRole('treeitem')
}

export function expanders(page: Page): Locator {
    return rootTree(page).getByRole('button')
}

/**
 * The expander button whose `aria-label` is "collapse JSON" (when open)
 * or "expand JSON" (when closed). Scoped to the treeitem that has the
 * supplied field label.
 */
export function expanderFor(page: Page, fieldLabel: string): Locator {
    return treeItemFor(page, fieldLabel).getByRole('button').first()
}

/**
 * The label span for a field — matches either `.label*` or
 * `.clickable-label*` hashed CSS-module class names. Scoped to the tree
 * root so we don't pick up descendants of a closed ancestor.
 */
export function labelFor(page: Page, fieldLabel: string): Locator {
    return rootTree(page)
        .locator(`span[class*="label"]`, { hasText: new RegExp(`^${escapeRegex(fieldLabel)}:$`) })
        .first()
}

/**
 * The `role=treeitem` containing a given field label (exact-match on the
 * displayed `field:` text). Matches scrolled-in-view rows too.
 */
export function treeItemFor(page: Page, fieldLabel: string): Locator {
    return rootTree(page)
        .getByRole('treeitem')
        .filter({
            has: page.locator(`span[class*="label"]`, {
                hasText: new RegExp(`^${escapeRegex(fieldLabel)}:$`)
            })
        })
        .first()
}

export async function expectCollapsed(locator: Locator): Promise<void> {
    await expect(locator).toHaveAttribute('aria-expanded', 'false')
}

export async function expectExpanded(locator: Locator): Promise<void> {
    await expect(locator).toHaveAttribute('aria-expanded', 'true')
}

export async function focusedAriaLabel(page: Page): Promise<string | null> {
    return page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? null)
}

export async function focusedTabIndex(page: Page): Promise<number | null> {
    return page.evaluate(() => {
        const el = document.activeElement
        if (!el) return null
        const raw = el.getAttribute('tabindex')
        return raw === null ? null : Number(raw)
    })
}

/**
 * Reads the resolved `color` (or any named property) from the first
 * matching element. Useful for theme / CSS-variable assertions where the
 * declared `--sjv-*` token matters less than the pixel color the browser
 * ends up painting.
 */
export async function getComputedColor(
    locator: Locator,
    property: string = 'color'
): Promise<string> {
    return locator.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), property)
}

function escapeRegex(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
