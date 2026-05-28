<script lang="ts">
    import {
        JsonView,
        allExpanded,
        darkStyles,
        defaultStyles
    } from '@humanspeak/svelte-json-view-lite'
    import { mode } from 'mode-watcher'

    const payload = {
        tree: {
            role: 'tree',
            keyboard: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Space'],
            nodes: [
                {
                    label: 'request',
                    expanded: true,
                    controls: 'request-panel',
                    children: ['headers', 'body', 'metadata']
                },
                {
                    label: 'response',
                    expanded: true,
                    controls: 'response-panel',
                    children: ['status', 'headers', 'body']
                }
            ]
        },
        aria: {
            labelledBy: 'json-tree-label',
            expandedState: 'mirrors disclosure state',
            focus: 'roving tabindex inside the viewer'
        }
    }

    const style = $derived(mode.current === 'light' ? defaultStyles : darkStyles)
</script>

<div class="json-demo grid">
    <aside class="json-demo-rail">
        <p class="json-demo-k">Accessibility contract</p>
        <h3>Keyboard-ready JSON trees</h3>
        <p>
            The viewer renders nested objects and arrays as an ARIA tree, with disclosure state,
            labels, and scoped keyboard navigation handled by the component.
        </p>
        <ul class="json-demo-list">
            <li>role="tree"</li>
            <li>aria-expanded on branch nodes</li>
            <li>aria-controls from generated ids</li>
            <li>roving tabindex for node controls</li>
        </ul>
    </aside>

    <div class="json-demo-body">
        <JsonView data={payload} {style} shouldExpandNode={allExpanded} />
    </div>
</div>
