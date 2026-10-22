import { useEffect, useRef, useState } from 'react';
import { SITE as SITE_KO } from '../data/site';
import { QUESTIONS } from '../data/quiz';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { useReducedMotion } from '../lib/motion';
import { HousePage } from './HousePage';

/**
 * PAGE 01 — 메인 (하나의 세로 스크롤)
 * INTRO → PROBLEM → CHECK IN → FIND YOUR STAY → CHECK OUT
 */
export function HomePage() {
  const { site: SITE, ui } = useContent();
  return (
    <>
      <h1 className="visually-hidden">{SITE.brand} {SITE.brandEn} — {ui.home.srTitle}</h1>
      <Intro />
      {/* 대문(체크인 · 체크아웃) 대신 집 내부를 메인에서 바로 둘러봅니다 */}
      <HousePage embedded />
      <FindYourStay />
      <CheckOut />
    </>
  );
}

/* ── SECTION 01. INTRO — 밤의 게스트하우스, 기존 인식 ─────────────────────────────── */
/**
 * 화면을 고정해 두고 스크롤하는 만큼 장면이 진행됩니다.
 * 질문 → 01 파티. → 02 술. → 03 헌팅.
 * → 시야가 좁아짐(조리개) → 어둠 속 전환 문구 → 조리개가 다시 열리며 문제 정의(PROBLEM)
 * 동작 줄이기 설정이면 고정 없이 모든 문구를 한 번에 보여 줍니다.
 */
const REVEAL = SITE_KO.intro.words.length + 3;
function Intro() {
  const { site: SITE, ui } = useContent();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const total = SITE.intro.words.length;
  // 스크롤 없이 시간에 맞춰 저절로 — 질문 → 파티 · 술 · 헌팅 → 시야가 좁아짐 → 전환 문구 → 조리개가 열리며 문제 정의
  // auto: 1 ~ total 은 나온 단어 수, total + 1 은 시야가 좁아짐, total + 2 는 전환 문구, REVEAL 은 문제 정의
  const [auto, setAuto] = useState(0);
  // 자동 진행 중에 먼저 스크롤해 내려가도 바로 문제 정의
  const [revealByScroll, setRevealByScroll] = useState(false);
  // 아래로 내려갔다가 맨 위로 돌아오면 질문부터 다시 재생 (run 이 바뀌면 시간을 처음부터 셉니다)
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduced) return;
    // 질문만 0.9초 → 단어 0.65초 간격 → 1초 뒤 시야가 좁아짐 → 0.9초 뒤 전환 문구 → 1.6초 뒤 문제 정의
    const at = Array.from({ length: total }, (_, i) => 900 + i * 650);
    const last = at[at.length - 1];
    at.push(last + 1000, last + 1900, last + 3500);
    // 화면에 실제로 보이는 동안만 시간을 셉니다 — 공유 링크가 뒤에서 미리 불러와질 때 혼자 끝나 버리지 않도록
    // (requestAnimationFrame 은 안 보이는 창 · 프레임에서 멈추고, 인트로 무대가 화면에 반 이상 보일 때만 셈)
    let visible = false;
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([en]) => { visible = en.intersectionRatio >= 0.5; }, { threshold: [0, 0.5] })
      : null;
    // 섹션 전체(화면 2.6개 높이)가 아니라 화면에 고정된 무대를 봅니다
    const stage = ref.current?.querySelector('.intro__stage');
    if (io && stage) io.observe(stage);
    else visible = true;
    let elapsed = 0;
    let prev = 0;
    let raf = 0;
    const tick = (now: number) => {
      const dt = prev ? Math.min(100, now - prev) : 0;
      prev = now;
      if (visible && document.visibilityState === 'visible') elapsed += dt;
      const n = at.filter((ms) => elapsed >= ms).length;
      if (n) setAuto((cur) => Math.max(cur, n));
      if (n < at.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [reduced, total, run]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let wentDown = false;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / range)) : 1;
      el.style.setProperty('--p', p.toFixed(3));
      // 스크롤한 화면 수 기준 — 0.1 화면만 내려도 조리개가 열리며 문제 정의 (문제 정의 화면은 약 0.3화면 머문 뒤 다음 섹션으로)
      // 자동 진행이 끝나기 전에 내려가 버려도, 돌아오면 문제 정의가 열린 상태입니다
      const s = p * range / window.innerHeight;
      const reveal = s >= 0.1;
      setRevealByScroll(reveal);
      if (reveal) {
        setAuto(REVEAL);
        wentDown = true;
      } else if (wentDown && s < 0.05) {
        wentDown = false;
        setAuto(0);
        setRun((r) => r + 1);
      }
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
  }, [reduced, total]);

  const step = revealByScroll ? REVEAL : auto;
  const shown = reduced ? REVEAL : step;
  const revealed = !reduced && step >= REVEAL;
  const phase = reduced ? 'static'
    : step === 0 ? 'start'
    : step < total ? 'words'
    : step === total ? 'all'
    : step === total + 1 ? 'iris'
    : step === total + 2 ? 'turn' : 'reveal';

  // 밝은 문제 정의 화면이 열리면 상단 바 글자색도 다시 맞춥니다.
  useEffect(() => {
    window.dispatchEvent(new Event('scroll'));
  }, [revealed]);

  return (
    <section ref={ref} id="intro" className={`intro${reduced ? ' intro--static' : ''}`} data-step={Math.min(shown, total)} data-phase={phase} data-tone={revealed ? 'light' : 'dark'} aria-labelledby="intro-title">
      <div className="intro__stage">
        <NightScene />
        <svg className="intro__plan" viewBox="0 0 600 400" aria-hidden="true" focusable="false">
          <rect x="60" y="60" width="480" height="280" />
          <path d="M60 200 H300 V340 M300 60 V140 M420 200 H540 M300 200 H360" />
          <path d="M60 30 H540 M60 24 V36 M540 24 V36" />
          <circle cx="180" cy="130" r="26" />
          <text x="300" y="22">GUESTHOUSE — FIG. 0</text>
        </svg>

        <h2 id="intro-title" className="intro__q pre">{SITE.intro.question}</h2>
        <ol className="intro__words" aria-label={ui.home.wordsAria}>
          {SITE.intro.words.map((w, i) => (
            <li key={w} className={`intro__word w${i + 1}${i < Math.min(shown, total) ? ' is-on' : ''}`}>
              {w}
            </li>
          ))}
        </ol>

        {/* 시야가 좁아지는 조리개와 그 끝의 작은 조준선 */}
        <div className="intro__iris" aria-hidden="true" />
        <svg className="intro__reticle" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
          <circle cx="60" cy="60" r="44" />
          <path d="M60 0 V120 M0 60 H120" />
        </svg>
        <p className="intro__turn pre">{SITE.intro.turn}</p>

        <p className="intro__hint" aria-hidden="true">
          <span>SCROLL</span>
          <i />
        </p>

        {/* 조리개가 다시 열리며 밝은 화면 — 문제 정의 */}
        <span className="intro__ring" aria-hidden="true" />
        <div id="problem" className="intro__reveal">
          <Problem />
        </div>
      </div>
    </section>
  );
}

/** 흐릿한 파티 불빛과 사람들의 실루엣 — 문구가 늘어날수록 짙어집니다 */
function NightScene() {
  return (
    <div className="intro__scene" aria-hidden="true">
      <svg className="intro__bokeh" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <filter id="bokeh-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g filter="url(#bokeh-blur)">
          {BOKEH.map(([x, y, r, c, o], i) => (
            <circle key={i} className={`intro__light l${(i % 3) + 1}`} cx={x} cy={y} r={r} fill={c} opacity={o} />
          ))}
        </g>
      </svg>
      <svg className="intro__crowd" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" focusable="false">
        <g fill="#05080D" opacity=".85">
          {[[90, 250, 46], [230, 220, 52], [380, 260, 44], [520, 230, 50], [660, 255, 46], [800, 225, 52], [930, 250, 46]].map(([x, y, r]) => (
            <g key={x}>
              <circle cx={x} cy={y} r={r} />
              <rect x={x - r * 1.6} y={y + r * 0.8} width={r * 3.2} height={400} rx={r} />
            </g>
          ))}
        </g>
        <rect x="350" y="110" width="22" height="70" rx="3" fill="#6E6656" opacity=".55" />
        <rect x="560" y="100" width="22" height="70" rx="3" fill="#6E6656" opacity=".55" />
      </svg>
    </div>
  );
}

/** [x, y, 반지름, 색, 투명도] */
const BOKEH: [number, number, number, string, number][] = [
  [230, 230, 70, '#7A6A55', 0.55],
  [380, 170, 60, '#9C8C74', 0.5],
  [470, 380, 80, '#8A7A60', 0.5],
  [700, 150, 50, '#D9B1A4', 0.75],
  [780, 270, 56, '#DBA190', 0.6],
  [900, 330, 46, '#CB9382', 0.55],
  [640, 500, 70, '#7A6C5A', 0.45],
  [860, 520, 60, '#6B5E4E', 0.4],
  [130, 560, 64, '#5E5446', 0.35],
  [540, 650, 54, '#7A3B32', 0.35],
  [330, 700, 60, '#5A4A40', 0.3],
];

/* ── SECTION 02. PROBLEM — 인트로의 조리개가 열리면 보이는 문제 정의 ─────────────────────────────── */
function Problem() {
  const { site: SITE } = useContent();
  return (
    <section className="problem" aria-labelledby="problem-title">
      <div className="problem__inner wrap">
        <header className="problem__head">
          <p className="label">{SITE.problem.label}</p>
          <h2 id="problem-title" className="problem__title">
            {SITE.problem.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </header>
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
        <div className="problem__answer">
          <p className="problem__answertext pre">{SITE.problem.answer}</p>
          {SITE.problem.answerNote && <p className="problem__answernote">{SITE.problem.answerNote}</p>}
        </div>
      </div>
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
          <h2 id="find-title" className="section-head__title">
            {SITE.findYourStay.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p className="section-head__sub pre">{ui.home.findSub(QUESTIONS.length)}</p>
          <a className="btn" href={href.test()} data-track="find_cta">
            {SITE.findYourStay.cta} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── SECTION 04. CHECK OUT — 마무리: 맺음 문구 · 다시 둘러보기 ─────────────────────────────── */
function CheckOut() {
  const { site: SITE } = useContent();
  const c = SITE.checkOut;
  return (
    <section id="checkout" className="outro" data-tone="dark" aria-labelledby="checkout-title">
      <div className="outro__inner wrap">
        <header className="outro__head">
          <p className="label">{c.label}</p>
          <h2 id="checkout-title" className="outro__title">
            {c.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </header>

        <p className="outro__closing pre">{c.closing}</p>
        <a className="btn" href={href.house()} data-track="checkout_cta">
          {c.cta} <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
