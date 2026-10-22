// docs/UI산출물.html 의 '취향 테스트 점수 규칙' 표를 src/data/quiz.ts 에서 다시 만듭니다.
// 실행: node --experimental-strip-types scripts/doc-quiz-table.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { QUESTIONS } from '../src/data/quiz.ts';

const TYPE_KO: Record<string, string> = { adventurer: '모험', collector: '수집', maker: '기록자', keeper: '장면' };
const PROGRAM_KO: Record<string, string> = {
  running: '러닝', cinema: '영화', flower: '꽃', lp: 'LP', book: '책', craft: '공예', camping: '캠핑', homemeal: '집밥', wine: '와인',
};

const rows = QUESTIONS.map((q, i) => {
  const cells = q.options.map((o) => {
    const types = Object.entries(o.types).map(([t, v]) => `${TYPE_KO[t]} +${v}`).join(', ');
    const programs = Object.entries(o.programs).map(([p, v]) => `${PROGRAM_KO[p]} ${v}`).join('·');
    return `<td>${types} / ${programs}</td>`;
  });
  const label = `Q${i + 1} ${q.context}${i === QUESTIONS.length - 1 ? ' (가중)' : ''}`;
  return `      <tr><td>${label}</td>${cells.join('')}</tr>`;
});

const file = 'docs/UI산출물.html';
let html = readFileSync(file, 'utf8');
const head = '<thead><tr><th>문항</th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>\n    <tbody>\n';
const a = html.indexOf(head);
const b = html.indexOf('    </tbody>', a);
if (a < 0 || b < 0) throw new Error('table markers');
html = html.slice(0, a + head.length) + rows.join('\n') + '\n' + html.slice(b);
writeFileSync(file, html);
console.log(`rows ${rows.length}`);
