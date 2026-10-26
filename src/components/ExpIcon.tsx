import type { ProgramId } from '../data/types';

/**
 * 아홉 가지 경험 아이콘 — 상세페이지 아이콘(주소 · 대표 프로그램)과 같은 선 굵기의 24 × 24 선 그림.
 * 글자색(currentColor)을 따라가므로 카드 호버 때 함께 색이 바뀝니다.
 */
export function ExpIcon({ id, className }: { id: ProgramId; className?: string }) {
  const props = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <g {...props}>
        {/* 나무반지 — 두께 있는 반지와 나뭇결 */}
        {id === 'craft' && (
          <>
            <circle cx="12" cy="13" r="7.5" />
            <circle cx="12" cy="13" r="4.8" />
            <path d="M8.2 6.9 C9.6 6.2 10.8 6 12 6 M17.6 10.4 C17.9 11.2 18 12 18 13" />
          </>
        )}
        {/* 책 — 펼친 책 */}
        {id === 'book' && <path d="M12 6.5 C10 5 7 4.8 4 5.5 V18.5 C7 17.8 10 18 12 19.5 C14 18 17 17.8 20 18.5 V5.5 C17 4.8 14 5 12 6.5 Z M12 6.5 V19.5" />}
        {/* 꽃꽂이 — 튤립 한 송이 */}
        {id === 'flower' && (
          <>
            <path d="M12 12.5 C8.8 12.5 7.6 9.8 8.2 6.5 L10.3 8.2 L12 5 L13.7 8.2 L15.8 6.5 C16.4 9.8 15.2 12.5 12 12.5 Z" />
            <path d="M12 12.5 V21 M12 18 C9.6 18 8 16.4 7.4 14.2 C9.8 14.2 11.4 15.8 12 18" />
          </>
        )}
        {/* 영화 — 슬레이트(클래퍼보드) */}
        {id === 'cinema' && (
          <>
            <rect x="3.5" y="10" width="17" height="10" rx="1.5" />
            <g transform="rotate(-13 3.5 9)">
              <rect x="3.5" y="5.6" width="17" height="3.4" rx=".8" />
              <path d="M8.4 5.6 L7.2 9 M12.8 5.6 L11.6 9 M17.2 5.6 L16 9" />
            </g>
          </>
        )}
        {/* LP — 레코드판 */}
        {id === 'lp' && (
          <>
            <circle cx="12" cy="12" r="8.5" />
            <circle cx="12" cy="12" r="2.8" />
            <path d="M7.2 8.6 A6 6 0 0 1 9.4 6.6 M16.8 15.4 A6 6 0 0 1 14.6 17.4" />
          </>
        )}
        {/* 집밥 — 소복한 밥공기 */}
        {id === 'homemeal' && (
          <>
            <path d="M3.8 12 H20.2 C20.2 16.4 16.6 19.2 12 19.2 C7.4 19.2 3.8 16.4 3.8 12 Z" />
            <path d="M6.4 12 C6.8 9 9.2 7.2 12 7.2 C14.8 7.2 17.2 9 17.6 12 M9.6 19 V20.6 H14.4 V19" />
            <path d="M10.2 3.6 C9.4 4.4 11 5 10.2 5.8 M13.8 3.6 C13 4.4 14.6 5 13.8 5.8" />
          </>
        )}
        {/* 와인 — 와인잔 */}
        {id === 'wine' && (
          <>
            <path d="M8 3.5 H16 C16 8 14.8 11 12 11.2 C9.2 11 8 8 8 3.5 Z M8.3 7 H15.7" />
            <path d="M12 11.2 V20 M8.5 20.3 H15.5" />
          </>
        )}
        {/* 스냅사진 — 카메라 */}
        {id === 'camping' && (
          <>
            <path d="M5 7.5 H8.3 L9.8 5 H14.2 L15.7 7.5 H19 A2 2 0 0 1 21 9.5 V18 A2 2 0 0 1 19 20 H5 A2 2 0 0 1 3 18 V9.5 A2 2 0 0 1 5 7.5 Z" />
            <circle cx="12" cy="13.5" r="3.6" />
            <path d="M17.6 10.4 H17.7" />
          </>
        )}
        {/* 러닝 — 운동화 */}
        {id === 'running' && (
          <>
            <path d="M3 16.8 V11.6 C3 10.8 3.7 10.3 4.5 10.6 L7.8 11.8 L10 7.6 C11.6 9 13.2 9.8 15 10.3 L18.8 11.3 C20.2 11.7 21 12.8 21 14.2 V16.8 Z" />
            <path d="M3 16.8 V18.6 H21 V16.8 M11.2 9.8 L12.6 11 M13.2 9.2 L14.4 10.4" />
          </>
        )}
      </g>
    </svg>
  );
}
