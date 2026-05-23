// app.jsx — Main router for MIRAGE 幻伴 prototype

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "cnFont": "hei",
  "showScreenPicker": true
}/*EDITMODE-END*/;

const SCREENS = [
  { id: 'character-create', label: '01 创建', en: 'Create' },
  { id: 'character-360', label: '02 环绕', en: '360°' },
  { id: 'feed', label: '03 首页', en: 'Feed' },
  { id: 'profile', label: '04 主页', en: 'Profile' },
  { id: 'footprint', label: '05 足迹', en: 'Map' },
  { id: 'chat', label: '06 聊天', en: 'Chat' },
  { id: 'video', label: '07 视频', en: 'Video' },
  { id: 'collection', label: '08 收藏', en: 'Postcards' },
  { id: 'guitar-report', label: '09 报告', en: 'Report' },
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme attribute
  React.useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.cn = t.cnFont;
  }, [t.theme, t.cnFont]);

  // Read initial screen from URL hash
  const [screen, setScreen] = React.useState(() => {
    const h = window.location.hash.slice(1);
    return SCREENS.find((s) => s.id === h) ? h : 'character-create';
  });
  const [ctx, setCtx] = React.useState({});

  const navigate = (next, c = {}) => {
    setScreen(next);
    setCtx(c);
    window.location.hash = next;
  };

  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.slice(1);
      if (SCREENS.find((s) => s.id === h)) setScreen(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40,
      background: 'radial-gradient(circle at 30% 20%, #1a0f3a 0%, #07070a 60%)',
      position: 'relative',
    }}>
      {/* Side rail — screen picker */}
      {t.showScreenPicker && (
        <ScreenPicker current={screen} onPick={navigate} />
      )}

      {/* The phone */}
      <PhoneFrame label={SCREENS.find((s) => s.id === screen)?.label}>
        <Router screen={screen} ctx={ctx} onNav={navigate} tweaks={t} />
      </PhoneFrame>

      {/* Brand corner */}
      <BrandCorner />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme}
          options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]}
          onChange={(v) => setTweak('theme', v)} />
        <TweakSection label="Typography" />
        <TweakRadio label="中文字体" value={t.cnFont}
          options={[
            { value: 'hei', label: '黑体' },
            { value: 'serif', label: '宋体' },
            { value: 'inter', label: '楷体' },
          ]}
          onChange={(v) => setTweak('cnFont', v)} />
        <TweakSection label="Navigation" />
        <TweakToggle label="显示侧边屏幕索引"
          value={t.showScreenPicker}
          onChange={(v) => setTweak('showScreenPicker', v)} />
        <TweakSection label="Jump" />
        {SCREENS.map((s) => (
          <TweakButton key={s.id} label={`${s.label} · ${s.en}`}
            secondary={screen !== s.id}
            onClick={() => navigate(s.id)} />
        ))}
      </TweaksPanel>
    </div>
  );
}

function Router({ screen, ctx, onNav, tweaks }) {
  switch (screen) {
    case 'character-create':
      return <CharacterCreation onNav={onNav} tweaks={tweaks} />;
    case 'character-360':
      return <Character360 onNav={onNav} />;
    case 'feed':
      return <Feed onNav={onNav} tweaks={tweaks} />;
    case 'profile':
      return <Profile onNav={onNav} charId={ctx.charId} />;
    case 'footprint':
      return <Footprint onNav={onNav} charId={ctx.charId} />;
    case 'chat':
      return <Chat onNav={onNav} charId={ctx.charId} />;
    case 'video':
      return <VideoPlayer onNav={onNav} postId={ctx.postId} />;
    case 'collection':
      return <CollectionScreen onNav={onNav} />;
    case 'guitar-report':
      return <GuitarReport onNav={onNav} />;
    default:
      return <CharacterCreation onNav={onNav} />;
  }
}

function ScreenPicker({ current, onPick }) {
  return (
    <div style={{
      position: 'fixed',
      left: 24, top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 4,
      padding: 10,
      background: 'rgba(15, 13, 25, 0.7)',
      border: '0.5px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(20px)',
      zIndex: 100,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        letterSpacing: 0.2, textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        padding: '4px 10px 8px',
      }}>SCREENS</div>
      {SCREENS.map((s) => {
        const active = current === s.id;
        return (
          <button key={s.id} onClick={() => onPick(s.id)}
            className="cn"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 12px',
              background: active ? 'rgba(164,139,255,0.18)' : 'transparent',
              border: 0, borderRadius: 9,
              color: active ? '#c4b3ff' : 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-en)',
              fontSize: 12, fontWeight: 500,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              opacity: 0.6, width: 18,
            }}>{s.label.slice(0, 2)}</span>
            <span className="cn" style={{ fontSize: 12.5 }}>{s.label.slice(3)}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9.5, opacity: 0.4 }}>{s.en}</span>
          </button>
        );
      })}
    </div>
  );
}

function BrandCorner() {
  return (
    <div style={{
      position: 'fixed', right: 24, top: 24,
      display: 'flex', alignItems: 'center', gap: 10,
      color: 'rgba(255,255,255,0.55)',
      zIndex: 100,
    }}>
      <div style={{
        width: 24, height: 24,
        background: 'radial-gradient(circle at 30% 25%, #c4b3ff, #6a47d8 70%)',
        borderRadius: 6,
        boxShadow: '0 0 16px rgba(164,139,255,0.4)',
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontFamily: 'var(--font-en)', fontSize: 14, fontWeight: 600, letterSpacing: 0.04, color: '#fff' }}>MIRAGE</span>
        <span className="cn" style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>幻伴 · AI 视频流</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
