<script lang="ts">
    import {
        JsonView,
        allExpanded,
        type NodeExpandingEvent
    } from '@humanspeak/svelte-json-view-lite'
    import { docsDarkJsonViewStyles, docsDefaultJsonViewStyles } from '$lib/json-view-docs-style'
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

    const style = $derived(
        mode.current === 'light' ? docsDefaultJsonViewStyles : docsDarkJsonViewStyles
    )
</script>

<div class="json-demo split click-demo">
    <div class="json-demo column">
        <div class="json-demo-controls">
            <label class="json-demo-control">
                <input type="checkbox" bind:checked={clickToExpand} />
                clickToExpandNode
            </label>
            <div class="json-demo-divider"></div>
            <div class="json-demo-control-group">
                <span>veto</span>
                <select bind:value={veto}>
                    <option value="none">Allow everything</option>
                    <option value="keep-root">Can't collapse root</option>
                    <option value="shallow-only">Block expand past level 2</option>
                    <option value="confirm">Prompt for confirmation</option>
                </select>
            </div>
        </div>
        <div class="json-demo-body">
            <JsonView
                data={payload}
                {style}
                shouldExpandNode={allExpanded}
                clickToExpandNode={clickToExpand}
                beforeExpandChange={before}
            />
        </div>
    </div>

    <aside class="json-demo-rail event-log-panel">
        <div class="json-demo-controls event-log-head">
            <span>event log</span>
            <button class="json-demo-clear" onclick={() => (log = [])}>clear</button>
        </div>
        <div class="event-log-body">
            <ul class="json-demo-log">
                {#each log as entry, index (index)}
                    <li
                        class:allow={entry.startsWith('allow')}
                        class:veto={entry.startsWith('veto')}
                    >
                        {entry}
                    </li>
                {:else}
                    <li class="empty">Click the tree to populate this log.</li>
                {/each}
            </ul>
        </div>
    </aside>
</div>
