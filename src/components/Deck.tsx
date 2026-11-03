import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { useContent } from '../i18n';
import { isTestPath, type Route } from '../lib/router';
import { prefersReducedMotion } from '../lib/motion';
import { HousePage } from '../pages/HousePage';
import { GuestNotes } from './GuestNotes';
import { Loader } from './Loader';
import '../styles/deck.css';

const TestPage = lazy(() => import('../pages/TestPage'));
const MapPage = lazy(() => import('../pages/MapPage'));

/* ------------------------------------------------------------------
   휴대폰 넘겨보기 — 집 → 취향 테스트 → 취향 지도 → 방명록 네 화면을 한 판에 두고 좌우로 넘깁니다.
   · 손가락을 따라 화면이 움직이고, 놓으면 0.5초 ease-out 으로 다음 칸에 정착 (3D 회전 · 튕김 없음)
   · 세로 스크롤은 그대로 — 처음 움직임이 가로일 때만 넘기기로 봄
   · 입력창 · 지도 · 가로로 넘어가는 칸(버튼 줄 등)에서 시작한 손짓은 그쪽이 먼저
   · 테스트에 답을 고르기 시작하면(data-swipe-lock) 손짓으로는 넘어가지 않음 — 아래 메뉴로만
   · 네 화면은 한 번 열리면 계속 살아 있어 테스트 진행 · 방명록에 쓰던 글이 그대로
   · 칸을 옮기면 주소도 그 칸 주소로 바꿈(뒤로 가기 기록은 쌓지 않음) — 바로 들어오거나 새로고침해도 같은 칸
------------------------------------------------------------------- */

export const PANELS = ['house', 'test', 'map', 'guest'] as const;
export type PanelName = (typeof PANELS)[number];
export const isDeckRoute = (name: string): name is PanelName => (PANELS as readonly string[]).includes(name);

/** 넘어가는 시간(ms) · 놓으면 정착하는 곡선 (ease-out) */
const DUR = 500;
const EASE = 'cubic-bezier(.22, .61, .36, 1)';

/** 칸 주소 — 테스트만 따로 된 주소(test/), 나머지는 메인 주소의 # (<base> 가 늘 메인 기준) */
function panelUrl(name: PanelName) {
  const base = document.baseURI.split('#')[0];
  if (name === 'test') return new URL('test/', base).href;
  return `${isTestPath(new URL(base).pathname) ? new URL('../', base).href : base}#/${name}`;
}

/** 링크가 넘겨보기의 어느 칸으로 가는지 (아니면 -1) — 상단 · 메뉴 링크도 페이지를 다시 열지 않고 넘김 */
function panelOfLink(a: HTMLAnchorElement) {
  let u: URL;
  try {
    u = new URL(a.href);
  } catch {
    return -1;
  }
  if (u.origin !== window.location.origin || a.target === '_blank') return -1;
  if (isTestPath(u.pathname)) return u.hash.replace(/^#\??/, '') ? -1 : 1;
  const m = u.hash.match(/^#\/(house|map|guest)$/);
  return m ? PANELS.indexOf(m[1] as PanelName) : -1;
}

export function Deck({ route }: { route: Route }) {
  const { ui } = useContent();
  const t = ui.deck;
  const active = isDeckRoute(route.name) ? route.name : 'house';
  const [index, setIndex] = useState(() => PANELS.indexOf(active));
  // 한 번 연 칸은 계속 살려 둠 — 처음엔 지금 칸과 양옆만
  const [mounted, setMounted] = useState(() => PANELS.map((_, k) => Math.abs(k - PANELS.indexOf(active)) <= 1));
  const rootRef = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const indexRef = useRef(index);
  indexRef.current = index;
  const busy = useRef(false);
  /** 칸마다 마지막 주소 — 테스트 결과 주소(test/#?r=…) 같은 것을 돌아올 때 그대로 */
  const lastUrl = useRef<Partial<Record<PanelName, string>>>({});
  // 테스트 칸에 넘길 값은 테스트 주소일 때만 바꿈 — 다른 칸으로 가도 테스트가 처음으로 돌아가지 않게
  const testProps = useRef({ sharedCode: null as string | null, mine: false });
  if (route.name === 'test') testProps.current = { sharedCode: route.query.get('r'), mine: route.query.get('me') === '1' };

  const deckTop = () => (rootRef.current ? rootRef.current.getBoundingClientRect().top + window.scrollY : 0);

  /** 칸 위치 — offsets 에 있는 칸만 보이게(px), top 은 지금 화면 위치(옆 칸이 화면 맨 위부터 보이게) */
  const place = useCallback((offsets: Record<number, number>, animate: boolean, top: number) => {
    const dur = prefersReducedMotion() ? 0 : DUR;
    panels.current.forEach((el, k) => {
      if (!el) return;
      const off = offsets[k];
      if (off === undefined) {
        el.style.visibility = 'hidden';
        return;
      }
      el.style.visibility = 'visible';
      el.style.transition = animate && dur ? `transform ${dur}ms ${EASE}` : 'none';
      el.style.transform = `translate3d(${off}px, 0, 0)`;
      if (k !== indexRef.current) el.style.top = `${top}px`;
    });
  }, []);

  /** 정착 — 새 칸을 제자리(문서 흐름)로 두고 맨 위로, 주소를 그 칸 주소로 바꾸고 알림 */
  const finish = useCallback((from: number, to: number) => {
    if (to !== from) lastUrl.current[PANELS[from]] = window.location.href;
    flushSync(() => {
      setIndex(to);
      setMounted((m) => m.map((v, k) => v || Math.abs(k - to) <= 1));
    });
    panels.current.forEach((el) => {
      if (!el) return;
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.top = '';
      el.style.visibility = '';
    });
    if (to !== from) {
      window.scrollTo(0, deckTop());
      const url = lastUrl.current[PANELS[to]] ?? panelUrl(PANELS[to]);
      if (url !== window.location.href) window.history.replaceState(window.history.state, '', url);
      window.dispatchEvent(new Event('jl:route'));
    }
    busy.current = false;
  }, []);

  /** from → to 로 넘김 (dx — 손가락으로 끌어 둔 거리, top — 옆 칸을 둘 화면 위치) */
  const settle = useCallback(
    (from: number, to: number, dx: number, top: number) => {
      busy.current = true;
      const w = rootRef.current?.clientWidth ?? window.innerWidth;
      const dur = prefersReducedMotion() ? 0 : DUR;
      if (to === from) {
        place({ [from - 1]: -w, [from]: 0, [from + 1]: w }, true, top);
      } else {
        const dir = to > from ? 1 : -1;
        place({ [from]: dx, [to]: dir * w + dx }, false, top);
        void panels.current[to]?.offsetWidth; // 시작 자리를 먼저 그리고 나서 움직임
        place({ [from]: -dir * w, [to]: 0 }, true, top);
      }
      window.setTimeout(() => finish(from, to), dur + 30);
    },
    [finish, place],
  );

  /** 아래 메뉴 · 링크로 그 칸에 — 아직 안 연 칸이면 먼저 열고 넘김 */
  const goTo = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (busy.current || to === from || to < 0 || to >= PANELS.length) return;
      flushSync(() => setMounted((m) => m.map((v, k) => v || k === to)));
      settle(from, to, 0, window.scrollY - deckTop());
    },
    [settle],
  );

  // 바깥에서 주소가 바뀌어 다른 칸이 됐으면(상단 링크 · 앞뒤로 가기) 그 칸으로
  useEffect(() => {
    goTo(PANELS.indexOf(active));
  }, [active, goTo]);

  // 넘겨보기 중에는 아래 메뉴 자리만큼 띄우고(동그라미 버튼 · 바닥글), 웹진 안 링크로 칸을 옮기면 페이지를 다시 열지 않고 넘김
  useLayoutEffect(() => {
    document.body.classList.add('has-decknav');
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const k = panelOfLink(a);
      if (k < 0) return;
      e.preventDefault();
      goTo(k);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.body.classList.remove('has-decknav');
      document.removeEventListener('click', onClick);
    };
  }, [goTo]);

  // 손가락으로 넘기기
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let sx = 0;
    let sy = 0;
    let st = 0;
    let lock: 'x' | 'y' | null = null;
    let allowed = false;
    let dx = 0;
    let top = 0;

    // 손짓이 그 요소의 것이면 넘기지 않음 — 입력창 · 지도 · 가로로 넘어가는 칸
    const owned = (target: Element) => {
      if (target.closest('input, textarea, select, [contenteditable="true"], .leaflet-container, [data-noswipe]')) return true;
      for (let el: Element | null = target; el && el !== root; el = el.parentElement) {
        if (el.scrollWidth > el.clientWidth + 2) {
          const ox = getComputedStyle(el).overflowX;
          if (ox === 'auto' || ox === 'scroll') return true;
        }
      }
      return false;
    };
    const locked = () => !!panels.current[indexRef.current]?.querySelector('[data-swipe-lock]');

    const onStart = (e: TouchEvent) => {
      allowed = false;
      if (busy.current || e.touches.length !== 1) return;
      const p = e.touches[0];
      // 화면 가장자리는 브라우저의 뒤로 · 앞으로 손짓
      if (p.clientX < 20 || p.clientX > window.innerWidth - 20) return;
      if (owned(e.target as Element) || locked()) return;
      allowed = true;
      sx = p.clientX;
      sy = p.clientY;
      st = performance.now();
      lock = null;
      dx = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (!allowed) return;
      const p = e.touches[0];
      const mx = p.clientX - sx;
      const my = p.clientY - sy;
      if (!lock) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        lock = Math.abs(mx) > Math.abs(my) * 1.2 ? 'x' : 'y';
        if (lock === 'y') return;
        top = window.scrollY - deckTop();
        sx = p.clientX; // 방향을 정한 자리부터 따라오게 (처음 10px 만큼 튀지 않게)
        st = performance.now();
      }
      if (lock !== 'x') return;
      e.preventDefault();
      const i = indexRef.current;
      let d = p.clientX - sx;
      // 첫 칸 · 마지막 칸 밖으로는 움직이지 않음
      if ((i === 0 && d > 0) || (i === PANELS.length - 1 && d < 0)) d = 0;
      dx = d;
      const w = root.clientWidth;
      place({ [i - 1]: -w + d, [i]: d, [i + 1]: w + d }, false, top);
    };
    const onEnd = () => {
      if (!allowed || lock !== 'x') return;
      allowed = false;
      const i = indexRef.current;
      const w = root.clientWidth;
      const v = dx / Math.max(1, performance.now() - st); // px/ms
      let to = i;
      if (dx < -w * 0.22 || (v < -0.45 && dx < -30)) to = i + 1;
      else if (dx > w * 0.22 || (v > 0.45 && dx > 30)) to = i - 1;
      to = Math.max(0, Math.min(PANELS.length - 1, to));
      // 끌어서 넘긴 손짓 끝의 누르기는 링크로 치지 않음
      if (Math.abs(dx) > 6) {
        const stop = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        root.addEventListener('click', stop, { capture: true, once: true });
        window.setTimeout(() => root.removeEventListener('click', stop, { capture: true }), 400);
      }
      settle(i, to, dx, top);
    };

    root.addEventListener('touchstart', onStart, { passive: true });
    root.addEventListener('touchmove', onMove, { passive: false });
    root.addEventListener('touchend', onEnd);
    root.addEventListener('touchcancel', onEnd);
    return () => {
      root.removeEventListener('touchstart', onStart);
      root.removeEventListener('touchmove', onMove);
      root.removeEventListener('touchend', onEnd);
      root.removeEventListener('touchcancel', onEnd);
    };
  }, [place, settle]);

  const content = (name: PanelName) => {
    switch (name) {
      case 'house':
        return <HousePage />;
      case 'test':
        return (
          <Suspense fallback={<Loader label={ui.app.loadingTest} />}>
            <TestPage sharedCode={testProps.current.sharedCode} mine={testProps.current.mine} active={index === 1} />
          </Suspense>
        );
      case 'map':
        return (
          <Suspense fallback={<Loader label={ui.map.title} />}>
            <MapPage />
          </Suspense>
        );
      case 'guest':
        return <GuestNotes page />;
    }
  };

  return (
    <div className="deck" ref={rootRef}>
      {PANELS.map((name, k) => (
        <section
          key={name}
          ref={(el) => {
            panels.current[k] = el;
          }}
          className={`deck__panel${k === index ? ' is-active' : ''}`}
          inert={k !== index}
          aria-hidden={k !== index || undefined}
          data-panel={name}
        >
          {mounted[k] && content(name)}
        </section>
      ))}
      {createPortal(
        <nav className="decknav" aria-label={t.aria}>
          {PANELS.map((name, k) => (
            <button
              key={name}
              type="button"
              className={`decknav__item${k === index ? ' is-on' : ''}`}
              aria-current={k === index ? 'page' : undefined}
              onClick={() => goTo(k)}
              data-track={`deck_nav_${name}`}
            >
              <span className="decknav__dot" aria-hidden="true" />
              {t[name]}
            </button>
          ))}
        </nav>,
        document.body,
      )}
    </div>
  );
}
