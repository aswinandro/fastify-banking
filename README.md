# Fastify Banking API

## Overview
A modular banking API built with Fastify, demonstrating:
- **Domains as plugins**: `accounts`, `payments`, `loans`
- **Shared services**: DB (in-memory), Auth (JWT), Swagger docs, Prometheus metrics
- **Schema-first** validation and API documentation
- **Authentication & Authorization** hooks
- **Ready for microservice migration**

## Features
- **Accounts**: Create, list, get, update balance
- **Payments**: Transfer between accounts
- **Loans**: Create (admin only), list, get, repay
- **Auth**: JWT-based login, role-based access
- **Metrics**: Prometheus `/metrics` endpoint
- **Docs**: Swagger UI at `/docs`

## Tech Stack
- Fastify 4
- @fastify/jwt
- @fastify/swagger + @fastify/swagger-ui
- prom-client
- dotenv

## Folder Structure
```
src/
  app.js
  config/
    index.js
  plugins/
    db.js
    auth.js
    swagger.js
    metrics.js
  domains/
    accounts/
      index.js
      schema.js
      service.js
    payments/
      index.js
      schema.js
      service.js
    loans/
      index.js
      schema.js
      service.js
```

## Setup
```bash
npm install
npm run dev
```

Environment variables (`.env`):
```env
PORT=3000
JWT_SECRET=supersecret
NODE_ENV=development
```

## Usage
1. Start server: `npm run dev`
2. Open docs: http://localhost:3000/docs
3. Authenticate via `/auth/login`:
   ```json
   { "username": "alice", "password": "password123" }
   ```
4. Use the returned token in `Authorization: Bearer <token>`

## Example Flow
1. Create two accounts
2. Transfer funds using `/payments`
3. (Admin) Create a loan for an account
4. Repay loan

## Metrics
- Visit `/metrics` for Prometheus data

## License
MIT
