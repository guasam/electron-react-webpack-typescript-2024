# electron-react-app

Electron + React template built on electron-conveyor (typed IPC + cross-window state). This is
the `demo` branch: the interactive playground, built on the minimal shell from `main`. Shell,
tooling, and conveyor-core changes land on `main` first and merge forward; only demo content
(pages, demo modules/stores) is authored here.

- When writing or editing any source, follow the house style in the `code-style` skill —
  section banner format, comment tone and density.
- Checks: `npm run typecheck`, `npm run lint`, `npm run format`.
- `conveyor/modules/*` run in main only; the renderer imports only `type AppRouter`.
