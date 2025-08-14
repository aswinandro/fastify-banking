// src/plugins/auth.js
const fp = require('fastify-plugin');

const USERS = [
  // demo users (passwords are plaintext for demo only)
  { id: 'u1', username: 'alice', password: 'password123', role: 'user' },
  { id: 'u2', username: 'admin', password: 'admin123', role: 'admin' },
];

async function authPlugin(fastify, opts) {
  const { secret } = fastify.config.jwt;

  await fastify.register(require('@fastify/jwt'), { secret });

  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  });

  fastify.decorate('authorize', function(requiredRoles = []) {
    return async function (request, reply) {
      try {
        await request.jwtVerify();
        if (requiredRoles.length === 0) return;
        const { role } = request.user || {};
        if (!requiredRoles.includes(role)) {
          return reply.code(403).send({ message: 'Forbidden' });
        }
      } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
    };
  });

  // Simple login route for demo
  fastify.post('/auth/login', {
    schema: {
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { username, password } = request.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) return reply.code(401).send({ message: 'Invalid credentials' });
    const token = fastify.jwt.sign({ sub: user.id, username: user.username, role: user.role });
    return { token };
  });
}

module.exports = fp(authPlugin, { name: 'auth', dependencies: ['config'] });
