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
  const [muted, setMuted] = React.useState(true);
  const [chatCtaDismissed, setChatCtaDismissed] = React.useState(false);
  const lastPost = POSTS[POSTS.length - 1];
  const showChatCta = !chatCtaDismissed && activePostId === lastPost.id;
  const lastChar = CHARACTERS.find((c) => c.id === lastPost.char) || CHARACTERS[0];

  // After watching the guitar_2 post for ~5 seconds of actual playback,
  // surface a soft prompt toward the guitar report.
  const GUITAR_POST_ID = 'p6';
  const SEA_POST_ID = 'p3';
  const REVEAL_S = 5;
  const [guitarPlayed, setGuitarPlayed] = React.useState(0);
  const [guitarCtaDismissed, setGuitarCtaDismissed] = React.useState(false);
  const onGuitarTime = React.useCallback((t) => {
    setGuitarPlayed((cur) => (t > cur ? t : cur));
  }, []);
  const guitarCtaVisible =
    !guitarCtaDismissed &&
    activePostId === GUITAR_POST_ID &&
    guitarPlayed >= REVEAL_S;
  // CTAs always speak as 团子 (the cat) regardless of who authored the post.
  const guitarChar = CHARACTERS.find((c) => c.id === 'dango') || CHARACTERS[0];

  // After watching the sea (p3) post for ~5 seconds, surface a chat prompt.
  const [seaPlayed, setSeaPlayed] = React.useState(0);
  const [seaCtaDismissed, setSeaCtaDismissed] = React.useState(false);
  const onSeaTime = React.useCallback((t) => {
    setSeaPlayed((cur) => (t > cur ? t : cur));
  }, []);
  const seaCtaVisible =
    !seaCtaDismissed &&
    activePostId === SEA_POST_ID &&
    seaPlayed >= REVEAL_S;
  const seaChar = CHARACTERS.find((c) => c.id === 'dango') || CHARACTERS[0];

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
    <>
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
            onTap: () => {},
            onAvatar: () => onNav('profile', { charId: p.char }),
            onLike: () => onLike(p.id),
            onStar: () => onStar(p.id),
            onComment: () => onComment(p.id),
            onShare: () => onShare(p.id),
          };
          props.isActive = activePostId === p.id;
          props.muted = muted;
          props.onToggleMute = () => setMuted((m) => !m);
          if (p.id === GUITAR_POST_ID) props.onTimeUpdate = onGuitarTime;
          if (p.id === SEA_POST_ID) props.onTimeUpdate = onSeaTime;
          if (p.kind === 'guide') return <GuideCard key={p.id} {...props} />;
          if (p.kind === 'photo') return <PhotoCard key={p.id} {...props} />;
          return <VideoCard key={p.id} {...props} />;
        })}
      </div>

      <ChatCta visible={showChatCta}
        char={lastChar}
        onTap={() => onNav('chat', { charId: lastChar.id })}
        onClose={() => setChatCtaDismissed(true)} />
    </div>
    {/* TabBar + floating CTAs rendered outside the scrolling .screen so they
        stay pinned to the phone bottom across all snapped cards. */}
    <GuitarCta visible={guitarCtaVisible}
      char={guitarChar}
      onTap={() => onNav('guitar-report')}
      onClose={() => setGuitarCtaDismissed(true)} />
    <SeaCta visible={seaCtaVisible}
      char={seaChar}
      onTap={() => onNav('chat', { charId: seaChar.id })}
      onClose={() => setSeaCtaDismissed(true)} />
    <TabBar active="feed" onNav={onNav} theme="dark" />
    </>
  );
}

// Same shape as GuitarCta — surfaces after watching p3 (sea) for a few
// seconds and offers to start a chat with the character.
function SeaCta({ visible, char, onTap, onClose }) {
  return (
    <FloatingCta visible={visible} char={char} onClose={onClose}
      title="主人，想跟我聊聊吗 🥺?"
      subtitle="海里好玩的事我可有一肚子要讲～"
      buttonLabel="去聊聊"
      onTap={onTap} />
  );
}

// Shared bottom-sheet style CTA used by both GuitarCta and SeaCta.
function FloatingCta({ visible, char, title, subtitle, buttonLabel, onTap, onClose }) {
  return (
    <div style={{
      position: 'absolute',
      left: 12, right: 12,
      bottom: visible ? 96 : -260,
      zIndex: 60,
      opacity: visible ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.15)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        position: 'relative',
        padding: '18px 16px 16px',
        borderRadius: 22,
        background: 'linear-gradient(180deg, rgba(28,22,48,0.92), rgba(14,12,26,0.95))',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '0.5px solid rgba(164,139,255,0.35)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(164,139,255,0.18), 0 0 32px rgba(164,139,255,0.18)',
      }}>
        <button onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label="dismiss"
          style={{
            position: 'absolute', top: 10, right: 10,
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

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
          <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
            <span style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              background: 'var(--accent)', opacity: 0.32,
              animation: visible ? 'cta-pulse 2s ease-out infinite' : 'none',
            }} />
            {(char.isCat || char.figAvatar) ? (
              <img src={char.isCat ? 'uploads/avatar.png' : char.figAvatar} alt="" style={{
                position: 'relative', zIndex: 2,
                width: 46, height: 46, borderRadius: '50%',
                border: '1.5px solid #fff', objectFit: 'cover',
                background: '#1a1820', display: 'block',
              }} />
            ) : (
              <div className={`ai-video ${char.grad}`} style={{
                position: 'relative', zIndex: 2,
                width: 46, height: 46, borderRadius: '50%',
                border: '1.5px solid #fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}><span style={{ position: 'relative', zIndex: 3 }}>{char.emoji}</span></div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 22 }}>
            <div className="cn" style={{
              fontSize: 14, color: 'var(--accent-2)', fontWeight: 600, marginBottom: 4,
              letterSpacing: 0.2,
            }}>@{char.name}</div>
            <div className="cn" style={{
              fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.4,
            }}>{title}</div>
            {subtitle && (
              <div className="cn" style={{
                fontSize: 12.5, color: 'rgba(255,255,255,0.65)', marginTop: 4, lineHeight: 1.5,
              }}>{subtitle}</div>
            )}
          </div>
        </div>

        <button onClick={onTap} className="cn" style={{
          width: '100%', height: 44, borderRadius: 14,
          background: 'var(--accent)', border: 0,
          color: '#15131c', fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 22px rgba(164,139,255,0.4)',
        }}>
          {buttonLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Surfaces after watching the guitar video for a few seconds; opens the guitar report.
function GuitarCta({ visible, char, onTap, onClose }) {
  return (
    <FloatingCta visible={visible} char={char} onClose={onClose}
      title="主人，你是想学吉他嘛 🎸？"
      subtitle="我给你准备了一份从零开始的攻略喵 ✨"
      buttonLabel="去看吉他攻略"
      onTap={onTap} />
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

// Auto-play <video> only while its post is the active one in the snap feed.
// Tapping anywhere on the card toggles mute (handled by parent via onTap).
function FeedVideo({ post, isActive, muted, onTimeUpdate }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = muted;
    if (isActive) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, muted]);
  React.useEffect(() => {
    const v = ref.current; if (!v || !onTimeUpdate) return;
    const onTime = () => onTimeUpdate(v.currentTime || 0);
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, [onTimeUpdate]);
  return (
    <video ref={ref}
      src={post.video}
      poster={post.poster}
      loop playsInline
      preload={isActive ? 'auto' : 'metadata'}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'contain', zIndex: 1,
        background: '#000',
      }} />
  );
}

// ─── VideoCard ──────────────────────────────────────────────
function VideoCard({ post, state, flipped, onFlip, onTap, onAvatar, onLike, onStar, onComment, onShare, isActive, muted, onToggleMute, onTimeUpdate }) {
  const char = CHARACTERS.find((c) => c.id === post.char);
  return (
    <article className="feed-card" data-postid={post.id} style={{
      position: 'relative',
      height: '100%',
      minHeight: 826,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div onClick={onTap}
        style={{
          position: 'absolute', inset: 0, cursor: 'pointer',
          overflow: 'hidden', background: '#000',
        }}>
        {post.video && <FeedVideo post={post} isActive={isActive} muted={muted} onTimeUpdate={onTimeUpdate} />}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }} />
      </div>

      <CardCaption char={char} post={post} />

      <ActionRail char={char} state={state}
        onAvatar={onAvatar} onLike={onLike} onStar={onStar}
        onComment={onComment} onShare={onShare} />
    </article>
  );
}

// Bottom-left author + title + tags overlay (TikTok-style).
function CardCaption({ char, post }) {
  return (
    <div className="cn" style={{
      position: 'absolute', left: 14, right: 80, bottom: 95, zIndex: 5,
      color: '#fff',
      textShadow: '0 1px 4px rgba(0,0,0,0.55)',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>
        @{char.name}
      </div>
      <div style={{ fontSize: 13.5, lineHeight: 1.4, marginBottom: 6 }}>
        {post.title}
      </div>
      {post.tags && (
        <div style={{ fontSize: 12.5, opacity: 0.92 }}>
          {post.tags.map((t) => `#${t}`).join(' ')}
        </div>
      )}
    </div>
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
        position: 'absolute', top: 90, bottom: 100, left: 0, right: 0,
        width: '100%',
        zIndex: 5,
        filter: 'drop-shadow(0 24px 60px rgba(0,0,0,0.6))',
      }}>
        <FlipCard flipped={flipped}>
          {/* Front — designed postcard front image */}
          <div className="flip-face" style={{
            background: '#1a1820',
            borderRadius: 0, overflow: 'hidden',
            padding: 0,
          }}>
            <img src={post.cardFront} alt="" onClick={onTap}
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                display: 'block', cursor: 'pointer',
              }} />
          </div>

          {/* Back — designed postcard back image */}
          <div className="flip-face flip-back" style={{
            borderRadius: 0, overflow: 'hidden',
            background: '#1a1820',
          }}>
            <img src={post.cardBack} alt=""
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                display: 'block',
              }} />
            <CollectButton post={post} />
          </div>
        </FlipCard>
      </div>

      {/* Location caption — small text, left aligned, just under the postcard */}
      <div className="cn" style={{
        position: 'absolute', left: 14, right: 14, bottom: 170,
        zIndex: 6,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: 'rgba(255,255,255,0.78)',
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
      }}>
        {Icon.pin({ width: 12, height: 12 })}
        <span>{post.loc}</span>
      </div>

      <FlipToggle flipped={flipped} onClick={onFlip} bottom={130} />
    </article>
  );
}

// ─── GuideCard ──────────────────────────────────────────────
function GuideCard({ post, state, flipped, onFlip, onTap, onAvatar, onLike, onStar, onComment, onShare, isActive, muted, onToggleMute, onTimeUpdate }) {
  const char = CHARACTERS.find((c) => c.id === post.char);
  const g = post.guide;
  return (
    <article className="feed-card" data-postid={post.id} style={{
      position: 'relative',
      height: '100%',
      minHeight: 826,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div onClick={onTap}
        style={{
          position: 'absolute', inset: 0, cursor: 'pointer',
          overflow: 'hidden', background: '#000',
        }}>
        {post.video && <FeedVideo post={post} isActive={isActive} muted={muted} onTimeUpdate={onTimeUpdate} />}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }} />
      </div>

      <CardCaption char={char} post={post} />

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

// Floating "加入收藏室" button shown on the back face of a postcard. Uses the
// existing Collection module so taps persist + are reflected in the 收藏 screen.
function CollectButton({ post }) {
  const [collected, setCollected] = React.useState(() => Collection.has(post.id));
  React.useEffect(() => {
    const refresh = () => setCollected(Collection.has(post.id));
    window.addEventListener('mirage:collection-changed', refresh);
    return () => window.removeEventListener('mirage:collection-changed', refresh);
  }, [post.id]);
  const onClick = (e) => {
    e.stopPropagation();
    Collection.toggle(post);
  };
  return (
    <button onClick={onClick} className="cn"
      style={{
        position: 'absolute', left: '50%', bottom: 18,
        transform: 'translateX(-50%)',
        padding: '10px 22px', borderRadius: 999,
        background: collected ? 'rgba(40, 28, 12, 0.85)' : '#2a2018',
        color: '#f6efe1',
        border: 0, cursor: 'pointer',
        fontSize: 13.5, fontWeight: 600, letterSpacing: 0.04,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 20px rgba(0,0,0,0.45)',
        transition: 'all 0.18s',
        zIndex: 5,
      }}>
      {collected
        ? Icon.bookmarkFill({ width: 14, height: 14 })
        : Icon.bookmark({ width: 14, height: 14 })}
      {collected ? '已加入收藏室' : '加入收藏室'}
    </button>
  );
}

function FlipToggle({ flipped, onClick, bottom = 86 }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flip-toggle"
      style={{ left: 14, bottom }}>
      <span className="flip-toggle-ico">{Icon.flip()}</span>
      {flipped ? '' : '看明信片'}
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
      <div style={{ position: 'relative', marginBottom: 4 }}>
        {char.figAvatar ? (
          <img src={char.figAvatar} alt="" style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '2px solid #fff', objectFit: 'cover',
            background: '#1a1820',
            display: 'block',
          }} />
        ) : (
          <div className={`ai-video ${char.grad}`} style={{
            width: 46, height: 46, borderRadius: '50%',
            border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>
            <span style={{ position: 'relative', zIndex: 3 }}>{char.emoji}</span>
          </div>
        )}
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
  // Run only on (re)mount — parent's `key` prop changes on toggle and remounts
  // this button, which is when we want the pop. Without an empty deps array the
  // animation re-fires on every parent re-render (e.g. video timeupdate events).
  React.useEffect(() => {
    if (animate && ref.current) {
      ref.current.classList.remove('heart-pop');
      void ref.current.offsetWidth;
      ref.current.classList.add('heart-pop');
    }
  }, []);
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
