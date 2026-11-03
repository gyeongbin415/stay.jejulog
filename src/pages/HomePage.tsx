import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SITE as SITE_KO } from '../data/site';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { useMediaQuery, useReducedMotion } from '../lib/motion';
import { HomeDeck } from '../components/HomeDeck';
import { HomeFolders, FOLDER_IDS, FOLDER_KEYS } from '../components/HomeFolders';
import introNightUrl from '../assets/intro-night.webp';
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
 * INTRO → PROBLEM → CHECK IN → FIND YOUR STAY → CHECK OUT
 */
export function HomePage() {
  const { site: SITE, ui } = useContent();
  // 휴대폰 — 칸을 한 장씩 위아래로 넘겨봄 (동작 줄이기 설정이면 보통 스크롤)
  const mobile = useMediaQuery('(max-width: 899px)');
  const reduced = useReducedMotion();
  return (
    <>
      <h1 className="visually-hidden">{SITE.brand} {SITE.brandEn} — {ui.home.srTitle}</h1>
      {/* 인트로 끝 CHECK IN 아래에 폴더 넷(집 · 취향 테스트 · 취향 지도 · 방명록) — 스크롤마다 하나씩 올라옴 */}
      <Intro />
      <CheckOut />
      {/* 인트로보다 뒤에 둬야 손짓 처리도 인트로 다음 차례 (인트로가 단계를 넘긴 손짓은 넘기지 않음) */}
      {mobile && !reduced && <HomeDeck />}
    </>
  );
}

/* ── SECTION 01. INTRO — 밤의 게스트하우스, 기존 인식 ─────────────────────────────── */
/**
 * 화면을 고정해 두고 스크롤을 내릴 때마다 한 단계씩 장면이 진행됩니다 (저절로 넘어가지 않음).
 * 질문 → 01 파티. → 02 술. → 03 헌팅.
 * → 어둠 속 전환 문구 → 밝은 화면이 서서히 떠오르며 문제 정의(PROBLEM)
 * 동작 줄이기 설정이면 고정 없이 모든 문구를 한 번에 보여 줍니다.
 */
const REVEAL = SITE_KO.intro.words.length + 3;
/**
 * 스크롤 단계 — 내릴 때마다 하나씩: 질문만(0) → 단어 1 · 2 · 3 → 전환 문구 앞 두 줄(total + 2)
 * → 한 번 더 내리면 끝 줄 '전부가 아닙니다.'(같은 total + 2, 두 번째) → 문제 정의 CHECK IN(REVEAL)
 * (예전 '시야가 좁아짐' 단계 total + 1 은 건너뜀)
 */
const STEPS = [0, ...SITE_KO.intro.words.map((_, i) => i + 1), REVEAL - 1, REVEAL - 1, REVEAL];
/** CHECK IN 다음 — 폴더 네 개가 하나씩 올라왔다 내려감 (REVEAL + 1 … + 4) */
const FOLDER_STEPS = [...STEPS, ...FOLDER_KEYS.map((_, i) => REVEAL + 1 + i)];
/** CHECK IN 이 다 열린 단계 자리 (FOLDER_STEPS 안 순서) */
const CHECKIN_AT = STEPS.length - 1;
/** 전환 문구 끝 줄이 나오는 단계 (STEPS 의 두 번째 REVEAL - 1) */
const TURN_END = STEPS.length - 2;
/** 단계 하나에 내리는 거리 — 화면 높이의 0.6배 (인트로 높이 = 한 화면 + 단계 수 × 0.6 화면, home.css) */
const STEP_VH = 0.6;
function Intro() {
  const { site: SITE, ui } = useContent();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const total = SITE.intro.words.length;
  // 동작 줄이기 설정이면 폴더는 고정 없이 아래에 펼침 — 단계는 CHECK IN 까지만
  const steps = reduced ? STEPS : FOLDER_STEPS;
  const last = steps.length - 1;
  // 지금 몇 번째 단계까지 내렸는지 — 스크롤 위치로 정함 (올리면 되돌아감)
  const [k, setK] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) : 1;
      el.style.setProperty('--p', p.toFixed(3));
      // 단계 자리의 40% 앞에서 미리 넘어감 — 조금만 내려도 다음 글이 올라옴
      const s = -el.getBoundingClientRect().top / window.innerHeight;
      setK(Math.max(0, Math.min(last, Math.floor(s / STEP_VH + 0.4))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, last]);

  const step = reduced ? REVEAL : steps[k];
  /** 올라와 있는 폴더 (없으면 -1) */
  const open = step > REVEAL ? step - REVEAL - 1 : -1;
  /** 단계 자리로 바로 옮김 — 폴더 움직임은 폴더가 맡음 (부드럽게 굴리면 사이 폴더가 잠깐씩 올라왔다 내려감)
   *  폴더를 누르면 그 폴더 단계, X 를 누르면 CHECK IN 단계(폴더가 다 내려감) */
  const toStep = (at: number) => {
    const el = ref.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + at * STEP_VH * window.innerHeight;
    window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
  };
  const pick = (i: number) => toStep(CHECKIN_AT + 1 + i);
  const shown = step;
  const revealed = !reduced && step >= REVEAL;
  const phase = reduced ? 'static'
    : step === 0 ? 'start'
    : step < total ? 'words'
    : step === total ? 'all'
    : step === total + 1 ? 'iris'
    : step === total + 2 ? 'turn' : 'reveal';

  // 휠 · 손가락 · 키보드 한 번에 한 단계씩 — 관성으로 여러 단계를 한꺼번에 지나치지 않게, 옮긴 뒤 0.65초는 이어지는 스크롤을 흘려보냄
  // (인트로 안에서만. CHECK IN 까지 다 나온 뒤 더 내리면 아래 칸으로 그대로)
  useEffect(() => {
    if (reduced) return;
    let holdUntil = 0;
    let startY = 0;
    let fired = false;
    const holding = () => Date.now() < holdUntil;
    const inMenu = (t: EventTarget | null) => t instanceof Element && !!t.closest('.menu');
    const top = () => (ref.current ? ref.current.getBoundingClientRect().top + window.scrollY : 0);
    const posOf = (i: number) => top() + i * STEP_VH * window.innerHeight;
    // dir 쪽으로 한 단계 옮겼으면 true (인트로 밖이면 false — 보통 스크롤)
    const move = (dir: 1 | -1) => {
      const y = window.scrollY;
      const end = posOf(last);
      if (y > end + 2) return false;
      if (dir < 0 && y <= top() + 2) return false;
      const cur = Math.max(0, Math.min(last, Math.round((y - top()) / (STEP_VH * window.innerHeight))));
      const to = Math.max(0, Math.min(last, cur + dir));
      if (dir > 0 && cur === last && Math.abs(y - end) <= 2) return false;
      window.scrollTo(0, posOf(to));
      holdUntil = Date.now() + 650;
      return true;
    };
    const onWheel = (e: WheelEvent) => {
      if (inMenu(e.target) || e.ctrlKey || Math.abs(e.deltaY) < 1) return;
      if (holding() ? window.scrollY <= posOf(last) + 2 : move(e.deltaY > 0 ? 1 : -1)) e.preventDefault();
    };
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0]?.clientY ?? 0;
      fired = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (inMenu(e.target) || e.touches.length > 1) return;
      const dy = startY - (e.touches[0]?.clientY ?? startY); // 손가락을 위로 = 아래로 내림
      if (!fired && Math.abs(dy) > 12) fired = move(dy > 0 ? 1 : -1);
      if (fired || (holding() && window.scrollY <= posOf(last) + 2)) e.preventDefault();
    };
    const KEYS: Record<string, 1 | -1> = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const dir = KEYS[e.key];
      if (!dir || inMenu(t) || t?.closest('input, textarea, select, [contenteditable]')) return;
      // 버튼 위 스페이스는 누르기 동작이라 그대로 둠
      if (e.key === ' ' && t?.closest('button')) return;
      if (move(e.shiftKey && e.key === ' ' ? -1 : dir)) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [reduced, last]);

  // 밝은 문제 정의 화면이 열리면 상단 바 글자색도 다시 맞춥니다.
  useEffect(() => {
    window.dispatchEvent(new Event('scroll'));
  }, [revealed]);

  return (
    <section ref={ref} id="intro" className={`intro${reduced ? ' intro--static' : ''}`} style={{ '--steps': last } as CSSProperties} data-turn-end={k >= TURN_END || undefined} data-step={Math.min(shown, total)} data-phase={phase} data-tone={revealed ? 'light' : 'dark'} aria-labelledby="intro-title">
      {/* 메뉴 '메인'이 오는 자리 — CHECK IN 화면이 다 열린 단계, 그 뒤로 폴더 넷이 하나씩 올라오는 단계 (메뉴 · 뒤로 가기가 찾아옴) */}
      {!reduced && (
        <>
          <span id="checkin" className="intro__anchor" style={{ top: `${CHECKIN_AT * STEP_VH * 100}vh` }} />
          {FOLDER_IDS.map((id, i) => (
            <span key={id} id={id} className="intro__anchor" style={{ top: `${(CHECKIN_AT + 1 + i) * STEP_VH * 100}vh` }} />
          ))}
        </>
      )}
      <div className="intro__stage">
        <NightScene />

        <h2 id="intro-title" className="intro__q pre">{SITE.intro.question}</h2>
        <ol className="intro__words" aria-label={ui.home.wordsAria}>
          {SITE.intro.words.map((w, i) => (
            <li key={w} className={`intro__word w${i + 1}${i < Math.min(shown, total) ? ' is-on' : ''}`}>
              {w}
            </li>
          ))}
        </ol>

        {/* 줄마다 — 따옴표로 시작하는 줄(‘제주 게스트하우스’)은 크고 진하게 */}
        <p className="intro__turn">
          {SITE.intro.turn.split('\n').map((line, i, all) => (
            <span key={line} className={/^[‘“]/.test(line) ? 'intro__turn-em' : i === all.length - 1 ? 'intro__turn-end' : undefined}>
              {line}
            </span>
          ))}
        </p>

        <p className="intro__hint" aria-hidden="true">
          <i />
        </p>

        {/* 밝은 화면이 서서히 떠오르며 — 문제 정의 */}
        <div id="problem" className="intro__reveal">
          {/* 동작 줄이기 설정이면 고정 없이 펼쳐지므로 CHECK IN 자리는 여기 */}
          {reduced && <span id="checkin" />}
          {reduced && <Problem />}
        </div>
        {/* 탭 달린 폴더 넷 한 묶음 — 사진이 폴더에서 삐져나와 흩어지고 맨 앞면에 CHECK IN 글, 스크롤마다 폴더 하나씩 올라옴 */}
        {!reduced && <HomeFolders open={open} onPick={pick} onClose={() => toStep(CHECKIN_AT)} photos={<CoverPhotos />} cover={<CoverText />} />}
      </div>
      {reduced && <HomeFolders open={-1} onPick={() => {}} still />}
    </section>
  );
}

/** 흐릿한 파티 불빛과 사람들의 실루엣 — 받은 배경 그림 한 장, 문구가 늘어날수록 짙어집니다 */
function NightScene() {
  return (
    <div className="intro__scene" aria-hidden="true">
      <img className="intro__bg" src={introNightUrl} alt="" />
    </div>
  );
}

/* ── SECTION 02. PROBLEM — 인트로 끝에 떠오르는 문제 정의 ─────────────────────────────── */
function Problem() {
  const { site: SITE } = useContent();
  return (
    <section className="problem" aria-labelledby="problem-title">
      <div className="problem__inner wrap">
        {/* 서류 집게 — 위를 집게가 물고 있는 클립보드 한 장에 사진 띠 · 제목 · 문장 */}
        <div className="clipsheet">
          <span className="clipsheet__clip" aria-hidden="true" />
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
            <p className="problem__answertext pre">{SITE.problem.answer}</p>
            {SITE.problem.answerNote && <p className="problem__answernote">{SITE.problem.answerNote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

/** 폴더 뒤로 삐져나온 사진 — 왼쪽 위치 · 아래 높이 · 폭(%) · 기울기 (사진 띠와 같은 사진) */
const COVER_PHOTOS: { src: string; l: number; b: number; w: number; r: number }[] = [
  // 뒷줄 — 가장 높이 솟음
  { src: stripForest, l: 0, b: 30, w: 26, r: -12 },
  { src: stripCosmos, l: 18, b: 40, w: 26, r: -5 },
  { src: stripSunrise, l: 40, b: 44, w: 26, r: 2 },
  { src: stripTea, l: 60, b: 38, w: 26, r: 8 },
  { src: stripGuitar, l: 76, b: 28, w: 24, r: 13 },
  // 가운데 줄
  { src: stripSeaSit, l: 6, b: 12, w: 28, r: -8 },
  { src: stripLpWall, l: 28, b: 20, w: 28, r: -2 },
  { src: stripCrater, l: 52, b: 18, w: 29, r: 5 },
  { src: stripPotluck, l: 70, b: 8, w: 27, r: 10 },
  // 앞줄 — 폴더 입구에 걸침
  { src: stripDinner, l: 22, b: 0, w: 27, r: -4 },
  { src: stripPuppy, l: 48, b: 0, w: 26, r: 3 },
];
function CoverPhotos() {
  return (
    <>
      {COVER_PHOTOS.map((p, k) => (
        <span key={p.src} className="cphoto" style={{ '--l': `${p.l}%`, '--b': `${p.b}%`, '--w': `${p.w}%`, '--r': `${p.r}deg`, '--k': k } as CSSProperties}>
          <img src={p.src} alt="" />
        </span>
      ))}
    </>
  );
}

/** 맨 앞면 글 — CHECK IN · 제목 · 문장 */
function CoverText() {
  const { site: SITE } = useContent();
  return (
    <>
      <p className="label cover__label">{SITE.problem.label}</p>
      <h2 className="cover__title">
        {SITE.problem.title.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </h2>
      <p className="cover__sub pre">{SITE.problem.answer}</p>
    </>
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
const STRIP: { src: string; h: number; y: number; r: number; photo: string }[] = [
  { src: stripBuckwheat, h: 99, y: -3, r: -2, photo: 'buckwheat' },
  { src: stripSunrise, h: 90, y: 2, r: 2, photo: 'kokoko-sunrise' },
  { src: stripSeaRun, h: 98, y: -3, r: -2, photo: 'searun' },
  { src: stripLpWall, h: 92, y: 3, r: 1.5, photo: 'lpwall' },
  { src: stripCosmos, h: 99, y: -3, r: -1.5, photo: 'cosmos' },
  { src: stripCalendar, h: 95, y: 3, r: 1.5, photo: 'calendar' },
  { src: stripSeaSit, h: 98, y: -3, r: -1.5, photo: 'seasit' },
  { src: stripRingWork, h: 97, y: 2, r: 2, photo: 'ringwork' },
  { src: stripForest, h: 96, y: -3, r: -1.5, photo: 'forest' },
  { src: stripMallow, h: 93, y: 3, r: 1.5, photo: 'mallow' },
  { src: stripPuppy, h: 96, y: -2, r: -1.5, photo: 'puppy' },
  { src: stripDinner, h: 100, y: 2, r: 1.5, photo: 'susu-dinner-table' },
  { src: stripCrater, h: 99, y: -4, r: -2, photo: 'crater' },
  { src: stripTea, h: 91, y: 4, r: 1, photo: 'tea' },
  { src: stripGuitar, h: 96, y: -2, r: -1.5, photo: 'guitar' },
  { src: stripPotluck, h: 97, y: 4, r: 2, photo: 'potluck' },
  { src: stripWinePour, h: 95, y: -3, r: -1.5, photo: 'winepour' },
  { src: stripCat, h: 94, y: 2, r: 1.5, photo: 'cat' },
];

function PhotoStrip() {
  const { ui, programs } = useContent();
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
    <div className="strip" aria-hidden="true">
      <div className="strip__track">
        {[0, 1].map((loop) =>
          STRIP.map((p) => (
            <span key={`${loop}-${p.src}`} className="strip__item" style={{ height: `${p.h}%`, '--y': `${p.y}%`, '--r': `${p.r}deg` } as CSSProperties}>
              <img src={p.src} alt={loop === 0 ? alt(p.photo) : ''} />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

/* ── SECTION 04. CHECK OUT — 마무리: 맺음 문구 · 다시 둘러보기 ─────────────────────────────── */
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
