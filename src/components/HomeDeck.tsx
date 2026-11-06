import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '../i18n';
import '../styles/deck.css';

/* ------------------------------------------------------------------
   휴대폰 메인 세로 넘겨보기(풀페이지) — 인트로 → 집 → 취향 테스트 → 취향 지도 → 방명록 → 체크아웃
   · 칸마다 화면 높이 한 장. 손가락을 위로 밀면 지금 칸이 위로 밀려나며 다음 칸이 아래에서 올라옴 (0.7초 ease-in-out)
   · 칸 안 내용이 길면 칸 안에서 먼저 스크롤 — 끝(맨 아래 · 맨 위)에 닿은 뒤 한 번 더 밀어야 넘어감
     (칸 안 스크롤 · 관성도 그 칸 끝에서 멈춤 — 여러 칸을 건너뛰지 않게)
   · 인트로 안의 단계(질문 → 단어 → 전환 문구 → CHECK IN)는 인트로가 맡고, 다 나온 뒤 밀면 다음 칸
   · 입력창 · 지도 위에서 시작한 손짓, 가로 손짓, 두 손가락(확대)은 그대로 둠
   · 페이지 스크롤은 그대로(window) — 상단 바 색 · 메뉴로 칸 찾아가기 · 뒤로 가기 자리 기억이 그대로 동작
------------------------------------------------------------------- */

export const HOME_PANELS = ['intro', 'roomtour', 'find', 'tastemap', 'guest', 'checkout'] as const;
/** 오른쪽 점 — CHECK IN(인트로 마지막 장면)부터 체크아웃까지 (인트로 앞부분 질문 · 단어에서는 점을 숨김) */
const DOT_PANELS: Panels = ['intro', 'roomtour', 'find', 'tastemap', 'guest', 'checkout'];
type Panels = readonly string[];

/** 넘어가는 시간(ms) */
const DUR = 700;
/** 넘긴 뒤 이 시간 동안 이어지는 휠 · 관성은 무시 */
const COOLDOWN = 300;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const scrollToY = (y: number) => window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });

/** 칸의 위 끝 · 아래 끝 자리(페이지 스크롤 값) — 칸이 화면보다 길면 아래 끝 = 칸 바닥이 화면 바닥에 닿는 자리
 *  ownLast — 마지막 칸 아래(푸터)로는 내려가지 않음 (더 내리면 다음 페이지로 넘어가는 메인) */
function bounds(ids: Panels, k: number, ownLast = false) {
  const el = document.getElementById(ids[k]);
  const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
  const next = k + 1 < ids.length ? document.getElementById(ids[k + 1]) : null;
  const bottom = next ? next.getBoundingClientRect().top + window.scrollY : ownLast && el ? top + el.offsetHeight : document.documentElement.scrollHeight;
  return { top, end: Math.max(top, bottom - window.innerHeight) };
}

/** 지금 보고 있는 칸 — 화면 위 끝이 들어가 있는 칸 */
function current(ids: Panels, y = window.scrollY) {
  let k = 0;
  ids.forEach((_, i) => {
    if (bounds(ids, i).top <= y + 2) k = i;
  });
  return k;
}

const blocked = (target: EventTarget | null) => {
  const el = target instanceof Element ? target : null;
  if (!el || !el.closest('#main')) return true;
  return !!el.closest('input, textarea, select, [contenteditable="true"], .leaflet-container');
};

/** panels — 넘겨볼 칸 id 들(첫 칸이 'intro' 면 인트로 단계는 인트로가 맡음) · dots — 오른쪽 점 보이기 · onPastEnd — 마지막 칸에서 더 내리면 */
/** snap — 휠 · 손가락 한 번에 한 칸씩 맞춰 넘김 (false 면 보통 스크롤처럼 부드럽게 흐르고, 오른쪽 점만 지금 칸을 보여 줌) */
export function HomeDeck({ panels = HOME_PANELS, dots = true, onPastEnd, snap = true }: { panels?: Panels; dots?: boolean; onPastEnd?: () => void; snap?: boolean }) {
  const { ui } = useContent();
  const t = ui.deck;
  const [index, setIndex] = useState(0);
  // 인트로가 CHECK IN 장면까지 왔는지 — 그때부터 점을 보임
  const [checkin, setCheckin] = useState(false);
  useEffect(() => {
    const el = document.getElementById('intro');
    if (!el) return;
    const update = () => setCheckin(el.dataset.phase === 'reveal');
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { attributes: true, attributeFilter: ['data-phase'] });
    return () => mo.disconnect();
  }, []);
  const go = useRef<(k: number, toEnd?: boolean) => void>(() => {});
  const pastEnd = useRef(onPastEnd);
  pastEnd.current = onPastEnd;
  const ownLast = !!onPastEnd;

  useEffect(() => {
    let busy = false;
    let quietUntil = 0;
    let arrivedAt = 0;
    let lastInner = 0;
    let anim = 0;
    const stop = () => {
      cancelAnimationFrame(anim);
      anim = 0;
    };

    // k 칸으로 넘김 — 위에서 내려오면 그 칸 맨 위, 아래에서 올라가면 그 칸 맨 아래(방금 지나온 자리와 이어지게)
    go.current = (k, toEnd = false) => {
      if (busy || k < 0 || k >= panels.length) return;
      stop();
      const b = bounds(panels, k, ownLast);
      const y0 = window.scrollY;
      const y1 = toEnd ? b.end : b.top;
      if (Math.abs(y1 - y0) < 2) return;
      busy = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / DUR);
        scrollToY(y0 + (y1 - y0) * ease(p));
        if (p < 1) anim = requestAnimationFrame(step);
        else {
          anim = 0;
          busy = false;
          quietUntil = Date.now() + COOLDOWN;
          arrivedAt = Date.now();
        }
      };
      anim = requestAnimationFrame(step);
    };
    const next = (k: number, dir: 1 | -1) => {
      if (Date.now() < quietUntil) return;
      // 마지막 칸에서 더 내리면 — 넘어온 관성으로 바로 넘어가지 않게 잠깐 뒤부터
      if (dir > 0 && k + 1 >= panels.length && pastEnd.current) {
        if (Date.now() - arrivedAt > 700) pastEnd.current();
        return;
      }
      go.current(k + dir, dir < 0);
    };
    /** 인트로 단계가 아직 남은 자리 — 인트로가 맡음 */
    const inIntro = (y: number) => panels[0] === 'intro' && y < bounds(panels, 0, ownLast).end - 2;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < 1 || blocked(e.target)) return;
      if (busy) {
        e.preventDefault();
        return;
      }
      if (e.defaultPrevented) return; // 인트로가 단계를 넘김
      const y = window.scrollY;
      const k = current(panels, y);
      const dir = e.deltaY > 0 ? 1 : -1;
      if (k === 0 && (inIntro(y) || dir < 0)) return;
      const b = bounds(panels, k, ownLast);
      e.preventDefault();
      if (dir > 0 ? y < b.end - 1 : y > b.top + 1) {
        scrollToY(Math.min(b.end, Math.max(b.top, y + e.deltaY)));
        lastInner = Date.now();
        return;
      }
      if (Date.now() - lastInner < 180) return;
      next(k, dir);
    };

    // 손가락 — 칸 안에서는 직접 스크롤(끝에서 멈춤) + 놓은 뒤 관성, 끝에서 시작한 손짓이면 다음 칸
    type Gesture = { sy: number; sx: number; y0: number; t0: number; k: number; top: number; end: number; mode: 'wait' | 'v' | 'h' | 'skip'; pts: [number, number][] };
    let g: Gesture | null = null;
    const coast = (v: number, top: number, end: number) => {
      let y = window.scrollY;
      let last = performance.now();
      const step = (now: number) => {
        const dt = now - last;
        last = now;
        y = Math.min(end, Math.max(top, y + v * dt));
        v *= Math.pow(0.996, dt);
        scrollToY(y);
        lastInner = Date.now();
        anim = Math.abs(v) > 0.02 && y > top && y < end ? requestAnimationFrame(step) : 0;
      };
      anim = requestAnimationFrame(step);
    };
    const onStart = (e: TouchEvent) => {
      g = null;
      if (busy) return;
      stop();
      if (e.touches.length !== 1 || blocked(e.target)) return;
      const y = window.scrollY;
      if (inIntro(y)) return;
      const k = current(panels, y);
      const b = bounds(panels, k, ownLast);
      const p = e.touches[0];
      g = { sy: p.clientY, sx: p.clientX, y0: y, t0: performance.now(), k, top: b.top, end: b.end, mode: 'wait', pts: [[performance.now(), y]] };
    };
    const onMove = (e: TouchEvent) => {
      if (busy) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      if (!g) return;
      if (e.touches.length > 1) {
        g = null;
        return;
      }
      if (e.defaultPrevented) g.mode = 'skip'; // 인트로가 단계를 넘김
      const p = e.touches[0];
      const dy = g.sy - p.clientY; // 손가락을 위로 = +
      const dx = p.clientX - g.sx;
      if (g.mode === 'wait') {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        g.mode = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      if (g.mode !== 'v') return;
      if (e.cancelable) e.preventDefault();
      // 인트로 끝(CHECK IN)에서 위로 미는 손짓은 인트로가 한 단계 되돌림
      if (g.k === 0 && dy < 0) return;
      const y = Math.min(g.end, Math.max(g.top, g.y0 + dy));
      scrollToY(y);
      g.pts.push([performance.now(), y]);
      if (g.pts.length > 6) g.pts.shift();
    };
    const onEnd = (e: TouchEvent) => {
      const gg = g;
      g = null;
      if (!gg || gg.mode !== 'v' || busy) return;
      const dy = gg.sy - e.changedTouches[0].clientY;
      const dir = dy > 0 ? 1 : -1;
      if (gg.k === 0 && dir < 0) return;
      const fromEdge = dir > 0 ? gg.y0 >= gg.end - 1 : gg.y0 <= gg.top + 1;
      if (fromEdge) {
        const fast = Math.abs(dy) / Math.max(1, performance.now() - gg.t0) > 0.35;
        if (Math.abs(dy) >= 50 || (fast && Math.abs(dy) > 24)) next(gg.k, dir);
        return;
      }
      // 칸 안에서 놓으면 그 속도로 조금 더 미끄러지다 멈춤 (칸 끝을 넘지 않음)
      const now = performance.now();
      const pts = gg.pts.filter(([tt]) => now - tt < 120);
      if (pts.length < 2) return;
      const [ta, ya] = pts[0];
      const [tb, yb] = pts[pts.length - 1];
      const v = (yb - ya) / Math.max(1, tb - ta);
      if (Math.abs(v) > 0.1) coast(v, gg.top, gg.end);
    };

    // 오른쪽 점 — 화면 가운데에 있는 칸
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        // 페이지 맨 밑(짧은 마지막 칸)이면 마지막 칸 — 점이 그 앞 칸에 켜져 있지 않게
        const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
        setIndex(atEnd ? panels.length - 1 : current(panels, window.scrollY + window.innerHeight / 2));
      });
    };
    onScroll();

    const opts = { passive: false } as AddEventListenerOptions;
    if (snap) {
      window.addEventListener('wheel', onWheel, opts);
      window.addEventListener('touchstart', onStart, { passive: true });
      window.addEventListener('touchmove', onMove, opts);
      window.addEventListener('touchend', onEnd);
      window.addEventListener('touchcancel', onEnd);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.classList.add('has-fullpage');
    return () => {
      stop();
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel, opts);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove, opts);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.classList.remove('has-fullpage');
    };
  }, [panels, ownLast, snap]);

  if (!dots) return null;
  // 화면에 바로 고정 — 페이지 등장 애니메이션(transform) 안에 두면 화면이 아니라 페이지에 붙으므로 body 에
  return createPortal(
    <nav className={`deckdots${DOT_PANELS.includes(panels[index]) && (panels[index] !== 'intro' || checkin) ? '' : ' is-hidden'}`} aria-label={t.aria}>
      {panels.map((id, k) => !DOT_PANELS.includes(id) ? null : (
        <button
          key={id}
          type="button"
          className={`deckdots__dot${k === index ? ' is-on' : ''}`}
          aria-label={id === 'intro' ? 'CHECK IN' : (t as Record<string, string>)[id]}
          aria-current={k === index ? 'true' : undefined}
          // 인트로 점은 인트로 맨 끝(CHECK IN 장면)으로
          onClick={() => go.current(k, id === 'intro')}
          data-track={`deck_dot_${id}`}
        />
      ))}
    </nav>,
    document.body,
  );
}
