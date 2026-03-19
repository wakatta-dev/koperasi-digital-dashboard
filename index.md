# Directory Index

## Core Files

- **[AGENTS.md](./AGENTS.md)** - Frontend folder boundaries and rules
- **[DESIGN.md](./DESIGN.md)** - Synthesized design system reference
- **[README.md](./README.md)** - Frontend overview and startup guide
- **[components.json](./components.json)** - shadcn component registry config
- **[env.example](./env.example)** - Sample runtime environment variables
- **[eslint.config.mjs](./eslint.config.mjs)** - ESLint policy and lint setup
- **[example.env](./example.env)** - Alternate local env example
- **[next-env.d.ts](./next-env.d.ts)** - Next.js type generation shim
- **[next.config.ts](./next.config.ts)** - Next.js runtime configuration
- **[package-lock.json](./package-lock.json)** - Locked npm dependency graph
- **[package.json](./package.json)** - App scripts and dependency manifest
- **[postcss.config.mjs](./postcss.config.mjs)** - PostCSS and Tailwind wiring
- **[tsconfig.json](./tsconfig.json)** - TypeScript compiler configuration
- **[vitest.config.ts](./vitest.config.ts)** - Vitest browser test configuration

## Documentation

### docs/

- **[testid-audit.md](./docs/testid-audit.md)** - Selector coverage gap report
- **[testid-guideline.md](./docs/testid-guideline.md)** - Stable E2E selector naming

## Public Assets

### public/

- **[file.svg](./public/file.svg)** - Generic file icon asset
- **[firebase-messaging-sw.js](./public/firebase-messaging-sw.js)** - Firebase messaging service worker
- **[globe.svg](./public/globe.svg)** - Globe icon asset
- **[next.svg](./public/next.svg)** - Next.js logo asset
- **[success-confirmation-illustration.png](./public/success-confirmation-illustration.png)** - Success state illustration asset
- **[vercel.svg](./public/vercel.svg)** - Vercel logo asset
- **[window.svg](./public/window.svg)** - Window icon asset

## Automation And Reports

### reports/

- **[testid-audit.json](./reports/testid-audit.json)** - Machine-readable selector audit output

### scripts/

- **[audit-testids.mjs](./scripts/audit-testids.mjs)** - Scans selector coverage gaps
- **[check-component-ownership.mjs](./scripts/check-component-ownership.mjs)** - Enforces shared ownership boundaries
- **[check-design-tokens.mjs](./scripts/check-design-tokens.mjs)** - Enforces semantic design tokens
- **[check-shadcn-ui.mjs](./scripts/check-shadcn-ui.mjs)** - Guards shadcn-only UI folder
- **[check-table-standardization.mjs](./scripts/check-table-standardization.mjs)** - Validates shared table patterns
- **[render_markdown_to_pdf.py](./scripts/render_markdown_to_pdf.py)** - Renders markdown files to PDF

## Tests

### tests/

- **[asset-reservation/](./tests/asset-reservation)** - Frontend rendering test helpers
- **[asset-reservation/_setup.ts](./tests/asset-reservation/_setup.ts)** - Testing Library render wrapper

## Source Structure

### src/

- **[__tests__/](./src/__tests__)** - Vitest specs for app behavior
- **[app/](./src/app)** - Next.js route tree and layouts
- **[components/](./src/components)** - Shared UI primitives and composites
- **[constants/](./src/constants)** - Global app constants and copy
- **[contexts/](./src/contexts)** - Cross-app React context providers
- **[hooks/](./src/hooks)** - Shared hooks and React Query entrypoints
- **[lib/](./src/lib)** - Core utilities and auth helpers
- **[middleware.ts](./src/middleware.ts)** - Request middleware and guards
- **[modules/](./src/modules)** - Feature modules by business domain
- **[services/](./src/services)** - API clients and adapters
- **[setupTests.ts](./src/setupTests.ts)** - Vitest environment setup
- **[types/](./src/types)** - Shared application type declarations
- **[validators/](./src/validators)** - Zod validation schemas

### src/app/

- **[(mvp)/](./src/app/(mvp))** - Authenticated tenant and vendor shell
- **[api/](./src/app/api)** - NextAuth route handlers
- **[globals.css](./src/app/globals.css)** - Global tokens and utility classes
- **[layout.tsx](./src/app/layout.tsx)** - Root HTML shell and providers
- **[login/](./src/app/login)** - Login screen route
- **[marketplace/](./src/app/marketplace)** - Public marketplace funnel routes
- **[page.tsx](./src/app/page.tsx)** - Landing redirect or home entry
- **[penyewaan-aset/](./src/app/penyewaan-aset)** - Public asset rental guest routes
- **[register/](./src/app/register)** - Registration screen route
- **[tenant-not-found/](./src/app/tenant-not-found)** - Missing tenant fallback route

### src/app/(mvp)/

- **[bumdes/](./src/app/(mvp)/bumdes)** - BUMDes backoffice routes
- **[layout.tsx](./src/app/(mvp)/layout.tsx)** - Shared authenticated shell layout
- **[vendor/](./src/app/(mvp)/vendor)** - Vendor-side backoffice routes

### src/app/(mvp)/bumdes/

- **[accounting/](./src/app/(mvp)/bumdes/accounting)** - Accounting dashboard and workflows
- **[asset/](./src/app/(mvp)/bumdes/asset)** - Asset management and rental review
- **[dashboard/](./src/app/(mvp)/bumdes/dashboard)** - Tenant dashboard route
- **[landing-page/](./src/app/(mvp)/bumdes/landing-page)** - BUMDes landing editor routes
- **[marketplace/](./src/app/(mvp)/bumdes/marketplace)** - Internal marketplace management routes
- **[navigation.tsx](./src/app/(mvp)/bumdes/navigation.tsx)** - BUMDes navigation registry
- **[partner-management/](./src/app/(mvp)/bumdes/partner-management)** - Partner management route
- **[settings/](./src/app/(mvp)/bumdes/settings)** - Tenant settings routes
- **[team/](./src/app/(mvp)/bumdes/team)** - Team management route
- **[title-resolver.ts](./src/app/(mvp)/bumdes/title-resolver.ts)** - Page title resolution helpers

### src/modules/

- **[accounting/](./src/modules/accounting)** - Large accounting feature workspace
- **[asset/](./src/modules/asset)** - Asset master-data management module
- **[asset-reservation/](./src/modules/asset-reservation)** - Guest rental and status flows
- **[auth/](./src/modules/auth)** - Login and registration features
- **[dashboard/](./src/modules/dashboard)** - Dashboard summary widgets
- **[finance/](./src/modules/finance)** - Finance feature primitives
- **[index.ts](./src/modules/index.ts)** - Registered module identifier list
- **[inventory/](./src/modules/inventory)** - Inventory management feature set
- **[landing/](./src/modules/landing)** - Public landing page module
- **[marketplace/](./src/modules/marketplace)** - Public buyer marketplace journey
- **[partner-management/](./src/modules/partner-management)** - Partner management feature module
- **[tenant-settings/](./src/modules/tenant-settings)** - Tenant settings feature module
- **[vendor/](./src/modules/vendor)** - Vendor-facing product and ticket UI

### src/modules/accounting/

- **[components/](./src/modules/accounting/components)** - Accounting pages, features, and demos
- **[constants/](./src/modules/accounting/constants)** - Accounting routes and seeded state
- **[index.ts](./src/modules/accounting/index.ts)** - Accounting public export surface
- **[types/](./src/modules/accounting/types)** - Accounting domain type models
- **[utils/](./src/modules/accounting/utils)** - Accounting mappers and trace helpers

### src/modules/asset-reservation/

- **[asset-reservation-page.tsx](./src/modules/asset-reservation/asset-reservation-page.tsx)** - Public rental catalog page
- **[components/](./src/modules/asset-reservation/components)** - Shared rental guest components
- **[constants.ts](./src/modules/asset-reservation/constants.ts)** - Rental module constants
- **[detail/](./src/modules/asset-reservation/detail)** - Asset detail and admin detail pages
- **[guest/](./src/modules/asset-reservation/guest)** - Guest application and status flows
- **[hooks/](./src/modules/asset-reservation/hooks)** - Rental data fetching hooks
- **[index.ts](./src/modules/asset-reservation/index.ts)** - Rental module exports
- **[payment/](./src/modules/asset-reservation/payment)** - Down payment submission flow
- **[status/](./src/modules/asset-reservation/status)** - Request lookup and status pages
- **[status-reservation/](./src/modules/asset-reservation/status-reservation)** - Reservation confirmation status flow

### src/modules/marketplace/

- **[cart-page.tsx](./src/modules/marketplace/cart-page.tsx)** - Cart and checkout shell
- **[components/](./src/modules/marketplace/components)** - Marketplace buyer flow components
- **[confirmation-page.tsx](./src/modules/marketplace/confirmation-page.tsx)** - Checkout confirmation experience
- **[index.ts](./src/modules/marketplace/index.ts)** - Marketplace public export surface
- **[marketplace-page.tsx](./src/modules/marketplace/marketplace-page.tsx)** - Product catalog landing page
- **[payment-page.tsx](./src/modules/marketplace/payment-page.tsx)** - Payment proof and status page
- **[product-detail-page.tsx](./src/modules/marketplace/product-detail-page.tsx)** - Product detail purchase flow
- **[review-page.tsx](./src/modules/marketplace/review-page.tsx)** - Post-delivery review workflow
- **[shipping-page.tsx](./src/modules/marketplace/shipping-page.tsx)** - Order tracking and shipping view

## E2E Readiness Notes

- **[docs/testid-audit.md](./docs/testid-audit.md)** - Shows broad selector gaps outside marketplace
- **[src/modules/marketplace/](./src/modules/marketplace)** - Most E2E-ready public flow today
- **[src/modules/asset-reservation/](./src/modules/asset-reservation)** - Real flows exist but selectors remain sparse
- **[src/modules/accounting/](./src/modules/accounting)** - Broad route surface with minimal selectors
