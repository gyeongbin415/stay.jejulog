import { useContent } from '../i18n';
import { href } from '../lib/router';

/**
 * 오른쪽 아래에 떠 있는 동그라미 버튼 — 위: 취향 지도(#/map) · 아래: 웹진 인스타그램 페이지(#/instagram)
 * 지금 보고 있는 페이지의 버튼은 감춥니다.
 */
export function MapFab({ showMap = true, showInsta = true }: { showMap?: boolean; showInsta?: boolean }) {
  const { ui } = useContent();
  if (!showMap && !showInsta) return null;
  return (
    <div className="fabs">
      {showMap && (
        <a className="mapfab" href={href.map()} aria-label={ui.map.open} title={ui.map.title} data-track="map_fab">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
            <path d="M9 4v14M15 6v14" />
          </svg>
        </a>
      )}
      {showInsta && (
        <a className="mapfab" href={href.insta()} aria-label={ui.insta.title} title={ui.insta.title} data-track="insta_fab">
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
