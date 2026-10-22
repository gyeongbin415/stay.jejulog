import { useEffect, useRef, useState, type RefObject } from 'react';
import { QUESTIONS } from '../data/quiz';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { scoreQuiz, decodeAnswers, type AnswerKey, type QuizResult } from '../lib/scoring';
import { href } from '../lib/router';
import { prefersReducedMotion } from '../lib/motion';
import { track } from '../lib/track';
import { makeResultImage } from '../lib/resultImage';

type Step = number | 'result';

/**
 * PAGE 04 — 취향 테스트
 * 10문항 · 점수 배점(src/data/quiz.ts) · 계산(src/lib/scoring.ts)을 그대로 씁니다.
 * 결과는 BEST 01(결과 유형의 대표 숙소) + NEXT 01(그다음 추천) 두 곳.
 */
export default function TestPage({ sharedCode }: { sharedCode: string | null }) {
  const { ui, questions } = useContent();
  const shared = decodeAnswers(sharedCode);
  const [answers, setAnswers] = useState<(AnswerKey | null)[]>(() => shared ?? QUESTIONS.map(() => null));
  const [step, setStep] = useState<Step>(shared ? 'result' : 0);
  const [isShared, setIsShared] = useState(Boolean(shared));
  const focusRef = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const timer = useRef(0);

  useEffect(() => {
    const decoded = decodeAnswers(sharedCode);
    if (!decoded) return;
    setAnswers(decoded);
    setIsShared(true);
    setStep('result');
  }, [sharedCode]);

  useEffect(() => {
    if (!shared) track('quiz_start');
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 문항이 바뀌면 질문으로 초점을 옮기고 화면 위쪽에 맞춥니다.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    focusRef.current?.focus({ preventScroll: true });
    const top = document.querySelector('.test__card, .result');
    if (top && top.getBoundingClientRect().top < 0) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [step]);

  const finish = (all: AnswerKey[]) => {
    const r = scoreQuiz(all);
    setStep('result');
    track('quiz_result', { type: r.type, best: r.main, code: r.code });
  };

  const choose = (qi: number, key: AnswerKey) => {
    const next = [...answers];
    next[qi] = key;
    setAnswers(next);
    track('quiz_answer', { q: QUESTIONS[qi].id, a: key });
    window.clearTimeout(timer.current);
    // 선택이 보이도록 잠깐 머문 뒤 다음 질문으로
    timer.current = window.setTimeout(() => goNext(qi, next), prefersReducedMotion() ? 0 : 320);
  };

  const goNext = (qi: number, list = answers) => {
    if (!list[qi]) return;
    if (qi < QUESTIONS.length - 1) setStep(qi + 1);
    else finish(list as AnswerKey[]);
  };

  const restart = () => {
    setAnswers(QUESTIONS.map(() => null));
    setIsShared(false);
    setStep(0);
    history.replaceState(history.state, '', href.test());
    track('quiz_start');
  };

  const result = step === 'result' && answers.every(Boolean) ? scoreQuiz(answers as AnswerKey[]) : null;
  const qi = typeof step === 'number' ? step : -1;

  return (
    <section className="test" data-tone="light" aria-labelledby="test-title">
      <div className="test__inner wrap">
        {qi >= 0 && (
          <>
            <header className="test__head">
              <p className="label">TEST</p>
              <p className="test__title serif pre">{ui.test.title}</p>
              <p className="test__sub pre">{ui.test.sub(QUESTIONS.length)}</p>
            </header>

            <div className="test__card" key={qi}>
              <div className="test__progress">
                <span className="test__count">
                  <strong>{qi + 1}</strong> / {QUESTIONS.length}
                </span>
                <span className="test__bar" role="progressbar" aria-label={ui.test.progress} aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={qi + 1}>
                  <i style={{ transform: `scaleX(${(qi + 1) / QUESTIONS.length})` }} />
                </span>
              </div>

              <p className="test__qno serif" aria-hidden="true">Q{qi + 1}.</p>
              <h1 id="test-title" ref={focusRef} tabIndex={-1} className="test__q">
                {questions[qi].q}
              </h1>

              <div className="test__options" role="radiogroup" aria-labelledby="test-title">
                {questions[qi].options.map((o) => {
                  const on = answers[qi] === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      className={`test__option${on ? ' is-on' : ''}`}
                      onClick={() => choose(qi, o.key)}
                      data-track={`quiz_${QUESTIONS[qi].id}_${o.key}`}
                    >
                      <span className="test__key" aria-hidden="true">{o.key}</span>
                      <span className="test__otext">{o.text}</span>
                    </button>
                  );
                })}
              </div>

              <div className="test__nav">
                <button type="button" className="btn btn--ghost btn--back" onClick={() => setStep(qi - 1)} disabled={qi === 0} data-track="quiz_prev">
                  {ui.test.prev} <span className="arrow" aria-hidden="true">←</span>
                </button>
                <button type="button" className="btn" onClick={() => goNext(qi)} disabled={!answers[qi]} data-track="quiz_next">
                  {qi === QUESTIONS.length - 1 ? ui.test.seeResult : ui.test.next} <span className="arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </>
        )}

        {result && <Result result={result} shared={isShared} onRetry={restart} focusRef={focusRef} />}
      </div>
    </section>
  );
}

function Result({ result, shared, onRetry, focusRef }: { result: QuizResult; shared: boolean; onRetry: () => void; focusRef: RefObject<HTMLHeadingElement | null> }) {
  const { ui, site, types, programById } = useContent();
  const t = ui.test;
  const type = types[result.type];
  const [status, setStatus] = useState('');
  const [second, third] = result.subs;

  // 저장하기 — 결과를 한 장의 이미지로 (휴대폰은 공유 창의 ‘이미지 저장’, 컴퓨터는 파일 내려받기)
  const save = async () => {
    try {
      const ranked = [result.main, second?.id, third?.id].filter(Boolean) as ProgramId[];
      const blob = await makeResultImage({
        label: t.resultLabel,
        lead: t.lead,
        brand: `${site.brandEn} · ${site.brand}`,
        picks: ranked.map((id, i) => ({ id, rank: `BEST 0${i + 1}`, charName: site.characters[id], place: programById[id].report.place.name })),
      });
      const file = new File([blob], `jejulog-${result.code}.png`, { type: 'image/png' });
      const touch = window.matchMedia('(pointer: coarse)').matches;
      if (touch && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: t.shareTitle(site.brand, type.name) });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }
      setStatus(t.saved);
      track('result_save', { type: result.type });
    } catch (err) {
      setStatus((err as Error)?.name === 'AbortError' ? t.canceled : t.saveFailed);
    }
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}${href.result(result.code)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: t.shareTitle(site.brand, type.name), text: type.tagline, url });
        setStatus(t.shared);
      } else {
        await navigator.clipboard.writeText(url);
        setStatus(t.copied);
      }
    } catch {
      setStatus(t.canceled);
    }
  };

  return (
    <div className="result">
      <header className="result__head">
        <p className="label">{shared ? t.sharedLabel : t.resultLabel}</p>
        <p className="result__lead">{t.lead}</p>
        {/* 1위 — 캐릭터 이름(…하게) · 게스트하우스 이름 · 캐릭터 그림 */}
        <h1 id="test-title" ref={focusRef} tabIndex={-1} className="result__type">
          {site.characters[result.main]}
        </h1>
        <p className="result__place">{programById[result.main].report.place.name}</p>
        <div className="result__hero">
          <span className="result__rank">BEST 01<span className="visually-hidden"> {t.bestCaption}</span></span>
          <img src={`characters/${result.main}.png`} alt="" />
        </div>
        <a className="btn" href={href.stay(result.main)} data-track={`result_best01_${result.main}`}>
          {t.detail} <span className="arrow" aria-hidden="true">→</span>
        </a>
      </header>

      <ol className="result__picks">
        {/* 2 · 3순위 — 나란히 */}
        {second && <Pick rank="BEST 02" caption={t.nextCaption} id={second.id} />}
        {third && <Pick rank="BEST 03" caption={t.thirdCaption} id={third.id} />}
      </ol>

      {/* 저장하기 · 친구에게 공유하기 / 다시하기 */}
      <div className="result__actions">
        <div className="result__actrow">
          <button type="button" className="btn btn--ghost" onClick={save} data-track="result_save">
            {t.save}
          </button>
          <button type="button" className="btn btn--ghost" onClick={share} data-track="result_share">
            {t.share}
          </button>
        </div>
        <button type="button" className="btn btn--ghost result__retry" onClick={onRetry} data-track="result_retry">
          {t.retry}
        </button>
        <p className="result__status" role="status">{status}</p>
      </div>
    </div>
  );
}

/**
 * 결과 카드 — 소라게 캐릭터 · 캐릭터 이름 · 게스트하우스 이름 · 자세히 보기 버튼만
 * 캐릭터 그림은 public/characters/<프로그램 id>.png
 */
function Pick({ rank, caption, id }: { rank: string; caption: string; id: ProgramId }) {
  const { ui, site, programById } = useContent();
  const p = programById[id];
  return (
    <li className="pick">
      <p className="pick__rank" title={caption}>
        <strong>{rank}</strong>
        <span className="visually-hidden">{caption}</span>
      </p>
      <div className="pick__character">
        <img src={`characters/${id}.png`} alt="" />
      </div>
      <p className="pick__charname">{site.characters[id]}</p>
      <h2 className="pick__name">{p.report.place.name}</h2>
      <a className="btn" href={href.stay(id)} data-track={`result_${rank.toLowerCase().replace(' ', '')}_${id}`}>
        {ui.test.detail} <span className="arrow" aria-hidden="true">→</span>
      </a>
    </li>
  );
}
