import type { ProgramId } from '../data/types';
import { characterArt } from '../data/characterArt';

/**
 * 취향 테스트 결과를 한 장의 이미지(1080 × 1350, 인스타그램 세로 비율)로 그립니다.
 * 결과 화면과 같은 차례 — 나의 게스트하우스 취향은 → 캐릭터 이름 → 해시태그 셋 → BEST 1 → 소라게 →
 * 게스트하우스 이름 → 한 줄 소개, 맨 아래 브랜드.
 * 캐릭터 그림은 src/assets/characters/hermit-*.webp (data/characterArt.ts) 를 그대로 씁니다.
 */
export interface ResultImageInput {
  id: ProgramId;
  lead: string;
  title: string;
  tags: string[];
  rank: string;
  place: string;
  oneLine?: string;
  brand: string;
}

const W = 1080;
const H = 1350;
const FONT = '"Pretendard Variable", Pretendard, sans-serif';
const C = { bg: '#FAFAF3', ink: '#111111', soft: '#686A64', orange: '#D46A1F', tagBg: '#FCEBDD' };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** 가운데 정렬 글 — 폭을 넘으면 낱말 단위로 줄을 나눕니다. 줄 수를 돌려줌 */
function text(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, maxW: number, lineH: number) {
  const words = str.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

export async function makeResultImage(input: ResultImageInput): Promise<Blob> {
  // Pretendard 가 그림에 쓰이도록 미리 불러 둡니다 (그림에 들어갈 글자를 함께 넘겨 필요한 조각만)
  const glyphs = [input.lead, input.title, ...input.tags, input.rank, input.place, input.oneLine ?? '', input.brand].join('');
  await Promise.all(['500 32px "Pretendard Variable"', '600 32px "Pretendard Variable"', '700 32px "Pretendard Variable"', '800 32px "Pretendard Variable"'].map((f) => document.fonts.load(f, glyphs).catch(() => null)));
  const img = await loadImage(characterArt[input.id]).catch(() => null);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // 머리 — 나의 게스트하우스 취향은
  ctx.fillStyle = C.soft;
  ctx.font = `500 34px ${FONT}`;
  ctx.fillText(input.lead, W / 2, 120);
  // 캐릭터 이름 (…하게)
  ctx.fillStyle = C.orange;
  ctx.font = `800 70px ${FONT}`;
  const titleLines = text(ctx, input.title, W / 2, 215, 960, 84);
  let y = 215 + (titleLines - 1) * 84;

  // 해시태그 — 연한 주황 알약, 가운데 한 줄
  if (input.tags.length) {
    ctx.font = `600 30px ${FONT}`;
    const pads = 28, gap = 16, pillH = 62;
    const widths = input.tags.map((tg) => ctx.measureText(`#${tg}`).width + pads * 2);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
    let x = (W - total) / 2;
    const top = y + 50;
    input.tags.forEach((tg, i) => {
      roundRect(ctx, x, top, widths[i], pillH, pillH / 2, C.tagBg);
      ctx.fillStyle = C.orange;
      ctx.fillText(`#${tg}`, x + widths[i] / 2, top + 41);
      x += widths[i] + gap;
    });
    y = top + pillH;
  }

  // BEST 1
  ctx.fillStyle = C.orange;
  ctx.font = `700 44px ${FONT}`;
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '5px';
  ctx.fillText(input.rank, W / 2, y + 100);
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px';

  // 소라게 — 배경 없이 오린 그림을 상자에 비율 그대로 맞춰 가운데에
  const boxTop = y + 130;
  const boxH = 1350 - boxTop - 330;
  if (img) {
    const s = Math.min(760 / img.width, boxH / img.height);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, (W - dw) / 2, boxTop + (boxH - dh) / 2, dw, dh);
  }

  // 게스트하우스 이름 · 한 줄 소개
  let by = boxTop + boxH + 70;
  ctx.fillStyle = C.ink;
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText(input.place, W / 2, by);
  if (input.oneLine) {
    ctx.fillStyle = C.soft;
    ctx.font = `500 31px ${FONT}`;
    by += 64;
    text(ctx, input.oneLine, W / 2, by, 820, 48);
  }

  // 바닥 — 브랜드
  ctx.fillStyle = C.soft;
  ctx.font = `500 24px ${FONT}`;
  ctx.fillText(input.brand, W / 2, H - 44);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'));
}
