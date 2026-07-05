# Chess Stat Tracker

A SvelteKit app for visualizing Chess.com player statistics.

## Setup

```bash
corepack enable
pnpm install
```

## Developing

```bash
pnpm dev

# or open the app in a new browser tab
pnpm dev -- --open
```

## Building

```bash
pnpm run build
pnpm run preview
```

## Deployment

- **Docker / Coolify** — uses `@sveltejs/adapter-node` (default build)
- **Netlify** — uses `@sveltejs/adapter-netlify` automatically when `NETLIFY=true`
