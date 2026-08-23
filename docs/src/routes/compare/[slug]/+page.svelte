<script lang="ts">
    import { ComparisonPageV2, type CompareSlugLoadData } from '@humanspeak/docs-kit'
    import { comparisons, getCompetitor, ours } from '$lib/compare-data'

    const { data }: { data: CompareSlugLoadData } = $props()
    const comparison = $derived(getCompetitor(data.competitor.slug) ?? data.competitor)
    const others = $derived(comparisons.filter((c) => c.slug !== data.competitor.slug))
</script>

{#if 'relationshipLabel' in comparison && 'scopeNote' in comparison}
    <aside class="comparison-scope" aria-label="Comparison scope">
        <strong>{comparison.relationshipLabel}</strong>
        <span>{comparison.scopeNote}</span>
    </aside>
{/if}

<ComparisonPageV2 competitor={comparison} {others} {ours} getStartedHref="/docs/getting-started" />

<style>
    .comparison-scope {
        display: grid;
        grid-template-columns: minmax(180px, 0.3fr) 1fr;
        gap: 20px;
        padding: 14px 24px;
        border-bottom: 1px solid var(--brut-rule);
        background: var(--brut-accent-soft);
        color: var(--brut-ink);
        font-family: 'JetBrains Mono Variable', monospace;
        font-size: 12px;
        line-height: 1.5;
    }

    .comparison-scope strong {
        color: var(--brut-accent);
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    @media (max-width: 640px) {
        .comparison-scope {
            grid-template-columns: 1fr;
            gap: 6px;
        }
    }
</style>
