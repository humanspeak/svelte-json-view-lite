import '@testing-library/jest-dom/vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TailwindMotionTree from './TailwindMotionTree.svelte'

const writeText = vi.fn<(_text: string) => Promise<void>>()

beforeEach(() => {
    vi.useRealTimers()
    writeText.mockReset().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    window.getSelection()?.removeAllRanges()
    vi.stubGlobal('scrollTo', vi.fn())
})
afterEach(() => vi.unstubAllGlobals())

function chevronFor(field: string): HTMLElement {
    return screen.getByText(field).closest('.tw-row')!.querySelector(':scope > .tw-toggle')!
}

describe('Tailwind with Svelte Motion example', () => {
    it('retains the real group for a Motion exit and reverses without cloning rows', async () => {
        const { container } = render(TailwindMotionTree)
        const group = container.querySelector('.tw-children')!
        const user = chevronFor('user:')
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

    it('copies from the animated ellipsis and exposes the Motion documentation link', async () => {
        render(TailwindMotionTree)
        expect(screen.getByRole('link', { name: 'Powered by Svelte Motion ↗' })).toHaveAttribute(
            'href',
            'https://motion.svelte.page/'
        )
        await fireEvent.click(chevronFor('user:'))
        const marker = screen
            .getByText('user:')
            .closest('.tw-row')!
            .querySelector(':scope > .tw-punctuation:has(.tw-dots)')!
        const bubblingClick = vi.fn()
        const tree = screen.getByRole('tree', { name: 'Styled workspace JSON' })
        tree.addEventListener('click', bubblingClick, { once: true })
        await fireEvent.click(marker)
        expect(bubblingClick).toHaveBeenCalledOnce()
        await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
        expect(JSON.parse(writeText.mock.calls[0][0])).toMatchObject({
            name: 'Ada Lovelace',
            id: 12345
        })
        expect(screen.getByText('user:').closest('.tw-row')).toHaveAttribute(
            'aria-expanded',
            'false'
        )
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
        await fireEvent.click(chevronFor('user:'))
        await waitFor(() => expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument())

        await fireEvent.click(screen.getByRole('button', { name: 'daylight' }))
        await fireEvent.click(screen.getByRole('checkbox', { name: 'Compact' }))
        expect(screen.getByRole('button', { name: 'daylight' })).toHaveAttribute(
            'aria-pressed',
            'true'
        )
        await waitFor(() => expect(screen.queryByText('"Ada Lovelace"')).not.toBeInTheDocument())

        await fireEvent.click(chevronFor('user:'))
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
    })

    it('reapplies expand and collapse actions after manual changes', async () => {
        render(TailwindMotionTree)
        const tree = screen.getByRole('tree', { name: 'Styled workspace JSON' })
        await fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
        expect(within(tree).getAllByRole('treeitem')).toHaveLength(3)

        await fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
        expect(screen.getByText('"en"')).toBeInTheDocument()
        await fireEvent.click(chevronFor('preferences:'))
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

describe('Motion example value copying', () => {
    it('uses the viewer option to omit separators without replacing the closing delimiters', async () => {
        const { container } = render(TailwindMotionTree)
        const punctuation = () =>
            [...container.querySelectorAll('.tw-punctuation')].map((element) => element.textContent)
        expect(punctuation().some((text) => text?.includes(','))).toBe(false)
        expect(container.querySelector('.tw-ending')).toBeNull()
        await fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
        const user = screen.getByText('user:').closest('.tw-row')!
        const closing = user.querySelectorAll(':scope > .tw-punctuation')[1]
        expect(closing.textContent?.replace(/\s/g, '')).toBe('…}')
        await fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
        expect(punctuation().some((text) => text?.includes(','))).toBe(false)
    })

    it('copies only the clicked leaf with row-local success feedback', async () => {
        render(TailwindMotionTree)
        await fireEvent.click(screen.getByText('"Ada Lovelace"'))
        expect(writeText).toHaveBeenCalledExactlyOnceWith('Ada Lovelace')
        const row = screen.getAllByText('name:')[0].closest('.tw-row') as HTMLElement
        await waitFor(() => expect(row).toHaveAttribute('data-copy-state', 'copied'))
        expect(row.querySelector('.tw-copy-feedback[data-status="copied"]')).toBeInTheDocument()
        expect(screen.getByText('user:').closest('.tw-row')).not.toHaveAttribute('data-copy-state')
        expect(screen.getByRole('status')).toHaveTextContent('Copied!')
    })

    it('copies complete collapsed containers while reserving chevrons for expansion', async () => {
        render(TailwindMotionTree)
        await fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
        const row = screen.getByText('user:').closest('.tw-row') as HTMLElement
        await fireEvent.click(screen.getByText('user:'))
        await waitFor(() => expect(row).toHaveAttribute('data-copy-state', 'copied'))
        expect(JSON.parse(writeText.mock.calls[0][0])).toMatchObject({
            profile: { preferences: { theme: 'dark', notifications: true, language: 'en' } }
        })
        expect(row).toHaveAttribute('aria-expanded', 'false')
        await fireEvent.click(within(row).getByRole('button', { name: 'expand JSON' }))
        expect(screen.getByText('"Ada Lovelace"')).toBeInTheDocument()
        expect(writeText).toHaveBeenCalledTimes(1)
    })

    it('copies arrays, booleans, numbers and null as their complete values', async () => {
        render(TailwindMotionTree)
        for (const [field, expected] of [
            ['tags:', JSON.stringify(['design', 'engineering', 'a little bit of magic'], null, 2)],
            ['verified:', 'true'],
            ['members:', '8'],
            ['lastError:', 'null']
        ]) {
            await fireEvent.click(screen.getByText(field))
            await waitFor(() => expect(writeText).toHaveBeenLastCalledWith(expected))
        }
        expect(writeText).toHaveBeenCalledTimes(4)
    })

    it('supports keyboard copying and keeps arrow-key expansion separate', async () => {
        render(TailwindMotionTree)
        const row = screen.getByText('user:').closest('.tw-row') as HTMLElement
        expect(row).toHaveAttribute('tabindex', '0')
        expect(document.getElementById(row.getAttribute('aria-describedby')!)).toHaveTextContent(
            'Enter or Space'
        )
        await fireEvent.keyDown(row, { key: 'Enter' })
        await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1))
        const chevron = within(row).getAllByRole('button')[0]
        await fireEvent.keyDown(chevron, { key: 'ArrowLeft' })
        expect(row).toHaveAttribute('aria-expanded', 'false')
        expect(writeText).toHaveBeenCalledTimes(1)
        await fireEvent.keyDown(row, { key: ' ' })
        await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2))
    })

    it('preserves text selection without copying', async () => {
        render(TailwindMotionTree)
        const text = screen.getByText('"Ada Lovelace"')
        const range = document.createRange()
        range.selectNodeContents(text)
        window.getSelection()?.addRange(range)
        await fireEvent.click(text)
        expect(writeText).not.toHaveBeenCalled()
    })

    it('reports a clipboard failure and permits a successful retry', async () => {
        writeText.mockRejectedValueOnce(new Error('Permission denied'))
        render(TailwindMotionTree)
        const row = screen.getAllByText('name:')[0].closest('.tw-row') as HTMLElement
        await fireEvent.click(screen.getAllByText('name:')[0])
        await waitFor(() => expect(row).toHaveAttribute('data-copy-state', 'failed'))
        expect(screen.getByRole('status')).toHaveTextContent('Could not copy')
        await fireEvent.click(screen.getAllByText('name:')[0])
        await waitFor(() => expect(row).toHaveAttribute('data-copy-state', 'copied'))
        expect(screen.getByRole('status')).toHaveTextContent('Copied!')
    })

    it('keeps feedback on the latest click when clipboard requests finish out of order', async () => {
        let finishFirst!: () => void
        writeText.mockImplementationOnce(
            () =>
                new Promise<void>((resolve) => {
                    finishFirst = resolve
                })
        )
        render(TailwindMotionTree)
        await fireEvent.click(screen.getAllByText('name:')[0])
        await fireEvent.click(screen.getByText('members:'))
        const latest = screen.getByText('members:').closest('.tw-row') as HTMLElement
        await waitFor(() => expect(latest).toHaveAttribute('data-copy-state', 'copied'))
        finishFirst()
        await Promise.resolve()
        expect(latest).toHaveAttribute('data-copy-state', 'copied')
        expect(screen.getAllByText('name:')[0].closest('.tw-row')).not.toHaveAttribute(
            'data-copy-state'
        )
    })

    it('shows and dismisses copy feedback with motion disabled', async () => {
        const { container } = render(TailwindMotionTree)
        await fireEvent.click(screen.getByRole('checkbox', { name: 'Motion' }))
        vi.useFakeTimers()
        const row = screen.getAllByText('name:')[0].closest('.tw-row') as HTMLElement
        await fireEvent.click(screen.getAllByText('name:')[0])
        expect(row).toHaveAttribute('data-copy-state', 'copied')
        expect(row.querySelector('.tw-copy-feedback')).toBeInTheDocument()
        await vi.advanceTimersByTimeAsync(2000)
        expect(row).not.toHaveAttribute('data-copy-state')
        expect(screen.getByRole('status').textContent).toBe('')
        expect(container.querySelector('.tailwind-demo')).toHaveAttribute('data-motion', 'false')
    })
})
