import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => {
    window.shareCalls = [];
    window.shareFailure = '';
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: ({ files }) => files?.[0]?.type === 'image/png' });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async ({ files }) => {
      const activated = navigator.userActivation.isActive;
      if (window.shareFailure) throw new DOMException('Test failure', window.shareFailure);
      const file = files[0];
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte);
      window.shareCalls.push({ activated, name: file.name, type: file.type, png: btoa(binary) });
    } });
  });
  await page.goto('http://localhost:5173');
  const share = page.getByRole('button', { name: 'Save / share image', exact: true });
  assert(await share.isDisabled());
  await page.getByRole('textbox', { name: 'Feedback' }).fill('شكراً تيماء ❤️ Mathematics 2026');
  async function verifyShare(button) {
    await button.waitFor();
    await page.waitForFunction(() => !document.querySelector('.share-button')?.disabled);
    const preview = await page.locator('canvas.story').evaluate(c => c.toDataURL('image/png').split(',')[1]);
    const count = await page.evaluate(() => window.shareCalls.length);
    await button.click();
    await page.waitForFunction(n => window.shareCalls.length > n, count);
    const result = await page.evaluate(() => window.shareCalls.at(-1));
    assert(result.activated, 'Sharing must retain the tap activation');
    assert.equal(result.type, 'image/png');
    assert.equal(result.png, preview, 'Shared PNG must match the current preview exactly');
    const bytes = Buffer.from(result.png, 'base64');
    assert.equal(bytes.readUInt32BE(16), 1080); assert.equal(bytes.readUInt32BE(20), 1920);
    return result;
  }
  await verifyShare(share);
  await page.getByRole('button', { name: 'Sapphire Blueprint', exact: true }).click();
  await verifyShare(share);
  await page.getByRole('textbox', { name: 'Feedback' }).fill('شكراً على الشرح الواضح ودعمك الرائع 🤍 '.repeat(80));
  await verifyShare(page.getByRole('button', { name: 'Save / share Story 1', exact: true }));
  await page.getByRole('button', { name: 'Next story' }).click();
  assert((await verifyShare(page.getByRole('button', { name: 'Save / share Story 2', exact: true }))).name.endsWith('-2.png'));
  await page.evaluate(() => { window.shareFailure = 'AbortError'; });
  await page.locator('.share-button').click();
  await page.waitForFunction(() => !document.querySelector('.share-button').disabled);
  assert.equal(await page.getByRole('alert').count(), 0, 'Cancelling is not an error');
  await page.evaluate(() => { window.shareFailure = 'NotAllowedError'; });
  await page.locator('.share-button').click();
  await page.getByRole('alert').waitFor();
  assert(await page.getByRole('button', { name: /Download \d+ PNG images/ }).isEnabled());
  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => { Object.defineProperty(navigator, 'canShare', { value: () => false }); });
  await unsupported.goto('http://localhost:5173');
  await unsupported.getByRole('textbox', { name: 'Feedback' }).fill('Thanks Timaa');
  assert.equal(await unsupported.locator('.share-button').count(), 0);
  assert(await unsupported.getByRole('button', { name: 'Download PNG', exact: true }).isEnabled());
  console.log('PASS: current-preview PNG sharing, tap activation, template/page changes, cancellation, errors, and download fallback. Native iPhone share sheet still requires device testing.');
} finally { await browser.close(); }
