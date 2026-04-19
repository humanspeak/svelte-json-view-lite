import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    allExpanded,
    collapseAllNested,
    darkStyles,
    defaultStyles,
    JsonView,
    type StyleProps
} from './index.js'

beforeEach(() => {
    // Keyboard-focus tests use real timers because `fireEvent.keyDown` inside
    // the ExpandableObject handler synchronously calls .focus(); fake timers
    // don't interfere, but we also don't need RAF shimming here.
    vi.useRealTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe('JsonView basic rendering', () => {
    it('renders a simple object with label and value', () => {
        render(JsonView, { props: { data: { test: true }, style: defaultStyles } })
        expect(screen.getByText(/test/)).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
    })

    it('renders with no style prop (uses defaults)', () => {
        render(JsonView, { props: { data: { test: true } } })
        expect(screen.getByText(/test/)).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
    })

    it('accepts a partial style object and fills in the rest from defaults', () => {
        render(JsonView, {
            props: {
                data: { test: true },
                style: {} as Partial<StyleProps>
            }
        })
        expect(screen.getByText(/test/)).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
    })

    it('applies the dark theme container class when darkStyles is passed', () => {
        const { container } = render(JsonView, {
            props: { data: { test: 1 }, style: darkStyles }
        })
        const root = container.querySelector('[role="tree"]') as HTMLElement | null
        expect(root).not.toBeNull()
        expect(root?.className).toContain('container-dark')
    })

    it('renders every primitive type with its theme class', () => {
        const data = {
            str: 'hi',
            num: 42,
            bool: true,
            nothing: null,
            undef: undefined,
            big: 9007199254740993n,
            when: new Date('2025-06-15T00:00:00Z')
        }
        render(JsonView, { props: { data } })
        expect(screen.getByText('"hi"')).toBeInTheDocument()
        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
        expect(screen.getByText('null')).toBeInTheDocument()
        expect(screen.getByText('undefined')).toBeInTheDocument()
        expect(screen.getByText('9007199254740993n')).toBeInTheDocument()
        expect(screen.getByText('2025-06-15T00:00:00.000Z')).toBeInTheDocument()
    })

    it('honors stringifyStringValues to escape special characters', () => {
        render(JsonView, {
            props: {
                data: { msg: 'a\nb' },
                style: { ...defaultStyles, stringifyStringValues: true }
            }
        })
        // With JSON.stringify, the newline becomes \n (escaped backslash + n).
        expect(screen.getByText('"a\\nb"')).toBeInTheDocument()
    })

    it('strips quotes when noQuotesForStringValues is true', () => {
        render(JsonView, {
            props: {
                data: { msg: 'hello' },
                style: { ...defaultStyles, noQuotesForStringValues: true }
            }
        })
        // Without quotes the string renders as its own text node.
        expect(screen.getByText('hello')).toBeInTheDocument()
    })

    it('renders empty objects and arrays with no expander button', () => {
        const { container } = render(JsonView, {
            props: { data: { empty: {}, list: [] } }
        })
        const buttons = container.querySelectorAll('[role="button"]')
        // Root is an object -> 1 button. The two empty children have no button.
        expect(buttons.length).toBe(1)
    })
})

describe('JsonView — compactTopLevel', () => {
    it('spreads object entries at the root instead of nesting them', () => {
        const { container } = render(JsonView, {
            props: { data: { test: true }, compactTopLevel: true }
        })
        expect(screen.getByText(/test/)).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
        // No expander buttons exist because each top-level key is rendered
        // as its own primitive / inline expandable row, not as a nested block.
        expect(container.querySelectorAll('[role="button"]').length).toBe(0)
    })
})

describe('JsonView — shouldExpandNode strategies', () => {
    it('invokes a custom shouldExpandNode exactly once per node during the initial render', () => {
        let invoked = 0
        const shouldExpandNode = () => {
            invoked += 1
            return true
        }
        render(JsonView, { props: { data: { test: true }, shouldExpandNode } })
        expect(screen.getByText(/test/)).toBeInTheDocument()
        expect(screen.getByText('true')).toBeInTheDocument()
        // One expandable node (root object) -> one invocation.
        expect(invoked).toBe(1)
    })

    it('collapseAllNested collapses every node below the root', () => {
        const { container } = render(JsonView, {
            props: {
                data: { root: { nested: 1 } },
                shouldExpandNode: collapseAllNested
            }
        })
        // The outermost object is expanded (level 0 passes < 1).
        const expanded = container.querySelectorAll('[aria-expanded="true"]')
        const collapsed = container.querySelectorAll('[aria-expanded="false"]')
        // Root span + root div both carry aria-expanded="true" so expanded > 0.
        expect(expanded.length).toBeGreaterThan(0)
        // The nested object must be collapsed.
        expect(collapsed.length).toBeGreaterThan(0)
    })

    it('allExpanded leaves every branch open', () => {
        const { container } = render(JsonView, {
            props: {
                data: { root: { nested: { deep: 1 } } },
                shouldExpandNode: allExpanded
            }
        })
        const collapsed = container.querySelectorAll('[aria-expanded="false"]')
        expect(collapsed.length).toBe(0)
    })
})

describe('JsonView — keyboard navigation', () => {
    it('moves focus across sibling expanders with ArrowDown and ArrowUp, swapping tabindex', async () => {
        const { container } = render(JsonView, {
            props: { data: { test: [1, 2, 3], test2: [4, 5, 6] } }
        })

        // One tabindex=0 button (the roving anchor).
        expect(container.querySelectorAll('[tabindex="0"]').length).toBe(1)

        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        expect(buttons.length).toBe(3)
        expect(buttons[0].tabIndex).toBe(0)
        expect(buttons[1].tabIndex).toBe(-1)
        expect(buttons[2].tabIndex).toBe(-1)

        buttons[0].focus()
        expect(document.activeElement).toBe(buttons[0])

        await fireEvent.keyDown(buttons[0], { key: 'ArrowDown', code: 'ArrowDown' })
        expect(document.activeElement).toBe(buttons[1])
        expect(buttons[0].tabIndex).toBe(-1)
        expect(buttons[1].tabIndex).toBe(0)
        expect(buttons[2].tabIndex).toBe(-1)

        await fireEvent.keyDown(buttons[1], { key: 'ArrowUp', code: 'ArrowUp' })
        expect(document.activeElement).toBe(buttons[0])
        expect(buttons[0].tabIndex).toBe(0)
        expect(buttons[1].tabIndex).toBe(-1)
        expect(buttons[2].tabIndex).toBe(-1)
    })

    it('wraps around when ArrowDown passes the last sibling', async () => {
        const { container } = render(JsonView, {
            props: { data: { a: [1], b: [2] } }
        })
        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        expect(buttons.length).toBe(3)
        buttons[2].focus()
        buttons[2].tabIndex = 0
        // Make only index 2 the active roving tabindex.
        buttons[0].tabIndex = -1
        buttons[1].tabIndex = -1

        await fireEvent.keyDown(buttons[2], { key: 'ArrowDown', code: 'ArrowDown' })
        expect(document.activeElement).toBe(buttons[0])
    })
})

describe('JsonView — expand/collapse via click', () => {
    it('toggles aria-expanded on the expander button when clicked', async () => {
        const { container } = render(JsonView, {
            props: { data: { nested: { inner: 1 } } }
        })
        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        // There is one expander for the root and one for `nested` (both expanded by default).
        expect(buttons.length).toBe(2)
        const nestedButton = buttons[1]
        expect(nestedButton.getAttribute('aria-expanded')).toBe('true')

        await fireEvent.click(nestedButton)
        expect(nestedButton.getAttribute('aria-expanded')).toBe('false')

        await fireEvent.click(nestedButton)
        expect(nestedButton.getAttribute('aria-expanded')).toBe('true')
    })
})

describe('JsonView — beforeExpandChange', () => {
    it('vetoes the collapse when beforeExpandChange returns false', async () => {
        let lastEvent: unknown = null
        const { container } = render(JsonView, {
            props: {
                data: { nested: { inner: 1 } },
                beforeExpandChange: (event) => {
                    lastEvent = event
                    return false
                }
            }
        })
        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        const nestedButton = buttons[1]
        await fireEvent.click(nestedButton)
        // The veto prevents the state change; aria-expanded remains true.
        expect(nestedButton.getAttribute('aria-expanded')).toBe('true')
        expect(lastEvent).toMatchObject({ newExpandValue: false })
    })

    it('allows the collapse when beforeExpandChange returns true', async () => {
        const { container } = render(JsonView, {
            props: {
                data: { nested: { inner: 1 } },
                beforeExpandChange: () => true
            }
        })
        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        const nestedButton = buttons[1]
        await fireEvent.click(nestedButton)
        expect(nestedButton.getAttribute('aria-expanded')).toBe('false')
    })
})

describe('JsonView — clickToExpandNode', () => {
    it('toggles expansion when the clickable label is clicked', async () => {
        const { container } = render(JsonView, {
            props: { data: { nested: { inner: 1 } }, clickToExpandNode: true }
        })
        const label = container.querySelector(`[class*="clickable-label"]`) as HTMLElement | null
        expect(label).not.toBeNull()
        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        const nestedButton = buttons[1]
        expect(nestedButton.getAttribute('aria-expanded')).toBe('true')
        await fireEvent.click(label as HTMLElement)
        expect(nestedButton.getAttribute('aria-expanded')).toBe('false')
    })
})

describe('JsonView — ariaLables typo fallback', () => {
    it('honors the legacy `ariaLables` key and warns once', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        render(JsonView, {
            props: {
                data: { a: 1 },
                style: {
                    ...defaultStyles,
                    ariaLabels: undefined as unknown as StyleProps['ariaLabels'],
                    ariaLables: { collapseJson: 'close', expandJson: 'open' }
                } as unknown as StyleProps
            }
        })
        // Root button is expanded by default — label should be the collapse action.
        const button = screen.getByRole('button')
        expect(button.getAttribute('aria-label')).toBe('close')
        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
    })
})
