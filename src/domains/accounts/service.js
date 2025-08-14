// src/domains/accounts/service.js
class AccountsService {
  constructor(db) {
    this.db = db;
  }

  async create(data) {
    const account = await this.db.accounts.insert({ ...data, balance: data.balance ?? 0 });
    return account;
  }

  async get(id) {
    return this.db.accounts.get(id);
  }

  async list() {
    return this.db.accounts.list();
  }

  async updateBalance(id, amount, operation = 'deposit') {
    const acc = await this.db.accounts.get(id);
    if (!acc) return null;
    let balance = acc.balance || 0;
    if (operation === 'withdraw') {
      if (balance < amount) throw new Error('Insufficient funds');
      balance -= amount;
    } else {
      balance += amount;
    }
    return this.db.accounts.update(id, { balance });
  }
}

module.exports = AccountsService;
