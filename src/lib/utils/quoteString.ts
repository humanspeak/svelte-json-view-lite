/**
 * Formats a field label. Empty labels always appear quoted so the colon is
 * still rendered; non-empty labels are quoted only when the theme sets
 * `quotesForFieldNames`. Matches `react-json-view-lite` exactly.
 */
export function quoteString(value: string, quoted = false): string {
    return !value || quoted ? `"${value}"` : value
}

/**
 * Formats a string value for display. When `stringify` is true, `JSON.stringify`
 * is used to escape special characters; otherwise `quoted` simply toggles
 * surrounding quotes. Empty strings intentionally render without quotes to
 * avoid stacking quotes on inline CSS snippets.
 */
export function quoteStringValue(value: string, quoted: boolean, stringify: boolean): string {
    if (stringify) {
        return JSON.stringify(value)
    }
    return quoted ? `"${value}"` : value
}
