# PR: development -> main

## Title

Backend foundation: auth, dual DB integration, repositories, and API flow wiring

## Summary

This PR promotes the latest backend work from `development` to `main`.

## Included

- JWT auth and RBAC middleware
- Structured exception/error response system
- Prisma (MySQL) + Mongoose (Mongo logs) integration
- Prisma repositories for user/vehicle/rental/payment
- Usecases for vehicle/rental/payment flows
- API routes wired for auth, vehicles, rentals, payments
- User-scoped access rules for rentals/payments
- Seed script and smoke test script
- Path alias import refactor

## Validation Performed

- `npm run build` passes
- Prisma client generation passes
- DB schema sync done with `prisma db push` (shadow DB permissions currently restricted)
- `npm run seed` passes
- `npm run smoke:test` passes

## Notes

`prisma migrate dev` currently fails in this environment due lack of shadow DB create permissions (P3014/P1010). `prisma db push` is used as operational workaround until DB privileges are updated.
