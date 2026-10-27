import { useEffect, useRef, type CSSProperties } from 'react';
import { useReducedMotion } from '../lib/motion';
import baseUrl from '../assets/taste-map-base.webp';
import shoreUrl from '../assets/taste-map-shore.webp';
import magUrl from '../assets/taste-map-magnifier.webp';

/**
 * 메인 '취향 지도' 칸의 움직이는 섬 — 받은 섬 그림(돋보기 없는 판) 위로 돋보기가 집들을 하나씩 찾아다님
 * - 화면에 들어오면 돋보기가 집 → 집으로 옮겨 가며 잠깐씩 들여다보고(한라산은 비켜 감), 끝나면 오른쪽 집 위에서 쉼
 * - 돋보기 유리 안은 그 아래 섬을 진짜로 크게 보여 줌 (그림을 확대해 유리 모양으로 오려 냄)
 * - 마우스를 올리면 돋보기가 마우스를 따라감
 * - 물결은 출렁이며 흐르고, 섬 둘레로 잔물결이 퍼짐
 * 동작 줄이기 설정이면 돋보기는 쉬는 자리에 멈춰 있음
 */
const W = 1448;
const H = 770;
// 돋보기 그림(371×333) 속 유리 가운데 · 유리 반지름, 그리고 섬 그림 위에서의 크기 배율
const MAG = { w: 371, h: 333, cx: 140.5, cy: 140.5, rIn: 107 };
const K = 1.18;
const ZOOM = 1.75;
// 집 자리 (섬 그림 픽셀) — 오른쪽 큰 집에서 출발해 한 바퀴
const HOUSES: [number, number][] = [
  [880, 162], [504, 262], [362, 392], [654, 490], [938, 442],
];
const REST: [number, number] = [1106, 286];
const VOLCANO: [number, number] = [728, 330];
// 물결 다섯 개 (그림에서 뺀 자리)
const WAVES = [
  { x: 1280, y: 100, w: 101, h: 20 },
  { x: 303, y: 143, w: 96, h: 17 },
  { x: 78, y: 353, w: 89, h: 17 },
  { x: 1178, y: 558, w: 112, h: 20 },
  { x: 187, y: 598, w: 100, h: 19 },
];
// 물결 한 줄 — 한 굽이(33.3) 넓이의 사인 곡선을 다섯 굽이 이어 그림 (옆으로 한 굽이씩 흘러감)
const WAVE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = -33.3 + (i / 200) * 166.6;
    const y = 10 - 5.2 * Math.sin((x / 33.3) * Math.PI * 2);
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return pts.join(' ');
})();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function TasteMapIsland() {
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const mag = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLImageElement>(null);
  const lens = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    const mEl = mag.current;
    const fEl = frame.current;
    const lEl = lens.current;
    if (!el || !mEl || !fEl || !lEl) return;
    let pos: [number, number] = [...REST];
    let tilt = 0;
    let raf = 0;
    let tour: { t0: number; steps: { from: [number, number]; to: [number, number]; ctrl: [number, number] }[] } | null = null;
    let follow: [number, number] | null = null;

    // 돋보기를 (x, y) 에 — 유리 가운데가 그 점에 오도록, 유리 안은 그 아래 섬을 크게
    const place = (x: number, y: number, rot: number) => {
      const s = el.clientWidth / W;
      mEl.style.left = `${((x - MAG.cx * K) / W) * 100}%`;
      mEl.style.top = `${((y - MAG.cy * K) / H) * 100}%`;
      fEl.style.transform = `rotate(${rot.toFixed(2)}deg)`;
      const r = MAG.rIn * K * s;
      lEl.style.backgroundSize = `${W * s * ZOOM}px ${H * s * ZOOM}px`;
      lEl.style.backgroundPosition = `${r - x * s * ZOOM}px ${r - y * s * ZOOM}px`;
    };

    // 집과 집 사이는 한라산에서 바깥으로 살짝 휘어 지나감
    const plan = () => {
      const stops = [REST, ...HOUSES, REST];
      const steps = [];
      for (let i = 0; i < stops.length - 1; i++) {
        const a = stops[i];
        const b = stops[i + 1];
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        const ctrl: [number, number] = [mx + (mx - VOLCANO[0]) * 0.45, my + (my - VOLCANO[1]) * 0.45];
        steps.push({ from: a, to: b, ctrl });
      }
      return steps;
    };
    const MOVE = 1150;
    const HOLD = 900;

    const tick = (now: number) => {
      let target: [number, number] = REST;
      let rot = 0;
      if (tour) {
        const t = Math.max(0, now - tour.t0); // 출발 전 잠깐은 첫 자리에서 대기
        const per = MOVE + HOLD;
        const i = Math.floor(t / per);
        if (i >= tour.steps.length) {
          tour = null;
        } else {
          const st = tour.steps[i];
          const local = t - i * per;
          if (local < MOVE) {
            const u = ease(local / MOVE);
            const q = (p: number, c: number, e: number) => (1 - u) * (1 - u) * p + 2 * (1 - u) * u * c + u * u * e;
            target = [q(st.from[0], st.ctrl[0], st.to[0]), q(st.from[1], st.ctrl[1], st.to[1])];
            // 움직이는 쪽으로 살짝 기울임
            rot = Math.sin(u * Math.PI) * Math.sign(st.to[0] - st.from[0]) * 9;
          } else {
            // 집 위에서 이리저리 들여다봄
            const h = (local - MOVE) / HOLD;
            target = [st.to[0] + Math.sin(h * Math.PI * 2) * 14, st.to[1] + Math.sin(h * Math.PI * 4) * 6];
            rot = Math.sin(h * Math.PI * 2) * 4;
          }
        }
      }
      if (!tour) {
        if (follow) {
          target = follow;
        } else {
          // 쉬는 동안 둥실
          target = [REST[0], REST[1] + Math.sin(now / 650) * 5];
          rot = Math.sin(now / 900) * 2;
        }
      }
      // 부드럽게 따라감
      const k = tour ? 1 : 0.14;
      pos = [pos[0] + (target[0] - pos[0]) * k, pos[1] + (target[1] - pos[1]) * k];
      tilt += (rot - tilt) * (tour ? 1 : 0.14);
      place(pos[0], pos[1], tilt);
      raf = requestAnimationFrame(tick);
    };

    place(...REST, 0);
    if (reduced) {
      const onResize = () => place(...REST, 0);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    // 화면에 들어올 때마다 한 바퀴 — 안 보일 때는 멈춤
    let visible = false;
    const io = new IntersectionObserver(
      ([en]) => {
        const v = en.intersectionRatio >= 0.45;
        if (v && !visible) {
          tour = { t0: performance.now() + 350, steps: plan() };
          if (!raf) raf = requestAnimationFrame(tick);
        }
        if (!en.isIntersecting) {
          tour = null;
          cancelAnimationFrame(raf);
          raf = 0;
          pos = [...REST];
          place(...REST, 0);
        }
        visible = v;
      },
      { threshold: [0, 0.45] },
    );
    io.observe(el);

    // 마우스를 올리면 돋보기가 따라감 (손가락은 그대로 눌러서 지도 페이지로)
    const toImg = (e: PointerEvent): [number, number] => {
      const b = el.getBoundingClientRect();
      return [((e.clientX - b.left) / b.width) * W, ((e.clientY - b.top) / b.height) * H];
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tour = null;
      follow = toImg(e);
    };
    const onLeave = () => {
      follow = null;
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;
  return (
    <div ref={box} className="tmi" aria-hidden="true">
      <img className="tmi__shore" src={shoreUrl} alt="" width={W} height={H} />
      <img className="tmi__shore tmi__shore--late" src={shoreUrl} alt="" width={W} height={H} />
      <img className="tmi__base" src={baseUrl} alt="" width={W} height={H} decoding="async" />
      {WAVES.map((w, i) => (
        <svg
          key={i}
          className="tmi__wave"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          style={{ left: pct(w.x, W), top: pct(w.y - 3, H), width: pct(w.w, W), height: pct(w.h + 6, H), '--d': `${-i * 0.37}s` } as CSSProperties}
        >
          <defs>
            <linearGradient id={`tmi-fade-${i}`} x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".14" stopColor="#fff" />
              <stop offset=".86" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id={`tmi-mask-${i}`}>
              <rect x="0" y="0" width="100" height="20" fill={`url(#tmi-fade-${i})`} />
            </mask>
          </defs>
          <g mask={`url(#tmi-mask-${i})`}>
            <path className="tmi__wave-line" d={WAVE_PATH} />
          </g>
        </svg>
      ))}
      <div
        ref={mag}
        className="tmi__mag"
        style={{ width: pct(MAG.w * K, W), height: pct(MAG.h * K, H) }}
      >
        <div
          ref={lens}
          className="tmi__lens"
          style={{
            left: pct(MAG.cx - MAG.rIn, MAG.w),
            top: pct(MAG.cy - MAG.rIn, MAG.h),
            width: pct(MAG.rIn * 2, MAG.w),
            height: pct(MAG.rIn * 2, MAG.h),
            backgroundImage: `url(${baseUrl})`,
          }}
        />
        <img
          ref={frame}
          className="tmi__frame"
          src={magUrl}
          alt=""
          width={MAG.w}
          height={MAG.h}
          style={{ transformOrigin: `${pct(MAG.cx, MAG.w)} ${pct(MAG.cy, MAG.h)}` }}
        />
      </div>
    </div>
  );
}
