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

    it('starts keyboard navigation at the first expandable top-level entry', async () => {
        const { container } = render(JsonView, {
            props: {
                data: {
                    first: { nested: { deep: [1] } },
                    second: [2]
                },
                compactTopLevel: true
            }
        })

        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        const tabIndexes = buttons.map((button) => button.tabIndex)
        const activeIndex = tabIndexes.findIndex((tabIndex) => tabIndex === 0)
        expect(buttons.length).toBe(4)
        expect(container.querySelectorAll('[tabindex="0"]').length).toBe(1)

        expect(
            activeIndex,
            `compactTopLevel registered a nested expander before the first top-level entry settled: active expander index ${activeIndex}, tabIndexes [${tabIndexes.join(', ')}]. The first top-level expander should start at tabindex=0.`
        ).toBe(0)
        expect(buttons[1].tabIndex).toBe(-1)
        expect(buttons[2].tabIndex).toBe(-1)
        expect(buttons[3].tabIndex).toBe(-1)

        buttons[0].focus()
        await fireEvent.keyDown(buttons[0], { key: 'ArrowDown', code: 'ArrowDown' })

        expect(document.activeElement).toBe(buttons[1])
        expect(buttons[0].tabIndex).toBe(-1)
        expect(buttons[1].tabIndex).toBe(0)
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
    function manyExpandableSiblings(size: number) {
        return Object.fromEntries(
            Array.from({ length: size }, (_unused, index) => [`branch_${index}`, [index]])
        )
    }

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

    it('does not run a full-tree role=button query on every vertical keypress', async () => {
        const { container } = render(JsonView, {
            props: { data: manyExpandableSiblings(120) }
        })

        const tree = container.querySelector<HTMLElement>('[role="tree"]')
        expect(tree).not.toBeNull()
        const root = tree as HTMLElement
        const buttons = Array.from(root.querySelectorAll<HTMLElement>('[role="button"]'))
        expect(buttons.length).toBe(121)

        const originalQuerySelectorAll = root.querySelectorAll.bind(root)
        const querySelectorAllSpy = vi.fn((selector: string) => originalQuerySelectorAll(selector))
        Object.defineProperty(root, 'querySelectorAll', {
            configurable: true,
            value: querySelectorAllSpy
        })

        buttons[0].focus()
        expect(document.activeElement).toBe(buttons[0])

        for (let i = 0; i < 4; i++) {
            await fireEvent.keyDown(document.activeElement as HTMLElement, {
                key: 'ArrowDown',
                code: 'ArrowDown'
            })
        }

        const buttonSweepCalls = querySelectorAllSpy.mock.calls.filter(([selector]) => {
            const value = String(selector)
            return value.includes('role=button') || value.includes('role="button"')
        }).length

        expect(
            buttonSweepCalls,
            `ArrowDown made ${buttonSweepCalls} full-tree button queries for 4 keypresses across ${buttons.length} expanders. Issue #25 tracks moving the O(N) DOM sweep out of the keypress path.`
        ).toBeLessThanOrEqual(1)
    })

    it('does not linearly inspect every expander tabindex to find the active item', async () => {
        const { container } = render(JsonView, {
            props: { data: manyExpandableSiblings(80) }
        })

        const buttons = Array.from(container.querySelectorAll<HTMLElement>('[role="button"]'))
        expect(buttons.length).toBe(81)
        const lastButton = buttons[buttons.length - 1]
        let tabIndexReads = 0

        buttons.forEach((button, index) => {
            let currentTabIndex = button === lastButton ? 0 : -1
            button.tabIndex = currentTabIndex
            Object.defineProperty(button, 'tabIndex', {
                configurable: true,
                get() {
                    tabIndexReads++
                    return currentTabIndex
                },
                set(nextTabIndex: number) {
                    currentTabIndex = nextTabIndex
                }
            })
            expect(button.tabIndex).toBe(index === buttons.length - 1 ? 0 : -1)
        })

        lastButton.focus()
        expect(document.activeElement).toBe(lastButton)

        tabIndexReads = 0
        await fireEvent.keyDown(lastButton, { key: 'ArrowDown', code: 'ArrowDown' })

        expect(
            tabIndexReads,
            `ArrowDown read ${tabIndexReads} tabindex values to move from the last expander in an ${buttons.length}-button tree. Issue #25 expects navigation to use direct state/links instead of scanning every button.`
        ).toBeLessThanOrEqual(2)
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

describe('JsonView — hideCommas', () => {
    const punctuation = (container: HTMLElement) =>
        [...container.querySelectorAll('.test-punctuation')].map((element) => element.textContent)

    it('defaults to false in both built-in themes', () => {
        expect(defaultStyles.hideCommas).toBe(false)
        expect(darkStyles.hideCommas).toBe(false)
    })

    it.each([
        [undefined, false],
        [undefined, true],
        [false, false],
        [false, true]
    ])('preserves separators when hideCommas is %s (expanded: %s)', (hideCommas, expanded) => {
        const { container } = render(JsonView, {
            data: {
                number: 1,
                object: { child: 2 },
                array: [3, 4],
                emptyObject: {},
                emptyArray: [],
                last: false
            },
            style: {
                punctuation: 'test-punctuation',
                ...(hideCommas === undefined ? {} : { hideCommas })
            },
            shouldExpandNode: (level) => level === 0 || expanded
        })
        const tokens = punctuation(container)
        expect(tokens).toContain(',')
        expect(tokens).toContain('},')
        expect(tokens).toContain('],')
        expect(tokens).toContain('{},')
        expect(tokens).toContain('[],')
        const last = screen.getByText('last:').closest('[role="treeitem"]')!
        expect(last.querySelector('.test-punctuation')).toBeNull()
    })

    it('omits separators for every primitive type while preserving commas in values and labels', () => {
        const data = Object.freeze({
            'a,b': 'Alpha, Beta',
            number: 1,
            boolean: false,
            nothing: null,
            missing: undefined,
            bigint: 12n,
            date: new Date('2025-06-15T00:00:00Z'),
            function: () => 'hello, world',
            last: 2
        })
        const { container } = render(JsonView, {
            data,
            style: { punctuation: 'test-punctuation', hideCommas: true }
        })
        expect(punctuation(container)).toEqual(['{', '}'])
        for (const text of [
            'a,b:',
            '"Alpha, Beta"',
            '1',
            'false',
            'null',
            'undefined',
            '12n',
            '2025-06-15T00:00:00.000Z',
            'function() { }',
            '2'
        ]) {
            expect(screen.getByText(text)).toBeInTheDocument()
        }
        expect(data['a,b']).toBe('Alpha, Beta')
        expect(data.function()).toBe('hello, world')
    })

    it.each([false, true])('preserves container brackets and data (expanded: %s)', (expanded) => {
        const data = Object.freeze({
            object: Object.freeze({ text: 'One, two', child: 3 }),
            array: Object.freeze(['Three, four', 5]),
            emptyObject: Object.freeze({}),
            emptyArray: Object.freeze([]),
            last: 6
        })
        const original = JSON.stringify(data)
        const { container } = render(JsonView, {
            data,
            style: { punctuation: 'test-punctuation', hideCommas: true },
            shouldExpandNode: (level) => level === 0 || expanded
        })
        expect(punctuation(container).some((text) => text?.includes(','))).toBe(false)
        const rowTokens = (field: string) =>
            [
                ...screen
                    .getByText(`${field}:`)
                    .closest('[role="treeitem"]')!
                    .querySelectorAll(':scope > .test-punctuation')
            ].map((element) => element.textContent)
        expect(rowTokens('object')).toEqual(['{', '}'])
        expect(rowTokens('array')).toEqual(['[', ']'])
        expect(rowTokens('emptyObject')).toEqual(['{}'])
        expect(rowTokens('emptyArray')).toEqual(['[]'])
        expect(screen.queryByText('"One, two"') !== null).toBe(expanded)
        expect(screen.queryByText('"Three, four"') !== null).toBe(expanded)
        expect(JSON.stringify(data)).toBe(original)
    })

    it('omits separators throughout a root array and nested arrays and objects', () => {
        const data = ['Alpha, Beta', { nested: [1, 2] }, [], {}, 3]
        const { container } = render(JsonView, {
            data,
            style: { punctuation: 'test-punctuation', hideCommas: true }
        })
        const tokens = punctuation(container)
        expect(tokens.some((text) => text?.includes(','))).toBe(false)
        expect(tokens.filter((text) => text === '[')).toHaveLength(2)
        expect(tokens.filter((text) => text === ']')).toHaveLength(2)
        expect(tokens).toContain('{}')
        expect(tokens).toContain('[]')
        expect(screen.getByText('"Alpha, Beta"')).toBeInTheDocument()
    })

    it('updates separators reactively without changing manual expansion', async () => {
        const { container, rerender } = render(JsonView, {
            data: { branch: { leaf: 1 }, last: 2 },
            style: { punctuation: 'test-punctuation' }
        })
        const branch = screen.getByText('branch:').closest('[role="treeitem"]')!
        const button = branch.querySelector(':scope > [role="button"]')!
        await fireEvent.click(button)
        expect(button).toHaveAttribute('aria-expanded', 'false')
        expect(punctuation(container)).toContain('},')
        await rerender({ style: { punctuation: 'test-punctuation', hideCommas: true } })
        expect(punctuation(container).some((text) => text?.includes(','))).toBe(false)
        expect(button).toHaveAttribute('aria-expanded', 'false')
        await fireEvent.click(button)
        expect(screen.getByText('leaf:')).toBeInTheDocument()
        expect(punctuation(container).some((text) => text?.includes(','))).toBe(false)
        await rerender({ style: { punctuation: 'test-punctuation', hideCommas: false } })
        expect(punctuation(container)).toContain('},')
        expect(button).toHaveAttribute('aria-expanded', 'true')
    })
})

describe('JsonView — clickToExpandSummary', () => {
    it.each([undefined, true])('preserves default summary expansion (%s)', async (option) => {
        const { container } = render(JsonView, {
            data: { child: 1 },
            shouldExpandNode: () => false,
            clickToExpandSummary: option,
            style: { collapsedContent: 'summary' }
        })
        await fireEvent.click(container.querySelector('.summary')!)
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    })

    it.each([false, true])(
        'disables summaries throughout the tree (compact=%s)',
        async (compact) => {
            const veto = vi.fn(() => true)
            const { container, rerender } = render(JsonView, {
                data: { object: { nested: { leaf: 1 } }, array: [1, 2], empty: [] },
                compactTopLevel: compact,
                shouldExpandNode: (level) => level === 0,
                clickToExpandSummary: false,
                beforeExpandChange: veto,
                style: { collapsedContent: 'summary', punctuation: 'punctuation' }
            })
            const summary = container.querySelector('.summary')!
            const row = summary.closest('[role="treeitem"]')!
            const button = row.querySelector('[role="button"]')!
            await fireEvent.click(summary)
            await fireEvent.keyDown(summary, { key: 'ArrowRight' })
            for (const punctuation of row.querySelectorAll(':scope > .punctuation')) {
                await fireEvent.click(punctuation)
            }
            expect(button).toHaveAttribute('aria-expanded', 'false')
            expect(veto).not.toHaveBeenCalled()
            // Changing this option neither resets expansion nor changes chevron keyboard behavior.
            await rerender({ clickToExpandSummary: true })
            expect(button).toHaveAttribute('aria-expanded', 'false')
            await fireEvent.click(summary)
            expect(button).toHaveAttribute('aria-expanded', 'true')
            await rerender({ clickToExpandSummary: false })
            await fireEvent.keyDown(button, { key: 'ArrowLeft' })
            expect(button).toHaveAttribute('aria-expanded', 'false')
            await fireEvent.keyDown(button, { key: 'ArrowRight' })
            expect(button).toHaveAttribute('aria-expanded', 'true')
            const nested = row.querySelector('.summary')!
            await fireEvent.click(nested)
            expect(nested.closest('[role="treeitem"]')).toHaveAttribute('aria-expanded', 'false')
            const array = screen.getByText('array:').closest('[role="treeitem"]')!
            await fireEvent.click(array.querySelector('.summary')!)
            expect(array).toHaveAttribute('aria-expanded', 'false')
            await fireEvent.click(array.querySelector('[role="button"]')!)
            expect(array).toHaveAttribute('aria-expanded', 'true')
            expect(screen.getByText('empty:').closest('[role="treeitem"]')).not.toHaveAttribute(
                'aria-expanded'
            )
        }
    )

    it('keeps label expansion independent of summary expansion', async () => {
        render(JsonView, {
            data: { branch: { leaf: 1 } },
            compactTopLevel: true,
            shouldExpandNode: () => false,
            clickToExpandNode: true,
            clickToExpandSummary: false
        })
        await fireEvent.click(screen.getByText('branch:'))
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
    })
})
