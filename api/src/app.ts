import Fastify, { type FastifyInstance } from 'fastify';

/** Builds the API. Routes live in this function (or in plugins it registers) so tests can use `app.inject`. */
export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });
  app.get('/health', async () => ({ status: 'ok' }));
  return app;
}
