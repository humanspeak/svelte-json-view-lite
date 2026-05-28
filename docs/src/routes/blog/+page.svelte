<script lang="ts">
    import { getSeoContext } from '$lib/components/contexts/Seo/Seo.context'
    import { BlogIndexV2, loadBlogPostsMdsvex } from '@humanspeak/docs-kit/blog'

    type MdsvexModule = {
        metadata?: Record<string, unknown>
    }

    const modules = import.meta.glob<MdsvexModule>('/src/routes/blog/*/+page.svx', {
        eager: true
    })
    const posts = loadBlogPostsMdsvex(modules)

    const seo = getSeoContext()
    if (seo) {
        seo.title = 'Blog | Svelte JSON View Lite'
        seo.description =
            'Notes from the @humanspeak/svelte-json-view-lite team on accessible JSON tree viewers, Svelte 5 runes, theming, and migration from React JSON viewers.'
        seo.ogTitle = 'Svelte JSON View Lite Blog'
        seo.ogTagline = 'Accessible JSON tree views for Svelte 5.'
        seo.ogFeatures = ['Svelte 5', 'ARIA Treeview', 'Snippets', 'Zero Deps']
        seo.ogSlug = 'blog'
    }
</script>

<BlogIndexV2 {posts} />
