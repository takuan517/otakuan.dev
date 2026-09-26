import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const routes = ['/', '/about/', '/services/', '/works/', '/contact/', '/works/conference-website/', '/works/engineering-metrics/', '/404.html'];
await fs.mkdir('reports', { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(base + route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `${route} at ${width}px: horizontal overflow`);
      if (width === 390 || width === 1440) {
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
        assert.deepEqual(axe.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), [], `${route} at ${width}px: axe`);
        results.push({ route, width, axeViolations: axe.violations.length });
      }
      if (width === 1440) {
        await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').innerText(), 'Skip to main content');
        await page.keyboard.press('Enter');
        assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
        // Starting afresh, visit each native focusable control in DOM order.
        await page.goto(base + route);
        const focusableCount = await page.locator('a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled)').count();
        for (let i = 0; i < focusableCount; i++) {
          await page.keyboard.press('Tab');
          const focus = await page.locator(':focus').evaluate((el) => ({ tag: el.tagName, outline: getComputedStyle(el).outlineStyle, width: parseFloat(getComputedStyle(el).outlineWidth), visible: el.getBoundingClientRect().width > 0 }));
          assert.notEqual(focus.tag, 'BODY');
          assert.ok(focus.visible && focus.outline !== 'none' && focus.width >= 2, `${route}: visible keyboard focus`);
        }
      }
      if ((width === 390 || width === 1440) && ['/', '/contact/', '/services/'].includes(route)) {
        await page.goto(base + route);
        await page.screenshot({ path: `reports/${route === '/' ? 'home' : route.replaceAll('/', '')}-${width}.png`, fullPage: true });
      }
    }
    await context.close();
  }
  const zoom = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const zoomPage = await zoom.newPage();
  for (const route of routes) {
    await zoomPage.goto(base + route);
    await zoomPage.addStyleTag({ content: 'html { font-size: 200%; }' });
    assert.equal(await zoomPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route}: 200% text resize overflow`);
  }
  await zoom.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await nojs.newPage();
  for (const route of routes) {
    await page.goto(base + route);
    assert.equal(await page.locator('h1').count(), 1);
    await page.locator('nav a[href="/contact/"]').click();
    assert.equal(new URL(page.url()).pathname, '/contact/');
  }
  await nojs.close();
  await fs.writeFile('reports/browser.json', JSON.stringify({ results, responsiveWidths: [320, 390, 768, 1440, 1920], keyboard: 'pass', textResize200Percent: 'pass', noJavaScript: 'pass', reducedMotion: 'enabled throughout' }, null, 2));
  console.log('PASS: 8 pages × 5 widths, axe on mobile + desktop, keyboard focus + skip links, JavaScript disabled navigation.');
} finally { await browser.close(); }
