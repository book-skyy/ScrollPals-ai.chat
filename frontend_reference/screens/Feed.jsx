// Feed.jsx — Vertical scroll-snap card feed
//   Mixed card types: VideoCard / PhotoCard / GuideCard
//   Front face: clean visual (no captions), with a flip toggle.
//   Back face: postcard with the copy + 收藏 button (saves to 收藏室).

const FEED_TABS = [
  { id: 'experience', cn: '经验' },
  { id: 'local', cn: '同城' },
  { id: 'follow', cn: '关注' },
  { id: 'group', cn: '团购' },
  { id: 'mall', cn: '商城' },
  { id: 'recommend', cn: '推荐' },
];

function Feed({ onNav, tweaks }) {
  const [tab, setTab] = React.useState('recommend');
  const screenRef = React.useRef(null);
  const [activePostId, setActivePostId] = React.useState(POSTS[0].id);
  const [chatCtaDismissed, setChatCtaDismissed] = React.useState(false);
  const lastPost = POSTS[POSTS.length - 1];
  const showChatCta = !chatCtaDismissed && activePostId === lastPost.id;
  const lastChar = CHARACTERS.find((c) => c.id === lastPost.char) || CHARACTERS[0];

  // Per-card flip state
  const [flipped, setFlipped] = React.useState({});
  const toggleFlip = (id) => setFlipped((s) => ({ ...s, [id]: !s[id] }));

  // Cross-card action state
  const [interactions, setInteractions] = React.useState(() => {
    const init = {};
    POSTS.forEach((p) => {
      init[p.id] = { liked: false, starred: false, likes: p.likes, stars: p.stars, comments: p.comments, shares: p.shares };
    });
    return init;
  });

  const onLike = (id) => setInteractions((s) => {
    const cur = s[id];
    return { ...s, [id]: { ...cur, liked: !cur.liked, likes: bump(cur.likes, !cur.liked) } };
  });
  const onStar = (id) => setInteractions((s) => {
    const cur = s[id];
    return { ...s, [id]: { ...cur, starred: !cur.starred, stars: bump(cur.stars, !cur.starred) } };
  });
  const onComment = (id) => setInteractions((s) => {
    const cur = s[id];
    return { ...s, [id]: { ...cur, comments: (typeof cur.comments === 'number' ? cur.comments : parseInt(cur.comments)) + 1 } };
  });
  const onShare = (id) => setInteractions((s) => {
    const cur = s[id];
    return { ...s, [id]: { ...cur, shares: bump(cur.shares, true) } };
  });

  React.useEffect(() => {
    const root = screenRef.current;
    if (!root) return;
    const compute = () => {
      const cards = root.querySelectorAll('.feed-card');
      if (!cards.length) return;
      const cardH = cards[0].offsetHeight || root.clientHeight || 1;
      const firstTop = cards[0].offsetTop;
      const idx = Math.round((root.scrollTop - firstTop + cardH * 0.45) / cardH);
      const clamped = Math.max(0, Math.min(cards.length - 1, idx));
      cards.forEach((el, i) => el.classList.toggle('in-view', i === clamped));
      const id = cards[clamped].dataset.postid;
      if (id) setActivePostId(id);
    };
    root.addEventListener('scroll', compute, { passive: true });
    compute();
    const t1 = setTimeout(compute, 100);
    const t2 = setTimeout(compute, 400);
    return () => {
      root.removeEventListener('scroll', compute);
      clearTimeout(t1); clearTimeout(t2);
    };
  }, []);

  return (
    <div ref={screenRef}
      className="screen feed-snap" data-screen-label="03 Feed"
      style={{ background: '#000' }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        padding: '54px 12px 14px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent)',
        display: 'flex', alignItems: 'center', gap: 8,
        pointerEvents: 'auto',
      }}>
        <button style={topIconBtn}>
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
          {FEED_TABS.map((t) => {
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
                  transition: 'all 0.2s', paddingBottom: 3,
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

        <button style={topIconBtn} onClick={() => onNav('collection')} title="收藏室">
          {Icon.bookmark({ width: 20, height: 20 })}
        </button>
        <button style={topIconBtn}>{Icon.search()}</button>
      </div>

      <div style={{ marginTop: -10 }}>
        {POSTS.map((p) => {
          const state = interactions[p.id];
          const props = {
            post: p, state,
            flipped: !!flipped[p.id],
            onFlip: () => toggleFlip(p.id),
            onTap: () => onNav('video', { postId: p.id }),
            onAvatar: () => onNav('profile', { charId: p.char }),
            onLike: () => onLike(p.id),
            onStar: () => onStar(p.id),
            onComment: () => onComment(p.id),
            onShare: () => onShare(p.id),
          };
          if (p.kind === 'guide') return <GuideCard key={p.id} {...props} />;
          if (p.kind === 'photo') return <PhotoCard key={p.id} {...props} />;
          return <VideoCard key={p.id} {...props} />;
        })}
      </div>

      <ChatCta visible={showChatCta}
        char={lastChar}
        onTap={() => onNav('chat', { charId: lastChar.id })}
        onClose={() => setChatCtaDismissed(true)} />

      <TabBar active="feed" onNav={onNav} theme="dark" />
    </div>
  );
}

function ChatCta({ visible, char, onTap, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 12, right: 12,
        bottom: visible ? 86 : 40,
        zIndex: 60,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
        pointerEvents: visible ? 'auto' : 'none',
      }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 12px 10px 10px',
        borderRadius: 999,
        background: 'rgba(20,18,32,0.78)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '0.5px solid rgba(255,255,255,0.12)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(164,139,255,0.18)',
      }}>
        <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
          <span style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            background: 'var(--accent)', opacity: 0.35,
            animation: visible ? 'cta-pulse 2s ease-out infinite' : 'none',
          }} />
          <div className={`ai-video ${char.grad}`} style={{
            position: 'relative', zIndex: 2,
            width: 40, height: 40, borderRadius: '50%',
            border: '1.5px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}><span style={{ position: 'relative', zIndex: 3 }}>{char.emoji}</span></div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cn" style={{
            fontSize: 14.5, fontWeight: 700, color: '#fff', lineHeight: 1.2,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            要跟我聊聊嘛
            <span style={{ color: 'var(--accent)', fontSize: 16, lineHeight: 1 }}>～</span>
          </div>
          <div className="cn" style={{
            fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>@{char.name} · 看完啦，来唠两句</div>
        </div>

        <button onClick={onTap} className="cn" style={{
          flexShrink: 0,
          padding: '0 14px', height: 36, borderRadius: 99,
          background: 'var(--accent)', border: 0,
          color: '#15131c', fontSize: 13, fontWeight: 700,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          去聊聊
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="dismiss"
          style={{
            flexShrink: 0,
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: 0,
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cta-pulse {
          0%   { transform: scale(0.85); opacity: 0.5; }
          70%  { transform: scale(1.5);  opacity: 0; }
          100% { transform: scale(1.5);  opacity: 0; }
        }
      `}} />
    </div>
  );
}

function bump(v, up) {
  if (typeof v === 'number') return v + (up ? 1 : -1);
  const m = String(v).match(/^([\d.]+)([万千]?)$/);
  if (m) {
    const n = parseFloat(m[1]);
    const next = Math.max(0, n + (up ? 0.1 : -0.1)).toFixed(1).replace(/\.0$/, '');
    return next + m[2];
  }
  return v;
}

const topIconBtn = {
  width: 28, height: 28, background: 'transparent', border: 0,
  color: 'rgba(255,255,255,0.85)', cursor: 'pointer', padding: 0,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

// ─── VideoCard ──────────────────────────────────────────────
function VideoCard({ post, state, flipped, onFlip, onTap, onAvatar, onLike, onStar, onComment, onShare }) {
  const char = CHARACTERS.find((c) => c.id === post.char);
  return (
    <article className="feed-card" data-postid={post.id} style={{
      position: 'relative',
      height: '100%',
      minHeight: 826,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <FlipCard flipped={flipped}>
        {/* Front — clean full-bleed media, no copy */}
        <div className={`flip-face ai-video ${post.grad}`}
          onClick={onTap}
          style={{ cursor: 'pointer' }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background:
              'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 0%, transparent 30%),' +
              'radial-gradient(circle at 80% 25%, rgba(255,255,255,0.08) 0%, transparent 35%)',
          }} />
          {/* Subtle location pin — the only on-front hint of context */}
          <div className="cn" style={{
            position: 'absolute', left: 14, bottom: 26, zIndex: 5,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 99,
            background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)',
            color: '#fff', fontSize: 11.5, fontWeight: 500,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            {Icon.pin({ width: 11, height: 11 })} {post.loc}
          </div>
        </div>

        {/* Back — postcard */}
        <div className="flip-face flip-back">
          <PostcardBack post={post} char={char} onAvatar={onAvatar} />
        </div>
      </FlipCard>

      <FlipToggle flipped={flipped} onClick={onFlip} bottom={86} />

      <ActionRail char={char} state={state}
        onAvatar={onAvatar} onLike={onLike} onStar={onStar}
        onComment={onComment} onShare={onShare} />
    </article>
  );
}

// ─── PhotoCard — polaroid-shape flip card ───────────────────
function PhotoCard({ post, state, flipped, onFlip, onTap, onAvatar }) {
  const char = CHARACTERS.find((c) => c.id === post.char);
  const ph = post.photo;
  return (
    <article className="feed-card" data-postid={post.id} style={{
      position: 'relative',
      height: '100%',
      minHeight: 826,
      background: '#0a0a0c',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className={`ai-video ${post.grad}`} style={{
        position: 'absolute', inset: 0, opacity: 0.35, filter: 'blur(40px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.85))',
      }} />

      <div className="card-content" style={{
        position: 'absolute', top: 90, left: 14, right: 14,
        height: 600,
        borderRadius: 18,
        zIndex: 5,
        filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.6))',
      }}>
        <FlipCard flipped={flipped}>
          {/* Front — photo only, no captions */}
          <div className="flip-face" style={{
            background: '#1a1820',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: 12,
          }}>
            <div onClick={onTap}
              className={`ai-video ${post.grad}`}
              style={{
                position: 'relative',
                width: '100%', height: '100%',
                borderRadius: 14, cursor: 'pointer',
                overflow: 'hidden',
              }}>
              <div onClick={(e) => { e.stopPropagation(); onAvatar(); }}
                style={{
                  position: 'absolute', top: 12, right: 12, zIndex: 4,
                  cursor: 'pointer',
                }}>
                <div className={`ai-video ${char.grad}`} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  border: '2px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}><span style={{ position: 'relative', zIndex: 3 }}>{char.emoji}</span></div>
              </div>

              <div style={{
                position: 'absolute', top: 12, left: 12, zIndex: 4,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                padding: '4px 9px', borderRadius: 99,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                color: '#fff',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {ph.count}
              </div>
            </div>
          </div>

          {/* Back — postcard */}
          <div className="flip-face flip-back" style={{ borderRadius: 18 }}>
            <PostcardBack post={post} char={char} onAvatar={onAvatar} compact />
          </div>
        </FlipCard>
      </div>

      <FlipToggle flipped={flipped} onClick={onFlip} bottom={130} />
    </article>
  );
}

// ─── GuideCard ──────────────────────────────────────────────
function GuideCard({ post, state, flipped, onFlip, onTap, onAvatar, onLike, onStar, onComment, onShare }) {
  const char = CHARACTERS.find((c) => c.id === post.char);
  const g = post.guide;
  return (
    <article className="feed-card" data-postid={post.id} style={{
      position: 'relative',
      height: '100%',
      minHeight: 826,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <FlipCard flipped={flipped}>
        {/* Front — clean visual + AI badge + location only */}
        <div className={`flip-face ai-video ${post.grad}`} onClick={onTap} style={{ cursor: 'pointer' }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)',
          }} />
          <div className="cn" style={{
            position: 'absolute', top: 100, left: 16, zIndex: 5,
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '5px 11px',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(8px)',
            borderRadius: 99,
            color: 'var(--accent-2)',
            fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
            letterSpacing: 0.1,
          }}>
            {Icon.sparkAI({ width: 11, height: 11 })}
            AI 攻略
          </div>
          <div className="cn" style={{
            position: 'absolute', left: 14, bottom: 26, zIndex: 5,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 11px', borderRadius: 99,
            background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(12px)',
            color: '#fff', fontSize: 11.5, fontWeight: 500,
          }}>
            {Icon.pin({ width: 11, height: 11 })} {post.loc}
          </div>
        </div>

        {/* Back — postcard with guide preview */}
        <div className="flip-face flip-back">
          <PostcardBack post={post} char={char} onAvatar={onAvatar} guide={g} />
        </div>
      </FlipCard>

      <FlipToggle flipped={flipped} onClick={onFlip} bottom={86} />

      <ActionRail char={char} state={state}
        onAvatar={onAvatar} onLike={onLike} onStar={onStar}
        onComment={onComment} onShare={onShare} />
    </article>
  );
}

// ─── FlipCard wrapper ───────────────────────────────────────
function FlipCard({ flipped, children }) {
  return (
    <div className={`flip-card ${flipped ? 'is-flipped' : ''}`}
      style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }}>
      <div className="flip-card-inner">
        {children}
      </div>
    </div>
  );
}

function FlipToggle({ flipped, onClick, bottom = 86 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flip-toggle"
      style={{ left: 14, bottom }}>
      <span className="flip-toggle-ico">{Icon.flip()}</span>
      {flipped ? '看视频' : '看明信片'}
    </button>
  );
}

// ─── Postcard back face ─────────────────────────────────────
function PostcardBack({ post, char, onAvatar, guide, compact = false }) {
  const [collected, setCollected] = React.useState(() => Collection.has(post.id));
  React.useEffect(() => {
    const refresh = () => setCollected(Collection.has(post.id));
    window.addEventListener('mirage:collection-changed', refresh);
    return () => window.removeEventListener('mirage:collection-changed', refresh);
  }, [post.id]);

  const onCollect = (e) => {
    e.stopPropagation();
    Collection.toggle(post);
  };

  const caption = post.photo?.caption
    || guide?.intro
    || `${post.title} · 一封来自 ${post.loc.split(' · ')[0]} 的明信片`;

  return (
    <div className="postcard cn" onClick={(e) => e.stopPropagation()}>
      <div className={`postcard-stamp ${post.grad}`}>
        <span style={{ position: 'relative', zIndex: 2 }}>{char.emoji}</span>
      </div>

      <div className="postcard-postmark">
        <span>{(post.loc.split(' · ')[1] || post.loc.split(' · ')[0]).toUpperCase()}</span>
        <span style={{ marginTop: 2, fontSize: 11 }}>{post.date}</span>
      </div>

      <div className="postcard-divider" />

      <div style={{
        position: 'absolute', top: 124, left: 22,
        right: '52%', bottom: 88,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div className="display-cn" style={{
          fontFamily: 'var(--font-display-cn)',
          fontSize: compact ? 17 : 19, fontWeight: 600, lineHeight: 1.25,
          color: '#2a2018',
        }}>{post.title}</div>

        <p style={{
          margin: 0,
          fontSize: 12.5, lineHeight: 1.65,
          color: 'rgba(42, 32, 24, 0.82)',
          display: '-webkit-box',
          WebkitLineClamp: compact ? 7 : 9,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{caption}</p>

        {guide && (
          <div style={{
            marginTop: 4,
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px',
            fontSize: 10.5,
          }}>
            {guide.grid.slice(0, 4).map((s, i) => (
              <div key={i} style={{ color: 'rgba(42, 32, 24, 0.7)' }}>
                <span style={{ opacity: 0.6 }}>{s.l}·</span>
                <span style={{ fontWeight: 600, marginLeft: 3 }}>{s.v}</span>
              </div>
            ))}
          </div>
        )}

        <div onClick={onAvatar} style={{
          marginTop: 'auto',
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'pointer',
        }}>
          <span style={{
            fontFamily: 'var(--font-display-cn)',
            fontSize: 14, fontStyle: 'italic', fontWeight: 600,
            color: 'rgba(42, 32, 24, 0.85)',
          }}>— {char.name}</span>
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 124, left: '52%',
        right: 22, bottom: 88,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: 0.2, textTransform: 'uppercase',
          color: 'rgba(120, 80, 40, 0.65)', marginBottom: 8,
        }}>To · 旅人</div>

        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            height: 22, lineHeight: '22px',
            borderBottom: '1px solid rgba(120, 80, 40, 0.22)',
            fontFamily: 'var(--font-display-cn)',
            fontSize: 12.5, color: 'rgba(42, 32, 24, 0.75)',
            paddingLeft: i === 0 ? 0 : 6,
            display: 'flex', alignItems: 'baseline', gap: 6,
          }}>
            {i === 0 && (
              <>
                <span style={{ opacity: 0.5, fontSize: 10 }}>FROM</span>
                <span style={{ fontWeight: 600 }}>{post.loc}</span>
              </>
            )}
            {i === 1 && post.tags && (
              <span style={{ fontSize: 11, color: 'rgba(120, 60, 40, 0.75)' }}>
                {post.tags.map((t) => `#${t}`).join('  ')}
              </span>
            )}
          </div>
        ))}

        <div style={{
          marginTop: 'auto',
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(120, 80, 40, 0.55)',
          letterSpacing: 0.15, textTransform: 'uppercase',
        }}>POST · {post.date}</div>
      </div>

      <div style={{
        position: 'absolute', left: 22, right: 22, bottom: 18,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={onCollect}
          className="cn"
          style={{
            flex: 1, height: 40, borderRadius: 12,
            background: collected ? 'rgba(40, 28, 12, 0.06)' : '#2a2018',
            color: collected ? '#2a2018' : '#f6efe1',
            border: collected ? '1px solid rgba(40, 28, 12, 0.25)' : 0,
            cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600, letterSpacing: 0.04,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.18s',
          }}>
          {collected ? Icon.bookmarkFill({ width: 15, height: 15 }) : Icon.bookmark({ width: 15, height: 15 })}
          {collected ? '已收入收藏室' : '收进收藏室'}
        </button>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9.5,
          color: 'rgba(120, 80, 40, 0.6)', letterSpacing: 0.18,
          textAlign: 'right',
        }}>
          {post.id.toUpperCase()}<br/>
          MIRAGE · 幻伴邮政
        </div>
      </div>
    </div>
  );
}

// ─── Right action rail (shared) ─────────────────────────────
function ActionRail({ char, state, onAvatar, onLike, onStar, onComment, onShare }) {
  const [heartKey, setHeartKey] = React.useState(0);
  const [starKey, setStarKey] = React.useState(0);

  const like = () => { setHeartKey((k) => k + 1); onLike(); };
  const star = () => { setStarKey((k) => k + 1); onStar(); };

  return (
    <div className="card-rail" style={{
      position: 'absolute', right: 8, bottom: 130, zIndex: 30,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
    }}>
      <div onClick={onAvatar} style={{ position: 'relative', cursor: 'pointer', marginBottom: 4 }}>
        <div className={`ai-video ${char.grad}`} style={{
          width: 46, height: 46, borderRadius: '50%',
          border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22,
        }}>
          <span style={{ position: 'relative', zIndex: 3 }}>{char.emoji}</span>
        </div>
        <span style={{
          position: 'absolute', bottom: -8, left: '50%',
          transform: 'translateX(-50%)',
          width: 20, height: 20, borderRadius: '50%',
          background: 'var(--pink)', border: '2px solid #000',
          color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, lineHeight: 1,
        }}>+</span>
      </div>

      <RailBtn key={`h-${heartKey}`} onClick={like}
        icon={state.liked ? Icon.heart : Icon.heartLine}
        label={state.likes}
        color={state.liked ? '#ff2e4e' : '#fff'}
        animate />

      <RailBtn onClick={onComment} icon={Icon.comment}
        label={typeof state.comments === 'number' ? state.comments.toLocaleString() : state.comments} />

      <RailBtn key={`s-${starKey}`} onClick={star}
        icon={state.starred ? Icon.starFill : Icon.star}
        label={state.stars}
        color={state.starred ? 'var(--gold)' : '#fff'}
        animate />

      <RailBtn onClick={onShare} icon={Icon.share} label={state.shares} />
    </div>
  );
}

function RailBtn({ icon, label, color = '#fff', onClick, animate = false }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (animate && ref.current) {
      ref.current.classList.remove('heart-pop');
      void ref.current.offsetWidth;
      ref.current.classList.add('heart-pop');
    }
  });
  return (
    <button onClick={onClick} style={{
      background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      color, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))',
    }}>
      <span ref={ref} style={{ display: 'inline-flex' }}>
        {icon({ width: 32, height: 32 })}
      </span>
      <span style={{
        fontFamily: 'var(--font-en)', fontSize: 11.5, fontWeight: 600,
        color: '#fff',
      }}>{label}</span>
    </button>
  );
}

Object.assign(window, { Feed });
