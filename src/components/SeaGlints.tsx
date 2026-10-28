/** 지도 칸 바다 위 윤슬 — 햇빛에 반짝이는 작은 빛이 군데군데 깜빡임 (글 · 섬 뒤쪽) */
const SPOTS: [number, number, number, number][] = [
  [8, 14, 1, 0], [22, 32, .8, 1.1], [88, 18, 1, .6], [94, 46, .7, 1.8], [6, 62, .9, 2.4],
  [16, 84, .8, .3], [90, 78, 1, 1.4], [78, 92, .7, 2.1], [34, 94, .8, .9], [62, 8, .7, 2.7],
];

export function SeaGlints() {
  return (
    <div className="sea-glints" aria-hidden="true">
      {SPOTS.map(([x, y, s, d], i) => (
        <span key={i} className="sea-glint" style={{ left: `${x}%`, top: `${y}%`, scale: String(s), animationDelay: `${d}s` }} />
      ))}
    </div>
  );
}
