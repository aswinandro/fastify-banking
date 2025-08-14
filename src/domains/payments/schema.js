// src/domains/payments/schema.js
const payment = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    fromAccountId: { type: 'string' },
    toAccountId: { type: 'string' },
    amount: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  }
};

const createPaymentBody = {
  type: 'object',
  required: ['fromAccountId', 'toAccountId', 'amount'],
  properties: {
    fromAccountId: { type: 'string' },
    toAccountId: { type: 'string' },
    amount: { type: 'number', exclusiveMinimum: 0 }
  }
};

module.exports = { payment, createPaymentBody };
