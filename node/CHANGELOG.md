# Changelog

All notable changes to `playwright-arcade` are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-08-31

### Added

- An animated spinner after the progress bar on the live dashboard, so a slow
  test never looks like a hung UI. It turns while the run is in progress and
  disappears as soon as the run finishes, and it never appears on the
  completion screen.
- The spinner is themed: braille frames in the unicode theme, `| / - \` in the
  ASCII theme, so it stays single-width in every terminal.
- It also appears in the compact single-line view used on narrow terminals.

### Changed

- `ArcadeRenderer` accepts an optional `now` clock, so the spinner frame is
  deterministic under test. The frame is derived from the clock rather than a
  repaint counter, so it turns at a steady rate no matter how often the
  dashboard repaints.

## [0.3.0] - 2026-08-31

### Added

- The completion screen is now laid out as **three panels side by side** -
  scoreboard, results and summary - instead of one tall stacked box. Panels are
  padded to a common height so the boxes align, and spare terminal width is
  given to the results panel (up to 54 columns).
- New option `finalLayout: 'auto' | 'horizontal' | 'vertical'` (default
  `'auto'`). Auto uses the side-by-side layout at >= 95 columns and falls back
  to the stacked layout below that; the compact two-line summary still applies
  below 48 columns.
- Listed test names are now qualified with their project (`has title
  [firefox]`) when the run covers more than one project, so the same title
  running under several browsers is distinguishable.

### Changed

- Box drawing primitives are width-parameterised, so boxes of any width can be
  composed and joined horizontally.

## [0.2.0] - 2026-08-31

### Added

- The completion screen now shows an **outcome bar** beneath the PASSED / FAILED /
  SKIPPED counts: a single bar segmented by result, with the pass rate beside it.
  Each segment has its own glyph as well as its own colour, so the split stays
  readable with `NO_COLOR`, on a monochrome terminal and in the ASCII theme.
- The completion screen now **lists test names grouped by outcome**, with a count
  per group. Long names are truncated to fit; a test that failed and then passed
  on retry is listed once, under its final outcome.
- New options `showTestNames` (default `true`) and `maxTestNames` (default `10`)
  to control the listing. Groups longer than the cap end with `... and N more`.
- `ArcadeState` gained `results: TestSummary[]`, every finished test in
  completion order, keyed internally by test id so retries cannot duplicate it.
- `Glyphs` gained `barFailed` and `barSkipped` for the segmented bar.

## [0.1.0] - 2026-08-31

Initial release.

### Added

- Live retro arcade dashboard for Playwright Test, driven entirely by the
  official Reporter API (`onBegin`, `onTestBegin`, `onTestEnd`, `onStepBegin`,
  `onStepEnd`, `onError`, `onEnd`).
- Progress bar with PASSED / FAILED / RUNNING / REMAINING / SKIPPED counts.
- One "PLAYER" row per Playwright worker, derived from `TestResult.workerIndex`,
  so the panel adapts to `--workers=N`.
- `NOW PLAYING` line showing the executing test, optionally with the current
  `test.step()` (`showSteps`).
- Project, browser and environment display, plus a persisted run number.
- Completion screen with totals, duration and score.
- Failure details and worker errors printed after the completion screen.
- Reporter options: `animations`, `colors`, `showWorkers`, `showSteps`,
  `unicode`, `interactive`, `title`, `fps`.
- In-place repainting via ANSI cursor control, with automatic fallbacks:
  static line-per-test output in CI or a non-TTY, an ASCII theme for terminals
  without reliable box-drawing glyphs, a compact view on narrow terminals, and
  progressive section-dropping on short terminals.
- `NO_COLOR` and `FORCE_COLOR` support.
- Interactive-mode buffering of test stdout/stderr, replayed after the final
  screen so console output cannot corrupt the dashboard.

### Notes

- Retries follow Playwright's own rule and never inflate the test total.
- The reporter never alters the run status or the process exit code, and
  rendering failures can never fail a test run.
