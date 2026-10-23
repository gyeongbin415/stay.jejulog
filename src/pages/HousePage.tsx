import { useState } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { RoomArt } from '../components/RoomArt';
import bookFrame from '../assets/windows/book-frame.webp';
import bookCover from '../assets/windows/book-cover.webp';
import craftFrame from '../assets/windows/craft-frame.webp';
import craftCover from '../assets/windows/craft-cover.webp';
import flowerFrame from '../assets/windows/flower-frame.webp';
import flowerCover from '../assets/windows/flower-cover.webp';
import cinemaFrame from '../assets/windows/cinema-frame.webp';
import cinemaCover from '../assets/windows/cinema-cover.webp';
import lpFrame from '../assets/windows/lp-frame.webp';
import lpCover from '../assets/windows/lp-cover.webp';
import homemealFrame from '../assets/windows/homemeal-frame.webp';
import homemealCover from '../assets/windows/homemeal-cover.webp';
import runningFrame from '../assets/windows/running-frame.webp';
import runningCover from '../assets/windows/running-cover.webp';
import campingFrame from '../assets/windows/camping-frame.webp';
import campingCover from '../assets/windows/camping-cover.webp';
import wineFrame from '../assets/windows/wine-frame.webp';
import wineCover from '../assets/windows/wine-cover.webp';

/**
 * PAGE 02 — 창문 탐색 (ROOM TOUR)
 * 벽에 난 창문 아홉 개. 닫힌 창(커튼 · 블라인드 · 간유리 · 덧창)에 이름이 적혀 있고,
 * 마우스를 올리면 창이 열려 방 안이 보입니다(이름은 사라짐). 누르면 해당 게스트하우스 상세페이지로 이동합니다.
 * '목록'을 누르면 그림 대신 아홉 가지 경험을 이름으로 한눈에 보여 줍니다.
 */
type View = 'house' | 'list';
const VIEW_KEY = 'jejulog:house-view';

function readView(): View {
  try {
    return sessionStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'house';
  } catch {
    return 'house';
  }
}

/** embedded — 메인 페이지 안 한 섹션으로 (제목은 h2, 위쪽 여백은 상단 바 없이) */
export function HousePage({ embedded = false }: { embedded?: boolean }) {
  const { site, ui, experiences, programById } = useContent();
  const SITE = site;
  const Title = embedded ? 'h2' : 'h1';
  // 목록 보기도 창문 순서대로
  const listed = WINDOWS.map((w) => experiences.find((e) => e.id === w.id)!).filter(Boolean);
  // 상세페이지에 다녀와도 보던 방식이 유지되도록 이 탭에서만 기억합니다.
  const [view, setView] = useState<View>(readView);
  const choose = (v: View) => {
    setView(v);
    try {
      sessionStorage.setItem(VIEW_KEY, v);
    } catch {
      /* 저장소를 쓸 수 없어도 화면 전환은 그대로 */
    }
  };

  return (
    <section id="explore" className={`explore${embedded ? ' explore--home' : ''}`} data-tone="light" aria-labelledby="explore-title">
      <header className="explore__head wrap">
        <p className="label">{SITE.explore.label}</p>
        <Title id="explore-title" className="explore__title">
          {SITE.explore.title.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </Title>
        <p className="explore__sub pre">{SITE.explore.sub}</p>
        <p className="explore__hint">
          <span className="explore__dot" aria-hidden="true" />
          {SITE.explore.hint}
        </p>
        <div className="explore__toggle" role="group" aria-label={ui.house.viewGroup}>
          <button type="button" aria-pressed={view === 'house'} onClick={() => choose('house')} data-track="house_view_house">
            {ui.house.viewHouse}
          </button>
          <button type="button" aria-pressed={view === 'list'} onClick={() => choose('list')} data-track="house_view_list">
            {ui.house.viewList}
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <nav className="explist wrap" aria-label={ui.house.listAria}>
          <ol className="explist__grid">
            {listed.map((e) => (
              <li key={e.id}>
                <a className="explist__item" href={href.stay(e.id)} data-track={`house_list_${e.id}`}>
                  <span className="explist__name">{e.label}</span>
                  <span className="explist__place">{programById[e.id].report.place.name}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
      <nav className="facade wrap" aria-label={ui.house.houseAria}>
        {/* 1024 × 1610 비율의 벽 — 창문을 정해 둔 좌표에 불규칙하게 놓고 (창 위 이름표 자리만큼 줄 사이를 띄움), 화면에 맞춰 통째로 줄어듦 */}
        <div className="facade__wall">
          {WINDOWS.map((w) => (
            <Window key={w.id} {...w} />
          ))}
        </div>
      </nav>
      )}
    </section>
  );
}

/**
 * 창문 아홉 개 — 받은 창문 그림(1024 × 1536)을 창마다 따로 오려 씀. 초록 창틀은 웹진 메인 짙은 주황(--orange-ink)으로, 초록 벽은 투명.
 * 한 창 = 창틀 그림(frame, 큰 창 자리만 뚫림) + 큰 창 자리의 방 그림 + 그 앞을 가린 커튼 · 블라인드 · 간유리 · 덧창(cover).
 * l · t · w 는 벽 위 위치 · 너비(벽 1024 × 1610 기준 %) — 줄을 맞추지 않고 열마다 높이 · 좌우를 조금씩 어긋나게, 겹치지 않게. ratio 는 창 그림 비율,
 * pane 은 큰 창 자리(창 그림 기준 % — 왼쪽 · 위 · 너비 · 높이).
 */
type Cover = 'curtain' | 'blind' | 'frost' | 'shutter';
type WindowArt = { id: ProgramId; frame: string; cover: string; kind: Cover; l: number; t: number; w: number; ratio: string; pane: [number, number, number, number] };
const WINDOWS: WindowArt[] = [
  { id: 'book', frame: bookFrame, cover: bookCover, kind: 'curtain', l: 2.93, t: 8.70, w: 25.68, ratio: '263 / 340', pane: [11.03, 26.18, 77.57, 63.82] },
  { id: 'craft', frame: craftFrame, cover: craftCover, kind: 'blind', l: 35.16, t: 4.97, w: 26.86, ratio: '275 / 386', pane: [13.82, 25.91, 73.45, 65.03] },
  { id: 'flower', frame: flowerFrame, cover: flowerCover, kind: 'frost', l: 68.36, t: 11.18, w: 25.78, ratio: '264 / 332', pane: [10.98, 27.71, 77.65, 61.75] },
  { id: 'cinema', frame: cinemaFrame, cover: cinemaCover, kind: 'blind', l: 4.88, t: 37.89, w: 28.32, ratio: '290 / 378', pane: [12.07, 26.46, 75.86, 64.29] },
  { id: 'lp', frame: lpFrame, cover: lpCover, kind: 'curtain', l: 37.11, t: 36.65, w: 25.98, ratio: '266 / 385', pane: [12.41, 25.71, 75.19, 65.19] },
  { id: 'homemeal', frame: homemealFrame, cover: homemealCover, kind: 'frost', l: 69.34, t: 40.99, w: 27.15, ratio: '278 / 374', pane: [11.15, 26.2, 77.34, 64.44] },
  { id: 'running', frame: runningFrame, cover: runningCover, kind: 'shutter', l: 1.95, t: 70.19, w: 26.86, ratio: '275 / 400', pane: [14.55, 26.5, 70.91, 62] },
  { id: 'camping', frame: campingFrame, cover: campingCover, kind: 'frost', l: 38.09, t: 68.94, w: 27.54, ratio: '282 / 392', pane: [12.77, 26.79, 74.82, 63.78] },
  { id: 'wine', frame: wineFrame, cover: wineCover, kind: 'curtain', l: 70.31, t: 72.67, w: 26.76, ratio: '274 / 399', pane: [10.95, 24.06, 78.1, 66.67] },
];

/** 창 하나 — 따로 떨어진 요소(id: window-…)라 창마다 클릭 · 호버 · 여는 그림을 따로 붙일 수 있음 */
function Window({ id, frame, cover, kind, l, t, w, ratio, pane }: WindowArt) {
  const { ui, experienceById, programById } = useContent();
  const e = experienceById[id];
  const place = programById[id].report.place.name;
  const [pl, pt, pw, ph] = pane;
  const half = { backgroundImage: `url(${cover})` };
  return (
    <a
      id={`window-${id}`}
      className={`win win--${kind}`}
      href={href.stay(id)}
      aria-label={ui.house.roomAria(e.no, e.label, place)}
      data-track={`house_${id}`}
      style={{ left: `${l}%`, top: `${t}%`, width: `${w}%`, aspectRatio: ratio }}
    >
      {/* 큰 창 자리 — 방 그림, 그 앞을 가린 두 짝 */}
      <span className="win__pane" style={{ left: `${pl}%`, top: `${pt}%`, width: `${pw}%`, height: `${ph}%` }} aria-hidden="true">
        <RoomArt id={id} />
        <span className="win__cover">
          <span className="win__half win__half--l" style={half} />
          <span className="win__half win__half--r" style={half} />
        </span>
      </span>
      <img className="win__frame" src={frame} alt="" />
      <span className="win__label" aria-hidden="true">
        {e.label}
      </span>
    </a>
  );
}
