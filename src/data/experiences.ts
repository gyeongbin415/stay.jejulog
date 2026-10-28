import type { ProgramId } from './types';

/* ------------------------------------------------------------------
   아홉 가지 경험 ↔ 게스트하우스 연결

   ▣ 집 내부 탐색 페이지의 공간 배치, 상세페이지 라벨(STAY 01 / 09),
     취향 테스트 결과의 '경험 유형'이 모두 이 순서를 씁니다.
   ▣ 숙소 정보 · 사진 · 프로그램 · 에디터 후기는 programs.ts 에 그대로 있습니다.
   ▣ headline 을 비워 두면 programs.ts 의 title 을 메인 카피로 씁니다.
------------------------------------------------------------------- */

/** 집 안에서의 위치 — attic 다락 작업실 · living 2층 거실 · kitchen 1층 부엌 · yard 마당 */
export type RoomId = 'attic' | 'study' | 'living' | 'kitchen' | 'yard';

export interface Experience {
  id: ProgramId;
  no: string;
  /** 집 내부에서 보이는 경험 이름 */
  label: string;
  /** 취향 테스트 결과 유형 (한 단어) */
  short: string;
  en: string;
  room: RoomId;
  /** 상세페이지 메인 카피 — 비우면 programs.ts 의 title */
  headline?: string;
}

/** 집 순서 그대로 — 다락 → 3F → 2F → 1F → 마당 (no 는 숙소 번호 STAY 01 ~ 09) */
export const EXPERIENCES: Experience[] = [
  { id: 'craft', no: '01', label: '반지공방', short: '반지', en: 'CRAFT', room: 'attic' },
  { id: 'book', no: '02', label: '책', short: '책', en: 'BOOK', room: 'living' },
  { id: 'flower', no: '03', label: '꽃꽂이', short: '꽃', en: 'FLOWER', room: 'kitchen' },
  { id: 'cinema', no: '04', label: '영화', short: '영화', en: 'CINEMA', room: 'living' },
  { id: 'lp', no: '05', label: 'LP', short: 'LP', en: 'LP', room: 'living' },
  { id: 'homemeal', no: '06', label: '집밥', short: '밥', en: 'HOME MEAL', room: 'kitchen', headline: '낯선 제주에서, 따뜻한 집밥을 먹는 방법' },
  { id: 'wine', no: '07', label: '와인', short: '와인', en: 'WINE', room: 'kitchen' },
  // 무릉쉼표 — 스냅사진 · 포틀럭 파티 & 불멍 (기존 id 는 camping)
  { id: 'camping', no: '08', label: '스냅사진', short: '스냅', en: 'SNAP', room: 'yard', headline: '제주의 계절을 사진으로 남기는 방법' },
  { id: 'running', no: '09', label: '러닝', short: '러닝', en: 'RUNNING', room: 'yard' },
];

export const EXPERIENCE_BY_ID = Object.fromEntries(EXPERIENCES.map((e) => [e.id, e])) as Record<ProgramId, Experience>;

export const ROOMS: { id: RoomId; floor: string; name: string; items: ProgramId[] }[] = [
  { id: 'attic', floor: 'ATTIC', name: '다락 서재', items: ['book'] },
  { id: 'living', floor: '2F', name: '거실', items: ['cinema', 'lp', 'craft'] },
  { id: 'kitchen', floor: '1F', name: '부엌', items: ['flower', 'homemeal', 'wine'] },
  { id: 'yard', floor: 'YARD', name: '마당', items: ['camping', 'running'] },
];

/** 집 단면 — 다락 책 · 3F 영화 · LP · 2F 반지공방 · 꽃꽂이 · 1F 집밥 · 와인 · 마당 스냅 · 러닝 (좁은 화면 — 넓은 화면은 ROOMS: 다락 1 · 2F 3칸 · 1F 3칸 · 마당 2) */
export const COMPACT_FLOORS: { id: RoomId; floor: string; name: string; items: ProgramId[] }[] = [
  { id: 'study', floor: '3F', name: '서재', items: ['cinema', 'lp'] },
  { id: 'living', floor: '2F', name: '거실', items: ['craft', 'flower'] },
  { id: 'kitchen', floor: '1F', name: '부엌', items: ['homemeal', 'wine'] },
];
