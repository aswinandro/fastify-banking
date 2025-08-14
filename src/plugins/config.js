// src/plugins/config.js
const fp = require('fastify-plugin')
const dotenv = require('dotenv')

dotenv.config()

module.exports = fp(async function (fastify) {
  const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-super-secret-change-me'
    },
  }

  fastify.decorate('config', config)
}, {
  name: 'config'
})
