import { useState, type CSSProperties } from 'react';
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
        {/* 벽에 자잘하게 그은 벽돌 스케치 — 창문 뒤 */}
        <span className="facade__bricks" aria-hidden="true">
          {BRICKS.map(([x, y]) => (
            <span key={`${x}-${y}`} className="brick" style={{ left: `${x}%`, top: `${y}%` }} />
          ))}
        </span>
        <ul className="facade__grid">
          {WINDOWS.map((w) => (
            <li key={w.id}>
              <Window {...w} />
            </li>
          ))}
        </ul>
      </nav>
      )}
    </section>
  );
}

/**
 * 창문 아홉 개 — 받은 창문 그림을 그대로 오려 씀(초록 창틀은 나무색으로, 벽은 투명).
 * 한 창 = 창틀 그림(frame, 큰 창 자리만 뚫림) + 큰 창 자리의 방 그림 + 그 앞을 가린 커튼 · 블라인드 · 간유리 · 덧창(cover).
 * w · h 는 그림 크기(px), pane 은 큰 창 자리(그림 기준 % — 왼쪽 · 위 · 너비 · 높이),
 * dx · dy 는 줄 맞춤에서 살짝 어긋나게 옮기는 정도(칸 기준 %) — 간격은 그대로, 배치만 불규칙하게.
 */
type Cover = 'curtain' | 'blind' | 'frost' | 'shutter';
/** 벽돌 스케치 위치 (벽 기준 %, 왼쪽 · 위) — 창문 사이 빈 벽에 띄엄띄엄 */
const BRICKS: [number, number][] = [
  [3, 2], [62, 1], [93, 4], [35, 31], [95, 34], [1, 64], [64, 64], [30, 95], [88, 96],
];
type WindowArt = { id: ProgramId; frame: string; cover: string; w: number; h: number; pane: [number, number, number, number]; kind: Cover; dx: number; dy: number };
const WINDOWS: WindowArt[] = [
  { id: 'book', frame: bookFrame, cover: bookCover, w: 263, h: 340, pane: [11.03, 26.18, 77.57, 63.82], kind: 'curtain', dx: -3, dy: 4 },
  { id: 'craft', frame: craftFrame, cover: craftCover, w: 275, h: 386, pane: [13.82, 25.91, 73.45, 65.03], kind: 'blind', dx: 4, dy: -9 },
  { id: 'flower', frame: flowerFrame, cover: flowerCover, w: 264, h: 332, pane: [10.98, 27.71, 77.65, 61.75], kind: 'frost', dx: -2, dy: 8 },
  { id: 'cinema', frame: cinemaFrame, cover: cinemaCover, w: 290, h: 378, pane: [12.07, 26.46, 75.86, 64.29], kind: 'blind', dx: 5, dy: -2 },
  { id: 'lp', frame: lpFrame, cover: lpCover, w: 266, h: 385, pane: [12.41, 25.71, 75.19, 65.19], kind: 'curtain', dx: -4, dy: 10 },
  { id: 'homemeal', frame: homemealFrame, cover: homemealCover, w: 278, h: 374, pane: [11.15, 26.2, 77.34, 64.44], kind: 'frost', dx: 3, dy: -6 },
  { id: 'running', frame: runningFrame, cover: runningCover, w: 275, h: 400, pane: [14.55, 26.5, 70.91, 62], kind: 'shutter', dx: -5, dy: 6 },
  { id: 'camping', frame: campingFrame, cover: campingCover, w: 282, h: 392, pane: [12.77, 26.79, 74.82, 63.78], kind: 'frost', dx: 2, dy: -5 },
  { id: 'wine', frame: wineFrame, cover: wineCover, w: 274, h: 399, pane: [10.95, 24.06, 78.1, 66.67], kind: 'curtain', dx: 6, dy: 9 },
];

function Window({ id, frame, cover, w, h, pane, kind, dx, dy }: WindowArt) {
  const { ui, experienceById, programById } = useContent();
  const e = experienceById[id];
  const place = programById[id].report.place.name;
  const [l, t, pw, ph] = pane;
  const half = { backgroundImage: `url(${cover})` };
  return (
    <a
      className={`win win--${kind}`}
      href={href.stay(id)}
      aria-label={ui.house.roomAria(e.no, e.label, place)}
      data-track={`house_${id}`}
      style={{ width: `${(w / 290) * 100}%`, aspectRatio: `${w} / ${h}`, translate: `${dx}% ${dy}%` } as CSSProperties}
    >
      {/* 큰 창 자리 — 방 그림, 그 앞을 가린 두 짝 */}
      <span className="win__pane" style={{ left: `${l}%`, top: `${t}%`, width: `${pw}%`, height: `${ph}%` }} aria-hidden="true">
        <RoomArt id={id} />
        <span className="win__cover">
          <span className="win__half win__half--l" style={half} />
          <span className="win__half win__half--r" style={half} />
        </span>
      </span>
      <img className="win__frame" src={frame} alt="" />
      <span className="win__label" style={{ left: `calc(${l}% + 6px)`, top: `calc(${t}% + 6px)` }} aria-hidden="true">
        {e.label}
      </span>
    </a>
  );
}
