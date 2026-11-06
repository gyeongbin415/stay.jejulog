import { useContent } from '../i18n';
import { backToMain, goBack, href, type Route } from '../lib/router';

/**
 * 왼쪽 아래 뒤로 가기 동그라미 — 메인을 뺀 모든 페이지(집 · 숙소 상세 · 취향 지도 · 인스타그램 · 취향 테스트 · 방명록)
 * 오른쪽 아래 지도 · 인스타그램 동그라미(MapFab)와 짝.
 * 집 · 테스트 · 지도 · 방명록 — 메인에서 버튼을 눌렀던 그 자리로 (거쳐 온 화면과 상관없이)
 *   방명록 안의 화면(질문 목록 · 카드)이면 먼저 바로 전 화면으로 — 페이지가 'jl:back' 을 받아 처리
 *   기억한 자리가 없으면(링크로 바로 들어옴 등) 그 페이지와 짝인 메인 칸으로
 * 숙소 상세 · 인스타그램 — 바로 전에 있던 페이지로 (링크로 바로 들어왔으면 짝인 페이지로)
 */
const MAIN_PANEL: Partial<Record<Route['name'], string>> = {
  house: 'roomtour',
  map: 'tastemap',
  test: 'find',
  guest: 'guest',
};
const FALLBACK: Partial<Record<Route['name'], string>> = {
  stay: href.house(),
  insta: href.home(),
};

export function BackFab({ route }: { route: Route }) {
  const { ui } = useContent();
  // 게하 탐색 · 취향 테스트 · 지도 · 방명록 — 왼쪽은 바로 전 화면으로 뒤로, 오른쪽 아래(NextFab)는 차례상 다음 페이지로
  const panel = MAIN_PANEL[route.name];
  const fallback = FALLBACK[route.name];
  if (!panel && !fallback) return null;
  const onBack = () => {
    // 페이지 안에서 먼저 받을 수 있게 알림 (방명록 — 질문 목록 → 처음 등). 받았으면 페이지는 그대로
    if (!window.dispatchEvent(new Event('jl:back', { cancelable: true }))) return;
    if (panel) backToMain(panel);
    else goBack(fallback!);
  };
  return (
    <button type="button" className="backfab" onClick={onBack} aria-label={ui.stay.back} title={ui.stay.back} data-track={`${route.name}_back`}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 12H6M11 6.5 5.5 12 11 17.5" /></svg>
    </button>
  );
}
