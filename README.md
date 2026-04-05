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

- `/dashboard`
- `/dashboard/library`
- `/dashboard/downloads`
- `/dashboard/purchases`
- `/subscription`
- `/settings`

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
  `src/components/providers/BonesRegistryBootstrap.tsx`, which calls the safe
  helper in `src/bones/index.ts` on the client instead of importing the bones
  registry as a root layout side effect
- the current pilot capture route is `http://localhost:3000/dev/bones`
- the capture page now also exposes preview fixtures for
  `ResourcesCatalogSearchSkeleton` and `ResourcesCatalogControlsSkeleton`
  plus `HeroSearch` dropdown states for quick browse, top matches, and
  empty-result recovery
  plus the `SearchRecoveryPanel` empty-result surface
  plus the `ResourcesDiscoverPersonalizedSection` personalized discover block
  for recommendation/because-you-studied/level-based geometry capture
  plus settings/admin/creator-apply route shells for account and ops screens
  plus creator dashboard overview/analytics/resources/sales/profile route shells
  plus the creator resource form loading shell used on create/edit routes
  plus the admin resource form shell used on admin create routes
  plus the creator new-resource route shell used on creator upload flows
  plus the admin analytics overview/recommendations/ranking/ranking-experiment/
  purchases/creator-activation route shells
  plus the auth login shell
  plus the user dashboard overview/library/downloads/purchases/subscription/
  resources-redirect route shells
- the current generated skeleton sets are:
  `src/bones/admin-analytics-creator-activation.bones.json` and
  `src/bones/admin-analytics-overview.bones.json` and
  `src/bones/admin-analytics-purchases.bones.json` and
  `src/bones/admin-analytics-ranking-experiment.bones.json` and
  `src/bones/admin-analytics-ranking.bones.json` and
  `src/bones/admin-analytics-recommendations.bones.json` and
  `src/bones/admin-settings-page.bones.json` and
  `src/bones/admin-resource-form.bones.json` and
  `src/bones/creator-apply-page.bones.json` and
  `src/bones/creator-dashboard-analytics.bones.json` and
  `src/bones/creator-dashboard-overview.bones.json` and
  `src/bones/creator-dashboard-profile.bones.json` and
  `src/bones/creator-dashboard-resources.bones.json` and
  `src/bones/creator-dashboard-sales.bones.json` and
  `src/bones/creator-resource-form.bones.json` and
  `src/bones/creator-resource-new-route.bones.json` and
  `src/bones/dashboard-downloads.bones.json` and
  `src/bones/dashboard-library.bones.json` and
  `src/bones/dashboard-overview.bones.json` and
  `src/bones/dashboard-purchases.bones.json` and
  `src/bones/dashboard-resources-redirect.bones.json` and
  `src/bones/dashboard-subscription.bones.json` and
  `src/bones/hero-search-empty.bones.json` and
  `src/bones/hero-search-quick-browse.bones.json` and
  `src/bones/hero-search-results.bones.json` and
  `src/bones/login-form.bones.json` and
  `src/bones/purchase-card.bones.json` and
  `src/bones/resource-card.bones.json` and
  `src/bones/resource-detail-shell.bones.json` and
  `src/bones/resources-catalog-controls.bones.json` and
  `src/bones/resources-catalog-search.bones.json` and
  `src/bones/resources-discover-personalized.bones.json` and
  `src/bones/resources-discover-sections.bones.json` and
  `src/bones/resources-intro-discover.bones.json` and
  `src/bones/resources-intro-listing.bones.json` and
  `src/bones/resources-listing-shell.bones.json` and
  `src/bones/resources-route-shell.bones.json` and
  `src/bones/search-recovery-panel.bones.json` and
  `src/bones/settings-page.bones.json`

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
  workers/            background and aggregation jobs

prisma/               schema, migrations, seed data
scripts/              audits, warmers, smoke helpers, tooling
krukraft-ai-contexts/ maintained repo context pack for AI/codebase truth
```

## Current Branding

- Product name: `Krukraft`
- Domain: `krukraft.com`
- Repo name: `studyplatform`

If the GitHub repository display metadata still shows older copy, update the
GitHub `About` panel to match the values above.
