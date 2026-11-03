import type { CSSProperties, ReactNode } from 'react';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { INSTA_PROFILE } from '../data/insta';
import houseUrl from '../assets/house-icon.png';
import crabUrl from '../assets/gehage-crab.webp';
import tasteMapUrl from '../assets/taste-map-paper.png';
import noteUrl from '../assets/guest-note.png';

/* ------------------------------------------------------------------
   메인 폴더 — 서류철 한 권을 책처럼 넘겨 봄
   · 장 순서: 처음(CHECK IN) → 집 → 취향 테스트 → 취향 지도 → 방명록. 앞 장일수록 위
   · 처음: 마닐라 폴더(왼쪽 세로 탭) 앞에 구멍 뚫린 종이 한 장을 검은 집게가 물고 있고, 뒤에 타자 친 서류가 비침
     — 종이에 큰 제목 · 작은 문장 · 손글씨 메모 (cover — HomePage 에서 넘김)
   · 스크롤을 한 번 내릴 때마다 맨 위 장이 왼쪽 가장자리를 축으로 책장처럼 넘어가고 다음 폴더가 드러남
     (단계는 인트로가 맡음 — HomePage Intro 의 STEPS 끝에 폴더 넷)
   · 폴더 — 오른쪽 옆 세로 탭(이름만, 위에서부터 차례로 어긋나 모두 보임) · 안에 접힌 자국 있는 종이:
     [ 번호 ] · 항목 이름 : 굵은 문장 · 기울인 메모 · 버튼, 오른쪽 위에 클립으로 끼운 폴라로이드 사진
   · 탭을 누르면 그 폴더까지 넘어감. 그림 · 버튼을 누르면 상세페이지로
   · 동작 줄이기 설정이면 고정 없이 네 폴더를 차례로 펼쳐 보여 줌
------------------------------------------------------------------- */

export const FOLDER_KEYS = ['house', 'test', 'map', 'guest'] as const;
/** 메뉴 · 뒤로 가기가 찾아오는 자리 이름 (예전 메인 칸 이름 그대로) */
export const FOLDER_IDS = ['roomtour', 'find', 'tastemap', 'guest'] as const;

type Row = { k: string; v: string; em?: boolean };
type Case = { label: string; en: string; rows: Row[]; art: string; artW: number; artH: number; cta: string; to: string; track: string };

/** open — 드러난 폴더(0 · 1 · 2 · 3, 없으면 -1 — 처음) · onPick — 폴더 탭을 눌렀을 때 · cover — 처음 장 */
export function HomeFolders({ open, onPick, still = false, cover }: { open: number; onPick: (i: number) => void; still?: boolean; cover?: ReactNode }) {
  const { site: SITE, ui } = useContent();

  const cases: Case[] = [
    {
      label: ui.nav.house,
      en: 'EXPLORE',
      rows: [
        { k: SITE.explore.label, v: SITE.explore.title.join(' ') },
        { k: 'NOTE', v: SITE.explore.sub, em: true },
      ],
      art: houseUrl, artW: 900, artH: 630,
      cta: ui.nav.house, to: href.house(), track: 'home_roomtour',
    },
    {
      label: ui.nav.test,
      en: 'TEST',
      rows: [
        { k: SITE.findYourStay.label, v: SITE.findYourStay.title.join(' ') },
        { k: 'NOTE', v: ui.test.storyBody, em: true },
      ],
      art: crabUrl, artW: 900, artH: 616,
      cta: SITE.findYourStay.cta, to: href.test(), track: 'find_cta',
    },
    {
      label: ui.deck.tastemap,
      en: 'MAP',
      rows: [
        { k: 'AROUND JEJU', v: ui.map.homeTitle.replace(/\n/g, ' ') },
        { k: 'NOTE', v: ui.map.sub, em: true },
      ],
      art: tasteMapUrl, artW: 1100, artH: 707,
      cta: ui.map.open, to: href.map(), track: 'home_taste_map',
    },
    {
      label: ui.nav.guest,
      en: 'GUESTBOOK',
      rows: [
        { k: 'GUEST NOTE', v: ui.guest.title.replace(/\n/g, ' ') },
        { k: 'NOTE', v: ui.guest.sub, em: true },
      ],
      art: noteUrl, artW: 900, artH: 708,
      cta: ui.guest.open, to: href.guest(), track: 'guest_cta',
    },
  ];

  return (
    <div className={`folders${still ? ' folders--still' : ''}`} data-open={open}>
      {/* 처음 장 — 스크롤하면 맨 먼저 넘어감 */}
      {cover && (
        <div className={`folders__cover${open >= 0 ? ' is-turned' : ''}`} inert={open >= 0 ? true : undefined}>
          {cover}
        </div>
      )}
      {cases.map((c, i) => (
        <section
          key={FOLDER_KEYS[i]}
          id={still ? FOLDER_IDS[i] : undefined}
          className={`folder folder--${FOLDER_KEYS[i]}${open === i ? ' is-up' : ''}${!still && i < open ? ' is-turned' : ''}`}
          style={{ '--i': i } as CSSProperties}
          aria-labelledby={`folder-tab-${i}`}
          data-tone="light"
        >
          {/* 오른쪽 옆 세로 탭 — 이름만 (게하 탐색) */}
          <div className="folder__tab">
            <button type="button" id={`folder-tab-${i}`} className="folder__pick" onClick={() => onPick(i)} aria-expanded={open === i} data-track={`home_folder_${FOLDER_KEYS[i]}`}>
              {c.label}
            </button>
          </div>
          {/* 종이 — 접힌 자국, 서류철 같은 글 배치 (드러난 폴더만 누를 수 있음) */}
          <div className="folder__sheet" inert={!still && open !== i ? true : undefined}>
            <p className="case__no">[ {c.en} 0{i + 1} ]</p>
            {c.rows.map((r) => (
              <div key={r.k} className="case__row">
                <p className="case__k">{r.k}:</p>
                <p className={`case__v${r.em ? ' case__v--em' : ''}`}>{r.em ? `“${r.v.replace(/\n/g, ' ')}”` : r.v}</p>
              </div>
            ))}
            <a className="btn case__cta" href={c.to} data-track={c.track}>
              {c.cta} <span className="arrow" aria-hidden="true">→</span>
            </a>
            <p className="case__foot">@{INSTA_PROFILE.handle}</p>
            {/* 오른쪽 위 — 클립으로 끼운 폴라로이드 (누르면 상세페이지로) */}
            <a className="case__polaroid" href={c.to} aria-label={c.cta} tabIndex={-1}>
              <span className="case__clip" aria-hidden="true" />
              <span className="case__photo">
                <img src={c.art} alt="" width={c.artW} height={c.artH} loading="lazy" decoding="async" />
              </span>
              <span className="case__caption" aria-hidden="true">{c.en}</span>
            </a>
          </div>
        </section>
      ))}
    </div>
  );
}
