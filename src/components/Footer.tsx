import { useContent } from '../i18n';

export function Footer() {
  const { site, ui } = useContent();
  return (
    <footer className="footer" data-tone="dark">
      <div className="footer__inner wrap">
        <div>
          <p className="footer__logo">{site.brandEn}</p>
          <p className="footer__ko">{site.brand} — {ui.footer.tagline}</p>
        </div>
        <p className="footer__note">
          {site.issue}
          <br />
          {ui.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
