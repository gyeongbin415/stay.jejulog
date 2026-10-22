import type { KeyboardEvent, ReactNode } from 'react';

/* ------------------------------------------------------------------
   제주 구옥 대문 — CHECK IN(닫힌 문 · 저녁)과 CHECK OUT(열린 문 · 낮)에 같은 형태로 씁니다.
   현무암 돌담 사이의 나무 두 짝 문. 문짝은 HTML 로 올려 3D 로 회전시킵니다.

   장면 좌표 (viewBox 600 × 560)
     문 구멍  x 200–400 · y 168–500  → left 33.333% · top 30% · width 33.333% · height 59.286%
------------------------------------------------------------------- */

export type DoorMood = 'evening' | 'day';

/** 외곽선 색 — 낮은 브라운 차콜, 저녁은 한 톤 더 어둡게 */
const LINE_DAY = '#332F2C';
const LINE_NIGHT = '#1E1C1A';

interface Props {
  mood: DoorMood;
  /** 문이 열려 있는지 (CHECK OUT 은 처음부터 열림) */
  open: boolean;
  /** 열리는 중 — 빛이 번지는 연출 */
  opening?: boolean;
  onDoorClick?: () => void;
}

/**
 * 대문 — 기둥 · 지붕 · 등 · 문짝만 그립니다.
 * 하늘 · 오름 · 돌담 · 바닥은 DoorScene 이 화면 폭 전체로 깔아 섹션 배경과 하나로 이어집니다.
 */
export function Door({ mood, open, opening, onDoorClick }: Props) {
  const day = mood === 'day';
  const line = day ? LINE_DAY : LINE_NIGHT;
  return (
    <div className={`door door--${mood}${open ? ' is-open' : ''}${opening ? ' is-opening' : ''}`}>
      <svg className="door__scene" viewBox="0 0 600 560" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="lampglow">
            <stop offset="0" stopColor="#D69480" stopOpacity=".55" />
            <stop offset="1" stopColor="#D69480" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 외곽선 그림체 — 모든 면에 짙은 선 */}
        <g stroke={line} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {/* 감귤나무 — 돌담 너머로 보이는 귤 */}
        <g className="door__tree">
          <rect x="514" y="372" width="12" height="128" rx="3" fill={day ? '#70503F' : '#4E372D'} />
          <path d="M462 372 C446 352 458 326 480 322 C484 294 512 274 540 282 C566 288 580 310 574 330 C594 340 594 376 568 386 C540 398 480 394 462 372 Z" fill={day ? '#56504B' : '#34302D'} />
          {[[502, 318], [536, 304], [552, 340], [512, 352], [482, 348], [530, 368], [494, 330], [560, 370]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7" fill={day ? '#C97156' : '#A76450'} strokeWidth="2" />
          ))}
        </g>

        {/* 돌하르방 — 대문을 지키는 현무암 석상 */}
        <g className="door__harubang">
          <path d="M78 500 V424 C78 398 92 382 110 382 C128 382 142 398 142 424 V500 Z" fill={day ? '#6B635C' : '#484441'} />
          <ellipse cx="110" cy="362" rx="27" ry="31" fill={day ? '#6B635C' : '#484441'} />
          <path d="M84 354 C84 326 96 310 110 310 C124 310 136 326 136 354 Z" fill={day ? '#5A5652' : '#3C3835'} />
          <rect x="79" y="349" width="62" height="8" rx="4" fill={day ? '#5A5652' : '#3C3835'} />
          <circle cx="99" cy="368" r="7" fill={day ? '#7E7771' : '#5A5652'} stroke={day ? '#484441' : '#2E2B29'} strokeWidth="2.5" />
          <circle cx="121" cy="368" r="7" fill={day ? '#7E7771' : '#5A5652'} stroke={day ? '#484441' : '#2E2B29'} strokeWidth="2.5" />
          <path d="M106 372 C103 386 117 386 114 372 Z" fill={day ? '#7E7771' : '#5A5652'} />
          <path d="M98 389 Q110 395 122 389" stroke={day ? '#484441' : '#2E2B29'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M86 436 C98 446 108 446 116 440" stroke={day ? '#484441' : '#2E2B29'} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M134 452 C122 462 112 462 104 456" stroke={day ? '#484441' : '#2E2B29'} strokeWidth="3" fill="none" strokeLinecap="round" />
          {[[92, 414], [128, 410], [96, 478], [126, 482], [110, 470], [102, 340], [118, 334]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={day ? '#5A5652' : '#3C3835'} stroke="none" />
          ))}
        </g>

        {/* 대문 기둥과 지붕 */}
        <rect x="178" y="160" width="26" height="340" fill={day ? '#70503F' : '#4E372D'} />
        <rect x="396" y="160" width="26" height="340" fill={day ? '#70503F' : '#4E372D'} />
        <rect x="190" y="152" width="220" height="18" fill={day ? '#7E5A47' : '#5A4132'} />
        <path d="M150 154 L300 108 L450 154 Z" fill={day ? '#56504B' : '#3D3834'} />
        <rect x="146" y="150" width="308" height="10" rx="3" fill={day ? '#403C38' : '#312E2B'} />

        {/* 등 */}
        <g className="door__lamp">
          <rect x="434" y="210" width="4" height="22" fill="#3A3734" />
          <rect x="426" y="230" width="20" height="26" rx="3" fill={day ? '#DDD4C2' : '#D69480'} />
          {!day && <circle className="door__lampglow" cx="436" cy="243" r="40" fill="url(#lampglow)" stroke="none" />}
        </g>
        </g>

        {/* 바닥으로 번지는 실내의 빛 */}
        <path className="door__spill" d="M200 500 L400 500 L470 560 L130 560 Z" fill="#D69480" />
      </svg>

      <div className="door__opening" onClick={onDoorClick}>
        <div className="door__inside">{day ? <SeaView /> : <Interior />}</div>
        <div className="door__leaf door__leaf--l"><Leaf /></div>
        <div className="door__leaf door__leaf--r"><Leaf flip /></div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   CHECK IN · CHECK OUT 문 — 문틀과 한 짝짜리 나무 판넬 문 (플랫 일러스트)
   · 문 전체 viewBox 240 × 500, 문틀 두께 14 → 문짝 자리 x 14–226 · y 14–500 (212 × 486)
   · 문짝: 위 판넬(크게) · 가운데 가로대 · 아래 판넬, 왼쪽 둥근 손잡이(황동판 · 열쇠 구멍)
   · 오른쪽 경첩을 축으로 안쪽으로 열립니다.
------------------------------------------------------------------- */
const W = {
  frame: '#6A3B22', frameDk: '#552E19', frameLt: '#7E4A2B',
  leaf: '#7B4527', leafDk: '#5F331C', field: '#8B522E', fieldLt: '#9A5E37', grain: '#6F3E22',
  rail: '#84492A', railLt: '#9B5C36',
  brass: '#B0915A', brassDk: '#77613A',
};

/** 오목하게 깎은 모서리의 판넬 모양 */
function panelPath(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 0 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 0 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 0 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 0 ${x + r} ${y} Z`;
}

/** 돋움 판넬 — 바깥 몰딩 · 안쪽 판 · 나뭇결 */
function Panel({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <path d={panelPath(x, y, w, h, 12)} fill={W.leafDk} />
      <path d={panelPath(x + 6, y + 6, w - 12, h - 12, 9)} fill={W.field} />
      <path d={panelPath(x + 14, y + 14, w - 28, h - 28, 6)} fill="none" stroke={W.fieldLt} strokeWidth="2" />
      {[0.22, 0.41, 0.63, 0.8].map((p, i) => (
        <path
          key={p}
          d={`M${x + w * p} ${y + 18} C${x + w * p + (i % 2 ? 6 : -5)} ${y + h * 0.4} ${x + w * p + (i % 2 ? -4 : 6)} ${y + h * 0.7} ${x + w * p + 2} ${y + h - 18}`}
          fill="none" stroke={W.grain} strokeWidth="1.4" opacity=".55"
        />
      ))}
    </g>
  );
}

/** 문짝 (212 × 486) */
function PanelLeaf() {
  return (
    <svg viewBox="0 0 212 486" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="212" height="486" fill={W.leaf} />
      <rect width="212" height="486" fill="none" stroke={W.leafDk} strokeWidth="4" />
      <Panel x={30} y={30} w={152} h={222} />
      {/* 가운데 가로대 */}
      <rect x="22" y="262" width="168" height="42" rx="3" fill={W.rail} />
      <rect x="22" y="262" width="168" height="5" rx="2" fill={W.railLt} />
      <rect x="22" y="300" width="168" height="4" rx="2" fill={W.leafDk} />
      <Panel x={30} y={314} w={152} h={146} />
      {/* 둥근 손잡이 — 황동판 · 나사 · 손잡이 · 열쇠 구멍 */}
      <rect x="8" y="230" width="22" height="90" rx="7" fill={W.brass} />
      <circle cx="19" cy="242" r="2.6" fill={W.brassDk} />
      <circle cx="19" cy="273" r="11.5" fill={W.brassDk} />
      <circle cx="19" cy="271" r="9.5" fill="#C9AD74" />
      <circle cx="16.5" cy="268" r="2.5" fill="#E2CC9C" />
      <circle cx="19" cy="299" r="3.4" fill="#3A2A1E" />
      <path d="M17.2 300 H20.8 L22 310 H16 Z" fill="#3A2A1E" />
    </svg>
  );
}

/** 현무암 돌 하나 — 타원 둘레를 들쭉날쭉하게 (점 8개를 곡선으로 이음) */
function rockPath(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const jitter = [1, 0.86, 1.06, 0.9, 1.02, 0.84, 1.08, 0.92];
  const pts = jitter.map((_, i) => {
    const a = (i / 8) * Math.PI * 2 + seed * 0.4;
    const k = jitter[(i + seed) % 8];
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const start = mid(pts[7], pts[0]);
  let d = `M${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % 8]);
    d += ` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  });
  return d + ' Z';
}
/** 한 무늬(180 × 96) 안 돌 배치 — [cx, cy, rx, ry] (가장자리에 걸친 돌은 반대편에도 그려 이어지게) */
const ROCKS: [number, number, number, number][] = [
  [22, 24, 20, 19], [66, 22, 21, 18], [111, 25, 20, 19], [156, 23, 21, 18],
  [44, 71, 20, 19], [89, 72, 21, 18], [134, 70, 20, 19], [178, 72, 20, 18], [-2, 72, 20, 18],
];
const ROCK_FILL = ['#5B5754', '#66615D', '#605B58'];

/** 대문 양옆 현무암 돌담 — 불규칙한 돌과 구멍 */
export function StoneWall() {
  return (
    <svg className="gate-wall" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="basalt" width="180" height="96" patternUnits="userSpaceOnUse">
          <rect width="180" height="96" fill="#2C2A28" />
          {ROCKS.map(([cx, cy, rx, ry], i) => (
            <g key={i}>
              <path d={rockPath(cx, cy, rx, ry, i)} fill={ROCK_FILL[i % 3]} />
              {[[-7, -5], [6, -2], [-2, 7], [8, 8]].map(([dx, dy]) => (
                <circle key={`${dx}-${dy}`} cx={cx + dx} cy={cy + dy} r="1.6" fill="#423E3B" />
              ))}
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#basalt)" />
    </svg>
  );
}

/** 문 왼쪽 돌하르방 둘 · 오른쪽 감귤나무 — 넓은 화면에서만 */
export function GateDecor() {
  const stone = { body: '#A09C98', head: '#A9A5A1', hand: '#C2BFBB', hat: '#8F8B87' };
  return (
    <>
      <svg className="gate-decor__harubang" viewBox="0 0 160 125" aria-hidden="true" focusable="false">
        {[36, 122].map((x) => (
          <g key={x}>
            <rect x={x - 27} y="70" width="54" height="55" rx="22" fill={stone.body} />
            <rect x={x - 22} y="92" width="26" height="9" rx="4.5" fill={stone.hand} />
            <rect x={x - 4} y="102" width="26" height="9" rx="4.5" fill={stone.hand} />
            <ellipse cx={x} cy="54" rx="24" ry="24" fill={stone.head} />
            <path d={`M${x - 22} 38 C${x - 22} 14 ${x + 22} 14 ${x + 22} 38 Z`} fill={stone.hat} />
            <rect x={x - 34} y="34" width="68" height="8" rx="4" fill={stone.hat} />
            {[-9, 9].map((dx) => (
              <g key={dx}>
                <circle cx={x + dx} cy="54" r="6.5" fill="#E6E3DE" />
                <circle cx={x + dx} cy="54" r="2.6" fill="#3A3735" />
              </g>
            ))}
            <rect x={x - 3.5} y="54" width="7" height="14" rx="3.5" fill={stone.hat} />
            <rect x={x - 8} y="72" width="16" height="2" rx="1" fill="#6E6A66" />
          </g>
        ))}
      </svg>
      <svg className="gate-decor__tree" viewBox="0 0 210 292" aria-hidden="true" focusable="false">
        <rect x="99" y="150" width="13" height="142" fill="#8A5A3B" />
        {[[70, 92, 50], [140, 92, 50], [105, 58, 50], [56, 140, 46], [154, 140, 46], [105, 132, 52]].map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#5E8D5C" />
        ))}
        <circle cx="84" cy="112" r="18" fill="#6E9C69" />
        <circle cx="138" cy="118" r="16" fill="#6E9C69" />
        {[[72, 38], [118, 42], [52, 76], [90, 66], [142, 70], [166, 98], [26, 120], [76, 108], [110, 92], [140, 116], [60, 150], [114, 150], [158, 150], [100, 172], [84, 126]].map(([x, y]) => (
          <circle key={`o${x}-${y}`} cx={x} cy={y} r="8" fill="#F39A2B" />
        ))}
      </svg>
    </>
  );
}

/**
 * 문 — 누르면(체크인) 또는 보이면(체크아웃) 오른쪽 경첩을 축으로 안쪽으로 열립니다.
 * children 은 문짝에 걸린 팻말 문구 (문과 함께 움직입니다).
 */
export function GatePhoto({ mood = 'evening', open, opening, onDoorClick, doorLabel, children }: Omit<Props, 'mood'> & { mood?: DoorMood; doorLabel?: string; children?: ReactNode }) {
  const day = mood === 'day';
  return (
    <div className={`door door--${mood} gate${open ? ' is-open' : ''}${opening ? ' is-opening' : ''}`}>
      {/* 문틀 */}
      <svg className="gate__frame" viewBox="0 0 240 500" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <rect width="240" height="500" fill={W.frame} />
        <rect x="4" y="4" width="232" height="496" fill="none" stroke={W.frameLt} strokeWidth="2" />
        <rect x="11" y="11" width="218" height="489" fill={W.frameDk} />
      </svg>
      {!day && <div className="gate__spill" aria-hidden="true" />}
      {/* 누를 수 있는 문은 키보드(Enter · Space)로도 엽니다 */}
      <div
        className="door__opening"
        onClick={onDoorClick}
        {...(onDoorClick && {
          role: 'button',
          tabIndex: 0,
          'aria-label': doorLabel,
          'data-track': 'checkin_door',
          onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onDoorClick(); }
          },
        })}
      >
        {/* 체크인은 따뜻한 실내, 체크아웃은 문 너머 제주 바다 */}
        <div className="door__inside">{day ? <SeaView /> : <Interior />}</div>
        {/* 팻말은 문짝에 걸려 있어 문과 함께 돌아갑니다 */}
        <div className="door__leaf door__leaf--r gate__leaf">
          <PanelLeaf />
          {children && <div className="gate__sign">{children}</div>}
        </div>
      </div>
    </div>
  );
}

/**
 * 대문이 서 있는 풍경 — 오름 · 현무암 돌담 · 바닥을 화면 폭 전체로.
 * 높이는 가운데 대문(600×560)이 정하고, 돌담 y 300–500 · 바닥 y 500–560 에 맞춰 % 로 깔립니다.
 */
export function DoorScene({ mood, children }: { mood: DoorMood; children: ReactNode }) {
  const day = mood === 'day';
  const c1 = day ? '#786F68' : '#514C48';
  const c2 = day ? '#5A5652' : '#3C3835';
  const line = day ? LINE_DAY : LINE_NIGHT;
  // 늘어나는 풍경 SVG 라서 선 굵기는 화면 기준으로 고정
  const ol = { stroke: line, strokeWidth: 2.5, vectorEffect: 'non-scaling-stroke' as const, strokeLinejoin: 'round' as const };
  return (
    <div className={`doorscene doorscene--${mood}`}>
      {/* 한라산 — 오름 너머 가장 멀리, 완만한 능선과 백록담 */}
      <svg className="doorscene__halla" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M80 200 C340 150 540 74 650 48 C676 42 690 54 712 52 C734 50 748 40 774 46 C884 72 1100 150 1360 200 Z" fill={day ? '#C4BEBA' : '#46403B'} {...ol} />
      </svg>
      <svg className="doorscene__hills" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 64 C140 14 300 6 460 40 C540 58 600 80 660 100 L0 100 Z" fill={day ? '#B7B0AA' : '#45403B'} {...ol} />
        <path d="M780 100 C860 70 960 36 1080 22 C1220 8 1350 30 1440 52 L1440 100 Z" fill={day ? '#A19890' : '#3E3934'} {...ol} />
        <path d="M470 100 C600 64 840 58 990 100 Z" fill={day ? '#AFA7A0' : '#433D38'} {...ol} />
      </svg>
      <svg className="doorscene__wall" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={`stones-${mood}`} width="92" height="72" patternUnits="userSpaceOnUse">
            <rect x="2" y="4" width="41" height="30" rx="12" fill={c1} stroke={line} strokeWidth="2.5" />
            <rect x="48" y="5" width="40" height="30" rx="12" fill={c2} stroke={line} strokeWidth="2.5" />
            <rect x="-21" y="40" width="40" height="30" rx="12" fill={c2} stroke={line} strokeWidth="2.5" />
            <rect x="25" y="41" width="42" height="30" rx="12" fill={c1} stroke={line} strokeWidth="2.5" />
            <rect x="71" y="40" width="40" height="30" rx="12" fill={c2} stroke={line} strokeWidth="2.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={day ? '#675F59' : '#44403C'} />
        <rect width="100%" height="100%" fill={`url(#stones-${mood})`} />
      </svg>
      <div className="doorscene__ground" aria-hidden="true" />
      <div className="doorscene__door">{children}</div>
    </div>
  );
}

/** 문짝 — 세로 널판 네 장, 띠장 두 개, 고리 손잡이 */
function Leaf({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 332" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect width="100" height="332" fill="#695E55" />
      {[0, 25, 50, 75].map((x, i) => (
        <rect key={x} x={x} y="0" width="25" height="332" fill={i % 2 ? '#5D5753' : '#6F655C'} />
      ))}
      {[25, 50, 75].map((x) => (
        <rect key={x} x={x - 1} y="0" width="2" height="332" fill={LINE_DAY} />
      ))}
      <rect x="0" y="56" width="100" height="16" fill="#524D49" stroke={LINE_DAY} strokeWidth="2.5" />
      <rect x="0" y="252" width="100" height="16" fill="#524D49" stroke={LINE_DAY} strokeWidth="2.5" />
      <rect x="0" y="0" width="100" height="332" fill="none" stroke={LINE_DAY} strokeWidth="5" />
      <circle cx={flip ? 14 : 86} cy="172" r="9" fill="none" stroke="#C98570" strokeWidth="3" />
      <circle cx={flip ? 14 : 86} cy="160" r="3" fill="#C98570" />
    </svg>
  );
}

/** CHECK IN — 문 안쪽의 따뜻한 실내 (집 탐색 페이지 방과 같은 베이지) */
function Interior() {
  return (
    <svg viewBox="0 0 200 332" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <rect width="200" height="332" fill="#F2E6D3" />
      <rect y="250" width="200" height="82" fill="#E2D1B6" />
      <rect x="18" y="64" width="64" height="120" fill="#FBF6EC" />
      <rect x="18" y="122" width="64" height="3" fill="#D8C6AA" />
      <rect x="49" y="64" width="3" height="120" fill="#D8C6AA" />
      <rect x="140" y="0" width="2" height="70" fill="#7A5240" />
      <path d="M124 70 h34 l-6 18 h-22 z" fill="#E39A4B" />
      <circle cx="141" cy="100" r="28" fill="#F7F4ED" opacity=".55" />
      <rect x="104" y="196" width="80" height="54" rx="4" fill="#9A6F57" />
      <rect x="104" y="196" width="80" height="10" rx="3" fill="#AB866E" />
    </svg>
  );
}

/**
 * CHECK OUT — 열린 대문 너머로 보이는 아침 바다.
 * 하늘 · 수평선 · 바다 · 해안도로 · 흙길을 차례로 (예전 대문 그림의 문 자리 좌표를 viewBox 로 그대로 씀),
 * 문 크기에 맞춰 가운데를 채웁니다.
 */
function SeaView() {
  // 제주 아침 — 해 뜨는 바다와 성산일출봉, 문 앞까지 이어진 모래사장
  return (
    <svg viewBox="720 420 358 375" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="morning-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFDDE6" />
          <stop offset=".6" stopColor="#F9E3C8" />
          <stop offset="1" stopColor="#FBD3A2" />
        </linearGradient>
        <linearGradient id="morning-sand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F1DFC2" />
          <stop offset="1" stopColor="#DCC09C" />
        </linearGradient>
        <linearGradient id="morning-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9CC8CF" />
          <stop offset="1" stopColor="#7DB2BF" />
        </linearGradient>
      </defs>
      <rect x="720" y="420" width="358" height="132" fill="url(#morning-sky)" />
      {/* 막 떠오른 해 */}
      <circle cx="910" cy="524" r="32" fill="#FFE7C2" opacity=".7" />
      <circle cx="910" cy="524" r="17" fill="#FFC86E" />
      {/* 성산일출봉 — 바다 위 평평한 봉우리 */}
      <path d="M794 552 C806 548 812 530 822 518 L860 516 C870 528 876 546 888 552 Z" fill="#6F8C80" />
      <path d="M822 518 L860 516 C855 523 828 524 822 518 Z" fill="#83A094" />
      <rect x="720" y="550" width="358" height="60" fill="url(#morning-sea)" />
      {/* 해 아래 반짝이는 물결 */}
      {[[894, 558, 32], [900, 568, 22], [888, 578, 42], [902, 589, 18]].map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height="2.5" rx="1.2" fill="#FFE2B0" />
      ))}
      {[[742, 570, 30], [812, 586, 36], [940, 566, 30], [1010, 588, 28]].map(([x, y, w]) => (
        <rect key={`w${x}-${y}`} x={x} y={y} width={w} height="2" rx="1" fill="#D6EBEE" />
      ))}
      {/* 물결 끝 하얀 포말 → 모래사장 */}
      <path d="M720 604 C760 598 800 610 840 604 C880 598 920 610 960 604 C1000 598 1040 610 1078 604 V614 H720 Z" fill="#F4F1E8" />
      <rect x="720" y="612" width="358" height="183" fill="url(#morning-sand)" />
    </svg>
  );
}
