# Meridian Diagnostics — LIMS Frontend

Client-side frontend for a Diagnostic Lab Test & Report Management System.

**Scope boundary:** this repository is frontend only. Database schema, SQL, REST
implementation, authentication and session security are built separately by the
backend team. See [`docs/api-contract.md`](docs/api-contract.md) for the
interface the two halves meet at.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production bundle
npm run preview  # serve the production build
```

## Switching from mock data to the real API

Every screen calls a service in `src/services/`, and every service goes through
one function in `src/services/http.ts`. That file is the only thing that changes
when the backend is ready:

```
.env
VITE_API_MODE=mock   →   VITE_API_MODE=live
VITE_API_BASE_URL=http://localhost:8080/api
```

No component, hook or page is touched by that switch.

## Layout

```
src/
  app/          router, providers, guards, permission model
  components/
    ui/         primitives (Radix behaviour, our styling)
    layout/     app shell, sidebar, top bar, page header
    data/       empty / error / loading states, metrics
    domain/     status badges, result flags, reference range bar
  features/     one folder per workflow
  pages/        route components
  services/     async data access — the seam to the backend
  mock/         deterministic seed data
  types/        domain types and Zod schemas
  lib/          formatters, reference range engine
  styles/       tokens, base, print
```

## Notes for reviewers

- Colour never carries meaning alone. Result flags show a letter (`H`/`L`/`HH`/
  `LL`), a directional glyph and a colour; statuses show an icon and a text
  label.
- Reference ranges resolve by sex and age, most specific variant first
  (`src/lib/referenceRange.ts`).
- `/design-system` renders every primitive in the current theme.
- The role switcher in the top bar is a demo affordance, labelled as such.
