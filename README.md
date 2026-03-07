# Vehicle Rental Backend

Backend service for the Vehicle Rental System using Clean Architecture with Repository Pattern.

## Stack

- Node.js + TypeScript + Express
- Prisma + MySQL (core transactional data)
- Mongoose + MongoDB (logs: rental/payment/error)
- Zod (request/env validation)
- JWT + bcrypt (authentication)

## Architecture

- `src/domain`: entities, value objects, repository interfaces
- `src/application`: DTOs, usecases, app-level exceptions
- `src/infrastructure`: DB clients, repository implementations, auth services
- `src/presentation`: HTTP routes, middlewares, request/response boundary
- `src/shared`: common error codes/messages/base exception

## Branching Strategy

- `main`: stable/release branch
- `development`: integration branch for ongoing work
- Feature branches should be created from `development` and merged back into `development`.
- Release PR should be from `development` to `main`.

## Environment

Create `.env` (or `.env.dev`) from `.env.example`.

Required variables:

- `MYSQL_DATABASE_URL`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

Optional for seed/smoke:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_USER_EMAIL`
- `SEED_USER_PASSWORD`
- `SMOKE_BASE_URL`

## Install

```bash
npm install
```

## Database Setup

### 1) Generate Prisma client

```bash
npm run prisma:generate
```

### 2) Apply schema

Preferred (with MySQL shadow DB permission):

```bash
npm run prisma:migrate:dev -- --name init
```

Fallback (if shadow DB permission is denied):

```bash
npx prisma db push
```

## Run

```bash
npm run dev
```

## Seed Users

```bash
npm run seed
```

Default seeded users:

- Admin: `admin@vrs.local` / `Admin@1234`
- User: `user@vrs.local` / `User@1234`

(Override via env variables.)

## Smoke Test

Run server first, then:

```bash
npm run smoke:test
```

This verifies:

- auth login
- vehicle create/list
- rental create/return
- payment create

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run prisma:generate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`
- `npm run seed`
- `npm run smoke:test`

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/admin-only`

### Vehicles

- `POST /vehicles` (ADMIN)
- `GET /vehicles` (AUTH)

### Rentals

- `POST /rentals` (AUTH)
- `GET /rentals` (AUTH, USER scoped to own records)
- `POST /rentals/:rentalId/cancel` (AUTH)
- `POST /rentals/:rentalId/return` (AUTH)

### Payments

- `POST /payments` (AUTH, USER can create for own rental only)
- `GET /payments` (AUTH, USER scoped to own records)

## Notes

- MySQL is source-of-truth for core business data.
- MongoDB stores operational logs (`rental_logs`, `payment_logs`, `error_logs`).
