# Project

Created by AI Company from its project template.

- `api/`: a Fastify JSON API (TypeScript).
- `web/`: a Vite + React web app (TypeScript).

```bash
npm ci
npm run build
npm run lint
npm test
npm run smoke   # against a deployed release: SMOKE_BASE_URL=http://127.0.0.1:8080
```

Conventions the platform relies on when it deploys a release (template v3+; v4 runs smoke on a read-only workspace):

- The API listens on `PORT` and keeps `GET /health` answering `{"status":"ok"}`.
- The web app calls the API under `/api` (the dev server and the platform gateway proxy `/api/*` to the API).
- Smoke tests live in `smoke/**/*.smoke.test.ts`; `npm test` does not run them.

Dependencies and lockfile are managed by people, not agents: changes to `package.json`, `package-lock.json`, CI
workflows, `.npmrc`, the lint and test configuration (`eslint.config.js`, `vitest.config.ts`, `vitest.config.smoke.ts`) and `.aico/`
are refused by the orchestrator's change rules.
