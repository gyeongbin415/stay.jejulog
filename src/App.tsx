import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { useRoute, jumpToSection, parseHash, routeKey } from './lib/router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MapFab } from './components/MapFab';
import { Loader } from './components/Loader';
import { HomePage } from './pages/HomePage';
import { HousePage } from './pages/HousePage';
import { useContent } from './i18n';
import { track } from './lib/track';
import { applyPageMeta, SITE_NAME, type PageMeta } from './lib/seo';
import { INSTA_PROFILE } from './data/insta';

const StayPage = lazy(() => import('./pages/StayPage'));
const TestPage = lazy(() => import('./pages/TestPage'));
const InstaPage = lazy(() => import('./pages/InstaPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

export function App() {
  const route = useRoute();
  const { lang, ui, site, programById, experienceById } = useContent();
  const key = routeKey(route);
  const query = route.query.toString();
  const keyRef = useRef(key);
  const positions = useRef<Record<string, number>>({});
  /** 바로 전에 보던 화면 이름 — 기억한 자리가 없을 때(새로고침 등) 메인 어느 칸으로 돌아갈지 정함 */
  const prevName = useRef<string | null>(null);

  // 페이지별 title · description · SNS 미리보기 · 구조화 데이터 — 모두 그 페이지에 보이는 내용에서 가져옵니다.
  // (화면 이동 기록보다 먼저 바꿔 두어야 page_title 에 새 제목이 실립니다)
  useLayoutEffect(() => {
    let m: PageMeta = {
      title: ui.docTitle,
      description: site.description,
      ogTitle: SITE_NAME,
      ogDescription: site.checkIn.title.join(' '),
    };
    if (route.name === 'stay') {
      const p = programById[route.id];
      const name = p.report.place.name;
      m = {
        title: `${name} — ${experienceById[route.id].label} | ${SITE_NAME}`,
        description: p.report.oneLine || site.description,
        path: `#/stay/${route.id}`,
        image: p.hero.src,
        imageAlt: p.hero.alt,
        article: p.hero.src ? { headline: name, image: p.hero.src } : undefined,
      };
    } else if (route.name === 'house') {
      m = { title: `${ui.nav.house} — ${site.explore.title.join(' ')} | ${SITE_NAME}`, description: site.explore.sub, path: '#/house' };
    } else if (route.name === 'test') {
      m = { title: `${ui.nav.test} | ${SITE_NAME}`, description: ui.test.storyBody.replace(/\n/g, ' '), path: 'test/' };
    } else if (route.name === 'insta') {
      m = { title: `${ui.insta.title} | ${SITE_NAME}`, description: INSTA_PROFILE.bio.join(' '), path: '#/instagram' };
    } else if (route.name === 'map') {
      m = { title: `${ui.map.pageTitle} | ${SITE_NAME}`, description: ui.map.sub, path: '#/map' };
    }
    applyPageMeta(m);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, lang]);

  // 메인 · 탐색 페이지의 스크롤 위치를 기억해 두었다가, 뒤로 가기로 돌아오면 보던 자리로 복귀합니다.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onScroll = () => {
      const k = routeKey(parseHash());
      if (k === keyRef.current) positions.current[k] = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 화면 이동 기록 — 주소의 #/ 뒤만 바뀌는 앱이라 GA4 기본 page_view 가 첫 화면에서만 나갑니다.
  // 화면이 바뀔 때마다 dataLayer 에 'virtual_page_view' 를 쌓아 GTM 에서 page_view 로 보내게 합니다. (첫 화면은 GTM 기본 page_view 가 맡음)
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    track('virtual_page_view', {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.hash}`,
      page_title: document.title,
    });
  }, [key]);

  useLayoutEffect(() => {
    keyRef.current = key;
    const to = route.query.get('to');
    if (route.name === 'home' && to) {
      jumpToSection(to);
      history.replaceState(history.state, '', '#/');
    } else if (route.name === 'home' && positions.current[key] == null && (prevName.current === 'map' || prevName.current === 'insta')) {
      // 기억한 자리가 없으면(지도 · 인스타 페이지에서 새로고침한 뒤 뒤로 가기 등) 그 페이지로 들어가던 칸으로
      jumpToSection(prevName.current === 'map' ? 'tastemap' : 'inside');
    } else if (route.name === 'home' || route.name === 'house') {
      // 지도 · 인스타 · 숙소 페이지에서 뒤로 가기로 메인에 돌아오면 보던 자리(예: 취향 지도 칸)로 —
      // 휴대폰은 사진이 늦게 떠 페이지가 아직 짧을 수 있어 자리가 맞을 때까지 몇 프레임 다시 맞춤
      const y = positions.current[key] ?? 0;
      let tries = 0;
      const go = () => {
        window.scrollTo(0, y);
        if (Math.abs(window.scrollY - y) > 2 && tries++ < 60) requestAnimationFrame(go);
      };
      go();
    } else if (route.name === 'test' && route.query.get('r')) {
      // 숙소 페이지에서 뒤로 가기로 결과에 돌아오면 보던 자리로 — 결과 화면이 그려질 때까지 몇 프레임 다시 맞춤
      const y = positions.current[key] ?? 0;
      let tries = 0;
      const go = () => {
        window.scrollTo(0, y);
        if (Math.abs(window.scrollY - y) > 2 && tries++ < 30) requestAnimationFrame(go);
      };
      go();
    } else {
      window.scrollTo(0, 0);
    }
    if (route.name !== 'home') document.getElementById('main')?.focus({ preventScroll: true });
    prevName.current = route.name;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, query, route.visit]);

  return (
    <>
      <Header route={route} />
      <main id="main" tabIndex={-1}>
        <div className="page" key={key}>
          {route.name === 'stay' ? (
            <Suspense fallback={<Loader label={ui.app.loadingStay} />}>
              <StayPage id={route.id} />
            </Suspense>
          ) : route.name === 'test' ? (
            <Suspense fallback={<Loader label={ui.app.loadingTest} />}>
              <TestPage sharedCode={route.query.get('r')} mine={route.query.get('me') === '1'} />
            </Suspense>
          ) : route.name === 'insta' ? (
            <Suspense fallback={<Loader label={ui.insta.loading} />}>
              <InstaPage post={Number(route.query.get('post')) || null} />
            </Suspense>
          ) : route.name === 'house' ? (
            <HousePage />
          ) : route.name === 'map' ? (
            <Suspense fallback={<Loader label={ui.map.title} />}>
              <MapPage />
            </Suspense>
          ) : route.name === 'home' ? (
            <HomePage />
          ) : (
            <section className="notfound" data-tone="light">
              <p className="label">PAGE NOT FOUND</p>
              <h1>{ui.app.notFound}</h1>
              <p>
                <a className="btn" href="#/">{ui.app.toHome}</a>
              </p>
            </section>
          )}
        </div>
      </main>
      {/* 취향 지도 동그라미 — 모든 페이지 오른쪽 아래 (지도 페이지에서는 숨김) */}
      <MapFab showMap={route.name !== 'map'} showInsta={route.name !== 'insta'} home={route.name === 'home'} />
      <Footer />
    </>
  );
}
