import { useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { ExpIcon } from '../components/ExpIcon';
import { useMediaQuery } from '../lib/motion';
import houseUrl from '../assets/house-3d.webp';
import houseWideUrl from '../assets/house-3d-wide.webp';

/**
 * PAGE 02 — 집 내부 탐색 (EXPLORE)
 * 외벽을 걷어 낸 집 단면 — 시안 그림 한 장(house-3d.webp)을 그대로 두고, 방마다 투명 링크를 겹칩니다.
 * 아홉 가지 공간을 누르면 바로 해당 게스트하우스 상세페이지로 이동합니다.
 * '목록'을 누르면 그림 대신 아홉 가지 경험을 이름으로 한눈에 보여 줍니다.
 */
type View = 'house' | 'list';
const VIEW_KEY = 'jejulog:house-view';

/**
 * 그림(바깥 배경은 투명) 속 방 자리 · 이름표 자리 — 그림 픽셀 기준
 * room: 방 네모 [x1, y1, x2, y2] / tag: 이름표 자리 [x, y, 최소 너비] (center — 가운데 기준)
 * 휴대폰은 한 층에 두 칸(914 × 1153), 넓은 화면은 같은 그림을 잘라 이어 붙인 한 층 세 칸(1337 × 963)
 *  — 책(다락) · 스냅사진 · 러닝(마당)은 그대로, 가운데 여섯 칸만 영화 · LP · 반지공방 / 꽃꽂이 · 집밥 · 와인
 * ground: 잔디색 땅이 시작되는 그림 높이
 */
type Spot = { id: ProgramId; room: [number, number, number, number]; tag: [number, number, number]; center?: boolean };
const HOUSES: Record<'narrow' | 'wide', { url: string; w: number; h: number; ground: number; spots: Spot[] }> = {
  narrow: {
    url: houseUrl, w: 914, h: 1153, ground: 586,
    spots: [
      { id: 'book', room: [119, 103, 797, 291], tag: [456, 104, 66], center: true },
      { id: 'cinema', room: [119, 305, 449, 500], tag: [132, 321, 84] },
      { id: 'lp', room: [462, 305, 797, 500], tag: [475, 321, 70] },
      { id: 'craft', room: [119, 514, 449, 700], tag: [132, 530, 100] },
      { id: 'flower', room: [462, 514, 797, 700], tag: [475, 530, 95] },
      { id: 'homemeal', room: [119, 714, 449, 893], tag: [132, 730, 85] },
      { id: 'wine', room: [462, 714, 797, 893], tag: [475, 730, 83] },
      { id: 'camping', room: [103, 915, 450, 1119], tag: [116, 929, 120] },
      { id: 'running', room: [463, 915, 811, 1119], tag: [476, 929, 89] },
    ],
  },
  wide: {
    url: houseWideUrl, w: 1337, h: 963, ground: 586,
    spots: [
      { id: 'book', room: [160, 103, 1181, 291], tag: [668, 104, 66], center: true },
      { id: 'cinema', room: [160, 305, 490, 500], tag: [173, 321, 84] },
      { id: 'lp', room: [503, 305, 838, 500], tag: [516, 321, 70] },
      { id: 'craft', room: [851, 305, 1181, 500], tag: [864, 321, 100] },
      { id: 'flower', room: [160, 514, 490, 700], tag: [173, 530, 95] },
      { id: 'homemeal', room: [503, 514, 838, 700], tag: [516, 530, 85] },
      { id: 'wine', room: [851, 514, 1181, 700], tag: [864, 530, 83] },
      { id: 'camping', room: [315, 722, 662, 923], tag: [328, 736, 120] },
      { id: 'running', room: [675, 722, 1023, 923], tag: [688, 736, 89] },
    ],
  },
};
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

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
  const house = HOUSES[useMediaQuery('(min-width: 900px)') ? 'wide' : 'narrow'];
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
                  <span className="explist__place">{programById[e.id].report.place.name}</span>
                  <ExpIcon id={e.id} className="explist__icon" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : (
      <nav
        className={`house3d${house.url === houseWideUrl ? ' house3d--wide' : ''}`}
        aria-label={ui.house.houseAria}
        style={{ '--iw': IMG_W, '--ground': house.ground } as CSSProperties}
      >
        <div className="house3d__frame">
          <img className="house3d__img" src={house.url} width={IMG_W} height={IMG_H} alt={ui.house.houseAria} loading="lazy" decoding="async" />
          {house.spots.map(({ id, room: [x1, y1, x2, y2], tag: [tx, ty, tw], center }) => {
            const e = experienceById[id];
            const place = programById[id].report.place.name;
            return (
              <span key={id} className="house3d__spot">
                <a
                  className={`house3d__room house3d__room--${id}`}
                  href={href.stay(id)}
                  aria-label={ui.house.roomAria(e.no, e.label, place)}
                  data-track={`house_${id}`}
                  style={{ left: pct(x1, IMG_W), top: pct(y1, IMG_H), width: pct(x2 - x1, IMG_W), height: pct(y2 - y1, IMG_H) }}
                />
                {/* 이름표 — 그림 속 이름표 위에 같은 크기로 덮음 (언어 전환 · 호버 때 주황) */}
                <span
                  className={`house3d__tag${center ? ' house3d__tag--center' : ''}`}
                  aria-hidden="true"
                  style={{ left: `calc(var(--u) * ${tx})`, top: `calc(var(--u) * ${ty})`, minWidth: `calc(var(--u) * ${tw})` }}
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
