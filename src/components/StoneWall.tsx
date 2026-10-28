/**
 * 제주 돌담 — 집 칸 잔디밭과 '게하게' 칸 모래 사이
 * 크기 · 모양이 제각각인 현무암 돌을 두 줄로 쌓고, 왼쪽 위에서 빛을 받아 동글동글 입체감 있게
 * 돌마다 숭숭 뚫린 구멍(현무암 질감), 틈새로 삐져나온 풀, 담 바로 밑은 조금 짙은 모래
 * 화면 폭이 달라도 찌그러지지 않게 가운데를 기준으로 잘라 보여 줌
 */
// 늘 같은 모양이 나오게 — 씨앗이 정해진 난수
const rand = (() => {
  let s = 20261028;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
})();

type Stone = { d: string; x: number; y: number; w: number; pores: [number, number, number, number][]; g: number };

// 울퉁불퉁한 돌 하나 — 둘레 점을 조금씩 흔든 뒤 점 사이를 부드럽게 이음
const stonePath = (cx: number, cy: number, rx: number, ry: number) => {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rand() * 0.25;
    const k = 0.84 + rand() * 0.2;
    // 바닥은 평평하게 눌러 쌓인 느낌
    const y = Math.sin(a) * ry * k;
    return [cx + Math.cos(a) * rx * k, cy + (y > 0 ? y * 0.72 : y)] as const;
  });
  // 이웃한 두 점의 가운데를 지나고, 점은 조절점으로 — 모서리 없이 둥글게
  const mid = (i: number) => {
    const [ax, ay] = pts[i % n];
    const [bx, by] = pts[(i + 1) % n];
    return `${((ax + bx) / 2).toFixed(1)} ${((ay + by) / 2).toFixed(1)}`;
  };
  let d = `M${mid(0)}`;
  for (let i = 1; i <= n; i++) {
    const [x, y] = pts[i % n];
    d += ` Q${x.toFixed(1)} ${y.toFixed(1)} ${mid(i)}`;
  }
  return `${d} Z`;
};

const makeRow = (y: number, minW: number, maxW: number, hgt: number, start: number) => {
  const row: Stone[] = [];
  let x = start;
  while (x < 1500) {
    const w = minW + rand() * (maxW - minW);
    const hh = hgt * (0.8 + rand() * 0.35);
    const cx = x + w / 2;
    const cy = y - hh / 2 + rand() * 4;
    const pores: [number, number, number, number][] = Array.from({ length: 4 + Math.floor(rand() * 5) }, () => [
      cx + (rand() - 0.5) * w * 0.65,
      cy + (rand() - 0.4) * hh * 0.55,
      1.2 + rand() * 2,
      1 + rand() * 1.4,
    ]);
    row.push({ d: stonePath(cx, cy, w / 2, hh / 2), x: cx, y: cy, w, pores, g: Math.floor(rand() * 3) });
    x += w * (0.86 + rand() * 0.08);
  }
  return row;
};
// 뒷줄(위) · 앞줄(아래)
const BACK = makeRow(84, 44, 64, 40, -40);
const FRONT = makeRow(118, 48, 70, 44, -20);
// 틈새 풀
const GRASS = Array.from({ length: 16 }, () => [-20 + rand() * 1480, 50 + rand() * 6, 1 + rand() * 0.6] as const);
// 모래알
const SAND = Array.from({ length: 60 }, () => [rand() * 1440, 142 + rand() * 26, 1 + rand() * 1.4] as const);

const STONE_TONES = [
  ['#8E8C90', '#6E6C70', '#55535A'],
  ['#86848A', '#68666B', '#4F4D53'],
  ['#959398', '#76747A', '#5B5960'],
];

export function StoneWall() {
  return (
    <div className="stonewall" aria-hidden="true">
      <svg viewBox="0 0 1440 170" preserveAspectRatio="xMidYMid slice">
        <defs>
          {STONE_TONES.map(([hi, mid, lo], i) => (
            <radialGradient key={i} id={`stone-${i}`} cx="34%" cy="26%" r="85%">
              <stop offset="0" stopColor={hi} />
              <stop offset=".5" stopColor={mid} />
              <stop offset="1" stopColor={lo} />
            </radialGradient>
          ))}
          {/* 담 바로 밑은 조금 짙은 모래 띠, 아래로 '게하게' 칸 바탕색 */}
          <linearGradient id="stone-sand" gradientUnits="userSpaceOnUse" x1="0" y1="110" x2="0" y2="170">
            <stop offset="0" stopColor="#E9D4B4" />
            <stop offset=".42" stopColor="#E9D4B4" />
            <stop offset=".5" stopColor="#F8ECDA" />
            <stop offset="1" stopColor="#F8ECDA" />
          </linearGradient>
        </defs>
        {/* 잔디(위) · 모래(아래) */}
        <rect width="1440" height="110" fill="#CDE8BD" />
        <rect y="110" width="1440" height="60" fill="url(#stone-sand)" />
        {/* 담 뒤로 삐져나온 풀 */}
        {GRASS.map(([x, y, s], i) => (
          <path key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`} d="M0 10 C-2 4 -6 1 -8 -2 C-4 0 -2 3 0 6 C0 1 1 -4 3 -8 C3 -2 2 3 2 7 C4 3 7 1 10 0 C7 3 4 6 3 10 Z" fill={i % 2 ? '#9ACB7E' : '#86BE6C'} />
        ))}
        {[BACK, FRONT].map((row, r) => (
          <g key={r}>
            {row.map((st, i) => (
              <g key={i}>
                {/* 돌 사이 어두운 틈 */}
                <path d={st.d} fill="#4C4A50" transform="translate(1 2)" />
                <path d={st.d} fill={`url(#stone-${st.g})`} />
                {/* 숭숭 뚫린 구멍 */}
                {st.pores.map(([px, py, rx, ry], k) => (
                  <ellipse key={k} cx={px} cy={py} rx={rx} ry={ry} fill="#38363C" opacity=".85" />
                ))}
                {/* 위쪽 빛 */}
                <ellipse cx={st.x - st.w * 0.16} cy={st.y - 9} rx={st.w * 0.2} ry="3.5" fill="#FFFFFF" opacity=".18" />
              </g>
            ))}
          </g>
        ))}
        {/* 모래알 */}
        {SAND.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#E8BE95' : '#DDA77A'} opacity=".8" />
        ))}
      </svg>
    </div>
  );
}
