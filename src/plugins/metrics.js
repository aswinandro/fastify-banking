// src/plugins/metrics.js
const fp = require('fastify-plugin');
const client = require('prom-client');

async function metricsPlugin (fastify) {
  const register = new client.Registry();
  client.collectDefaultMetrics({ register });

  const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
  });
  register.registerMetric(httpRequestDuration);

  fastify.addHook('onResponse', async (req, reply) => {
    const route = reply.context?.config?.url || req.routerPath || req.raw.url;
    if (typeof reply.getResponseTime === 'function') {
      httpRequestDuration.labels(req.method, route, reply.statusCode).observe(reply.getResponseTime() / 1000);
    }
  });

  fastify.get('/metrics', async (_req, reply) => {
    reply
      .header('Content-Type', register.contentType)
      .send(await register.metrics());
  });
}

module.exports = fp(metricsPlugin, { name: 'metrics' });
