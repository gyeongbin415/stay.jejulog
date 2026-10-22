/**
 * 집 지붕 · 박공 · 굴뚝 — 집 탐색 섹션의 집.
 * viewBox -70 0 900 300, 아래 몸체(벽) x 0–760 — 양쪽 처마가 몸체보다 70씩 넓습니다.
 */
export function HouseRoof({ className, roofOnly = false }: { className: string; roofOnly?: boolean }) {
  // roofOnly — 박공 · 벽 없이 갈색 지붕선만 (굴뚝은 지붕 오른쪽 경사, 박공과 지붕선 뒤로 밑동이 가려짐)
  return (
    <svg className={className} viewBox="-70 0 900 300" aria-hidden="true" focusable="false">
      <rect x="520" y="34" width="58" height="104" fill="#3A3735" />
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
      <path d="M-56 290 L380 32 L816 290" fill="none" stroke="#5E321C" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
