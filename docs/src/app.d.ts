// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        interface Platform {
            env: {
                ASSETS: Fetcher
                PUBLIC_ENVIRONMENT: 'production'
                ENVIRONMENT: 'production'
                NODE_ENV: 'production'
            }
            cf: CfProperties
            ctx: ExecutionContext
        }
    }
}

export {}
