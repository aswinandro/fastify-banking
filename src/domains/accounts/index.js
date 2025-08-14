// src/domains/accounts/index.js
const fp = require('fastify-plugin');
const AccountsService = require('./service');
const schema = require('./schema');

async function accountsDomain (fastify) {
  const service = new AccountsService(fastify.db);

  fastify.post('/accounts', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['accounts'],
      body: schema.createAccountBody,
      response: { 201: schema.account }
    }
  }, async (req, reply) => {
    const created = await service.create(req.body);
    reply.code(201).send(created);
  });

  fastify.get('/accounts', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['accounts'], response: { 200: { type: 'array', items: schema.account } } }
  }, async (_req) => service.list());

  fastify.get('/accounts/:id', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['accounts'], params: { type: 'object', properties: { id: { type: 'string' } } }, response: { 200: schema.account } }
  }, async (req, reply) => {
    const acc = await service.get(req.params.id);
    if (!acc) return reply.code(404).send({ message: 'Not found' });
    return acc;
  });

  fastify.patch('/accounts/:id/balance', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['accounts'],
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: schema.updateBalanceBody,
      response: { 200: schema.account }
    }
  }, async (req, reply) => {
    try {
      const updated = await service.updateBalance(req.params.id, req.body.amount, req.body.operation);
      if (!updated) return reply.code(404).send({ message: 'Not found' });
      return updated;
    } catch (e) {
      return reply.code(400).send({ message: e.message });
    }
  });
}

module.exports = fp(accountsDomain, { name: 'domain-accounts' });
