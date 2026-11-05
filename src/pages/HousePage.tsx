import { useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { ExpIcon } from '../components/ExpIcon';
import { gaAttrs } from '../lib/gaParams';
import houseUrl from '../assets/house-3d.webp';
import houseBgUrl from '../assets/house-wide-bg.webp';
import houseWideUrl from '../assets/house-3d-wide.webp';
import housePaperUrl from '../assets/house-flat.jpg';
// 웹 — 받은 가로 그림(같은 집 그림 + 하늘 · 섬 · 바다 · 현무암 돌담 · 귤나무 · 억새 · 잔디) 1672 × 941
import housePaperWideUrl from '../assets/house-wide-paper.webp';
// 넓은 화면 양옆 — 집 그림 끝의 풍경(하늘 · 바다 · 돌담 · 잔디)을 넓게 이어 그린 한 장(구름 · 들꽃 · 덤불을 군데군데) · 그림 끝에서 잘린 구름 · 언덕 · 덤불을 이어 주는 조각
import sideLUrl from '../assets/house-side-l.jpg';
import sideRUrl from '../assets/house-side-r.jpg';
import nearLUrl from '../assets/house-near-l.png';
import nearRUrl from '../assets/house-near-r.png';

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
/** pill — 그림 속 이름표 네모 [x1, y1, x2, y2] (이름이 그림 안에 있는 손그림 집 — 마우스를 올리면 그 자리에 주황 이름표) */
type Spot = { id: ProgramId; room: [number, number, number, number]; tag: [number, number, number]; center?: boolean; pill?: [number, number, number, number] };
const HOUSES: Record<'narrow' | 'wide' | 'paper' | 'paperWide', { url: string; w: number; h: number; spots: Spot[]; labels?: boolean }> = {
  // 지금 쓰는 그림 — 받은 집 그림(덩굴 · 돌벽 · 방 이름이 그림 안에, 마당 두 칸은 집 아래, 책 이름표는 둥근 알약으로 다듬음, 집과 마당 사이 잔디로 띄움, 마당 칸 사이 · 아래는 잔디, 아래 잔디에 그림 속 디딤돌 · 꽃 · 덤불) 898 × 1323. 이름표는 그림에 있으니 덧씌우지 않고, 마우스를 올리면 그 자리에 주황 이름표(pill)
  paper: {
    url: housePaperUrl, w: 898, h: 1323, labels: false,
    spots: [
      { id: 'book', room: [100, 150, 800, 382], tag: [450, 200, 66], center: true, pill: [400, 195, 490, 239] },
      { id: 'craft', room: [112, 385, 440, 582], tag: [0, 0, 0], pill: [132, 397, 265, 442] },
      { id: 'flower', room: [452, 385, 778, 582], tag: [0, 0, 0], pill: [465, 397, 567, 442] },
      { id: 'cinema', room: [112, 590, 440, 782], tag: [0, 0, 0], pill: [132, 602, 225, 647] },
      { id: 'lp', room: [452, 590, 778, 782], tag: [0, 0, 0], pill: [465, 602, 554, 648] },
      { id: 'homemeal', room: [112, 790, 440, 980], tag: [0, 0, 0], pill: [132, 802, 225, 850] },
      { id: 'wine', room: [452, 790, 778, 980], tag: [0, 0, 0], pill: [465, 802, 561, 850] },
      { id: 'camping', room: [95, 1029, 440, 1226], tag: [0, 0, 0], pill: [107, 1038, 239, 1086] },
      { id: 'running', room: [455, 1029, 800, 1226], tag: [0, 0, 0], pill: [465, 1038, 567, 1086] },
    ],
  },
  // 웹(넓은 화면) — 받은 가로 그림. 그 안의 집은 paper 그림을 0.572배로 줄여 (583.7, 70.3)에 둔 것과 같아 방 자리는 paper 에서 옮겨 씀 (아래 paperWide 채움)
  paperWide: { url: housePaperWideUrl, w: 1672, h: 941, labels: false, spots: [] },
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
{
  const k = 0.572, ox = 583.7, oy = 70.3;
  const mx = (v: number) => Math.round(v * k + ox), my = (v: number) => Math.round(v * k + oy);
  const box = ([a, b, c, d]: [number, number, number, number]): [number, number, number, number] => [mx(a), my(b), mx(c), my(d)];
  HOUSES.paperWide.spots = HOUSES.paper.spots.map((s) => ({ ...s, room: box(s.room), tag: [mx(s.tag[0]), my(s.tag[1]), Math.round(s.tag[2] * k)], pill: s.pill && box(s.pill) }));
}
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
  // 휴대폰 · 웹 모두 같은 집이 들어간 받은 가로 그림 — 웹은 화면 폭에 맞춰, 휴대폰은 집을 가운데에 두고 키워서 양옆을 조금 잘라 냄 (house.css)
  // (예전 그림 paper · narrow · wide 는 남겨 둠)
  const house = HOUSES.paperWide;
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
                <a className="explist__item" href={href.stay(e.id)} data-track={`house_list_${e.id}`} {...gaAttrs(e.id)}>
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
        className="house3d house3d--paper house3d--paperwide"
        aria-label={ui.house.houseAria}
        style={{ '--iw': IMG_W, '--house-bg': `url(${houseBgUrl})`, '--side-l': `url(${nearLUrl}), url(${sideLUrl})`, '--side-r': `url(${nearRUrl}), url(${sideRUrl})` } as CSSProperties}
      >
        <div className="house3d__frame">
          <img className="house3d__img" src={house.url} width={IMG_W} height={IMG_H} alt={ui.house.houseAria} loading="lazy" decoding="async" />
          {house.spots.map(({ id, room: [x1, y1, x2, y2], tag: [tx, ty, tw], center, pill }) => {
            const e = experienceById[id];
            const place = programById[id].report.place.name;
            return (
              <span key={id} className="house3d__spot">
                <a
                  className={`house3d__room house3d__room--${id}${center ? ' house3d__room--attic' : ''}`}
                  href={href.stay(id)}
                  aria-label={ui.house.roomAria(e.no, e.label, place)}
                  data-track={`house_${id}`}
                  {...gaAttrs(id)}
                  style={{ left: pct(x1, IMG_W), top: pct(y1, IMG_H), width: pct(x2 - x1, IMG_W), height: pct(y2 - y1, IMG_H) }}
                />
                {/* 그림 속 이름표 자리에 같은 크림색 이름표 — 방에 마우스를 올리면 주황으로 바뀌며 오른쪽으로 길어져 게스트하우스 이름 · → */}
                {pill && (
                  <span
                    className="house3d__pill"
                    aria-hidden="true"
                    style={{ left: pct(pill[0], IMG_W), top: pct(pill[1], IMG_H), minWidth: pct(pill[2] - pill[0], IMG_W), height: pct(pill[3] - pill[1], IMG_H) }}
                  >
                    <span>{e.label}</span>
                    {/* 이름 옆 주황 화살표 — 늘 보임 (마우스를 올려 이름표가 길어지면 끝의 → 하나만) */}
                    <svg className="house3d__pill-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12h14M13 6.5 18.5 12 13 17.5" /></svg>
                    <span className="house3d__pill-more">
                      <span className="house3d__pill-place">{place}</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                )}
                {/* 이름표 — 그림 속 이름표 위에 같은 크기로 덮음 (언어 전환 · 호버 때 주황). 이름이 그림 안에 있는 손그림 집은 덮지 않음 */}
                {house.labels !== false && (
                <span
                  className={`house3d__tag${center ? ' house3d__tag--center' : ''}`}
                  aria-hidden="true"
                  style={{ left: `calc(var(--u) * ${tx})`, top: `calc(var(--u) * ${ty})`, minWidth: `calc(var(--tu, var(--u)) * ${tw})` }}
                >
                  <span>{e.label}</span>
                  <span className="house3d__place">{place}</span>
                  <span className="house3d__arrow">→</span>
                </span>
                )}
              </span>
            );
          })}
        </div>
      </nav>
      )}
    </section>
  );
}
