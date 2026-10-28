/**
 * 모래사장 → 하얀 파도 → 바다 — '게하게' 칸과 '취향 지도' 칸 사이
 * 모래 위엔 조개 · 조약돌, 물가엔 거품이 밀려왔다 빠지고(파도), 바다엔 물결 줄이 흘러감
 * 화면 폭이 달라도 찌그러지지 않게 가운데를 기준으로 잘라 보여 줌 (동작 줄이기 설정이면 멈춤)
 */
const SHELLS: { x: number; y: number; r: number; c: string; s: number }[] = [
  { x: 92, y: 66, r: -18, c: '#E98A5E', s: 1.1 },
  { x: 1340, y: 70, r: 14, c: '#B9A3E3', s: 1.15 },
  { x: 1188, y: 112, r: -8, c: '#8FCFB4', s: .9 },
  { x: 560, y: 54, r: 10, c: '#F3B07B', s: .8 },
  { x: 860, y: 40, r: -12, c: '#E98A5E', s: .75 },
];
const PEBBLES: [number, number, number, number, string][] = [
  [180, 92, 13, 8, '#8C96A6'], [150, 118, 9, 6, '#A9B0BC'], [410, 108, 14, 9, '#8A8F99'], [436, 118, 8, 5, '#B5BAC2'],
  [700, 118, 11, 7, '#C9A27C'], [960, 142, 12, 7, '#8C96A6'], [1050, 126, 7, 5, '#9EA6B2'], [1265, 134, 10, 7, '#8C8F98'],
  [1395, 120, 9, 6, '#A9B0BC'], [300, 70, 6, 4, '#B9A28A'], [1110, 92, 7, 5, '#B9A28A'],
];
// 모래알
const GRAINS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 211) % 1440;
  const y = 30 + ((i * 97) % 95);
  return [x, y, 1.4 + ((i * 7) % 3) * 0.6] as const;
});

// 거품 속 구멍 [x, y, 크기]
const HOLES: [number, number, number][] = [[140, 168, 10], [330, 172, 7], [610, 166, 12], [880, 170, 8], [1130, 168, 10], [1360, 172, 7], [460, 176, 5], [1000, 178, 6]];

// 물가 거품 테두리 — 굽이치는 곡선
const foam = (base: number, amp: number, seed: number) => {
  let d = `M-60 ${base}`;
  for (let x = -60; x <= 1500; x += 120) {
    const y1 = base - amp * Math.sin((x + seed) / 97);
    const y2 = base + amp * 0.6 * Math.cos((x + seed) / 61);
    d += ` Q${x + 60} ${y1.toFixed(1)} ${x + 120} ${y2.toFixed(1)}`;
  }
  return d;
};

export function BeachDivider() {
  const edge = foam(150, 20, 0);
  return (
    <div className="beach" aria-hidden="true">
      <svg viewBox="0 0 1440 260" preserveAspectRatio="xMidYMid slice" shapeRendering="geometricPrecision">
        <defs>
          {/* 위쪽은 '게하게' 칸 바탕색 그대로 시작해 천천히 모래색으로 (경계 선이 안 보이게) */}
          <linearGradient id="beach-sand" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="160">
            <stop offset="0" stopColor="#F8ECDA" />
            <stop offset=".3" stopColor="#F8EAD5" />
            <stop offset=".7" stopColor="#F5DFC0" />
            <stop offset="1" stopColor="#F0D3A8" />
          </linearGradient>
          {/* 바다 — 아래 '지도' 칸 바다색으로 고르게 이어짐 */}
          <linearGradient id="beach-sea" gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="260">
            <stop offset="0" stopColor="#A4DAE0" />
            <stop offset="1" stopColor="#B1E1E6" />
          </linearGradient>
          {/* 물가의 얕은 물 — 거품 밑에서 밝게 시작해 바다에 녹아듦 */}
          <linearGradient id="beach-shallow" gradientUnits="userSpaceOnUse" x1="0" y1="150" x2="0" y2="232">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          {/* 번짐 — 뒤 거품은 흐릿하게, 앞 거품은 가장자리만 살짝 */}
          <filter id="beach-blur" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="beach-soft" x="-5%" y="-20%" width="110%" height="140%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
          {/* 거품 속 구멍 — 뒤가 은은하게 비쳐 보이게 (색을 칠하지 않고 반쯤 뚫음) */}
          <mask id="beach-holes" maskUnits="userSpaceOnUse" x="-100" y="0" width="1640" height="260">
            <rect x="-100" y="0" width="1640" height="260" fill="#fff" />
            {HOLES.map(([x, y, r], i) => (
              <ellipse key={i} cx={x} cy={y} rx={r * 1.8} ry={r * .7} fill="#5a5a5a" />
            ))}
          </mask>
        </defs>
        {/* 바다 */}
        <rect width="1440" height="260" fill="url(#beach-sea)" />
        <rect y="120" width="1440" height="140" fill="url(#beach-shallow)" />
        {/* 바다 물결 줄 — 옆으로 흘러감 */}
        <g className="beach__streaks">
          <path d="M120 222 q60 -14 130 -2 M520 236 q70 -16 150 -4 M960 214 q60 -12 120 0 M1250 238 q60 -14 140 -2 M-200 214 q60 -12 120 0" />
          <path d="M1560 222 q60 -14 130 -2 M1960 236 q70 -16 150 -4" />
        </g>
        {/* 젖은 모래 — 파도가 빠지면 드러남 */}
        <path d={`${foam(116, 22, 40)} L1500 158 L-60 158 Z`} fill="#E8C691" />
        {/* 모래사장 */}
        <path className="beach__sand" d={`${foam(128, 22, 40)} L1500 -10 L-60 -10 Z`} fill="url(#beach-sand)" />
        {/* 모래알 · 조약돌 · 조개 */}
        <g className="beach__grains">
          {GRAINS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 3 ? '#D9B892' : '#C9A27C'} opacity=".7" />
          ))}
        </g>
        {PEBBLES.map(([x, y, rx, ry, c], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={c} />
        ))}
        {SHELLS.map((sh, i) => (
          <g key={i} transform={`translate(${sh.x} ${sh.y}) rotate(${sh.r}) scale(${sh.s})`}>
            {/* 가리비 조개 — 부채꼴 몸 + 골 + 아래 꼭지 */}
            <path d="M0 14 C-20 8 -24 -10 -12 -18 C-6 -22 6 -22 12 -18 C24 -10 20 8 0 14 Z" fill={sh.c} />
            <path d="M0 12 L-12 -14 M0 12 L-5 -18 M0 12 L2 -19 M0 12 L8 -17 M0 12 L14 -12" stroke="rgba(0,0,0,.18)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M-6 12 h12 l-2 6 h-8 Z" fill={sh.c} opacity=".85" />
          </g>
        ))}
        {/* 하얀 거품 — 밀려왔다 빠짐 (두 겹, 엇박자) */}
        {/* 뒤 거품 — 흐릿하게 번진 물보라, 앞 거품보다 조금 늦게 */}
        <g className="beach__foam beach__foam--back">
          <path d={`${foam(160, 14, 120)} L1500 200 Q1080 214 720 202 Q360 190 -60 204 Z`} fill="#FFFFFF" opacity=".7" filter="url(#beach-blur)" />
        </g>
        <g className="beach__foam">
          <path mask="url(#beach-holes)" filter="url(#beach-soft)" d={`${edge} L1500 182 Q1440 196 1380 186 Q1300 200 1220 188 Q1140 176 1060 192 Q980 204 900 188 Q820 178 740 194 Q660 206 580 190 Q500 178 420 194 Q340 206 260 190 Q180 178 100 192 Q20 202 -60 188 Z`} fill="#FFFFFF" />
          {/* 거품 방울 */}
          {[[60, 150, 4], [250, 146, 3], [520, 152, 5], [760, 148, 3], [1040, 150, 4], [1300, 146, 3], [700, 214, 3], [380, 222, 2.5], [1180, 218, 3]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" />
          ))}
        </g>
      </svg>
    </div>
  );
}
