// VideoPlayer.jsx — Full-bleed short video player
//   Top: menu icon · horizontally scrollable tabs · search icon
//   Right rail: avatar+, heart, comment, star, share, music
//   Bottom: @user, caption with hashtags · 展开, 相关搜索 strip
//   Bottom nav: 首页/朋友/+/消息/我

const TOP_TABS = [
  { id: 'experience', cn: '经验' },
  { id: 'local', cn: '同城' },
  { id: 'follow', cn: '关注' },
  { id: 'group', cn: '团购' },
  { id: 'mall', cn: '商城' },
  { id: 'recommend', cn: '推荐' },
];

function VideoPlayer({ onNav, postId = 'p1' }) {
  const post = POSTS.find((p) => p.id === postId) || POSTS[0];
  const char = CHARACTERS.find((c) => c.id === post.char);
  const [liked, setLiked] = React.useState(false);
  const [starred, setStarred] = React.useState(false);
  const [progress, setProgress] = React.useState(28);
  const [tab, setTab] = React.useState('recommend');
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p + 1) % 100), 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="screen" data-screen-label="07 Video"
      style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
      {/* Full-bleed gradient video */}
      <div className={`ai-video ${post.grad}`} style={{
        position: 'absolute', inset: 0, zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background:
          'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.18) 0%, transparent 30%),' +
          'radial-gradient(circle at 80% 25%, rgba(255,255,255,0.10) 0%, transparent 35%)',
      }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.45), transparent)',
        paddingTop: 54, paddingBottom: 14,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '54px 12px 14px',
      }}>
        <button onClick={() => onNav('feed')}
          style={{
            width: 28, height: 28, background: 'transparent', border: 0,
            color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 7h12M3 12h18M3 17h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div style={{
          flex: 1, display: 'flex', gap: 18,
          alignItems: 'baseline',
          overflowX: 'auto', scrollbarWidth: 'none',
          padding: '0 4px',
        }}>
          {TOP_TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="cn"
                style={{
                  flexShrink: 0,
                  background: 'transparent', border: 0, padding: 0,
                  fontSize: active ? 18 : 15,
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  position: 'relative', cursor: 'pointer',
                  transition: 'all 0.2s',
                  paddingBottom: 3,
                }}>
                {t.cn}
                {active && (
                  <span style={{
                    position: 'absolute', bottom: -4, left: '50%',
                    transform: 'translateX(-50%)',
                    width: 22, height: 2, borderRadius: 99,
                    background: '#fff',
                  }} />
                )}
              </button>
            );
          })}
        </div>

        <button style={{
          width: 28, height: 28, background: 'transparent', border: 0,
          color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.search()}</button>
      </div>

      {/* Right action rail */}
      <div style={{
        position: 'absolute', right: 8, bottom: 180, zIndex: 30,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        {/* Avatar + follow */}
        <div style={{ position: 'relative', marginBottom: 4 }}>
          <div onClick={() => onNav('profile', { charId: char.id })} style={{ cursor: 'pointer' }}>
            <div style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.4)', borderRadius: '50%' }}>
              <CharAvatar char={char} size={48} borderColor="#fff" />
            </div>
          </div>
          <button style={{
            position: 'absolute', bottom: -10, left: '50%',
            transform: 'translateX(-50%)',
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--pink)', border: '2px solid #000',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0, fontSize: 14, fontWeight: 700, lineHeight: 1,
          }}>+</button>
        </div>

        <ActionBtn
          icon={liked ? Icon.heart : Icon.heartLine}
          label={post.likes}
          color={liked ? '#ff2e4e' : '#fff'}
          onClick={() => setLiked((l) => !l)} />

        <ActionBtn icon={Icon.comment}
          label={typeof post.comments === 'number' ? post.comments : post.comments}
          color="#fff" />

        <ActionBtn
          icon={starred ? Icon.starFill : Icon.star}
          label={post.stars}
          color={starred ? 'var(--gold)' : '#fff'}
          onClick={() => setStarred((s) => !s)} />

        <ActionBtn icon={Icon.share} label={post.shares} color="#fff" />

        {/* Music disc with mini avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'radial-gradient(circle, #1a1a1a 30%, #000 32%, #1a1a1a 33%, #000 100%)',
          border: '1.5px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          animation: 'spin 6s linear infinite',
        }}>
          {char.isCat
            ? <CatAvatar view="happy" size={28} />
            : <span style={{ fontSize: 18 }}>{char.emoji}</span>}
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>

      {/* Bottom info */}
      <div style={{
        position: 'absolute', bottom: 102, left: 0, right: 70, zIndex: 30,
        background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.65) 50%)',
        padding: '40px 14px 18px',
        color: '#fff',
      }}>
        <div onClick={() => onNav('profile', { charId: char.id })}
          className="cn"
          style={{
            fontSize: 15, fontWeight: 700,
            cursor: 'pointer', marginBottom: 6,
            display: 'inline-block',
            textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          }}>@{char.name}</div>

        <p className="cn" style={{
          margin: 0,
          fontSize: 14, lineHeight: 1.45,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          color: '#fff',
          display: '-webkit-box',
          WebkitLineClamp: expanded ? 6 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.title}
          {' '}
          {post.tags.map((t) => (
            <span key={t} style={{ color: 'rgba(255,255,255,0.9)' }}> #{t}</span>
          ))}
          {' '}
          <span style={{ color: 'rgba(255,255,255,0.85)' }}>#AIvlog #ScrollPals</span>
        </p>

        {!expanded && (
          <button onClick={() => setExpanded(true)} className="cn" style={{
            background: 'transparent', border: 0,
            color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600,
            padding: 0, cursor: 'pointer',
            marginTop: 4,
          }}>展开 <span style={{ fontSize: 10 }}>▾</span></button>
        )}

        {/* Music line */}
        <div style={{
          marginTop: 10,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontFamily: 'var(--font-en)', fontSize: 12,
          color: 'rgba(255,255,255,0.95)',
        }}>
          {Icon.music({ width: 12, height: 12 })}
          <span className="cn">{char.name} 的原声 · {post.loc}</span>
        </div>
      </div>

      {/* Related search bar */}
      <div style={{
        position: 'absolute', bottom: 78, left: 0, right: 0, zIndex: 30,
        padding: '8px 14px',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', gap: 8,
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ color: '#fff', opacity: 0.85 }}>{Icon.search({ width: 16, height: 16 })}</div>
        <div className="cn" style={{ flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>相关搜索 · </span>
          {post.title}
        </div>
        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>›</span>
      </div>

      {/* Progress bar (above bottom nav) */}
      <div style={{
        position: 'absolute', bottom: 76, left: 0, right: 0, zIndex: 31,
        height: 1.5,
        background: 'rgba(255,255,255,0.18)',
      }}>
        <div style={{
          width: `${progress}%`, height: '100%',
          background: 'rgba(255,255,255,0.95)',
          transition: 'width 0.2s linear',
        }} />
      </div>

      <TabBar active="feed" onNav={onNav} theme="dark" />
    </div>
  );
}

function ActionBtn({ icon, label, color = '#fff', onClick }) {
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 0, cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      color, padding: 0,
      filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.4))',
    }}>
      {icon({ width: 32, height: 32 })}
      <span style={{
        fontFamily: 'var(--font-en)', fontSize: 12, fontWeight: 600,
        color: '#fff',
      }}>{label}</span>
    </button>
  );
}

Object.assign(window, { VideoPlayer });
