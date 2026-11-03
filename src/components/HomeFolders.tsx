import type { CSSProperties, ReactNode } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import houseUrl from '../assets/house-icon.png';
import tasteMapUrl from '../assets/taste-map-paper.png';
import noteUrl from '../assets/guest-note.png';

/* ------------------------------------------------------------------
   메인 폴더 — 탭 달린 폴더 넷을 화면 아래쪽에 한 묶음으로, 우리 사진들이 폴더 안에서 위로 삐져나와 흩어져 있고
   맨 앞면에 CHECK IN 글 (photos · cover — HomePage 에서 넘김)
   · 스크롤을 한 번 내릴 때마다 폴더 하나가 올라와 화면을 채우고, 다음에 내리면 내려가며 다음 폴더가 올라옴
     (단계는 인트로가 맡음 — HomePage Intro 의 STEPS 끝에 폴더 넷)
   · 탭을 누르면 그 폴더로, 올라온 폴더의 X 를 누르면 내림. 폴더 안 그림 · 버튼을 누르면 상세페이지로
   · 동작 줄이기 설정이면 고정 없이 네 폴더를 차례로 펼쳐 보여 줌
------------------------------------------------------------------- */

export const FOLDER_KEYS = ['house', 'test', 'map', 'guest'] as const;
/** 메뉴 · 뒤로 가기가 찾아오는 자리 이름 (예전 메인 칸 이름 그대로) */
export const FOLDER_IDS = ['roomtour', 'find', 'tastemap', 'guest'] as const;

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
  </svg>
);

/** open — 올라온 폴더(0 · 1 · 2 · 3, 없으면 -1) · onPick — 폴더를 눌렀을 때 · onClose — 올라온 폴더의 X · photos — 폴더 뒤로 삐져나온 사진 · cover — 맨 앞면 글 */
export function HomeFolders({ open, onPick, onClose = () => {}, still = false, photos, cover }: { open: number; onPick: (i: number) => void; onClose?: () => void; still?: boolean; photos?: ReactNode; cover?: ReactNode }) {
  const { site: SITE, ui } = useContent();

  const bodies: { label: string; en: string; body: ReactNode }[] = [
    {
      label: ui.nav.house,
      en: 'EXPLORE',
      body: (
        <a className="roomtour__link" href={href.house()} data-track="home_roomtour">
          <img className="folder__art" src={houseUrl} alt="" width={900} height={630} loading="lazy" decoding="async" />
          <span className="roomtour__btn">
            <span>{SITE.explore.title.join(' ')}</span>
            <Arrow />
          </span>
        </a>
      ),
    },
    {
      label: ui.nav.test,
      en: 'TEST',
      body: (
        <>
          <p className="label">{SITE.findYourStay.label}</p>
          <h2 className="section-head__title">
            {SITE.findYourStay.title.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <a className="btn" href={href.test()} data-track="find_cta">
            {SITE.findYourStay.cta} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </>
      ),
    },
    {
      label: ui.deck.tastemap,
      en: 'MAP',
      body: (
        <>
          <p className="label">AROUND JEJU</p>
          <h2 className="section-head__title pre">{ui.map.homeTitle}</h2>
          <a className="tastemap" href={href.map()} data-track="home_taste_map" aria-label={ui.map.open}>
            <img className="folder__art" src={tasteMapUrl} alt="" width={1100} height={707} loading="lazy" decoding="async" />
          </a>
          <p className="tastemap__hint">
            <span className="tastemap__pin" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2.5a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Zm0 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
              </svg>
            </span>
            {ui.map.cta}
          </p>
        </>
      ),
    },
    {
      label: ui.nav.guest,
      en: 'GUESTBOOK',
      body: (
        <>
          <p className="label">GUEST NOTE</p>
          <a className="gnote__art" href={href.guest()} aria-label={ui.guest.open} data-track="guest_open">
            <img className="folder__art" src={noteUrl} alt="" width={900} height={708} loading="lazy" decoding="async" />
          </a>
          <a className="btn" href={href.guest()} data-track="guest_cta">
            {ui.guest.open} <span className="arrow" aria-hidden="true">→</span>
          </a>
        </>
      ),
    },
  ];

  return (
    <div className={`folders${still ? ' folders--still' : ''}`} data-open={open}>
      {/* 폴더 뒤 — 위로 삐져나와 흩어진 사진 */}
      {photos && <div className="folders__photos" aria-hidden="true">{photos}</div>}
      {bodies.map((b, i) => (
        <section
          key={FOLDER_KEYS[i]}
          id={still ? FOLDER_IDS[i] : undefined}
          className={`folder folder--${FOLDER_KEYS[i]}${open === i ? ' is-up' : ''}`}
          style={{ '--i': i } as CSSProperties}
          aria-labelledby={`folder-tab-${i}`}
          data-tone="light"
          // 깔려 있는 폴더는 어디를 눌러도(탭 · 보이는 몸통) 그 폴더가 올라옴 — 속 링크로는 가지 않음
          onClickCapture={(e) => {
            if (still || open === i) return;
            e.preventDefault();
            e.stopPropagation();
            onPick(i);
          }}
        >
          <div className="folder__tab">
            <button type="button" id={`folder-tab-${i}`} className="folder__pick" onClick={() => onPick(i)} aria-expanded={open === i} data-track={`home_folder_${FOLDER_KEYS[i]}`}>
              <span className="folder__no">0{i + 1}</span>
              {b.label}
              <span className="folder__en">{b.en}</span>
            </button>
            {/* 올라온 폴더 — 탭 옆 X 로 내림 */}
            {!still && open === i && (
              <button type="button" className="folder__close" onClick={onClose} aria-label={ui.deck.close(b.label)} data-track={`home_folder_close_${FOLDER_KEYS[i]}`}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </div>
          <div className="folder__body">
            {b.body}
          </div>
        </section>
      ))}
      {/* 맨 앞면 — 폴더 파일 위에 적은 글 (올라온 폴더가 덮음) */}
      {cover && (
        <div className="folders__cover" inert={open >= 0 ? true : undefined}>
          {cover}
        </div>
      )}
    </div>
  );
}
