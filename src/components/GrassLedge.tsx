/**
 * 잔디 판 두께(디오라마) — 집 칸 잔디밭과 '게하게' 칸 모래 사이
 * 마당을 두께 있는 잔디 판처럼: 살짝 튀어나온 잔디 턱 · 끝에 삐죽 나온 풀 → 옆면 흙(위는 빛 받아 밝고, 결이 진 층, 아래는 둥글게 진 테)
 * → 모래 위 은은한 그림자 → 촘촘한 모래알 · 바람 결 무늬 · 작은 조약돌
 * 취향 지도 섬 그림(두께 있는 섬)과 같은 입체 말투. 화면 폭이 달라도 찌그러지지 않게 가운데 기준으로 잘라 보여 줌
 */
// 늘 같은 모양이 나오게 — 씨앗이 정해진 난수
const rand = (() => {
  let s = 20261028;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
})();

// 완만하게 출렁이는 가로선 (판이 살짝 휘어진 느낌)
const wavy = (base: number, amp: number, seed: number) =>
  Array.from({ length: 49 }, (_, i) => {
    const x = -40 + i * 31;
    return `${x} ${(base + Math.sin(i * 0.9 + seed) * amp + Math.sin(i * 0.37 + seed * 2) * amp * 0.8).toFixed(1)}`;
  });
const SOIL_BOTTOM = wavy(80, 1.8, 0);
// 흙 속 층 무늬 두 줄
const STRATA = [wavy(58, 1.4, 1.3), wavy(69, 1.6, 2.1)];
// 흙 알갱이
const SOIL_GRAINS = Array.from({ length: 110 }, () => [rand() * 1440, 50 + rand() * 26, 0.7 + rand() * 1.3] as const);
// 잔디 끝에 삐죽 나온 풀
const TUFTS = Array.from({ length: 40 }, () => [rand() * 1440, 0.6 + rand() * 0.6] as const);
// 모래알 — 판 가까이는 촘촘하게, 아래로 갈수록 성기게
const SAND = Array.from({ length: 420 }, () => {
  const t = Math.pow(rand(), 1.6);
  return [rand() * 1440, 86 + t * 44, 0.5 + rand() * 1.1, Math.floor(rand() * 4)] as const;
});
const SAND_TONES = ['#E6CBA8', '#D9B58C', '#FFF8EC', '#CFA77C'];
// 작은 조약돌
const PEBBLES = Array.from({ length: 9 }, () => [rand() * 1440, 98 + rand() * 26, 2.4 + rand() * 2.6] as const);
// 모래 바람 결
const RIPPLES = Array.from({ length: 14 }, () => [rand() * 1440, 100 + rand() * 26, 30 + rand() * 50] as const);

export function GrassLedge() {
  return (
    <div className="ledge" aria-hidden="true">
      <svg viewBox="0 0 1440 130" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ledge-soil" gradientUnits="userSpaceOnUse" x1="0" y1="44" x2="0" y2="82">
            <stop offset="0" stopColor="#A47A4E" />
            <stop offset=".55" stopColor="#966D44" />
            <stop offset="1" stopColor="#82603D" />
          </linearGradient>
          <linearGradient id="ledge-shadow" gradientUnits="userSpaceOnUse" x1="0" y1="78" x2="0" y2="104">
            <stop offset="0" stopColor="#B49372" stopOpacity=".55" />
            <stop offset="1" stopColor="#F8ECDA" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 잔디 윗면 · 모래 */}
        <rect width="1440" height="46" fill="#CDE8BD" />
        <rect y="46" width="1440" height="84" fill="#F8ECDA" />
        {/* 모래 바람 결 — 아주 옅은 곡선 */}
        {RIPPLES.map(([x, y, w], i) => (
          <path key={i} d={`M${x.toFixed(1)} ${y.toFixed(1)} q${(w / 2).toFixed(1)} -3 ${w.toFixed(1)} 0`} fill="none" stroke="#EAD6B8" strokeWidth="1.4" strokeLinecap="round" />
        ))}
        {/* 모래 위 그림자 — 판 바로 밑에서 아래로 옅어짐 */}
        <rect y="74" width="1440" height="32" fill="url(#ledge-shadow)" />
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
        {/* 흙 옆면 */}
        <path d={`M-40 44 L1480 44 L${[...SOIL_BOTTOM].reverse().join(' L')} Z`} fill="url(#ledge-soil)" />
        {/* 흙 위쪽 — 잔디 턱 밑이라 빛을 받아 밝은 띠 */}
        <rect y="45" width="1440" height="5" fill="#B48A5C" opacity=".75" />
        {/* 흙 속 층 무늬 */}
        {STRATA.map((line, i) => (
          <path key={i} d={`M${line.join(' L')}`} fill="none" stroke={i ? '#76552F' : '#8A6640'} strokeWidth="1.3" opacity=".55" />
        ))}
        {SOIL_GRAINS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#7C5A37' : '#B48C5E'} opacity=".55" />
        ))}
        {/* 아래 테 — 둥글게 말려 들어가는 그늘 */}
        <path d={`M${SOIL_BOTTOM.join(' L')}`} fill="none" stroke="#6B4C2C" strokeWidth="2.4" opacity=".55" transform="translate(0 -1.2)" />
        {/* 잔디 턱 — 살짝 튀어나온 가장자리 (밑면은 짙은 초록, 윗면은 밝은 테) */}
        <rect y="40" width="1440" height="6" rx="3" fill="#B6D9A0" />
        <rect y="39" width="1440" height="3.5" fill="#DDF0D0" />
        {/* 잔디 끝에 삐죽 나온 풀 */}
        {TUFTS.map(([x, s], i) => (
          <path key={i} transform={`translate(${x.toFixed(1)} 42) scale(${s.toFixed(2)})`} d="M-6 2 C-5 -2 -7 -5 -9 -7 C-5 -5 -3 -2 -2 1 C-1 -3 0 -7 1 -10 C2 -6 2 -2 2 1 C3 -2 6 -4 9 -5 C6 -2 4 0 4 2 Z" fill={i % 2 ? '#9ACB7E' : '#86BE6C'} />
        ))}
      </svg>
    </div>
  );
}
