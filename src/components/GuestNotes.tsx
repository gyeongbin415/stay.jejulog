import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useContent } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { track } from '../lib/track';
import { GUESTBOOK_URL, MAX_ANSWER, MAX_NAME, fetchBoard, loadMine, postNote, type GuestBoard, type GuestNote } from '../data/guestbook';
import '../styles/guest.css';

/* ------------------------------------------------------------------
   방명록(GUEST NOTE) — 메인 MORE STORIES 와 CHECK OUT 사이
   · 칸 안에는 여행자들이 남긴 답이 멀고 가까운 깊이로 흐릿하게 떠다니고, 가운데 '나의 제주 노트 쓰기'
   · 누르면 화면 가득 — 짧은 도입 문장 → 줄 노트 카드에 질문 3개를 하나씩 → 아래 칸에 다른 사람 답
------------------------------------------------------------------- */

const QUESTIONS = 3;

/** 떠다니는 답 자리 — x · y 는 칸 안 위치(%), d 는 깊이(0 가까움 · 또렷 ~ 2 멂 · 흐림). 가운데 글 자리는 비워 둠 */
const SLOTS = [
  { x: 16, y: 9, d: 1 }, { x: 52, y: 6, d: 2 }, { x: 84, y: 11, d: 0 },
  { x: 9, y: 27, d: 2 }, { x: 90, y: 30, d: 1 },
  { x: 13, y: 47, d: 0 }, { x: 88, y: 51, d: 2 },
  { x: 8, y: 68, d: 1 }, { x: 91, y: 71, d: 0 },
  { x: 20, y: 86, d: 2 }, { x: 52, y: 93, d: 1 }, { x: 80, y: 89, d: 2 },
];

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

  const cloud = useMemo(() => answersOf(notes, t.anon).slice(0, SLOTS.length), [notes, t.anon]);

  return (
    <section id="guest" className="gnote" data-tone="light" aria-labelledby="guest-title">
      {cloud.length > 0 && (
        <ul className="gnote__cloud" aria-label={t.cloudAria}>
          {cloud.map((c, i) => (
            <li
              key={`${i}-${c.text}`}
              className={`gnote__float gnote__float--d${SLOTS[i].d}`}
              style={{ '--x': `${SLOTS[i].x}%`, '--y': `${SLOTS[i].y}%`, '--i': i } as CSSProperties}
            >
              {c.text}
            </li>
          ))}
        </ul>
      )}
      <div className="gnote__inner wrap">
        <p className="label">GUEST NOTE</p>
        <h2 id="guest-title" className="gnote__title pre">{t.title}</h2>
        <p className="gnote__sub pre">{t.sub}</p>
        <button
          type="button"
          className="gnote__open"
          onClick={() => setOpen(true)}
          data-track="guest_open"
        >
          <span className="gnote__open-main">{t.open}</span>
          <span className="gnote__open-count">{count > 0 ? t.count(count) : t.first}</span>
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

/** 화면 가득 — 도입 문장 → 질문 카드 3장 → 다 썼어요 */
function GuestWriter({ notes, onClose, onSent }: { notes: GuestNote[]; onClose: () => void; onSent: () => void }) {
  const { ui, lang } = useContent();
  const t = ui.guest;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'intro' | 'write' | 'done'>(reduced ? 'write' : 'intro');
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
