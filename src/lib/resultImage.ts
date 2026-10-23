import type { ProgramId } from '../data/types';
import { characterArt } from '../data/characterArt';

/**
 * 취향 테스트 결과를 한 장의 이미지(1080 × 1350, 인스타그램 세로 비율)로 그립니다.
 * 위: 나의 여행 취향은 → 1위 캐릭터 이름 · 게스트하우스 이름 / 가운데: 1위 소라게 크게 / 아래: 2 · 3위 소라게 나란히.
 * 캐릭터 그림은 src/assets/characters/hermit-*.webp (data/characterArt.ts) 를 그대로 씁니다.
 */
export interface ResultImagePick {
  id: ProgramId;
  rank: string;
  charName: string;
  place: string;
}

export interface ResultImageInput {
  lead: string;
  brand: string;
  picks: ResultImagePick[];
}

const W = 1080;
const H = 1350;
const FONT = '"Kart Gothic", "Pretendard Variable", Pretendard, sans-serif';
const C = { bg: '#FAFAF3', card: '#FDF6EA', ink: '#111111', soft: '#686A64', orange: '#D46A1F', line: '#E4E3D8' };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** 가운데 정렬 글 — 폭을 넘으면 낱말 단위로 줄을 나눕니다 */
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
  // 카트 고딕이 그림에 쓰이도록 미리 불러 둡니다
  await Promise.all(['500 32px "Kart Gothic"', '700 32px "Kart Gothic"', '800 32px "Kart Gothic"'].map((f) => document.fonts.load(f).catch(() => null)));
  const imgs = await Promise.all(input.picks.map((p) => loadImage(characterArt[p.id]).catch(() => null)));

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
  ctx.font = `500 32px ${FONT}`;
  ctx.fillText(input.lead, W / 2, 140);
  // 1위 — 캐릭터 이름 · 게스트하우스 이름 · 큰 캐릭터
  const [first, ...rest] = input.picks;
  if (first) {
    ctx.fillStyle = C.orange;
    ctx.font = `800 64px ${FONT}`;
    text(ctx, first.charName, W / 2, 245, 940, 74);
    ctx.fillStyle = C.ink;
    ctx.font = `500 32px ${FONT}`;
    ctx.fillText(first.place, W / 2, 302);
  }
  // 소라게 그림은 배경 없이 오린 것 — 카드 안 상자에 비율 그대로 맞춰 가운데에
  const cardY = 350;
  const firstH = 560;
  const fit = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const s = Math.min(w / img.width, h / img.height);
    const dw = img.width * s, dh = img.height * s;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  };
  roundRect(ctx, W / 2 - 340, cardY, 680, firstH, 32, C.card);
  if (imgs[0]) fit(imgs[0], W / 2 - 300, cardY + 40, 600, firstH - 70);
  if (first) {
    roundRect(ctx, W / 2 - 318, cardY + 22, 150, 48, 24, '#FFFFFF');
    ctx.fillStyle = C.orange;
    ctx.font = `700 22px ${FONT}`;
    ctx.fillText(first.rank, W / 2 - 243, cardY + 54);
  }

  // 2 · 3위 — 나란히
  const smallY = cardY + firstH + 40;
  rest.slice(0, 2).forEach((p, i) => {
    const x = 90 + i * 460;
    roundRect(ctx, x, smallY, 440, 250, 28, C.card);
    const img = imgs[i + 1];
    if (img) fit(img, x + 14, smallY + 20, 196, 210);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.orange;
    ctx.font = `700 20px ${FONT}`;
    ctx.fillText(p.rank, x + 222, smallY + 70);
    ctx.fillStyle = C.ink;
    ctx.font = `700 27px ${FONT}`;
    const n = text(ctx, p.charName, x + 222, smallY + 112, 200, 36);
    ctx.fillStyle = C.orange;
    ctx.font = `500 22px ${FONT}`;
    ctx.fillText(p.place, x + 222, smallY + 112 + n * 36 + 6);
    ctx.textAlign = 'center';
  });

  // 바닥 — 브랜드
  ctx.fillStyle = C.soft;
  ctx.font = `500 22px ${FONT}`;
  ctx.fillText(input.brand, W / 2, H - 42);

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'));
}
