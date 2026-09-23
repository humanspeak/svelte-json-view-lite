import { fireEvent, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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
