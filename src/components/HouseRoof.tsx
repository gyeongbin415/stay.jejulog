/**
 * 집 지붕 · 박공 · 굴뚝 — 집 탐색 페이지의 집, 그리고 메인 페이지 체크인 · 체크아웃 위(지붕만).
 * viewBox -70 0 900 300, 아래 몸체(벽 · 문) x 0–760 — 양쪽 처마가 몸체보다 70씩 넓습니다.
 */
/** 지붕선 중심 y — 꼭대기 (380, 32), 경사 258 / 436 */
const eaveY = (x: number) => 32 + Math.abs(x - 380) * (258 / 436);

export function HouseRoof({ className, roofOnly = false }: { className: string; roofOnly?: boolean }) {
  // roofOnly — 박공 · 벽 없이 갈색 지붕선과 굴뚝만 (메인 페이지 체크인 · 체크아웃 위). 굴뚝 밑동은 경사에 맞춰 잘라 선 아래로 나오지 않습니다
  return (
    <svg className={className} viewBox="-70 0 900 300" aria-hidden="true" focusable="false">
      {roofOnly ? (
        <path d={`M520 34 H578 V${eaveY(578)} L520 ${eaveY(520)} Z`} fill="#3A3735" />
      ) : (
        <rect x="520" y="34" width="58" height="104" fill="#3A3735" />
      )}
      {[[538, 54], [562, 76], [538, 100]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="6.5" fill="#6E6A68" />
      ))}
      {!roofOnly && (
        <>
          <path d="M0 300 V262 L380 46 L760 262 V300 Z" fill="#F2DEC0" />
          <rect x="0" y="252" width="20" height="48" fill="#7B4628" />
          <rect x="740" y="252" width="20" height="48" fill="#7B4628" />
        </>
      )}
      <path d="M-56 290 L380 32 L816 290" fill="none" stroke="#5E321C" strokeWidth="26" strokeLinejoin="round" />
    </svg>
  );
}
