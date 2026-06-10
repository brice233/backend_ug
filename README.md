# Herbal Medicine Backend

A RESTful API for a natural herbal medicine platform built with **Node.js (Express)** and **MySQL 8**. It manages herbal Health, news posts, and user accounts with role-based access control, a content moderation workflow, JWT authentication, and interactive Swagger documentation.

---

## Prerequisites

- **Node.js** 20 LTS or later
- **MySQL** 8.0 or later
- **npm** 9 or later (bundled with Node.js 20)

---

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

## Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and update each variable:

| Variable        | Description                                              | Example                                  |
|-----------------|----------------------------------------------------------|------------------------------------------|
| `PORT`          | Port the HTTP server listens on                          | `3000`                                   |
| `DB_HOST`       | MySQL host                                               | `localhost`                              |
| `DB_PORT`       | MySQL port                                               | `3306`                                   |
| `DB_USER`       | MySQL username                                           | `root`                                   |
| `DB_PASSWORD`   | MySQL password                                           | `your_password`                          |
| `DB_NAME`       | Name of the MySQL database                               | `herbal_medicine_db`                     |
| `JWT_SECRET`    | Secret key for signing JWTs (minimum 32 characters)      | `your_super_secret_jwt_key_minimum_32_chars` |
| `ADMIN_NAME`    | Display name for the seeded admin account                | `Admin`                                  |
| `ADMIN_EMAIL`   | Email address for the seeded admin account               | `admin@herbalmed.com`                    |
| `ADMIN_PASSWORD`| Plaintext password for the seeded admin account          | `Admin@1234`                             |

---

## Database Setup

Create the database manually before running migrations:

```sql
CREATE DATABASE herbal_medicine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or using the MySQL CLI:

```bash
mysql -u root -p -e "CREATE DATABASE herbal_medicine_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## Running Migrations

Apply all schema migrations in order:

```bash
npm run migrate
```

This creates the `users`, `Health`, and `news_posts` tables. Each applied migration prints a confirmation message to the terminal.

To roll back all managed tables (drops them in reverse dependency order):

```bash
node src/migrations/rollback.js
```

---

## Running Seeders

Populate the database with sample data:

```bash
npm run seed
```

This inserts:
- 1 admin user + 3 regular users (credentials driven by `.env`)
- 10 herbal medicine records (status: published)
- 5 news post records (status: published)

The admin credentials are printed to the terminal on every server startup so you can log in immediately.

---

## Starting the Server

**Production mode:**

```bash
npm start
```

**Development mode** (auto-restarts on file changes via nodemon):

```bash
npm run dev
```

On startup the server prints:

```
[DB] Connected to MySQL database: herbal_medicine_db
[Server] Running on https://backend.Healthcare.ug
[Swagger] Docs available at https://backend.Healthcare.ug/api-docs
[Admin] Email: admin@herbalmed.com
[Admin] Password: Admin@1234
```

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:<PORT>/api-docs
```

The documentation covers all endpoints grouped by tag (`Auth`, `Users`, `Health`, `News`, `Moderation`), including request/response schemas, authentication requirements, and HTTP status codes. You can send authenticated requests directly from the browser using the **Authorize** button with a Bearer JWT.

---

## Running Tests

Run the full test suite:

```bash
npm test
```

Run only unit tests:

```bash
npm run test:unit
```

Run only integration tests:

```bash
npm run test:integration
```

Run only property-based tests:

```bash
npm run test:property
```

> **Note:** Integration and property-based tests require a running MySQL instance. Configure a separate test database in your `.env` (or a dedicated `.env.test`) to avoid polluting development data.

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # DB pool and Swagger configuration
│   ├── controllers/     # Request handlers (business logic)
│   ├── middleware/      # authenticate, requireRole, validate, errorHandler
│   ├── models/          # SQL query functions (mysql2 pool)
│   ├── routes/          # Express routers with Swagger JSDoc annotations
│   ├── migrations/      # Versioned schema migration scripts
│   ├── seeders/         # Sample data seeder scripts
│   └── docs/            # Generated OpenAPI spec output
├── tests/
│   ├── unit/            # Unit tests for middleware and models
│   ├── integration/     # End-to-end HTTP tests via supertest
│   ├── property/        # Property-based tests via fast-check
│   └── setup/           # Test DB helpers and data factories
├── app.js               # Express app setup (no listen call)
├── server.js            # Entry point — starts the HTTP server
├── migrate.js           # CLI script to run migrations
├── seed.js              # CLI script to run seeders
├── .env.example         # Environment variable template
└── package.json
```

---

## API Overview

All endpoints are prefixed with `/api/v1`.

| Resource     | Public endpoints                        | Authenticated endpoints              | Admin-only endpoints                          |
|--------------|-----------------------------------------|--------------------------------------|-----------------------------------------------|
| Auth         | POST /auth/register, POST /auth/login   | —                                    | —                                             |
| Users        | —                                       | —                                    | GET/PATCH/DELETE /users, GET /users/:id       |
| Health    | GET /Health, GET /Health/:id      | POST /Health                      | PUT/DELETE /Health/:id                     |
| News         | GET /news, GET /news/:id                | POST /news                           | PUT/DELETE /news/:id                          |
| Moderation   | —                                       | —                                    | GET /moderation/queue, PATCH approve/reject   |
