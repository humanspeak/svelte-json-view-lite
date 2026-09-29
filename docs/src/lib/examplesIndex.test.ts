import { existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { examples } from './examplesIndex.js'

describe('examples navigation registry', () => {
    it('includes every example detail route exactly once', () => {
        const routesDirectory = resolve('docs/src/routes/examples')
        const routes = readdirSync(routesDirectory, { withFileTypes: true })
            .filter(
                (entry) =>
                    entry.isDirectory() &&
                    existsSync(join(routesDirectory, entry.name, '+page.svelte'))
            )
            .map((entry) => entry.name)
            .sort()
        const slugs = examples.map((example) => example.slug)
        expect(new Set(slugs).size).toBe(slugs.length)
        expect([...slugs].sort()).toEqual(routes)
    })
})
