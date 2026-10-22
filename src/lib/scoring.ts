import { QUESTIONS, TYPES, TYPE_FALLBACK_ORDER, type QuizOption, type QuizQuestion } from '../data/quiz.ts';
import type { ProgramId, TypeId } from '../data/types';

export type AnswerKey = QuizOption['key'];

export interface QuizResult {
  type: TypeId;
  runnerUp: TypeId | null;
  typeScores: Record<TypeId, number>;
  programScores: Record<ProgramId, number>;
  main: ProgramId;
  subs: { id: ProgramId; from: 'same-type' | 'second-type' }[];
  /** 동점이 있었다면 어떤 규칙으로 정했는지 */
  tieRule: string | null;
  /** 결과 유형을 가리킨 답변들 — 추천 이유 문장에 사용 */
  evidence: { question: QuizQuestion; option: QuizOption }[];
  /** 공유 링크용 답변 문자열 (예: 'ABDCA') */
  code: string;
}

const TYPE_IDS: TypeId[] = ['adventurer', 'collector', 'maker', 'keeper'];
const PROGRAM_IDS: ProgramId[] = ['running', 'cinema', 'flower', 'lp', 'book', 'craft', 'camping', 'homemeal', 'wine'];

/** 선택지가 가장 크게 가리키는 성향 (같은 점수면 먼저 적힌 쪽) */
export function primaryType(option: QuizOption): TypeId {
  let best: TypeId | null = null;
  for (const [id, pts] of Object.entries(option.types) as [TypeId, number][]) {
    if (best === null || pts > (option.types[best] ?? 0)) best = id;
  }
  return best ?? 'adventurer';
}

/**
 * 답변 배열(질문 순서대로 'A' · 'B')로 결과를 계산합니다 — 점수표(data/quiz.ts 의 programs) 기준.
 *
 *   1 · 2 · 3위  10문항에서 받은 숙소(프로그램) 점수 합계가 높은 순서
 *   동점 규칙    Q10 → Q9 → … → Q1 순서로 거슬러 올라가며, 그 문항에서 점수를 더 받은 곳을 위로
 *   끝까지 같으면 PROGRAM_IDS 에 적힌 순서
 *   결과 유형    1위 숙소가 속한 유형 (TYPES[유형].programs)
 */
export function scoreQuiz(answers: AnswerKey[]): QuizResult {
  const programScores = Object.fromEntries(PROGRAM_IDS.map((p) => [p, 0])) as Record<ProgramId, number>;
  const picked: { question: QuizQuestion; option: QuizOption }[] = [];

  QUESTIONS.forEach((question, i) => {
    const option = question.options.find((o) => o.key === answers[i]);
    if (!option) return;
    picked.push({ question, option });
    for (const [p, v] of Object.entries(option.programs) as [ProgramId, number][]) programScores[p] += v;
  });

  // 동점 — 마지막 문항부터 그 문항에서 받은 점수 비교
  const fromLast = [...picked].reverse();
  const tieBreak = (a: ProgramId, b: ProgramId) => {
    for (const { option } of fromLast) {
      const d = (option.programs[b] ?? 0) - (option.programs[a] ?? 0);
      if (d) return d;
    }
    return PROGRAM_IDS.indexOf(a) - PROGRAM_IDS.indexOf(b);
  };
  const ranked = [...PROGRAM_IDS].sort((a, b) => programScores[b] - programScores[a] || tieBreak(a, b));

  const typeOf = (p: ProgramId) => TYPE_IDS.find((t) => TYPES[t].programs.includes(p)) ?? TYPE_FALLBACK_ORDER[0];
  const typeScores = Object.fromEntries(TYPE_IDS.map((t) => [t, 0])) as Record<TypeId, number>;
  for (const p of PROGRAM_IDS) typeScores[typeOf(p)] += programScores[p];

  const main = ranked[0];
  const type = typeOf(main);
  const subs: QuizResult['subs'] = ranked.slice(1, 3).map((id) => ({ id, from: typeOf(id) === type ? ('same-type' as const) : ('second-type' as const) }));
  const second = subs.find((x) => x.from === 'second-type');
  const runnerUp = second ? typeOf(second.id) : null;
  const tieRule = programScores[ranked[0]] === programScores[ranked[1]] ? '동점이어서 마지막 문항부터 거슬러 올라가며 그 문항 점수가 높은 곳을 위로 올렸습니다.' : null;

  return {
    type,
    runnerUp,
    typeScores,
    programScores,
    main,
    subs,
    tieRule,
    evidence: picked.filter(({ option }) => (option.programs[main] ?? 0) > 0),
    code: answers.join(''),
  };
}

export function decodeAnswers(code: string | null | undefined): AnswerKey[] | null {
  if (!code || code.length !== QUESTIONS.length) return null;
  const keys = code.toUpperCase().split('');
  return keys.every((k) => k === 'A' || k === 'B' || k === 'C' || k === 'D') ? (keys as AnswerKey[]) : null;
}
