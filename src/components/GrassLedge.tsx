/**
 * 모래 띠 — 집 칸(오프화이트)과 '게하게' 칸(모래색) 사이
 * 잔디 턱 · 흙 옆면 없이, 모래가 완만하게 출렁이는 곡선으로 밀려 올라와 위 칸과 부드럽게 번져 만남
 * → 촘촘한 모래알 · 바람 결 무늬 · 작은 조약돌
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

// 완만하게 출렁이는 모래 가장자리 — 점 사이를 곡선으로 이어 모서리 없이
const edge = (base: number, amp: number, seed: number) => {
  const pts = Array.from({ length: 15 }, (_, i) => {
    const x = -80 + i * 115;
    return [x, base + Math.sin(i * 1.1 + seed) * amp + Math.sin(i * 0.45 + seed * 2) * amp * 0.7] as const;
  });
  let d = `M${pts[0][0]} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` C${(x0 + 57).toFixed(1)} ${y0.toFixed(1)} ${(x1 - 57).toFixed(1)} ${y1.toFixed(1)} ${x1} ${y1.toFixed(1)}`;
  }
  return `${d} L1560 130 L-80 130 Z`;
};
// 뒤쪽 옅은 모래(번짐) · 앞쪽 모래
const SAND_HAZE = edge(50, 9, 0.6);
const SAND_EDGE = edge(60, 10, 0);

// 모래알 — 위쪽은 촘촘하게, 아래로 갈수록 성기게 (가장자리 곡선 아래에만)
const SAND = Array.from({ length: 460 }, () => {
  const t = Math.pow(rand(), 1.4);
  return [rand() * 1440, 72 + t * 56, 0.5 + rand() * 1.1, Math.floor(rand() * 4)] as const;
});
const SAND_TONES = ['#E6CBA8', '#D9B58C', '#FFF8EC', '#CFA77C'];
// 작은 조약돌
const PEBBLES = Array.from({ length: 10 }, () => [rand() * 1440, 82 + rand() * 40, 2.4 + rand() * 2.6] as const);
// 모래 바람 결
const RIPPLES = Array.from({ length: 16 }, () => [rand() * 1440, 80 + rand() * 44, 30 + rand() * 50] as const);

export function GrassLedge() {
  return (
    <div className="ledge" aria-hidden="true">
      <svg viewBox="0 34 1440 96" preserveAspectRatio="xMidYMin slice">
        <defs>
          <filter id="ledge-soft" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* 위 칸 배경 */}
        <rect y="34" width="1440" height="96" fill="#FAFAF3" />
        {/* 모래 — 뒤는 흐릿하게 번지고, 앞은 부드러운 곡선 */}
        <path d={SAND_HAZE} fill="#F8ECDA" opacity=".55" filter="url(#ledge-soft)" />
        <path d={SAND_EDGE} fill="#F8ECDA" filter="url(#ledge-soft)" />
        <rect y="84" width="1440" height="46" fill="#F8ECDA" />
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
