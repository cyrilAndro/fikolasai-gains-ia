import { defineConfig } from '@playwright/test';
const basePath = process.env.E2E_BASE_PATH || '/fikolasai-gains-ia/';
const baseURL = `http://127.0.0.1:4173${basePath}`;
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: false, workers: 1, timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, viewport: { width: 1440, height: 1000 },
    launchOptions: process.env.PLAYWRIGHT_CHROME_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } : {},
    trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4173 --strictPort', env: { VITE_BASE_PATH: basePath }, url: baseURL, reuseExistingServer: !process.env.CI },
});

