<script lang="ts">
    import { ComparisonPageV2, type CompareSlugLoadData } from '@humanspeak/docs-kit'
    import { comparisons, getCompetitor, ours } from '$lib/compare-data'

    const { data }: { data: CompareSlugLoadData } = $props()
    const evidence = $derived(getCompetitor(data.competitor.slug))
    const comparison = $derived(getCompetitor(data.competitor.slug) ?? data.competitor)
    const others = $derived(comparisons.filter((c) => c.slug !== data.competitor.slug))
    const isUpstream = $derived(
        'relationship' in comparison && comparison.relationship === 'upstream'
    )
</script>

{#if 'relationshipLabel' in comparison && 'scopeNote' in comparison}
    <aside class="comparison-scope" aria-label="Comparison scope">
        <strong>{comparison.relationshipLabel}</strong>
        <span>{comparison.scopeNote}</span>
    </aside>
{/if}

<div
    class="comparison-content"
    class:long-package-name={comparison.npm === '@zerodevx/svelte-json-view'}
>
    <ComparisonPageV2
        competitor={comparison}
        {others}
        {ours}
        getStartedHref={isUpstream ? '/docs/migration' : '/docs/getting-started'}
        footerCta={isUpstream
            ? {
                  href: '/docs/migration',
                  label: { prefix: 'migrate to ', accent: 'svelte 5' },
                  hint: 'keep the familiar API'
              }
            : undefined}
    />
</div>

{#if evidence?.sources?.length}
    <section class="comparison-evidence" aria-labelledby="comparison-sources">
        <h2 id="comparison-sources">Sources and verification</h2>
        <p>{evidence.verifiedAgainst}</p>
        <ul>
            {#each evidence.sources as source (source.href)}
                <li><a href={source.href}>{source.label}</a></li>
            {/each}
        </ul>
    </section>
{/if}

<style>
    .comparison-content :global(.brut-hero .hero-body) {
        min-width: 0;
    }

    .comparison-content :global(.brut-hero h1) {
        overflow-wrap: anywhere;
    }

    .long-package-name :global(.brut-hero h1) {
        font-size: clamp(2rem, 6vw, 6rem);
    }

    .comparison-evidence {
        padding: 24px;
        border-top: 1px solid var(--brut-rule);
        background: var(--brut-bg);
        color: var(--brut-ink);
        overflow-wrap: anywhere;
    }

    .comparison-evidence h2 {
        font-size: 1.2rem;
        font-weight: 600;
    }

    .comparison-evidence p,
    .comparison-evidence ul {
        margin-top: 12px;
        line-height: 1.6;
    }

    .comparison-evidence a {
        color: var(--brut-accent);
        text-decoration: underline;
    }

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
