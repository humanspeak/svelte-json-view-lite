<script lang="ts">
    import { defaultStyles, JsonView } from '$lib/index.js'

    /**
     * Visual harness for issue #21 — "collapsed nodes eagerly allocate their
     * full children tuple array."
     *
     * The waste is invisible in the rendered tree, so we instrument every
     * child value with a getter that ticks a probe. The big counter below is
     * a live read of that probe: how many child *values* the render actually
     * touched. A collapsed tree should touch ZERO — it only needs the child
     * *count* to know it isn't empty.
     *
     *   RED  = child values read while collapsed  -> wasted allocations (the bug)
     *   GREEN = 0 reads while collapsed            -> lazy materialization (fixed)
     */
    const ELEMENT_COUNT = 1000

    const probe = { reads: 0 }

    function countingObject(size: number): Record<string, number> {
        const obj: Record<string, number> = {}
        for (let i = 0; i < size; i++) {
            Object.defineProperty(obj, `record_${String(i).padStart(4, '0')}`, {
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

    const payload = countingObject(ELEMENT_COUNT)

    const collapseRoot = () => false
    const expandRoot = () => true

    let open = $state(false)
    let reads = $state(0)

    // `everExpanded` latches once the tree has been opened: reads after an
    // expand are the *cached* tuple array (built lazily, kept), not waste. The
    // effect also mirrors `probe.reads` — which the just-completed render pass
    // populated — into reactive state so the counter updates live.
    let everExpanded = $state(false)
    $effect(() => {
        if (open) everExpanded = true
        reads = probe.reads
    })

    // One partition drives the meter color, the badge, and the test hook.
    //   lazy   = collapsed, never opened, 0 reads     -> the fix working
    //   wasted = collapsed, never opened, reads > 0   -> the #21 bug
    //   cached = collapsed after an open              -> materialized once, kept
    //   open   = expanded
    const status = $derived(open ? 'open' : everExpanded ? 'cached' : reads > 0 ? 'wasted' : 'lazy')
</script>

<svelte:head>
    <title>Lazy children — issue #21</title>
</svelte:head>

<main>
    <h1>Issue #21 · Lazy children materialization</h1>
    <p class="blurb">
        A {ELEMENT_COUNT.toLocaleString()}-key object where every value is instrumented. The counter
        is a live read of how many child <em>values</em> the render touched. Collapsed, it should be
        <strong>0</strong> — the node only needs the child <em>count</em>.
    </p>

    <section class="meter {status}" data-testid="meter">
        <div class="meter-main">
            <div class="stat">
                <span class="stat-num" data-testid="read-count">{reads.toLocaleString()}</span>
                <span class="stat-cap">child values read</span>
            </div>
            <div class="stat muted">
                <span class="stat-num" data-testid="element-count"
                    >{ELEMENT_COUNT.toLocaleString()}</span
                >
                <span class="stat-cap">elements in tree</span>
            </div>
            <div class="stat muted">
                <span class="stat-num">{open ? 'OPEN' : 'COLLAPSED'}</span>
                <span class="stat-cap">root state</span>
            </div>
        </div>

        <div class="badge" data-testid="status" data-state={status}>
            {#if status === 'wasted'}
                ⚠ WASTED — {reads.toLocaleString()} allocations while collapsed
            {:else if status === 'lazy'}
                ✓ LAZY — 0 allocations while collapsed
            {:else if status === 'cached'}
                ◆ CACHED — materialized once, kept across collapse (no re-read)
            {:else}
                ● MATERIALIZED — {reads.toLocaleString()} values (expected while open)
            {/if}
        </div>
    </section>

    <div class="controls">
        <button data-testid="expand-root" onclick={() => (open = true)} disabled={open}>
            ▸ Expand root
        </button>
        <button data-testid="collapse-root" onclick={() => (open = false)} disabled={!open}>
            ▾ Collapse root
        </button>
        <button data-testid="reset" onclick={() => location.reload()}> ↻ Reset (reload) </button>
    </div>

    <div class="tree">
        <!-- One instance; only the shouldExpandNode identity swaps, so the node
             expands/collapses in place instead of remounting (which would
             double-count reads). -->
        <JsonView
            data={payload}
            style={defaultStyles}
            shouldExpandNode={open ? expandRoot : collapseRoot}
        />
    </div>
</main>

<style>
    main {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1.5rem 4rem;
        font-family: system-ui, sans-serif;
        color: #1a1a1a;
    }
    h1 {
        font-size: 1.4rem;
        margin: 0 0 0.5rem;
    }
    .blurb {
        color: #555;
        line-height: 1.5;
        margin: 0 0 1.5rem;
    }

    .meter {
        border: 3px solid #888;
        border-radius: 12px;
        padding: 1.5rem 1.75rem;
        transition:
            background 0.25s ease,
            border-color 0.25s ease;
        background: #f3f4f6;
    }
    .meter.wasted {
        border-color: #dc2626;
        background: #fee2e2;
        animation: pulse-red 1.1s ease-in-out infinite;
    }
    .meter.lazy {
        border-color: #16a34a;
        background: #dcfce7;
    }
    .meter.cached {
        border-color: #64748b;
        background: #f1f5f9;
    }
    .meter.open {
        border-color: #2563eb;
        background: #dbeafe;
    }
    @keyframes pulse-red {
        0%,
        100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.5);
        }
        50% {
            box-shadow: 0 0 0 12px rgba(220, 38, 38, 0);
        }
    }

    .meter-main {
        display: flex;
        gap: 2.5rem;
        align-items: flex-end;
        flex-wrap: wrap;
    }
    .stat {
        display: flex;
        flex-direction: column;
    }
    .stat-num {
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }
    .wasted .stat-num {
        color: #991b1b;
    }
    .stat.muted .stat-num {
        font-size: 1.75rem;
        color: #6b7280;
    }
    .stat-cap {
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #6b7280;
        margin-top: 0.35rem;
    }

    .badge {
        margin-top: 1.25rem;
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-size: 0.95rem;
        font-weight: 700;
        padding: 0.6rem 0.9rem;
        border-radius: 8px;
        display: inline-block;
    }
    .badge[data-state='wasted'] {
        background: #dc2626;
        color: #fff;
    }
    .badge[data-state='lazy'] {
        background: #16a34a;
        color: #fff;
    }
    .badge[data-state='cached'] {
        background: #64748b;
        color: #fff;
    }
    .badge[data-state='open'] {
        background: #2563eb;
        color: #fff;
    }

    .controls {
        display: flex;
        gap: 0.75rem;
        margin: 1.5rem 0;
        flex-wrap: wrap;
    }
    .controls button {
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.55rem 1rem;
        border: 2px solid #1a1a1a;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
    }
    .controls button:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
    .controls button:not(:disabled):hover {
        background: #1a1a1a;
        color: #fff;
    }

    .tree {
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 1rem 1.25rem;
        max-height: 460px;
        overflow: auto;
        background: #fff;
    }
</style>
