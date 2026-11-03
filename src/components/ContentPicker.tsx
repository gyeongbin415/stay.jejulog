import { useContent } from '../i18n';
import { href } from '../lib/router';
import houseUrl from '../assets/house-icon.png';
import testArtUrl from '../assets/test-clipboard.png';
import tasteMapUrl from '../assets/taste-map-paper.png';
import noteUrl from '../assets/guest-note.png';

/* ------------------------------------------------------------------
   PC 메인 — 콘텐츠 고르기 (집 · 취향 테스트 · 취향 지도 · 방명록 공책)
   · 올리면 살짝 떠오름
   · 누르면 바로 그 상세페이지로 (그림이 커지는 전환 없이)
   · 그림은 받은 그림 그대로 (공책은 방명록 칸의 표지와 같은 모양)
------------------------------------------------------------------- */

export function ContentPicker() {
  const { site: SITE, ui } = useContent();

  const items = [
    { key: 'house', en: 'EXPLORE', label: ui.nav.house, to: href.house(), art: <img src={houseUrl} alt="" width={900} height={630} loading="lazy" decoding="async" /> },
    { key: 'test', en: 'TEST', label: ui.nav.test, to: href.test(), art: <img src={testArtUrl} alt="" width={821} height={985} loading="lazy" decoding="async" /> },
    { key: 'map', en: 'MAP', label: ui.deck.tastemap, to: href.map(), art: <img src={tasteMapUrl} alt="" width={1100} height={707} loading="lazy" decoding="async" /> },
    { key: 'guest', en: 'GUESTBOOK', label: ui.nav.guest, to: href.guest(), art: <img src={noteUrl} alt="" width={900} height={708} loading="lazy" decoding="async" /> },
  ];

  return (
    <section id="roomtour" className="picker" data-tone="light" aria-labelledby="roomtour-title">
      {/* 제목 — 화면에는 안 보이고 화면 낭독기용으로만 */}
      <h2 id="roomtour-title" className="visually-hidden">{SITE.explore.title.join(' ')}</h2>
      <ul className="picker__list">
        {items.map((it) => (
          <li key={it.key} className={`picker__item picker__item--${it.key}`}>
            <a href={it.to} data-track={`home_pick_${it.key}`}>
              <span className="picker__art" aria-hidden="true">{it.art}</span>
              <span className="picker__name">{it.label}</span>
              <span className="label label--muted">{it.en}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
