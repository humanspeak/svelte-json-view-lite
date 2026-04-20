import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    reporter: [['junit', { outputFile: 'test-results/junit-playwright.xml' }]],
    retries: process.env.CI ? 2 : 0,
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173,
        timeout: 120000,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe'
    },
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'on-first-retry'
    },
    timeout: 60000,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        },
        {
            // Tests tagged @desktop-only skip mobile — real arrow-key nav
            // and pixel-level computed-style assertions are noise on a
            // touch-device emulator.
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
            grepInvert: /@desktop-only/
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
            grepInvert: /@desktop-only/
        }
    ]
})
