import type { ReactNode } from 'react';
import type { ProgramId } from '../data/types';

/* ------------------------------------------------------------------
   집 내부 9개 공간 — 외곽선 없는 플랫 일러스트 (방마다 벽 색이 다른 시안)
   · 실내 · 마당 viewBox 400 × 260 (바닥 y 256), 다락 400 × 190 (지붕 박공 위, 배경 없음)
   · 벽: 독서 세이지 · LP 하늘 · 영화 · 꽃 살구분홍 · 와인 노랑 · 집밥 연보라
   · 마당: 하늘 · 구름 · 풀밭 (스냅사진), 하늘 · 바다 · 모래사장 · 운동화 (러닝)
   · 클릭 대상이 되는 사물은 <g className="obj"> 로 묶어 호버 때 살짝 커집니다.
------------------------------------------------------------------- */

const C = {
  white: '#FFFFFF',
  cream: '#F4EDD8',
  char: '#2E2E30',
  charLt: '#3A3A3C',
  grey: '#9A9EA3',
  wood: '#6B4A2E',
  woodLt: '#B07A45',
  woodPale: '#C9965C',
  green: '#3F8A57',
  greenDk: '#357A4B',
  leaf: '#4E8C5A',
  leafLt: '#6FA86A',
  orange: '#E8873A',
  orangeLt: '#F39A2B',
  yellow: '#F6D46A',
  red: '#D9453C',
  redDk: '#B8372F',
  blue: '#2E6FD6',
  sky: '#A9D8F0',
  sea: '#2E9BD6',
  seaLt: '#5DB6E3',
  sand: '#F0DDB8',
  grass: '#9CCB7E',
  grassDk: '#5E9F55',
  trunk: '#8A5A3B',
  /* 방 벽 */
  sage: '#B7D3A9',
  skyRoom: '#BBD7E7',
  salmon: '#F2C3B9',
  butter: '#F8DE97',
  lilac: '#D9CDE1',
};

export const YARD_ROOMS: ProgramId[] = ['camping', 'running'];

export function RoomArt({ id }: { id: ProgramId }) {
  // 다락은 위로 60만큼 빈 자리를 두어 이름표가 그림(스탠드 · 붓통)과 겹치지 않게 (휴대폰 포함)
  const viewBox = id === 'craft' ? '0 -60 400 250' : '0 0 400 260';
  return (
    <svg className="room__art" viewBox={viewBox} preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      {ART[id]}
    </svg>
  );
}

/** 실내 공통 — 방마다 다른 벽 색 */
function Room({ wall, children }: { wall: string; children: ReactNode }) {
  return (
    <>
      <rect width="400" height="260" fill={wall} />
      {children}
    </>
  );
}

/** 천장에 매단 조명 (원뿔 갓) */
function Pendant({ x, len, shade }: { x: number; len: number; shade: string }) {
  return (
    <>
      <rect x={x - 1} y="0" width="2" height={len} fill={C.char} />
      <path d={`M${x - 22} ${len + 24} H${x + 22} L${x + 4} ${len} H${x - 4} Z`} fill={shade} />
      <circle cx={x} cy={len + 28} r="5" fill={C.yellow} />
    </>
  );
}

/** 식탁 · 테이블 — 상판과 다리 둘 */
function Table({ x, w, y, color = C.wood }: { x: number; w: number; y: number; color?: string }) {
  return (
    <>
      <rect x={x} y={y} width={w} height="8" fill={color} />
      <rect x={x + 10} y={y + 8} width="7" height={256 - y - 8} fill={color} />
      <rect x={x + w - 17} y={y + 8} width="7" height={256 - y - 8} fill={color} />
    </>
  );
}

/** 의자 — 등받이가 바깥쪽 (dir 1: 왼쪽 의자, -1: 오른쪽 의자) */
function Chair({ x, dir, color }: { x: number; dir: 1 | -1; color: string }) {
  const back = dir === 1 ? x : x + 34;
  return (
    <>
      <rect x={back} y="158" width="10" height="56" rx="4" fill={color} />
      <rect x={x} y="206" width="44" height="10" rx="3" fill={color} />
      <rect x={x + 4} y="216" width="5" height="40" fill={C.char} />
      <rect x={x + 35} y="216" width="5" height="40" fill={C.char} />
    </>
  );
}

/** 하늘의 뭉게구름 */
function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="22" ry="10" fill={C.white} />
      <circle cx="-6" cy="-6" r="10" fill={C.white} />
      <circle cx="8" cy="-8" r="12" fill={C.white} />
    </g>
  );
}

/** 마당의 노란 꽃 */
function Flower({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect x={x - 1.2} y={y} width="2.4" height={256 - y} fill={C.grassDk} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * 5} cy={y + Math.sin((a * Math.PI) / 180) * 5} r="4" fill={C.yellow} />
      ))}
      <circle cx={x} cy={y} r="3" fill={C.orange} />
    </>
  );
}

/** 덤불 — 둥근 잎 뭉치 */
function Bush({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <>
      <circle cx={x - r * 0.7} cy={y} r={r * 0.75} fill={color} />
      <circle cx={x} cy={y - r * 0.35} r={r} fill={color} />
      <circle cx={x + r * 0.75} cy={y + r * 0.05} r={r * 0.7} fill={color} />
    </>
  );
}

const BOOKS = ['#3E7C8C', C.orange, '#F0DA7A', C.red, '#E8A13A', '#5A8F6A', '#F4E4C1', '#3E7C8C', C.red];

const ART: Record<ProgramId, ReactNode> = {
  /* 01 독서 — 세이지 벽 · 책장 · 잎 액자 · 초록 안락의자 · 노란 스탠드 */
  book: (
    <Room wall={C.sage}>
      <g className="obj">
        <rect x="28" y="70" width="108" height="186" fill={C.char} />
        {[0, 1, 2].map((r) =>
          BOOKS.map((c, i) => (
            <rect key={`${r}-${i}`} x={35 + i * 10.8} y={80 + r * 58} width="8.6" height="50" fill={BOOKS[(i + r * 2) % BOOKS.length] ?? c} />
          )),
        )}
      </g>
      <rect x="196" y="52" width="44" height="56" fill="#7A7468" />
      <rect x="200" y="56" width="36" height="48" fill="#F4EFE3" />
      <path d="M218 96 V70 M218 84 Q208 78 210 70 Q216 74 218 84 M218 78 Q228 72 226 64 Q220 68 218 78" stroke={C.leaf} strokeWidth="2.5" fill={C.leafLt} />
      {/* 안락의자 */}
      <rect x="214" y="150" width="112" height="78" rx="20" fill={C.green} />
      <rect x="198" y="186" width="32" height="56" rx="12" fill={C.greenDk} />
      <rect x="310" y="186" width="32" height="56" rx="12" fill={C.greenDk} />
      <rect x="214" y="206" width="112" height="36" rx="10" fill={C.greenDk} />
      <rect x="244" y="170" width="52" height="34" rx="8" fill={C.cream} />
      <rect x="208" y="242" width="6" height="14" fill={C.char} />
      <rect x="328" y="242" width="6" height="14" fill={C.char} />
      {/* 스탠드 */}
      <rect x="364" y="96" width="4" height="156" fill={C.char} />
      <rect x="350" y="250" width="32" height="6" rx="3" fill={C.char} />
      <path d="M344 98 H388 L376 58 H356 Z" fill={C.yellow} />
    </Room>
  ),

  /* 02 LP — 하늘색 벽 · 가운데 LP 포스터 · 양쪽 스피커 · 나무 수납장 위 턴테이블 */
  lp: (
    <Room wall={C.skyRoom}>
      {/* 벽 가운데 LP 포스터 — 레코드판 그림 */}
      <rect x="172" y="34" width="58" height="80" rx="2" fill={C.char} />
      <rect x="176" y="38" width="50" height="72" fill="#F0883A" />
      <circle cx="201" cy="68" r="19" fill="#151516" />
      <circle cx="201" cy="68" r="13" fill="none" stroke="#3A3A3C" strokeWidth="1.5" />
      <circle cx="201" cy="68" r="6" fill={C.yellow} />
      <circle cx="201" cy="68" r="1.6" fill="#151516" />
      <rect x="184" y="94" width="34" height="3.5" rx="1.75" fill={C.white} />
      <rect x="190" y="101" width="22" height="3" rx="1.5" fill="#FBD9BE" />
      {[22, 320].map((x) => (
        <g key={x}>
          <rect x={x} y="128" width="58" height="108" rx="6" fill={C.char} />
          {[160, 206].map((cy) => (
            <g key={cy}>
              <circle cx={x + 29} cy={cy} r="16" fill="#D9DDE0" />
              <circle cx={x + 29} cy={cy} r="9" fill={C.char} />
            </g>
          ))}
        </g>
      ))}
      <rect x="102" y="186" width="198" height="60" rx="4" fill={C.woodLt} />
      <rect x="110" y="194" width="74" height="44" fill="#8E5E33" />
      {['#3E7C8C', C.red, '#F0DA7A', C.orange, C.white, '#5A8F6A', C.red, '#3E7C8C'].map((c, i) => (
        <rect key={i} x={114 + i * 8.6} y="198" width="6.4" height="38" fill={c} />
      ))}
      <rect x="192" y="194" width="100" height="44" fill={C.woodPale} />
      <circle cx="242" cy="216" r="3" fill={C.char} />
      <rect x="110" y="246" width="6" height="10" fill={C.char} />
      <rect x="286" y="246" width="6" height="10" fill={C.char} />
      <g className="obj">
        <rect x="140" y="166" width="118" height="20" rx="4" fill={C.charLt} />
        <ellipse cx="184" cy="165" rx="34" ry="6" fill="#151516" />
        <ellipse cx="184" cy="165" rx="7" ry="2" fill={C.red} />
        <path d="M236 168 L232 150 L210 160" stroke={C.char} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="236" cy="168" r="4" fill={C.grey} />
        <rect x="262" y="174" width="30" height="12" rx="2" fill={C.woodPale} />
      </g>
    </Room>
  ),

  /* 03 나무반지 — 다락 작업실: 초록 스탠드 · 검은 작업 매트 위 나무반지 · 붓통 · 작은 병 · 서랍장 · 의자 */
  craft: (
    <>
      {/* 작업대 */}
      <rect x="22" y="112" width="278" height="9" fill={C.wood} />
      <rect x="34" y="121" width="8" height="69" fill={C.wood} />
      <rect x="280" y="121" width="8" height="69" fill={C.wood} />
      {/* 스탠드 조명 — 받침 · 꺾인 팔 · 반지 쪽으로 기울인 초록 갓, 불빛이 매트 위 반지에 떨어짐 */}
      <path d="M127 74 L155 40 L218 96 L166 116 Z" fill={C.yellow} opacity=".28" />
      <rect x="32" y="102" width="36" height="10" rx="3" fill={C.woodPale} />
      <path d="M50 102 L66 50 L118 38" stroke={C.woodPale} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="66" cy="50" r="5" fill="#A87C48" />
      <g transform="translate(126 44) rotate(-50)">
        <path d="M-16 0 Q0 -20 16 0 L22 20 H-22 Z" fill={C.green} />
        <rect x="-22" y="18" width="44" height="4" rx="2" fill={C.greenDk} />
        <ellipse cx="0" cy="23" rx="10" ry="4" fill={C.yellow} />
        <circle cx="0" cy="-10" r="4" fill="#A87C48" />
      </g>
      {/* 작은 병 */}
      <rect x="104" y="84" width="12" height="28" rx="3" fill={C.char} />
      <rect x="107" y="78" width="6" height="7" fill="#5A5A5C" />
      {/* 검은 작업 매트 위 나무반지 */}
      <path d="M128 112 L140 92 H226 L238 112 Z" fill={C.char} />
      <g className="obj">
        <ellipse cx="183" cy="103" rx="17" ry="7.5" fill="#8E5E33" />
        <rect x="166" y="97" width="34" height="6" fill="#8E5E33" />
        <ellipse cx="183" cy="97" rx="17" ry="7.5" fill={C.woodPale} />
        <ellipse cx="183" cy="97" rx="13.5" ry="5.5" fill="#D6A76E" />
        <ellipse cx="183" cy="97" rx="8.5" ry="3.2" fill="#7A4F2B" />
        <path d="M174 94.5 Q183 91.5 192 94.5" stroke="#E9C590" strokeWidth="1.2" fill="none" />
      </g>
      {/* 붓통 */}
      <path d="M248 66 L240 34 M255 66 L253 26 M262 66 L266 30 M268 66 L278 38" stroke={C.char} strokeWidth="3" strokeLinecap="round" />
      <circle cx="240" cy="34" r="2.5" fill={C.red} />
      <circle cx="266" cy="30" r="2.5" fill={C.orange} />
      <path d="M240 66 H276 L272 112 H244 Z" fill="#E8A13A" />
      <rect x="240" y="66" width="36" height="5" fill="#D18E2C" />
      {/* 작은 초록 병 */}
      <rect x="284" y="88" width="13" height="24" rx="3" fill="#3E5F4A" />
      <rect x="287" y="82" width="7" height="7" fill={C.char} />
      {/* 서랍장 */}
      <rect x="312" y="96" width="74" height="94" fill={C.woodPale} />
      {[102, 131, 160].map((y) => (
        <g key={y}>
          <rect x="318" y={y} width="62" height="24" fill="#D6A76E" />
          <rect x="342" y={y + 10} width="14" height="4" rx="2" fill={C.wood} />
        </g>
      ))}
      {/* 의자 */}
      <rect x="132" y="146" width="62" height="9" rx="2" fill={C.woodPale} />
      <rect x="138" y="155" width="7" height="35" fill={C.woodPale} />
      <rect x="181" y="155" width="7" height="35" fill={C.woodPale} />
    </>
  ),

  /* 04 스냅사진 — 하늘 · 구름 · 풀밭 · 감귤나무 · 삼각대 위 카메라 · 노란 꽃 */
  camping: (
    <>
      <rect width="400" height="260" fill={C.sky} />
      <Cloud x={312} y={44} />
      <Cloud x={366} y={78} s={0.7} />
      <path d="M0 196 Q90 168 200 190 T400 182 V260 H0 Z" fill={C.grassDk} />
      <rect y="208" width="400" height="52" fill={C.grass} />
      <Bush x={358} y={214} r={30} color="#4E8C4A" />
      <rect x="92" y="150" width="16" height="106" fill={C.trunk} />
      <g>
        <circle cx="100" cy="118" r="58" fill="#3F8A4E" />
        <circle cx="64" cy="140" r="30" fill="#3F8A4E" />
        <circle cx="140" cy="140" r="30" fill="#3F8A4E" />
        {[[70, 96], [104, 80], [134, 104], [84, 128], [118, 136], [56, 142], [146, 148], [100, 106], [132, 76]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill={C.orangeLt} />
        ))}
      </g>
      <g className="obj">
        <path d="M240 172 L208 256 M240 172 L272 256 M240 172 V256" stroke={C.char} strokeWidth="5" strokeLinecap="round" />
        <rect x="222" y="114" width="26" height="13" rx="3" fill={C.char} />
        <rect x="204" y="124" width="72" height="50" rx="8" fill={C.charLt} />
        <circle cx="240" cy="149" r="17" fill="#1F5FA8" />
        <circle cx="240" cy="149" r="9" fill="#9FD0F0" />
        <rect x="258" y="130" width="10" height="5" rx="2" fill={C.orange} />
      </g>
      {[[28, 226], [48, 236], [300, 230], [322, 240], [186, 238]].map(([x, y]) => (
        <Flower key={`${x}-${y}`} x={x} y={y} />
      ))}
    </>
  ),

  /* 05 영화 — 살구분홍 벽 · 재생 화면 · 주황 소파 · 팝콘 */
  cinema: (
    <Room wall={C.salmon}>
      <g className="obj">
        <rect x="104" y="40" width="200" height="106" rx="3" fill={C.char} />
        <circle cx="204" cy="88" r="19" fill="none" stroke={C.white} strokeWidth="3.5" />
        <path d="M197 78 L214 88 L197 98 Z" fill={C.white} />
        <rect x="124" y="126" width="160" height="3.5" rx="1.75" fill="#5A5755" />
        <rect x="124" y="126" width="74" height="3.5" rx="1.75" fill={C.red} />
        <circle cx="198" cy="127.75" r="5" fill={C.red} />
      </g>
      <rect x="62" y="160" width="128" height="52" rx="14" fill="#E07A3E" />
      <rect x="194" y="160" width="128" height="52" rx="14" fill="#E07A3E" />
      <rect x="34" y="186" width="34" height="56" rx="12" fill="#D06B32" />
      <rect x="316" y="186" width="34" height="56" rx="12" fill="#D06B32" />
      <rect x="50" y="202" width="284" height="40" rx="12" fill="#E07A3E" />
      <rect x="60" y="242" width="7" height="14" fill={C.char} />
      <rect x="318" y="242" width="7" height="14" fill={C.char} />
      {/* 팝콘 */}
      <path d="M354 170 L346 150" stroke={C.char} strokeWidth="2.5" strokeLinecap="round" />
      {[[346, 186, 8], [358, 180, 9], [370, 186, 8], [352, 176, 6], [364, 174, 6]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#FFF3D6" />
      ))}
      <circle cx="356" cy="182" r="3" fill={C.yellow} />
      <path d="M336 190 H380 L374 252 H342 Z" fill={C.white} />
      <path d="M342 190 H351 L349.5 252 H344 Z M360 190 H369 L366 252 H361.5 Z" fill={C.red} />
    </Room>
  ),

  /* 06 집밥 — 시안 그림 그대로 (나무 밥상 위 밥 · 뚝배기 · 반찬, 초록 방석). 그림 비율이 더 가로로 길어 위쪽은 같은 베이지로 채움 */
  homemeal: (
    <>
      <rect width="400" height="260" fill="#EEE3CE" />
      <g className="obj">
        <image href="rooms/homemeal.png" x="0" y="0" width="400" height="260" preserveAspectRatio="xMidYMax meet" />
      </g>
    </>
  ),

  /* 07 꽃꽂이 — 살구분홍 벽 · 테이블 위 유리 꽃병 · 가위 */
  flower: (
    <Room wall={C.salmon}>
      <Table x={104} w={232} y={190} />
      <g className="obj">
        <path d="M196 190 L190 154 H222 L216 190 Z" fill="#CFE5E6" opacity=".85" />
        <path d="M206 190 V128 M206 160 L190 124 M206 160 L224 120 M206 168 L180 140 M206 168 L234 138" stroke={C.leaf} strokeWidth="2" />
        <path d="M184 142 q-8 -6 -4 -12 q6 2 4 12 Z M230 138 q8 -6 4 -12 q-6 2 -4 12 Z" fill={C.leaf} />
        {[[190, 120, '#E26B4F'], [206, 106, C.white], [224, 116, C.orange], [178, 136, C.orange], [236, 134, '#E26B4F'], [212, 126, '#F2A07A']].map(([x, y, c]) => (
          <g key={`${x}-${y}`}>
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} cx={(x as number) + Math.cos((a * Math.PI) / 180) * 6} cy={(y as number) + Math.sin((a * Math.PI) / 180) * 6} r="5" fill={c as string} />
            ))}
            <circle cx={x as number} cy={y as number} r="3.5" fill="#F6C945" />
          </g>
        ))}
      </g>
      {/* 가위 */}
      <path d="M262 186 L292 176 M262 176 L292 186" stroke={C.grey} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="296" cy="174" r="4" fill="none" stroke={C.grey} strokeWidth="2" />
      <circle cx="296" cy="188" r="4" fill="none" stroke={C.grey} strokeWidth="2" />
    </Room>
  ),

  /* 08 러닝 — 하늘 · 바다 · 모래사장 · 덤불 · 모래 위 운동화 한 켤레 */
  running: (
    <>
      <rect width="400" height="260" fill={C.sky} />
      <Cloud x={150} y={48} s={0.8} />
      <Cloud x={340} y={36} />
      <path d="M250 112 Q320 84 400 92 V116 H250 Z" fill="#5C9A63" />
      <rect y="112" width="400" height="62" fill={C.sea} />
      <rect y="112" width="400" height="10" fill={C.seaLt} />
      <path d="M0 196 Q120 168 230 176 T400 160 V260 H0 Z" fill={C.white} opacity=".7" />
      <path d="M0 202 Q120 176 230 184 T400 168 V260 H0 Z" fill={C.sand} />
      <Bush x={26} y={236} r={30} color="#4E8C4A" />
      <Bush x={380} y={226} r={34} color="#4E8C4A" />
      {/* 모래 위 운동화 한 켤레 */}
      <g className="obj">
        {[[120, 222], [212, 212]].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <path d="M0 14 C2 2 12 -4 26 -2 L40 -10 C48 -14 56 -10 60 -4 L82 4 C92 7 96 12 96 18 H0 Z" fill={C.blue} />
            <path d="M0 14 C1 6 6 1 12 -1 L18 16 H0 Z" fill={C.orange} />
            <path d="M36 -6 l6 8 M44 -9 l6 8 M52 -10 l6 8" stroke={C.white} strokeWidth="2.6" strokeLinecap="round" />
            <path d="M66 4 Q76 8 84 14" stroke="#9FC0F2" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <rect x="-2" y="16" width="100" height="8" rx="4" fill={C.white} />
          </g>
        ))}
      </g>
    </>
  ),

  /* 09 와인 — 버터 노랑 벽 · 검정 조명 · 식탁 위 와인병과 두 잔 · 빨간 의자 */
  wine: (
    <Room wall={C.butter}>
      <Pendant x={230} len={56} shade={C.char} />
      <Chair x={96} dir={1} color={C.red} />
      <Chair x={300} dir={-1} color={C.red} />
      <g className="obj">
        <Table x={150} w={140} y={176} />
        <rect x="178" y="108" width="7" height="22" fill="#2F6B3E" />
        <rect x="172" y="126" width="19" height="50" rx="5" fill="#3E7C4A" />
        <rect x="174" y="146" width="15" height="12" fill="#F4EDD8" />
        {[228, 256].map((x) => (
          <g key={x}>
            <path d={`M${x - 10} 140 H${x + 10} C${x + 10} 154 ${x + 5} 160 ${x} 160 C${x - 5} 160 ${x - 10} 154 ${x - 10} 140 Z`} fill="#F4F0EA" />
            <path d={`M${x - 9} 148 H${x + 9} C${x + 8} 155 ${x + 4} 159 ${x} 159 C${x - 4} 159 ${x - 8} 155 ${x - 9} 148 Z`} fill={C.redDk} />
            <rect x={x - 1} y="160" width="2" height="14" fill="#F4F0EA" />
            <rect x={x - 6} y="173" width="12" height="3" rx="1.5" fill="#F4F0EA" />
          </g>
        ))}
      </g>
    </Room>
  ),
};
