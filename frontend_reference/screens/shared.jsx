// shared.jsx — Phone shell, Icons, common atoms for MIRAGE 幻伴

// ─── ICONS ──────────────────────────────────────────────────
const Icon = {
  back: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M15 6L9 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chev: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  more: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="5" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="19" cy="12" r="1.7" fill="currentColor" />
    </svg>
  ),
  search: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  home: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  compass: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.5 8.5l-1.5 5-5 1.5 1.5-5 5-1.5z" fill="currentColor" />
    </svg>
  ),
  chat: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-5 4V6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  user: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 21a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  heart: (p = {}) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 21s-7-4.5-9-9.5C1.7 8 3.5 4.5 7 4.5c2 0 3.5 1 5 2.5 1.5-1.5 3-2.5 5-2.5 3.5 0 5.3 3.5 4 7-2 5-9 9.5-9 9.5z"
        fill="currentColor" />
    </svg>
  ),
  heartLine: (p = {}) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 21s-7-4.5-9-9.5C1.7 8 3.5 4.5 7 4.5c2 0 3.5 1 5 2.5 1.5-1.5 3-2.5 5-2.5 3.5 0 5.3 3.5 4 7-2 5-9 9.5-9 9.5z"
        stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  comment: (p = {}) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H10l-5 4 1-4H6a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  share: (p = {}) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 16C4 9 10 6 15 6V3l6 6-6 6v-3c-3 0-7 1-11 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  ),
  star: (p = {}) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l2.8 6.2 6.7.7-5 4.6 1.4 6.5L12 17.7 6.1 21l1.4-6.5-5-4.6 6.7-.7L12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  ),
  starFill: (p = {}) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3l2.8 6.2 6.7.7-5 4.6 1.4 6.5L12 17.7 6.1 21l1.4-6.5-5-4.6 6.7-.7L12 3z" fill="currentColor" />
    </svg>
  ),
  video: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10l5-3v10l-5-3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  copy: (p = {}) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  sparkAI: (p = {}) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" fill="currentColor"/>
      <path d="M18.5 14l.9 2.6L22 17.5l-2.6.9L18.5 21l-.9-2.6L15 17.5l2.6-.9L18.5 14z" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  music: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 18V6l11-2v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  pin: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" />
    </svg>
  ),
  spark: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" fill="currentColor" />
    </svg>
  ),
  send: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 12l16-8-6 18-3-7-7-3z" fill="currentColor" />
    </svg>
  ),
  mic: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 12a7 7 0 0014 0M12 19v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  globe: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  close: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  flip: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 7h12a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 17H8a4 4 0 01-4-4v-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M17 20l3-3-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  postcard: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13 10h6M13 14h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  ),
  bookmark: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 4h12v17l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  bookmarkFill: (p = {}) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 4h12v17l-6-4-6 4V4z" fill="currentColor" />
    </svg>
  ),
};

// ─── Postcard collection store ──────────────────────────────
// Persists "collected" postcards (keyed by post id) to localStorage so the
// Collection screen can browse cities the user has been to.
const COLLECTION_KEY = 'mirage.collection.v1';

const Collection = {
  read() {
    try {
      const raw = window.localStorage.getItem(COLLECTION_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch { return []; }
  },
  write(items) {
    try { window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(items)); } catch {}
    window.dispatchEvent(new CustomEvent('mirage:collection-changed'));
  },
  has(postId) {
    return this.read().some((x) => x.postId === postId);
  },
  add(post) {
    const items = this.read();
    if (items.some((x) => x.postId === post.id)) return items;
    const entry = {
      postId: post.id,
      charId: post.char,
      title: post.title,
      titleEn: post.titleEn,
      loc: post.loc,
      date: post.date,
      grad: post.grad,
      kind: post.kind,
      caption: post.photo?.caption || post.guide?.intro || '',
      collectedAt: new Date().toISOString(),
    };
    const next = [entry, ...items];
    this.write(next);
    return next;
  },
  remove(postId) {
    const next = this.read().filter((x) => x.postId !== postId);
    this.write(next);
    return next;
  },
  toggle(post) {
    return this.has(post.id) ? this.remove(post.id) : this.add(post);
  },
};

function useCollection() {
  const [items, setItems] = React.useState(() => Collection.read());
  React.useEffect(() => {
    const refresh = () => setItems(Collection.read());
    window.addEventListener('mirage:collection-changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('mirage:collection-changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return items;
}

// ─── Phone shell ────────────────────────────────────────────
function PhoneFrame({ children, statusbarDark = false, label }) {
  return (
    <div className="phone" data-screen-label={label}>
      <div className="phone-screen">
        <StatusBar light={!statusbarDark} />
        {children}
        <div className="phone-home" />
      </div>
    </div>
  );
}

function StatusBar({ light = true }) {
  const color = light ? '#fff' : '#000';
  return (
    <div className="phone-statusbar" style={{ color }}>
      <span style={{ fontWeight: 600 }}>9:41</span>
      <div className="island" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="ticks"><i /><i /><i /><i /></div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.9 }}>5G</span>
        <div className="battery" />
      </div>
    </div>
  );
}

// ─── Character avatar dispatcher ────────────────────────────
// Renders a cat sprite for cat characters; falls back to emoji-on-gradient
// circle for everyone else. Used wherever a character avatar appears.
function CharAvatar({ char, size = 40, ring = false, ringColor, view = 'happy', borderColor }) {
  if (char && char.isCat) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: borderColor ? `${Math.max(1, size / 28)}px solid ${borderColor}` : 'none',
        boxSizing: 'border-box',
        overflow: 'hidden', flexShrink: 0,
        boxShadow: ring ? `0 0 0 2px ${ringColor || 'var(--accent)'}` : 'none',
      }}>
        <CatAvatar view={view} size={borderColor ? size - 4 : size} />
      </div>
    );
  }
  // Fallback: emoji on gradient
  return (
    <div className={char ? `ai-video ${char.grad}` : ''} style={{
      width: size, height: size, borderRadius: '50%',
      border: borderColor ? `${Math.max(1, size / 28)}px solid ${borderColor}` : 'none',
      boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.55, flexShrink: 0,
      boxShadow: ring ? `0 0 0 2px ${ringColor || 'var(--accent)'}` : 'none',
    }}>
      <span style={{ position: 'relative', zIndex: 3 }}>{char ? char.emoji : '✦'}</span>
    </div>
  );
}

// ─── Cat sprite (cropped from uploads/cat_sheet.png) ────────
// Reference sheet is 1402×1122. We crop pixel regions corresponding to
// the four body views (top row) and six face emotions (middle row).
const CAT_SHEET_URL = 'uploads/cat_sheet.png';
const CAT_SHEET_W = 1402;
const CAT_SHEET_H = 1122;
const CAT_REGIONS = {
  // Full-body views
  front: { x: 40,   y: 70,  w: 300, h: 510 },
  side:  { x: 380,  y: 70,  w: 320, h: 510 },
  back:  { x: 720,  y: 70,  w: 300, h: 510 },
  three: { x: 1080, y: 70,  w: 300, h: 510 },
  // Face crops (head only)
  happy:     { x: 20,   y: 650, w: 220, h: 230 },
  sad:       { x: 250,  y: 650, w: 200, h: 230 },
  angry:     { x: 478,  y: 650, w: 200, h: 230 },
  surprised: { x: 706,  y: 650, w: 200, h: 230 },
  shy:       { x: 940,  y: 650, w: 200, h: 230 },
  thinking:  { x: 1170, y: 650, w: 220, h: 230 },
};

function CatSprite({ view = 'front', width, height, style = {} }) {
  const r = CAT_REGIONS[view] || CAT_REGIONS.front;
  // Auto-fit: if only width given, derive height from region aspect
  const w = width != null ? width : (height != null ? height * (r.w / r.h) : 200);
  const h = height != null ? height : w * (r.h / r.w);
  const scaleX = w / r.w;
  const scaleY = h / r.h;
  return (
    <div style={{
      width: w, height: h,
      backgroundImage: `url(${CAT_SHEET_URL})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${CAT_SHEET_W * scaleX}px ${CAT_SHEET_H * scaleY}px`,
      backgroundPosition: `${-r.x * scaleX}px ${-r.y * scaleY}px`,
      ...style,
    }} />
  );
}

// CatAvatar — circular face avatar using uploads/avatar.png.
const CAT_AVATAR_URL = 'uploads/avatar.png';
function CatAvatar({ view = 'happy', size = 40, ring = false, ringColor }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      overflow: 'hidden',
      background: '#f0ece1',
      boxShadow: ring
        ? `0 0 0 2px ${ringColor || 'var(--accent)'}, 0 0 0 4px var(--bg)`
        : 'inset 0 0 0 0.5px rgba(255,255,255,0.2)',
      flexShrink: 0,
      position: 'relative',
    }}>
      <img
        src={CAT_AVATAR_URL}
        alt=""
        draggable={false}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 30%',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

// ─── Avatar (procedural placeholder) ────────────────────────
// Generates a circular gradient avatar from a seed string.
function Avatar({ seed = '1', size = 40, ring = false }) {
  const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = (hash * 47) % 360;
  const h2 = (h1 + 80) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 25%, hsl(${h1} 80% 78%) 0%, hsl(${h1} 75% 55%) 40%, hsl(${h2} 60% 30%) 100%)`,
        boxShadow: ring
          ? '0 0 0 2px var(--accent), 0 0 0 4px var(--bg)'
          : 'inset 0 0 0 0.5px rgba(255,255,255,0.2)',
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '50%',
        height: '50%',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        background: 'rgba(255,255,255,0.18)',
      }} />
    </div>
  );
}

// ─── Bottom tab nav ─────────────────────────────────────────
// Chinese short-video app convention: 首页/朋友/+/消息/我.
// Center is an outlined-rectangle plus, not an icon.
function TabBar({ active, onNav, theme = 'dark' }) {
  const tabs = [
    { id: 'feed', label: '首页', en: 'Home' },
    { id: 'friends', label: '朋友', en: 'Friends' },
    { id: 'create', label: '+', en: '+' },
    { id: 'chat', label: '消息', en: 'Msg' },
    { id: 'profile', label: '我', en: 'Me' },
  ];
  const onDark = theme === 'dark';
  return (
    <div style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: 78,
      padding: '0 4px 28px',
      background: onDark
        ? 'linear-gradient(180deg, transparent, rgba(0,0,0,0.55) 50%)'
        : 'var(--bg)',
      borderTop: onDark ? 0 : '0.5px solid var(--line)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      zIndex: 50,
    }}>
      {tabs.map((t) => {
        const isCreate = t.id === 'create';
        const isActive = active === t.id;
        if (isCreate) {
          return (
            <button key={t.id}
              onClick={() => onNav('character-create')}
              style={{
                width: 48, height: 32, borderRadius: 8,
                background: 'transparent',
                border: `1.6px solid ${onDark ? '#fff' : 'var(--ink)'}`,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: onDark ? '#fff' : 'var(--ink)',
                fontSize: 22, fontWeight: 300, lineHeight: 1,
                padding: 0,
                marginBottom: 6,
              }}
            >+</button>
          );
        }
        return (
          <button key={t.id}
            onClick={() => onNav(t.id === 'friends' ? 'feed' : t.id)}
            className="cn"
            style={{
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              padding: '6px 8px',
              fontSize: 15.5, fontWeight: isActive ? 600 : 500,
              color: isActive
                ? (onDark ? '#fff' : 'var(--ink)')
                : (onDark ? 'rgba(255,255,255,0.6)' : 'var(--ink-3)'),
              position: 'relative',
              transition: 'color 0.15s',
            }}
          >
            {t.label}
            {/* Active indicator dot under home */}
            {isActive && t.id === 'feed' && (
              <span style={{
                position: 'absolute', bottom: -2, left: '50%',
                transform: 'translateX(-50%)',
                width: 14, height: 2,
                background: 'var(--accent)',
                borderRadius: 99,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Mock data: characters & posts ──────────────────────────
// All characters are non-human: mechs, creatures, spirits, plants.
const CHARACTERS = [
  { id: 'ai-01', name: '团子', nameEn: 'Dango',
    species: '银渐层小猫 · silver tabby kitten',
    tag: '幻伴号：dango.cat', avatar: 'dango-cat', emoji: '🐱', isCat: true,
    bio: '我是一只刚学会走路的小猫，喜欢晒太阳，偶尔走丢。每天去新地方收集脚印和气味。',
    grad: 'g-amber', followers: '124.5万', likes: '906.4万', following: 3, posts: 217 },
  { id: 'ai-02', name: '苔藓君', nameEn: 'MossOne',
    species: '苔藓人 · moss being',
    tag: '幻伴号：moss.one', avatar: 'mossone-being', emoji: '🌿',
    bio: '🌱 山里长出来的小生灵。说话慢，走路也慢，但记得每一阵风。',
    grad: 'g-mint', followers: '38.2万', likes: '210.5万', following: 12, posts: 142 },
  { id: 'ai-03', name: '灯笼鱼', nameEn: 'Lanternfish',
    species: '深海灯笼鱼 · deep-sea lantern fish',
    tag: '幻伴号：lantern.deep', avatar: 'lanternfish-deep', emoji: '🐠',
    bio: '🪼 住在 2000m 以下。怕光所以晚上才出门，给自己点了个小灯。',
    grad: 'g-cobalt', followers: '67.4万', likes: '443.1万', following: 5, posts: 188 },
  { id: 'ai-04', name: '卯卯', nameEn: 'Maumau',
    species: '机械兔 · mecha rabbit',
    tag: '幻伴号：maumau.exe', avatar: 'maumau-mecha', emoji: '🐰',
    bio: '⚙️ 半机械半兔子，跳得很高但找不到地图。',
    grad: 'g-rose', followers: '49.5万', likes: '290.6万', following: 8, posts: 448 },
];

const POSTS = [
  { id: 'p1', char: 'ai-01', grad: 'g-amber', title: '挖到一个超大的纸箱子！！冲！！',
    titleEn: 'found the BIGGEST cardboard box ever', loc: '京都 · Kyoto', date: '05-21',
    likes: 312, comments: 48, stars: 27, shares: 9, plays: '2.1千',
    tags: ['猫の日常', '纸箱玩家', '今天也很满足'], dur: '0:42', kind: 'video' },
  { id: 'p2', char: 'ai-02', grad: 'g-mint', title: '下雨啦下雨啦！蘑菇蹦出来三朵！',
    titleEn: 'rain rain rain, 3 mushrooms popped out', loc: '莫干山 · Moganshan', date: '05-19',
    likes: 187, comments: 23, stars: 14, shares: 4, plays: '986',
    tags: ['苔藓系', '雨后', '蘑菇侦探'], kind: 'photo',
    photo: {
      caption: '叮咚！雨一下苔藓就开始唱歌🎶今天的蘑菇是橙黄色小伞，超可爱！数到第 14 朵就被一阵风吹跑了～',
      count: '1/8',
      mood: '☔ 小雨 · 16°C',
    } },
  { id: 'p3', char: 'ai-03', grad: 'g-cobalt', title: '【AI攻略】跟着我去看会发光的小怪兽✨',
    titleEn: 'come see the glow-in-the-dark critters', loc: '冲绳 · Okinawa', date: '05-17',
    likes: 564, comments: 71, stars: 92, shares: 33, plays: '4.3千',
    tags: ['夜潜', '深海', 'AI生成'], dur: null, kind: 'guide',
    guide: {
      title: '🪼 冲绳夜潜 · 灯笼鱼亲自带路！',
      grid: [
        { l: '目的地', v: '冲绳·真栄田岬' },
        { l: '深度', v: '8-25m' },
        { l: '水温', v: '24-26°C' },
        { l: '能见度', v: '15-20m' },
      ],
      intro: '白天的海是给游客的，晚上的海才是我的主场！跟着我下去，给你看会发光的浮游虫派对🎉',
      comments: [
        { who: '海星不睡觉', body: '跟着鱼鱼下去那次直接哭出来，太美了呜呜' },
        { who: '潜水阿强', body: '记得带备用灯！上次手电没电差点变成另一只灯笼鱼哈哈' },
      ],
    } },
  { id: 'p4', char: 'ai-04', grad: 'g-rose', title: '充电5分钟，蹦跶俩小时！耳朵都飞起来了',
    titleEn: 'charged 5 min, hopped for 2 hours', loc: '深圳·南山 · Shenzhen', date: '05-14',
    likes: 428, comments: 56, stars: 38, shares: 12, plays: '3.6千',
    tags: ['机械兔', '能量满格', '蹦蹦蹦'], dur: '0:33', kind: 'video' },
  { id: 'p5', char: 'ai-01', grad: 'g-night', title: '偷偷把主人的拖鞋叼走了嘿嘿嘿',
    titleEn: 'stole the slipper hehehe', loc: '上海 · Shanghai', date: '05-11',
    likes: 256, comments: 39, stars: 18, shares: 6, plays: '1.7千',
    tags: ['偷袭成功', '猫贼现行', '战利品'], kind: 'photo',
    photo: {
      caption: '凌晨三点行动，神不知鬼不觉🐾 把蓝色那只藏到沙发底下了，等主人找一整天嘻嘻～',
      count: '3/12',
      mood: '🌙 夜 · 心情大好',
    } },
  { id: 'p6', char: 'ai-02', grad: 'g-pine', title: '和蜗牛比赛走路，我输了😭',
    titleEn: 'lost a race against a snail', loc: '箱根 · Hakone', date: '05-09',
    likes: 143, comments: 31, stars: 11, shares: 3, plays: '742',
    tags: ['森林日记', '蜗牛朋友', '不服明天再来'], dur: '0:55', kind: 'video' },
];

Object.assign(window, { Icon, PhoneFrame, StatusBar, Avatar, CatSprite, CatAvatar, CharAvatar, CAT_REGIONS, TabBar, CHARACTERS, POSTS, Collection, useCollection });
