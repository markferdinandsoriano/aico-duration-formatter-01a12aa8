import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['api/src/**/*.test.ts', 'web/src/**/*.test.{ts,tsx}'],
    environment: 'node',
    // The orchestrator reads the JSON results as evidence for the QA review (never trusted, size-capped).
    reporters: ['default', 'json'],
    outputFile: { json: '.aico/test-results.json' },
  },
});
