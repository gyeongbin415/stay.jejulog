/**
 * 잔디 판 두께(디오라마) — 집 칸 잔디밭과 '게하게' 칸 모래 사이
 * 마당을 두께 있는 잔디 판처럼: 위 잔디 끝의 밝은 테 → 옆면 흙(위는 밝고 아래로 짙게, 흙 알갱이) → 모래 위 은은한 그림자
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

// 흙 옆면 아래 가장자리 — 아주 완만하게 출렁 (판이 살짝 휘어진 느낌)
const SOIL_BOTTOM = Array.from({ length: 49 }, (_, i) => {
  const x = -40 + i * 31;
  return `${x} ${(80 + Math.sin(i * 0.9) * 1.8 + Math.sin(i * 0.37) * 1.4).toFixed(1)}`;
});
// 흙 알갱이
const SOIL_GRAINS = Array.from({ length: 90 }, () => [rand() * 1440, 48 + rand() * 28, 0.8 + rand() * 1.4] as const);
// 모래알
const SAND = Array.from({ length: 70 }, () => [rand() * 1440, 98 + rand() * 30, 1.2 + rand() * 2.2] as const);

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
        {/* 모래 위 그림자 — 판 바로 밑에서 아래로 옅어짐 */}
        <rect y="74" width="1440" height="32" fill="url(#ledge-shadow)" />
        {/* 흙 옆면 */}
        <path d={`M-40 44 L1480 44 L${[...SOIL_BOTTOM].reverse().join(' L')} Z`} fill="url(#ledge-soil)" />
        {SOIL_GRAINS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#7C5A37' : '#B48C5E'} opacity=".55" />
        ))}
        {/* 잔디 끝 — 밝은 테 */}
        <rect y="41" width="1440" height="4" fill="#DDF0D0" />
        {/* 모래알 */}
        {SAND.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#E3BF98' : '#D8AE84'} opacity=".75" />
        ))}
      </svg>
    </div>
  );
}
