import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TailwindMotionTree from './TailwindMotionTree.svelte'

beforeEach(() => {
    vi.useRealTimers()
    vi.stubGlobal('scrollTo', vi.fn())
})
afterEach(() => vi.unstubAllGlobals())

describe('Tailwind with Svelte Motion example', () => {
    it('retains the real group for a Motion exit and reverses without cloning rows', async () => {
        const { container } = render(TailwindMotionTree)
        const group = container.querySelector('.tw-children')!
        const user = screen.getByText('user:')
        await fireEvent.click(user)
        expect(group).toBeInTheDocument()
        expect(group).toHaveAttribute('aria-hidden', 'true')
        await fireEvent.click(user)
        expect(group).not.toHaveAttribute('aria-hidden')
        expect(container.querySelector('.tw-children')).toBe(group)
        expect(screen.getAllByText('"Ada Lovelace"')).toHaveLength(1)
        await fireEvent.click(user)
        await waitFor(() => expect(group).not.toBeInTheDocument())
        await fireEvent.click(user)
        expect(screen.getAllByText('"Ada Lovelace"')).toHaveLength(1)
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
        await waitFor(() => expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument())
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
    })

    it('preserves manual expansion when the palette or density changes', async () => {
        render(TailwindMotionTree)
        await fireEvent.click(screen.getByText('user:'))
        await waitFor(() => expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument())

        await fireEvent.click(screen.getByRole('button', { name: 'daylight' }))
        await fireEvent.click(screen.getByRole('checkbox', { name: 'Compact' }))
        expect(screen.getByRole('button', { name: 'daylight' })).toHaveAttribute(
            'aria-pressed',
            'true'
        )
        await waitFor(() => expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument())

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
        await waitFor(() => expect(screen.queryByText('"en"')).not.toBeInTheDocument())
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
