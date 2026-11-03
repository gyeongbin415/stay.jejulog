import { useEffect, useState } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import gumballUrl from '../assets/test-gumball.png';

/**
 * 오른쪽 아래에 떠 있는 동그라미 버튼 — 위: 취향 지도(#/map) · 아래: 웹진 인스타그램 페이지(#/instagram)
 * 취향 지도 페이지에서는 인스타그램 위에 게하 탐색(돋보기 — 메인 집 칸) · 취향 테스트 버튼을 더 둡니다 (showHouse · showTest)
 * 지금 보고 있는 페이지의 버튼은 감춥니다.
 * 메인에서는 첫 인트로(어두운 화면) 동안 숨기고, CHECK IN 화면이 뜰 때부터 보여 줍니다.
 */
export function MapFab({ showMap = true, showInsta = true, showHouse = false, showTest = false, home = false }: { showMap?: boolean; showInsta?: boolean; showHouse?: boolean; showTest?: boolean; home?: boolean }) {
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
  if (!showMap && !showInsta && !showHouse && !showTest) return null;
  return (
    <div className={`fabs${introDone ? '' : ' is-hidden'}`} aria-hidden={introDone ? undefined : true}>
      {showMap && (
        <a className="mapfab" href={href.map()} aria-label={ui.map.open} title={ui.map.title} data-track="map_fab">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
            <path d="M9 4v14M15 6v14" />
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
      {showTest && (
        <a className="mapfab mapfab--test" href={href.test()} aria-label={ui.nav.test} title={ui.nav.test} data-track="test_fab">
          {/* 뽑기 기계 — 메인 취향 테스트 칸과 같은 그림, 가끔 달그락 흔들림 */}
          <img src={gumballUrl} alt="" width={615} height={1086} draggable={false} />
        </a>
      )}
      {showInsta && (
        // 취향지도 페이지(게하 탐색 · 취향 테스트 버튼이 함께 있을 때)에서는 셋 다 주황 바탕으로 맞춤
        <a className={`mapfab${showHouse || showTest ? ' mapfab--accent' : ''}`} href={href.insta()} aria-label={ui.insta.title} title={ui.insta.title} data-track="insta_fab">
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
