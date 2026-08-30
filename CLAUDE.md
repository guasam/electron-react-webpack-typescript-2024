# electron-react-app

Electron + React template built on electron-conveyor (typed IPC + cross-window state). The
playground demo is strippable via `npm run strip-demo`.

- When writing or editing any source, follow the house style in
  `.claude/skills/code-style/SKILL.md` — section banner format, comment tone and density.
- Checks: `npm run typecheck`, `npm run lint`, `npm run format`.
- `conveyor/modules/*` run in main only; the renderer imports only `type AppRouter`.
