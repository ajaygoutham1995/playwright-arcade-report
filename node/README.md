# playwright-arcade

A retro arcade-style live terminal reporter for [Playwright Test](https://playwright.dev).

Playwright's default `list` and `dot` reporters tell you very little while a suite is running.
`playwright-arcade` turns the same reporter events into a live dashboard: a progress bar, running
counts, and one "player" per parallel worker.

```
╔══════════════════════════════════════════════╗
║      ██████╗ ██╗      █████╗ ██╗   ██╗       ║
║      ██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝       ║
║      ██████╔╝██║     ███████║ ╚████╔╝        ║
║      ██╔═══╝ ██║     ██╔══██║  ╚██╔╝         ║
║      ██║     ███████╗██║  ██║   ██║          ║
║      ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝          ║
║                                              ║
║            PLAYWRIGHT TEST ARCADE            ║
╠══════════════════════════════════════════════╣
║                                              ║
║  LEVEL 01/03                       RUN #124  ║
║                                              ║
║  PROJECT                           chromium  ║
║  BROWSER                           Chromium  ║
║  ENVIRONMENT                             QA  ║
║  TIME                                 00:00  ║
║                                              ║
║  PROGRESS                                    ║
║                                              ║
║  █████████████████████░░░   86%  ⠹           ║
║                                              ║
║  ✓ PASSED        41                          ║
║  ✕ FAILED         2                          ║
║  ◉ RUNNING        1                          ║
║  ○ REMAINING      6                          ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  NOW PLAYING                                 ║
║  has title                                   ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  PLAYER 01  ████████████░░  ✓                ║
║  PLAYER 02  ████████████░░  ◉                ║
║  PLAYER 03  ███████████░░░  ✓                ║
║  PLAYER 04  ████████████░░  ✕                ║
║                                              ║
╚══════════════════════════════════════════════╝
```

The spinner beside the percentage turns while the run is in progress and disappears the moment it
finishes, so a long-running test never looks like a hung dashboard.

At the end of the run — the scoreboard, results and summary side by side:

```
╔══════════════════════════════╗ ╔════════════════════════════════╗ ╔════════════════════════╗
║                              ║ ║                                ║ ║                        ║
║        ✕ GAME OVER ✕         ║ ║  RESULTS                       ║ ║  SUMMARY               ║
║                              ║ ║                                ║ ║                        ║
║    PLAYWRIGHT TEST ARCADE    ║ ║  ✓ PASSED (3)                  ║ ║    TOTAL          6    ║
║                              ║ ║    get started link [chromium] ║ ║    DURATION   00:11    ║
║  ✓ PASSED         3          ║ ║    get started link [webkit]   ║ ║                        ║
║  ✕ FAILED         3          ║ ║    get started link [firefox]  ║ ║       SCORE: 300       ║
║  ⊘ SKIPPED        0          ║ ║                                ║ ║                        ║
║                              ║ ║  ✕ FAILED (3)                  ║ ║                        ║
║  ██████████▓▓▓▓▓▓▓▓▓▓   50%  ║ ║    has title [chromium]        ║ ║                        ║
║                              ║ ║    has title [webkit]          ║ ║                        ║
║                              ║ ║    has title [firefox]         ║ ║                        ║
║                              ║ ║                                ║ ║                        ║
╚══════════════════════════════╝ ╚════════════════════════════════╝ ╚════════════════════════╝
```

On a terminal narrower than ~95 columns the same three sections stack instead:

```
╔══════════════════════════════════════════════╗
║                                              ║
║                ✕ GAME OVER ✕                 ║
║                                              ║
║            PLAYWRIGHT TEST ARCADE            ║
║                                              ║
║  ✓ PASSED        41                          ║
║  ✕ FAILED         2                          ║
║  ⊘ SKIPPED        0                          ║
║                                              ║
║  ████████████████████▓░░░   82%              ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ✓ PASSED (41)                               ║
║    passing test 0                            ║
║    passing test 1                            ║
║    passing test 2                            ║
║    passing test 3                            ║
║    passing test 4                            ║
║    passing test 5                            ║
║    passing test 6                            ║
║    passing test 7                            ║
║    passing test 8                            ║
║    passing test 9                            ║
║    ... and 31 more                           ║
║                                              ║
║  ✕ FAILED (2)                                ║
║    checkout total is wrong                   ║
║    search returns no results                 ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║    TOTAL         50                          ║
║    DURATION   00:00                          ║
║                                              ║
║                 SCORE: 4100                  ║
║                                              ║
╚══════════════════════════════════════════════╝
```

A clean run shows `★ LEVEL COMPLETE ★` instead.

## Installation

```bash
npm install --save-dev playwright-arcade
```

## Configuration

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [['playwright-arcade']],
});
```

That is the entire integration. Your test files do not change.

## Usage

```bash
npx playwright test
```

## Options

```ts
export default defineConfig({
  reporter: [
    ['playwright-arcade', {
      animations: true,
      colors: true,
      showWorkers: true,
      showSteps: true,
    }],
  ],
});
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `animations` | `boolean` | `true` | Brief pass/fail flashes. Only ever shown in interactive mode. |
| `colors` | `boolean` | auto | Force ANSI colour on or off. Auto-detected; `NO_COLOR` always wins. |
| `showWorkers` | `boolean` | `true` | Show the per-worker PLAYER panel. |
| `showSteps` | `boolean` | `false` | Append the running `test.step()` to NOW PLAYING. |
| `unicode` | `boolean` | auto | Force the box-drawing theme on or off (see [Terminals](#supported-terminals)). |
| `interactive` | `boolean` | auto | Force live repainting on or off. Auto: on for a TTY, off in CI. |
| `title` | `string` | `PLAYWRIGHT TEST ARCADE` | Banner subtitle. |
| `fps` | `number` | `12` | Repaint rate, clamped to 1–30. |
| `showTestNames` | `boolean` | `true` | List test names by outcome on the completion screen. |
| `maxTestNames` | `number` | `10` | Names listed per outcome group; the rest are summarised as `... and N more`. |
| `finalLayout` | `'auto' \| 'horizontal' \| 'vertical'` | `'auto'` | Completion screen layout — panels side by side or stacked. |

For a large suite, either lower the cap or turn the listing off entirely:

```ts
['playwright-arcade', { maxTestNames: 3 }]      // 3 names per group
['playwright-arcade', { showTestNames: false }] // counts and bar only
```

## Multiple reporters

The arcade reporter works alongside any other reporter:

```ts
export default defineConfig({
  reporter: [
    ['playwright-arcade'],
    ['html'],
  ],
});
```

It never touches another reporter's output — `html`, `json` and `junit` all write their own files
as usual.

> One caveat: `list`, `line` and `dot` also write to the terminal. Running one of them *together
> with* the arcade reporter in an interactive terminal means two reporters are drawing to the same
> screen, and the dashboard will be disturbed. Pair the arcade reporter with file-based reporters,
> or rely on its own non-interactive output in CI.

## Parallel workers

Playwright runs tests across parallel worker processes. Each worker is rendered as a **player**,
driven by the real `TestResult.workerIndex`, so the panel matches whatever you pass to `--workers`:

```bash
npx playwright test --workers=1
npx playwright test --workers=4
npx playwright test --workers=8
```

Each player's bar fills as that worker completes its share of the suite, and its marker shows
what the worker is doing right now:

| Marker | Meaning |
| --- | --- |
| `◉` | currently running a test |
| `✓` | last test passed |
| `✕` | last test failed |
| `⊘` | last test was skipped |
| `○` | has not started yet |

Above 12 workers the panel summarises the remainder rather than growing without limit.

## Completion screen layout

The completion screen is three panels — **scoreboard**, **results**, **summary**. By default
(`finalLayout: 'auto'`) they are laid out side by side when the terminal is wide enough, and
stacked when it is not:

| Terminal width | Layout |
| --- | --- |
| ≥ 95 columns | Horizontal — three boxes in a row |
| 48–94 columns | Vertical — the sections stacked in one box |
| < 48 columns | Two-line compact summary |

Spare width goes to the results panel (up to 54 columns), so wider terminals show longer test
names rather than more whitespace. To pin the layout regardless of width:

```ts
['playwright-arcade', { finalLayout: 'horizontal' }]  // always side by side
['playwright-arcade', { finalLayout: 'vertical' }]    // always stacked
```

Forcing `'horizontal'` on a terminal narrower than ~95 columns will wrap; it is there for when you
know the terminal is wide (a demo, a recording) but the width cannot be detected — for example
when output is piped, where the width is assumed to be 80.

## The completion screen

Below the counts sits an **outcome bar** — one bar segmented by how the suite actually split,
with the pass rate (`passed / total`) beside it. Each segment uses both a colour and its own
glyph, so the split stays readable with `NO_COLOR`, on a monochrome terminal, or in the ASCII
theme:

| Segment | Unicode | ASCII | Meaning |
| --- | --- | --- | --- |
| passed | `█` | `#` | green |
| failed | `▓` | `x` | red |
| skipped | `▒` | `~` | grey |
| never ran | `░` | `.` | grey — interrupted or still pending |

Note this is a *results* bar, not the progress bar: progress is always 100% once the run is over,
so showing it again would say nothing. Segment boundaries are computed cumulatively, so rounding
can never make the segments overflow the bar.

Underneath, every finished test is listed under `PASSED` / `FAILED` / `SKIPPED` with a count per
group. Long names are truncated to fit the cabinet; a test that failed and then passed on retry is
listed once, under its final outcome. Full failure messages are still printed after the screen.

## Counting rules

Counts follow Playwright's own semantics:

- The total comes from `suite.allTests()` — never hardcoded.
- **Retries do not inflate the total.** A failing test awaiting a retry is shown as a retry and is
  not counted as a final result until its attempts are exhausted.
- A test that fails and then passes on retry is counted **once**, as a pass, and tracked as flaky.
- `expected`, `unexpected`, `skipped` and `flaky` outcomes map to PASSED / FAILED / SKIPPED.
- `SCORE` is 100 points per passing test.

## CI behavior

CI usually has no interactive TTY, and its logs are captured linearly. The reporter detects this
(`CI` env var, or a non-TTY stdout) and switches to a static mode automatically — no cursor
control and no animation, one line per finished test:

```
[arcade] PLAYWRIGHT TEST ARCADE - run #7 | 12 tests | 4 workers | env DEFAULT
✓ PASS   1/12 level 1 loads the cabinet [chromium] (517ms)
✓ PASS   2/12 level 2 loads the cabinet [chromium] (711ms)
⊘ SKIP   3/12 a bonus stage that is not ready yet [chromium] (0ms)
✕ FAIL   4/12 the boss has too much health [chromium] (5344ms)
```

The completion screen is still printed at the end, followed by full failure details.

Set `interactive: true` to force the live dashboard anyway, or `interactive: false` to force the
static output locally.

## Supported terminals

| Terminal | Behaviour |
| --- | --- |
| Windows Terminal, VS Code, ConEmu, Git Bash | Full unicode dashboard |
| macOS Terminal / iTerm2, Linux terminals | Full unicode dashboard |
| Legacy `cmd.exe` conhost | ASCII theme (`+ - \| # .`) — still aligned |
| CI (GitHub Actions, Jenkins, …) | Static line-per-test output |
| Output piped to a file | Static output, no escape codes |

The reporter also adapts to the **size** of the terminal:

- Narrower than 48 columns → a single-line compact view.
- Too short for the full cabinet → decoration is dropped in order (project/browser meta, then
  animations, then NOW PLAYING, then the banner) so the progress bar, counts and players survive.
  It shrinks rather than disappearing.

`NO_COLOR` and `FORCE_COLOR` are both honoured.

## Environment display

If one of `ENV`, `TEST_ENV`, `ENVIRONMENT` or `NODE_ENV` is set, its value is shown (uppercased):

```bash
ENV=qa npx playwright test    # ENVIRONMENT   QA
```

Otherwise the panel shows `DEFAULT`. There is no configuration to set up.

## Worker output

In interactive mode, anything your tests write to stdout/stderr is held back while the dashboard
owns the terminal and replayed under `--- test output ---` after the completion screen, so
`console.log` cannot tear the UI apart. In static/CI mode output is streamed straight through.

## What this reporter does not do

It is only a reporter. It does not run tests, wrap the Playwright CLI, modify your test files, or
touch Playwright internals — Playwright remains fully in charge of execution.

In particular, **it never changes your exit code**: `onEnd` returns nothing, so the run's status is
whatever Playwright decided. If the terminal misbehaves, rendering silently disables itself and the
test run continues.

## Requirements

- Node.js >= 18
- `@playwright/test` >= 1.40 < 2 (declared as a peer dependency)

The package has no runtime dependencies. Playwright is used for types only, which are erased at
compile time.

## Development

```bash
npm install
npm run build        # tsc -> dist/
npm test             # vitest
npm run typecheck
npm pack --dry-run   # inspect publishable contents
```

## License

MIT
