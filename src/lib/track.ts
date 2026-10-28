/* ------------------------------------------------------------------
   데이터 추적
   · 화면설계서의 '데이터 추적용 이름표'가 각 요소의 data-track 속성입니다.
   · 클릭하면 window.dataLayer 로 { event: 'click', track: '이름표' } 가 쌓입니다.
     (GA4 · GTM 을 연결하면 그대로 수집됩니다. 개발 모드에서는 콘솔에도 찍힙니다.)
------------------------------------------------------------------- */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, detail: Record<string, unknown> = {}) {
  (window.dataLayer ??= []).push({ event, ...detail });
  if (import.meta.env.DEV) console.debug('[track]', event, detail);
}

export function installClickTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      // GA4 매개변수 — data-ga-guesthouse · data-ga-program · data-ga-rank 가 있으면 함께 (lib/gaParams.ts)
      const d = el.dataset;
      track('click', {
        track: d.track,
        ...(d.gaGuesthouse ? { guesthouse_name: d.gaGuesthouse } : null),
        ...(d.gaProgram ? { program_type: d.gaProgram } : null),
        ...(d.gaRank ? { result_rank: Number(d.gaRank) } : null),
      });
    },
    { capture: true },
  );
}
