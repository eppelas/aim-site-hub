const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = (process.env.HUB_URL || 'http://127.0.0.1:8123').replace(/\/$/, '');
const artifacts = process.env.HUB_QA_DIR || 'qa-artifacts';
const widths = [1440, 1024, 768, 390, 320];
const tabs = ['overview', 'analytics', 'tools', 'rules', 'qa', 'design'];
const results = [];
const errors = [];
fs.mkdirSync(artifacts, { recursive: true });

async function checkWidth(page, label) {
  const geometry = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    nav: [...document.querySelectorAll('nav a')].filter(e => e.getClientRects().length).map(e => {
      const r = e.getBoundingClientRect();
      return { text: e.textContent.trim(), left: r.left, right: r.right };
    }),
  }));
  assert(geometry.document <= geometry.viewport, `${label}: document overflow ${JSON.stringify(geometry)}`);
  for (const r of geometry.nav) assert(r.left >= -1 && r.right <= geometry.viewport + 1, `${label}: navigation overflow ${JSON.stringify(r)}`);
  results.push({ label, geometry });
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.HUB_BROWSER_CHANNEL ? { channel: process.env.HUB_BROWSER_CHANNEL } : {}) });
  try {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/#current`, { waitUntil: 'networkidle' });
      const primary = page.locator('#current .primary-sites > article');
      assert.equal(await primary.count(), 3, 'Exactly three primary website surfaces');
      const expected = {
        'wild-release': ['https://aimindset-wild.web.app/', 'https://aimindset-wild.web.app/ai-mindset-consulting/', 'https://aimindset-wild.web.app/non-profit/'],
        'wild-source-release': ['https://github.com/eppelas/aimindset-main/tree/wild', 'https://eppelas.github.io/aimindset-main/wild/'],
        'production-release': ['https://aimindset.org/'],
      };
      for (const [id, hrefs] of Object.entries(expected)) {
        const actual = await page.locator(`#${id} a`).evaluateAll(nodes => nodes.map(n => n.href));
        for (const href of hrefs) assert(actual.includes(href), `Missing primary destination: ${href}`);
      }
      assert.match(await page.locator('#wild-source-release').innerText(), /финальн/i);
      assert.equal(await page.locator('#architecture a[href="https://github.com/eppelas/aim-web-platform/blob/main/MANDATORY_INSTRUCTIONS.md"]').count() > 0, true);
      const password = page.locator('#wild-release .editor-password');
      assert.equal(await password.getAttribute('open'), null);
      assert.equal(await password.locator('code').isVisible(), false);
      await password.locator('summary').click();
      assert.equal(await password.locator('code').innerText(), '0281');
      assert.equal(await password.locator('code').isVisible(), true);
      await password.locator('summary').click();
      assert.deepEqual(await page.locator('.site-split a').evaluateAll(nodes => nodes.map(n => n.href)), [expected['wild-release'][0], expected['wild-source-release'][0], expected['production-release'][0]]);
      assert.equal(await page.locator('a a').count(), 0, 'No nested links');
      for (const id of ['main-current-release', 'v3-archive', 'staging-archive', 'sanity-archive', 'design-index-archive']) {
        assert.equal(await page.locator(`#${id}`).evaluate(n => n.closest('section').id), 'site-archive', `${id} must remain in the archive`);
      }
      const mapGeometry = await page.locator('.system-map').evaluate(map => {
        const box = map.getBoundingClientRect();
        return [...map.querySelectorAll('.map-node')].map(node => {
          const r = node.getBoundingClientRect();
          return { name: node.className, top: r.top - box.top, bottom: r.bottom - box.top, height: box.height };
        });
      });
      for (const node of mapGeometry) assert(node.top >= -1 && node.bottom <= node.height + 1, `Map card outside frame: ${JSON.stringify(node)}`);
      if ([1440, 390].includes(width)) await page.locator('#current').screenshot({ path: path.join(artifacts, `primary-${width}.png`) });
      for (const tab of tabs) {
        await page.locator(`[data-tab-link="${tab}"]`).click();
        await page.mouse.move(0, 0);
        await checkWidth(page, `${width}/${tab}`);
      }
      await page.locator('[data-tab-link="rules"]').click();
      for (const details of await page.locator('#rules-pipelines .technical-details').all()) {
        await details.locator('summary').click();
        await checkWidth(page, `${width}/technical-reference`);
        await details.locator('summary').click();
      }
      await page.locator('[data-tab-link="overview"]').click();
      if (width === 1440) {
        for (const node of await page.locator('.map-node').all()) {
          await node.hover();
          await checkWidth(page, `${width}/map-hover`);
        }
        const first = page.locator('.site-split a').first();
        await first.focus();
        assert.equal(await first.evaluate(n => n === document.activeElement), true);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.href), expected['wild-source-release'][0]);
        await page.locator('.system-map').screenshot({ path: path.join(artifacts, 'map-desktop.png') });
      }
      await page.locator('#hub-search').fill('Sanity');
      assert.equal(await page.locator('#sanity-archive').isVisible(), true);
      await checkWidth(page, `${width}/search`);
      await page.locator('#hub-search').press('Escape');
      assert.equal(await page.locator('.technical-details[open]').count(), 0);
    }

    await page.goto(`${base}/#site-archive`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#site-archive').isVisible(), true, 'Archive deep link');
    await page.locator('.archive-thumb').nth(1).click();
    assert.match(await page.locator('#archive-preview-image').getAttribute('src'), /legacy-style-29/);
    await page.locator('#archive-preview-button').click();
    assert.equal(await page.locator('#lightbox').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lightbox').isVisible(), false);

    const links = await page.locator('a[href]').evaluateAll(nodes => [...new Set(nodes.map(n => n.getAttribute('href')))]);
    for (const href of links.filter(href => href.startsWith('#') && !href.startsWith('#tab-'))) {
      assert.equal(await page.locator(`[id="${href.slice(1)}"]`).count(), 1, `Broken fragment ${href}`);
    }
    // Validate every Hub-owned destination, including documents opened through the reader.
    const internal = new Set();
    for (const href of links.filter(href => !/^(?:https?:|#|mailto:)/.test(href))) {
      const url = new URL(href, `${base}/`);
      internal.add(url.href);
      if (url.searchParams.has('f')) internal.add(new URL(url.searchParams.get('f'), `${base}/`).href);
    }
    for (const url of internal) {
      const response = await page.request.get(url);
      assert.equal(response.status(), 200, `Broken Hub link ${url}`);
    }
    results.push({ internalLinksChecked: internal.size });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      for (const file of ['analytics.html', 'metrika-report.html', 'sanity-cms.html', 'md.html', 'md.html?f=website-ops/site-status-2026-07.md']) {
        await page.goto(`${base}/${file}`, { waitUntil: 'networkidle' });
        await checkWidth(page, `${width}/${file}`);
        if (file === 'md.html') {
          assert.equal(await page.getByRole('heading', { name: 'Выберите документ' }).count(), 1);
          assert.equal(await page.locator('#download-link').isVisible(), false);
        }
        if (file.includes('?f=')) assert.match(await page.locator('#content').innerText(), /Архив прежнего/);
      }
    }
    assert.deepEqual(errors, [], 'No browser runtime errors');
    console.log(JSON.stringify({ passed: true, checks: results.length, internalLinksChecked: internal.size }));
  } finally {
    fs.writeFileSync(path.join(artifacts, 'checks.json'), JSON.stringify({ results, errors }, null, 2));
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
