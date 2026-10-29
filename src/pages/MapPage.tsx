import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { useContent } from '../i18n';
import { href } from '../lib/router';
import { TASTE_LAYERS, TASTE_PLACES, type TasteLayer, type TastePlace } from '../data/tasteMap';

/**
 * PAGE 06 — 제주 게하 취향지도
 * 레퍼런스(경향신문 냉면 지도)처럼 지도 위 핀 + 목록. 핀 색 = 취향 레이어, 위 버튼으로 레이어만 골라 보기.
 * 지도 바탕은 OpenStreetMap 타일(키 없이 쓰는 공개 지도), 핀 위치는 카카오맵 장소 좌표.
 */
type Filter = TasteLayer | 'all';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export default function MapPage() {
  const { ui, lang, programById } = useContent();
  const t = ui.map;
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<string | null>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const chipsEl = useRef<HTMLDivElement>(null);

  // 취향 버튼 줄 — 넓은 화면에서도 마우스로 끌거나(드래그) 휠을 굴려 옆으로 넘김
  useEffect(() => {
    const el = chipsEl.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add('is-dragging');
        el.setPointerCapture(e.pointerId);
      }
      if (moved) el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      el.classList.remove('is-dragging');
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    // 끈 다음에는 버튼이 눌리지 않게
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    // 세로 휠도 옆으로 — 끝까지 가면 페이지가 내려가도록 그때만 막음
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const next = Math.min(max, Math.max(0, el.scrollLeft + e.deltaY));
      if (next === el.scrollLeft) return;
      e.preventDefault();
      el.scrollLeft = next;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('wheel', onWheel);
    };
  }, []);
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef<Map<string, L.CircleMarker>>(new Map());

  const layerOf = (id: TasteLayer) => TASTE_LAYERS.find((l) => l.id === id)!;
  const layerName = (id: TasteLayer) => layerOf(id)[lang];
  const descOf = (p: TastePlace) => (p.stay ? programById[p.stay].report.oneLine ?? '' : p.desc ?? '');
  const found = TASTE_PLACES;
  const shown = useMemo(() => found.filter((p) => filter === 'all' || p.layer === filter), [found, filter]);

  // 지도 — 처음 한 번 만들고, 핀은 언어가 바뀌면 다시 그림
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: true, touchZoom: true, wheelPxPerZoomLevel: 90, zoomControl: false, attributionControl: true, zoomSnap: 0.25 }).setView([33.38, 126.55], 10);
    L.control.zoom({ position: 'bottomright' }).addTo(map); // 지도 위에서 마우스 휠 · 두 손가락으로도 확대 · 축소
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markers.current.forEach((m) => m.remove());
    markers.current.clear();
    TASTE_PLACES.forEach((p) => {
      const color = layerOf(p.layer).color;
      const m = L.circleMarker([p.lat, p.lng], { radius: p.stay ? 10 : 8, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 });
      // 바깥으로 나가는 링크(카카오맵 · 인스타그램)는 빼고, 웹진에 소개한 곳만 상세 페이지로
      const links = p.stay ? `<a href="${href.stay(p.stay)}">${esc(t.seeStay)} →</a>` : '';
      m.bindPopup(
        `<div class="tmap-pop"><p class="tmap-pop__layer" style="color:${color}">${esc(layerName(p.layer))}${p.stay ? ` · ${esc(t.webzineBadge)}` : ''}</p>` +
          `<p class="tmap-pop__name">${esc(p.name)}</p><p class="tmap-pop__area">${esc(p.area)}</p>` +
          `<p class="tmap-pop__desc">${esc(descOf(p))}</p>${links ? `<p class="tmap-pop__links">${links}</p>` : ''}</div>`,
        { maxWidth: 280 },
      );
      m.on('click', () => setActive(p.name));
      markers.current.set(p.name, m);
    });
  }, [lang]);

  // 레이어 고르기 · 검색 — 걸러진 핀만 보이고, 그 핀들이 다 들어오게 맞춤
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const on = new Set(shown.map((p) => p.name));
    markers.current.forEach((m, name) => {
      if (on.has(name)) m.addTo(map);
      else m.remove();
    });
    if (shown.length) map.fitBounds(L.latLngBounds(shown.map((p) => [p.lat, p.lng] as [number, number])), { padding: [28, 28], maxZoom: 12 });
  }, [shown, lang]);

  const focus = (p: TastePlace) => {
    setActive(p.name);
    const map = mapRef.current;
    const m = markers.current.get(p.name);
    if (!map || !m) return;
    map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
    m.openPopup();
    mapEl.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <section className="tmap" data-tone="light" aria-labelledby="map-title">
      <header className="tmap__head wrap">
        {/* 메인의 게하 탐색 · 취향 테스트 칸으로 — 버튼 대신 작은 글자 링크 */}
        <nav className="tmap__jump" aria-label={ui.nav.mainNav}>
          <a href={href.house()} data-track="map_to_house">{ui.nav.house}<span aria-hidden="true"> →</span></a>
          <a href={href.home('find')} data-track="map_to_test">{ui.nav.test}<span aria-hidden="true"> →</span></a>
        </nav>
        <p className="label">AROUND JEJU</p>
        <h1 id="map-title" className="tmap__title">{t.pageTitle}</h1>
        <p className="tmap__sub">{t.sub}</p>
      </header>

      <div ref={chipsEl} className="tmap__filters wrap" role="group" aria-label={t.filterAria}>
        <button type="button" className="tmap__chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
          {t.all} <span className="tmap__n">{found.length}</span>
        </button>
        {TASTE_LAYERS.map((l) => {
          const n = found.filter((p) => p.layer === l.id).length;
          return (
            <button key={l.id} type="button" className="tmap__chip" aria-pressed={filter === l.id} onClick={() => setFilter(l.id)} style={{ '--c': l.color } as CSSProperties} data-track={`map_layer_${l.id}`}>
              <i aria-hidden="true" /> {l[lang]} <span className="tmap__n">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="tmap__body wrap">
        <div className="tmap__mapwrap">
          <div ref={mapEl} className="tmap__map" role="region" aria-label={t.pageTitle} />
        </div>
        <ol className="tmap__list" aria-label={t.listAria}>
          {shown.map((p) => {
            const l = layerOf(p.layer);
            return (
              <li key={p.name}>
                <button type="button" className={`tmap__item${active === p.name ? ' is-on' : ''}`} onClick={() => focus(p)} data-track="map_list_item">
                  <span className="tmap__layer" style={{ color: l.color }}>
                    <i style={{ background: l.color }} aria-hidden="true" /> {l[lang]}
                    {p.stay && <span className="tmap__badge">{t.webzineBadge}</span>}
                  </span>
                  <span className="tmap__name">{p.name}</span>
                  <span className="tmap__area">{p.area}</span>
                  <span className="tmap__desc">{descOf(p)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="tmap__note wrap">{t.note}</p>
    </section>
  );
}
