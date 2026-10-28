import type { ProgramId } from '../data/types';
import { PROGRAM_BY_ID } from '../data/programs';

/**
 * GA4 이벤트 매개변수 — 게스트하우스 이름(guesthouse_name) · 프로그램 성격(program_type).
 * 화면 언어와 상관없이 늘 같은 값이 쌓이도록 한국어 숙소 이름 · 영어 소문자 분류를 씁니다.
 * (GTM 이벤트 추적 시트 — 수수민박 = meal_talk, 스르르 게스트하우스 = class 기준으로 9곳을 정함)
 */
export const PROGRAM_TYPE: Record<ProgramId, string> = {
  book: 'book_talk',
  craft: 'class',
  flower: 'class',
  cinema: 'movie',
  lp: 'music',
  homemeal: 'meal_talk',
  wine: 'dinner_wine',
  camping: 'photo',
  running: 'running',
};

export const gaParams = (id: ProgramId) => ({
  guesthouse_name: PROGRAM_BY_ID[id].report.place.name,
  program_type: PROGRAM_TYPE[id],
});

/** 클릭 요소에 붙여 두는 data 속성 — 클릭하면 dataLayer 'click' 이벤트에 함께 실림 (lib/track.ts) */
export const gaAttrs = (id: ProgramId, rank?: number) => ({
  'data-ga-guesthouse': PROGRAM_BY_ID[id].report.place.name,
  'data-ga-program': PROGRAM_TYPE[id],
  ...(rank ? { 'data-ga-rank': String(rank) } : null),
});
