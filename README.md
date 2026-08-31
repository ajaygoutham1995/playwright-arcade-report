# playwright-arcade

A retro arcade-style live terminal reporter for [Playwright Test](https://playwright.dev), packaged
as a standalone npm package that any Playwright project can install.

```ts
// playwright.config.ts
export default defineConfig({
  reporter: [['playwright-arcade']],
});
```

```bash
npx playwright test
```

That is the whole integration — test files do not change.

Full documentation, options, CI behaviour and terminal support: **[node/README.md](node/README.md)**.

## Repository layout

```
playwright-arcade/
├── node/                 the publishable npm package
│   ├── src/
│   │   ├── reporter/     Playwright Reporter API + run state
│   │   └── terminal/     rendering, ANSI, art (no Playwright imports)
│   ├── tests/            unit tests (vitest)
│   ├── README.md         full package documentation
│   ├── CHANGELOG.md
│   └── package.json
│
├── LICENSE
└── README.md             you are here
```

The implementation lives under `node/` rather than at the repository root, so that `node/` is
exactly what gets published.

## Architecture

Events flow in one direction, and each layer is independently testable:

```
Playwright Reporter events
        │
        ▼
  ArcadeReporter          translates Playwright objects into plain data
        │                 (the only file that imports Playwright)
        ▼
  StateManager            counts, workers, retries, progress
        │                 (no Playwright, no terminal)
        ▼
  ArcadeRenderer          plain state -> terminal output
                          (no Playwright; `frame()` is pure)
```

Because `StateManager` speaks plain data and `ArcadeRenderer.frame()` is a pure function, the unit
tests need no browser, no test runner and no real terminal.

## Development

```bash
cd node
npm install
npm run build        # tsc -> dist/
npm test             # vitest
npm run typecheck
npm pack --dry-run   # inspect publishable contents
```

## Publishing

```bash
cd node
npm login
npm publish
```

`prepublishOnly` runs a clean build and the full unit test suite first, so a broken build or a
failing test blocks the publish.

## License

[MIT](LICENSE)
