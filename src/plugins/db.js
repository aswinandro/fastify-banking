// src/plugins/db.js
const fp = require('fastify-plugin');

/**
 * A minimal in-memory DB layer to keep the example self-contained.
 * Swap with a real DB (Postgres, MySQL, Mongo) later and preserve the interface.
 */
async function dbPlugin (fastify) {
  const stores = {
    accounts: new Map(),
    payments: new Map(),
    loans: new Map(),
  };

  // simple id generator
  const genId = () => Math.random().toString(36).slice(2, 10);

  const wrap = (name) => ({
    insert: async (data) => {
      const id = data.id || genId();
      const now = new Date().toISOString();
      const record = { id, createdAt: now, updatedAt: now, ...data };
      stores[name].set(id, record);
      return record;
    },
    update: async (id, patch) => {
      const current = stores[name].get(id);
      if (!current) return null;
      const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
      stores[name].set(id, updated);
      return updated;
    },
    get: async (id) => stores[name].get(id) || null,
    list: async () => Array.from(stores[name].values()),
    remove: async (id) => stores[name].delete(id),
  });

  const db = {
    accounts: wrap('accounts'),
    payments: wrap('payments'),
    loans: wrap('loans'),
    _stores: stores, // exposed for demo/tests only
  };

  fastify.decorate('db', db);
}

module.exports = fp(dbPlugin, {
  name: 'db',
});
