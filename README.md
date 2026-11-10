# Forced colors are lost after a fullPage screenshot

A minimal reproduction of a Playwright 1.65.0 regression in Chromium.

`page.emulateMedia({ forcedColors: 'active' })` stops applying after `page.screenshot({ fullPage: true })` on a page taller than the viewport. The button's computed background goes back to the authored `rgb(102, 255, 102)`, and the full-page PNG is captured without forced colors. Meanwhile `matchMedia('(forced-colors: active)')` still reports `true`. A viewport-sized screenshot does not trigger it.

## Run it

```sh
npm install
npx playwright install chromium
npm test
```

On 1.65.0 the test fails at `afterFullPage: background is forced`.

To see the last good version pass, run:

```sh
npm install --save-exact -D @playwright/test@1.64.1
npx playwright install chromium
npm test
```

## Results

| Playwright | Chromium | after load | after viewport screenshot | after fullPage screenshot |
|---|---|---|---|---|
| 1.64.1 | 156.0.8078.4 | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` |
| 1.65.0 | 158.0.8127.18 | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgb(102, 255, 102)` |

1.66.0-alpha-2026-11-10, which also bundles Chromium 158.0.8127.18, behaves like 1.65.0.

## Workaround

Instead of `fullPage: true`, resize the viewport to the page height and take a normal screenshot. On 1.65.0 this keeps forced colors, in both the computed style and the PNG.
