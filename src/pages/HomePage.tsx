import { useEffect, useRef, type CSSProperties } from 'react';
import type { ProgramId } from '../data/types';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { useMediaQuery, useReducedMotion } from '../lib/motion';
import { ContentPicker } from '../components/ContentPicker';
import { GuestNotes } from '../components/GuestNotes';
import houseUrl from '../assets/house-icon.png';
import testArtUrl from '../assets/test-clipboard.png';
import tasteMapUrl from '../assets/taste-map-paper.png';
import checkoutBgUrl from '../assets/checkout-stay.webp';
import stripLpWall from '../assets/strip/lp-wall.webp';
import stripPotluck from '../assets/strip/potluck-wall.webp';
import stripCat from '../assets/strip/flower-cat.webp';
import stripBuckwheat from '../assets/strip/buckwheat-umbrella.webp';
import stripTea from '../assets/strip/iced-tea.webp';
import stripMallow from '../assets/strip/fire-marshmallow.webp';
import stripWinePour from '../assets/strip/wine-pour.webp';
import stripRingWork from '../assets/strip/ring-workshop.webp';
import stripCosmos from '../assets/strip/cosmos-field.webp';
import stripCalendar from '../assets/strip/calendar-wall.webp';
import stripCrater from '../assets/strip/crater-view.webp';
import stripPuppy from '../assets/strip/rooftop-puppy.webp';
import stripSeaSit from '../assets/strip/seaside-sit.webp';
import stripForest from '../assets/strip/forest-trail.webp';
import stripSeaRun from '../assets/strip/seaside-run.webp';
import stripGuitar from '../assets/strip/guitar-corner.webp';
import stripDinner from '../assets/strip/susu-dinner-table.webp';
import stripSunrise from '../assets/strip/kokoko-sunrise.webp';

/**
 * PAGE 01 — 메인 (하나의 세로 스크롤)
 * 휴대폰: CHECK IN → 집 → FIND YOUR STAY → 취향 지도 → 방명록 → CHECK OUT (한 장씩 넘겨봄)
 * PC: CHECK IN → 콘텐츠 고르기(집 · 테스트 · 지도 · 방명록) 만
 */
export function HomePage() {
  const { site: SITE, ui } = useContent();
  const mobile = useMediaQuery('(max-width: 899px)');
  return (
    <>
      <h1 className="visually-hidden">{SITE.brand} {SITE.brandEn} — {ui.home.srTitle}</h1>
      <Intro />
      {/* PC 는 네 콘텐츠(집 · 테스트 · 지도 · 방명록)를 고르는 그림 하나만 — 누르면 커지며 상세로 */}
      {!mobile && <ContentPicker />}
      {/* 휴대폰은 집 그림 + 버튼(누르면 게하 탐색 #/house) → 테스트 → 지도 → 방명록 → CHECK OUT */}
      {mobile && (
        <>
          <RoomTour />
          <FindYourStay />
          <TasteMapBanner />
          {/* 방명록 — 질문 5개에 답하거나 자유롭게 적는 노트
              (예전 MORE STORIES 인스타그램 사진 칸은 메인에서 뺌 — 인스타그램 페이지 #/instagram 은 그대로) */}
          <GuestNotes />
          <CheckOut />
        </>
      )}
      {/* 오른쪽 점 표시(넘겨보기)는 뺌 — 오른쪽 아래 묶음 버튼을 펼치면 겹쳐서. 이제 메인은 보통 스크롤 */}
    </>
  );
}

/* ── SECTION 01. CHECK IN — 메인 첫 화면 ─────────────────────────────── */
/**
 * 예전 밤 장면 인트로(질문 → 파티 · 술 · 헌팅 → 전환 문구)는 뺌 — 들어오자마자 CHECK IN(사진 띠 · 제목 · 문장)부터
 * 다른 곳(넘겨보기 HomeDeck · 오른쪽 아래 버튼 MapFab · 메뉴 '메인')이 찾는 자리 id · 표시(intro · checkin · data-phase)는 그대로 둠
 */
function Intro() {
  // 상단 바 글자색을 밝은 화면에 맞춤
  useEffect(() => {
    window.dispatchEvent(new Event('scroll'));
  }, []);
  return (
    <section id="intro" className="intro intro--checkin" data-phase="reveal" data-tone="light" aria-labelledby="problem-title">
      <span id="checkin" className="intro__anchor" />
      <div className="intro__stage">
        <div id="problem" className="intro__reveal">
          <Problem />
          {/* 첫 화면 아래 가운데 — 아래로 내려 보라는 표시 (SCROLL + 꺾쇠 두 개가 차례로 깜빡임) */}
          <p className="intro__scroll" aria-hidden="true">
            <span>SCROLL</span>
            <b className="intro__chev">
              <span />
              <span />
            </b>
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * 첫 화면 주황 문구 — '취향 테스트' · '취향 지도' · '방명록'(영어 · 중국어도 같은 이름)만 굵게, 누르면 그 상세 페이지로
 */
const TERM_LINKS: { words: string[]; to: () => string; track: string }[] = [
  { words: ['취향 테스트', 'Taste Test', '喜好测试'], to: href.test, track: 'checkin_link_test' },
  { words: ['취향 지도', 'Taste Map', '喜好地图'], to: href.map, track: 'checkin_link_map' },
  { words: ['방명록', 'Guestbook', '留言簿'], to: href.guest, track: 'checkin_link_guest' },
];
function linkTerms(text: string) {
  const all = TERM_LINKS.flatMap((t) => t.words.map((w) => ({ w, t })));
  const re = new RegExp(`(${all.map((x) => x.w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return text.split(re).map((part, i) => {
    const hit = all.find((x) => x.w === part);
    return hit ? (
      <a key={i} className="problem__term" href={hit.t.to()} data-track={hit.t.track}>
        {part}
      </a>
    ) : (
      part
    );
  });
}

/* ── SECTION 02. PROBLEM — 인트로 끝에 떠오르는 문제 정의 ─────────────────────────────── */
function Problem() {
  const { site: SITE } = useContent();
  return (
    <section className="problem" aria-labelledby="problem-title">
      <div className="problem__inner wrap">
        {/* 사진 띠가 맨 위 — 그 아래 제목 · 문장 */}
        <PhotoStrip />
        <header className="problem__head">
          <p className="label">{SITE.problem.label}</p>
          <h2 id="problem-title" className="problem__title">
            {SITE.problem.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </header>
        {SITE.problem.points.length > 0 && (
          <div className="problem__points">
            {SITE.problem.points.map((pt) => (
              <div key={pt.no} className="problem__point">
                <p className="problem__key">
                  <span>{pt.no}</span>
                  {pt.key}
                </p>
                <p>{pt.text}</p>
              </div>
            ))}
          </div>
        )}
        <div className="problem__answer">
          <p className="problem__answertext pre">{linkTerms(SITE.problem.answer)}</p>
          {SITE.problem.answerNote && <p className="problem__answernote">{SITE.problem.answerNote}</p>}
        </div>
      </div>
    </section>
  );
}

/**
 * 사진 띠 — 게스트하우스 장면을 세로 사진으로, 조금씩 겹치고 살짝 기울여 한 줄로 늘어놓고
 * 오른쪽에서 밀려 들어온 뒤 계속 왼쪽으로 흘러갑니다. (같은 줄을 두 번 이어 붙여 끊김 없이 돕니다)
 * h 는 띠 높이 대비 %, y 는 위아래 어긋남(%), r 은 기울기(도).
 * photo 는 같은 사진이 쓰인 상세페이지 사진 파일 이름 — 대체 텍스트를 거기서 가져옵니다. (run · lounge · camp · mallow · dome · candle · lpwall · living · ring · potluck · cat · buckwheat 은 상세에 없어 ui 문구)
 */
// 색 순서대로 — 초록(메밀밭 · 코스모스 · 숲길 · 분화구) → 주황(일출 · 일력 벽 · 모닥불 · 아이스티 · 포트럭 · 꽃과 고양이)
// → 파랑(바다 달리기 · 방파제 · 강아지) → 갈색(LP 벽 · 반지 공방 · 저녁 식탁 · 기타 · 와인). 초록 · 파랑이 모자란 끝부분은 주황 · 갈색이 번갈아
// stay — 누르면 그 게스트하우스 상세페이지로 가는 사진
const STRIP: { src: string; h: number; y: number; r: number; photo: string; stay?: ProgramId }[] = [
  { src: stripBuckwheat, h: 99, y: -3, r: -2, photo: 'buckwheat', stay: 'camping' },
  { src: stripSunrise, h: 90, y: 2, r: 2, photo: 'kokoko-sunrise', stay: 'flower' },
  { src: stripSeaRun, h: 98, y: -3, r: -2, photo: 'searun', stay: 'running' },
  { src: stripLpWall, h: 92, y: 3, r: 1.5, photo: 'lpwall', stay: 'lp' },
  { src: stripCosmos, h: 99, y: -3, r: -1.5, photo: 'cosmos' },
  { src: stripCalendar, h: 95, y: 3, r: 1.5, photo: 'calendar', stay: 'lp' },
  { src: stripSeaSit, h: 98, y: -3, r: -1.5, photo: 'seasit' },
  { src: stripRingWork, h: 97, y: 2, r: 2, photo: 'ringwork', stay: 'craft' },
  { src: stripForest, h: 96, y: -3, r: -1.5, photo: 'forest' },
  { src: stripMallow, h: 93, y: 3, r: 1.5, photo: 'mallow', stay: 'camping' },
  { src: stripPuppy, h: 96, y: -2, r: -1.5, photo: 'puppy' },
  { src: stripDinner, h: 100, y: 2, r: 1.5, photo: 'susu-dinner-table', stay: 'homemeal' },
  { src: stripCrater, h: 99, y: -4, r: -2, photo: 'crater' },
  { src: stripTea, h: 91, y: 4, r: 1, photo: 'tea' },
  { src: stripGuitar, h: 96, y: -2, r: -1.5, photo: 'guitar', stay: 'book' },
  { src: stripPotluck, h: 97, y: 4, r: 2, photo: 'potluck', stay: 'camping' },
  { src: stripWinePour, h: 95, y: -3, r: -1.5, photo: 'winepour', stay: 'wine' },
  { src: stripCat, h: 94, y: 2, r: 1.5, photo: 'cat', stay: 'flower' },
];

/** 사진 띠가 저절로 흐르는 빠르기 — 한 바퀴(사진 18장)에 걸리는 시간 */
const STRIP_LAP_MS = 72000;
/** 손을 뗀 뒤 다시 흐르기 시작할 때까지 */
const STRIP_RESUME_MS = 2500;

function PhotoStrip() {
  const { ui, programs } = useContent();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // 천천히 저절로 흐르되, 내가 움직일 수 있게 — 휴대폰은 손가락으로 옆으로 밀고, PC 는 마우스로 끌거나 트랙패드 · Shift+휠로 옆으로
  //  손대는 동안(마우스를 올려 둔 동안 포함)은 멈추고, 손을 떼고 2.5초 뒤 다시 흐름. 같은 줄을 두 번 이어 붙여 끝없이 이어짐
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = 0;
    let hover = false;
    let holdUntil = 0;
    let drag: { x: number; left: number; moved: boolean } | null = null;
    const half = () => el.scrollWidth / 2;
    const wrap = () => {
      const h = half();
      if (h <= 0) return;
      if (el.scrollLeft >= h) el.scrollLeft -= h;
      else if (el.scrollLeft <= 0) el.scrollLeft += h;
    };
    const hold = () => {
      holdUntil = performance.now() + STRIP_RESUME_MS;
    };
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!reduced && !hover && !drag && now > holdUntil && !document.hidden) {
        const h = half();
        pos += (h / STRIP_LAP_MS) * dt; // 소수점까지 따로 세어 아주 느려도 멈추지 않게
        if (h > 0 && pos >= h) pos -= h;
        el.scrollLeft = pos;
      } else pos = el.scrollLeft; // 손으로 옮긴 자리부터 이어서
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onScroll = () => {
      if (drag || performance.now() < holdUntil) wrap();
    };
    const onEnter = (e: PointerEvent) => e.pointerType === 'mouse' && (hover = true);
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      hover = false;
      hold();
    };
    // 마우스로 끌기 (손가락은 기본 가로 스크롤 그대로)
    const onDown = (e: PointerEvent) => {
      hold();
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
      el.classList.add('is-dragging');
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      el.scrollLeft = drag.left - dx;
      wrap();
    };
    const onUp = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      el.classList.remove('is-dragging');
      hold();
      // 끌다 놓은 건 사진 누르기(상세로 이동)로 치지 않음
      if (moved) el.addEventListener('click', (ev) => ev.preventDefault(), { capture: true, once: true });
    };
    const onTouch = () => hold();
    const onWheel = (e: WheelEvent) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && hold();
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('touchstart', onTouch, { passive: true });
    el.addEventListener('touchmove', onTouch, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('touchstart', onTouch);
      el.removeEventListener('touchmove', onTouch);
      el.removeEventListener('wheel', onWheel);
    };
  }, [reduced]);
  const alt = (key: string) => {
    if (key === 'run') return ui.home.stripRunAlt;
    if (key === 'lounge') return ui.home.stripLoungeAlt;
    if (key === 'camp') return ui.home.stripCampAlt;
    if (key === 'mallow') return ui.home.stripMallowAlt;
    if (key === 'dome') return ui.home.stripDomeAlt;
    if (key === 'candle') return ui.home.stripCandleAlt;
    if (key === 'lpwall') return ui.home.stripLpWallAlt;
    if (key === 'living') return ui.home.stripLivingAlt;
    if (key === 'ring') return ui.home.stripRingAlt;
    if (key === 'potluck') return ui.home.stripPotluckAlt;
    if (key === 'cat') return ui.home.stripCatAlt;
    if (key === 'buckwheat') return ui.home.stripBuckwheatAlt;
    if (key === 'tea') return ui.home.stripTeaAlt;
    if (key === 'searun') return ui.home.stripSeaRunAlt;
    if (key === 'guitar') return ui.home.stripGuitarAlt;
    if (key === 'winepour') return ui.home.stripWinePourAlt;
    if (key === 'ringwork') return ui.home.stripRingWorkAlt;
    if (key === 'cosmos') return ui.home.stripCosmosAlt;
    if (key === 'calendar') return ui.home.stripCalendarAlt;
    if (key === 'crater') return ui.home.stripCraterAlt;
    if (key === 'puppy') return ui.home.stripPuppyAlt;
    if (key === 'seasit') return ui.home.stripSeaSitAlt;
    if (key === 'forest') return ui.home.stripForestAlt;
    for (const g of programs.flatMap((p) => p.report.programs ?? [])) {
      const hit = [g.photo, ...(g.photos ?? [])].find((ph) => ph?.src?.includes(key));
      if (hit) return hit.alt;
    }
    return '';
  };
  return (
    <div className="strip" aria-hidden="true" ref={ref}>
      <div className="strip__track">
        {[0, 1].map((loop) =>
          STRIP.map((p) => {
            const style = { height: `${p.h}%`, '--y': `${p.y}%`, '--r': `${p.r}deg` } as CSSProperties;
            const img = <img src={p.src} alt={loop === 0 ? alt(p.photo) : ''} />;
            // 상세페이지가 있는 사진은 누르면 그 게스트하우스로 (띠 전체가 꾸밈이라 키보드 순서에는 넣지 않음 — 같은 곳은 집 · 목록에서 갈 수 있음)
            return p.stay ? (
              <a key={`${loop}-${p.src}`} className="strip__item strip__item--link" style={style} href={href.stay(p.stay)} tabIndex={-1} data-track={`strip_${p.stay}`}>
                {img}
              </a>
            ) : (
              <span key={`${loop}-${p.src}`} className="strip__item" style={style}>
                {img}
              </span>
            );
          }),
        )}
      </div>
    </div>
  );
}

/* ── ROOM TOUR — CHECK IN 아래, 집 그림 + 테두리 버튼. 누르면 집 페이지(#/house) ─────────────────────────────── */
function RoomTour() {
  const { site: SITE, ui } = useContent();
  const e = SITE.explore;
  return (
    <section id="roomtour" className="roomtour" data-tone="light" aria-labelledby="roomtour-title">
      {/* 그림 위 작은 라벨 — 다른 칸처럼 */}
      <p className="label roomtour__label">{e.label}</p>
      <a className="roomtour__link" href={href.house()} data-track="home_roomtour">
        <img className="roomtour__img" src={houseUrl} alt="" width={900} height={630} loading="lazy" decoding="async" />
        <span className="roomtour__btn">
          {/* 버튼 상자 없이 PC 처럼 이름 · 작은 영어 이름만 */}
          <span id="roomtour-title" className="roomtour__name">{ui.nav.house}</span>
          <span className="label label--muted">EXPLORE</span>
        </span>
      </a>
    </section>
  );
}

/* ── SECTION 03. FIND YOUR STAY — 취향 테스트 안내 ─────────────────────────────── */
function FindYourStay() {
  const { site: SITE, ui } = useContent();
  return (
    <section id="find" className="find" data-tone="light" aria-labelledby="find-title">
      <div className="find__inner wrap">
        <div className="find__copy">
          <p className="label">{SITE.findYourStay.label}</p>
          {/* 뽑기 기계 그림 — 누르면 취향 테스트로 */}
          <a className="find__art" href={href.test()} aria-label={SITE.findYourStay.cta} data-track="find_art" tabIndex={-1}>
            <img src={testArtUrl} alt="" width={821} height={985} loading="lazy" decoding="async" />
          </a>
          {/* 제목은 화면에서 빼고 화면 낭독기용으로만 */}
          <h2 id="find-title" className="visually-hidden">
            {SITE.findYourStay.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          {/* 소라게 게하게 소개 · 공유하기는 테스트 페이지 첫 화면에 */}
          {/* 집 칸과 같은 흰 테두리 버튼 — 질문 문구 */}
          <a className="roomtour__btn find__cta" href={href.test()} data-track="find_cta">
            <span className="roomtour__name">{ui.nav.test}</span>
            <span className="label label--muted">TEST</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 04. CHECK OUT — 마무리: 맺음 문구 · 다시 둘러보기 ─────────────────────────────── */
/* ── 제주 게하 취향지도 — 테스트 칸과 MORE STORIES 사이, 받은 섬 그림 위로 돋보기가 움직임 · 누르면 취향 지도 페이지 ── */
function TasteMapBanner() {
  const { ui } = useContent();
  return (
    <section id="tastemap" className="find find--map" data-tone="light" aria-labelledby="tastemap-title">
      <div className="find__inner wrap">
        {/* 작은 라벨만 — 제목은 화면 낭독기용으로만 */}
        <div className="tastemap__head">
          <p className="label">AROUND JEJU</p>
          <h2 id="tastemap-title" className="visually-hidden">{ui.map.homeTitle}</h2>
        </div>
        {/* 그림 전체가 눌림 */}
        <a className="tastemap" href={href.map()} data-track="home_taste_map" aria-label={ui.map.open}>
          {/* 접힌 종이 제주 지도 그림 */}
          <img className="tastemap__img" src={tasteMapUrl} alt="" width={1100} height={707} loading="lazy" decoding="async" />
        </a>
        {/* 집 · 테스트 칸과 같은 흰 테두리 버튼 — 질문 문구 */}
        <a className="roomtour__btn find__cta" href={href.map()} data-track="home_taste_map_btn">
          <span className="roomtour__name">{ui.deck.tastemap}</span>
          <span className="label label--muted">MAP</span>
        </a>
      </div>
    </section>
  );
}

function CheckOut() {
  const { site: SITE } = useContent();
  const c = SITE.checkOut;
  return (
    // 배경 — 받은 그림(크림 종이 · 찢어진 종이 · 초록 언덕 위 stay Log 집 로고)을 오른쪽 아래에. 글은 왼쪽 위, 로고는 글 아래 오른쪽 (휴대폰은 버튼 오른쪽 아래)
    <section id="checkout" className="outro" data-tone="light" aria-labelledby="checkout-title" style={{ '--outro-bg': `url(${checkoutBgUrl})` } as CSSProperties}>
      <div className="outro__inner wrap">
        <header className="outro__head">
          <p className="label">{c.label}</p>
          <h2 id="checkout-title" className="outro__title">
            {c.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </header>

        {/* 빈 줄(\n\n)로 나눈 두 문장 — 빈 줄 한 칸 대신 반 줄쯤만 띄움 */}
        <p className="outro__closing pre">
          {c.closing.split('\n\n').map((part) => (
            <span key={part} className="outro__para">{part}</span>
          ))}
        </p>
        {/* 다시 둘러보기 · 그 아래 인스타그램 보러가기 */}
        <div className="outro__actions">
          <a className="btn" href={href.house()} data-track="checkout_cta">
            {c.cta} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
