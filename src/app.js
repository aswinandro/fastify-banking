// src/app.js
const fastify = require('fastify')({ logger: true });
const config = require('./config');

// expose config to plugins via fastify.config
fastify.decorate('config', config);

fastify.register(require('./plugins/db'));
fastify.register(require('./plugins/auth'));
fastify.register(require('./plugins/swagger'));
fastify.register(require('./plugins/metrics'));

// Domains
fastify.register(require('./domains/accounts'));
fastify.register(require('./domains/payments'));
fastify.register(require('./domains/loans'));

// Health
fastify.get('/health', async () => ({ status: 'ok', env: config.env }));

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
    fastify.log.info(`Server running on http://localhost:${config.port}`);
    fastify.log.info(`Docs at http://localhost:${config.port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// start only if run directly
if (require.main === module) start();

module.exports = fastify;
