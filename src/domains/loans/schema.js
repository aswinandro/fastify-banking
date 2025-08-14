// src/domains/loans/schema.js
const loan = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    principal: { type: 'number' },
    rate: { type: 'number', description: 'Annual interest rate (e.g., 0.12 for 12%)' },
    termMonths: { type: 'integer' },
    outstanding: { type: 'number' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  }
};

const createLoanBody = {
  type: 'object',
  required: ['accountId', 'principal', 'rate', 'termMonths'],
  properties: {
    accountId: { type: 'string' },
    principal: { type: 'number', exclusiveMinimum: 0 },
    rate: { type: 'number', minimum: 0 },
    termMonths: { type: 'integer', minimum: 1 }
  }
};

const repayBody = {
  type: 'object',
  required: ['amount'],
  properties: { amount: { type: 'number', exclusiveMinimum: 0 } }
};

module.exports = { loan, createLoanBody, repayBody };
