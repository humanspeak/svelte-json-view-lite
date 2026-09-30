import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript-eslint'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))
const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))
const typescriptFiles = ['**/*.{ts,tsx,mts,cts}', '**/*.svelte']
const packageFiles = ['src/lib/**/*.{ts,js,svelte}']
const packageTestFiles = [
    'src/lib/test/**',
    'src/lib/**/*.test.*',
    'src/lib/**/*.spec.*',
    'src/lib/**/*.d.ts'
]
const unusedVariables = {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true
}

export default defineConfig([
    includeIgnoreFile(gitignorePath),
    {
        name: 'project/ignores',
        ignores: [
            '**/.DS_Store',
            '**/node_modules/**',
            '**/coverage/**',
            '**/build/**',
            '**/.svelte-kit/**',
            '**/dist/**',
            '**/worker-configuration.d.ts',
            '**/.env',
            '**/.env.*',
            '!**/.env.example',
            '**/pnpm-lock.yaml',
            '**/package-lock.json',
            '**/yarn.lock'
        ]
    },
    js.configs.recommended,
    {
        name: 'project/typescript',
        files: typescriptFiles,
        extends: [ts.configs.recommended],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir,
                extraFileExtensions: ['.svelte']
            }
        },
        rules: {
            // The TypeScript rule understands type-only declarations and parameter properties.
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', unusedVariables],
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true
                }
            ]
        }
    },
    ...svelte.configs['flat/recommended'],
    {
        name: 'project/rules',
        rules: {
            'guard-for-in': 'warn',
            camelcase: 'error',
            'no-unneeded-ternary': 'warn',
            'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
            'no-var': 'error',
            'prefer-const': 'error'
        }
    },
    {
        name: 'project/javascript-unused-variables',
        files: ['**/*.{js,mjs,cjs}'],
        rules: {
            'no-unused-vars': ['warn', unusedVariables]
        }
    },
    {
        name: 'project/browser',
        files: ['src/**/*.{js,ts,svelte}', 'docs/src/**/*.{js,ts,svelte}'],
        languageOptions: {
            globals: globals.browser
        }
    },
    {
        name: 'project/node',
        files: [
            '*.{js,mjs,cjs,ts}',
            'scripts/**/*.{js,mjs,cjs,ts}',
            'docs/*.{js,mjs,cjs,ts}',
            'docs/scripts/**/*.{js,mjs,cjs,ts}',
            'tests/**/*.{js,ts}'
        ],
        languageOptions: {
            globals: globals.node
        }
    },
    {
        name: 'project/test-browser',
        files: ['**/*.{test,spec}.{js,ts}', 'vitest.setup.ts'],
        languageOptions: {
            globals: globals.browser
        }
    },
    {
        name: 'project/svelte',
        files: ['**/*.svelte', '**/*.svelte.ts'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        },
        rules: {
            // Svelte runes and template bindings can require mutable declarations.
            'prefer-const': 'off',
            'svelte/no-navigation-without-resolve': 'off'
        }
    },
    {
        name: 'project/package-quality',
        files: packageFiles,
        ignores: packageTestFiles,
        rules: {
            // Count each switch once, regardless of case count.
            complexity: ['error', { max: 15, variant: 'modified' }]
        }
    },
    {
        name: 'project/package-type-checked',
        files: ['src/lib/**/*.{ts,svelte}'],
        ignores: packageTestFiles,
        languageOptions: {
            parserOptions: {
                projectService: true
            }
        },
        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error'
        }
    },
    // Keep formatting compatibility last so later rules cannot conflict with Prettier.
    prettier,
    ...svelte.configs['flat/prettier']
])
