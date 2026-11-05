import { useEffect, useState } from 'react';
import type { ProgramId } from '../data/types';
import { PROGRAM_BY_ID } from '../data/programs';

/* ------------------------------------------------------------------
   해시 라우터 — 정적 호스팅(Netlify, GitHub Pages)에서도 새로고침이 깨지지 않도록
   #/ 경로를 씁니다.
     PAGE 01  #/                    메인 (INTRO → PROBLEM → CHECK IN → FIND YOUR STAY → CHECK OUT)
     PAGE 02  #/house               집 내부 탐색
     PAGE 03  #/stay/<프로그램 id>   게스트하우스 상세 (예전 주소 #/use/<id> 도 열립니다)
     PAGE 04  test/                 취향 테스트 — # 이 아닌 따로 된 주소(…/team4/test/, GA4 페이지 경로로 따로 잡힘)
                                    빌드할 때 index.html 을 test/index.html 로 한 벌 더 두고, 그 주소에서는
                                    <base href="../"> 로 사진 · 파일 · 링크를 메인 기준으로 찾습니다 (index.html 맨 위)
     PAGE 05  #/instagram           인스타그램 (@stay.jejulog 계정 화면을 웹진 안에서)
     PAGE 06  #/map                 취향 지도 (오른쪽 아래 동그라미 버튼 — 내용은 준비 중)
     PAGE 07  #/guest               방명록 (메인 방명록 칸과 같은 내용 — 휴대폰 넘겨보기의 네 번째 칸)
     예전 둘러보기 주소 #/tour(?to=find)는 메인(그 칸)으로 옮김 — 칸들은 다시 메인에
     휴대폰에서는 집 · 테스트 · 지도 · 방명록 네 주소가 한 판으로 이어져 좌우로 넘겨봅니다 (components/Deck.tsx)
     메인 안의 특정 위치             #/?to=checkin   (to = 섹션 id)
     공유받은 테스트 결과             test/#?r=ABCDABC
     내가 방금 본 결과                test/#?r=ABCDABC&me=1  (숙소 페이지에서 뒤로 가기로 돌아오는 자리)
     예전 주소(#/test, #/test?r=…)로 들어오면 test/ 로 옮겨 줍니다 (fixTestUrl)
------------------------------------------------------------------- */

export type Route =
  | { name: 'home'; query: URLSearchParams }
  | { name: 'house'; query: URLSearchParams }
  | { name: 'stay'; id: ProgramId; query: URLSearchParams }
  | { name: 'test'; query: URLSearchParams }
  | { name: 'insta'; query: URLSearchParams }
  | { name: 'map'; query: URLSearchParams }
  | { name: 'guest'; query: URLSearchParams }
  | { name: 'tour'; query: URLSearchParams }
  | { name: 'notfound'; query: URLSearchParams };

/**
 * 지금 주소가 취향 테스트 주소(…/test/)인지 — 휴대폰 넘겨보기가 주소 경로를 바꾸므로(test/ ⇄ 메인) 그때그때 봅니다
 */
export const isTestPath = (path = window.location.pathname) => /\/test\/(index\.html)?$/.test(path);

/** 링크 · 공유 주소를 완전한 주소로 — 테스트 주소에서도 메인 기준(<base>)으로 풉니다 */
export const absUrl = (path: string) => new URL(path, document.baseURI).href;

/**
 * 주소 정리 — 메인 주소에 예전 테스트 주소(#/test, #/test?r=…, #?r=…)가 붙어 오면 test/ 로,
 * 테스트 주소에 다른 화면(#/stay/… 등)이 붙어 오면 메인 주소로 옮깁니다. 옮겼으면 true
 */
export function fixTestUrl() {
  const raw = window.location.hash.replace(/^#/, '');
  const [path, qs = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const isTest = parts[0] === 'test' || (parts.length === 0 && new URLSearchParams(qs).has('r'));
  if (!isTestPath() && isTest) {
    window.location.replace(new URL(`test/${qs ? `#?${qs}` : ''}`, window.location.href).href);
    return true;
  }
  if (isTestPath() && parts.length > 0 && !isTest) {
    window.location.replace(new URL(`../#${raw}`, window.location.href).href);
    return true;
  }
  return false;
}

export function parseHash(hash = window.location.hash): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const query = new URLSearchParams(qs);
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) {
    if (query.get('r') || isTestPath()) return { name: 'test', query };
    // 예전 주소 #/?to=explore(메인 안 집 칸)는 집 페이지로
    if (query.get('to') === 'explore') return { name: 'house', query: new URLSearchParams() };
    return { name: 'home', query };
  }
  // 집 내부 — 메인에서 빼서 따로 된 페이지
  if (parts[0] === 'house') return { name: 'house', query };
  if (parts[0] === 'test') return { name: 'test', query };
  if (parts[0] === 'instagram') return { name: 'insta', query };
  if (parts[0] === 'map') return { name: 'map', query };
  if (parts[0] === 'guest') return { name: 'guest', query };
  if (parts[0] === 'tour') return { name: 'tour', query };
  if ((parts[0] === 'stay' || parts[0] === 'use') && parts[1] && parts[1] in PROGRAM_BY_ID) {
    return { name: 'stay', id: parts[1] as ProgramId, query };
  }
  return { name: 'notfound', query };
}

export function routeKey(r: Route) {
  return r.name === 'stay' ? `stay:${r.id}` : r.name;
}

/** 이번 방문에서 웹진 안 화면을 옮겨 다녔는지 — 뒤로 가기 버튼이 브라우저 뒤로 가도 웹진 밖으로 나가지 않는지 판단 */
let movedInApp = false;

/** 웹진 안에서 왔는지 — 같은 사이트의 앞 페이지(테스트 주소 ⇄ 메인처럼 페이지를 새로 여는 이동) */
function fromSite() {
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false; /* 알 수 없는 주소면 밖에서 온 것으로 */
  }
}

/** 페이지를 떠날 때 보던 화면 이름 — 새로 열린 페이지(테스트 주소 등)가 바로 앞이 메인이었는지 알 수 있게 이 탭에 저장 */
const LEFT_KEY = 'jejulog-left';
export function rememberLeaving() {
  try {
    sessionStorage.setItem(LEFT_KEY, parseHash().name);
  } catch {
    /* 저장 못 하면 메인으로 가서 기억한 자리로 */
  }
}
/** 지금 화면 이름 */
let curName: string = parseHash().name;

/**
 * 뒤로 가기 — 웹진 안에서 왔으면(같은 화면 이동 · 테스트 주소에서 넘어옴) 브라우저 뒤로,
 * 공유 링크로 바로 들어온 것처럼 앞 화면이 없으면 fallback 으로
 */
export function goBack(fallback: string) {
  if (movedInApp || fromSite()) window.history.back();
  else window.location.assign(absUrl(fallback));
}

/**
 * 상세 페이지(집 · 테스트 · 지도 · 방명록)의 뒤로 가기 — 웹진 안에서 왔으면 어느 화면에서 왔든 바로 앞 화면으로(브라우저 뒤로, 보던 자리 그대로)
 * 오른쪽 아래 버튼을 잘못 눌러 넘어왔을 때도 누르기 전 페이지로 돌아감. 링크로 바로 들어와 앞 화면이 없으면 메인의 panel 칸으로
 */
export function backToMain(panel: string) {
  if (movedInApp || fromSite()) window.history.back();
  else window.location.assign(absUrl(`#/?to=back&or=${panel}`));
}

/** 같은 주소로 다시 이동해도 반응하도록 이동 횟수를 함께 돌려줍니다 */
export function useRoute() {
  const [route, setRoute] = useState(() => ({ ...parseHash(), visit: 0 }));
  useEffect(() => {
    // 해시가 바뀔 때 · 앞뒤로 갈 때(popstate) · 넘겨보기가 주소를 바꿨을 때(jl:route) — 같은 주소로 두 번 오면 한 번만
    // (주소가 바뀌면 popstate · hashchange 가 같이 옴 — 그 사이에 메인이 주소를 #/?to=… → #/ 로 정리해도
    //  hashchange 는 바뀐 그 주소(newURL)로 비교해 1초 안에 같은 이동이면 한 번만)
    let last = window.location.href;
    let lastAt = 0;
    const on = (e: Event) => {
      const now = performance.now();
      const url = e instanceof HashChangeEvent ? e.newURL : window.location.href;
      if (url === last && (e.type !== 'hashchange' || now - lastAt < 1000)) return;
      last = url;
      lastAt = now;
      if (fixTestUrl()) return;
      movedInApp = true;
      const name = parseHash().name;
      if (name !== curName) curName = name;
      setRoute((r) => ({ ...parseHash(), visit: r.visit + 1 }));
    };
    window.addEventListener('hashchange', on);
    window.addEventListener('popstate', on);
    window.addEventListener('jl:route', on);
    return () => {
      window.removeEventListener('hashchange', on);
      window.removeEventListener('popstate', on);
      window.removeEventListener('jl:route', on);
    };
  }, []);
  return route;
}

export const href = {
  home: (to?: string) => (to ? `#/?to=${to}` : '#/'),
  house: () => '#/house',
  stay: (id: ProgramId) => `#/stay/${id}`,
  // 취향 테스트는 따로 된 주소 — 메인에서 누르면 test/ 로 넘어가고, 테스트 주소의 다른 링크(#/…)는 <base> 로 메인에 돌아감
  test: () => 'test/',
  /** post — 몇 번째 게시물을 바로 크게 열지 (1부터) */
  insta: (post?: number) => (post ? `#/instagram?post=${post}` : '#/instagram'),
  map: () => '#/map',
  guest: () => '#/guest',
  result: (code: string) => `test/#?r=${code}`,
  myResult: (code: string) => `test/#?r=${code}&me=1`,
};

/**
 * 다른 화면에서 메인의 섹션으로 돌아올 때 — 부드럽게 굴리면 사진이 늦게 뜨며 높이가 바뀌어 중간에 멈추므로
 * 바로 그 자리로 옮기고, 자리가 맞을 때까지 몇 프레임 다시 맞춤
 */
export function jumpToSection(id: string) {
  let tries = 0;
  const go = () => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, y);
      if (Math.abs(el.getBoundingClientRect().top) <= 2 && tries > 6) {
        const focusTarget = el.querySelector<HTMLElement>('h2, h1, [data-focus]') ?? el;
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
        return;
      }
    }
    if (tries++ < 40) requestAnimationFrame(go);
  };
  requestAnimationFrame(go);
}

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
