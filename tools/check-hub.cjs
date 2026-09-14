const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  fs.mkdirSync('qa-artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${process.env.HUB_URL || 'http://127.0.0.1:8123'}/#wild-release`, { waitUntil: 'domcontentloaded' });
      await page.screenshot({ path: `qa-artifacts/hub-initial-${width}.png` });
      const card = page.locator('#wild-release');
      assert.equal(await card.count(), 1);
      assert.equal(await page.locator('#main-current-release').count(), 1);
      const hrefs = await card.locator('a').evaluateAll(nodes => nodes.map(n => n.href));
      for (const href of [
        'https://aimindset-wild.web.app/',
        'https://aimindset-wild.web.app/ai-mindset-consulting/',
        'https://aimindset-wild.web.app/non-profit/',
        'https://github.com/eppelas/aim-web-platform/blob/main/MANDATORY_INSTRUCTIONS.md'
      ]) assert(hrefs.includes(href), `Missing ${href}`);
      const details = card.locator('details');
      assert.equal(await details.getAttribute('open'), null);
      assert.equal(await details.locator('code').isVisible(), false);
      await details.locator('summary').click();
      assert.equal(await details.locator('code').innerText(), '0281');
      assert.equal(await details.locator('code').isVisible(), true);
      await details.locator('summary').click();
      for (const tab of await page.locator('[data-tab-link]').all()) {
        await tab.scrollIntoViewIfNeeded();
        const r = await tab.boundingBox();
        assert(r && r.x >= -1 && r.x + r.width <= width + 1, 'Tab must be reachable within its horizontal scroller');
      }
      await page.locator('#domain-tabs').evaluate(n => { n.scrollLeft = 0; });
      const geometry = await page.evaluate(() => {
        const selectors = '#wild-release,#main-current-release,#domain-tabs';
        return {
          width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
          elements: [...document.querySelectorAll(selectors)].filter(n => n.getClientRects().length).map(n => {
            const r = n.getBoundingClientRect(); return { id: n.id || n.dataset.tabLink, left: r.left, right: r.right };
          })
        };
      });
      for (const r of geometry.elements) assert(r.left >= -1 && r.right <= width + 1, `Overflow: ${JSON.stringify(r)}`);
      assert(geometry.scrollWidth <= width + (width === 1440 ? 32 : 0), `Document overflow: ${JSON.stringify(geometry)}`);
      await card.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `qa-artifacts/hub-${width}.png` });
      results.push({ width, passed: true, geometry });
    }
  } finally {
    fs.writeFileSync('qa-artifacts/checks.json', JSON.stringify(results, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
