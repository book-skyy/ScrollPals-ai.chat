// Collection.jsx — 收藏室 · postcards collected by the user, grouped by city.
//   Each saved postcard records a visited city, building a personal travel wall.

function CollectionScreen({ onNav }) {
  const items = useCollection();

  // Group by city (first segment of post.loc, e.g. "京都 · Kyoto" → "京都")
  const groups = React.useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const city = (it.loc || '未知').split(' · ')[0];
      const cityEn = (it.loc || '').split(' · ')[1] || '';
      if (!map.has(city)) map.set(city, { city, cityEn, items: [] });
      map.get(city).items.push(it);
    }
    return Array.from(map.values());
  }, [items]);

  const [active, setActive] = React.useState(null);

  return (
    <div className="screen" data-screen-label="08 Collection" style={{ background: 'var(--bg)' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        padding: '54px 18px 14px',
        background: 'linear-gradient(180deg, var(--bg) 70%, transparent)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={() => onNav('feed')} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--surface)', border: '0.5px solid var(--line)',
          color: 'var(--ink)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.back()}</button>

        <div style={{ flex: 1 }}>
          <div className="display-cn" style={{
            fontSize: 22, fontWeight: 700, color: 'var(--ink)',
            letterSpacing: 0.04, lineHeight: 1,
          }}>收藏室</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--ink-3)', marginTop: 4, letterSpacing: 0.15,
            textTransform: 'uppercase',
          }}>
            {groups.length} CITIES · {items.length} POSTCARDS
          </div>
        </div>

        <button onClick={() => onNav('footprint')} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--accent-soft)', border: '0.5px solid var(--accent-line)',
          color: 'var(--accent-2)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} title="去地图看足迹">{Icon.globe({ width: 18, height: 18 })}</button>
      </div>

      {items.length === 0 && (
        <div style={{
          padding: '40px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 14,
        }}>
          <div style={{
            width: 88, height: 88, borderRadius: 20,
            background: 'linear-gradient(160deg, #f6efe1, #ede2cb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
            transform: 'rotate(-8deg)',
            color: '#7a5a30',
          }}>{Icon.postcard({ width: 38, height: 38 })}</div>
          <div className="cn" style={{
            fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: 8,
          }}>还没有收藏的明信片</div>
          <p className="cn" style={{
            margin: 0, fontSize: 13, lineHeight: 1.6,
            color: 'var(--ink-3)', maxWidth: 260,
          }}>翻到卡片背面，按下「收进收藏室」就能把这座城市装进抽屉。</p>
          <button onClick={() => onNav('feed')} className="cn"
            style={{
              marginTop: 8,
              padding: '0 18px', height: 40, borderRadius: 99,
              background: 'var(--accent)', color: '#15131c',
              border: 0, cursor: 'pointer',
              fontSize: 13.5, fontWeight: 700,
            }}>去翻明信片</button>
        </div>
      )}

      {items.length > 0 && (
        <div style={{ padding: '6px 18px 100px' }}>
          <div className="section-label" style={{ marginBottom: 10 }}>visited cities</div>
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 14,
            scrollbarWidth: 'none', marginBottom: 4,
          }}>
            {groups.map((g) => {
              const isActive = active === g.city;
              return (
                <button key={g.city} onClick={() => setActive(isActive ? null : g.city)}
                  className="cn"
                  style={{
                    flexShrink: 0,
                    padding: '8px 14px',
                    borderRadius: 99,
                    background: isActive ? 'var(--accent)' : 'var(--surface)',
                    color: isActive ? '#15131c' : 'var(--ink)',
                    border: isActive ? 0 : '0.5px solid var(--line)',
                    cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'baseline', gap: 6,
                  }}>
                  {g.city}
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    opacity: 0.7,
                  }}>{g.items.length}</span>
                </button>
              );
            })}
          </div>

          {groups
            .filter((g) => !active || g.city === active)
            .map((g) => (
              <div key={g.city} style={{ marginTop: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12,
                }}>
                  <h3 className="display-cn cn" style={{
                    margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--ink)',
                  }}>{g.city}</h3>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)',
                  }}>{g.cityEn ? `· ${g.cityEn}` : ''}</span>
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-mono)', fontSize: 10.5,
                    color: 'var(--ink-3)', letterSpacing: 0.15,
                  }}>{g.items.length} CARDS</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                }}>
                  {g.items.map((it, idx) => (
                    <MiniPostcard key={it.postId} item={it} tilt={idx % 2 === 0 ? -2 : 2}
                      onTap={() => onNav('video', { postId: it.postId })}
                      onRemove={() => Collection.remove(it.postId)} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <TabBar active="profile" onNav={onNav} theme="light" />
    </div>
  );
}

function MiniPostcard({ item, tilt = 0, onTap, onRemove }) {
  const char = CHARACTERS.find((c) => c.id === item.charId);
  const cityEn = (item.loc || '').split(' · ')[1] || '';
  return (
    <div className="postcard"
      onClick={onTap}
      style={{
        position: 'relative',
        aspectRatio: '5/7',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transform: `rotate(${tilt}deg)`,
        transition: 'transform 0.25s, box-shadow 0.25s',
        boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
      }}>
      <div className={`postcard-stamp ${item.grad}`} style={{
        position: 'absolute', top: 8, right: 8,
        width: 36, height: 46, padding: 4, fontSize: 18,
        borderRadius: 3,
        boxShadow: '0 0 0 2.5px #fff, 0 0 0 3px rgba(40,28,12,0.18)',
      }}>
        <span style={{ position: 'relative', zIndex: 2 }}>{char?.emoji}</span>
      </div>

      <div className="postcard-postmark" style={{
        top: 10, left: 8, width: 54, height: 54,
        fontSize: 7,
      }}>
        <span>{(cityEn || item.loc.split(' · ')[0]).toUpperCase()}</span>
        <span style={{ marginTop: 1, fontSize: 9 }}>{item.date}</span>
      </div>

      <div style={{
        position: 'absolute', left: 10, right: 10, top: 78, bottom: 36,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div className="cn display-cn" style={{
          fontFamily: 'var(--font-display-cn)',
          fontSize: 13, fontWeight: 600, lineHeight: 1.25,
          color: '#2a2018',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{item.title}</div>
        <p className="cn" style={{
          margin: 0,
          fontSize: 10, lineHeight: 1.45,
          color: 'rgba(42, 32, 24, 0.7)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{item.caption}</p>
      </div>

      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 8,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span className="cn" style={{
          fontFamily: 'var(--font-display-cn)', fontStyle: 'italic',
          fontSize: 11, color: 'rgba(42, 32, 24, 0.7)',
          flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>— {char?.name || '旅人'}</span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
          aria-label="移除"
          style={{
            width: 22, height: 22, borderRadius: '50%',
            background: 'rgba(40, 28, 12, 0.08)',
            border: '0.5px solid rgba(40, 28, 12, 0.18)',
            color: 'rgba(40, 28, 12, 0.6)',
            cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

window.CollectionScreen = CollectionScreen;
