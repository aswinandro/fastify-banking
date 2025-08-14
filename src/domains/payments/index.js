// src/domains/payments/index.js
const fp = require('fastify-plugin');
const PaymentsService = require('./service');
const schema = require('./schema');

async function paymentsDomain (fastify) {
  const service = new PaymentsService(fastify.db);

  fastify.post('/payments', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['payments'], body: schema.createPaymentBody, response: { 201: schema.payment } }
  }, async (req, reply) => {
    try {
      const created = await service.create(req.body);
      reply.code(201).send(created);
    } catch (e) {
      reply.code(400).send({ message: e.message });
    }
  });

  fastify.get('/payments', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['payments'], response: { 200: { type: 'array', items: schema.payment } } }
  }, async () => service.list());

  fastify.get('/payments/:id', {
    preValidation: [fastify.authenticate],
    schema: { tags: ['payments'], params: { type: 'object', properties: { id: { type: 'string' } } }, response: { 200: schema.payment } }
  }, async (req, reply) => {
    const p = await service.get(req.params.id);
    if (!p) return reply.code(404).send({ message: 'Not found' });
    return p;
  });
}

module.exports = fp(paymentsDomain, { name: 'domain-payments' });
