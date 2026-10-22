import type { ReactNode } from 'react';
import type { ProgramId } from '../data/types';

/* ------------------------------------------------------------------
   집 내부 9개 공간 — 외곽선 없는 플랫 일러스트 (MY JEJU HOUSE 시안)
   · 실내 · 마당 viewBox 400 × 260 (바닥 y 256), 다락 400 × 190 (지붕 가운데)
   · 색: 크림 방 · 차콜 가구 · 청록 · 주황 · 노랑
   · 클릭 대상이 되는 사물은 <g className="obj"> 로 묶어 호버 때 살짝 커집니다.
------------------------------------------------------------------- */

const C = {
  cream: '#F2E6D3',     // 방 벽 — 따뜻한 베이지
  white: '#FFFFFF',
  char: '#3A3735',
  grey: '#6E6A68',
  screen: '#6B6663',
  teal: '#1F7A8C',
  tealDk: '#196878',
  tealLt: '#7CC4C8',
  orange: '#F39A2B',
  yellow: '#F6C945',
  green: '#4F9160',
  greenDk: '#2E5E3C',
  sky: '#F7D9A6',
  path: '#EFE3C4',
  trunk: '#8A5A3B',
  fridge: '#F4F1EA',
  red: '#B5313A',
  brick: '#C55A4F',     // 와인 의자 · 연필꽂이 · 책
  greenSofa: '#6A8F5C', // 독서 의자
  greenDk2: '#5A7C4E',
  cabinet: '#6A8F5C',   // 부엌 수납장
  cabinetDk: '#58784C',
  sofa: '#E39A4B',      // 영화 소파
  lawn: '#D5E6C4',      // 마당 칸 — 연두 판
  skyLt: '#DDEDEA',     // 러닝 칸 하늘
  sea: '#8CC3C9',       // 러닝 칸 바다
  rice: '#FFFDF7',
  steam: '#C9BFAE',
  sofaDk: '#C9803A',
  potGrey: '#8A8580',   // 회색 화분 · 꽃병
};

export const YARD_ROOMS: ProgramId[] = ['camping', 'running'];

export function RoomArt({ id }: { id: ProgramId }) {
  const viewBox = id === 'craft' ? '0 0 400 190' : '0 0 400 260';
  return (
    <svg className="room__art" viewBox={viewBox} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {ART[id]}
    </svg>
  );
}

/** 실내 공통 — 크림색 방 */
function Room({ children }: { children: ReactNode }) {
  return (
    <>
      <rect width="400" height="260" fill={C.cream} />
      {children}
    </>
  );
}

/** 천장에 매단 조명 */
function Pendant({ x, len, shade }: { x: number; len: number; shade: string }) {
  return (
    <>
      <rect x={x - 1} y="0" width="2" height={len} fill={C.char} />
      <path d={`M${x - 18} ${len + 22} H${x + 18} L${x + 9} ${len} H${x - 9} Z`} fill={shade} />
      <circle cx={x} cy={len + 27} r="5" fill={C.yellow} />
    </>
  );
}

/** 마당 공통 — 연두 판 */
function Lawn({ children }: { children: ReactNode }) {
  return (
    <>
      <rect width="400" height="260" fill={C.lawn} />
      {children}
    </>
  );
}

/** 마당의 노란 꽃 */
function Flower({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x - 1.5} y={y} width="3" height={256 - y} fill={C.green} />
      <path d={`M${x} ${y - 11} L${x + 9} ${y} L${x} ${y + 9} L${x - 9} ${y} Z`} fill={C.yellow} />
    </>
  );
}

const BOOK_COLORS = [C.green, C.orange, C.white, C.brick, C.yellow, C.green, C.white];

const ART: Record<ProgramId, ReactNode> = {
  /* 01 독서 — 책장 · 안락의자 · 스탠드 */
  book: (
    <Room>
      <g className="obj">
        <rect x="36" y="62" width="96" height="194" fill={C.char} />
        {[0, 1, 2].map((r) =>
          BOOK_COLORS.map((c, i) => (
            <rect key={`${r}-${i}`} x={44 + i * 12} y={78 + r * 60} width="10" height="46" fill={c} />
          )),
        )}
      </g>
      <rect x="184" y="138" width="106" height="70" rx="14" fill={C.greenSofa} />
      <rect x="168" y="170" width="28" height="62" rx="12" fill={C.greenSofa} />
      <rect x="278" y="170" width="28" height="62" rx="12" fill={C.greenSofa} />
      <rect x="182" y="196" width="110" height="36" rx="8" fill={C.greenDk2} />
      <rect x="208" y="166" width="58" height="30" rx="8" fill={C.white} />
      <rect x="186" y="232" width="6" height="24" fill={C.char} />
      <rect x="282" y="232" width="6" height="24" fill={C.char} />
      <rect x="336" y="90" width="4" height="162" fill={C.char} />
      <rect x="324" y="250" width="28" height="6" fill={C.char} />
      <path d="M318 94 H358 L348 62 H328 Z" fill={C.orange} />
    </Room>
  ),

  /* 02 LP — 벽 스피커 · 레코드 액자 · 턴테이블 · 콘솔 */
  lp: (
    <Room>
      <rect x="6" y="112" width="54" height="76" rx="3" fill={C.char} />
      <circle cx="33" cy="134" r="9" fill={C.grey} />
      <circle cx="33" cy="166" r="12" fill={C.grey} />
      <rect x="306" y="112" width="54" height="76" rx="3" fill={C.char} />
      <circle cx="333" cy="134" r="9" fill={C.grey} />
      <circle cx="333" cy="166" r="12" fill={C.grey} />
      <rect x="214" y="44" width="66" height="66" fill={C.char} />
      <circle cx="247" cy="77" r="25" fill="#1E1C1B" />
      <circle cx="247" cy="77" r="8" fill={C.orange} />
      <g className="obj">
        <rect x="112" y="170" width="140" height="22" rx="3" fill={C.white} />
        <circle cx="152" cy="181" r="7" fill={C.char} />
        <path d="M236 146 L212 174" stroke={C.char} strokeWidth="4" strokeLinecap="round" />
      </g>
      <rect x="66" y="192" width="236" height="56" fill={C.char} />
      {[C.yellow, C.orange, C.brick, C.white, C.yellow, C.orange, C.brick].map((c, i) => (
        <rect key={i} x={78 + i * 11} y="202" width="7" height="38" fill={c} />
      ))}
      <rect x="168" y="200" width="122" height="42" fill={C.screen} />
      <rect x="78" y="248" width="8" height="8" fill={C.char} />
      <rect x="282" y="248" width="8" height="8" fill={C.char} />
    </Room>
  ),

  /* 03 나무반지 — 다락의 작업 책상 (길쭉한 칸) */
  craft: (
    <>
      <rect x="90" y="96" width="220" height="11" fill={C.char} />
      <rect x="104" y="107" width="9" height="83" fill={C.char} />
      <rect x="287" y="107" width="9" height="83" fill={C.char} />
      <rect x="170" y="140" width="56" height="8" fill={C.orange} />
      <rect x="177" y="148" width="6" height="42" fill={C.orange} />
      <rect x="213" y="148" width="6" height="42" fill={C.orange} />
      <g className="obj">
        <circle cx="146" cy="78" r="14" fill="none" stroke={C.orange} strokeWidth="6" />
        <circle cx="178" cy="85" r="9" fill="none" stroke={C.yellow} strokeWidth="5" />
      </g>
      <path d="M268 66 L261 38 M280 66 L287 36" stroke={C.char} strokeWidth="3" strokeLinecap="round" />
      <rect x="258" y="64" width="28" height="32" fill={C.brick} />
    </>
  ),

  /* 04 스냅사진 — 연두 판 위 감귤나무 · 삼각대 위 카메라 · 노란 꽃 */
  camping: (
    <Lawn>
      <rect x="86" y="158" width="14" height="98" fill={C.trunk} />
      <circle cx="93" cy="118" r="52" fill={C.green} />
      {[[70, 102], [104, 92], [124, 120], [80, 134], [110, 146], [58, 126]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill={C.orange} />
      ))}
      <g className="obj">
        <path d="M236 168 L202 256 M236 168 L270 256 M236 168 V256" stroke={C.char} strokeWidth="5" strokeLinecap="round" />
        <rect x="220" y="104" width="30" height="15" rx="3" fill={C.char} />
        <rect x="196" y="116" width="80" height="52" rx="8" fill={C.char} />
        <circle cx="236" cy="142" r="18" fill={C.tealLt} />
        <circle cx="236" cy="142" r="8" fill={C.teal} />
      </g>
      {[322, 346].map((x, i) => (
        <Flower key={x} x={x} y={i % 2 ? 214 : 206} />
      ))}
    </Lawn>
  ),

  /* 05 영화 — 재생 버튼이 뜬 검은 스크린 · 주황 소파 · 팝콘 */
  cinema: (
    <Room>
      <g className="obj">
        <rect x="44" y="40" width="312" height="110" rx="3" fill={C.char} />
        <rect x="52" y="48" width="296" height="94" fill="#1F1E1D" />
        <circle cx="200" cy="88" r="18" fill="none" stroke={C.white} strokeWidth="3" />
        <path d="M194 79 L210 88 L194 97 Z" fill={C.white} />
        <rect x="72" y="126" width="256" height="3" rx="1.5" fill="#5A5755" />
        <rect x="72" y="126" width="96" height="3" rx="1.5" fill={C.orange} />
        <circle cx="168" cy="127.5" r="5" fill={C.orange} />
      </g>
      <rect x="54" y="166" width="292" height="48" rx="18" fill={C.sofa} />
      <rect x="198" y="170" width="4" height="40" fill={C.sofaDk} />
      <rect x="22" y="188" width="36" height="52" rx="14" fill={C.sofa} />
      <rect x="342" y="188" width="36" height="52" rx="14" fill={C.sofa} />
      <rect x="40" y="200" width="320" height="40" rx="14" fill={C.sofa} />
      <rect x="58" y="240" width="8" height="16" fill={C.char} />
      <rect x="334" y="240" width="8" height="16" fill={C.char} />
      {/* 소파 위 팝콘 — 빨강 · 흰 줄무늬 통 */}
      {[[304, 192, 6, '#FFF3D6'], [312, 186, 7, '#FFF3D6'], [323, 188, 7, '#FFF3D6'], [331, 193, 6, '#FFF3D6'], [318, 181, 6, C.yellow], [308, 191, 3, C.yellow]].map(([x, y, r, f]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={f as string} />
      ))}
      <path d="M300 196 H336 L332 236 H304 Z" fill={C.white} />
      <path d="M306 196 H314 L313 236 H308 Z M322 196 H330 L328 236 H323 Z" fill={C.brick} />
    </Room>
  ),

  /* 06 집밥 — 냉장고 · 조명 · 식탁 위 밥 두 공기와 국 · 초록 의자 */
  homemeal: (
    <Room>
      <rect x="14" y="60" width="72" height="196" rx="6" fill={C.fridge} />
      <rect x="14" y="128" width="72" height="3" fill="#DCD7CD" />
      <rect x="74" y="92" width="4" height="26" rx="2" fill="#BDB7AC" />
      <rect x="74" y="146" width="4" height="34" rx="2" fill="#BDB7AC" />
      <Pendant x={250} len={52} shade={C.orange} />
      <rect x="112" y="160" width="7" height="96" fill={C.cabinet} />
      <rect x="112" y="206" width="40" height="7" fill={C.cabinet} />
      <rect x="145" y="206" width="7" height="50" fill={C.cabinet} />
      <rect x="381" y="160" width="7" height="96" fill={C.cabinet} />
      <rect x="348" y="206" width="40" height="7" fill={C.cabinet} />
      <rect x="348" y="206" width="7" height="50" fill={C.cabinet} />
      <g className="obj">
        <rect x="156" y="178" width="188" height="8" fill={C.char} />
        <rect x="168" y="186" width="7" height="70" fill={C.char} />
        <rect x="325" y="186" width="7" height="70" fill={C.char} />
        {[200, 300].map((x) => (
          <g key={x}>
            <path d={`M${x - 4} 150 c-3 -5 3 -8 0 -13 M${x + 4} 150 c-3 -5 3 -8 0 -13`} fill="none" stroke={C.steam} strokeWidth="2" strokeLinecap="round" />
            <path d={`M${x - 13} 166 C${x - 11} 156 ${x + 11} 156 ${x + 13} 166 Z`} fill={C.rice} />
            <path d={`M${x - 15} 166 H${x + 15} C${x + 14} 174 ${x + 8} 178 ${x} 178 C${x - 8} 178 ${x - 14} 174 ${x - 15} 166 Z`} fill={C.white} />
          </g>
        ))}
        <path d="M238 168 H262 C261 174 256 178 250 178 C244 178 239 174 238 168 Z" fill={C.brick} />
        <ellipse cx="174" cy="176" rx="8" ry="2.5" fill={C.green} />
        <ellipse cx="327" cy="176" rx="8" ry="2.5" fill={C.orange} />
      </g>
    </Room>
  ),

  /* 07 꽃꽂이 — 테이블 위 꽃병 */
  flower: (
    <Room>
      <rect x="74" y="176" width="236" height="8" fill={C.char} />
      <rect x="86" y="184" width="7" height="72" fill={C.char} />
      <rect x="291" y="184" width="7" height="72" fill={C.char} />
      <rect x="228" y="170" width="38" height="4" rx="2" fill={C.green} transform="rotate(-12 247 172)" />
      <g className="obj">
        <path d="M152 176 L146 134 H190 L184 176 Z" fill={C.potGrey} />
        <circle cx="150" cy="118" r="13" fill={C.orange} />
        <circle cx="172" cy="104" r="13" fill={C.yellow} />
        <circle cx="191" cy="122" r="13" fill={C.orange} />
        <circle cx="166" cy="126" r="11" fill={C.white} />
      </g>
    </Room>
  ),

  /* 08 러닝 — 하늘 · 바다 아래 연두 판, 비스듬한 산책길 위 운동화 한 켤레 · 노란 꽃 */
  running: (
    <Lawn>
      <rect width="400" height="74" fill={C.skyLt} />
      <rect y="74" width="400" height="30" fill={C.sea} />
      {[[30, 84], [118, 92], [214, 84], [300, 94], [356, 84]].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="22" height="2.5" rx="1.2" fill={C.white} />
      ))}
      <path d="M-10 256 L392 168 L404 192 L4 276 Z" fill={C.path} />
      <g className="obj">
        {[[118, 208], [204, 196]].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(.4) translate(-120 -222)`}>
            <path d="M120 198 C126 178 144 170 166 172 L192 162 C206 158 218 164 226 174 L268 188 C286 192 292 202 290 212 H120 Z" fill={C.teal} />
            <path d="M120 198 C122 188 128 180 136 176 L144 204 H120 Z" fill={C.orange} />
            <path d="M174 172 l8 10 M186 168 l8 10 M198 166 l8 10" stroke={C.white} strokeWidth="5" strokeLinecap="round" />
            <rect x="116" y="210" width="178" height="12" rx="6" fill={C.white} />
          </g>
        ))}
      </g>
      {[330, 354].map((x, i) => (
        <Flower key={x} x={x} y={i ? 214 : 206} />
      ))}
    </Lawn>
  ),

  /* 09 와인 — 조명 아래 식탁 · 와인 · 빨간 의자 */
  wine: (
    <Room>
      <Pendant x={208} len={64} shade={C.orange} />
      <rect x="84" y="160" width="7" height="96" fill={C.brick} />
      <rect x="84" y="206" width="42" height="7" fill={C.brick} />
      <rect x="119" y="206" width="7" height="50" fill={C.brick} />
      <rect x="309" y="160" width="7" height="96" fill={C.brick} />
      <rect x="274" y="206" width="42" height="7" fill={C.brick} />
      <rect x="274" y="206" width="7" height="50" fill={C.brick} />
      <g className="obj">
        <rect x="124" y="178" width="168" height="8" fill={C.char} />
        <rect x="136" y="186" width="7" height="70" fill={C.char} />
        <rect x="274" y="186" width="7" height="70" fill={C.char} />
        <rect x="160" y="116" width="6" height="18" fill={C.greenDk} />
        <rect x="156" y="130" width="14" height="48" rx="3" fill={C.greenDk} />
        {[200, 224].map((x) => (
          <g key={x}>
            <path d={`M${x - 8} 150 H${x + 8} L${x + 5} 166 H${x - 5} Z`} fill={C.red} />
            <rect x={x - 1} y="166" width="2" height="12" fill={C.char} />
          </g>
        ))}
      </g>
    </Room>
  ),
};
