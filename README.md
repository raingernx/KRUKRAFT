# Krukraft

AI-assisted marketplace for ready-made teaching resources, digital downloads,
creator publishing, and school-focused subscriptions.

Live site: [https://krukraft.com](https://krukraft.com)

## What This Repo Contains

Krukraft is a Next.js App Router application with:

- public resource discovery and search
- resource detail pages with purchase and download flows
- memberships and one-time purchases
- creator dashboard for publishing and analytics
- admin tooling for resources, users, reviews, tags, analytics, and settings
- a repo-owned design system with Figma mapping and token audits

## Stack

- Next.js 16
- React 18
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth
- Stripe
- Xendit
- Vercel

## Key Product Areas

### Public Marketplace

- `/resources` for discover and listing modes
- `/resources/[slug]` for resource detail and purchase rails
- `/categories/[slug]` for taxonomy browsing
- search suggestions, recovery states, and viewer-aware personalization

### User Dashboard

- `/dashboard-v2`
- `/dashboard-v2/library`
- `/dashboard-v2/downloads`
- `/dashboard-v2/purchases`
- `/dashboard-v2/membership`
- `/dashboard-v2/settings`

### Creator Workspace

- creator onboarding and application flow
- creator resource creation/editing
- creator analytics, sales, and publishing readiness

### Admin

- `/admin/resources`
- `/admin/users`
- `/admin/orders`
- `/admin/reviews`
- `/admin/analytics/*`
- `/admin/settings`

## Design System

The canonical app-facing UI import surface lives under:

```text
src/design-system/*
```

Important repo-owned references:

- [src/design-system/README.md](src/design-system/README.md)
- [design-system.md](design-system.md)
- [figma-component-map.md](figma-component-map.md)
- [krukraft-ai-contexts/06-design-system.md](krukraft-ai-contexts/06-design-system.md)
- [krukraft-ai-contexts/07-layout-ux.md](krukraft-ai-contexts/07-layout-ux.md)

Current DS conventions include:

- theme-aware surfaces and typography
- dark border hierarchy: `subtle`, `default`, `strong`
- loading/fallback parity as part of feature work
- optional `boneyard-js` DOM-capture workflow for skeleton generation

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

Optional commands:

```bash
npm run dev:turbo
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Verification

Core checks used in this repo:

```bash
npm run typecheck
npm run lint
npm run context:check
npm run context:check:staged:strict
npm run smoke:local:browser
```

Design-system specific checks:

```bash
npm run skeleton:check
npm run figma-map:check
npm run tokens:audit
```

Optional skeleton capture workflow:

```bash
npm run skeleton:boneyard:build
npm run skeleton:boneyard:build:force
```

Notes:

- generated bones are bootstrapped by
  `src/components/providers/BonesRegistryBootstrap.tsx`
- the current capture route is `http://localhost:3000/dev/bones`
- detailed skeleton/bones ownership and route-shell context now lives in
  `krukraft-ai-contexts/` and the DS docs instead of this landing page

## Production Notes

- production deploys run on Vercel
- the primary public domain is `https://krukraft.com`
- `www.krukraft.com` should redirect to the apex domain
- Prisma migration deploy is intentionally separate from app build

Deploy-related commands:

```bash
npm run build
npm run db:deploy
npm run vercel:prod
```

## Repository Structure

```text
src/
  app/                Next.js routes, layouts, API routes
  components/         feature-level components
  design-system/      canonical DS primitives, composed UI, layout, tokens
  analytics/          analytics helpers and scoring logic
  services/           business logic
  repositories/       database access via Prisma
  lib/                shared helpers, routing, theme/bootstrap, metadata

scripts/              audits, warmers, smoke helpers, tooling
prisma/               schema, migrations, seed data
krukraft-ai-contexts/ maintained repo context pack for AI/codebase truth
```

There is no dedicated `src/workers/` directory in the current repo. Background
and aggregation work currently lives in service, repository, analytics, and
repo-owned script layers instead.

## Current Branding

- Product name: `Krukraft`
- Domain: `krukraft.com`
- Repo name: `studyplatform`

If the GitHub repository display metadata still shows older copy, update the
GitHub `About` panel to match the values above.

## Additional Context

For deeper repo-owned docs, use:

- [krukraft-ai-contexts/README.md](krukraft-ai-contexts/README.md)
- [src/design-system/README.md](src/design-system/README.md)
- [src/design-system/theme-playbook.md](src/design-system/theme-playbook.md)
- [design-system.md](design-system.md)
