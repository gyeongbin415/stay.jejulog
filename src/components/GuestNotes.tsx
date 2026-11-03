import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { track } from '../lib/track';
import { GUESTBOOK_URL, MAX_ANSWER, MAX_NAME, fetchBoard, loadMine, postNote, type GuestBoard, type GuestNote } from '../data/guestbook';
import logoUrl from '../assets/logo-staylog.png';
import '../styles/guest.css';

/* ------------------------------------------------------------------
   방명록(GUEST NOTE) — 메인 취향 지도와 MORE STORIES(인스타그램) 사이
   · 입구 — 살짝 기운 공책 한 장에 여행자들의 답이 색 형광펜 줄로 흐릿하게 칠해져 있고, 아래 '나의 제주 노트 쓰기 · N명이 먼저 썼어요'
   · 누르면 화면 가득 — 공책 표지(끌어서 돌려 보거나 눌러서 펼치기) → 짧은 도입 문장
     → 줄 노트 카드에 질문 3개를 하나씩 → 아래 칸에 다른 사람 답
------------------------------------------------------------------- */

const QUESTIONS = 3;

/** 공책 줄 색 — 형광펜처럼 (웹진 색 · 프로그램 색 계열) */
const STRIP_COLORS = ['#E8823A', '#3F8A5C', '#3D7BB8', '#D2553F', '#E07AA0', '#E2A93B'];
/** 공책 한 장에 칠하는 줄 수 (세 단) */
const PAGE_LINES = 30;

type Answer = { text: string; name: string };

/** 노트들에서 질문 하나(q)의 답만 — q 를 안 주면 모든 질문의 답을 번갈아 */
function answersOf(notes: GuestNote[], anon: string, q?: number): Answer[] {
  const pick = (n: GuestNote, i: number) => ({ text: (n.a[i] ?? '').trim(), name: n.name?.trim() || anon });
  if (q != null) return notes.map((n) => pick(n, q)).filter((a) => a.text);
  // 한 사람 답이 몰리지 않게 — 첫 바퀴에 노트마다 답 하나씩(질문은 번갈아), 다음 바퀴에 그다음 답
  const out: Answer[] = [];
  for (let j = 0; j < QUESTIONS; j++) notes.forEach((n, k) => out.push(pick(n, (k + j) % QUESTIONS)));
  return out.filter((a) => a.text);
}

export function GuestNotes() {
  const { ui } = useContent();
  const t = ui.guest;
  const [board, setBoard] = useState<GuestBoard | null>(null);
  const [mine, setMine] = useState<GuestNote[]>(loadMine);
  const [open, setOpen] = useState(false);

  const reload = () => {
    fetchBoard().then((b) => b && setBoard(b));
  };
  useEffect(reload, []);

  // 시트에서 읽어 온 노트 + 아직 시트 목록에 안 보이는 내 노트(방금 남긴 것)를 맨 앞에
  const same = (n: GuestNote) => `${n.name}|${n.a.join('|')}`;
  const notes = useMemo(() => {
    const server = board?.notes ?? [];
    const seen = new Set(server.map(same));
    return [...mine.filter((n) => !seen.has(same(n))).reverse(), ...server];
  }, [board, mine]);
  const unsynced = notes.length - (board?.notes.length ?? 0);
  const count = GUESTBOOK_URL ? (board?.count ?? 0) + unsynced : 0;

  const strips = useMemo(() => answersOf(notes, t.anon).slice(0, PAGE_LINES), [notes, t.anon]);

  return (
    <section id="guest" className="gnote" data-tone="light" aria-labelledby="guest-title">
      <div className="gnote__inner wrap">
        <p className="label">GUEST NOTE</p>
        <h2 id="guest-title" className="visually-hidden">{t.title}</h2>
        <button type="button" className="gnote__entry" onClick={() => setOpen(true)} data-track="guest_open">
          <NotePage answers={strips} />
          <span className="gnote__entry-title">{t.open}</span>
          <span className="gnote__entry-count">{count > 0 ? t.count(count) : t.first}</span>
        </button>
        {!GUESTBOOK_URL && mine.length > 0 && <p className="gnote__local">{t.localOnly}</p>}
      </div>
      {/* 페이지 등장 애니메이션(transform) 안에 두면 화면이 아니라 페이지에 붙으므로 body 에 바로 그림 */}
      {open &&
        createPortal(
          <GuestWriter
            notes={notes}
            onClose={() => setOpen(false)}
            onSent={() => {
              setMine(loadMine());
              reload();
            }}
          />,
          document.body,
        )}
    </section>
  );
}

/**
 * 공책 한 장 — 여행자들의 답 하나가 형광펜 줄 하나. 글씨는 흐릿하게 비쳐 보이기만 (읽는 건 쓰기 화면의 'N명 답 보기')
 * 아직 답이 없으면 빈 줄 노트
 */
function NotePage({ answers }: { answers: Answer[] }) {
  return (
    // 기울기는 바깥 칸에 — 종이에 기울기(transform)를 주면 뒤 그림자가 종이 앞으로 올라옴
    <span className="gpage-wrap" aria-hidden="true">
      <span className="gpage__shadow" />
      <span className="gpage">
      <span className="gpage__head">GUEST NOTE</span>
      <span className="gpage__cols">
        {answers.length
          ? answers.map((a, i) => (
              <span
                key={i}
                className="gpage__strip"
                style={{ '--c': STRIP_COLORS[(i * 5 + a.text.length) % STRIP_COLORS.length], '--w': `${62 + ((a.text.length * 7 + i * 13) % 38)}%`, '--r': `${((i * 37) % 7) - 3}deg` } as CSSProperties}
              >
                <span className="gpage__ink">{a.text}</span>
              </span>
            ))
          : Array.from({ length: PAGE_LINES }, (_, i) => <span key={i} className="gpage__line" />)}
      </span>
      <span className="gpage__foot">STAY JEJULOG</span>
      </span>
    </span>
  );
}

/** 공책 표지 — 끌어서 돌려 보거나 눌러서 펼치기 */
function NoteCover({ onOpen }: { onOpen: () => void }) {
  const { ui } = useContent();
  const t = ui.guest;
  const reduced = useReducedMotion();
  const [turn, setTurn] = useState(0);
  const [opening, setOpening] = useState(false);
  const drag = useRef<{ x: number; turn: number; moved: boolean } | null>(null);

  const open = () => {
    if (opening) return;
    if (reduced) return onOpen();
    setOpening(true);
    window.setTimeout(onOpen, 850);
  };

  return (
    <div className="gcover-wrap">
      <button
        type="button"
        className={`gcover${opening ? ' is-opening' : ''}`}
        style={{ '--turn': `${turn}deg` } as CSSProperties}
        aria-label={`${t.coverAria} — ${t.coverHint}`}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, turn, moved: false };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          setTurn(Math.max(-38, Math.min(38, d.turn + dx * 0.25)));
        }}
        onPointerUp={() => {
          const d = drag.current;
          drag.current = null;
          if (d && !d.moved) open();
        }}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
      >
        <span className="gcover__back" />
        <span className="gcover__page" />
        <span className="gcover__face">
          <span className="gcover__hand">MY JEJU NOTE</span>
          <span className="gcover__window">
            <img src={logoUrl} alt="" draggable={false} />
          </span>
          <span className="gcover__mark">STAY JEJULOG</span>
        </span>
      </button>
      <p className="gcover__hint">{t.coverHint}</p>
    </div>
  );
}

/** 화면 가득 — 공책 표지 → 도입 문장 → 질문 카드 3장 → 다 썼어요 */
function GuestWriter({ notes, onClose, onSent }: { notes: GuestNote[]; onClose: () => void; onSent: () => void }) {
  const { ui, lang } = useContent();
  const t = ui.guest;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'cover' | 'intro' | 'write' | 'done'>('cover');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => Array(QUESTIONS).fill(''));
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // 도입 문장 두 줄을 읽을 시간 — 누르면 바로 넘어감
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = window.setTimeout(() => setPhase('write'), 3000);
    return () => window.clearTimeout(id);
  }, [phase]);

  // 열려 있는 동안 뒤 페이지는 멈추고, Esc 로 닫기
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (phase === 'write') areaRef.current?.focus({ preventScroll: true });
    setShowAll(false);
  }, [phase, step]);

  const list = useMemo(() => answersOf(notes, t.anon, step), [notes, t.anon, step]);
  // 아래 칸에 보여 줄 다른 사람 답 하나 — 질문마다 하나씩 골라 둠
  const peek = useMemo(() => (list.length ? list[Math.floor(Math.random() * list.length)] : null), [list]);

  const setAnswer = (v: string) => setAnswers((a) => a.map((x, i) => (i === step ? v : x)));
  const last = step === QUESTIONS - 1;

  const submit = async () => {
    const a = answers.map((x) => x.trim());
    if (!a.some(Boolean)) {
      setError(t.needOne);
      return;
    }
    setSending(true);
    setError('');
    const ok = await postNote({ name: name.trim(), a }, lang);
    setSending(false);
    if (!ok) {
      setError(t.failed);
      return;
    }
    track('guest_submit', { answered: a.filter(Boolean).length });
    onSent();
    setPhase('done');
  };

  return (
    <div className={`gwrite gwrite--${phase}`} role="dialog" aria-modal="true" aria-label={t.open} ref={ref} tabIndex={-1}>
      <header className="gwrite__top">
        <p className="gwrite__brand">GUEST NOTE</p>
        {phase === 'write' && (
          <ol className="gwrite__bar" aria-hidden="true">
            {Array.from({ length: QUESTIONS }, (_, i) => (
              <li key={i} className={i <= step ? 'is-on' : undefined} />
            ))}
          </ol>
        )}
        <button type="button" className="gwrite__close" onClick={onClose} data-track="guest_close">
          <span aria-hidden="true">×</span>
          <span className="visually-hidden">{t.close}</span>
        </button>
      </header>

      {phase === 'cover' && <NoteCover onOpen={() => setPhase(reduced ? 'write' : 'intro')} />}

      {phase === 'intro' && (
        <button type="button" className="gwrite__intro" onClick={() => setPhase('write')}>
          {t.intro.map((l, i) => (
            <span key={l} style={{ '--i': i } as CSSProperties}>{l}</span>
          ))}
        </button>
      )}

      {phase === 'write' && (
        <>
          <div className="gwrite__body wrap">
            <p className="gwrite__hand" aria-hidden="true">MY JEJU NOTE</p>
            <div className="gwrite__card" key={step}>
              <p className="gwrite__no">{t.progress(step + 1, QUESTIONS)}</p>
              <label className="gwrite__q" htmlFor="gwrite-answer">{t.questions[step]}</label>
              <textarea
                id="gwrite-answer"
                ref={areaRef}
                className="gwrite__a"
                rows={3}
                maxLength={MAX_ANSWER}
                placeholder={t.placeholder}
                value={answers[step]}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <p className="gwrite__len" aria-hidden="true">{answers[step].length} / {MAX_ANSWER}</p>
              {last && (
                <label className="gwrite__name">
                  <span>{t.nameLabel}</span>
                  <input maxLength={MAX_NAME} placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
                </label>
              )}
            </div>
            <nav className="gwrite__nav">
              <button type="button" className="gwrite__step" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                <span aria-hidden="true">‹ </span>{t.prev}
              </button>
              {last ? (
                <button type="button" className="btn gwrite__submit" onClick={submit} disabled={sending} data-track="guest_submit_btn">
                  {sending ? t.sending : t.submit}
                </button>
              ) : (
                <button type="button" className="gwrite__step" onClick={() => setStep((s) => s + 1)}>
                  {answers[step].trim() ? t.next : t.skip}<span aria-hidden="true"> ›</span>
                </button>
              )}
            </nav>
            {error && <p className="gwrite__error" role="alert">{error}</p>}
          </div>

          {/* 다른 사람의 답 — 하나 살짝 보이고, 누르면 이 질문의 답 전부 */}
          <aside className={`gwrite__sheet${showAll ? ' is-open' : ''}`}>
            <button type="button" className="gwrite__sheet-head" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll} disabled={!list.length}>
              <span className="gwrite__grip" aria-hidden="true" />
              {peek ? (
                <span className="gwrite__peek">
                  <q>{peek.text}</q>
                  <small>{t.otherBy(peek.name)}</small>
                </span>
              ) : (
                <span className="gwrite__peek gwrite__peek--empty">{t.emptyAnswers}</span>
              )}
              {list.length > 0 && <span className="gwrite__all-btn">{showAll ? t.hideAll : t.seeAll(list.length)}</span>}
            </button>
            {showAll && (
              <ul className="gwrite__all">
                {list.map((a, i) => (
                  <li key={i}>
                    <q>{a.text}</q>
                    <small>{t.otherBy(a.name)}</small>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </>
      )}

      {phase === 'done' && (
        <div className="gwrite__body wrap">
          <div className="gwrite__card gwrite__card--done">
            <p className="gwrite__no">{name.trim() || t.anon}</p>
            <h3 className="gwrite__done-title">{t.doneTitle}</h3>
            <ul className="gwrite__mine">
              {answers.map((a, i) =>
                a.trim() ? (
                  <li key={i}>
                    <small>{t.questions[i]}</small>
                    <span>{a.trim()}</span>
                  </li>
                ) : null,
              )}
            </ul>
            <p className="gwrite__done-sub">{t.doneSub}</p>
          </div>
          <button type="button" className="btn gwrite__submit" onClick={onClose}>{t.doneClose}</button>
        </div>
      )}
    </div>
  );
}
