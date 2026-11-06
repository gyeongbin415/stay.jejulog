import { useEffect, useRef, useState } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';

/**
 * 오른쪽 아래에 떠 있는 동그라미 버튼 — 위에서부터 방명록(연필 · #/guest) · 게하 탐색(돋보기 · #/house) · 취향 지도(#/map) · 취향 테스트 · 웹진 인스타그램(#/instagram), 모두 주황 바탕 · 흰 아이콘
 * 지도와 인스타그램 사이에 취향 테스트(체크 목록 · test/) 버튼도 같은 모양으로
 * 지금 보고 있는 페이지의 버튼은 감춥니다.
 * 버튼이 둘 이상이면 위쪽 화살표 동그라미 하나로 묶어 두고, 마우스를 올리거나(PC) 누르면 그 위로 펼칩니다.
 * 메인에서는 첫 인트로(어두운 화면) 동안 숨기고, CHECK IN 화면이 뜰 때부터 보여 줍니다.
 */
/** 상세 페이지 차례 — 게하 탐색 → 취향 테스트 → 지도 → 방명록 → (다시) 게하 탐색 */
export const NEXT_ORDER = ['house', 'test', 'map', 'guest'] as const;
export type NextPage = (typeof NEXT_ORDER)[number];

/**
 * 상세 페이지 오른쪽 아래 — 누르면 바로 다음 페이지로 (뒤로 가서 다시 고를 필요 없이)
 */
export function NextFab({ page }: { page: NextPage }) {
  const { ui } = useContent();
  const next = NEXT_ORDER[(NEXT_ORDER.indexOf(page) + 1) % NEXT_ORDER.length];
  const to = { house: href.house(), test: href.test(), map: href.map(), guest: href.guest() }[next];
  const name = { house: ui.nav.house, test: ui.nav.test, map: ui.nav.map, guest: ui.nav.guest }[next];
  return (
    <div className="fabs">
      <div className="fabs__list">
        <a className="mapfab mapfab--accent" href={to} aria-label={name} title={name} data-track={`${page}_next_${next}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export function MapFab({ showMap = true, showInsta = true, showHouse = false, showTest = false, showGuest = false, home = false }: { showMap?: boolean; showInsta?: boolean; showHouse?: boolean; showTest?: boolean; showGuest?: boolean; home?: boolean }) {
  const { ui } = useContent();
  const [introDone, setIntroDone] = useState(!home);
  useEffect(() => {
    if (!home) {
      setIntroDone(true);
      return;
    }
    setIntroDone(false);
    let mo: MutationObserver | null = null;
    let raf = 0;
    const check = () => {
      const intro = document.getElementById('intro');
      if (!intro) {
        raf = requestAnimationFrame(check);
        return;
      }
      const update = () => {
        const ph = intro.dataset.phase;
        setIntroDone(ph === 'reveal' || ph === 'static');
      };
      update();
      mo = new MutationObserver(update);
      mo.observe(intro, { attributes: true, attributeFilter: ['data-phase'] });
    };
    check();
    return () => {
      cancelAnimationFrame(raf);
      mo?.disconnect();
    };
  }, [home]);
  const count = [showMap, showInsta, showHouse, showTest, showGuest].filter(Boolean).length;
  const many = count > 1;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // 펼친 채로 바깥을 누르거나 Esc — 접기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  if (!count) return null;
  return (
    <div ref={ref} className={`fabs${many ? ' fabs--fold' : ''}${open ? ' is-open' : ''}${introDone ? '' : ' is-hidden'}`} aria-hidden={introDone ? undefined : true}>
      <div className="fabs__list" id="fabs-list" onClick={() => setOpen(false)}>
      {showGuest && (
        <a className="mapfab mapfab--accent" href={href.guest()} aria-label={ui.deck.guest} title={ui.deck.guest} data-track="guest_fab">
          {/* 연필 — 방명록 */}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15.5 4.5 19.5 8.5 9 19H5v-4L15.5 4.5Z" />
            <path d="m13 7 4 4" />
          </svg>
        </a>
      )}
      {showHouse && (
        <a className="mapfab mapfab--accent" href={href.house()} aria-label={ui.nav.house} title={ui.nav.house} data-track="house_fab">
          {/* 돋보기 */}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.5" cy="10.5" r="6" />
            <path d="m15 15 5 5" />
          </svg>
        </a>
      )}
      {showMap && (
        <a className="mapfab mapfab--accent" href={href.map()} aria-label={ui.map.open} title={ui.map.title} data-track="map_fab">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
            <path d="M9 4v14M15 6v14" />
          </svg>
        </a>
      )}
      {showTest && (
        <a className="mapfab mapfab--accent" href={href.test()} aria-label={ui.nav.test} title={ui.nav.test} data-track="test_fab">
          {/* 체크 목록 — 취향 테스트 */}
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="4" y="3.5" width="16" height="17" rx="3" />
            <path d="m7.5 9 1.6 1.6L12 7.7M7.5 15.2l1.6 1.6 2.9-2.9M14.5 9.3h3M14.5 15.5h3" />
          </svg>
        </a>
      )}
      {showInsta && (
        // 인스타그램 — 어느 페이지에서나 주황 바탕 · 흰 아이콘
        <a className="mapfab mapfab--accent" href={href.insta()} aria-label={ui.insta.title} title={ui.insta.title} data-track="insta_fab">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" className="mapfab__dot" />
          </svg>
        </a>
      )}
      </div>
      {many && (
        // 위쪽 화살표 — 누르면 펼치기 · 접기 (펼치면 아래 화살표로)
        <button type="button" className="mapfab mapfab--accent fabs__toggle" aria-expanded={open} aria-controls="fabs-list" aria-label={open ? ui.app.fabClose : ui.app.fabOpen} title={open ? ui.app.fabClose : ui.app.fabOpen} onClick={() => setOpen((v) => !v)} data-track="fabs_toggle">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 14.5 6-6 6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
