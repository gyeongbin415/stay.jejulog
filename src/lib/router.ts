import { useEffect, useState } from 'react';
import type { ProgramId } from '../data/types';
import { PROGRAM_BY_ID } from '../data/programs';

/* ------------------------------------------------------------------
   해시 라우터 — 정적 호스팅(Netlify, GitHub Pages)에서도 새로고침이 깨지지 않도록
   #/ 경로를 씁니다.
     PAGE 01  #/                    메인 (INTRO → PROBLEM → CHECK IN → FIND YOUR STAY → CHECK OUT)
     PAGE 02  #/house               집 내부 탐색
     PAGE 03  #/stay/<프로그램 id>   게스트하우스 상세 (예전 주소 #/use/<id> 도 열립니다)
     PAGE 04  #/test                취향 테스트
     메인 안의 특정 위치             #/?to=checkin   (to = 섹션 id)
     공유받은 테스트 결과             #/test?r=ABCDABC
------------------------------------------------------------------- */

export type Route =
  | { name: 'home'; query: URLSearchParams }
  | { name: 'house'; query: URLSearchParams }
  | { name: 'stay'; id: ProgramId; query: URLSearchParams }
  | { name: 'test'; query: URLSearchParams }
  | { name: 'notfound'; query: URLSearchParams };

export function parseHash(hash = window.location.hash): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const query = new URLSearchParams(qs);
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return query.get('r') ? { name: 'test', query } : { name: 'home', query };
  // 집 내부는 메인 페이지 안 섹션으로 옮겼습니다 — 예전 주소 #/house 는 메인의 그 자리로
  if (parts[0] === 'house') return { name: 'home', query: new URLSearchParams('to=explore') };
  if (parts[0] === 'test') return { name: 'test', query };
  if ((parts[0] === 'stay' || parts[0] === 'use') && parts[1] && parts[1] in PROGRAM_BY_ID) {
    return { name: 'stay', id: parts[1] as ProgramId, query };
  }
  return { name: 'notfound', query };
}

export function routeKey(r: Route) {
  return r.name === 'stay' ? `stay:${r.id}` : r.name;
}

/** 같은 주소로 다시 이동해도 반응하도록 이동 횟수를 함께 돌려줍니다 */
export function useRoute() {
  const [route, setRoute] = useState(() => ({ ...parseHash(), visit: 0 }));
  useEffect(() => {
    const on = () => setRoute((r) => ({ ...parseHash(), visit: r.visit + 1 }));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const href = {
  home: (to?: string) => (to ? `#/?to=${to}` : '#/'),
  house: () => '#/?to=explore',
  stay: (id: ProgramId) => `#/stay/${id}`,
  test: () => '#/test',
  result: (code: string) => `#/test?r=${code}`,
};

/** 메인 안의 섹션으로 이동 (동작 줄이기 설정이면 즉시 이동) */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  const focusTarget = el.querySelector<HTMLElement>('h2, h1, [data-focus]') ?? el;
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
}
