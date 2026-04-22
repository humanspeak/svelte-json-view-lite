<script lang="ts">
    import {
        JsonView,
        allExpanded,
        darkStyles,
        defaultStyles,
        type NodeExpandingEvent
    } from '@humanspeak/svelte-json-view-lite'
    import { mode } from 'mode-watcher'

    type VetoMode = 'none' | 'keep-root' | 'shallow-only' | 'confirm'

    let clickToExpand = $state(true)
    let veto = $state<VetoMode>('none')
    let log = $state<string[]>([])

    const pushLog = (entry: string) => {
        log = [entry, ...log].slice(0, 8)
    }

    const payload = {
        request: {
            id: 'req_01HX…',
            method: 'POST',
            headers: { 'content-type': 'application/json', 'x-trace-id': 't-9913' },
            body: { email: 'ada@example.com', plan: 'pro' }
        },
        response: {
            status: 201,
            headers: { 'cache-control': 'no-store' },
            body: { id: 42, createdAt: '2026-04-20T12:00:00Z' }
        },
        timing: { dnsMs: 4, tlsMs: 18, ttfbMs: 84 }
    }

    const describe = (event: NodeExpandingEvent) =>
        `${event.newExpandValue ? 'expand' : 'collapse'} ${event.field ?? '<root>'} (level ${event.level})`

    const before = (event: NodeExpandingEvent): boolean => {
        switch (veto) {
            case 'none':
                pushLog(`allow: ${describe(event)}`)
                return true
            case 'keep-root': {
                const blocked = event.level === 0 && event.newExpandValue === false
                pushLog(`${blocked ? 'veto' : 'allow'}: ${describe(event)}`)
                return !blocked
            }
            case 'shallow-only': {
                const blocked = event.newExpandValue && event.level >= 2
                pushLog(`${blocked ? 'veto' : 'allow'}: ${describe(event)}`)
                return !blocked
            }
            case 'confirm': {
                const ok = window.confirm(`Really ${describe(event)}?`)
                pushLog(`${ok ? 'allow' : 'veto'} (confirm): ${describe(event)}`)
                return ok
            }
        }
    }

    const style = $derived(mode.current === 'dark' ? darkStyles : defaultStyles)
</script>

<div
    class="border-border bg-card mx-auto grid h-[calc(100vh-10rem)] min-h-[640px] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border shadow-sm lg:grid-cols-[1fr_320px]"
>
    <div class="flex flex-col overflow-hidden">
        <div
            class="border-border bg-muted/40 flex flex-wrap items-center gap-4 border-b px-4 py-2 text-xs"
        >
            <label class="text-foreground flex items-center gap-1.5 font-medium">
                <input type="checkbox" bind:checked={clickToExpand} class="accent-brand-500" />
                clickToExpandNode
            </label>
            <div class="bg-border h-4 w-px"></div>
            <div class="flex items-center gap-1">
                <span class="text-muted-foreground font-medium">Veto:</span>
                <select
                    bind:value={veto}
                    class="border-border bg-background text-foreground rounded-md border px-2 py-1"
                >
                    <option value="none">Allow everything</option>
                    <option value="keep-root">Can't collapse root</option>
                    <option value="shallow-only">Block expand past level 2</option>
                    <option value="confirm">Prompt for confirmation</option>
                </select>
            </div>
        </div>
        <div class="bg-background flex-1 overflow-auto p-6">
            <JsonView
                data={payload}
                {style}
                shouldExpandNode={allExpanded}
                clickToExpandNode={clickToExpand}
                beforeExpandChange={before}
            />
        </div>
    </div>

    <aside
        class="border-border bg-muted/30 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l"
    >
        <div class="border-border flex items-center justify-between border-b px-4 py-2 text-xs">
            <span class="text-muted-foreground font-semibold tracking-wide uppercase">
                Event log
            </span>
            <button
                class="text-brand-500 text-xs font-medium hover:underline"
                onclick={() => (log = [])}
            >
                Clear
            </button>
        </div>
        <ul class="flex-1 space-y-1 overflow-auto p-3 font-mono text-xs">
            {#each log as entry, index (index)}
                <li
                    class="rounded px-2 py-1"
                    class:bg-green-50={entry.startsWith('allow')}
                    class:text-green-900={entry.startsWith('allow')}
                    class:bg-red-50={entry.startsWith('veto')}
                    class:text-red-900={entry.startsWith('veto')}
                >
                    {entry}
                </li>
            {:else}
                <li class="text-muted-foreground">Click the tree to populate this log.</li>
            {/each}
        </ul>
    </aside>
</div>
