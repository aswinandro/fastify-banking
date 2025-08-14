// src/domains/loans/index.js
const fp = require('fastify-plugin');
const LoansService = require('./service');
const schema = require('./schema');

async function loansDomain (fastify) {
  const service = new LoansService(fastify.db);

  fastify.post('/loans', {
    preValidation: [fastify.authorize(['admin'])],
    schema: { tags: ['loans'], body: schema.createLoanBody, response: { 201: schema.loan } }
  }, async (req, reply) => {
    try {
      const created = await service.create(req.body);
      reply.code(201).send(created);
    } catch (e) {
      reply.code(400).send({ message: e.message });
    }
  });

  fastify.get('/loans', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['loans'], response: { 200: { type: 'array', items: schema.loan } } }
  }, async () => service.list());

  fastify.get('/loans/:id', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['loans'], params: { type: 'object', properties: { id: { type: 'string' } } }, response: { 200: schema.loan } }
  }, async (req, reply) => {
    const l = await service.get(req.params.id);
    if (!l) return reply.code(404).send({ message: 'Not found' });
    return l;
  });

  fastify.post('/loans/:id/repay', {
    preValidation: [fastify.authenticate],
    schema: {
      tags: ['loans'],
      params: { type: 'object', properties: { id: { type: 'string' } } },
      body: schema.repayBody,
      response: { 200: schema.loan }
    }
  }, async (req, reply) => {
    try {
      const updated = await service.repay(req.params.id, req.body.amount);
      if (!updated) return reply.code(404).send({ message: 'Not found' });
      return updated;
    } catch (e) {
      reply.code(400).send({ message: e.message });
    }
  });
}

module.exports = fp(loansDomain, { name: 'domain-loans' });
