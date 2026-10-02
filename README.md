# StudaFly Frontend

> Web app for StudaFly - Prepare your international mobility, serenely.

![CI](https://github.com/StudaFly/Frontend/actions/workflows/ci.yml/badge.svg)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## Scripts

| Command | Description |
|----------|-------------|
| `pnpm dev` | Starts the dev server (Vite) |
| `pnpm build` | Production build |
| `pnpm lint` | Checks the code with ESLint |
| `pnpm typecheck` | Checks TypeScript types |
| `pnpm test` | Runs the unit tests (Vitest) |
| `pnpm test:ui` | Runs the unit tests with a browser UI |
| `pnpm test:coverage`| Runs the tests with the coverage report (V8) |
| `npx playwright test` | Runs the End-to-End (E2E) tests |

## Architecture (Feature-Driven Design)

The project uses a feature-driven architecture, mirroring the mobile app to make sharing business logic easier.

```text
src/
├── assets/          # Static files (images, fonts, etc.)
├── components/      # UI components (shared/ and ui/ for shadcn)
├── core/            # Infrastructure (api/, providers/, utils/)
├── features/        # Business domains (auth, profile, etc.)
│   └── [feature]/   # Each feature has its own components, hooks, pages, services, store, types...
└── router/          # React Router configuration and layouts
```

## Tech Stack

- **Framework:** React 18 (SPA) + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router DOM (Lazy-loaded)
- **State Management:** Zustand
- **Data Fetching:** React Query / Axios
- **Testing:** Vitest (unit tests) + Playwright (E2E tests)
- **Deployment:** PWA Ready

## Code Owner

@NoahKrummenacker
