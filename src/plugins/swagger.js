// src/plugins/swagger.js
const fp = require('fastify-plugin');

async function swaggerPlugin (fastify) {
  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Banking API',
        description: 'Accounts, Payments, Loans',
        version: '1.0.0'
      },
      servers: [{ url: '/' }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list' }
  });
}

module.exports = fp(swaggerPlugin, { name: 'swagger' });
