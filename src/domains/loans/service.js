// src/domains/loans/service.js
class LoansService {
  constructor(db) {
    this.db = db;
  }

  async create({ accountId, principal, rate, termMonths }) {
    const acc = await this.db.accounts.get(accountId);
    if (!acc) throw new Error('Invalid account');
    const loan = await this.db.loans.insert({ accountId, principal, rate, termMonths, outstanding: principal });
    return loan;
  }

  async get(id) { return this.db.loans.get(id); }
  async list() { return this.db.loans.list(); }

  async repay(id, amount) {
    const loan = await this.db.loans.get(id);
    if (!loan) return null;
    const acc = await this.db.accounts.get(loan.accountId);
    if (!acc) throw new Error('Invalid account');

    if ((acc.balance || 0) < amount) throw new Error('Insufficient account funds');
    const newOutstanding = Math.max(0, (loan.outstanding || 0) - amount);
    await this.db.accounts.update(acc.id, { balance: (acc.balance || 0) - amount });
    return this.db.loans.update(id, { outstanding: newOutstanding });
  }
}

module.exports = LoansService;
