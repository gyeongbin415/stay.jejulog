import { useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { ExpIcon } from '../components/ExpIcon';
import houseUrl from '../assets/house-3d.webp';
import houseBgUrl from '../assets/house-wide-bg.webp';
import houseWideUrl from '../assets/house-3d-wide.webp';
import { useMediaQuery } from '../lib/motion';

/**
 * PAGE 02 — 집 내부 탐색 (EXPLORE)
 * 외벽을 걷어 낸 집 단면 — 시안 그림 한 장(house-3d.webp)을 그대로 두고, 방마다 투명 링크를 겹칩니다.
 * 아홉 가지 공간을 누르면 바로 해당 게스트하우스 상세페이지로 이동합니다.
 * '목록'을 누르면 그림 대신 아홉 가지 경험을 이름으로 한눈에 보여 줍니다.
 */
type View = 'house' | 'list';
const VIEW_KEY = 'jejulog:house-view';

/**
 * 받은 그림 두 장 속 방 자리 · 이름표 자리 — 그림 픽셀 기준
 * room: 방 네모 [x1, y1, x2, y2] / tag: 이름표 자리 [x, y, 최소 너비] (center — 가운데 기준, 다락)
 * 휴대폰: 다락 책 · 3F 반지공방 · 꽃꽂이 · 2F 영화 · LP · 1F 집밥 · 와인 · 마당 스냅사진 · 러닝
 * 웹: 다락 책 · 위층 반지공방 · 꽃꽂이 · 영화 · 아래층 LP · 집밥 · 와인 · 마당 스냅사진 · 러닝
 * 휴대폰(좁은 화면) — 세로 그림, 웹(넓은 화면) — 양옆 풍경까지 그려진 가로 그림을 화면 폭에 꽉 차게
 */
type Spot = { id: ProgramId; room: [number, number, number, number]; tag: [number, number, number]; center?: boolean };
const HOUSES: Record<'narrow' | 'wide', { url: string; w: number; h: number; spots: Spot[] }> = {
  // 휴대폰 — 세로 그림 (1089 × 1445)
  narrow: {
    url: houseUrl, w: 1089, h: 1445,
    spots: [
      { id: 'book', room: [227, 330, 860, 564], tag: [543, 392, 66], center: true },
      { id: 'craft', room: [227, 576, 536, 767], tag: [240, 589, 122] },
      { id: 'flower', room: [551, 576, 860, 767], tag: [564, 589, 95] },
      { id: 'cinema', room: [227, 778, 536, 961], tag: [240, 791, 84] },
      { id: 'lp', room: [551, 778, 860, 961], tag: [564, 791, 70] },
      { id: 'homemeal', room: [227, 973, 536, 1146], tag: [240, 986, 85] },
      { id: 'wine', room: [551, 973, 860, 1146], tag: [564, 986, 83] },
      { id: 'camping', room: [208, 1168, 537, 1348], tag: [221, 1181, 120] },
      { id: 'running', room: [551, 1168, 878, 1348], tag: [564, 1181, 89] },
    ],
  },
  // 웹 — 가로 그림 (1536 × 1024) · 다락 1칸 + 한 층에 세 칸씩 두 층 + 마당 2칸
  wide: {
    url: houseWideUrl, w: 1536, h: 1024,
    spots: [
      { id: 'book', room: [362, 165, 1165, 378], tag: [764, 205, 66], center: true },
      { id: 'craft', room: [355, 392, 612, 555], tag: [367, 404, 122] },
      { id: 'flower', room: [626, 392, 880, 555], tag: [638, 404, 95] },
      { id: 'cinema', room: [892, 392, 1165, 555], tag: [904, 404, 84] },
      { id: 'lp', room: [355, 568, 612, 735], tag: [367, 580, 70] },
      { id: 'homemeal', room: [626, 568, 880, 735], tag: [638, 580, 85] },
      { id: 'wine', room: [892, 568, 1165, 735], tag: [904, 580, 83] },
      { id: 'camping', room: [350, 755, 757, 942], tag: [362, 767, 120] },
      { id: 'running', room: [768, 755, 1172, 942], tag: [780, 767, 89] },
    ],
  },
};
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
/** 목록 칸 숙소 이름 — 스르르는 ‘게스트하우스’를 빼고 짧게 (두 줄로 넘쳐 칸 높이가 달라지지 않게) */
const listPlace = (id: ProgramId, name: string) => (id === 'craft' ? name.replace(/\s*(게스트하우스|Guesthouse)/g, '') : name);

function readView(): View {
  try {
    return sessionStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'house';
  } catch {
    return 'house';
  }
}

/** embedded — 메인 페이지 안 한 섹션으로 (제목은 h2, 위쪽 여백은 상단 바 없이) */
export function HousePage({ embedded = false }: { embedded?: boolean }) {
  const { site, ui, rooms, compactFloors, experiences, experienceById, programById } = useContent();
  const SITE = site;
  const Title = embedded ? 'h2' : 'h1';
  // 목록 보기도 그림 속 집 순서대로 — 다락 → 3F → 2F → 1F → 마당 (층마다 두 칸)
  const [attic, , , yard] = rooms;
  const houseOrder = [attic, ...compactFloors, yard].flatMap((f) => f.items);
  const listed = houseOrder.map((id) => experiences.find((e) => e.id === id)!).filter(Boolean);
  // 상세페이지에 다녀와도 보던 방식이 유지되도록 이 탭에서만 기억합니다.
  const [view, setView] = useState<View>(readView);
  const wide = useMediaQuery('(min-width: 900px)');
  const house = HOUSES[wide ? 'wide' : 'narrow'];
  const { w: IMG_W, h: IMG_H } = house;
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
                  <span className="explist__place">{listPlace(e.id, programById[e.id].report.place.name)}</span>
                  <ExpIcon id={e.id} className="explist__icon" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
      <nav
        className={`house3d${wide ? ' house3d--wide' : ''}`}
        aria-label={ui.house.houseAria}
        style={{ '--iw': IMG_W, '--house-bg': `url(${houseBgUrl})` } as CSSProperties}
      >
        <div className="house3d__frame">
          <img className="house3d__img" src={house.url} width={IMG_W} height={IMG_H} alt={ui.house.houseAria} loading="lazy" decoding="async" />
          {house.spots.map(({ id, room: [x1, y1, x2, y2], tag: [tx, ty, tw], center }) => {
            const e = experienceById[id];
            const place = programById[id].report.place.name;
            return (
              <span key={id} className="house3d__spot">
                <a
                  className={`house3d__room house3d__room--${id}${center ? ' house3d__room--attic' : ''}`}
                  href={href.stay(id)}
                  aria-label={ui.house.roomAria(e.no, e.label, place)}
                  data-track={`house_${id}`}
                  style={{ left: pct(x1, IMG_W), top: pct(y1, IMG_H), width: pct(x2 - x1, IMG_W), height: pct(y2 - y1, IMG_H) }}
                />
                {/* 이름표 — 그림 속 이름표 위에 같은 크기로 덮음 (언어 전환 · 호버 때 주황) */}
                <span
                  className={`house3d__tag${center ? ' house3d__tag--center' : ''}`}
                  aria-hidden="true"
                  style={{ left: `calc(var(--u) * ${tx})`, top: `calc(var(--u) * ${ty})`, minWidth: `calc(var(--tu, var(--u)) * ${tw})` }}
                >
                  <span>{e.label}</span>
                  <span className="house3d__place">{place}</span>
                  <span className="house3d__arrow">→</span>
                </span>
              </span>
            );
          })}
        </div>
      </nav>
      )}
    </section>
  );
}
