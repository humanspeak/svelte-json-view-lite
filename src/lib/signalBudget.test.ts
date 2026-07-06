import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Reads a library component source file relative to this test file.
 *
 * @param fileName - The component file name under `src/lib`.
 * @returns The raw component source.
 */
function readComponentSource(fileName: string): string {
    return readFileSync(join(process.cwd(), 'src/lib', fileName), 'utf8')
}

/**
 * Finds top-level const declarations that allocate a Svelte `$derived` reaction.
 *
 * @param source - Raw Svelte component source.
 * @returns Declaration names in source order.
 */
function derivedDeclarationNames(source: string): string[] {
    const declarations: string[] = []
    // Tolerate an optional type annotation (`const x: T = $derived(...)`) so a
    // typed declaration can't slip past the budget check by dodging the match.
    const pattern = /\bconst\s+([A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=\s*\$derived(?:\.by)?/g
    for (const match of source.matchAll(pattern)) {
        const name = match[1]
        if (name) declarations.push(name)
    }
    return declarations
}

/**
 * Formats declaration names with stable numbers for assertion output.
 *
 * @param names - Declaration names in source order.
 * @returns A numbered multiline list for failure messages.
 */
function numberedNames(names: string[]): string {
    return names.map((name, index) => `${index + 1}. ${name}`).join('\n')
}

describe('per-node Svelte signal budgets', () => {
    test('JsonPrimitiveValue keeps leaf rows to at most three derived reactions', () => {
        const deriveds = derivedDeclarationNames(readComponentSource('JsonPrimitiveValue.svelte'))

        expect(
            deriveds.length,
            [
                'JsonPrimitiveValue should allocate at most 3 `$derived` reactions per leaf row.',
                `Found ${deriveds.length}:`,
                numberedNames(deriveds),
                'Expected budget: hasField, labelText, and one merged primitive render/snippet derived.'
            ].join('\n')
        ).toBeLessThanOrEqual(3)
    })

    test('JsonPrimitiveValue merges primitive kind, rendered text, and snippet lookup', () => {
        const splitDeriveds = derivedDeclarationNames(
            readComponentSource('JsonPrimitiveValue.svelte')
        ).filter((name) => ['kind', 'rendered', 'activeSnippet'].includes(name))

        expect(
            splitDeriveds,
            [
                'JsonPrimitiveValue should not keep primitive classification, rendered text,',
                'and snippet lookup as separate `$derived` reactions.',
                `Still split across ${splitDeriveds.length}:`,
                numberedNames(splitDeriveds),
                'Merge them into one derived object that carries kind, text, valueStyle, and snippet.'
            ].join('\n')
        ).toEqual([])
    })

    test('ExpandableObject keeps container rows to at most seven derived reactions', () => {
        const deriveds = derivedDeclarationNames(readComponentSource('ExpandableObject.svelte'))

        expect(
            deriveds.length,
            [
                'ExpandableObject should allocate at most 7 `$derived` reactions per container row.',
                `Found ${deriveds.length}:`,
                numberedNames(deriveds),
                'Expected budget after issue #23: no deriveds for childLevel, hasField, or lastIndex.'
            ].join('\n')
        ).toBeLessThanOrEqual(7)
    })

    test('ExpandableObject inlines trivial scalar deriveds', () => {
        const scalarDeriveds = derivedDeclarationNames(
            readComponentSource('ExpandableObject.svelte')
        ).filter((name) => ['childLevel', 'hasField', 'lastIndex'].includes(name))

        expect(
            scalarDeriveds,
            [
                'ExpandableObject should inline trivial scalar values instead of allocating',
                '`$derived` reactions for them.',
                `Still derived as ${scalarDeriveds.length}:`,
                numberedNames(scalarDeriveds),
                'Inline childLevel as `level + 1`, hasField as `field !== undefined`,',
                'and lastIndex as `count - 1` at the use sites.'
            ].join('\n')
        ).toEqual([])
    })
})
