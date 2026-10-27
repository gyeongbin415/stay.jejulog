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
  const mapRef = useRef<L.Map | null>(null);
  const markers = useRef<Map<string, L.CircleMarker>>(new Map());

  const layerOf = (id: TasteLayer) => TASTE_LAYERS.find((l) => l.id === id)!;
  const layerName = (id: TasteLayer) => layerOf(id)[lang];
  const descOf = (p: TastePlace) => (p.stay ? programById[p.stay].report.oneLine ?? '' : p.desc ?? '');
  const shown = useMemo(() => TASTE_PLACES.filter((p) => filter === 'all' || p.layer === filter), [filter]);

  // 지도 — 처음 한 번 만들고, 핀은 언어가 바뀌면 다시 그림
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([33.38, 126.55], 10);
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
      const links = [
        p.stay ? `<a href="${href.stay(p.stay)}">${esc(t.seeStay)} →</a>` : '',
        `<a href="${p.kakao}" target="_blank" rel="noopener noreferrer">${esc(t.kakao)} ↗</a>`,
        p.insta ? `<a href="${p.insta}" target="_blank" rel="noopener noreferrer">${esc(t.insta)} ↗</a>` : '',
      ].filter(Boolean).join('');
      m.bindPopup(
        `<div class="tmap-pop"><p class="tmap-pop__layer" style="color:${color}">${esc(layerName(p.layer))}${p.stay ? ` · ${esc(t.webzineBadge)}` : ''}</p>` +
          `<p class="tmap-pop__name">${esc(p.name)}</p><p class="tmap-pop__area">${esc(p.area)}</p>` +
          `<p class="tmap-pop__desc">${esc(descOf(p))}</p><p class="tmap-pop__links">${links}</p></div>`,
        { maxWidth: 280 },
      );
      m.on('click', () => setActive(p.name));
      markers.current.set(p.name, m);
    });
  }, [lang]);

  // 레이어 고르기 — 고른 핀만 보이고, 그 핀들이 다 들어오게 맞춤
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markers.current.forEach((m, name) => {
      const p = TASTE_PLACES.find((x) => x.name === name)!;
      if (filter === 'all' || p.layer === filter) m.addTo(map);
      else m.remove();
    });
    if (shown.length) map.fitBounds(L.latLngBounds(shown.map((p) => [p.lat, p.lng] as [number, number])), { padding: [36, 36], maxZoom: 12 });
  }, [filter, shown, lang]);

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
        <p className="label">AROUND JEJU</p>
        <h1 id="map-title" className="tmap__title">{t.pageTitle}</h1>
        <p className="tmap__sub">{t.sub}</p>
      </header>

      <div className="tmap__filters wrap" role="group" aria-label={t.filterAria}>
        <button type="button" className="tmap__chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
          {t.all} <span className="tmap__n">{TASTE_PLACES.length}</span>
        </button>
        {TASTE_LAYERS.map((l) => {
          const n = TASTE_PLACES.filter((p) => p.layer === l.id).length;
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
