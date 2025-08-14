// src/domains/accounts/schema.js
const account = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    balance: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  }
};

const createAccountBody = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    balance: { type: 'number', minimum: 0, default: 0 }
  }
};

const updateBalanceBody = {
  type: 'object',
  required: ['amount'],
  properties: {
    amount: { type: 'number' },
    operation: { type: 'string', enum: ['deposit', 'withdraw'], default: 'deposit' }
  }
};

module.exports = {
  account,
  createAccountBody,
  updateBalanceBody
};
