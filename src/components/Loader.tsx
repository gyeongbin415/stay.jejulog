/**
 * 로딩 화면 — 지도를 든 소라게 · '오늘의 보금자리 찾는 중…' (받은 그림 그대로, public/loading-crab.webp · loading-text.webp)
 * 소라게는 작게, 글씨는 메인 '에디터가 직접 제주에…' 문장과 같은 크기로 따로 맞춤
 * 밑의 점 세 개는 주황 점이 한 칸씩 옮겨 가며 기다리는 중임을 보여 줍니다.
 * 첫 화면이 뜨기 전에는 index.html 의 같은 모양(#boot-loader)이 대신 보입니다.
 */
export function Loader({ label }: { label: string }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <img className="loader__art" src="loading-crab.webp" alt="" width={636} height={361} />
      <img className="loader__text" src="loading-text.webp" alt="" width={514} height={76} />
      <span className="loader__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
