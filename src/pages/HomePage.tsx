import { useEffect, useRef, useState } from 'react';
import { SITE as SITE_KO } from '../data/site';
import { QUESTIONS } from '../data/quiz';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { useReducedMotion } from '../lib/motion';
import { HousePage } from './HousePage';
import pencilUrl from '../assets/sketch-pencil.png';

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
      // 스크롤한 화면 수 기준 — 0.04 화면만 내려도 조리개가 열리며 문제 정의 (문제 정의 화면은 약 0.3화면 머문 뒤 다음 섹션으로)
      // 자동 진행이 끝나기 전에 내려가 버려도, 돌아오면 문제 정의가 열린 상태입니다
      const s = p * range / window.innerHeight;
      const reveal = s >= 0.04;
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

        <h2 id="intro-title" className="intro__q pre">{SITE.intro.question}</h2>
        <ol className="intro__words" aria-label={ui.home.wordsAria}>
          {SITE.intro.words.map((w, i) => (
            <li key={w} className={`intro__word w${i + 1}${i < Math.min(shown, total) ? ' is-on' : ''}`}>
              {w}
            </li>
          ))}
        </ol>

        {/* 시야가 좁아지는 조리개 */}
        <div className="intro__iris" aria-hidden="true" />
        <p className="intro__turn pre">{SITE.intro.turn}</p>

        <p className="intro__hint" aria-hidden="true">
          <i />
        </p>

        {/* 조리개가 다시 열리며 밝은 화면 — 문제 정의 */}
        <span className="intro__ring" aria-hidden="true" />
        <div id="problem" className="intro__reveal">
          <Problem active={revealed} />
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
/**
 * 질문 → 연필이 '가격' · '위치'를 적고 한 번에 찍찍 그음 → 두 단어는 그냥 사라짐 → 연필이 '경험'을 적음 → 질문과 함께 사라짐 → 맺음 문구
 * 동작 줄이기 설정이면 질문과 맺음 문구만 바로 보여 줍니다.
 */
function Problem({ active }: { active: boolean }) {
  const { site: SITE } = useContent();
  const reduced = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  // 경험이 사라질 때 질문 문장도 함께 사라짐 (지우개로 지우지 않고)
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    setDone(false);
    setClearing(false);
    if (reduced) {
      setDone(true);
      return;
    }
    const board = boardRef.current;
    if (!active || !board) return;
    return runSketch(board, () => setDone(true), () => setClearing(true));
  }, [active, reduced, SITE.problem.sketch]);

  const { written, then } = SITE.problem.sketch;
  return (
    <section className={`problem${done ? ' is-done' : ''}${clearing ? ' is-clearing' : ''}`} aria-labelledby="problem-title">
      <div className="problem__inner wrap">
        <header className="problem__head">
          <p className="label">{SITE.problem.label}</p>
          <h2 id="problem-title" className="problem__title">
            {SITE.problem.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
        </header>
        {/* 연필 장면 — 글자는 화면 읽기 프로그램에 읽히지 않게(맺음 문구가 같은 뜻) */}
        {!reduced && (
          <div ref={boardRef} className="sketch" aria-hidden="true">
            <div className="sketch__row">
              {written.map((w) => (
                <span key={w} className="sketch__word">{w}</span>
              ))}
            </div>
            <span className="sketch__word sketch__word--then">{then}</span>
            {/* 연필로 찍찍 긋는 줄 — 두 단어를 한 번에 */}
            <svg className="sketch__strikes" focusable="false">
              <path />
            </svg>
            <img className="sketch__pencil" src={pencilUrl} alt="" />
          </div>
        )}
        <div className="problem__answer">
          <p className="problem__answertext pre">{SITE.problem.answer}</p>
          {SITE.problem.answerNote && <p className="problem__answernote">{SITE.problem.answerNote}</p>}
        </div>
      </div>
    </section>
  );
}

/** 연필 끝(그림 왼쪽 아래)의 위치 — 그림 크기에 대한 비율 */
const PENCIL_TIP = { x: 0.017, y: 0.988 };

/**
 * 연필 장면을 시간에 맞춰 그립니다 (밀리초).
 * 글자는 연필 끝이 지나간 만큼 왼쪽부터 보이고, 그은 줄은 연필 끝을 따라 그려집니다.
 * 돌려주는 함수를 부르면 멈추고 처음 상태로 되돌립니다.
 */
function runSketch(board: HTMLElement, onDone: () => void, onClear: () => void) {
  const words = [...board.querySelectorAll<HTMLElement>('.sketch__word')];
  const [w1, w2, w3] = words;
  const pencil = board.querySelector<HTMLElement>('.sketch__pencil')!;
  const svg = board.querySelector<SVGSVGElement>('.sketch__strikes')!;
  const strikes = [...svg.querySelectorAll<SVGPathElement>('path')];

  const reset = () => {
    for (const w of words) {
      w.style.clipPath = 'inset(0 100% 0 0)';
      w.style.opacity = '1';
    }
    for (const s of strikes) s.style.opacity = '0';
    pencil.style.opacity = '0';
  };
  reset();

  const box = (el: HTMLElement) => {
    const b = board.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { l: r.left - b.left, r: r.right - b.left, t: r.top - b.top, b: r.bottom - b.top, w: r.width, h: r.height };
  };
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // 구간 [s, e] 안에서의 진행도 0~1
  const seg = (t: number, s: number, e: number) => clamp((t - s) / (e - s));

  // 시간표 — 가격 · 위치를 적고 → 찍찍 긋고 → 두 단어는 그냥 사라지고 → 경험을 적고 → 질문과 함께 사라짐
  const T = {
    pIn: [700, 1100], w1: [1100, 1900], move: [1900, 2200], w2: [2200, 3000],
    back: [3000, 3350], strike: [3350, 4450], pOut: [4450, 4850],
    gone: [4900, 5600],
    p2In: [5700, 6100], w3: [6100, 6900], p2Out: [6900, 7300], fade: [7700, 8500], end: 8800,
  } as const;

  // 찍찍 긋는 줄 — 두 단어 위를 한 번에 오가는 지그재그 (두 단어를 합친 상자 기준 비율)
  const ZIG = [[-0.04, 0.62], [1.03, 0.4], [-0.01, 0.58], [1.02, 0.36], [0.01, 0.7], [1.04, 0.5]];
  let geo: { lens: number[] } | null = null;
  const measure = () => {
    const a = box(w1), b = box(w2);
    const r = { l: a.l, t: Math.min(a.t, b.t), w: b.r - a.l, h: Math.max(a.b, b.b) - Math.min(a.t, b.t) };
    svg.setAttribute('viewBox', `0 0 ${board.clientWidth} ${board.clientHeight}`);
    const d = ZIG.map(([x, y], k) => `${k ? 'L' : 'M'}${(r.l + r.w * x).toFixed(1)} ${(r.t + r.h * y).toFixed(1)}`).join(' ');
    const p = strikes[0];
    p.setAttribute('d', d);
    p.style.strokeWidth = String(Math.max(3, r.h * 0.07));
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
    geo = { lens: [len] };
  };

  let raf = 0;
  let start = 0;
  let finished = false;
  let cleared = false;
  const frame = (now: number) => {
    if (!start) start = now;
    const t = now - start;
    const bw = board.clientWidth;
    const bh = board.clientHeight;
    const a = box(w1), b = box(w2), c = box(w3);
    // 글자 아랫선 근처 — 연필 끝이 닿는 높이
    const line = (r: typeof a) => r.t + r.h * 0.72;
    const ph = pencil.offsetHeight, pw = pencil.offsetWidth;
    const wiggle = (p: number) => Math.sin(p * Math.PI * 7) * ph * 0.035;
    const placePencil = (x: number, y: number, o: number) => {
      pencil.style.transform = `translate(${x - pw * PENCIL_TIP.x}px, ${y - ph * PENCIL_TIP.y}px)`;
      pencil.style.opacity = String(o);
    };
    const off = { x: bw * 0.92, y: bh * 1.15 };
    // 긋는 줄 위의 한 점 (줄의 시작 · 진행)
    const strikeAt = (i: number, p: number) => {
      const path = strikes[i];
      const pt = path.getPointAtLength(geo!.lens[i] * p);
      return { x: pt.x, y: pt.y };
    };
    const drawStrike = (i: number, p: number) => {
      strikes[i].style.opacity = '1';
      strikes[i].style.strokeDashoffset = String(geo!.lens[i] * (1 - p));
      const pt = strikeAt(i, p);
      placePencil(pt.x, pt.y, 1);
    };

    if (t < T.pOut[1]) {
      // 1) 연필 — 가격 · 위치를 적고, 찍찍 그음
      if (t < T.w1[0]) {
        const p = ease(seg(t, T.pIn[0], T.pIn[1]));
        placePencil(lerp(off.x, a.l, p), lerp(off.y, line(a), p), p);
      } else if (t < T.move[0]) {
        const p = seg(t, T.w1[0], T.w1[1]);
        placePencil(lerp(a.l, a.r, p), line(a) + wiggle(p), 1);
        w1.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      } else if (t < T.w2[0]) {
        w1.style.clipPath = 'inset(0 0 0 0)';
        const p = ease(seg(t, T.move[0], T.move[1]));
        placePencil(lerp(a.r, b.l, p), lerp(line(a), line(b), p) - Math.sin(p * Math.PI) * ph * 0.25, 1);
      } else if (t < T.back[0]) {
        const p = seg(t, T.w2[0], T.w2[1]);
        placePencil(lerp(b.l, b.r, p), line(b) + wiggle(p), 1);
        w2.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      } else {
        w2.style.clipPath = 'inset(0 0 0 0)';
        if (!geo) measure();
        if (t < T.strike[0]) {
          const p = ease(seg(t, T.back[0], T.back[1]));
          const s = strikeAt(0, 0);
          placePencil(lerp(b.r, s.x, p), lerp(line(b), s.y, p) - Math.sin(p * Math.PI) * ph * 0.3, 1);
        } else if (t < T.pOut[0]) {
          drawStrike(0, seg(t, T.strike[0], T.strike[1]));
        } else {
          strikes[0].style.strokeDashoffset = '0';
          const p = ease(seg(t, T.pOut[0], T.pOut[1]));
          const e = strikeAt(0, 1);
          placePencil(lerp(e.x, off.x, p), lerp(e.y, -ph * 0.2, p), 1 - p);
        }
      }
    } else if (t < T.p2In[0]) {
      // 2) 그은 두 단어는 그냥 사라짐
      pencil.style.opacity = '0';
      const o = String(1 - ease(seg(t, T.gone[0], T.gone[1])));
      for (const el of [w1, w2, ...strikes]) el.style.opacity = o;
    } else {
      for (const el of [w1, w2, ...strikes]) el.style.opacity = '0';
      // 3) 연필 — 경험, 그리고 질문과 함께 저절로 사라짐
      if (t < T.w3[0]) {
        const p = ease(seg(t, T.p2In[0], T.p2In[1]));
        placePencil(lerp(off.x, c.l, p), lerp(off.y, line(c), p), p);
      } else if (t < T.p2Out[0]) {
        const p = seg(t, T.w3[0], T.w3[1]);
        placePencil(lerp(c.l, c.r, p), line(c) + wiggle(p), 1);
        w3.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      } else {
        w3.style.clipPath = 'inset(0 0 0 0)';
        const p = ease(seg(t, T.p2Out[0], T.p2Out[1]));
        placePencil(lerp(c.r, off.x, p), lerp(line(c), -ph * 0.2, p), 1 - p);
        w3.style.opacity = String(1 - seg(t, T.fade[0], T.fade[1]));
      }
    }

    if (t >= T.fade[0] && !cleared) {
      cleared = true;
      onClear();
    }
    if (t >= T.end && !finished) {
      finished = true;
      onDone();
    }
    if (t < T.end) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    reset();
  };
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
