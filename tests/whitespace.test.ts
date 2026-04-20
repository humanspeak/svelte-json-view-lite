import { expect, test } from '@playwright/test'

/**
 * Regression test for the flush-comma fix (commit e000b60).
 *
 * Svelte preserves whitespace between adjacent elements in component
 * templates; under the JsonView root's `white-space: pre-wrap`, that
 * whitespace renders as visible spaces — e.g. `"my string" ,` instead
 * of `"my string",`. The fix collapses each row's inline sequence onto
 * a single prettier-ignored line so no text whitespace reaches the DOM.
 *
 * This test walks text nodes directly and asserts there's no whitespace
 * node sitting between a value span and its trailing comma. It's
 * deliberately not an `innerText` match (innerText collapses whitespace
 * for presentation) — we inspect the actual childNodes tree.
 */

test('no whitespace text node between value and trailing comma', async ({ page }) => {
    await page.goto('/test/basic')

    const offending = await page.evaluate(() => {
        const tree = document.querySelector('[role="tree"]')
        if (!tree) return { reason: 'no tree' }

        // Walk every span[class*="value-"] that isn't the last child of
        // its parent and check the following sibling is either the next
        // element or a text-node-free comment sequence.
        const valueSpans = Array.from(
            tree.querySelectorAll<HTMLSpanElement>('span[class*="value-"]')
        )
        const offenders: string[] = []

        for (const span of valueSpans) {
            const parent = span.parentElement
            if (!parent) continue
            // Walk siblings until the next element; if we passed through a
            // non-empty text node on the way, that text is leaking into the
            // rendered row (which the flush-comma fix is supposed to prevent).
            let seenNonEmptyText = false
            let node: Node | null = span.nextSibling
            while (node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const txt = node.textContent ?? ''
                    if (txt.length > 0) seenNonEmptyText = true
                    // Keep scanning — we only flag the leak at the next element.
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    if (seenNonEmptyText) {
                        const el = node as HTMLElement
                        offenders.push(
                            `before <${el.tagName.toLowerCase()} class="${el.className}">: "${span.textContent}"`
                        )
                    }
                    break
                }
                node = node.nextSibling
            }
        }

        return { offenders, count: valueSpans.length }
    })

    expect(offending, 'unexpected whitespace between value and sibling').toMatchObject({
        offenders: []
    })
})

test('no whitespace text node between close bracket span and trailing comma', async ({ page }) => {
    await page.goto('/test/basic')

    const leakage = await page.evaluate(() => {
        const tree = document.querySelector('[role="tree"]')
        if (!tree) return null

        // The close-bracket + trailing comma were merged into ONE span in
        // the Svelte port. If the port regresses back to two spans with
        // whitespace between them, the parent's direct childNodes will
        // contain a text node with just spaces between two `span[class*="punctuation"]`.
        const treeitems = tree.querySelectorAll('[role="treeitem"][aria-expanded="true"]')
        for (const item of treeitems) {
            const kids = Array.from(item.childNodes)
            for (let i = 0; i < kids.length - 1; i++) {
                const here = kids[i]
                const next = kids[i + 1]
                if (
                    here.nodeType === Node.ELEMENT_NODE &&
                    next.nodeType === Node.TEXT_NODE &&
                    (next.textContent ?? '').trim() === '' &&
                    (next.textContent ?? '').length > 0 &&
                    // Require a following ELEMENT_NODE to confirm the text sits
                    // *between* two elements — trailing formatting whitespace
                    // at the end of a row shouldn't trigger the leak check.
                    i + 2 < kids.length &&
                    kids[i + 2].nodeType === Node.ELEMENT_NODE
                ) {
                    return `whitespace leak in ${(item as HTMLElement).outerHTML.slice(0, 80)}`
                }
            }
        }
        return null
    })

    expect(leakage).toBeNull()
})
