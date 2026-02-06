# Frontend Agent Rules

## Scope and Structure
- Keep `frontend/src/app` limited to page-level wiring and primary page logic only.
- Place shared, cross-module UI in `frontend/src/components/shared` or `frontend/src/components/ui` based on intent.
- Place module-specific components, utilities, constants, types, and assets in `frontend/src/modules/<module-name>`.
- Keep all API/service clients in `frontend/src/services`.
- Create React Query hooks in `frontend/src/hooks/queries` for each API use case.
- Keep `frontend/src/components/ui` strictly for shadcn-owned components; move non-shadcn components to `frontend/src/components/shared`.

## Design Tokens and Styling
- Use semantic tokens as the only source of colors in application code:
  - Brand: `brand-*`
  - Surface: `surface-*`
  - Foreground: `foreground-*`
- Do not use hardcoded hex colors in `src/**/*.ts(x)` and non-token CSS declarations.
- Use global layout/elevation utilities from `src/app/globals.css`:
  - `surface-card`, `surface-table`, `surface-form`, `surface-form-lg`
  - `layout-section`, `layout-stack`
  - `elev-1`, `elev-2`
- Prefer utility reuse over repeating long className bundles for card/table/form wrappers.

## Ownership Rules (Strict)
- `src/components/ui` is reserved for shadcn-owned components only.
- `src/components/shared` is only for components reused by at least 2 modules.
- If a component is used by 1 module only, keep it under `src/modules/<module>/components`.
- Shared exceptions (infra/primitives) must be explicit and documented in ownership lint allowlist.

## HTML to React Conversion Rules
- When converting HTML into React:
  - Start in `src/modules/<module>/components`.
  - Split into composable components (avoid one monolithic conversion file).
  - Replace hardcoded colors with semantic token classes.
  - Normalize card/table/form wrappers using global utility classes.
  - Use shadcn base primitives from `src/components/ui`.
  - Promote to `src/components/shared` only after cross-module reuse is proven.
- Do not copy utility-heavy HTML verbatim if equivalent shared primitives already exist.

## Data Fetching
- Use React Query for all API calls in pages and modules.
- Do not call APIs directly from components/pages without a dedicated hook.

## Reuse and Quality
- Follow DRY: extract and reuse components, hooks, utilities, and constants.
- When you detect duplicated components or functions (same purpose), explicitly suggest refactoring or consolidation.
- Prefer small, composable components and hooks with clear responsibilities.

## Agent Responsibilities (Do)
- Enforce the folder boundaries above when adding or moving code.
- Propose refactors when there is overlap or redundancy.
- Keep file structure consistent with the existing codebase conventions.
- Run policy checks before finishing:
  - `npm run lint:shadcn-ui`
  - `npm run lint:design-tokens`
  - `npm run lint:ownership`

## Agent Responsibilities (Do Not)
- Do not add non-page logic to `frontend/src/app`.
- Do not place shared components inside module folders.
- Do not place module-only code in shared component folders.
- Do not create API calls outside `frontend/src/services` or without a React Query hook.
- Do not duplicate existing utilities, components, or hooks.

## Additional Suggested Rules
- Prefer named exports for shared components and hooks.
- Keep hooks and services small; one concern per file where possible.
- Co-locate module-specific tests under the module folder when feasible.
- Keep types close to their domain (module-level types inside the module).
- Avoid hard-coded strings for UI labels; centralize common labels if reused.

## Module Scaffolding Guidelines
- Module folder naming uses kebab-case: `frontend/src/modules/<module-name>`.
- Keep module structure consistent across modules; recommended layout:
  - `components/` for module-only UI.
  - `hooks/` for module-specific hooks (non-React Query).
  - `constants/` for module constants.
  - `types/` for module types.
  - `utils/` for module helpers.
  - `index.ts` as the public entry point.
- Export only what is needed from `index.ts` and avoid wildcard re-exports.
- Do not import across modules directly; share via `frontend/src/components/shared`, `frontend/src/components/ui`, or `frontend/src/services` where appropriate.
