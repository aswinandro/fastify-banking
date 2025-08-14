// src/app.js
'use strict';

const fastify = require('fastify')({ logger: true });

// ✅ Register config plugin first so 'auth' can use it
fastify.register(require('./plugins/config'));

// Register other plugins
fastify.register(require('./plugins/db'));
fastify.register(require('./plugins/auth'));
fastify.register(require('./plugins/swagger'));
fastify.register(require('./plugins/metrics'));

// Domains (business modules)
fastify.register(require('./domains/accounts'));
fastify.register(require('./domains/payments'));
fastify.register(require('./domains/loans'));

// Health check endpoint
fastify.get('/health', async (req, reply) => ({
  status: 'ok',
  env: fastify.config.env
}));

// Start server
const start = async () => {
  try {
    // ✅ Ensure all plugins are loaded so fastify.config exists
    await fastify.ready();

    await fastify.listen({
      port: fastify.config.port,
      host: '0.0.0.0'
    });

    fastify.log.info(`Server running on http://localhost:${fastify.config.port}`);
    fastify.log.info(`Docs available at http://localhost:${fastify.config.port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Start only if run directly
if (require.main === module) {
  start();
}

module.exports = fastify;
