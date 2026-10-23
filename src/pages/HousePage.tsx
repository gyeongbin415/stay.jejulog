import { useState, type CSSProperties } from 'react';
import { useContent } from '../i18n';
import type { ProgramId } from '../data/types';
import { href } from '../lib/router';
import { useInView, useMediaQuery } from '../lib/motion';
import { RoomArt } from '../components/RoomArt';
import { HouseRoof } from '../components/HouseRoof';

/**
 * PAGE 02 — 집 내부 탐색 (EXPLORE)
 * 외벽을 걷어 낸 제주 구옥 단면. 아홉 가지 공간을 누르면 바로 해당 게스트하우스 상세페이지로 이동합니다.
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
  const { site, ui, rooms, compactFloors, experiences, programById } = useContent();
  const SITE = site;
  const Title = embedded ? 'h2' : 'h1';
  // 넓은 화면: 다락 1 · 2층 3칸 · 1층 3칸 · 마당 2 (rooms) / 좁은 화면: 실내를 두 칸씩 세 층(compactFloors)
  const [attic, living, kitchen, yard] = rooms;
  const wide = useMediaQuery('(min-width: 900px)');
  const bodyFloors = wide ? [living, kitchen] : compactFloors;
  // 목록 보기도 집 순서대로 — 다락 → 3F → 2F → 1F → 마당
  const houseOrder = [attic, ...bodyFloors, yard].flatMap((f) => f.items);
  const listed = houseOrder.map((id) => experiences.find((e) => e.id === id)!).filter(Boolean);
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
      <nav className="house" aria-label={ui.house.houseAria}>
        {/* 집 — 배경은 페이지 색 그대로 */}
        <div className="house__stage">
          <div className="house__inner">
            <div className="house__top">
              <HouseRoof className="house__roof" />
              {/* 다락 덧창 — 방 한 칸이 아니라 지붕 아래 박공 전체를 덮는 큰 겉창 두 짝 */}
              <span className="gable" aria-hidden="true">
                <span className="gable__leaf gable__leaf--l" />
                <span className="gable__leaf gable__leaf--r" />
              </span>
              <div className="house__floor house__floor--attic">
                <FloorLabel floor={attic.floor} name={attic.name} />
                <div className="house__rooms">
                  {attic.items.map((id) => (
                    <Room key={id} id={id} shutters={false} />
                  ))}
                </div>
              </div>
            </div>

            <div className="house__body">
              {bodyFloors.map((f) => (
                <div key={f.id} className={`house__floor house__floor--${f.id}`}>
                  <FloorLabel floor={f.floor} name={f.name} />
                  {/* 층마다 칸 수만큼 (넓은 화면 3칸 · 좁은 화면 2칸) */}
                  <div className="house__rooms" style={{ gridTemplateColumns: `repeat(${f.items.length}, minmax(0, 1fr))` }}>
                    {f.items.map((id) => (
                      <Room key={id} id={id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 마당 */}
        <div className="house__yard">
          <div className="house__floor house__floor--yard">
            <FloorLabel floor={yard.floor} name={yard.name} />
            <div className="house__rooms">
              {yard.items.map((id) => (
                <Room key={id} id={id} shutters={false} />
              ))}
            </div>
          </div>
        </div>
      </nav>
      )}
    </section>
  );
}

/** 층 이름 — 그림에는 보이지 않고 화면 읽기 프로그램에만 */
function FloorLabel({ floor, name }: { floor: string; name: string }) {
  return (
    <p className="house__label visually-hidden">
      <span>{floor}</span>
      {name}
    </p>
  );
}

/**
 * 방 하나 — 겉에는 초록 덧창(나무 겉창 두 짝)이 닫혀 있고, 마우스를 올리면 양쪽으로 열리며 방 안이 보입니다.
 * 마우스가 없는 휴대폰은 방이 화면에 들어올 때 덧창이 저절로 열립니다 (is-seen).
 * 마당(스냅 · 러닝)은 바깥이라 덧창 없이 (shutters={false}).
 */
function Room({ id, shutters = true }: { id: ProgramId; shutters?: boolean }) {
  const { ui, experienceById, programById } = useContent();
  const e = experienceById[id];
  const place = programById[id].report.place.name;
  const [ref, seen] = useInView<HTMLAnchorElement>({ rootMargin: '0px 0px -20% 0px' });
  // 같은 줄의 방들이 한꺼번에 말고 조금씩 차례로 열리게
  const delay = `${0.15 + (Number(e.no) % 3) * 0.18}s`;
  return (
    <a
      ref={ref}
      className={`room room--${id}${seen ? ' is-seen' : ''}`}
      style={{ '--d': delay } as CSSProperties}
      href={href.stay(id)}
      aria-label={ui.house.roomAria(e.no, e.label, place)}
      data-track={`house_${id}`}
    >
      <RoomArt id={id} />
      {shutters && (
        <span className="room__shutters" aria-hidden="true">
          <span className="room__leaf room__leaf--l" />
          <span className="room__leaf room__leaf--r" />
        </span>
      )}
      <span className="room__tag" aria-hidden="true">
        <span className="room__name">{e.label}</span>
        <span className="room__place">{place}</span>
        <span className="room__arrow">→</span>
      </span>
    </a>
  );
}
