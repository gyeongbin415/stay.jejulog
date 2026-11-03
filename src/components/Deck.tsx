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
   휴대폰 세로 넘겨보기(풀페이지) — 집 → 취향 테스트 → 취향 지도 → 방명록
   · 칸마다 화면 높이(100dvh) 한 장. 손가락을 위로 밀면 지금 칸이 위로 밀려나며 다음 칸이 아래에서 올라옴 (0.7초 ease-in-out)
   · 칸 안 내용이 길면 칸 안에서 먼저 스크롤 — 끝(맨 아래 · 맨 위)에 닿은 뒤 한 번 더 밀어야 넘어감
   · 한 번에 한 칸만, 넘어가는 동안 · 직후 관성은 무시 (여러 칸을 건너뛰지 않게)
   · 입력창 · 지도 위에서 시작한 손짓, 테스트에 답을 고르기 시작한 뒤(data-swipe-lock)는 넘기지 않음 — 오른쪽 점으로만
   · 네 칸은 한 번 열리면 계속 살아 있어 테스트 진행 · 방명록에 쓰던 글 · 칸 안 스크롤 위치가 그대로
   · 칸을 옮기면 주소도 그 칸 주소로(뒤로 가기 기록은 쌓지 않음) — 바로 들어오거나 새로고침해도 같은 칸
------------------------------------------------------------------- */

export const PANELS = ['house', 'test', 'map', 'guest'] as const;
export type PanelName = (typeof PANELS)[number];
export const isDeckRoute = (name: string): name is PanelName => (PANELS as readonly string[]).includes(name);

/** 넘어가는 시간(ms) · 곡선 (ease-in-out) */
const DUR = 700;
const EASE = 'cubic-bezier(.65, 0, .35, 1)';
/** 넘긴 뒤 이 시간 동안 이어지는 휠 · 관성은 무시 */
const COOLDOWN = 300;

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
  // 한 번 연 칸은 계속 살려 둠 — 처음엔 지금 칸과 위아래만
  const [mounted, setMounted] = useState(() => PANELS.map((_, k) => Math.abs(k - PANELS.indexOf(active)) <= 1));
  const panels = useRef<(HTMLElement | null)[]>([]);
  const indexRef = useRef(index);
  indexRef.current = index;
  const busy = useRef(false);
  const quietUntil = useRef(0);
  /** 칸마다 마지막 주소 — 테스트 결과 주소(test/#?r=…) 같은 것을 돌아올 때 그대로 */
  const lastUrl = useRef<Partial<Record<PanelName, string>>>({});
  // 테스트 칸에 넘길 값은 테스트 주소일 때만 바꿈 — 다른 칸으로 가도 테스트가 처음으로 돌아가지 않게
  const testProps = useRef({ sharedCode: null as string | null, mine: false });
  if (route.name === 'test') testProps.current = { sharedCode: route.query.get('r'), mine: route.query.get('me') === '1' };

  /** 정착 — 새 칸을 보이게 두고, 주소를 그 칸 주소로 바꾸고 알림 */
  const finish = useCallback((from: number, to: number) => {
    lastUrl.current[PANELS[from]] = window.location.href;
    flushSync(() => {
      setIndex(to);
      setMounted((m) => m.map((v, k) => v || Math.abs(k - to) <= 1));
    });
    panels.current.forEach((el) => {
      if (!el) return;
      el.style.transition = '';
      el.style.transform = '';
      el.style.visibility = '';
    });
    const url = lastUrl.current[PANELS[to]] ?? panelUrl(PANELS[to]);
    if (url !== window.location.href) window.history.replaceState(window.history.state, '', url);
    window.dispatchEvent(new Event('jl:route'));
    quietUntil.current = Date.now() + COOLDOWN;
    busy.current = false;
  }, []);

  /** from → to 로 넘김 — 지금 칸은 위(또는 아래)로 밀려나고, 새 칸이 아래(또는 위)에서 들어옴 */
  const goTo = useCallback(
    (to: number) => {
      const from = indexRef.current;
      if (busy.current || to === from || to < 0 || to >= PANELS.length) return;
      busy.current = true;
      flushSync(() => setMounted((m) => m.map((v, k) => v || k === to)));
      const a = panels.current[from];
      const b = panels.current[to];
      if (!a || !b) {
        busy.current = false;
        return;
      }
      const dir = to > from ? 1 : -1;
      // 내려가면 새 칸은 맨 위부터, 올라오면 그 칸의 맨 아래부터 (방금 지나온 자리와 이어지게)
      b.scrollTop = dir > 0 ? 0 : b.scrollHeight;
      const dur = prefersReducedMotion() ? 0 : DUR;
      b.style.transition = 'none';
      b.style.transform = `translate3d(0, ${dir * 100}%, 0)`;
      b.style.visibility = 'visible';
      void b.offsetHeight; // 시작 자리를 먼저 그리고 나서 움직임
      const tr = dur ? `transform ${dur}ms ${EASE}` : 'none';
      a.style.transition = tr;
      b.style.transition = tr;
      a.style.transform = `translate3d(0, ${-dir * 100}%, 0)`;
      b.style.transform = 'translate3d(0, 0, 0)';
      window.setTimeout(() => finish(from, to), dur + 20);
    },
    [finish],
  );

  // 바깥에서 주소가 바뀌어 다른 칸이 됐으면(상단 링크 · 앞뒤로 가기) 그 칸으로
  useEffect(() => {
    goTo(PANELS.indexOf(active));
  }, [active, goTo]);

  // 넘겨보기 동안 페이지 자체는 스크롤하지 않음(칸 안에서만), 웹진 안 링크로 칸을 옮기면 페이지를 다시 열지 않고 넘김
  useLayoutEffect(() => {
    document.documentElement.classList.add('has-deck');
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
      document.documentElement.classList.remove('has-deck');
      document.removeEventListener('click', onClick);
    };
  }, [goTo]);

  // 휠 · 손가락으로 넘기기 — 칸 안 스크롤이 끝(맨 아래 · 맨 위)에 닿아 있을 때만
  useEffect(() => {
    const blocked = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      if (!el || !el.closest('.deck')) return true;
      if (el.closest('input, textarea, select, [contenteditable="true"], .leaflet-container, [data-noswipe]')) return true;
      return !!panels.current[indexRef.current]?.querySelector('[data-swipe-lock]');
    };
    const atEnd = (dir: 1 | -1) => {
      const p = panels.current[indexRef.current];
      if (!p) return false;
      return dir > 0 ? p.scrollTop + p.clientHeight >= p.scrollHeight - 2 : p.scrollTop <= 1;
    };
    // 칸 안에서 스크롤이 막 움직였으면(관성) 끝에 닿자마자 넘기지 않음 — 잠깐 멈춘 뒤 다시 밀 때 넘김
    let lastScroll = 0;
    const onScroll = () => {
      lastScroll = Date.now();
    };
    const go = (dir: 1 | -1) => {
      if (busy.current || Date.now() < quietUntil.current) return;
      goTo(indexRef.current + dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (busy.current || Date.now() < quietUntil.current) {
        if ((e.target as Element | null)?.closest?.('.deck')) e.preventDefault();
        return;
      }
      if (Math.abs(e.deltaY) < 4 || e.ctrlKey || blocked(e.target)) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      if (!atEnd(dir) || Date.now() - lastScroll < 180) return;
      e.preventDefault();
      go(dir);
    };

    let sy = 0;
    let sx = 0;
    let st = 0;
    let startEnd: { down: boolean; up: boolean } | null = null;
    const onStart = (e: TouchEvent) => {
      startEnd = null;
      if (e.touches.length !== 1 || blocked(e.target)) return;
      sy = e.touches[0].clientY;
      sx = e.touches[0].clientX;
      st = performance.now();
      startEnd = { down: atEnd(1), up: atEnd(-1) };
    };
    const onMove = (e: TouchEvent) => {
      // 넘어가는 중에는 칸 안 스크롤도 멈춤 (중복 입력 막기)
      if (busy.current) e.preventDefault();
    };
    const onEnd = (e: TouchEvent) => {
      if (!startEnd) return;
      const p = e.changedTouches[0];
      const dy = sy - p.clientY; // 손가락을 위로 = +
      const dx = Math.abs(p.clientX - sx);
      const fast = Math.abs(dy) / Math.max(1, performance.now() - st) > 0.35;
      if (Math.abs(dy) < 50 && !(fast && Math.abs(dy) > 24)) return;
      if (dx > Math.abs(dy)) return; // 가로 손짓은 넘기지 않음
      const dir = dy > 0 ? 1 : -1;
      // 손짓을 시작할 때부터 끝에 닿아 있었어야 — 칸 안 스크롤로 끝에 닿은 그 손짓으로는 넘기지 않음
      if (dir > 0 ? !startEnd.down : !startEnd.up) return;
      go(dir);
    };

    const opts = { passive: false } as AddEventListenerOptions;
    window.addEventListener('wheel', onWheel, opts);
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, opts);
    window.addEventListener('touchend', onEnd);
    panels.current.forEach((el) => el?.addEventListener('scroll', onScroll, { passive: true }));
    return () => {
      window.removeEventListener('wheel', onWheel, opts);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove, opts);
      window.removeEventListener('touchend', onEnd);
      panels.current.forEach((el) => el?.removeEventListener('scroll', onScroll));
    };
  }, [goTo]);

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

  // 화면에 바로 고정 — 페이지 등장 애니메이션(transform) 안에 두면 화면이 아니라 페이지에 붙으므로 body 에
  return createPortal(
    <div className="deck">
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
      {/* 오른쪽 점 — 지금 몇 번째 칸인지, 누르면 그 칸으로 */}
      <nav className="deckdots" aria-label={t.aria}>
        {PANELS.map((name, k) => (
          <button
            key={name}
            type="button"
            className={`deckdots__dot${k === index ? ' is-on' : ''}`}
            aria-label={t[name]}
            aria-current={k === index ? 'page' : undefined}
            onClick={() => goTo(k)}
            data-track={`deck_dot_${name}`}
          />
        ))}
      </nav>
    </div>,
    document.body,
  );
}
