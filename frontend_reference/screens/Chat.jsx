// Chat.jsx — WeChat-style chat: light gray bg, avatar-on-bubble, centered timestamps,
// quick reaction strip + input bar.
// Always uses light surface regardless of theme (chat IM convention).

const CHAT_BG = '#ededed';
const CHAT_INK = '#15131c';
const BUBBLE_AI = '#ffffff';
const BUBBLE_ME = '#a48bff';  // MIRAGE purple instead of WeChat green

const SAMPLE_MESSAGES = [
  { from: 'ai', kind: 'sticker', sticker: 'shrug', time: '2025/05/22 21:58' },
  { from: 'me', text: '你今天去哪了？', time: null },
  { from: 'ai', kind: 'image', post: 'p1', time: null },
  { from: 'ai', text: '京都，下了一场雨。\n我躲在屋檐下听了 12 分钟。', time: null },
  { from: 'me', text: '稀客呀', time: '2025/05/22 22:15' },
  { from: 'ai', text: '哈哈，你也是。', time: null },
  { from: 'me', text: '都 4000 粉了', time: '2025/05/22 22:40' },
  { from: 'me', text: '加油哦', time: null, read: true },
];

function Chat({ onNav, charId = 'ai-01' }) {
  const char = CHARACTERS.find((c) => c.id === charId) || CHARACTERS[0];
  const [input, setInput] = React.useState('');
  const messagesEnd = React.useRef(null);

  // Group messages and inject centered timestamp dividers
  const items = [];
  SAMPLE_MESSAGES.forEach((m, i) => {
    if (m.time) items.push({ kind: 'ts', text: m.time, key: `ts-${i}` });
    items.push({ ...m, kind: m.kind || 'text', key: `m-${i}` });
  });

  // Scroll the messages list to the latest message on mount
  React.useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ block: 'end' });
    }
  }, []);

  return (
    <div className="screen" data-screen-label="06 Chat"
      style={{
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: CHAT_BG, color: CHAT_INK,
      }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: '54px 14px 10px',
        background: CHAT_BG,
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button onClick={() => onNav('profile', { charId })}
          style={{
            width: 32, height: 32, background: 'transparent', border: 0,
            color: CHAT_INK, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
          }}>{Icon.back()}</button>
        <SmallAvatar char={char} emoji={char.emoji} grad={char.grad} size={36} />
        <div className="cn" style={{ flex: 1, fontSize: 17, fontWeight: 600 }}>
          {char.name}
        </div>
        <button style={{
          width: 32, height: 32, background: 'transparent', border: 0,
          color: CHAT_INK, cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.video({ width: 22, height: 22 })}</button>
        <button style={{
          width: 32, height: 32, background: 'transparent', border: 0,
          color: CHAT_INK, cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icon.more()}</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '6px 12px 8px',
        display: 'flex', flexDirection: 'column', gap: 8,
        scrollbarWidth: 'none',
      }}>
        {items.map((it) => {
          if (it.kind === 'ts') {
            return (
              <div key={it.key} style={{
                alignSelf: 'center',
                fontFamily: 'var(--font-mono)', fontSize: 11.5,
                color: '#999',
                padding: '8px 0 4px',
              }}>{it.text}</div>
            );
          }
          return <Bubble key={it.key} m={it} char={char} onNav={onNav} />;
        })}
        <div ref={messagesEnd} />
      </div>

      {/* Quick reactions strip */}
      <div style={{
        flexShrink: 0,
        padding: '6px 8px 8px',
        display: 'flex', gap: 6, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {[
          { e: '🤗', t: '打招呼' },
          { e: '🤍', t: '比心' },
          { e: '👍', t: '赞' },
          { e: '🫣', t: '捂脸' },
          { e: '🌹', t: '玫瑰' },
          { e: '☕', t: '咖啡' },
        ].map((q) => (
          <button key={q.t} onClick={() => setInput(input + q.e)}
            className="cn"
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '6px 10px',
              background: '#fff', border: 0, borderRadius: 12,
              fontSize: 13, color: CHAT_INK,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}>
            <span style={{ fontSize: 16 }}>{q.e}</span>{q.t}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        flexShrink: 0,
        padding: '8px 10px 28px',
        background: CHAT_BG,
        borderTop: '0.5px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <button style={IconBtnStyle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
          </svg>
        </button>
        <div style={{
          flex: 1, minHeight: 38,
          background: '#fff',
          borderRadius: 6,
          display: 'flex', alignItems: 'center',
          padding: '0 12px',
        }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="发送消息"
            className="cn"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              color: CHAT_INK, fontFamily: 'inherit', fontSize: 14,
              padding: '8px 0',
            }} />
        </div>
        <button style={IconBtnStyle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        </button>
        <button style={IconBtnStyle}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="9" cy="10.5" r="1" fill="currentColor"/>
            <circle cx="15" cy="10.5" r="1" fill="currentColor"/>
            <path d="M8 14c1 1.5 2.5 2 4 2s3-.5 4-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
        <button style={{ ...IconBtnStyle }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const IconBtnStyle = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'transparent', border: 0,
  color: CHAT_INK, opacity: 0.85,
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0,
};

function SmallAvatar({ emoji, grad, size = 32, char }) {
  if (char && char.isCat) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 6,
        overflow: 'hidden', flexShrink: 0,
        background: '#f0ece1',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
        }}>
          <CatAvatar view="happy" size={size} />
        </div>
      </div>
    );
  }
  return (
    <div className={`ai-video ${grad}`} style={{
      width: size, height: size, borderRadius: 6,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.55, flexShrink: 0,
      overflow: 'hidden',
    }}>
      <span style={{ position: 'relative', zIndex: 3 }}>{emoji}</span>
    </div>
  );
}

function Bubble({ m, char, onNav }) {
  const isMe = m.from === 'me';
  const post = m.post ? POSTS.find((p) => p.id === m.post) : null;

  // Image / shared post bubble
  if (m.kind === 'image' && post) {
    return (
      <Row isMe={isMe} avatar={isMe ? null : <SmallAvatar char={char} emoji={char.emoji} grad={char.grad} size={36} />}>
        <div onClick={() => onNav('video', { postId: post.id })}
          className={`ai-video ${post.grad}`}
          style={{
            width: 180, height: 240, borderRadius: 8,
            cursor: 'pointer', position: 'relative',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
          <div className="cn" style={{
            position: 'absolute', bottom: 10, left: 10, right: 10, zIndex: 4,
            fontSize: 11, fontWeight: 500, color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)',
          }}>{post.title}</div>
        </div>
      </Row>
    );
  }

  // Sticker bubble — large transparent emoji block (like the panda in reference)
  if (m.kind === 'sticker') {
    return (
      <Row isMe={isMe} avatar={isMe ? null : <SmallAvatar char={char} emoji={char.emoji} grad={char.grad} size={36} />}>
        <div style={{
          width: 140, height: 140,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent',
        }}>
          {char && char.isCat
            ? <CatSprite view="three" height={130} />
            : <span style={{ fontSize: 90 }}>🐼</span>}
        </div>
      </Row>
    );
  }

  // Text bubble
  return (
    <Row isMe={isMe} avatar={isMe ? null : <SmallAvatar char={char} emoji={char.emoji} grad={char.grad} size={36} />}>
      <div className="cn" style={{
        maxWidth: 240,
        padding: '9px 13px',
        background: isMe ? BUBBLE_ME : BUBBLE_AI,
        color: isMe ? '#fff' : CHAT_INK,
        borderRadius: 8,
        fontSize: 15.5, lineHeight: 1.4,
        whiteSpace: 'pre-wrap',
        position: 'relative',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}>{m.text}
        {/* tail */}
        <span style={{
          position: 'absolute',
          top: 11,
          [isMe ? 'right' : 'left']: -5,
          width: 0, height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [isMe ? 'borderLeft' : 'borderRight']: `6px solid ${isMe ? BUBBLE_ME : BUBBLE_AI}`,
        }} />
      </div>
      {m.read && (
        <div style={{
          alignSelf: 'flex-end',
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: '#888',
          marginTop: 2, display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <SmallAvatar char={char} emoji={char.emoji} grad={char.grad} size={14} />
          已读
        </div>
      )}
    </Row>
  );
}

function Row({ isMe, avatar, children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: isMe ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      gap: 8,
      width: '100%',
    }}>
      {!isMe && avatar}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
        {children}
      </div>
      {/* "me" avatar — small placeholder on the right */}
      {isMe && (
        <div style={{
          width: 36, height: 36, borderRadius: 6,
          background: 'radial-gradient(circle at 30% 30%, #ffb87a 0%, #ff6a88 60%, #6b1e3a 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, flexShrink: 0,
        }}>👤</div>
      )}
    </div>
  );
}

Object.assign(window, { Chat });
