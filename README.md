# StudaFly Frontend

> Interface web pour StudaFly - Prépare ton départ à l'étranger, sereinement.

![CI](https://github.com/StudaFly/Frontend/actions/workflows/ci.yml/badge.svg)

## Quick Start

```bash
# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lance le serveur de dev (Vite) |
| `pnpm build` | Build de production |
| `pnpm lint` | Vérifie le code avec ESLint |
| `pnpm typecheck` | Vérifie les types TypeScript |
| `pnpm test` | Lance les tests unitaires (Vitest) |
| `pnpm test:ui` | Lance les tests unitaires avec une UI dans le navigateur |
| `pnpm test:coverage`| Lance les tests avec le rapport de couverture (V8) |
| `npx playwright test` | Lance les tests End-to-End (E2E) |

## Architecture (Feature-Driven Design)

Le projet utilise une architecture pilotée par les fonctionnalités (Feature-Driven), calquée sur l'application mobile pour faciliter le partage de logique métier.

```text
src/
├── assets/          # Fichiers statiques (images, fonts, etc.)
├── components/      # Composants UI (shared/ et ui/ pour shadcn)
├── core/            # Infrastructure (api/, providers/, utils/)
├── features/        # Domaines métiers (auth, profile, etc...)
│   └── [feature]/   # Chaque feature possède ses components, hooks, pages, services, store, types...
└── router/          # Configuration de React Router et Layouts
```

## Tech Stack

- **Framework:** React 18 (SPA) + Vite
- **Langage:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Routing:** React Router DOM (Lazy-loaded)
- **State Management:** Zustand
- **Data Fetching:** React Query / Axios
- **Testing:** Vitest (Tests unitaires) + Playwright (Tests E2E)
- **Déploiement:** PWA Ready

## Code Owner

@NoahKrummenacker
