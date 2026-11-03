/* ------------------------------------------------------------------
   취향 테스트 — 보기(A · B)마다 붙는 그림 (받은 소라게 일러스트 10장에서 문항 글자는 빼고 그림 칸만 잘라 씀)
   문항 id → 보기 key → 그림. 그림이 없는 문항은 글자 보기만 나옵니다.
------------------------------------------------------------------- */
import q1a from '../assets/quiz/q1-a.jpg';
import q1b from '../assets/quiz/q1-b.jpg';
import q2a from '../assets/quiz/q2-a.jpg';
import q2b from '../assets/quiz/q2-b.jpg';
import q3a from '../assets/quiz/q3-a.jpg';
import q3b from '../assets/quiz/q3-b.jpg';
import q4a from '../assets/quiz/q4-a.jpg';
import q4b from '../assets/quiz/q4-b.jpg';
import q5a from '../assets/quiz/q5-a.jpg';
import q5b from '../assets/quiz/q5-b.jpg';
import q6a from '../assets/quiz/q6-a.jpg';
import q6b from '../assets/quiz/q6-b.jpg';
import q7a from '../assets/quiz/q7-a.jpg';
import q7b from '../assets/quiz/q7-b.jpg';
import q8a from '../assets/quiz/q8-a.jpg';
import q8b from '../assets/quiz/q8-b.jpg';
import q9a from '../assets/quiz/q9-a.jpg';
import q9b from '../assets/quiz/q9-b.jpg';
import q10a from '../assets/quiz/q10-a.jpg';
import q10b from '../assets/quiz/q10-b.jpg';

export const QUIZ_ART: Partial<Record<string, Partial<Record<'A' | 'B' | 'C' | 'D', string>>>> = {
  // 이런 게하가 좋다 — A 조용히 쉬는 곳 · B 사람 냄새 나는 곳
  q1: { A: q1a, B: q1b },
  // 라운지에 먼저 온 게스트 — A 눈인사만 · B 먼저 말 걸기
  q2: { A: q2a, B: q2b },
  // 하루 종일 비 소식 — A 숙소에서 원데이 클래스 · B 비 오는 제주 찍으러
  q3: { A: q3a, B: q3b },
  // 저녁 메뉴 — A 집밥 한 상 · B 와인 곁들인 양식 디너
  q4: { A: q4a, B: q4b },
  // 저녁 먹고 숙소에서 — A 다 같이 영화 · B LP 음악
  q5: { A: q5a, B: q5b },
  // 밤 이야기 — A 책 한 구절로 깊은 얘기 · B 모닥불 수다
  q6: { A: q6a, B: q6b },
  // 여행 리듬 — A 아침형 · B 밤형
  q7: { A: q7a, B: q7b },
  // 아침 일찍 — A 오름 일출 · B 해안도로 달리기
  q8: { A: q8a, B: q8b },
  // 제주 기념 — A 손으로 만든 것 · B 풍경 속 내 사진
  q9: { A: q9a, B: q9b },
  // 처음 만난 사람과 — A 와인 한 잔 · B 따뜻한 밥 한 끼
  q10: { A: q10a, B: q10b },
};
