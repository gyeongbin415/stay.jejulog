/**
 * X 글쓰기 창 — 문구와 링크를 채워서 엶.
 * 휴대폰: X 앱 주소(twitter://post)로 바로 열어 앱에 로그인된 내 계정의 글쓰기 화면으로.
 *   (웹 주소로 열면 사파리 · 카카오톡 안 브라우저에서 앱으로 안 넘어가고 x.com 로그인 화면이 뜸)
 *   사파리는 'X에서 열겠습니까?' 확인 창을 먼저 띄우는데, 그동안 웹으로 넘기면 확인을 누르기 전에 로그인 화면이 떠 버림 —
 *   그래서 확인 창이 뜨거나(창이 포커스를 잃음) 앱으로 넘어가면(화면이 가려짐) 웹으로 넘기지 않고,
 *   아무 반응 없이 3초가 지나면(앱이 없는 경우) 그때만 웹 글쓰기 창으로.
 * 컴퓨터: 웹 글쓰기 창을 새 탭으로.
 */
export function openXPost(text: string, url: string) {
  const web = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  if (!window.matchMedia('(pointer: coarse)').matches) {
    window.open(web, '_blank', 'noopener,noreferrer');
    return;
  }
  let left = false;
  const mark = () => {
    left = true;
  };
  const events = ['blur', 'pagehide', 'visibilitychange'] as const;
  events.forEach((e) => window.addEventListener(e, mark, { once: true }));
  window.location.href = `twitter://post?message=${encodeURIComponent(`${text} ${url}`)}`;
  setTimeout(() => {
    events.forEach((e) => window.removeEventListener(e, mark));
    if (!left && !document.hidden) window.location.href = web;
  }, 3000);
}
