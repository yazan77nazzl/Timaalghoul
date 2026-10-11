export const WIDTH = 1080;
export const HEIGHT = 1920;
export const sample = 'شكراً من القلب مس تيماء على تعبك واهتمامك. أسلوبك في الشرح رائع وبسيط، وقدرتِ تخلي الرياضيات مادة ممتعة ومفهومة. بنتي صارت تحب الدرس وتنتظره، وثقتها بنفسها تحسّنت كثير. ممتنين لوجود معلمة مثلك، الله يعطيكِ ألف عافية 🤍';
export const templates = [
  { id: 'ivory', name: 'Ivory & Ink', mood: 'Quiet, timeless elegance', bg: '#f3eee4', ink: '#282d28', accent: '#9b8051' },
  { id: 'emerald', name: 'Emerald Atelier', mood: 'Rich green, golden details', bg: '#143e35', ink: '#f7efdc', accent: '#c9af77' },
  { id: 'rose', name: 'Rose Reverie', mood: 'Soft blush, graceful curves', bg: '#f2dedc', ink: '#603b40', accent: '#ac7278' },
  { id: 'midnight', name: 'Midnight Muse', mood: 'Celestial blue, luminous gold', bg: '#172438', ink: '#fff2db', accent: '#c7a978' },
  { id: 'editorial', name: 'The Editorial', mood: 'Bold type, gallery simplicity', bg: '#f5f3ed', ink: '#212824', accent: '#71816d' },
  { id: 'terracotta', name: 'Terra Notes', mood: 'Warm earth, sculptural shapes', bg: '#ae5744', ink: '#fff4e2', accent: '#e6b38b' },
  { id: 'lilac', name: 'Lilac Letter', mood: 'A delicate personal keepsake', bg: '#e9e4f0', ink: '#4e4561', accent: '#9383ac' },
  { id: 'noir', name: 'Noir Signature', mood: 'Black velvet, champagne gold', bg: '#22211f', ink: '#f1e4cb', accent: '#b69b6b' },
  { id: 'golden-study', name: 'Golden Study', mood: 'Cinematic portrait, ivory & gold', bg: '#101b20', ink: '#efcea0', accent: '#d4ae73' },
  { id: 'golden-editorial', name: 'Golden Editorial', mood: 'Portrait-led, polished brass', bg: '#121b20', ink: '#efcea0', accent: '#d4ae73' },
  { id: 'golden-legacy', name: 'Golden Legacy', mood: 'A luminous signature keepsake', bg: '#17201f', ink: '#efcea0', accent: '#d4ae73' },
  { id: 'premium-obsidian', name: 'Obsidian Gold', mood: 'Natural marble, luminous gold', bg: '#141a19', ink: '#f4e5c6', accent: '#c9a26b' },
  { id: 'premium-maison', name: 'Maison Bordeaux', mood: 'Burgundy velvet, rose gold', bg: '#401f2a', ink: '#f0d9ce', accent: '#c89c8c' },
  { id: 'premium-champagne', name: 'Champagne Atelier', mood: 'Warm silk, sculpted bronze', bg: '#bc9a76', ink: '#f8e8d0', accent: '#594433' },
  { id: 'premium-royal', name: 'Royal Geometry', mood: 'Art deco, sapphire & brass', bg: '#10283c', ink: '#f2dfb5', accent: '#c3a065' },
  { id: 'premium-gallery', name: 'The Private Gallery', mood: 'Architectural, quietly refined', bg: '#26312c', ink: '#f0e5d2', accent: '#baaa86' },
  { id: 'premium-mathematics', name: 'Mathematics Atelier', mood: 'Golden equations, geometric elegance', bg: '#0b292a', ink: '#f4e7c9', accent: '#d2ae70' },
] as const;
export type Template = typeof templates[number];
export type StoryPage = { lines: string[]; size: number; rtl: boolean };
const feedbackFont = (size: number, rtl: boolean) => `${size}px ${rtl ? 'Amiri' : '"DM Sans"'}`;
// Segments remain in logical order. The browser performs shaping and bidi.
export function wrapText(ctx: CanvasRenderingContext2D, text: string, size: number, width: number): string[] {
  ctx.font = feedbackFont(size, /[\u0600-\u06ff]/u.test(text));
  const result: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, '\n').split('\n')) {
    if (!paragraph) { result.push(''); continue; }
    const words = paragraph.match(/\s+|\S+/gu) ?? [];
    let line = '';
    for (const word of words) {
      if (ctx.measureText(line + word).width <= width) { line += word; continue; }
      if (line.trim()) { result.push(line.trim()); line = ''; }
      if (ctx.measureText(word).width <= width) { line = word.trimStart(); continue; }
      // A long unbroken token wraps only at complete grapheme boundaries.
      for (const { segment } of new Intl.Segmenter('ar', { granularity: 'grapheme' }).segment(word)) {
        if (line && ctx.measureText(line + segment).width > width) { result.push(line); line = ''; }
        line += segment;
      }
    }
    if (line.trim()) result.push(line.trim());
  }
  return result.length ? result : [''];
}
export function paginate(text: string, _portrait = false): StoryPage[] {
  const ctx = document.createElement('canvas').getContext('2d')!;
  const rtl = /[\u0600-\u06ff]/u.test(text);
  const available = 760;
  for (let size = 64; size >= 42; size -= 2) {
    const lines = wrapText(ctx, text, size, 790);
    if (lines.length * size * 1.72 <= available) return [{ lines, size, rtl }];
  }
  const lines = wrapText(ctx, text, 42, 790);
  const capacity = Math.floor(available / (42 * 1.72));
  const pages: StoryPage[] = [];
  for (let i = 0; i < lines.length; i += capacity) pages.push({ lines: lines.slice(i, i + capacity), size: 42, rtl });
  return pages;
}
export async function loadFonts() {
  await Promise.all([document.fonts.load('64px Amiri', 'شكراً تيماء الرياضيات'), document.fonts.load('64px Amiri', 'Mathematics 2026'), document.fonts.load('500 90px "Cormorant Garamond"', 'Timaa Al Ghoul'), document.fonts.load('500 23px "DM Sans"'), document.fonts.load('64px "DM Sans"')]);
  await document.fonts.ready;
}

