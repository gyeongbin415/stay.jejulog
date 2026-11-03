import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import { useReducedMotion } from '../lib/motion';
import { href } from '../lib/router';
import { track } from '../lib/track';
import { GUESTBOOK_URL, MAX_ANSWER, MAX_NAME, fetchBoard, loadMine, postNote, type GuestBoard, type GuestNote } from '../data/guestbook';
import noteUrl from '../assets/guest-note.png';
import '../styles/guest.css';

/* ------------------------------------------------------------------
   방명록(GUEST NOTE)
   · 방명록 페이지(#/guest) — 표지 없이 들어오자마자 질문 고르기
     → 마음에 드는 질문만 골라 줄 노트 카드에 적기 → 아래 칸에 다른 사람 답 → 이름과 함께 남기기
   · 메인 칸(page 아님) — 받은 공책 그림 + 버튼, 누르면 방명록 페이지로
------------------------------------------------------------------- */

const QUESTIONS = 3;

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
  const same = (n: GuestNote) => `${n.name}|${n.a.join('|')}`;
  const notes = useMemo(() => {
    const server = board?.notes ?? [];
    const seen = new Set(server.map(same));
    return [...mine.filter((n) => !seen.has(same(n))).reverse(), ...server];
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
        {/* 받은 공책 그림 · 버튼 — 누르면 방명록 페이지로 */}
        <a className="gnote__art" href={href.guest()} aria-label={t.open} data-track="guest_open">
          <img src={noteUrl} alt="" width={900} height={708} loading="lazy" decoding="async" />
        </a>
        <a className="btn gnote__cta" href={href.guest()} data-track="guest_cta">
          {t.open} <span className="arrow" aria-hidden="true">→</span>
        </a>
        <p className="gnote__entry-count">{count > 0 ? t.count(count) : t.first}</p>
        {!GUESTBOOK_URL && mine.length > 0 && <p className="gnote__local">{t.localOnly}</p>}
      </div>
    </section>
  );
}

/**
 * 쓰던 답 · 이름 — 창을 닫았다 열거나 다른 화면에 다녀와도 그대로 (페이지가 열려 있는 동안, 남기고 나면 비움)
 */
const draft = { answers: Array<string>(QUESTIONS).fill(''), name: '' };

/** 질문 고르기 ⇄ 줄 노트 카드 → 다 썼어요 · inline — 방명록 페이지 안에 바로(창 · 도입 문장 · 닫기 없이) */
function GuestWriter({ notes, onClose, onSent, inline = false }: { notes: GuestNote[]; onClose: () => void; onSent: () => void; inline?: boolean }) {
  const { ui, lang } = useContent();
  const t = ui.guest;
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<'intro' | 'pick' | 'write' | 'done'>(reduced || inline ? 'pick' : 'intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(() => [...draft.answers]);
  const [name, setName] = useState(draft.name);
  useEffect(() => {
    draft.answers = [...answers];
    draft.name = name;
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
    if (phase === 'write') areaRef.current?.focus({ preventScroll: true });
    setShowAll(false);
  }, [phase, step]);

  const list = useMemo(() => answersOf(notes, t.anon, step), [notes, t.anon, step]);
  // 아래 칸에 보여 줄 다른 사람 답 하나 — 질문마다 하나씩 골라 둠
  const peek = useMemo(() => (list.length ? list[Math.floor(Math.random() * list.length)] : null), [list]);

  const setAnswer = (v: string) => setAnswers((a) => a.map((x, i) => (i === step ? v : x)));
  const answered = answers.map((a) => !!a.trim());

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
    draft.answers = Array<string>(QUESTIONS).fill('');
    draft.name = '';
    onSent();
    setPhase('done');
  };
  /** 다 쓴 뒤 — 창은 닫고, 방명록 페이지에서는 새 노트 쓰기로 */
  const finish = () => {
    if (!inline) return onClose();
    setAnswers(Array<string>(QUESTIONS).fill(''));
    setName('');
    setPhase('pick');
  };

  return (
    <div className={`gwrite gwrite--${phase}${inline ? ' gwrite--inline' : ''}`} role={inline ? undefined : 'dialog'} aria-modal={inline ? undefined : true} aria-label={t.open} ref={ref} tabIndex={-1}>
      <header className="gwrite__top">
        <p className="gwrite__brand">GUEST NOTE</p>
        {(phase === 'pick' || phase === 'write') && (
          <ol className="gwrite__bar" aria-hidden="true">
            {answered.map((on, i) => (
              <li key={i} className={on ? 'is-on' : undefined} />
            ))}
          </ol>
        )}
        {!inline && (
          <button type="button" className="gwrite__close" onClick={onClose} data-track="guest_close">
            <span aria-hidden="true">×</span>
            <span className="visually-hidden">{t.close}</span>
          </button>
        )}
      </header>

      {phase === 'intro' && (
        <button type="button" className="gwrite__intro" onClick={() => setPhase('pick')}>
          {t.intro.map((l, i) => (
            <span key={l} style={{ '--i': i } as CSSProperties}>{l}</span>
          ))}
        </button>
      )}

      {/* 질문 고르기 — 마음에 드는 질문만 골라 적고, 하나 이상 적으면 이름과 함께 남기기 */}
      {phase === 'pick' && (
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
                  <span className="gwrite__pick-state">{answered[i] ? answers[i].trim() : t.pickWrite}</span>
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
            <p className="gwrite__hand" aria-hidden="true">MY JEJU NOTE</p>
            <div className="gwrite__card" key={step}>
              <p className="gwrite__no">Q{step + 1}</p>
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
            </div>
            <nav className="gwrite__nav">
              <button type="button" className="gwrite__step" onClick={() => setPhase('pick')}>
                <span aria-hidden="true">‹ </span>{t.toList}
              </button>
              <button type="button" className="btn gwrite__submit" onClick={() => setPhase('pick')} data-track={`guest_done_q${step + 1}`}>
                {t.doneAnswer}
              </button>
            </nav>
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
          <button type="button" className="btn gwrite__submit" onClick={finish}>{inline ? t.open : t.doneClose}</button>
        </div>
      )}
    </div>
  );
}
