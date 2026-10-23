import { useContent } from '../i18n';

/** 만든 사람 — 가나다순 */
const TEAM = ['강성민', '김다혜', '김민서', '남경빈', '여시원'];

export function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer__inner wrap">
        <div>
          <p className="footer__logo">{site.brandEn}</p>
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
