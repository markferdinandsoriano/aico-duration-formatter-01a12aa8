import { defineConfig } from 'vitest/config';

// Smoke tests against a deployed release (template v3+). The workspace is mounted read-only (only .aico/ is writable):
// `npm run smoke` loads this file with `--configLoader runner` (in memory; the default bundler writes
// node_modules/.vite-temp), Vite's cache lives under /tmp and Vitest's results cache is off (template v4). The
// orchestrator reads the JSON results as evidence for the QA release verification (never trusted).
export default defineConfig({
  cacheDir: '/tmp/vitest-smoke-cache',
  test: {
    cache: false,
    include: ['smoke/**/*.smoke.test.ts'],
    environment: 'node',
    testTimeout: 15_000,
    reporters: ['default', 'json'],
    outputFile: { json: '.aico/smoke-results.json' },
  },
});
