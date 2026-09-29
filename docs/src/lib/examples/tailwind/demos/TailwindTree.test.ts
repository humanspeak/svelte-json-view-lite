import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, within } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import TailwindTree from './TailwindTree.svelte'

beforeEach(() => vi.useRealTimers())

describe('Tailwind tree example', () => {
    it('provides a standalone styling demo without motion controls', () => {
        render(TailwindTree)
        expect(screen.queryByRole('checkbox', { name: /motion/i })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'dusk' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('preserves manual expansion when the palette or density changes', async () => {
        render(TailwindTree)
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
        render(TailwindTree)
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
        render(TailwindTree)
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
