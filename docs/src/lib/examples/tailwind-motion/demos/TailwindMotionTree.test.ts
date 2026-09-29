import { animate } from '@humanspeak/svelte-motion'
import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, within } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TailwindMotionTree from './TailwindMotionTree.svelte'

// jsdom cannot measure layout or play browser animations. Assert that the
// demo delegates to Motion; core tests control completion/reversal separately.
vi.mock('@humanspeak/svelte-motion', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@humanspeak/svelte-motion')>()
    return {
        ...actual,
        animate: vi.fn(() => ({
            then: (resolve: () => void) => Promise.resolve().then(resolve),
            stop: vi.fn(),
            complete: vi.fn()
        }))
    }
})

beforeEach(() => {
    vi.useRealTimers()
    vi.mocked(animate).mockClear()
})
afterEach(() => vi.unstubAllGlobals())

describe('Tailwind with Svelte Motion example', () => {
    it('uses Motion for child groups, carets, ellipses, and row hover', async () => {
        const { container } = render(TailwindMotionTree)
        const tree = screen.getByRole('tree')
        const row = tree.querySelector<HTMLElement>('.tw-row')!
        const toggle = row.querySelector<HTMLElement>('.tw-toggle')!
        vi.mocked(animate).mockClear()
        await fireEvent.click(toggle)
        expect(animate).toHaveBeenCalledWith(
            expect.any(HTMLElement),
            expect.objectContaining({ height: expect.arrayContaining([0]) }),
            expect.objectContaining({ duration: 0.24 })
        )
        expect(animate).toHaveBeenCalledWith(
            row.querySelector('.tw-caret'),
            { rotate: -20 },
            expect.objectContaining({ duration: 0.18 })
        )
        expect(animate).toHaveBeenCalledWith(
            row.querySelector('.tw-dots'),
            expect.objectContaining({ opacity: 1, width: '1em' }),
            expect.objectContaining({ duration: 0.18 })
        )
        await fireEvent.pointerOver(toggle, { pointerType: 'mouse' })
        expect(animate).toHaveBeenCalledWith(row, { x: 2 }, expect.any(Object))
        await fireEvent.pointerOut(toggle, { relatedTarget: container })
        expect(animate).toHaveBeenCalledWith(row, { x: 0 }, expect.any(Object))
    })

    it('opens from the animated ellipsis and exposes the Motion documentation link', async () => {
        const { container } = render(TailwindMotionTree)
        expect(screen.getByRole('link', { name: 'Powered by Svelte Motion ↗' })).toHaveAttribute(
            'href',
            'https://motion.svelte.page/'
        )
        await fireEvent.click(screen.getByText('user:'))
        const marker = container.querySelector('.tw-row > .tw-punctuation:last-child')!
        await fireEvent.click(marker)
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
        expect(within(screen.getByRole('tree')).getAllByRole('button')[0]).toHaveFocus()
    })

    it('allows motion to be disabled without resetting a collapsed tree', async () => {
        const { container } = render(TailwindMotionTree)
        await fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
        await fireEvent.click(screen.getByRole('checkbox', { name: 'Motion' }))
        expect(container.querySelector('.tailwind-demo')).toHaveAttribute('data-motion', 'false')
        expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument()
        await fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
    })

    it('honors the operating system reduced-motion preference', () => {
        vi.stubGlobal('matchMedia', () => ({
            matches: true,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        }))
        const { container } = render(TailwindMotionTree)
        const toggle = screen.getByRole('checkbox', { name: 'Reduced motion' })
        expect(toggle).toBeDisabled()
        expect(toggle).not.toBeChecked()
        expect(container.querySelector('.tailwind-demo')).toHaveAttribute('data-motion', 'false')
        expect(vi.mocked(animate).mock.calls.length).toBeGreaterThan(0)
        for (const [, , options] of vi.mocked(animate).mock.calls) {
            expect(options).toEqual(expect.objectContaining({ duration: 0 }))
        }
    })

    it('preserves manual expansion when the palette or density changes', async () => {
        render(TailwindMotionTree)
        await fireEvent.click(screen.getByText('user:'))
        expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument()

        await fireEvent.click(screen.getByRole('button', { name: 'daylight' }))
        await fireEvent.click(screen.getByRole('checkbox', { name: 'Compact' }))
        expect(screen.getByRole('button', { name: 'daylight' })).toHaveAttribute(
            'aria-pressed',
            'true'
        )
        expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument()

        await fireEvent.click(screen.getByText('user:'))
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
    })

    it('reapplies expand and collapse actions after manual changes', async () => {
        render(TailwindMotionTree)
        const tree = screen.getByRole('tree', { name: 'Styled workspace JSON' })
        await fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
        expect(within(tree).getAllByRole('treeitem')).toHaveLength(3)

        await fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
        expect(screen.getByText('"en"')).toBeInTheDocument()
        await fireEvent.click(screen.getByText('preferences:'))
        expect(screen.queryByText('"en"')).not.toBeInTheDocument()
        await fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
        expect(screen.getByText('"en"')).toBeInTheDocument()
    })

    it('keeps keyboard navigation and full long values available', async () => {
        render(TailwindMotionTree)
        const tree = screen.getByRole('tree', { name: 'Styled workspace JSON' })
        const first = within(tree).getAllByRole('button')[0]
        first.focus()
        await fireEvent.keyDown(first, { key: 'ArrowLeft' })
        expect(first).toHaveAttribute('aria-expanded', 'false')
        await fireEvent.keyDown(first, { key: 'ArrowDown' })
        expect(within(tree).getAllByRole('button')[1]).toHaveFocus()
        await fireEvent.keyDown(first, { key: 'ArrowRight' })
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
        expect(
            screen.getByText('"https://api.example.com/v1/workspaces/creative-studio/events"')
        ).toBeInTheDocument()
    })
})
