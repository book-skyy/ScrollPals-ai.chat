// Footprint.jsx — Real Leaflet map. Visited cities are rendered as
// administrative-boundary polygons (城市/区/州 描边 + 半透明填充), fetched on
// demand from OSM Nominatim and cached in localStorage. If a city has no
// boundary polygon (rare; Nominatim自动回退到上一级 admin 区域,比如箱根→足柄下郡、
// 塔斯马尼亚→州),我们仍能拿到周围更大一圈的描边;若彻底拿不到,降级为圆点。

const VISITED = [
  // q = Nominatim 查询串。带行政上下文能拿到更准确的 admin polygon。
  { id: 'kyoto',      cn: '京都',       en: 'Kyoto',      date: 'May 21', posts: 24, lat: 35.0116, lng: 135.7681,  q: 'Kyoto, Japan' },
  { id: 'shanghai',   cn: '上海',       en: 'Shanghai',   date: 'May 19', posts: 31, lat: 31.2304, lng: 121.4737,  q: 'Shanghai, China' },
  { id: 'taipei',     cn: '台北',       en: 'Taipei',     date: 'Apr 18', posts: 17, lat: 25.0330, lng: 121.5654,  q: 'Taipei, Taiwan' },
  { id: 'hakone',     cn: '箱根',       en: 'Hakone',     date: 'May 09', posts:  7, lat: 35.2324, lng: 139.1069,  q: 'Hakone, Kanagawa, Japan' },
  { id: 'vancouver',  cn: '温哥华',     en: 'Vancouver',  date: 'May 17', posts:  9, lat: 49.2827, lng: -123.1207, q: 'Vancouver, British Columbia, Canada' },
  { id: 'oaxaca',     cn: '瓦哈卡',     en: 'Oaxaca',     date: 'Apr 14', posts:  8, lat: 17.0732, lng: -96.7266,  q: 'Oaxaca de Juárez, Mexico' },
  { id: 'reykjavik',  cn: '雷克雅未克', en: 'Reykjavík',  date: 'May 04', posts: 14, lat: 64.1466, lng: -21.9426,  q: 'Reykjavík, Iceland' },
  { id: 'berlin',     cn: '柏林',       en: 'Berlin',     date: 'May 11', posts: 18, lat: 52.5200, lng:  13.4050,  q: 'Berlin, Germany' },
  { id: 'lisbon',     cn: '里斯本',     en: 'Lisbon',     date: 'May 14', posts: 12, lat: 38.7223, lng:  -9.1393,  q: 'Lisbon, Portugal' },
  { id: 'marrakech',  cn: '马拉喀什',   en: 'Marrakech',  date: 'Apr 29', posts: 11, lat: 31.6295, lng:  -7.9811,  q: 'Marrakech, Morocco' },
  { id: 'capetown',   cn: '开普敦',     en: 'Cape Town',  date: 'Apr 22', posts:  6, lat: -33.9249, lng: 18.4241,  q: 'Cape Town, South Africa' },
  { id: 'tasmania',   cn: '塔斯马尼亚', en: 'Tasmania',   date: 'Apr 06', posts:  5, lat: -42.0409, lng: 146.8087, q: 'Tasmania, Australia' },
];

const CITY_COLOR = '#c7b6ff';
const CITY_COLOR_SELECTED = '#ffffff';

// Polygon styles — 描边+半透明填充
const POLY_STYLE_DEFAULT = {
  color: CITY_COLOR,
  weight: 1.5,
  opacity: 0.85,
  fillColor: CITY_COLOR,
  fillOpacity: 0.18,
};
const POLY_STYLE_HOVER = {
  color: CITY_COLOR,
  weight: 2,
  opacity: 1,
  fillColor: CITY_COLOR,
  fillOpacity: 0.3,
};
const POLY_STYLE_SELECTED = {
  color: CITY_COLOR_SELECTED,
  weight: 2.5,
  opacity: 1,
  fillColor: CITY_COLOR,
  fillOpacity: 0.45,
};

// 圆点降级样式(无 polygon 时)
const DOT_STYLE_DEFAULT = {
  radius: 7, color: CITY_COLOR, weight: 2, opacity: 0.85,
  fillColor: CITY_COLOR, fillOpacity: 0.28,
};
const DOT_STYLE_HOVER = {
  radius: 8.5, color: CITY_COLOR, weight: 2.5, opacity: 1,
  fillColor: CITY_COLOR, fillOpacity: 0.45,
};
const DOT_STYLE_SELECTED = {
  radius: 11, color: CITY_COLOR_SELECTED, weight: 3, opacity: 1,
  fillColor: CITY_COLOR, fillOpacity: 0.7,
};

const BOUNDARY_CACHE_KEY = 'fp.boundary.v1';

function loadBoundaryCache() {
  try { return JSON.parse(localStorage.getItem(BOUNDARY_CACHE_KEY) || '{}'); }
  catch { return {}; }
}
function saveBoundaryCache(cache) {
  try { localStorage.setItem(BOUNDARY_CACHE_KEY, JSON.stringify(cache)); } catch {}
}

// Nominatim 返回的 polygon_geojson 是 GeoJSON Geometry,不是 Feature。
// 一次性请求所有 12 个城市会触发 Nominatim 的速率限制(~1 req/s),所以串行节流。
async function fetchBoundary(city) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&limit=1&q=${encodeURIComponent(city.q)}`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) return null;
  const arr = await res.json();
  const hit = arr && arr[0];
  if (!hit || !hit.geojson) return null;
  // 只接受面/多面;点状(geojson.type === 'Point')视为无边界
  const t = hit.geojson.type;
  if (t !== 'Polygon' && t !== 'MultiPolygon') return null;
  return hit.geojson;
}

function Footprint({ onNav, charId = 'ai-01' }) {
  const char = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];
  const [selected, setSelected] = React.useState('kyoto');
  const sel = VISITED.find((c) => c.id === selected);

  const mapEl = React.useRef(null);
  const mapRef = React.useRef(null);
  // id -> { layer, label, kind: 'poly' | 'dot' }
  const markers = React.useRef({});
  const selectedRef = React.useRef(selected);
  React.useEffect(() => { selectedRef.current = selected; }, [selected]);

  const styleFor = (kind, state) => {
    if (kind === 'poly') {
      return state === 'selected' ? POLY_STYLE_SELECTED
           : state === 'hover'    ? POLY_STYLE_HOVER
                                  : POLY_STYLE_DEFAULT;
    }
    return state === 'selected' ? DOT_STYLE_SELECTED
         : state === 'hover'    ? DOT_STYLE_HOVER
                                : DOT_STYLE_DEFAULT;
  };

  // Init map (once)
  React.useEffect(() => {
    if (!window.L || !mapEl.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(mapEl.current, {
      center: [25, 30],
      zoom: 2,
      minZoom: 2,
      maxZoom: 10,
      zoomControl: false,
      attributionControl: false,
      worldCopyJump: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
    });
    mapRef.current = map;

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map);
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19, opacity: 0.55 }
    ).addTo(map);

    // 先全部以圆点降级方式出现,再异步加载 polygon 替换
    VISITED.forEach((c) => {
      const dot = L.circleMarker([c.lat, c.lng], {
        ...DOT_STYLE_DEFAULT,
        pane: 'markerPane',
        bubblingMouseEvents: false,
      }).addTo(map);

      const labelIcon = L.divIcon({
        className: 'fp-city-label-wrap',
        html: `<div class="fp-city-label">${c.cn}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 22],
      });
      const label = L.marker([c.lat, c.lng], {
        icon: labelIcon, interactive: false, keyboard: false,
      }).addTo(map);

      dot.on('click', () => setSelected(c.id));
      dot.on('mouseover', () => {
        if (selectedRef.current !== c.id) dot.setStyle(DOT_STYLE_HOVER);
      });
      dot.on('mouseout', () => {
        if (selectedRef.current !== c.id) dot.setStyle(DOT_STYLE_DEFAULT);
      });

      markers.current[c.id] = { layer: dot, label, kind: 'dot' };
    });

    // 异步加载边界 polygon — 命中缓存的立即换,未命中的串行 fetch
    (async () => {
      const cache = loadBoundaryCache();
      let dirty = false;
      for (const c of VISITED) {
        let geom = cache[c.id];
        if (!geom) {
          try { geom = await fetchBoundary(c); }
          catch { geom = null; }
          if (geom) { cache[c.id] = geom; dirty = true; }
          // Nominatim usage policy: <= 1 req/s
          await new Promise((r) => setTimeout(r, 1100));
        }
        if (!geom) continue;
        // 当前 map 可能已经卸载(组件 unmount)
        if (!mapRef.current) return;
        if (dirty) saveBoundaryCache(cache);

        const m = markers.current[c.id];
        if (!m) continue;

        const isSel = selectedRef.current === c.id;
        const poly = L.geoJSON(geom, {
          style: () => (isSel ? POLY_STYLE_SELECTED : POLY_STYLE_DEFAULT),
          pane: 'overlayPane',
          bubblingMouseEvents: false,
          interactive: true,
        }).addTo(mapRef.current);

        poly.on('click', () => setSelected(c.id));
        poly.on('mouseover', () => {
          if (selectedRef.current !== c.id) poly.setStyle(POLY_STYLE_HOVER);
        });
        poly.on('mouseout', () => {
          if (selectedRef.current !== c.id) poly.setStyle(POLY_STYLE_DEFAULT);
        });

        // 移除老的圆点,替换为 polygon
        mapRef.current.removeLayer(m.layer);
        markers.current[c.id] = { layer: poly, label: m.label, kind: 'poly' };
      }
      if (dirty) saveBoundaryCache(cache);
    })();

    setTimeout(() => map.invalidateSize(), 60);

    return () => {
      map.remove();
      mapRef.current = null;
      markers.current = {};
    };
  }, []);

  // Selection update — restyle + reveal label + fly to selected
  React.useEffect(() => {
    Object.entries(markers.current).forEach(([id, m]) => {
      const isSel = id === selected;
      const style = styleFor(m.kind, isSel ? 'selected' : 'default');
      m.layer.setStyle(style);
      const labelEl = m.label.getElement();
      if (labelEl) labelEl.classList.toggle('is-selected', isSel);
    });
    if (sel && mapRef.current) {
      mapRef.current.flyTo([sel.lat, sel.lng], Math.max(mapRef.current.getZoom(), 4.5), {
        duration: 0.65, easeLinearity: 0.4,
      });
    }
  }, [selected]);

  const zoomBy = (delta) => {
    const m = mapRef.current; if (!m) return;
    m.setZoom(m.getZoom() + delta, { animate: true });
  };

  return (
    <div className="screen" data-screen-label="05 Footprint" style={{ background: '#0a0a14' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 600,
        padding: '60px 18px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => onNav('profile', { charId })} style={hdrBtn}>{Icon.back()}</button>
        <div style={{ textAlign: 'center' }}>
          <div className="cn" style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{char.name} 的足迹</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>
            {VISITED.length} CITIES · 487 DAYS
          </div>
        </div>
        <button style={hdrBtn}>{Icon.more()}</button>
      </div>

      {/* Map container */}
      <div style={{ position: 'relative', height: 460 }}>
        <div ref={mapEl} style={{ position: 'absolute', inset: 0, background: '#0a0a14' }} />

        {/* Fades */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(180deg, rgba(10,10,20,0.85) 0%, rgba(10,10,20,0.4) 50%, transparent 100%)',
          pointerEvents: 'none', zIndex: 400,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 90,
          background: 'linear-gradient(0deg, #0a0a14 0%, rgba(10,10,20,0) 100%)',
          pointerEvents: 'none', zIndex: 400,
        }} />

        {/* Custom zoom controls */}
        <div style={{
          position: 'absolute', right: 14, bottom: 18, zIndex: 460,
          display: 'flex', flexDirection: 'column',
          borderRadius: 12, overflow: 'hidden',
          background: 'rgba(20,18,32,0.78)', backdropFilter: 'blur(14px)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
        }}>
          <button onClick={() => zoomBy(1)} style={zoomBtn} aria-label="zoom in">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
          <div style={{ height: 0.5, background: 'rgba(255,255,255,0.1)' }} />
          <button onClick={() => zoomBy(-1)} style={zoomBtn} aria-label="zoom out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Legend — region outline */}
        <div style={{
          position: 'absolute', left: 14, bottom: 18, zIndex: 450,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', borderRadius: 99,
          background: 'rgba(20,18,32,0.78)', backdropFilter: 'blur(14px)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{
            width: 14, height: 10,
            borderRadius: 3,
            border: `1.5px solid ${CITY_COLOR}`,
            background: 'rgba(199,182,255,0.22)',
            boxShadow: '0 0 6px rgba(199,182,255,0.4)',
            display: 'inline-block',
          }} />
          VISITED · 足迹
        </div>
      </div>

      {/* Selected city detail */}
      <div style={{ padding: '8px 22px 0' }}>
        <div className="section-label">recent stop</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '8px 0 14px' }}>
          <h2 className="cn display-cn" style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>{sel.cn}</h2>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)' }}>· {sel.en}</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          marginBottom: 16,
        }}>
          {[
            { v: sel.posts, l: '足迹数', en: 'posts' },
            { v: sel.date, l: '抵达', en: 'arrived' },
            { v: '7°C', l: '当时气温', en: 'temp' },
          ].map((s) => (
            <div key={s.l} style={{
              padding: '10px 12px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: 12,
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.15 }}>{s.en}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginBottom: 10 }}>posts from here</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 18, scrollbarWidth: 'none' }}>
          {POSTS.slice(0, 4).map((p) => (
            <div key={p.id} onClick={() => onNav('video', { postId: p.id })}
              className={`ai-video ${p.grad}`}
              style={{
                width: 110, height: 150, borderRadius: 12,
                flexShrink: 0, position: 'relative', cursor: 'pointer',
                border: '1px solid var(--line)',
              }}>
              <div className="cn" style={{
                position: 'absolute', bottom: 8, left: 8, right: 8, zIndex: 4,
                fontSize: 11, fontWeight: 500, color: '#fff',
                textShadow: '0 1px 4px rgba(0,0,0,0.6)',
              }}>{p.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 30 }} />

      <style dangerouslySetInnerHTML={{ __html: `
        .leaflet-container { background: #0a0a14 !important; outline: none; font-family: inherit; }
        .leaflet-tile { filter: saturate(0.7) brightness(0.95); }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom { display: none !important; }

        /* Polygon / dot transitions */
        .leaflet-interactive {
          transition: stroke-width .18s ease, stroke .18s ease, fill-opacity .18s ease;
          filter: drop-shadow(0 0 4px rgba(199,182,255,0.35));
        }
        .leaflet-interactive:focus { outline: none; }

        /* City label (separate marker, non-interactive) */
        .fp-city-label-wrap { background: transparent !important; border: 0 !important; }
        .fp-city-label {
          transform: translate(-50%, 0);
          padding: 2px 7px;
          background: rgba(20,18,32,0.72);
          backdrop-filter: blur(6px);
          color: rgba(255,255,255,0.92);
          border: 0.5px solid rgba(199,182,255,0.45);
          border-radius: 99px;
          white-space: nowrap;
          font-size: 10.5px; font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.45);
          opacity: 0;
          transition: opacity .2s ease, color .2s ease, background .2s ease;
          pointer-events: none;
        }
        .fp-city-label-wrap.is-selected .fp-city-label {
          opacity: 1;
          color: #15131c;
          background: #fff;
          border-color: transparent;
        }
      `}} />
    </div>
  );
}

const hdrBtn = {
  width: 38, height: 38, borderRadius: '50%',
  background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
  border: '0.5px solid rgba(255,255,255,0.12)',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

const zoomBtn = {
  width: 36, height: 36, padding: 0,
  background: 'transparent', border: 0,
  color: 'rgba(255,255,255,0.85)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

Object.assign(window, { Footprint });
