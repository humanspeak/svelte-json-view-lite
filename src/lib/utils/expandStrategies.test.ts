import { describe, expect, it } from 'vitest'
import { allExpanded, collapseAllNested } from './expandStrategies.js'

describe('allExpanded', () => {
    it('returns true regardless of arguments', () => {
        expect(allExpanded()).toBe(true)
    })
})

describe('collapseAllNested', () => {
    it('returns true only for the root level', () => {
        expect(collapseAllNested(0)).toBe(true)
    })

    it('returns false for every nested level', () => {
        expect(collapseAllNested(1)).toBe(false)
        expect(collapseAllNested(2)).toBe(false)
        expect(collapseAllNested(42)).toBe(false)
    })
})
