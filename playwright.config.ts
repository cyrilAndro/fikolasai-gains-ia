import { defineConfig } from '@playwright/test';
const basePath = process.env.E2E_BASE_PATH || '/fikolasai-gains-ia/';
const port = process.env.E2E_PORT || '4173';
const baseURL = `http://127.0.0.1:${port}${basePath}`;
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, locale: 'fr-FR', viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {},
    trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: `node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port ${port} --strictPort`, env: { VITE_BASE_PATH: basePath }, url: baseURL, reuseExistingServer: !process.env.CI },
});

