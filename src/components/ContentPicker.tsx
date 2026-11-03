import { useRef, type MouseEvent } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { prefersReducedMotion } from '../lib/motion';
import houseUrl from '../assets/house-3d.webp';
import crabUrl from '../assets/gehage-crab.webp';
import islandUrl from '../assets/taste-map-island.webp';
import logoUrl from '../assets/logo-staylog.png';

/* ------------------------------------------------------------------
   PC 메인 — 콘텐츠 고르기 (집 · 취향 테스트 · 취향 지도 · 방명록 공책)
   · 올리면 살짝 떠오름
   · 누르면: 고른 그림이 화면 가운데로 커지며 앞으로 나오고 → 나머지 그림 · 배경은 흐려지며 사라짐
     → 다 커지면(약 0.7초) 그 상세페이지로. 상세가 뜨면 덮개가 걷힘
   · 그림은 받은 그림 그대로 (공책은 방명록 칸의 표지와 같은 모양)
------------------------------------------------------------------- */

/** 전환 시간(ms) */
const DUR = 700;
const EASE = 'cubic-bezier(.65, 0, .35, 1)';

/** 고른 그림을 화면 가운데로 키우며 덮은 뒤 주소로 이동 */
function enter(a: HTMLAnchorElement, art: HTMLElement, list: HTMLElement) {
  const r = art.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const s = Math.min((vw * 0.5) / r.width, (vh * 0.55) / r.height, 2.6);
  const dx = vw / 2 - (r.left + r.width / 2);
  const dy = vh / 2 - (r.top + r.height / 2);

  // 덮개(배경색) + 고른 그림 복사본 — 페이지 등장 애니메이션(transform) 밖, 화면에 바로 고정
  const veil = document.createElement('div');
  veil.className = 'pickzoom';
  const clone = art.cloneNode(true) as HTMLElement;
  clone.classList.add('pickzoom__art');
  Object.assign(clone.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  veil.appendChild(clone);
  document.body.appendChild(veil);
  art.style.visibility = 'hidden';
  list.classList.add('is-leaving');
  a.closest('.picker__item')?.classList.add('is-picked');

  veil.animate([{ backgroundColor: 'rgba(250, 250, 243, 0)' }, { backgroundColor: 'rgba(250, 250, 243, 1)' }], { duration: DUR, easing: EASE, fill: 'forwards' });
  clone.animate([{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }], { duration: DUR, easing: EASE, fill: 'forwards' });

  window.setTimeout(() => {
    const before = window.location.href;
    window.location.assign(a.href);
    // 같은 문서 안 이동(#/house 등)이면 새 화면이 그려진 뒤 덮개를 걷음 (테스트처럼 새 페이지를 여는 주소면 그대로 넘어감)
    if (new URL(a.href).pathname === new URL(before).pathname) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const out = veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease-out', fill: 'forwards' });
          out.onfinish = () => veil.remove();
        }),
      );
    }
  }, DUR);
}

export function ContentPicker() {
  const { site: SITE, ui } = useContent();
  const list = useRef<HTMLUListElement>(null);
  const busy = useRef(false);

  const items = [
    { key: 'house', en: 'EXPLORE', label: ui.nav.house, to: href.house(), art: <img src={houseUrl} alt="" width={1089} height={1445} loading="lazy" decoding="async" /> },
    { key: 'test', en: 'TEST', label: ui.nav.test, to: href.test(), art: <img src={crabUrl} alt="" loading="lazy" decoding="async" /> },
    { key: 'map', en: 'MAP', label: ui.deck.tastemap, to: href.map(), art: <img src={islandUrl} alt="" loading="lazy" decoding="async" /> },
    {
      key: 'guest',
      en: 'GUESTBOOK',
      label: ui.nav.guest,
      to: href.guest(),
      art: (
        <span className="gcover picker__book">
          <span className="gcover__back" />
          <span className="gcover__page" />
          <span className="gcover__face">
            <span className="gcover__hand">MY JEJU NOTE</span>
            <span className="gcover__window">
              <img src={logoUrl} alt="" draggable={false} />
            </span>
            <span className="gcover__mark">STAY JEJULOG</span>
          </span>
        </span>
      ),
    },
  ];

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || prefersReducedMotion()) return;
    const art = e.currentTarget.querySelector<HTMLElement>('.picker__art');
    if (!art || !list.current) return;
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    enter(e.currentTarget, art, list.current);
  };

  return (
    <section id="roomtour" className="picker" data-tone="light" aria-labelledby="roomtour-title">
      <h2 id="roomtour-title" className="picker__title">{SITE.explore.title.join(' ')}</h2>
      <ul className="picker__list" ref={list}>
        {items.map((it) => (
          <li key={it.key} className={`picker__item picker__item--${it.key}`}>
            <a href={it.to} onClick={onClick} data-track={`home_pick_${it.key}`}>
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
