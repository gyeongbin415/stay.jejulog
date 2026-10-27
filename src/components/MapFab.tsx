import { useContent } from '../i18n';
import { href } from '../lib/router';

/**
 * 취향 지도 — 모든 페이지 오른쪽 아래에 떠 있는 동그라미 버튼, 누르면 취향 지도 페이지(#/map)
 * 안의 지도 그림은 받으면 바꿔 끼울 자리 — 지금은 접힌 지도 + 위치 표시 선 아이콘
 */
export function MapFab() {
  const { ui } = useContent();
  return (
    <a className="mapfab" href={href.map()} aria-label={ui.map.open} title={ui.map.title} data-track="map_fab">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    </a>
  );
}
