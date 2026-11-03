import { useContent } from '../i18n';
import { goBack, href, type Route } from '../lib/router';

/**
 * 왼쪽 아래 뒤로 가기 동그라미 — 메인을 뺀 모든 페이지(집 · 숙소 상세 · 취향 지도 · 인스타그램 · 취향 테스트)
 * 오른쪽 아래 지도 · 인스타그램 동그라미(MapFab)와 짝.
 * 웹진 안에서 왔으면 브라우저 뒤로, 링크로 바로 들어와 앞 화면이 없으면 그 페이지로 들어오던 메인 칸으로.
 */
const FALLBACK: Partial<Record<Route['name'], string>> = {
  stay: href.house(),
  house: href.home('roomtour'),
  map: href.home('tastemap'),
  insta: href.home('guest'),
  test: href.home('find'),
  guest: href.home('guest'),
};

export function BackFab({ route }: { route: Route }) {
  const { ui } = useContent();
  const fallback = FALLBACK[route.name];
  if (!fallback) return null;
  return (
    <button type="button" className="backfab" onClick={() => goBack(fallback)} aria-label={ui.stay.back} title={ui.stay.back} data-track={`${route.name}_back`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5.5 8.5 12l6.5 6.5" /></svg>
    </button>
  );
}
