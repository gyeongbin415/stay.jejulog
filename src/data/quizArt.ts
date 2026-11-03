/* ------------------------------------------------------------------
   취향 테스트 — 보기(A · B)마다 붙는 그림 (받은 일러스트에서 문항 글자는 빼고 그림 칸만 잘라 씀)
   문항 id → 보기 key → 그림. 그림이 없는 문항은 지금처럼 글자 보기만 나옵니다.
------------------------------------------------------------------- */
import q3a from '../assets/quiz/q3-a.jpg';
import q3b from '../assets/quiz/q3-b.jpg';

export const QUIZ_ART: Partial<Record<string, Partial<Record<'A' | 'B' | 'C' | 'D', string>>>> = {
  // 하루 종일 비 소식 — A 숙소에서 원데이 클래스 · B 비 오는 제주 찍으러
  q3: { A: q3a, B: q3b },
};
