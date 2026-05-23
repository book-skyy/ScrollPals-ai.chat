// Profile.jsx — Douyin-style profile page
//   Hero banner with avatar (big, round, top-left) + name + ID
//   Stats row (3 metrics: 获赞 / 关注 / 粉丝)
//   Bio + IP/location chips + footprint card
//   Big primary follow button + share
//   作品 NNN heading, 3-column grid

function Profile({ onNav, charId = 'dango' }) {
  const char = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];
  const charPosts = POSTS.filter((p) => p.char === charId);
  const grid = [...charPosts, ...POSTS, ...POSTS].slice(0, 12);
  const [followed, setFollowed] = React.useState(false);

  return (
    <div className="screen" data-screen-label="04 Profile">
      {/* Hero banner */}
      <div style={{
        position: 'relative',
        height: 340,
        marginBottom: -90,
        overflow: 'hidden',
        background: '#1a1230',
      }}>
        <img src="figs/background.png" alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            zIndex: 1, display: 'block',
          }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 4,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, var(--bg) 95%)',
        }} />
        {/* Top bar — overlaid on hero */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 6,
          padding: '60px 14px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <CircleBtn onClick={() => onNav('feed')} dark>{Icon.back()}</CircleBtn>
          <div style={{ display: 'flex', gap: 8 }}>
            <CircleBtn dark>{Icon.search({ width: 18, height: 18 })}</CircleBtn>
            <CircleBtn dark>{Icon.more()}</CircleBtn>
          </div>
        </div>
      </div>

      {/* Avatar + name + ID block — overlapping the hero */}
      <div style={{
        padding: '0 18px',
        position: 'relative', zIndex: 6,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'var(--surface)',
          border: '3px solid var(--bg)',
          boxSizing: 'content-box',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            <CharAvatar char={char} size={76} view="happy" />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, paddingTop: 18 }}>
          <div className="cn" style={{ fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
            {char.name}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--ink-3)', marginTop: 4,
          }}>
            <span className="cn">ScrollPals ID：</span>
            <span>{char.tag.replace('ScrollPals ID：', '')}</span>
            {Icon.copy({ width: 11, height: 11, style: { color: 'var(--ink-4)' } })}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 22,
        padding: '14px 18px 10px',
      }}>
        {[
          { v: char.likes, l: '获赞' },
          { v: char.following, l: '关注' },
          { v: char.followers, l: '粉丝' },
        ].map((s, i) => (
          <div key={s.l} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-en)', fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>
              {s.v}
            </span>
            <span className="cn" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.l}</span>
          </div>
        ))}
      </div>

      {/* Bio */}
      <p className="cn" style={{
        margin: '0 18px 12px',
        fontSize: 13.5, lineHeight: 1.55,
        color: 'var(--ink-2)',
      }}>{char.bio}</p>

      {/* IP / location tag chips */}
      <div style={{ display: 'flex', gap: 8, padding: '0 18px 14px', flexWrap: 'wrap' }}>
        <div className="cn" style={{
          padding: '4px 10px', borderRadius: 6,
          background: 'var(--accent-soft)', color: 'var(--accent-2)',
          fontSize: 11, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          {Icon.sparkAI({ width: 11, height: 11 })}
          AI 伙伴 · ScrollPals
        </div>
        <div className="cn" style={{
          padding: '4px 10px', borderRadius: 6,
          background: 'var(--surface-2)', color: 'var(--ink-2)',
          fontSize: 11, fontWeight: 500,
        }}>IP：京都</div>
        <div className="cn" style={{
          padding: '4px 10px', borderRadius: 6,
          background: 'var(--surface-2)', color: 'var(--ink-2)',
          fontSize: 11, fontWeight: 500,
        }}>1987 年出厂</div>
      </div>

      {/* Footprint card */}
      <div style={{ padding: '0 18px 14px' }}>
        <button onClick={() => onNav('footprint', { charId })}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            width: '100%', padding: '12px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            cursor: 'pointer', textAlign: 'left',
          }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--accent-soft)',
            color: 'var(--accent-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.globe({ width: 18, height: 18 })}</div>
          <div style={{ flex: 1 }}>
            <div className="cn" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>
              查看足迹
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--ink-3)', marginTop: 2,
            }}>12 cities · 487 days</div>
          </div>
          <span style={{ color: 'var(--ink-3)' }}>{Icon.chev()}</span>
        </button>
      </div>

      {/* Action buttons — big follow + chat + share */}
      <div style={{
        padding: '0 18px 18px',
        display: 'flex', gap: 8,
      }}>
        <button onClick={() => setFollowed((f) => !f)}
          className="cn"
          style={{
            flex: 1, height: 46, borderRadius: 12,
            background: followed ? 'var(--surface-2)' : 'var(--accent)',
            color: followed ? 'var(--ink-2)' : '#15131c',
            border: 0, cursor: 'pointer',
            fontSize: 15, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all 0.15s',
          }}>
          {followed ? '已关注 ✓' : '+ 关注'}
        </button>
        <button onClick={() => onNav('chat', { charId })}
          style={{
            width: 46, height: 46, borderRadius: 12,
            background: 'var(--surface-2)', color: 'var(--ink-2)',
            border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icon.chat({ width: 20, height: 20 })}</button>
        <button style={{
          width: 46, height: 46, borderRadius: 12,
          background: 'var(--surface-2)', color: 'var(--ink-2)',
          border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.share({ width: 20, height: 20 })}</button>
      </div>

      {/* Tabs above grid */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 20,
        padding: '0 18px 12px',
        borderBottom: '0.5px solid var(--line)',
      }}>
        <TabUnderline label="作品" count={char.posts} active />
        <TabUnderline label="动态" count={84} />
        <TabUnderline label="喜欢" count={1.2} suffix="K" />
        <TabUnderline label="收藏" count={Collection.read().length} onClick={() => onNav('collection')} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2,
        padding: 2,
        paddingBottom: 100,
      }}>
        {grid.map((p, i) => (
          <GridCell key={`${p.id}-${i}`} post={p} idx={i}
            onTap={() => {}} />
        ))}
      </div>

    </div>
  );
}

function CircleBtn({ children, onClick, dark = false }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: '50%',
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(12px)',
      border: '0.5px solid rgba(255,255,255,0.15)',
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}>{children}</button>
  );
}

function TabUnderline({ label, count, suffix = '', active = false, onClick }) {
  return (
    <button className="cn" onClick={onClick} style={{
      background: 'transparent', border: 0, cursor: 'pointer',
      padding: '8px 0',
      fontSize: active ? 15 : 14, fontWeight: active ? 700 : 500,
      color: active ? 'var(--ink)' : 'var(--ink-3)',
      position: 'relative',
    }}>
      {label}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--ink-4)', marginLeft: 4 }}>
        {count}{suffix}
      </span>
      {active && (
        <span style={{
          position: 'absolute', bottom: -0.5, left: 0, right: 0,
          height: 2.5, background: 'var(--accent)', borderRadius: 99,
        }} />
      )}
    </button>
  );
}

function GridCell({ post, onTap, idx }) {
  const pinned = idx === 0;
  return (
    <div onClick={onTap}
      className={`ai-video ${post.grad}`}
      style={{
        aspectRatio: '3/4',
        position: 'relative', cursor: 'pointer',
      }}>
      {pinned && (
        <div style={{
          position: 'absolute', top: 6, left: 6, zIndex: 4,
          background: 'var(--accent)',
          color: '#15131c',
          fontFamily: 'var(--font-en)', fontSize: 9.5, fontWeight: 700, letterSpacing: 0.1,
          padding: '2px 6px', borderRadius: 3,
        }}>置顶</div>
      )}
      {post.kind === 'guide' && (
        <div style={{
          position: 'absolute', top: 6, left: 6, zIndex: 4,
          display: 'inline-flex', alignItems: 'center', gap: 3,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
          color: 'var(--accent-2)',
          fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
          padding: '2px 6px', borderRadius: 3,
        }}>{Icon.sparkAI({ width: 9, height: 9 })}AI</div>
      )}

      {/* Caption overlay */}
      <div className="cn" style={{
        position: 'absolute',
        top: pinned || post.kind === 'guide' ? 32 : 6,
        left: 6, right: 6,
        zIndex: 4,
        fontSize: 10, fontWeight: 600, color: '#fff',
        textShadow: '0 1px 4px rgba(0,0,0,0.7)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{post.title}</div>

      {/* Like count bottom-left */}
      <div style={{
        position: 'absolute', bottom: 6, left: 6, zIndex: 4,
        display: 'flex', alignItems: 'center', gap: 3,
        fontFamily: 'var(--font-en)', fontSize: 11, fontWeight: 600,
        color: 'rgba(255,255,255,0.95)',
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        {Icon.heartLine({ width: 13, height: 13 })}
        {post.likes}
      </div>

      {/* Duration bottom-right */}
      {post.dur && (
        <div style={{
          position: 'absolute', bottom: 6, right: 6, zIndex: 4,
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'rgba(255,255,255,0.85)',
        }}>▶ {post.dur}</div>
      )}
    </div>
  );
}

Object.assign(window, { Profile });
