/**
 * 모래사장 → 하얀 파도 → 바다 — '게하게' 칸과 '취향 지도' 칸 사이
 * 모래 위엔 조개 · 조약돌, 물가엔 거품이 밀려왔다 빠지고(파도), 바다엔 물결 줄이 흘러감
 * 화면 폭이 달라도 찌그러지지 않게 가운데를 기준으로 잘라 보여 줌 (동작 줄이기 설정이면 멈춤)
 */
const SHELLS: { x: number; y: number; r: number; c: string; s: number }[] = [
  { x: 92, y: 84, r: -18, c: '#E98A5E', s: 1.1 },
  { x: 1340, y: 86, r: 14, c: '#B9A3E3', s: 1.15 },
  { x: 1188, y: 112, r: -8, c: '#8FCFB4', s: .9 },
  { x: 560, y: 86, r: 10, c: '#F3B07B', s: .8 },
  { x: 860, y: 80, r: -12, c: '#E98A5E', s: .75 },
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

// 물가 거품 테두리 — 굽이치는 곡선 (큰 굽이 + 잔물결 두 사인을 잘게 이어 꺾임 없이 부드럽게)
const waveY = (x: number, base: number, amp: number, seed: number) =>
  base - amp * (0.68 * Math.sin((x + seed) / 118) + 0.32 * Math.sin((x + seed) / 53 + 1.3));
const foam = (base: number, amp: number, seed: number) => {
  let d = '';
  for (let x = -60; x <= 1500; x += 6) {
    d += `${d ? ' L' : 'M'}${x} ${waveY(x, base, amp, seed).toFixed(1)}`;
  }
  return d;
};
// 거품 아래 가장자리 — 오른쪽 끝에서 왼쪽으로 되돌아오는 같은 곡선
const foamBack = (base: number, amp: number, seed: number) => {
  let d = '';
  for (let x = 1500; x >= -60; x -= 6) {
    d += ` L${x} ${waveY(x, base, amp, seed).toFixed(1)}`;
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
          <linearGradient id="beach-sand" gradientUnits="userSpaceOnUse" x1="0" y1="50" x2="0" y2="175">
            <stop offset="0" stopColor="#F8ECDA" />
            <stop offset=".3" stopColor="#F8EAD5" />
            <stop offset=".7" stopColor="#F5DFC0" />
            <stop offset="1" stopColor="#F0D3A8" />
          </linearGradient>
          <linearGradient id="beach-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8FD0D8" />
            <stop offset=".45" stopColor="#A6DCE2" />
            <stop offset="1" stopColor="#B1E1E6" />
          </linearGradient>
          {/* 뒤 거품 — 아래로 갈수록 바다에 녹아듦 (밀려 올라가도 끝선이 안 보이게) */}
          <linearGradient id="beach-wash" gradientUnits="userSpaceOnUse" x1="0" y1="140" x2="0" y2="230">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".6" />
            <stop offset=".45" stopColor="#FFFFFF" stopOpacity=".35" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beach-wet" gradientUnits="userSpaceOnUse" x1="0" y1="96" x2="0" y2="168">
            <stop offset="0" stopColor="#E8C691" />
            <stop offset=".6" stopColor="#E8C691" />
            <stop offset="1" stopColor="#E8C691" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* 바다 */}
        <rect width="1440" height="260" fill="url(#beach-sea)" />
        {/* 모래 · 파도는 위로 올려 바다를 넓게 */}
        <g transform="translate(0 -50)">
        {/* 젖은 모래 — 파도가 빠지면 드러남 (아래 끝은 흐려져 바다와 일자 경계가 안 생기게) */}
        <path d={`${foam(116, 22, 40)} L1500 168 L-60 168 Z`} fill="url(#beach-wet)" />
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
        <g className="beach__foam beach__foam--back">
          <path d={`${foam(158, 14, 120)} L1500 260 L-60 260 Z`} fill="url(#beach-wash)" />
        </g>
        <g className="beach__foam">
          <path d={`${edge}${foamBack(190, 10, 300)} Z`} fill="#FFFFFF" />
          {/* 거품 속 바다가 비치는 구멍 · 방울 */}
          {[[140, 168, 10], [330, 172, 7], [610, 166, 12], [880, 170, 8], [1130, 168, 10], [1360, 172, 7], [460, 176, 5], [1000, 178, 6]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r * 1.8} ry={r * .7} fill="#A6DCE2" />
          ))}
          {[[60, 150, 4], [250, 146, 3], [520, 152, 5], [760, 148, 3], [1040, 150, 4], [1300, 146, 3], [700, 214, 3], [380, 222, 2.5], [1180, 218, 3]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" />
          ))}
        </g>
        </g>
      </svg>
    </div>
  );
}
