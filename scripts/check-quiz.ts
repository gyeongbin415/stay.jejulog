// 취향 테스트 점수 검증: 가능한 모든 답변 조합(4^문항 수)을 계산해
// 유형·대표 프로그램 분포와 모든 프로그램의 추천 포함 여부를 확인합니다.
import { scoreQuiz, primaryType, type AnswerKey } from '../src/lib/scoring.ts';
import { QUESTIONS } from '../src/data/quiz.ts';

const N = QUESTIONS.length;

const PROGRAM_COUNT = 9;

const keys: AnswerKey[] = ['A', 'B', 'C', 'D'];
const typeCount: Record<string, number> = {};
const mainCount: Record<string, number> = {};
const mentioned = new Set<string>();
let ties = 0;
for (let n = 0; n < 4 ** N; n++) {
  const answers = Array.from({ length: N }, (_, i) => keys[Math.floor(n / 4 ** i) % 4]);
  const r = scoreQuiz(answers);
  typeCount[r.type] = (typeCount[r.type] ?? 0) + 1;
  mainCount[r.main] = (mainCount[r.main] ?? 0) + 1;
  mentioned.add(r.main);
  r.subs.forEach((s) => mentioned.add(s.id));
  if (r.tieRule) ties++;
}
console.log('유형 분포', typeCount);
console.log('대표 프로그램 분포', mainCount);
console.log('동점 처리된 조합', ties, '/', 4 ** N);
console.log('추천에 등장한 프로그램', mentioned.size, '/', PROGRAM_COUNT);
// 각 문항에서 같은 성향 쪽 선택지만 고르면 그 유형이 나와야 합니다.
for (const t of ['adventurer', 'collector', 'maker', 'keeper'] as const) {
  const answers = QUESTIONS.map((q) => q.options.find((o) => primaryType(o) === t)!.key);
  const r = scoreQuiz(answers);
  if (r.type !== t) throw new Error(`${answers.join('')} → ${r.type} (기대: ${t})`);
}
if (mentioned.size !== PROGRAM_COUNT) throw new Error('추천에 등장하지 않는 프로그램이 있습니다');
console.log('OK');
