# Family Tree App

Live demo: https://family-tree-mine.vercel.app/

An interactive family tree manager — create families, add members, and visualize
generations as a pannable, zoomable tree.

## Tech Stack

- **React 19 + TypeScript + Vite** — app shell and build tooling
- **TanStack Router** — file-based, type-safe client-side routing (routes auto-discovered from `src/routes/`)
- **TanStack Query** — server state, caching, and mutations for the REST API
- **TanStack Table** — sortable data table for the families list
- **Zustand** — lightweight client state (loader overlay, dark-mode preference)
- **React Hook Form + Zod** — form state and schema validation
- **Tailwind CSS v4** — styling, fully dark-mode aware
- **sonner** — toast notifications
- **lucide-react** — icons

## Features

- Browse all families in a sortable, searchable table with at-a-glance stats
  (total families, total members, gender split donut chart)
- Create a family, then build out its tree by adding members and children
- Interactive tree view: drag to pan, buttons to zoom in/out/reset, search
  highlights matching members
- Profile photo upload with live preview, validated for type and size
- Dark mode, persisted across sessions
- Toast feedback and a global loading overlay wired through axios interceptors

## Getting Started

```bash
pnpm install
cp .env.example .env
# fill in VITE_REACT_APP_API_URL and VITE_REACT_APP_BASE_URL
pnpm dev
```

### Environment Variables

| Variable                    | Description                                                              |
| ---------------------------- | -------------------------------------------------------------------------- |
| `VITE_REACT_APP_API_URL`    | Base URL of the Family Tree REST API, e.g. `http://localhost:8105/api/v1` |
| `VITE_REACT_APP_BASE_URL`   | Base URL used to resolve uploaded files like profile photos, e.g. `http://localhost:8105` |

This app expects a running backend exposing the family/member CRUD endpoints
(see `src/constants/ApiEndpoints.ts`). It does not include mock data — point it
at a live API instance to use it.

## Scripts

```bash
pnpm dev        # start dev server
pnpm build      # type-check and build for production
pnpm lint       # run eslint
pnpm preview    # preview the production build locally
```

## Project Structure

```
src/
  routes/         file-based routes — add a file here, the route exists
    __root.tsx           shared layout + 404 fallback (renders RootLayout)
    index.tsx             '/'                      -> FamilyList
    families.$familyId.members.tsx   '/families/$familyId/members' -> MembersList
  routeTree.gen.ts  AUTO-GENERATED — do not edit, committed to git (see note below)
  components/     reusable UI building blocks (Button, Dialog, DataTable, FamilyTree, ...)
  configs/        axios instance + env var access
  constants/      API endpoints, file-extension allowlists, images
  screens/        the actual page components rendered by route files
  services/       TanStack Query hooks per resource (FamilyService, MemberService)
  store/          Zustand stores (loader, theme)
  utils/          formatting helpers
  validators/     Zod schemas for forms
```

### Adding a new route

Drop a file in `src/routes/` and run `pnpm dev` (or just keep it running) — the
TanStack Router Vite plugin watches that folder and regenerates
`src/routeTree.gen.ts` automatically. No manual route registration needed.

- `src/routes/about.tsx` → `/about`
- `src/routes/families.$familyId.edit.tsx` → `/families/$familyId/edit`
- `src/routes/admin/index.tsx` or `src/routes/admin.tsx` → `/admin` (nested directories work too)

`routeTree.gen.ts` is intentionally **committed**, not gitignored — `pnpm build`
runs `tsc -b` before `vite build`, and plain `tsc` doesn't know the Vite plugin
exists to generate it, so a fresh clone would fail type-checking without it on
disk. It's silently overwritten/kept in sync on every `pnpm dev` / `pnpm build`.
