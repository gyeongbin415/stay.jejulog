/**
 * X 글쓰기 창 — 문구와 링크를 채워서 엶. 휴대폰은 같은 창에서 열어 X 앱(로그인된 내 계정)으로 바로 넘어가게
 * (카카오톡 같은 앱 안 브라우저도 X 앱으로 넘김), 컴퓨터는 새 탭.
 */
export function openXPost(text: string, url: string) {
  const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  if (window.matchMedia('(pointer: coarse)').matches) window.location.href = u;
  else window.open(u, '_blank', 'noopener,noreferrer');
}
