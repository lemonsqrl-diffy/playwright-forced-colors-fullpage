const { test, expect } = require('@playwright/test');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

test('forced colors survive a fullPage screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto(pathToFileURL(path.join(__dirname, 'page.html')).href);

  const read = () =>
    page.$eval('#button', (el) => ({
      background: getComputedStyle(el).backgroundColor,
      forcedColorsMedia: matchMedia('(forced-colors: active)').matches,
    }));

  const afterLoad = await read();
  await page.screenshot({ path: 'viewport.png' });
  const afterViewport = await read();
  await page.screenshot({ path: 'fullpage.png', fullPage: true });
  const afterFullPage = await read();
  console.log({ afterLoad, afterViewport, afterFullPage });

  // Under forced colors the background is a system colour, never the authored rgb(102, 255, 102).
  for (const [step, r] of Object.entries({ afterLoad, afterViewport, afterFullPage })) {
    expect.soft(r.forcedColorsMedia, `${step}: (forced-colors: active) matches`).toBe(true);
    expect.soft(r.background, `${step}: background is forced`).not.toBe('rgb(102, 255, 102)');
  }
});
