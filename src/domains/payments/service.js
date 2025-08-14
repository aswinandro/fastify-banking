// src/domains/payments/service.js
class PaymentsService {
  constructor(db) {
    this.db = db;
  }

  async create({ fromAccountId, toAccountId, amount }) {
    const from = await this.db.accounts.get(fromAccountId);
    const to = await this.db.accounts.get(toAccountId);
    if (!from || !to) throw new Error('Invalid account');
    if ((from.balance || 0) < amount) throw new Error('Insufficient funds');
    await this.db.accounts.update(from.id, { balance: (from.balance || 0) - amount });
    await this.db.accounts.update(to.id, { balance: (to.balance || 0) + amount });
    const payment = await this.db.payments.insert({ fromAccountId, toAccountId, amount });
    return payment;
  }

  async get(id) { return this.db.payments.get(id); }
  async list() { return this.db.payments.list(); }
}

module.exports = PaymentsService;
