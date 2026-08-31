# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This repository contains **`playwright-arcade`** — a retro arcade-style live terminal reporter for
Playwright Test, published as a standalone npm package.

The only npm project is `node/`, which is exactly what gets published. The repository root holds
documentation and licence only — do not move package source to the root, and do not add a root
`package.json`.

```
node/
├── src/reporter/     Playwright Reporter API + run state
├── src/terminal/     rendering, ANSI, art (no Playwright imports)
├── tests/            unit tests (vitest)
└── package.json
```

## Commands

All commands run from `node/`:

```bash
npm install
npm run build        # tsc -p tsconfig.build.json -> dist/
npm test             # vitest run
npm run test:watch
npm run typecheck    # tsc --noEmit (covers src + tests)
npm run clean
npm pack --dry-run   # inspect publishable contents
```

There is no lint step. `prepublishOnly` runs `clean && build && test`.

To try the reporter against a real suite, create a scratch Playwright project outside this
repository, `npm install --save-dev <path-to>/node`, and set
`reporter: [['playwright-arcade']]`. The example project that used to live in `examples/` was
removed when the package was prepared for release.

## Architecture

Strict one-way dependency flow; each layer is independently testable:

```
Playwright Reporter events
        -> src/reporter/arcade-reporter.ts   the ONLY file importing @playwright/test
        -> src/reporter/state-manager.ts     counts/workers/retries; no Playwright, no terminal
        -> src/terminal/renderer.ts          plain state -> lines; no Playwright
```

Rules that keep this working — preserve them when editing:

- **`state-manager.ts` must not import Playwright or anything under `src/terminal/`.** It takes plain
  data (`TestEndInput` etc.), which is why it is unit-testable without a runner.
- **`renderer.ts` must not import Playwright.** `frame()` and `finalFrame()` are pure and return
  `string[]`; only `render()`/`finalize()` do I/O. Tests assert on `frame()` with a fake stream.
- **All non-ASCII characters live in `src/terminal/ascii-art.ts`** (the `Glyphs` themes and the block
  letterforms). Every other module stays plain ASCII, which is what makes the ASCII fallback theme a
  single switch. The `PLAY` banner is composed from fixed-width per-letter blocks so alignment is
  correct by construction — do not hand-pad the art.
- **Box rows are padded with `visibleWidth()`/`fitVisible()` from `ansi.ts`**, which strip ANSI escapes.
  Padding on raw `.length` breaks alignment as soon as colour is enabled. Every frame line must be
  exactly `BOX_WIDTH` (48) visible columns; tests assert this.

## Invariants that must not regress

These are behavioural guarantees, each covered by tests:

- **Exit codes.** `onEnd` returns `void` — never a status object. The reporter must never influence
  the run result.
- **Reporter errors are swallowed.** Every hook body runs inside `guard()`, and all writes are
  try/caught. A rendering failure must never fail a user's test suite.
- **Retries never inflate the total.** Retry detection mirrors Playwright's own rule exactly:
  `outcome() === 'unexpected' && results.length <= retries` (see `willRetry`). Final outcomes are
  keyed by `testId` so a re-reported result cannot double count.
- **Totals come from `suite.allTests().length`**, never hardcoded.
- **Workers come from `TestResult.workerIndex`**, never assumed to be 4.
- **Animations never block.** They are expiring state read by the repaint timer; nothing sleeps.
- The repaint `setInterval` is `unref()`ed so it can never hold the process open.
- The spinner frame is derived from an injectable clock, not a repaint counter, so it turns at a
  steady rate and stays deterministic under test.

## Package entry point

Playwright resolves a named reporter by requiring the module, unwrapping `default` **exactly once**,
and requiring the result to be a class (`requireOrImportDefaultFunction` in
`playwright/lib/runner/index.js`). `src/index.ts` therefore ends with
`export default ArcadeReporter`, compiled to CommonJS. Changing the module format or the default
export will break `reporter: [['playwright-arcade']]`.

Playwright is a **peer dependency** and is imported for types only (erased at compile time), so the
published package has zero runtime dependencies. Keep it that way.

## Publishing

`package.json` uses a `files` whitelist (`dist`, `README.md`, `CHANGELOG.md`); `LICENSE` and
`package.json` are always included by npm. Source, tests and configs are deliberately excluded.
Verify with `npm pack --dry-run` before publishing.

## Terminal fallbacks

Rendering degrades rather than failing — when changing the renderer, keep all four paths working:

1. Interactive TTY → live in-place repaint via ANSI cursor control.
2. CI / non-TTY (`CI` env or `!isTTY`) → static one-line-per-test output, no cursor control.
3. Terminal without reliable box-drawing glyphs (legacy `cmd.exe`) → ASCII theme.
4. Terminal too narrow (< 48 cols) → single-line compact view; too short → sections are dropped in
   priority order (meta, animation, NOW PLAYING, banner, players) so the essentials survive.
