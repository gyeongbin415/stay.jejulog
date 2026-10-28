/**
 * X 글쓰기 창 — 문구와 링크를 채워서 엶.
 * 휴대폰: X 앱 주소(twitter://post)로 바로 열어 앱에 로그인된 내 계정의 글쓰기 화면으로.
 *   (웹 주소로 열면 사파리 · 카카오톡 안 브라우저에서 앱으로 안 넘어가고 x.com 로그인 화면이 뜸)
 *   앱이 없어 1.5초 안에 화면이 넘어가지 않으면 웹 글쓰기 창으로.
 * 컴퓨터: 웹 글쓰기 창을 새 탭으로.
 */
export function openXPost(text: string, url: string) {
  const web = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  if (!window.matchMedia('(pointer: coarse)').matches) {
    window.open(web, '_blank', 'noopener,noreferrer');
    return;
  }
  window.location.href = `twitter://post?message=${encodeURIComponent(`${text} ${url}`)}`;
  setTimeout(() => {
    if (!document.hidden) window.location.href = web;
  }, 1500);
}
