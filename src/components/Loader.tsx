/**
 * 로딩 화면 — 지도를 든 소라게 · '오늘의 보금자리 찾는 중…' (받은 그림 그대로, public/loading.webp)
 * 밑의 점 세 개는 주황 점이 한 칸씩 옮겨 가며 기다리는 중임을 보여 줍니다.
 * 첫 화면이 뜨기 전에는 index.html 의 같은 모양(#boot-loader)이 대신 보입니다.
 */
export function Loader({ label }: { label: string }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <img className="loader__art" src="loading.webp" alt="" width={640} height={465} />
      <span className="loader__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
