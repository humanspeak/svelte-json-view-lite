import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        port: 8234,
        fs: {
            // Allow the docs site to import from the sibling library and
            // the root-level test/ playground (used as a fixture source).
            allow: ['..']
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Heavy deps isolated so they only load on pages that need them.
                    if (id.includes('node_modules/shiki')) {
                        return 'shiki'
                    }
                }
            }
        }
    }
})
