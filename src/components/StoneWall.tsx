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

const STONE_TONES = [
  ['#929095', '#77757A', '#626066'],
  ['#8A888D', '#706E73', '#5C5A60'],
  ['#9A989D', '#7E7C82', '#67656B'],
  ['#86848A', '#6A686E', '#56545A'],
];

type Stone ={ d: string; x: number; y: number; w: number; pores: [number, number, number, number][]; g: number };

// 울퉁불퉁한 돌 하나 — 둘레 점을 조금씩 흔든 뒤 점 사이를 부드럽게 이음
const stonePath = (cx: number, cy: number, rx: number, ry: number) => {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 + rand() * 0.25;
    const k = 0.84 + rand() * 0.2;
    // 바닥은 평평하게 눌러 쌓인 느낌
    const y = Math.sin(a) * ry * k;
    return [cx + Math.cos(a) * rx * k, cy + (y > 0 ? y * 0.88 : y)] as const;
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

const makeRow = (y: number, minW: number, maxW: number, hgt: number, start: number, jitter: number) => {
  const row: Stone[] = [];
  let x = start;
  while (x < 1500) {
    // 큰 돌 · 작은 돌이 섞이게 — 가끔 아주 큰 돌
    const big = rand() < 0.22;
    const w = (minW + rand() * (maxW - minW)) * (big ? 1.2 : 1);
    const hh = hgt * (0.85 + rand() * 0.3) * (big ? 1.18 : 1);
    const cx = x + w / 2;
    const cy = y - hh / 2 + (rand() - 0.5) * jitter;
    // 현무암 숨구멍 — 작고 많게, 진하기도 제각각 (점박이처럼 안 보이게)
    const pores: [number, number, number, number][] = Array.from({ length: 7 + Math.floor(rand() * 8) }, () => [
      cx + (rand() - 0.5) * w * 0.72,
      cy + (rand() - 0.45) * hh * 0.6,
      0.6 + rand() * 1.2,
      0.5 + rand() * 0.9,
    ]);
    row.push({ d: stonePath(cx, cy, w / 2, hh / 2), x: cx, y: cy, w, pores, g: Math.floor(rand() * STONE_TONES.length) });
    // 이웃 돌과 살짝 맞닿게 — 너무 듬성하지도 빼곡하지도 않게
    x += w * (0.8 + rand() * 0.1);
  }
  return row;
};
// 틈새 풀
const GRASS = Array.from({ length: 16 }, () => [-20 + rand() * 1480, 50 + rand() * 6, 1 + rand() * 0.6] as const);
// 모래알
const SAND = Array.from({ length: 60 }, () => [rand() * 1440, 142 + rand() * 26, 1 + rand() * 1.4] as const);

// 뒷줄(위) · 앞줄(아래) — 높낮이가 들쭉날쭉하게
const BACK = makeRow(86, 36, 54, 42, -40, 8);
const FRONT = makeRow(122, 40, 60, 48, -10, 6);
// 돌 틈 그늘의 윗선 — 뒷줄 돌 가운데쯤을 지나는 완만한 곡선
const CREVICE_TOP = Array.from({ length: 49 }, (_, i) => {
  const x = -40 + i * 31;
  return `${x} ${(76 + Math.sin(i * 1.7) * 3).toFixed(1)}`;
}).join(' L');

export function StoneWall() {
  return (
    <div className="stonewall" aria-hidden="true">
      <svg viewBox="0 18 1440 152" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* 돌 — 위는 빛을 받아 밝고 아래로 갈수록 은은하게 어두워짐 (번들거림 · 덧그린 그림자 없이) */}
          {STONE_TONES.map(([hi, mid, lo], i) => (
            <linearGradient key={i} id={`stone-${i}`} x1=".25" y1="0" x2=".6" y2="1">
              <stop offset="0" stopColor={hi} />
              <stop offset=".55" stopColor={mid} />
              <stop offset="1" stopColor={lo} />
            </linearGradient>
          ))}
          {/* 담 밑 모래 — 돌 바로 아래만 살짝 짙고 아래로 자연스럽게 옅어짐 (경계선 없이) */}
          <linearGradient id="stone-sand" gradientUnits="userSpaceOnUse" x1="0" y1="112" x2="0" y2="150">
            <stop offset="0" stopColor="#EDDBBE" />
            <stop offset="1" stopColor="#F8ECDA" />
          </linearGradient>
        </defs>
        {/* 잔디(위) · 모래(아래) */}
        <rect width="1440" height="100" fill="#CDE8BD" />
        <rect y="100" width="1440" height="70" fill="url(#stone-sand)" />
        {/* 담 뒤로 삐져나온 풀 */}
        {GRASS.map(([x, y, s], i) => (
          <path key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})`} d="M0 10 C-2 4 -6 1 -8 -2 C-4 0 -2 3 0 6 C0 1 1 -4 3 -8 C3 -2 2 3 2 7 C4 3 7 1 10 0 C7 3 4 6 3 10 Z" fill={i % 2 ? '#9ACB7E' : '#86BE6C'} />
        ))}
        {/* 돌 틈 — 잔디가 비쳐 보이지 않게 돌담 속 그늘 (윗선은 완만한 물결) */}
        <path d={`M-40 ${CREVICE_TOP} L1480 112 L-40 112 Z`} fill="#55535A" />
        {[BACK, FRONT].map((row, r) => (
          <g key={r}>
            {row.map((st, i) => (
              <g key={i}>
                {/* 돌 — 가장자리는 아주 옅은 선으로만 구분 */}
                <path d={st.d} fill={`url(#stone-${st.g})`} stroke="#5A585E" strokeWidth=".8" strokeOpacity=".35" />
                {/* 숭숭 뚫린 구멍 — 진하기를 섞어 자연스럽게 */}
                {st.pores.map(([px, py, rx, ry], k) => (
                  <ellipse key={k} cx={px} cy={py} rx={rx} ry={ry} fill="#403E44" opacity={k % 3 === 0 ? .45 : k % 3 === 1 ? .65 : .8} />
                ))}
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
