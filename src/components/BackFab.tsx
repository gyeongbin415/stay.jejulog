import { useContent } from '../i18n';
import { absUrl, goBack, href, type Route } from '../lib/router';

/**
 * 왼쪽 아래 뒤로 가기 동그라미 — 메인을 뺀 모든 페이지(집 · 숙소 상세 · 취향 지도 · 인스타그램 · 취향 테스트)
 * 오른쪽 아래 지도 · 인스타그램 동그라미(MapFab)와 짝.
 * 집 · 취향 지도 · 취향 테스트 — 늘 그 페이지와 짝인 메인 칸으로 (메뉴 등 어디서 왔든)
 * 방명록 — 안의 화면(질문 목록 · 카드)이면 바로 전 화면, 처음 화면이면 바로 전 페이지로
 * 숙소 상세 · 인스타그램 — 웹진 안에서 왔으면 브라우저 뒤로, 링크로 바로 들어와 앞 화면이 없으면 FALLBACK 으로.
 */
const FALLBACK: Partial<Record<Route['name'], string>> = {
  stay: href.house(),
  house: href.home('roomtour'),
  map: href.home('tastemap'),
  insta: href.home(),
  test: href.home('find'),
  guest: href.home('guest'),
};

/** 메인 칸과 짝인 상세 페이지 */
const TO_SECTION: Partial<Record<Route['name'], true>> = { house: true, map: true, test: true };

/** 페이지 안에서 먼저 받을 수 있게 'jl:back' 을 알림(방명록 — 질문 목록 → 처음 등). 페이지가 받지 않으면 짝인 메인 칸 · 바로 전 페이지로 */
function onBack(name: Route['name'], fallback: string) {
  if (!window.dispatchEvent(new Event('jl:back', { cancelable: true }))) return;
  if (TO_SECTION[name]) window.location.assign(absUrl(fallback));
  else goBack(fallback);
}

export function BackFab({ route }: { route: Route }) {
  const { ui } = useContent();
  const fallback = FALLBACK[route.name];
  if (!fallback) return null;
  return (
    <button type="button" className="backfab" onClick={() => onBack(route.name, fallback)} aria-label={ui.stay.back} title={ui.stay.back} data-track={`${route.name}_back`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5.5 8.5 12l6.5 6.5" /></svg>
    </button>
  );
}
