import type { StoryPage } from './renderer';

/** Explicit positioning avoids WebKit's center alignment bug with shaped/emoji text. */
export function drawFeedback(ctx: CanvasRenderingContext2D, page: StoryPage, color: string, top: number, area = 760) {
  ctx.save();
  ctx.font = `${page.size}px ${page.rtl ? 'Amiri' : '"DM Sans"'}`;
  ctx.direction = page.rtl ? 'rtl' : 'ltr';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '0px';
  ctx.wordSpacing = '0px';
  ctx.fillStyle = color;
  const spacing = page.size * 1.72;
  const start = top + (area - page.lines.length * spacing) / 2;
  page.lines.forEach((line, index) => {
    const width = ctx.measureText(line).width;
    ctx.fillText(line, (1080 - width) / 2, start + spacing * (index + 0.5));
  });
  ctx.restore();
}
