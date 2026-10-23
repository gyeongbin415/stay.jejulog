import { useState } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { RoomArt } from '../components/RoomArt';

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
 * 창문 아홉 개 — 위 줄부터 책 · 나무반지 · 꽃꽂이 / 영화 · LP · 집밥 / 러닝 · 스냅 · 와인
 * top: 둥근 아치(arch) · 네모 위 처마(cap) / cover: 닫혀 있을 때 가린 것
 */
type Cover = 'curtain' | 'blind' | 'frost' | 'shutter';
/** 벽돌 스케치 위치 (벽 기준 %, 왼쪽 · 위) — 창문 사이 빈 벽에 띄엄띄엄 */
const BRICKS: [number, number][] = [
  [3, 2], [62, 1], [93, 4], [35, 31], [95, 34], [1, 64], [64, 64], [30, 95], [88, 96],
];
const WINDOWS: { id: ProgramId; top: 'arch' | 'cap'; cover: Cover }[] = [
  { id: 'book', top: 'arch', cover: 'curtain' },
  { id: 'craft', top: 'cap', cover: 'blind' },
  { id: 'flower', top: 'arch', cover: 'frost' },
  { id: 'cinema', top: 'cap', cover: 'blind' },
  { id: 'lp', top: 'cap', cover: 'curtain' },
  { id: 'homemeal', top: 'arch', cover: 'frost' },
  { id: 'running', top: 'arch', cover: 'shutter' },
  { id: 'camping', top: 'cap', cover: 'frost' },
  { id: 'wine', top: 'arch', cover: 'curtain' },
];

function Window({ id, top, cover }: { id: ProgramId; top: 'arch' | 'cap'; cover: Cover }) {
  const { ui, experienceById, programById } = useContent();
  const e = experienceById[id];
  const place = programById[id].report.place.name;
  return (
    <a className={`win win--${top} win--${cover}`} href={href.stay(id)} aria-label={ui.house.roomAria(e.no, e.label, place)} data-track={`house_${id}`}>
      {top === 'cap' && <span className="win__cap" aria-hidden="true" />}
      <span className="win__frame" aria-hidden="true">
        {/* 위 채광창 두 칸 */}
        <span className="win__transom">
          <span />
          <span />
        </span>
        {/* 아래 큰 창 — 안에 방 그림, 그 앞을 가린 커튼 · 블라인드 · 간유리 · 덧창 */}
        <span className="win__pane">
          <RoomArt id={id} />
          <span className="win__cover">
            <span className="win__half win__half--l" />
            <span className="win__half win__half--r" />
          </span>
          <span className="win__label">{e.label}</span>
        </span>
      </span>
      <span className="win__sill" aria-hidden="true" />
    </a>
  );
}
