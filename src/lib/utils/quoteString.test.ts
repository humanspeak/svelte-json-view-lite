import { describe, expect, it } from 'vitest'
import { quoteString, quoteStringValue } from './quoteString.js'

describe('quoteString', () => {
    it('leaves non-empty labels unquoted by default', () => {
        expect(quoteString('field')).toBe('field')
    })

    it('wraps non-empty labels when quoted is true', () => {
        expect(quoteString('field', true)).toBe('"field"')
    })

    it('always wraps empty labels so the colon renders cleanly', () => {
        expect(quoteString('')).toBe('""')
        expect(quoteString('', true)).toBe('""')
    })
})

describe('quoteStringValue', () => {
    it('returns the raw value unquoted when neither flag is set', () => {
        expect(quoteStringValue('hi', false, false)).toBe('hi')
    })

    it('wraps with double quotes when quoted is true', () => {
        expect(quoteStringValue('hi', true, false)).toBe('"hi"')
    })

    it('uses JSON.stringify when stringify is true, overriding quoted', () => {
        expect(quoteStringValue('a\nb\t"c"', false, true)).toBe('"a\\nb\\t\\"c\\""')
        expect(quoteStringValue('a\nb', true, true)).toBe('"a\\nb"')
    })

    it('returns an empty string unwrapped when quoted is false', () => {
        expect(quoteStringValue('', false, false)).toBe('')
    })

    it('wraps empty string when quoted is true', () => {
        expect(quoteStringValue('', true, false)).toBe('""')
    })
})
