<script lang="ts">
    import { docsSections } from '$lib/docsNav'
</script>

<div class="prose dark:prose-invert mx-auto max-w-3xl px-6 py-10">
    <h1>Documentation</h1>
    <p>
        Pick a section to dive in. The full guide ships in the next commit — these stubs let the
        sidebar render and the SvelteKit build succeed in the meantime.
    </p>

    <ul>
        {#each docsSections as section (section.title)}
            <li>
                <strong>{section.title}</strong>
                <ul>
                    {#each section.items as item (item.href)}
                        <li><a href={item.href}>{item.title}</a></li>
                    {/each}
                </ul>
            </li>
        {/each}
    </ul>
</div>
