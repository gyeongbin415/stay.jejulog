import { useEffect, useState } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';

/**
 * 오른쪽 아래에 떠 있는 동그라미 버튼 — 위에서부터 방명록(연필 · #/guest) · 게하 탐색(돋보기 · #/house) · 취향 지도(#/map) · 취향 테스트 · 웹진 인스타그램(#/instagram), 모두 주황 바탕 · 흰 아이콘
 * 지도와 인스타그램 사이에 취향 테스트(체크 목록 · test/) 버튼도 같은 모양으로
 * 지금 보고 있는 페이지의 버튼은 감춥니다.
 * 메인에서는 첫 인트로(어두운 화면) 동안 숨기고, CHECK IN 화면이 뜰 때부터 보여 줍니다.
 */
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
  if (!showMap && !showInsta && !showHouse && !showTest && !showGuest) return null;
  return (
    <div className={`fabs${introDone ? '' : ' is-hidden'}`} aria-hidden={introDone ? undefined : true}>
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
  );
}
