import { afterEach, describe, expect, it, vi } from 'vitest'
import { createExpanderNavigation } from './expanderNavigation.js'

function button(label: string) {
    const el = document.createElement('button')
    el.textContent = label
    el.tabIndex = -1
    return el
}

function appendButtons(count: number) {
    const container = document.createElement('div')
    const buttons = Array.from({ length: count }, (_unused, index) => button(`button ${index}`))
    container.append(...buttons)
    document.body.replaceChildren(container)
    return buttons
}

afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
})

describe('createExpanderNavigation', () => {
    it('registers document-order appends without scanning the existing list', () => {
        const navigation = createExpanderNavigation()
        const buttons = appendButtons(32)
        const compareSpy = vi.spyOn(Node.prototype, 'compareDocumentPosition')

        buttons.forEach((el) => navigation.register(el))

        expect(
            compareSpy.mock.calls.length,
            `register() made ${compareSpy.mock.calls.length} compareDocumentPosition calls while appending ${buttons.length} buttons in document order. Issue #25 needs append-order mount to stay O(N), not O(N²).`
        ).toBeLessThanOrEqual(buttons.length - 1)
    })

    it('moves forward, backward, and wraps through registered buttons', () => {
        const navigation = createExpanderNavigation()
        const [first, second, third] = appendButtons(3)

        navigation.register(first)
        navigation.register(second)
        navigation.register(third)

        navigation.activate(first)
        navigation.move(first, 1)
        expect(document.activeElement).toBe(second)
        expect(first.tabIndex).toBe(-1)
        expect(second.tabIndex).toBe(0)

        navigation.move(second, -1)
        expect(document.activeElement).toBe(first)
        expect(first.tabIndex).toBe(0)
        expect(second.tabIndex).toBe(-1)

        navigation.move(first, -1)
        expect(document.activeElement).toBe(third)
        expect(first.tabIndex).toBe(-1)
        expect(third.tabIndex).toBe(0)
    })

    it('keeps document order when a button registers before existing buttons', () => {
        const navigation = createExpanderNavigation()
        const [first, second, third] = appendButtons(3)

        navigation.register(second)
        navigation.register(third)
        navigation.register(first)

        navigation.activate(first)
        navigation.move(first, 1)
        expect(document.activeElement).toBe(second)
    })

    it('falls back to a neighbor when the active button unregisters', () => {
        const navigation = createExpanderNavigation()
        const [first, second, third] = appendButtons(3)

        navigation.register(first)
        const unregisterSecond = navigation.register(second)
        navigation.register(third)

        navigation.activate(second)
        unregisterSecond()

        expect(third.tabIndex).toBe(0)

        navigation.move(third, -1)
        expect(document.activeElement).toBe(first)
        expect(first.tabIndex).toBe(0)
        expect(third.tabIndex).toBe(-1)
    })
})
