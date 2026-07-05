import '@testing-library/jest-dom/vitest'
import { fireEvent, render } from '@testing-library/svelte'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaultStyles, JsonView } from './index.js'

/**
 * Regression tests for issue #21 — collapsed nodes must not eagerly
 * materialize their children tuple array.
 *
 * The waste is invisible in the DOM (a collapsed node renders no child
 * rows either way), so we make it *observable*: build the payload out of
 * accessor-instrumented values and count how many child values the render
 * actually touches. A collapsed node should read the *count* of its
 * children (to know it isn't empty) but never the child *values*.
 *
 * Before the fix, DataRender eagerly builds `Array<[key, value]>` for every
 * node — so every child value is read at mount even when collapsed.
 */

type Probe = { reads: number }

/** An object whose value getters tick the probe on every read. */
function countingObject(size: number, probe: Probe): Record<string, number> {
    const obj: Record<string, number> = {}
    for (let i = 0; i < size; i++) {
        Object.defineProperty(obj, `record_${i}`, {
            enumerable: true,
            configurable: true,
            get() {
                probe.reads++
                return i
            }
        })
    }
    return obj
}

/** An array whose indexed reads tick the probe (via a Proxy). */
function countingArray(size: number, probe: Probe): number[] {
    const base = Array.from({ length: size }, (_, i) => i)
    return new Proxy(base, {
        get(target, prop, receiver) {
            if (typeof prop === 'string' && /^\d+$/.test(prop)) probe.reads++
            return Reflect.get(target, prop, receiver)
        }
    })
}

const collapseRoot = () => false
const expandRoot = () => true

beforeEach(() => {
    vi.useRealTimers()
})

describe('DataRender lazy children materialization (issue #21)', () => {
    it('reads zero child values while an object node is collapsed', () => {
        const probe: Probe = { reads: 0 }
        const data = countingObject(500, probe)

        render(JsonView, {
            props: { data, style: defaultStyles, shouldExpandNode: collapseRoot }
        })

        // A collapsed node needs only its child *count*, never the values.
        expect(probe.reads).toBe(0)
    })

    it('reads zero child values while an array node is collapsed', () => {
        const probe: Probe = { reads: 0 }
        const data = countingArray(500, probe)

        render(JsonView, {
            props: { data, style: defaultStyles, shouldExpandNode: collapseRoot }
        })

        expect(probe.reads).toBe(0)
    })

    it('reads each child value exactly once when the node is expanded', () => {
        const probe: Probe = { reads: 0 }
        const data = countingObject(64, probe)

        render(JsonView, {
            props: { data, style: defaultStyles, shouldExpandNode: expandRoot }
        })

        // Expanding materializes the tuple array once — every value read a
        // single time, no more.
        expect(probe.reads).toBe(64)
    })

    it('does not re-read child values when a node is collapsed and re-expanded', async () => {
        const probe: Probe = { reads: 0 }
        const data = countingObject(32, probe)

        const { container } = render(JsonView, {
            props: { data, style: defaultStyles, shouldExpandNode: expandRoot }
        })
        expect(probe.reads).toBe(32)

        const rootButton = container.querySelector<HTMLElement>('[role="button"]')
        expect(rootButton).not.toBeNull()

        // Collapse then re-expand: the tuple array was materialized on the
        // first open and is kept, so toggling must not re-read the values.
        await fireEvent.click(rootButton as HTMLElement)
        await fireEvent.click(rootButton as HTMLElement)
        expect(probe.reads).toBe(32)
    })
})
