// canvas.jsx — All 7 MIRAGE screens laid out side-by-side for review

function CanvasApp() {
  // Force dark theme for the canvas (preview screens all dark by default)
  React.useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.dataset.cn = 'hei';
  }, []);

  const W = 390, H = 844;

  return (
    <DesignCanvas>
      {/* ────────── Onboarding flow ────────── */}
      <DCSection id="onboarding" title="01 · Onboarding" subtitle="角色创建 → 360° 环绕展示">
        <DCArtboard id="create" label="① Character Creation · 创建" width={W} height={H}>
          <PhoneInArtboard>
            <CharacterCreation onNav={() => {}} />
          </PhoneInArtboard>
        </DCArtboard>
        <DCArtboard id="360" label="② Character 360° · 环绕展示" width={W} height={H}>
          <PhoneInArtboard>
            <Character360 onNav={() => {}} />
          </PhoneInArtboard>
        </DCArtboard>
      </DCSection>

      {/* ────────── Main app ────────── */}
      <DCSection id="main" title="02 · Main App" subtitle="卡片流 / 主页 / 视频播放">
        <DCArtboard id="feed" label="③ Feed · 卡片流首页" width={W} height={H}>
          <PhoneInArtboard>
            <Feed onNav={() => {}} />
          </PhoneInArtboard>
        </DCArtboard>
        <DCArtboard id="profile" label="④ Profile · 角色主页" width={W} height={H}>
          <PhoneInArtboard>
            <Profile onNav={() => {}} charId="ai-01" />
          </PhoneInArtboard>
        </DCArtboard>
        <DCArtboard id="video" label="⑦ Video Player · 全屏视频" width={W} height={H}>
          <PhoneInArtboard>
            <VideoPlayer onNav={() => {}} postId="p1" />
          </PhoneInArtboard>
        </DCArtboard>
      </DCSection>

      {/* ────────── Companion ────────── */}
      <DCSection id="companion" title="03 · Companion" subtitle="足迹地图 / Chat 对话">
        <DCArtboard id="footprint" label="⑤ Footprint · 足迹地图" width={W} height={H}>
          <PhoneInArtboard>
            <Footprint onNav={() => {}} charId="ai-01" />
          </PhoneInArtboard>
        </DCArtboard>
        <DCArtboard id="chat" label="⑥ Chat · 对话" width={W} height={H}>
          <PhoneInArtboard>
            <Chat onNav={() => {}} charId="ai-01" />
          </PhoneInArtboard>
        </DCArtboard>
      </DCSection>

      {/* ────────── System notes ────────── */}
      <DCSection id="system" title="04 · System" subtitle="设计语言 · 色彩 · 字体">
        <DCArtboard id="palette" label="Palette" width={W} height={H}>
          <PaletteSheet />
        </DCArtboard>
        <DCArtboard id="type" label="Typography" width={W} height={H}>
          <TypeSheet />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

// Wrapper that embeds a screen inside a phone bezel inside an artboard.
// We use the existing PhoneFrame but constrain its width/height by the artboard.
function PhoneInArtboard({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#000',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Embedded phone screen — no bezel since the artboard IS the bezel */}
      <div style={{
        width: '100%', height: '100%',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── System sheets ──────────────────────────────────────────
function PaletteSheet() {
  const swatches = [
    { name: 'accent', hex: '#a48bff', cn: '幻紫' },
    { name: 'pink', hex: '#ff6a88', cn: '心跳' },
    { name: 'green', hex: '#b9ff66', cn: '直播绿' },
    { name: 'gold', hex: '#ffd062', cn: '日落金' },
    { name: 'bg', hex: '#0a0a0c', cn: '深夜' },
    { name: 'surface', hex: '#16161a', cn: '卡片' },
    { name: 'ink', hex: '#ffffff', cn: '主文' },
    { name: 'ink-3', hex: '#7e7e83', cn: '次文' },
  ];
  return (
    <div style={{
      background: 'var(--bg)', color: '#fff',
      width: '100%', height: '100%',
      padding: '60px 28px 30px',
      fontFamily: 'var(--font-en)',
      overflowY: 'auto',
    }}>
      <div className="section-label">design system</div>
      <h2 className="display-cn" style={{ fontSize: 28, margin: '8px 0 24px', fontWeight: 600 }}>
        色彩 · Palette
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {swatches.map((s) => (
          <div key={s.name} style={{
            padding: 14, borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ width: '100%', height: 56, borderRadius: 8, background: s.hex, marginBottom: 10, border: '1px solid rgba(255,255,255,0.08)' }} />
            <div className="cn" style={{ fontSize: 13, fontWeight: 600 }}>{s.cn}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {s.hex.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.1 }}>
              --{s.name}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28 }} className="section-label">video gradients</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
        {['g-violet', 'g-coral', 'g-mint', 'g-cobalt', 'g-amber', 'g-rose', 'g-pine', 'g-night'].map((g) => (
          <div key={g}>
            <div className={`ai-video ${g}`} style={{ aspectRatio: '1/1', borderRadius: 10 }} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'center' }}>
              {g.replace('g-', '')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeSheet() {
  return (
    <div style={{
      background: 'var(--bg)', color: '#fff',
      width: '100%', height: '100%',
      padding: '60px 28px 30px',
      overflowY: 'auto',
    }}>
      <div className="section-label">design system</div>
      <h2 className="display-cn" style={{ fontSize: 28, margin: '8px 0 24px', fontWeight: 600 }}>
        字体 · Typography
      </h2>

      <Spec en="Space Grotesk" cn="英文 UI" w={500}>The quiet sky in Kyoto</Spec>
      <Spec en="Noto Serif SC" cn="中文展示" font="var(--font-display-cn)" w={600}>捏一个你的灵魂伴侣</Spec>
      <Spec en="Noto Sans SC" cn="中文 UI" font="var(--font-cn)" w={500}>今天的晚霞像 oil paint</Spec>
      <Spec en="JetBrains Mono" cn="数据 · 标签" font="var(--font-mono)" w={500}>0:42 · KYOTO · 12.4K</Spec>

      <div style={{ marginTop: 28 }} className="section-label">scale</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 10 }}>
        {[
          { px: 32, label: 'display' },
          { px: 22, label: 'h1' },
          { px: 17, label: 'h2' },
          { px: 14, label: 'body' },
          { px: 12, label: 'caption' },
          { px: 10, label: 'mono · spec' },
        ].map((s) => (
          <div key={s.px} style={{
            display: 'flex', alignItems: 'baseline', gap: 12,
            padding: '8px 0',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 50 }}>
              {s.px}px
            </span>
            <span style={{ fontSize: s.px, lineHeight: 1.1 }}>Aa 你好</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(255,255,255,0.4)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Spec({ en, cn, font, w = 400, children }) {
  return (
    <div style={{
      padding: '12px 0',
      borderBottom: '0.5px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.15, textTransform: 'uppercase' }}>{en}</span>
        <span className="cn" style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{cn}</span>
      </div>
      <div style={{ fontFamily: font, fontWeight: w, fontSize: 22, marginTop: 6, color: '#fff' }}>{children}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CanvasApp />);
