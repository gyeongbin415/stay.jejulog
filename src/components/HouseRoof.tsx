/**
 * 집 지붕 · 박공 — 집 탐색 섹션의 집 (굴뚝 없음).
 * viewBox -70 0 900 300, 아래 몸체(벽) x 0–760 — 양쪽 처마가 몸체보다 70씩 넓습니다.
 */
export function HouseRoof({ className, roofOnly = false }: { className: string; roofOnly?: boolean }) {
  // roofOnly — 박공 · 벽 없이 갈색 지붕선만
  return (
    <svg className={className} viewBox="-70 0 900 300" aria-hidden="true" focusable="false">
      {!roofOnly && (
        <>
          <path d="M0 300 V262 L380 46 L760 262 V300 Z" fill="#F2DEC0" />
          <rect x="0" y="252" width="20" height="48" fill="#7B4628" />
          <rect x="740" y="252" width="20" height="48" fill="#7B4628" />
        </>
      )}
      <path d="M-56 290 L380 32 L816 290" fill="none" stroke="#5E321C" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
