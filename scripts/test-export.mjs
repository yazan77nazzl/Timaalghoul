import { chromium } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, acceptDownloads: true });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => document.querySelector('canvas.story')?.width === 1080);
  const arabic = 'شكراً مس تيماء على الشرح الواضح والمميز. ابنتي أصبحت تحب الرياضيات، وثقتها بنفسها تحسنت كثيراً. نقدر صبرك واهتمامك بكل طالبة. علامتها ٩٨٪ في امتحان Mathematics 2026 🤍';
  await page.getByRole('textbox', { name: 'Feedback' }).fill(arabic);
  await page.waitForTimeout(100);
  for (const name of ['Ivory & Ink', 'Emerald Atelier', 'Rose Reverie', 'Midnight Muse', 'The Editorial', 'Terra Notes', 'Lilac Letter', 'Noir Signature']) {
    await page.getByRole('button', { name, exact: true }).click();
    await page.waitForTimeout(80);
    const preview = await page.locator('canvas.story').evaluate(canvas => canvas.toDataURL('image/png').split(',')[1]);
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
    const download = await pending;
    const path = `test-results/${download.suggestedFilename()}`;
    await download.saveAs(path);
    const png = await readFile(path);
    assert.equal(png.readUInt32BE(16), 1080);
    assert.equal(png.readUInt32BE(20), 1920);
    assert.equal(png.toString('base64'), preview, `${name}: export differs from preview`);
  }
  const result = await page.evaluate(async () => {
    const { paginate, wrapText, sample, loadFonts } = await import('/src/renderer.ts');
    await loadFonts();
    const text = Array.from({ length: 40 }, (_, i) => `${i + 1}. ${sample}`).join('\n');
    const pages = paginate(text);
    const context = document.createElement('canvas').getContext('2d');
    const all = wrapText(context, text, 42, 790);
    const portraitPages = paginate(text, true);
    const english = paginate('Thank you for making mathematics enjoyable and building our daughter’s confidence.');
    const token = 'مَرْحَباً'.repeat(200);
    const tokenPages = paginate(token);
    return { count: pages.length, original: all.join('\n'), paginated: pages.flatMap(p => p.lines).join('\n'), portraitPreserved: portraitPages.flatMap(p => p.lines).join('\n') === all.join('\n'), englishRTL: english[0].rtl, arabicRTL: pages[0].rtl, tokenPreserved: tokenPages.flatMap(p => p.lines).join('') === token, fontReady: document.fonts.check('64px Amiri') };
  });
  assert(result.count > 1); assert.equal(result.original, result.paginated); assert(result.portraitPreserved); assert(result.tokenPreserved); assert(result.fontReady); assert(result.arabicRTL); assert(!result.englishRTL);
  await page.getByRole('textbox').fill(arabic.repeat(20));
  await page.waitForTimeout(100);
  assert(await page.getByRole('button', { name: /Download \d+ PNG images/ }).isVisible());
  await page.getByRole('button', { name: 'Next story' }).click();
  assert((await page.locator('.page-controls').innerText()).includes('Story 2'));
  const expectedCount = Number((await page.locator('.page-controls').innerText()).match(/of (\d+)/)[1]);
  const downloads = [];
  const collect = download => downloads.push(download);
  page.on('download', collect);
  await page.getByRole('button', { name: /Download \d+ PNG images/ }).click();
  await page.waitForFunction(() => !document.querySelector('.download-button')?.textContent.includes('Preparing'));
  for (let attempt = 0; downloads.length < expectedCount && attempt < 50; attempt++) await page.waitForTimeout(100);
  page.off('download', collect);
  assert.equal(downloads.length, expectedCount, 'Every Story must be downloaded');
  for (let i = 0; i < downloads.length; i++) {
    const path = `test-results/long-feedback-${i + 1}.png`;
    await downloads[i].saveAs(path);
    const png = await readFile(path);
    assert.equal(png.readUInt32BE(16), 1080); assert.equal(png.readUInt32BE(20), 1920);
  }
  await page.getByRole('textbox').fill('Thank you for inspiring our daughter and making mathematics enjoyable.');
  const englishDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
  await (await englishDownload).saveAs('test-results/english.png');
  // Reuse a test export as a local image to exercise portrait loading and export.
  await page.locator('input[type=file]').setInputFiles('test-results/english.png');
  await page.getByText('Include portrait', { exact: true }).waitFor();
  const portraitDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download PNG', exact: true }).click();
  await (await portraitDownload).saveAs('test-results/portrait-layout.png');
  const portraitPreview = await page.locator('canvas.story').evaluate(canvas => canvas.toDataURL('image/png').split(',')[1]);
  assert.equal((await readFile('test-results/portrait-layout.png')).toString('base64'), portraitPreview);
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log('PASS: eight Arabic PNGs equal the live preview byte for byte; 1080×1920; fonts loaded; long text and graphemes preserved; English and portrait export; page navigation; mobile layout.');
} finally { await browser.close(); }
