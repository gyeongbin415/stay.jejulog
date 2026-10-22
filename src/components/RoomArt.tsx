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

  /* 06 집밥 — 시안 그림을 벡터로 (나무 밥상 · 밥 한 공기 · 뚝배기 찌개 · 반찬 여덟 · 수저 · 초록 방석 둘), 파스텔 민트 바탕.
     그림 좌표(503 × 263)를 그대로 쓰고 칸(400 × 260) 가운데에 맞춤 */
  homemeal: (
    <>
      <rect width="400" height="260" fill="#D6EEE4" />
      <svg x="0" y="25" width="400" height="209" viewBox="0 0 503 263">
        {/* 김 */}
        <path d="M182 56 c-6 -7 6 -11 0 -18 c-6 -7 6 -11 0 -18 M194 56 c-6 -7 6 -11 0 -18 c-6 -7 6 -11 0 -18 M343 62 c-5 -6 5 -9 0 -15 c-5 -6 5 -9 0 -15 M354 62 c-5 -6 5 -9 0 -15 c-5 -6 5 -9 0 -15" stroke="#B9B2A6" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <g className="obj">
          {/* 밥상 — 상판 · 앞면 · 다리 */}
          <path d="M100 102 H432 L457 187 H47 Z" fill="#7A4A2A" />
          <path d="M104 104 H428 L432 112 H101 Z" fill="#8A5833" />
          <path d="M47 187 H457 V200 H47 Z" fill="#5E3820" />
          <rect x="64" y="200" width="22" height="43" fill="#5E3820" />
          <rect x="418" y="200" width="22" height="43" fill="#5E3820" />
          <rect x="64" y="200" width="22" height="6" fill="#55321B" />
          <rect x="418" y="200" width="22" height="6" fill="#55321B" />
          {/* 밥 한 공기 */}
          <path d="M158 88 H207 C206 104 196 113 182 113 C168 113 159 104 158 88 Z" fill="#F2EADB" />
          <ellipse cx="182" cy="88" rx="25" ry="7" fill="#FFFFFF" />
          <path d="M162 88 C162 70 202 70 202 88 Z" fill="#FFFFFF" />
          <path d="M168 82 q4 -3 8 0 M180 78 q4 -3 8 0 M190 83 q4 -3 8 0" stroke="#E9E4DA" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* 뚝배기 찌개 — 받침 · 몸통 · 국물 */}
          <ellipse cx="251" cy="130" rx="47" ry="12" fill="#1E1E20" />
          <path d="M210 100 H292 C291 120 278 134 251 134 C224 134 211 120 210 100 Z" fill="#2E2E30" />
          <ellipse cx="251" cy="100" rx="41" ry="12" fill="#3A3A3C" />
          <ellipse cx="251" cy="101" rx="35" ry="9" fill="#C97A3A" />
          <ellipse cx="243" cy="99" rx="7" ry="2.4" fill="#E39B55" />
          <circle cx="262" cy="102" r="2.2" fill="#F0D27A" />
          {/* 반찬 */}
          <path d="M104 116 H148 C147.12 123.48 139.64 127 126 127 C112.36 127 104.88 123.48 104 116 Z" fill="#F4EFE6" />
          <ellipse cx="126" cy="116" rx="22" ry="6.6" fill="#FFFFFF" />
          <ellipse cx="126" cy="116.5" rx="18.5" ry="4.8" fill="#E9E3D8" />
          <path d="M110.16 117 Q126 97.08 141.84 117 Z" fill="#5C9440" />
          <path d="M117.288 111.6 Q124.9 105 133.128 110.72" stroke="#467A2E" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="117.2" cy="108.2" r="2.0" fill="#7DB35A" />
          <circle cx="122.7" cy="105.2" r="2.0" fill="#7DB35A" />
          <circle cx="128.6" cy="105.6" r="2.0" fill="#7DB35A" />
          <circle cx="133.7" cy="108.7" r="2.0" fill="#7DB35A" />
          <circle cx="121.2" cy="110.4" r="2.0" fill="#7DB35A" />
          <circle cx="127.1" cy="108.7" r="2.0" fill="#7DB35A" />
          <circle cx="131.5" cy="110.7" r="2.0" fill="#7DB35A" />
          <path d="M295 100 H341 C340.08 107.82 332.26 111.5 318 111.5 C303.74 111.5 295.92 107.82 295 100 Z" fill="#F4EFE6" />
          <ellipse cx="318" cy="100" rx="23" ry="6.9" fill="#FFFFFF" />
          <ellipse cx="318" cy="100.5" rx="19.3" ry="5.1" fill="#E9E3D8" />
          <path d="M301.44 101 Q318 80.22 334.56 101 Z" fill="#E0673A" />
          <path d="M308.892 95.4 Q316.85 88.5 325.452 94.48" stroke="#C4502A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M352 116 H398 C397.08 123.82 389.26 127.5 375 127.5 C360.74 127.5 352.92 123.82 352 116 Z" fill="#F4EFE6" />
          <ellipse cx="375" cy="116" rx="23" ry="6.9" fill="#FFFFFF" />
          <ellipse cx="375" cy="116.5" rx="19.3" ry="5.1" fill="#E9E3D8" />
          <path d="M358.44 117 Q375 96.22 391.56 117 Z" fill="#D8CB8E" />
          <path d="M365.892 111.4 Q373.85 104.5 382.452 110.48" stroke="#BFAE6C" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M147 136 H205 C203.84 145.86 193.98 150.5 176 150.5 C158.02 150.5 148.16 145.86 147 136 Z" fill="#F4EFE6" />
          <ellipse cx="176" cy="136" rx="29" ry="8.7" fill="#FFFFFF" />
          <ellipse cx="176" cy="136.5" rx="24.4" ry="6.4" fill="#E9E3D8" />
          <path d="M156.86 137 Q176 111.06 195.14 137 Z" fill="#E0673A" />
          <path d="M165.473 130.2 Q174.55 121.5 184.613 129.04" stroke="#C4502A" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M304 129 H346 C345.16 136.14 338.02 139.5 325 139.5 C311.98 139.5 304.84 136.14 304 129 Z" fill="#F4EFE6" />
          <ellipse cx="325" cy="129" rx="21" ry="6.3" fill="#FFFFFF" />
          <ellipse cx="325" cy="129.5" rx="17.6" ry="4.6" fill="#E9E3D8" />
          <path d="M309.88 130 Q325 110.94 340.12 130 Z" fill="#6E8E3E" />
          <path d="M316.684 124.8 Q323.95 118.5 331.804 123.96" stroke="#56742E" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M277 152 H319 C318.16 159.14 311.02 162.5 298 162.5 C284.98 162.5 277.84 159.14 277 152 Z" fill="#F4EFE6" />
          <ellipse cx="298" cy="152" rx="21" ry="6.3" fill="#FFFFFF" />
          <ellipse cx="298" cy="152.5" rx="17.6" ry="4.6" fill="#E9E3D8" />
          <path d="M282.88 153 Q298 133.94 313.12 153 Z" fill="#6EA040" />
          <path d="M289.684 147.8 Q296.95 141.5 304.804 146.96" stroke="#558530" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="289.6" cy="145.3" r="1.9" fill="#8CC062" />
          <circle cx="294.9" cy="142.4" r="1.9" fill="#8CC062" />
          <circle cx="300.5" cy="142.8" r="1.9" fill="#8CC062" />
          <circle cx="305.4" cy="145.7" r="1.9" fill="#8CC062" />
          <circle cx="293.4" cy="147.4" r="1.9" fill="#8CC062" />
          <circle cx="299.1" cy="145.7" r="1.9" fill="#8CC062" />
          <circle cx="303.3" cy="147.6" r="1.9" fill="#8CC062" />
          <path d="M208 161 H268 C266.8 171.2 256.6 176 238 176 C219.4 176 209.2 171.2 208 161 Z" fill="#F4EFE6" />
          <ellipse cx="238" cy="161" rx="30" ry="9.0" fill="#FFFFFF" />
          <ellipse cx="238" cy="161.5" rx="25.2" ry="6.6" fill="#E9E3D8" />
          <path d="M218.2 162 Q238 135.2 257.8 162 Z" fill="#4F6B33" />
          <path d="M227.11 155 Q236.5 146 246.91 153.8" stroke="#3C5525" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M92 150 H140 C140 164.4 129.2 169.68 116 169.68 C102.8 169.68 92 164.4 92 150 Z" fill="#F7F3EC" />
          <ellipse cx="116" cy="150" rx="24" ry="7.7" fill="#FFFFFF" />
          <ellipse cx="116" cy="151" rx="19.2" ry="5.3" fill="#E8D9B0" />
          <path d="M347 143 H401 C401 159.2 388.85 165.14 374 165.14 C359.15 165.14 347 159.2 347 143 Z" fill="#F7F3EC" />
          <ellipse cx="374" cy="143" rx="27" ry="8.6" fill="#FFFFFF" />
          <ellipse cx="374" cy="144" rx="21.6" ry="5.9" fill="#E9DCB8" />
          {/* 수저 */}
          <ellipse cx="349" cy="178" rx="7" ry="3.6" fill="#C9C4BA" />
          <path d="M355 177 H414 M352 182 H416" stroke="#B7B1A6" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        {/* 방석 둘 */}
        {[100, 290].map((x) => (
          <g key={x}>
            <rect x={x} y="214" width="115" height="44" rx="8" fill="#476F44" />
            <rect x={x + 4} y="214" width="107" height="38" rx="7" fill="#527F4F" />
            <rect x={x + 10} y="219" width="95" height="10" rx="5" fill="#628F5D" opacity=".7" />
          </g>
        ))}
      </svg>
    </>
  ),

  /* 07 꽃꽂이 — 연보라 파스텔 벽 · 벽 선반 위 작은 화병 · 테이블 위 유리 꽃병과 가위 · 물뿌리개 */
  flower: (
    <Room wall="#DCD3E8">
      {/* 오른쪽 벽 선반 · 작은 화병 둘 (왼쪽 기준 그림을 240 옮김) */}
      <g transform="translate(240 0)">
      <rect x="44" y="92" width="96" height="6" rx="2" fill={C.wood} />
      <path d="M60 92 L58 74 H72 L70 92 Z" fill="#F4EDD8" />
      <path d="M65 74 V58 M65 66 L58 56" stroke={C.leaf} strokeWidth="1.8" />
      <circle cx="65" cy="55" r="5" fill="#E26B4F" />
      <circle cx="57" cy="54" r="3.5" fill={C.yellow} />
      <path d="M104 92 Q96 82 104 72 H116 Q124 82 116 92 Z" fill="#7FB3A6" />
      <path d="M110 72 V54 M110 64 L118 56 M110 62 L102 54" stroke={C.leaf} strokeWidth="1.8" />
      <circle cx="110" cy="52" r="4" fill={C.white} />
      <circle cx="119" cy="54" r="3.5" fill="#F2A07A" />
      <circle cx="101" cy="52" r="3.5" fill="#F2A07A" />
      </g>
      <Table x={104} w={232} y={190} />
      <g className="obj">
        <path d="M196 190 L190 154 H222 L216 190 Z" fill="#4F8F9C" />
        <path d="M191 160 H221" stroke="#3E7783" strokeWidth="3" />
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
      {/* 리본 */}
      <path d="M140 188 q10 -10 20 0 q-10 -4 -20 0 Z M150 186 l-6 6 M150 186 l8 5" stroke="#D9453C" strokeWidth="2" fill="#E26B4F" strokeLinecap="round" />
      {/* 가위 */}
      <path d="M262 186 L292 176 M262 176 L292 186" stroke={C.grey} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="296" cy="174" r="4" fill="none" stroke={C.grey} strokeWidth="2" />
      <circle cx="296" cy="188" r="4" fill="none" stroke={C.grey} strokeWidth="2" />
      {/* 물뿌리개 */}
      <path d="M346 222 H378 V256 H346 Z" fill="#6FA06A" />
      <path d="M346 230 L326 214 L322 218" stroke="#6FA06A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M352 222 Q362 206 372 222" stroke="#5E8F5A" strokeWidth="4" fill="none" />
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

  /* 09 와인 — 버터 노랑 벽 · 오른쪽 벽 와인랙 · 오크통 · 검정 조명 · 식탁 위 와인병 · 두 잔 · 촛불 · 빨간 의자 */
  wine: (
    <Room wall={C.butter}>
      {/* 오른쪽 벽 와인랙 · 오크통 (왼쪽 기준 그림을 오른쪽 벽으로 300 옮김) */}
      <g transform="translate(300 0)">
      {/* 벽 와인랙 — 칸마다 눕혀 둔 병 끝 */}
      <rect x="14" y="68" width="72" height="108" fill="#8A5A3B" />
      <rect x="18" y="72" width="64" height="100" fill="#6B4A2E" />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => (
          <g key={`${r}-${c}`}>
            <circle cx={30 + c * 20} cy={85 + r * 25} r="8.5" fill={(r + c) % 2 ? '#2F6B3E' : '#5A1E24'} />
            <circle cx={30 + c * 20} cy={85 + r * 25} r="3.5" fill={(r + c) % 2 ? '#4E8C5A' : '#8A3A42'} />
          </g>
        )),
      )}
      {[97, 122, 147].map((y) => (
        <rect key={y} x="18" y={y} width="64" height="2.5" fill="#8A5A3B" />
      ))}
      {/* 오크통 */}
      <path d="M22 200 Q16 228 22 256 H78 Q84 228 78 200 Z" fill="#A86F42" />
      <rect x="18" y="206" width="64" height="5" fill="#4A3B33" />
      <rect x="18" y="245" width="64" height="5" fill="#4A3B33" />
      <path d="M36 200 Q33 228 36 256 M50 200 V256 M64 200 Q67 228 64 256" stroke="#8C5934" strokeWidth="1.5" fill="none" />
      </g>
      {/* 식탁 · 의자 · 조명은 왼쪽으로 56 옮겨 와인랙과 겹치지 않게 */}
      <g transform="translate(-56 0)">
      {/* 조명 아래 따뜻한 불빛 */}
      <ellipse cx="230" cy="150" rx="70" ry="28" fill="#FFE7A8" opacity=".35" />
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
        {/* 촛불 */}
        <rect x="274" y="171" width="12" height="5" rx="1.5" fill="#B9A27A" />
        <rect x="277" y="152" width="6" height="20" rx="1" fill="#FBF3DE" />
        <ellipse cx="280" cy="146" rx="3.4" ry="6" fill="#F39A2B" />
        <ellipse cx="280" cy="148" rx="1.8" ry="3.4" fill="#FFE08A" />
      </g>
      </g>
    </Room>
  ),
};
