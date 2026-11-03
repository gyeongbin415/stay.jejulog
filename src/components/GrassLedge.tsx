/**
 * 모래 띠 — 집 칸과 '게하게' 칸(모래색) 사이
 * 잔디 턱 · 흙 옆면 없이 모래만: 촘촘한 모래알 · 바람 결 무늬 · 작은 조약돌
 * 화면 폭이 달라도 찌그러지지 않게 가운데 기준으로 잘라 보여 줌
 */
// 늘 같은 모양이 나오게 — 씨앗이 정해진 난수
const rand = (() => {
  let s = 20261028;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
})();

// 모래알 — 위쪽은 촘촘하게, 아래로 갈수록 성기게
const SAND = Array.from({ length: 520 }, () => {
  const t = Math.pow(rand(), 1.4);
  return [rand() * 1440, 38 + t * 90, 0.5 + rand() * 1.1, Math.floor(rand() * 4)] as const;
});
const SAND_TONES = ['#E6CBA8', '#D9B58C', '#FFF8EC', '#CFA77C'];
// 작은 조약돌
const PEBBLES = Array.from({ length: 10 }, () => [rand() * 1440, 50 + rand() * 72, 2.4 + rand() * 2.6] as const);
// 모래 바람 결
const RIPPLES = Array.from({ length: 18 }, () => [rand() * 1440, 46 + rand() * 78, 30 + rand() * 50] as const);

export function GrassLedge() {
  return (
    <div className="ledge" aria-hidden="true">
      <svg viewBox="0 34 1440 96" preserveAspectRatio="xMidYMin slice">
        {/* 모래 */}
        <rect y="34" width="1440" height="96" fill="#F8ECDA" />
        {/* 모래 바람 결 — 아주 옅은 곡선 */}
        {RIPPLES.map(([x, y, w], i) => (
          <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} q${(w / 2).toFixed(1)} -3 ${w.toFixed(1)} 0`} fill="none" stroke="#EAD6B8" strokeWidth="1.4" strokeLinecap="round" />
        ))}
        {/* 모래알 · 조약돌 */}
        {SAND.map(([x, y, r, c], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={SAND_TONES[c]} opacity={c === 2 ? .9 : .7} />
        ))}
        {PEBBLES.map(([x, y, r], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={r * 1.3} ry={r} fill="#C9A47C" />
            <ellipse cx={x - r * .35} cy={y - r * .35} rx={r * .55} ry={r * .38} fill="#F3E2C8" opacity=".8" />
          </g>
        ))}
      </svg>
    </div>
  );
}
