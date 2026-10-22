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

export const EXPERIENCES: Experience[] = [
  { id: 'book', no: '01', label: '독서', short: '책', en: 'BOOK', room: 'living' },
  { id: 'lp', no: '02', label: 'LP', short: 'LP', en: 'LP', room: 'living' },
  { id: 'craft', no: '03', label: '나무반지', short: '반지', en: 'CRAFT', room: 'attic' },
  // 무릉쉼표 — 스냅사진 · 포틀럭 파티 & 불멍 (기존 id 는 camping)
  { id: 'camping', no: '04', label: '스냅사진', short: '스냅', en: 'SNAP', room: 'yard', headline: '제주의 계절을 사진으로 남기는 방법' },
  { id: 'cinema', no: '05', label: '영화', short: '영화', en: 'CINEMA', room: 'living' },
  { id: 'homemeal', no: '06', label: '집밥', short: '밥', en: 'HOME MEAL', room: 'kitchen', headline: '낯선 제주에서, 따뜻한 집밥을 먹는 방법' },
  { id: 'flower', no: '07', label: '꽃꽂이', short: '꽃', en: 'FLOWER', room: 'kitchen' },
  { id: 'running', no: '08', label: '러닝', short: '러닝', en: 'RUNNING', room: 'yard' },
  { id: 'wine', no: '09', label: '와인', short: '와인', en: 'WINE', room: 'kitchen' },
];

export const EXPERIENCE_BY_ID = Object.fromEntries(EXPERIENCES.map((e) => [e.id, e])) as Record<ProgramId, Experience>;

export const ROOMS: { id: RoomId; floor: string; name: string; items: ProgramId[] }[] = [
  { id: 'attic', floor: 'ATTIC', name: '다락 작업실', items: ['craft'] },
  { id: 'living', floor: '2F', name: '거실', items: ['book', 'lp', 'cinema'] },
  { id: 'kitchen', floor: '1F', name: '부엌', items: ['homemeal', 'wine', 'flower'] },
  { id: 'yard', floor: 'YARD', name: '마당', items: ['camping', 'running'] },
];

/** 집 단면 — 실내 여섯 공간을 두 칸씩 세 층으로 (다락 1 · 3F 2 · 2F 2 · 1F 2 · 마당 2) */
export const COMPACT_FLOORS: { id: RoomId; floor: string; name: string; items: ProgramId[] }[] = [
  { id: 'study', floor: '3F', name: '서재', items: ['book', 'lp'] },
  { id: 'living', floor: '2F', name: '거실', items: ['cinema', 'wine'] },
  { id: 'kitchen', floor: '1F', name: '부엌', items: ['homemeal', 'flower'] },
];
