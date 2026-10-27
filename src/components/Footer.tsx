import { useContent } from '../i18n';
import { href } from '../lib/router';

/** 만든 사람 — 가나다순, 화면에는 세 명 · 두 명 두 줄로 */
const TEAM = ['강성민', '김다혜', '김민서', '남경빈', '여시원'];
const TEAM_ROWS = [TEAM.slice(0, 3), TEAM.slice(3)];

/**
 * 맨 아래 — 스테이 제주로그 · 두 줄 소개 / 가는 선 / FOLLOW US(인스타그램) · MADE BY(만든 사람)
 */
export function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer__inner wrap">
        <div className="footer__about">
          <p className="footer__title">{site.brand}</p>
          <p className="footer__desc pre">{ui.footer.desc}</p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__label">{ui.footer.followUs}</p>
            {/* 웹진 안 인스타그램 페이지로 */}
            <a className="footer__insta" href={href.insta()} data-track="footer_instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" className="footer__dot" />
              </svg>
              @stay.jejulog
            </a>
          </div>
          <div className="footer__col">
            <p className="footer__label">{ui.footer.madeBy}</p>
            <p className="footer__names">
              {TEAM_ROWS.map((row) => (
                <span key={row[0]}>{row.join(' · ')}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
