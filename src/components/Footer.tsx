import { useContent } from '../i18n';
import logoUrl from '../assets/logo-staylog.png';

const LOGO_STYLE = { WebkitMaskImage: `url(${logoUrl})`, maskImage: `url(${logoUrl})` };

/** 만든 사람 — 가나다순 */
const TEAM = ['강성민', '김다혜', '김민서', '남경빈', '여시원'];

export function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer__inner wrap">
        <div>
          {/* Stay Log 로고 — 상단 바와 같은 그림, 어두운 바탕이라 밝은 주황 */}
          <p className="footer__logo">
            <span className="footer__mark" style={LOGO_STYLE} aria-hidden="true" />
            <span className="visually-hidden">{site.brandEn}</span>
          </p>
          <p className="footer__ko">{site.brand} — {ui.footer.tagline}</p>
        </div>
        <div className="footer__team">
          <p className="label label--light">{ui.footer.madeBy}</p>
          <ul className="footer__names">
            {TEAM.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
