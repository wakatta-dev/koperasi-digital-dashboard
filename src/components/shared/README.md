# `components/shared` Policy

Use this folder for reusable non-shadcn components shared across modules.

Examples:
- Alert wrappers, toast helpers, confirm dialogs
- Form composites, date/time pickers, async selectors (only after at least 2 module consumers)
- Providers and reusable layout shells

Suggested grouping:
- `shared/forms/*` for reusable form composites with cross-module adoption
- `shared/inputs/*` for reusable input primitives/composites
- `shared/providers/*` for app-level providers

Rules:
- Keep module-specific UI inside `src/modules/<module>/components`.
- Move to `components/shared` only when API and visuals are stable and reused across modules.
- Never place non-shadcn components under `components/ui`.
