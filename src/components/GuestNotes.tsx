import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { absUrl, href } from '../lib/router';
import { track } from '../lib/track';
import { GUESTBOOK_URL, MAX_ANSWER, MAX_FREE, MAX_NAME, fetchBoard, loadMine, postNote, type GuestBoard, type GuestNote } from '../data/guestbook';
import noteUrl from '../assets/guest-note.png';
import '../styles/guest.css';

/* ------------------------------------------------------------------
   방명록(GUEST NOTE)
   · 방명록 페이지(#/guest) — 표지 없이 들어오자마자 질문 고르기
     → 마음에 드는 질문만 골라 줄 노트 카드에 적기 → 아래 칸에 다른 사람 답 → 이름과 함께 남기기
   · 메인 칸(page 아님) — 받은 공책 그림(끌어서 돌려 보거나 누르면 방명록 페이지로) · '돌려 보거나, 눌러서 펼치기' 안내 상자
------------------------------------------------------------------- */

const QUESTIONS = 5;
/** 자유 노트 칸 — 답 배열에서 질문 다음 · 전체 칸 수 */
const FREE = QUESTIONS;
const SLOTS = QUESTIONS + 1;

type Answer = { text: string; name: string };

/** 노트들에서 질문 하나(q)의 답만 — q 를 안 주면 모든 질문의 답을 번갈아 */
function answersOf(notes: GuestNote[], anon: string, q?: number): Answer[] {
  const pick = (n: GuestNote, i: number) => ({ text: (n.a[i] ?? '').trim(), name: n.name?.trim() || anon });
  if (q != null) return notes.map((n) => pick(n, q)).filter((a) => a.text);
  // 한 사람 답이 몰리지 않게 — 첫 바퀴에 노트마다 답 하나씩(질문은 번갈아), 다음 바퀴에 그다음 답
  const out: Answer[] = [];
  for (let j = 0; j < SLOTS; j++) notes.forEach((n, k) => out.push(pick(n, (k + j) % SLOTS)));
  return out.filter((a) => a.text);
}

/**
 * 첫 화면 아래 — 사람들이 남긴 답을 한 장씩 바꿔 가며 (질문 · 답 · 이름 · 같은 질문에 답한 다른 사람 수)
 * 한 사람 답이 몰리지 않게 노트마다 번갈아, 3.6초마다 다음 답 (동작 줄이기 설정이면 바뀌기만 하고 흐려지지 않음)
 */
function AnswerTicker({ notes }: { notes: GuestNote[] }) {
  const { ui } = useContent();
  const t = ui.guest;
  const items = useMemo(() => {
    const per = Array<number>(SLOTS).fill(0);
    notes.forEach((n) => n.a.forEach((x, i) => x?.trim() && i < SLOTS && per[i]++));
    const out: { q: number; text: string; name: string; others: number }[] = [];
    for (let j = 0; j < SLOTS; j++)
      notes.forEach((n, k) => {
        const q = (k + j) % SLOTS;
        const text = (n.a[q] ?? '').trim();
        if (text) out.push({ q, text, name: n.name?.trim() || t.anon, others: per[q] - 1 });
      });
    return out;
  }, [notes, t.anon]);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % items.length), 3600);
    return () => window.clearInterval(id);
  }, [items.length]);
  // 아직 남긴 답이 없으면 카드 없이
  if (!items.length) return null;
  const it = items[i % items.length];
  return (
    <div className="gticker" aria-live="polite">
      <div className="gticker__item" key={i}>
        <p className="gticker__q">{it.q === FREE ? t.freeLabel : `Q${it.q + 1}. ${t.questions[it.q]}`}</p>
        <p className="gticker__a">{it.text}</p>
        <p className="gticker__by">
          <b>{it.name}</b>
          {it.others > 0 && <span> · {t.tickerMore(it.others)}</span>}
        </p>
      </div>
    </div>
  );
}

/** page — 따로 된 방명록 페이지(#/guest · 휴대폰 넘겨보기 네 번째 칸) */
export function GuestNotes({ page = false }: { page?: boolean }) {
  const { ui } = useContent();
  const t = ui.guest;
  const [board, setBoard] = useState<GuestBoard | null>(null);
  const [mine, setMine] = useState<GuestNote[]>(loadMine);

  const reload = () => {
    fetchBoard().then((b) => b && setBoard(b));
  };
  useEffect(reload, []);

  // 시트에서 읽어 온 노트 + 아직 시트 목록에 안 보이는 내 노트(방금 남긴 것)를 맨 앞에
  // 시트를 읽어 왔으면 내 노트는 방금(2분 안) 남긴 것만 — 시트에서 숨기거나 지운 노트는 내 기기에서도 사라지게
  const same = (n: GuestNote) => `${n.name}|${n.a.join('|')}`;
  const notes = useMemo(() => {
    const server = board?.notes ?? [];
    const seen = new Set(server.map(same));
    const recent = board ? mine.filter((n) => Date.now() - (n.t ?? 0) < 120000) : mine;
    return [...recent.filter((n) => !seen.has(same(n))).reverse(), ...server];
  }, [board, mine]);
  const unsynced = notes.length - (board?.notes.length ?? 0);
  const count = GUESTBOOK_URL ? (board?.count ?? 0) + unsynced : 0;

  // 방명록 페이지 — 표지 없이 바로 쓰기 화면
  if (page)
    return (
      <section id="guest" className="gnote gnote--page" data-tone="light" aria-label={t.title}>
        <GuestWriter
          inline
          notes={notes}
          onClose={() => {}}
          onSent={() => {
            setMine(loadMine());
            reload();
          }}
        />
      </section>
    );

  return (
    <section id="guest" className="gnote" data-tone="light" aria-labelledby="guest-title">
      <div className="gnote__inner wrap">
        <p className="label">GUEST NOTE</p>
        <h2 id="guest-title" className="visually-hidden">{t.title}</h2>
        {/* 받은 공책 그림 — 끌어서 돌려 보거나 누르면 방명록 페이지로, 밑에 안내 상자 */}
        <NoteArt />
        {count > 0 && <p className="gnote__entry-count">{t.count(count)}</p>}
        {!GUESTBOOK_URL && mine.length > 0 && <p className="gnote__local">{t.localOnly}</p>}
      </div>
    </section>
  );
}

/** 메인 공책 그림 — 끌어서 돌려 보거나 눌러서 방명록 페이지로 (밑에 같은 안내 상자) */
function NoteArt() {
  const { ui } = useContent();
  const t = ui.guest;
  const [turn, setTurn] = useState(0);
  const drag = useRef<{ x: number; turn: number; moved: boolean } | null>(null);
  const go = () => window.location.assign(absUrl(href.guest()));
  return (
    <div className="gnote__artwrap">
      <button
        type="button"
        className="gnote__art"
        data-noswipe
        data-track="guest_open"
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
          if (d && !d.moved) go();
        }}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), go())}
      >
        <img src={noteUrl} alt="" width={900} height={708} loading="lazy" decoding="async" draggable={false} />
      </button>
      {/* 집 · 테스트 · 지도 칸과 같은 흰 테두리 버튼 — 질문 문구 */}
      <a className="roomtour__btn find__cta" href={href.guest()} data-track="guest_cta">
        <span>{t.coverHint}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6.5 18.5 12 13 17.5" /></svg>
      </a>
    </div>
  );
}

/**
 * 쓰던 답 · 이름 — 다른 화면에 다녀오거나 새로고침 · 창을 닫았다 다시 와도 그대로 (이 브라우저에 저장, 남기고 나면 비움)
 */
const DRAFT_KEY = 'jejulog-guest-draft';
const emptyDraft = () => ({ answers: Array<string>(SLOTS).fill(''), name: '' });
const draft = (() => {
  try {
    const v = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (v && Array.isArray(v.answers)) return { answers: Array.from({ length: SLOTS }, (_, i) => String(v.answers[i] ?? '')), name: String(v.name ?? '') };
  } catch {
    /* 저장소를 못 읽으면 빈 노트로 */
  }
  return emptyDraft();
})();
const saveDraft = () => {
  try {
    if (draft.answers.some((a) => a.trim()) || draft.name.trim()) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* 저장 못 해도 쓰기는 그대로 */
  }
};

/** 처음(자유롭게 적기 · 질문 골라 답하기) ⇄ 질문 목록 ⇄ 줄 노트 카드 → 다 썼어요 · inline — 방명록 페이지 안에 바로(창 · 도입 문장 · 닫기 없이) */
function GuestWriter({ notes, onClose, onSent, inline = false }: { notes: GuestNote[]; onClose: () => void; onSent: () => void; inline?: boolean }) {
  const { ui, lang } = useContent();
  const t = ui.guest;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'intro' | 'pick' | 'list' | 'write' | 'done'>(reduced || inline ? 'pick' : 'intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => [...draft.answers]);
  const [name, setName] = useState(draft.name);
  useEffect(() => {
    draft.answers = [...answers];
    draft.name = name;
    saveDraft();
  }, [answers, name]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showAll, setShowAll] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // 도입 문장 두 줄을 읽을 시간 — 누르면 바로 넘어감
  useEffect(() => {
    if (phase !== 'intro') return;
    const id = window.setTimeout(() => setPhase('pick'), 3000);
    return () => window.clearTimeout(id);
  }, [phase]);

  // 창으로 열려 있는 동안 뒤 페이지는 멈추고, Esc 로 닫기
  useEffect(() => {
    if (inline) return;
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
  }, [onClose, inline]);

  useEffect(() => {
    // 답 칸에 바로 커서 — 마우스로 쓰는 PC 만 (휴대폰은 칸을 눌렀을 때만 자판이 뜨게)
    if (phase === 'write' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) areaRef.current?.focus({ preventScroll: true });
    setShowAll(false);
  }, [phase, step]);

  const list = useMemo(() => answersOf(notes, t.anon, step), [notes, t.anon, step]);
  // 아래 칸에 보여 줄 다른 사람 답 하나 — 질문마다 하나씩 골라 둠

  const setAnswer = (v: string) => setAnswers((a) => a.map((x, i) => (i === step ? v : x)));
  const answered = answers.map((a) => !!a.trim());
  const qCount = answered.slice(0, QUESTIONS).filter(Boolean).length;
  /** 칸 이름 — 질문 또는 '자유롭게 남긴 말' */
  const labelOf = (i: number) => (i === FREE ? t.freeLabel : t.questions[i]);
  /** 카드에서 돌아갈 곳 — 자유 노트는 처음 화면, 질문은 질문 목록 */
  const back = () => setPhase(step === FREE ? 'pick' : 'list');
  // 왼쪽 아래 뒤로 가기 동그라미(BackFab 의 'jl:back') — 방명록 안에서는 바로 전 화면으로 (질문 목록 → 처음, 카드 → 목록 · 처음)
  useEffect(() => {
    if (!inline) return;
    const onBack = (e: Event) => {
      if (phase === 'list') setPhase('pick');
      else if (phase === 'write') back();
      else return;
      e.preventDefault();
    };
    window.addEventListener('jl:back', onBack);
    return () => window.removeEventListener('jl:back', onBack);
  });

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
    Object.assign(draft, emptyDraft());
    saveDraft();
    onSent();
    setPhase('done');
  };
  /** 카드의 '다 적었어요' — 이 칸 답을 바로 남기고, 카드를 '다른 사람들'(방금 남긴 답 포함)로. 빈 칸이면 돌아가기 */
  const sendOne = async () => {
    const text = answers[step].trim();
    if (!text) return back();
    setSending(true);
    setError('');
    const a = Array<string>(SLOTS).fill('');
    a[step] = text;
    const ok = await postNote({ name: name.trim(), a }, lang);
    setSending(false);
    if (!ok) {
      setError(t.failed);
      return;
    }
    track('guest_submit', { answered: 1 });
    setAnswer('');
    onSent();
    setShowAll(true);
  };
  /** 다 쓴 뒤 — 창은 닫고, 방명록 페이지에서는 새 노트 쓰기로 */
  const finish = () => {
    if (!inline) return onClose();
    setAnswers(Array<string>(SLOTS).fill(''));
    setName('');
    setPhase('pick');
  };

  return (
    <div className={`gwrite gwrite--${phase}${inline ? ' gwrite--inline' : ''}`} role={inline ? undefined : 'dialog'} aria-modal={inline ? undefined : true} aria-label={t.open} ref={ref} tabIndex={-1}>
      {/* 답 쓰는 카드에서는 위쪽 줄을 빼고 카드를 위로 */}
      {(phase !== 'write' || !inline) && (
      <header className="gwrite__top">
        {phase !== 'write' && <p className="gwrite__brand">GUEST NOTE</p>}
        {!inline && (
          <button type="button" className="gwrite__close" onClick={onClose} data-track="guest_close">
            <span aria-hidden="true">×</span>
            <span className="visually-hidden">{t.close}</span>
          </button>
        )}
      </header>
      )}

      {phase === 'intro' && (
        <button type="button" className="gwrite__intro" onClick={() => setPhase('pick')}>
          {t.intro.map((l, i) => (
            <span key={l} style={{ '--i': i } as CSSProperties}>{l}</span>
          ))}
        </button>
      )}

      {/* 처음 — 자유롭게 적기 · 질문 골라 답하기 두 버튼, 하나 이상 적으면 이름과 함께 남기기 */}
      {phase === 'pick' && (
        <div className="gwrite__body wrap">
          <p className="gwrite__hand" aria-hidden="true">MY JEJU NOTE</p>
          <h2 className="gwrite__pick-title">{t.modeTitle}</h2>
          <p className="gwrite__pick-sub pre">{t.modeSub}</p>
          <ul className="gwrite__picks">
            {/* 질문 골라 답하기 먼저, 자유롭게 적기는 아래 */}
            <li>
              <button type="button" className={`gwrite__pick gwrite__pick--mode${qCount ? ' is-done' : ''}`} onClick={() => setPhase('list')} data-track="guest_mode_questions">
                <span className="gwrite__pick-no" aria-hidden="true">Q</span>
                <span className="gwrite__pick-q">{t.questionsBtn}</span>
                <span className="gwrite__pick-state">{qCount ? t.questionsDone(qCount, QUESTIONS) : t.questionsHint(QUESTIONS)}</span>
                <span className="gwrite__pick-go" aria-hidden="true">›</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`gwrite__pick gwrite__pick--mode${answered[FREE] ? ' is-done' : ''}`}
                onClick={() => {
                  setStep(FREE);
                  setPhase('write');
                }}
                data-track="guest_mode_free"
              >
                <span className="gwrite__pick-no" aria-hidden="true">✎</span>
                <span className="gwrite__pick-q">{t.freeBtn}</span>
                <span className="gwrite__pick-state">{answered[FREE] ? answers[FREE].trim() : t.freeHint}</span>
                <span className="gwrite__pick-go" aria-hidden="true">{answered[FREE] ? '✓' : '›'}</span>
              </button>
            </li>
          </ul>
          {/* 사람들이 남긴 답 — 한 장씩 바뀌며 */}
          <AnswerTicker notes={notes} />
          {answered.some(Boolean) && (
            <div className="gwrite__send">
              <label className="gwrite__name">
                <span>{t.nameLabel}</span>
                <input maxLength={MAX_NAME} placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <button type="button" className="btn gwrite__submit" onClick={submit} disabled={sending} data-track="guest_submit_btn">
                {sending ? t.sending : t.submit}
              </button>
            </div>
          )}
          {error && <p className="gwrite__error" role="alert">{error}</p>}
        </div>
      )}

      {/* 질문 목록 — 마음에 드는 질문만 골라 적기 */}
      {phase === 'list' && (
        <div className="gwrite__body wrap">
          <p className="gwrite__hand" aria-hidden="true">MY JEJU NOTE</p>
          <h2 className="gwrite__pick-title">{t.pickTitle}</h2>
          <p className="gwrite__pick-sub pre">{t.pickSub}</p>
          <ul className="gwrite__picks">
            {t.questions.map((q, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`gwrite__pick${answered[i] ? ' is-done' : ''}`}
                  onClick={() => {
                    setStep(i);
                    setPhase('write');
                  }}
                  data-track={`guest_pick_q${i + 1}`}
                >
                  <span className="gwrite__pick-no">Q{i + 1}</span>
                  <span className="gwrite__pick-q">{q}</span>
                  {/* 답을 쓴 질문만 그 답 한 줄 */}
                  {answered[i] && <span className="gwrite__pick-state">{answers[i].trim()}</span>}
                  <span className="gwrite__pick-go" aria-hidden="true">{answered[i] ? '✓' : '›'}</span>
                </button>
              </li>
            ))}
          </ul>
          {answered.some(Boolean) && (
            <div className="gwrite__send">
              <label className="gwrite__name">
                <span>{t.nameLabel}</span>
                <input maxLength={MAX_NAME} placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <button type="button" className="btn gwrite__submit" onClick={submit} disabled={sending} data-track="guest_submit_btn">
                {sending ? t.sending : t.submit}
              </button>
            </div>
          )}
          {error && <p className="gwrite__error" role="alert">{error}</p>}
        </div>
      )}

      {phase === 'write' && (
        <>
          <div className="gwrite__body wrap">
            <div className="gwrite__headrow">
              <p className="gwrite__hand" aria-hidden="true">MY JEJU NOTE</p>
              {/* 나의 답 ⇄ 다른 사람들의 답 (그 질문에 남긴 답 수) */}
              <div className="gwrite__tabs" role="tablist">
                <button type="button" role="tab" className="gwrite__tab" aria-selected={!showAll} onClick={() => setShowAll(false)} data-track="guest_tab_mine">
                  {t.myTab}
                </button>
                <button type="button" role="tab" className="gwrite__tab" aria-selected={showAll} onClick={() => setShowAll(true)} data-track="guest_tab_others">
                  {t.othersTab} <span className="gwrite__tab-n">{list.length.toLocaleString()}</span>
                </button>
              </div>
            </div>
            <div className="gwrite__card" key={step}>
              <p className="gwrite__no">{step === FREE ? 'FREE NOTE' : `Q${step + 1}`}</p>
              <label className="gwrite__q" htmlFor="gwrite-answer">{step === FREE ? t.freeBtn : t.questions[step]}</label>
              {showAll ? (
                list.length ? (
                  <ul className="gwrite__others">
                    {list.map((a, i) => (
                      <li key={i}>
                        <q>{a.text}</q>
                        <small>{t.otherBy(a.name)}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="gwrite__others-empty">{t.emptyAnswers}</p>
                )
              ) : (
              <>
              <textarea
                id="gwrite-answer"
                ref={areaRef}
                className="gwrite__a"
                rows={4}
                maxLength={step === FREE ? MAX_FREE : MAX_ANSWER}
                placeholder={step === FREE ? t.freePlaceholder : `${t.exampleLabel}${t.examples[step]}`}
                value={answers[step]}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <p className="gwrite__len" aria-hidden="true">{answers[step].length} / {step === FREE ? MAX_FREE : MAX_ANSWER}</p>
              </>
              )}
            </div>
            <nav className="gwrite__nav">
              <button type="button" className="btn gwrite__submit" onClick={back}>
                {step === FREE ? t.toModes : t.toList}
              </button>
              <button type="button" className="btn gwrite__submit" onClick={sendOne} disabled={sending} data-track={step === FREE ? 'guest_done_free' : `guest_done_q${step + 1}`}>
                {sending ? t.sending : t.doneAnswer}
              </button>
            </nav>
            {error && <p className="gwrite__error" role="alert">{error}</p>}
          </div>

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
                    <small>{labelOf(i)}</small>
                    <span>{a.trim()}</span>
                  </li>
                ) : null,
              )}
            </ul>
            <p className="gwrite__done-sub">{t.doneSub}</p>
          </div>
          <button type="button" className="btn gwrite__submit" onClick={finish}>{inline ? t.open : t.doneClose}</button>
        </div>
      )}
    </div>
  );
}
