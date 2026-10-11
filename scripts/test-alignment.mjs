import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

await mkdir('test-results', { recursive: true });
for (const [name, engine, options] of [['chrome', chromium, { channel: 'chrome' }]]) {
  const browser = await engine.launch({ headless: true, ...options });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
    await page.goto('http://localhost:5173');
    await page.waitForFunction(() => document.querySelector('canvas.story')?.width === 1080);
    const results = await page.evaluate(async () => {
      const { drawFeedback } = await import('/src/feedback.ts');
      const { paginate, loadFonts } = await import('/src/renderer.ts');
      await loadFonts();
      const results = [];
      for (const value of ['Thanks timaa❤️', 'شكراً تيماء ❤️', 'Thank you 🤍✨', 'شكراً تيماء Mathematics 2026 🤍', 'رائع! علامتي ٩٨٪ ❤️']) {
        const page = paginate(value)[0];
        const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        drawFeedback(ctx, page, '#ffffff', 887);
        const pixels = ctx.getImageData(0, 0, 1080, 1920).data;
        let min = 1080, max = -1;
        for (let y = 887; y < 1647; y++) for (let x = 0; x < 1080; x++) if (pixels[(y * 1080 + x) * 4 + 3] > 40) { min = Math.min(min, x); max = Math.max(max, x); }
        results.push({ value, min, max, center: (min + max) / 2 });
      }
      return results;
    });
    for (const r of results) {
      assert(r.max > r.min, `${name}: text is missing`);
      assert(Math.abs(r.center - 540) < 24, `${name}: ${r.value} is off-center at ${r.center}`);
      assert(r.min >= 125 && r.max <= 955, `${name}: feedback exceeds the safe text region`);
    }
    await page.getByRole('button', { name: 'The Golden Orbit', exact: true }).click();
    await page.getByRole('textbox', { name: 'Feedback' }).fill('Thanks timaa❤️');
    await page.waitForTimeout(100);
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
    await (await pending).saveAs(`test-results/alignment-${name}.png`);
    await page.locator('canvas.story').screenshot({ path: `test-results/alignment-${name}-preview.png` });
    console.log(`PASS ${name}: English, Arabic, mixed text, punctuation, and emoji stay centered and inside the feedback panel.`);
  } finally { await browser.close(); }
}
