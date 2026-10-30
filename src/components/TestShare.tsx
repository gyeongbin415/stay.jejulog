import { useState } from 'react';
import { useContent } from '../i18n';
import { absUrl, href } from '../lib/router';
import { track } from '../lib/track';
import { openXPost } from '../lib/shareX';

/**
 * 테스트 공유하기 — 메인 '테스트 바로가기' 밑. 취향 테스트 첫 화면 링크를 카카오톡 · X · 링크 복사로 나눔.
 * 카카오톡은 기기의 공유 창(휴대폰이면 카카오톡이 목록에 바로 뜸), 공유 창이 없는 컴퓨터는 링크를 복사해 붙여 넣게.
 */
export function TestShare() {
  const { ui } = useContent();
  const t = ui.home;
  const [status, setStatus] = useState('');
  const url = absUrl(href.test());
  const hit = (via: string) => track('test_share', { via });

  const copy = async () => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(url);
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  };
  const shareKakao = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url });
        setStatus('');
      } else {
        await copy();
        setStatus(t.testShareKakaoCopied);
      }
      hit('kakao');
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') setStatus(t.testShareFailed);
    }
  };
  // X — 문구 · 링크가 채워진 글쓰기 창으로 (휴대폰은 X 앱)
  const shareX = () => {
    hit('x');
    openXPost(t.testShareXText, url);
  };
  const copyLink = async () => {
    try {
      await copy();
      setStatus(t.testShareCopied);
      hit('link');
    } catch {
      setStatus(t.testShareFailed);
    }
  };

  return (
    <div className="tshare">
      <p className="tshare__title">
        {t.testShareTitle}
        <svg className="tshare__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="18" cy="5.5" r="2.6" />
          <circle cx="6" cy="12" r="2.6" />
          <circle cx="18" cy="18.5" r="2.6" />
          <path d="M8.3 10.8 15.7 6.7M8.3 13.2l7.4 4.1" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </p>
      <div className="tshare__row">
        <button type="button" className="tshare__btn tshare__btn--kakao" onClick={shareKakao} aria-label={t.testShareKakao} title={t.testShareKakao} data-track="test_share_kakao">
          <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
            <path d="M24 11c-9.4 0-17 5.9-17 13.2 0 4.7 3.1 8.8 7.8 11.1l-1.6 5.9c-.1.5.4.9.8.6l7-4.6c1 .1 2 .2 3 .2 9.4 0 17-5.9 17-13.2S33.4 11 24 11z" fill="#3A1D1D" />
            <text x="24" y="27.8" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="Arial, sans-serif" fill="#FEE500" letterSpacing=".3">TALK</text>
          </svg>
        </button>
        <button type="button" className="tshare__btn tshare__btn--x" onClick={shareX} aria-label={t.testShareX} title={t.testShareX} data-track="test_share_x">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.19L2 3h6.33l4.37 5.77L17.75 3zm-1.08 16.18h1.7L7.4 4.73H5.58l11.09 14.45z" fill="#fff" />
          </svg>
        </button>
        <button type="button" className="tshare__btn tshare__btn--link" onClick={copyLink} aria-label={t.testShareLink} title={t.testShareLink} data-track="test_share_link">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" />
            <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
          </svg>
        </button>
      </div>
      <p className="tshare__status" role="status">{status}</p>
    </div>
  );
}
