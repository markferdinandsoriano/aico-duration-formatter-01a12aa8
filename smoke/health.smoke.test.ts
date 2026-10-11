import { describe, expect, it } from 'vitest';

// Smoke tests run against the deployed release on staging (AI Company template v3): SMOKE_BASE_URL is the new
// deployment's gateway, which serves web/dist and proxies /api/* to the API. Keep GET /health in the API.
const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:8080';

describe('health', () => {
  it('answers GET /api/health with {"status":"ok"}', async () => {
    const response = await fetch(`${base}/api/health`);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('serves the web app at /', async () => {
    const response = await fetch(`${base}/`);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type') ?? '').toContain('text/html');
  });
});
