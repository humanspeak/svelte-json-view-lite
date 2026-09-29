import { fireEvent, render, screen } from '@testing-library/svelte'
import { flushSync } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { allExpanded, collapseAllNested, JsonView } from './index.js'

beforeEach(() => vi.useRealTimers())

describe('expansion strategy identity', () => {
    it('preserves a manually opened child across ancestor data and theme updates', async () => {
        const { container, rerender } = render(JsonView, {
            props: {
                data: { branch: { child: 1 } },
                shouldExpandNode: collapseAllNested
            }
        })
        const button = screen.getByRole('button', { name: 'expand JSON' })
        await fireEvent.click(button)
        expect(screen.getByText('1')).toBeInTheDocument()

        await rerender({ data: { branch: { child: 2 } }, style: { label: 'updated-label' } })
        expect(container.querySelectorAll('[role="button"]')[1]).toBe(button)
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('resets a manual override only when the strategy changes, using current node props', async () => {
        const initial = vi.fn(() => false)
        const { rerender } = render(JsonView, {
            props: { data: { child: 1 }, shouldExpandNode: initial }
        })
        const button = screen.getByRole('button')
        expect(initial).toHaveBeenCalledTimes(1)
        await fireEvent.click(button)

        const value = { child: 2 }
        await rerender({ data: value })
        expect(initial).toHaveBeenCalledTimes(1)
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('2')).toBeInTheDocument()

        const replacement = vi.fn(() => false)
        await rerender({ shouldExpandNode: replacement })
        expect(replacement).toHaveBeenCalledExactlyOnceWith(0, value, undefined)
        expect(button).toHaveAttribute('aria-expanded', 'false')

        await fireEvent.keyDown(button, { key: 'ArrowRight' })
        await rerender({ data: { child: 3 } })
        expect(replacement).toHaveBeenCalledTimes(1)
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('preserves a manual collapse until a new expanding strategy is supplied', async () => {
        const { rerender } = render(JsonView, {
            props: { data: { child: 1 }, shouldExpandNode: allExpanded }
        })
        const button = screen.getByRole('button')
        await fireEvent.click(button)
        await rerender({ data: { child: 2 } })
        expect(button).toHaveAttribute('aria-expanded', 'false')
        await rerender({ shouldExpandNode: () => true })
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('applies a changed strategy without calling the user-toggle veto', async () => {
        const veto = vi.fn(() => false)
        const { rerender } = render(JsonView, {
            props: { data: { child: 1 }, shouldExpandNode: () => false, beforeExpandChange: veto }
        })
        const button = screen.getByRole('button')
        await fireEvent.click(button)
        expect(button).toHaveAttribute('aria-expanded', 'false')
        expect(veto).toHaveBeenCalledTimes(1)
        await rerender({ shouldExpandNode: allExpanded })
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(veto).toHaveBeenCalledTimes(1)
    })
})

describe.each(['object', 'array'] as const)('lazy %s children', (kind) => {
    it.each(['click', 'strategy'] as const)(
        'caches child values across %s toggles',
        async (toggle) => {
            const read = vi.fn(() => 42)
            const value = kind === 'array' ? [] : {}
            Object.defineProperty(value, kind === 'array' ? '0' : 'child', {
                enumerable: true,
                get: read
            })
            const { rerender } = render(JsonView, {
                props: { data: value, shouldExpandNode: () => false }
            })
            const button = screen.getByRole('button')
            expect(read).not.toHaveBeenCalled()

            for (const open of [true, false, true]) {
                if (toggle === 'click') await fireEvent.click(button)
                else await rerender({ shouldExpandNode: () => open })
                expect(button).toHaveAttribute('aria-expanded', String(open))
                expect(read).toHaveBeenCalledTimes(1)
                if (open) expect(screen.getByText('42')).toBeInTheDocument()
                else expect(screen.queryByText('42')).not.toBeInTheDocument()
            }
        }
    )
})

describe('tree expansion controller lifecycle', () => {
    it.each([true, false])(
        'applies strategy changes to an empty node before it becomes nonempty (%s)',
        async (open) => {
            const initial = vi.fn(() => !open)
            const { rerender } = render(JsonView, {
                props: { data: {}, shouldExpandNode: initial }
            })
            const replacement = vi.fn(() => open)
            await rerender({ shouldExpandNode: replacement })
            expect(replacement).toHaveBeenCalledExactlyOnceWith(0, {}, undefined)
            const read = vi.fn(() => 42)
            const data = Object.defineProperty({}, 'child', { enumerable: true, get: read })
            await rerender({ data })
            expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', String(open))
            expect(read).toHaveBeenCalledTimes(open ? 1 : 0)
            expect(initial).toHaveBeenCalledTimes(1)
            expect(replacement).toHaveBeenCalledTimes(1)
        }
    )

    it('preserves a manual collapse through empty and nonempty data', async () => {
        const { rerender } = render(JsonView, {
            props: { data: { child: 1 }, shouldExpandNode: allExpanded }
        })
        await fireEvent.click(screen.getByRole('button'))
        await rerender({ data: {} })
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
        await rerender({ data: { child: 2 } })
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
        await fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowRight' })
        expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('unregisters removed children before the next strategy update', async () => {
        const { rerender } = render(JsonView, {
            props: { data: { removed: { leaf: 1 }, kept: 2 } }
        })
        const data = { kept: 3 }
        await rerender({ data })
        const strategy = vi.fn(() => true)
        await rerender({ shouldExpandNode: strategy })
        expect(strategy).toHaveBeenCalledExactlyOnceWith(0, data, undefined)
    })

    it('evaluates newly mounted children once when data and strategy change together', async () => {
        const { rerender } = render(JsonView, { props: { data: { leaf: 1 } } })
        const child = { leaf: 2 }
        const data = { added: child }
        const strategy = vi.fn(() => true)
        await rerender({ data, shouldExpandNode: strategy })
        expect(strategy).toHaveBeenCalledTimes(2)
        expect(strategy).toHaveBeenCalledWith(0, data, undefined)
        expect(strategy).toHaveBeenCalledWith(1, child, 'added')
    })

    it('keeps viewers independent and disposes a removed viewer', async () => {
        const first = render(JsonView, { props: { data: { first: 1 } } })
        const second = render(JsonView, { props: { data: { second: 2 } } })
        const firstButton = first.container.querySelector('[role="button"]')
        const secondButton = second.container.querySelector('[role="button"]')
        await first.rerender({ shouldExpandNode: () => false })
        expect(firstButton).toHaveAttribute('aria-expanded', 'false')
        expect(secondButton).toHaveAttribute('aria-expanded', 'true')
        first.unmount()
        const strategy = vi.fn(() => false)
        await second.rerender({ shouldExpandNode: strategy })
        expect(strategy).toHaveBeenCalledExactlyOnceWith(0, { second: 2 }, undefined)
        expect(secondButton).toHaveAttribute('aria-expanded', 'false')
    })
})

describe('ExpandableObject child transitions', () => {
    // A controllable browser animation lets us inspect the tree while an outro
    // is still visible, rather than replacing the transition with a no-op.
    const originalAnimate = Object.getOwnPropertyDescriptor(Element.prototype, 'animate')
    const animations: Array<{
        currentTime: number
        onfinish: (() => void) | null
        cancel: ReturnType<typeof vi.fn>
    }> = []

    beforeEach(() => {
        vi.useRealTimers()
        animations.length = 0
        Object.defineProperty(Element.prototype, 'animate', {
            configurable: true,
            value: vi.fn(() => {
                const animation = { currentTime: 0, onfinish: null, cancel: vi.fn() }
                animations.push(animation)
                return animation
            })
        })
    })

    afterEach(() => {
        if (originalAnimate) Object.defineProperty(Element.prototype, 'animate', originalAnimate)
        else Reflect.deleteProperty(Element.prototype, 'animate')
    })

    function finishLatestAnimation() {
        flushSync(() => animations.at(-1)?.onfinish?.())
    }

    const childrenTransition = () => ({
        duration: 240,
        css: (t: number) => `height: ${t * 100}px; overflow: hidden`
    })

    it('retains closing rows visually, skips them during navigation, then removes them', async () => {
        const { container } = render(JsonView, {
            data: { first: { nested: { leaf: 1 } }, second: { leaf: 2 } },
            compactTopLevel: true,
            childrenTransition
        })
        const buttons = screen.getAllByRole('button')
        const first = buttons[0]
        const second = buttons[2]
        const group = container.querySelector('[role="group"]') as HTMLElement

        await fireEvent.click(first)
        finishLatestAnimation() // complete delay, start the actual outro
        expect(group).toBeInTheDocument()
        expect(group).toHaveAttribute('aria-hidden', 'true')
        expect(first).toHaveAttribute('aria-expanded', 'false')
        await fireEvent.keyDown(first, { key: 'ArrowDown' })
        expect(second).toHaveFocus()
        finishLatestAnimation()
        expect(group).not.toBeInTheDocument()
    })

    it('reverses an in-flight collapse without duplicating or losing child rows', async () => {
        const { container } = render(JsonView, {
            data: { branch: { leaf: 1 } },
            compactTopLevel: true,
            childrenTransition
        })
        const toggle = screen.getByRole('button')
        const group = container.querySelector('[role="group"]')
        await fireEvent.click(toggle)
        finishLatestAnimation()
        animations.at(-1)!.currentTime = 120
        await fireEvent.click(toggle)
        finishLatestAnimation()
        expect(toggle).toHaveAttribute('aria-expanded', 'true')
        expect(group).not.toHaveAttribute('aria-hidden')
        expect(container.querySelectorAll('[role="group"]')).toHaveLength(1)
        finishLatestAnimation()
        expect(screen.getByText('leaf:')).toBeInTheDocument()
    })

    it('moves a collapsing descendant’s focus and tab stop back to its parent', async () => {
        const { rerender } = render(JsonView, {
            data: { branch: { nested: { leaf: 1 } } },
            compactTopLevel: true,
            childrenTransition
        })
        const [parent, child] = screen.getAllByRole('button')
        await fireEvent.keyDown(parent, { key: 'ArrowDown' })
        expect(child).toHaveFocus()
        await rerender({ shouldExpandNode: () => false })
        // Bulk collapse can start more than one local outro. Starting all
        // pending delays must still leave focus outside every closing group.
        for (const animation of [...animations]) flushSync(() => animation.onfinish?.())
        expect(parent).toHaveFocus()
        expect(parent).toHaveAttribute('tabindex', '0')
    })

    it('preserves immediate removal when no transition is supplied', async () => {
        render(JsonView, { data: { leaf: 1 } })
        await fireEvent.click(screen.getByRole('button'))
        expect(screen.queryByText('leaf:')).not.toBeInTheDocument()
        expect(animations).toHaveLength(0)
    })
})

describe('ExpandableObject external child animations', () => {
    beforeEach(() => vi.useRealTimers())

    function controlledAnimation() {
        const runs: Array<{
            node: HTMLElement
            expanded: boolean
            finish: () => void
            stop: ReturnType<typeof vi.fn>
        }> = []
        const animate = vi.fn((node: HTMLElement, expanded: boolean) => {
            let finish!: () => void
            const finished = new Promise<void>((resolve) => (finish = resolve))
            const stop = vi.fn()
            runs.push({ node, expanded, finish, stop })
            return { finished, stop }
        })
        return { animate, runs }
    }

    it('waits for external completion and skips closing descendants in keyboard navigation', async () => {
        const { animate, runs } = controlledAnimation()
        const { container } = render(JsonView, {
            data: { first: { nested: { leaf: 1 } }, second: { leaf: 2 } },
            compactTopLevel: true,
            childrenAnimation: animate
        })
        const [first, , second] = screen.getAllByRole('button')
        const group = container.querySelector('[role="group"]') as HTMLElement
        await fireEvent.click(first)
        const closing = runs.findLast((run) => run.node === group)!
        expect(closing.expanded).toBe(false)
        expect(group).toBeInTheDocument()
        expect(group.inert).toBe(true)
        expect(group).toHaveAttribute('aria-hidden', 'true')
        await fireEvent.keyDown(first, { key: 'ArrowDown' })
        expect(second).toHaveFocus()
        closing.finish()
        await Promise.resolve()
        flushSync()
        expect(group).not.toBeInTheDocument()
    })

    it('stops an interrupted close and ignores its stale completion when reopening', async () => {
        const { animate, runs } = controlledAnimation()
        const { container, unmount } = render(JsonView, {
            data: { leaf: 1 },
            childrenAnimation: animate
        })
        const button = screen.getByRole('button')
        const group = container.querySelector('[role="group"]') as HTMLElement
        await fireEvent.click(button)
        const closing = runs.at(-1)!
        await fireEvent.click(button)
        expect(closing.stop).toHaveBeenCalledOnce()
        closing.finish()
        await Promise.resolve()
        flushSync()
        expect(group).toBeInTheDocument()
        expect(group.inert).toBe(false)
        expect(group).not.toHaveAttribute('aria-hidden')
        expect(container.querySelectorAll('[role="group"]')).toHaveLength(1)
        const opening = runs.at(-1)!
        unmount()
        expect(opening.stop).toHaveBeenCalledOnce()
    })

    it('restores descendant focus on programmatic collapse and supports immediate animations', async () => {
        const { rerender } = render(JsonView, {
            data: { branch: { nested: { leaf: 1 } } },
            compactTopLevel: true,
            childrenAnimation: () => undefined
        })
        const [parent, child] = screen.getAllByRole('button')
        await fireEvent.keyDown(parent, { key: 'ArrowDown' })
        expect(child).toHaveFocus()
        await rerender({ shouldExpandNode: () => false })
        expect(parent).toHaveFocus()
        expect(parent).toHaveAttribute('tabindex', '0')
        expect(screen.queryByText('leaf:')).not.toBeInTheDocument()
        await fireEvent.click(parent)
        expect(screen.getByText('nested:')).toBeInTheDocument()
    })
})
