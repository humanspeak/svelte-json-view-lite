import { fireEvent, render, screen } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import StructuralSnippets from './test/StructuralSnippets.svelte'

beforeEach(() => vi.useRealTimers())

describe('structural rendering snippets', () => {
    it('customizes container, empty, and primitive rows while composing label/value snippets', () => {
        const { container } = render(StructuralSnippets, {
            data: { branch: { name: 'Ada' }, empty: {}, list: [] }
        })
        const rows = screen.getAllByRole('treeitem')
        expect(rows).toHaveLength(4)
        expect(rows.every((row) => row.tagName === 'SECTION')).toBe(true)
        expect(container.querySelector('[data-field="branch"]')).toHaveAttribute(
            'aria-expanded',
            'true'
        )
        expect(container.querySelector('[data-field="name"]')).toHaveAttribute(
            'data-container',
            'false'
        )
        expect(container.querySelector('[data-field="name"]')).toHaveAttribute('data-level', '2')
        expect(container.querySelector('[data-field="empty"]')).not.toHaveAttribute('aria-expanded')
        expect(container.querySelector('[data-field="list"]')).not.toHaveAttribute('aria-expanded')
        expect(screen.getByText('name:').tagName).toBe('EM')
        expect(screen.getByText('empty:').tagName).toBe('EM')
        expect(screen.getByText('list:').tagName).toBe('EM')
        expect(screen.getByText('Ada').tagName).toBe('STRONG')
        expect(screen.getAllByRole('button')).toHaveLength(1)
    })

    it('keeps button semantics, vetoes, hover/focus state, and persistent summary clicks', async () => {
        const veto = vi.fn(() => false)
        const { container, rerender } = render(StructuralSnippets, {
            data: { branch: { leaf: 1 } },
            beforeExpandChange: veto
        })
        const button = screen.getByRole('button', { name: 'collapse JSON' })
        const icon = container.querySelector('[data-expander]')!
        const summary = container.querySelector('[data-summary]')!
        expect(document.getElementById(button.getAttribute('aria-controls')!)).toHaveAttribute(
            'role',
            'group'
        )
        await fireEvent.pointerEnter(button)
        expect(icon).toHaveAttribute('data-hovered', 'true')
        await fireEvent.pointerLeave(button)
        await fireEvent.focus(button)
        expect(icon).toHaveAttribute('data-hovered', 'false')
        expect(icon).toHaveAttribute('data-focused', 'true')
        await fireEvent.click(button)
        expect(veto).toHaveBeenCalledOnce()
        expect(button).toHaveAttribute('aria-expanded', 'true')
        await rerender({ beforeExpandChange: () => true })
        await fireEvent.keyDown(button, { key: 'ArrowLeft' })
        expect(button).toHaveAttribute('aria-expanded', 'false')
        expect(summary).toBeInTheDocument()
        expect(summary).toHaveTextContent('…')
        await fireEvent.click(summary)
        expect(button).toHaveAttribute('aria-expanded', 'true')
        expect(button).toHaveFocus()
        expect(summary).toHaveTextContent('')
    })

    it('keeps retained exits inert, restores focus, and reverses without duplicate groups', async () => {
        const { container, rerender } = render(StructuralSnippets, {
            data: { first: { nested: { leaf: 1 } }, second: { leaf: 2 } },
            holdClosed: true
        })
        const [parent, child, sibling] = screen.getAllByRole('button')
        const group = container.querySelector('[data-custom-group]') as HTMLElement
        await fireEvent.keyDown(parent, { key: 'ArrowDown' })
        expect(child).toHaveFocus()
        await rerender({ shouldExpandNode: () => false })
        expect(parent).toHaveFocus()
        expect(group).toBeInTheDocument()
        expect(group).toHaveAttribute('inert')
        expect(group).toHaveAttribute('aria-hidden', 'true')
        await fireEvent.keyDown(parent, { key: 'ArrowDown' })
        expect(sibling).toHaveFocus()
        await fireEvent.click(parent)
        expect(group).not.toHaveAttribute('inert')
        expect(group).not.toHaveAttribute('aria-hidden')
        expect(container.querySelectorAll(`[id="${group.id}"]`)).toHaveLength(1)
        await fireEvent.click(parent)
        await rerender({ holdClosed: false })
        expect(group).not.toBeInTheDocument()
    })

    it('does not read child values before expansion even if a custom group stays mounted', async () => {
        const read = vi.fn(() => 42)
        const data = Object.defineProperty({}, 'value', { enumerable: true, get: read })
        render(StructuralSnippets, {
            data,
            compactTopLevel: false,
            holdClosed: true,
            shouldExpandNode: () => false
        })
        expect(read).not.toHaveBeenCalled()
        await fireEvent.click(screen.getByRole('button'))
        expect(read).toHaveBeenCalledOnce()
        expect(screen.getByText('42')).toBeInTheDocument()
    })
})
