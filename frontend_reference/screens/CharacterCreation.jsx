// CharacterCreation.jsx — Visual character builder
//   Hero preview stage (live updates with chosen preset)
//   Name input → Species type → Preset swap row → Description sections
//   CTA at bottom

const SPECIES_TYPES = [
  { id: 'mecha', cn: '机械', emoji: '⚙️' },
  { id: 'creature', cn: '生灵', emoji: '🐾' },
  { id: 'plant', cn: '植灵', emoji: '🌿' },
  { id: 'spirit', cn: '幻灵', emoji: '👻' },
  { id: 'cosmic', cn: '宇宙', emoji: '🪐' },
];

const APPEARANCE_TAGS = [
  '金属外壳', '苔藓覆盖', '半透明', '会发光', '毛绒', '鳞片',
  '一只眼', '触角', '机械关节', '蒸汽机芯', '罐头身', '玻璃质感',
];
const PERSONALITY_TAGS = [
  '温吞', '高冷', '好奇宝宝', '神秘古老', '笨拙可爱', '健谈',
  '沉默', '警觉', '慵懒', '顽皮', '通灵', '钝感力 max',
];

const DEFAULT_SPECIES = [
  { id: 'd1', cn: '锈罐头', en: 'RustyTin', grad: 'g-amber', species: '复古机器人', emoji: '🤖',
    typeId: 'mecha', appearance: '圆罐头形状，金色锈迹，蒸汽机芯', personality: '温吞、健谈，对一切都好奇' },
  { id: 'd2', cn: '苔藓君', en: 'MossOne', grad: 'g-mint', species: '苔藓人', emoji: '🌿',
    typeId: 'plant', appearance: '通体绿色苔藓覆盖，柔软', personality: '神秘古老，话少但记得每阵风' },
  { id: 'd3', cn: '灯笼鱼', en: 'Lanternfish', grad: 'g-cobalt', species: '深海生物', emoji: '🐠',
    typeId: 'creature', appearance: '半透明发光，头顶一盏小灯', personality: '警觉、慵懒，怕亮' },
  { id: 'd4', cn: '卯卯', en: 'Maumau', grad: 'g-rose', species: '机械兔', emoji: '🐇',
    typeId: 'mecha', appearance: '半兔半机械，银色金属，红 LED 眼', personality: '顽皮、跳得很高、找不到地图' },
];

function CharacterCreation({ onNav }) {
  const [picked, setPicked] = React.useState('d1');
  const preset = DEFAULT_SPECIES.find((d) => d.id === picked) || DEFAULT_SPECIES[0];
  const [name, setName] = React.useState(preset.cn);
  const [species, setSpecies] = React.useState(preset.typeId);
  const [appearance, setAppearance] = React.useState(preset.appearance);
  const [personality, setPersonality] = React.useState(preset.personality);
  const [appTags, setAppTags] = React.useState(new Set(['罐头身', '蒸汽机芯']));
  const [persTags, setPersTags] = React.useState(new Set(['温吞', '好奇宝宝']));

  // When user picks a preset, swap in its defaults
  const pickPreset = (d) => {
    setPicked(d.id);
    setName(d.cn);
    setSpecies(d.typeId);
    setAppearance(d.appearance);
    setPersonality(d.personality);
  };

  const toggleA = (t) => { const s = new Set(appTags); s.has(t) ? s.delete(t) : s.add(t); setAppTags(s); };
  const toggleP = (t) => { const s = new Set(persTags); s.has(t) ? s.delete(t) : s.add(t); setPersTags(s); };

  return (
    <div className="screen" data-screen-label="01 Create"
      style={{ background: 'radial-gradient(circle at 50% 10%, #1a1230 0%, var(--bg) 50%)' }}>

      {/* Header */}
      <div style={{
        padding: '54px 18px 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => onNav('feed')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>{Icon.close({ width: 18, height: 18 })}</button>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: 0.18, textTransform: 'uppercase' }}>
          step 01 / 02
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* Hero preview stage */}
      <div style={{ padding: '8px 0 0', position: 'relative' }}>
        <PreviewStage preset={preset} />
        {/* Title under stage */}
        <div style={{ textAlign: 'center', padding: '4px 22px 0' }}>
          <h1 className="display-cn" style={{
            fontSize: 22, lineHeight: 1.2, margin: 0,
            fontWeight: 600, letterSpacing: '-0.01em',
          }}>
            捏一个 <span style={{ color: 'var(--accent)' }}>不是人</span> 的伙伴
          </h1>
          <p style={{
            fontSize: 11.5, color: 'var(--ink-3)',
            margin: '4px 0 0', lineHeight: 1.4,
            fontFamily: 'var(--font-en)',
          }}>
            <span className="cn">机械 · 生灵 · 苔藓 · 宇宙人都行 </span>· non-human companion
          </p>
        </div>
      </div>

      {/* Name input — labeled, prominent */}
      <div style={{ padding: '20px 22px 0' }}>
        <Label en="name" cn="姓名" />
        <div style={{
          marginTop: 6,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>{preset.emoji}</span>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="给 ta 起个名字…"
            className="cn"
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              padding: '12px 0', fontSize: 15.5, color: 'var(--ink)',
              fontFamily: 'inherit', fontWeight: 500,
            }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--ink-4)',
          }}>{name.length}/12</span>
        </div>
      </div>

      {/* Presets — horizontal scroll row */}
      <div style={{ padding: '14px 0 0' }}>
        <div style={{ padding: '0 22px' }}>
          <Label en="presets" cn="或者从默认开始" />
        </div>
        <div style={{
          display: 'flex', gap: 12, marginTop: 10,
          overflowX: 'auto', padding: '0 22px 4px',
          scrollbarWidth: 'none',
        }}>
          {DEFAULT_SPECIES.map((d) => {
            const active = picked === d.id;
            return (
              <button key={d.id} onClick={() => pickPreset(d)}
                style={{
                  flexShrink: 0, width: 88,
                  background: 'transparent', border: 0, padding: 0,
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                }}>
                <div className={`ai-video ${d.grad}`} style={{
                  width: 72, height: 72, borderRadius: 16,
                  position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 34,
                  boxShadow: active
                    ? '0 0 0 2px var(--accent), 0 0 18px rgba(164,139,255,0.5)'
                    : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                  transition: 'all 0.18s',
                  transform: active ? 'translateY(-3px)' : 'translateY(0)',
                }}>
                  <span style={{ position: 'relative', zIndex: 3 }}>{d.emoji}</span>
                </div>
                <div className="cn" style={{
                  fontSize: 12, fontWeight: active ? 600 : 500,
                  color: active ? 'var(--ink)' : 'var(--ink-2)',
                }}>{d.cn}</div>
                <div className="cn" style={{
                  fontSize: 10, color: 'var(--ink-4)',
                  marginTop: -2, lineHeight: 1.3,
                  textAlign: 'center',
                }}>{d.species}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Appearance + Personality — compact accordion-ish blocks */}
      <div style={{ padding: '20px 22px 4px' }}>
        <DescBlock
          label="外貌描述" en="appearance" icon="✨"
          value={appearance} setValue={setAppearance}
          placeholder="一只半机械的兔子，银色金属，眼睛是 LED…"
          tags={APPEARANCE_TAGS} active={appTags} onToggle={toggleA} />
        <div style={{ height: 12 }} />
        <DescBlock
          label="性格描述" en="personality" icon="💭"
          value={personality} setValue={setPersonality}
          placeholder="温吞、健谈，对一切都好奇…"
          tags={PERSONALITY_TAGS} active={persTags} onToggle={toggleP} />
      </div>

      {/* spacer for sticky cta */}
      <div style={{ height: 110 }} />

      {/* sticky CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 28px',
        background: 'linear-gradient(180deg, transparent, var(--bg) 40%)',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button className="btn-primary" onClick={() => onNav('character-360')}
          style={{ flex: 1 }}>
          <span className="cn">让 ta 醒过来</span>
          <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.6, fontSize: 11 }}>· NEXT</span>
          {Icon.chev({ width: 14, height: 14 })}
        </button>
      </div>
    </div>
  );
}

// ─── Preview stage ──────────────────────────────────────────
function PreviewStage({ preset }) {
  // Gentle bobbing + pulse
  return (
    <div style={{
      height: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Halo rings */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 160 + i * 40, height: 160 + i * 40,
          borderRadius: '50%',
          border: '0.5px dashed rgba(164,139,255,0.25)',
          opacity: 1 - i * 0.3,
          animation: `spin${i} ${20 + i * 8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
        }} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin0 { to { transform: rotate(360deg); } }
        @keyframes spin1 { to { transform: rotate(360deg); } }
        @keyframes spin2 { to { transform: rotate(360deg); } }
        @keyframes bob { 50% { transform: translateY(-6px); } }
      `}} />

      {/* Floor glow */}
      <div style={{
        position: 'absolute',
        bottom: 30, left: '50%', transform: 'translateX(-50%) rotateX(70deg)',
        width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(164,139,255,0.32) 0%, transparent 65%)',
        filter: 'blur(2px)',
      }} />

      {/* Character disc */}
      <div className={`ai-video ${preset.grad}`} style={{
        width: 130, height: 130, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 70,
        boxShadow: '0 0 40px rgba(164,139,255,0.4), inset 0 0 30px rgba(0,0,0,0.3)',
        position: 'relative', zIndex: 3,
        animation: 'bob 4s ease-in-out infinite',
        filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))',
      }}>
        <span style={{ position: 'relative', zIndex: 3, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>
          {preset.emoji}
        </span>
      </div>

      {/* Hint label */}
      <div style={{
        position: 'absolute', bottom: 8, right: 24,
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--accent-2)',
        letterSpacing: 0.18, textTransform: 'uppercase',
        opacity: 0.7,
      }}>· live preview</div>
    </div>
  );
}

function Label({ cn, en }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      <span className="cn" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{cn}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 9.5,
        color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: 0.18,
      }}>{en}</span>
    </div>
  );
}

function DescBlock({ label, en, icon, value, setValue, placeholder, tags, active, onToggle }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--line)',
      borderRadius: 14,
      padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span className="cn" style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-4)',
          letterSpacing: 0.18, textTransform: 'uppercase',
        }}>{en}</span>
      </div>
      <textarea
        value={value} onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="cn"
        style={{
          width: '100%', minHeight: 44, resize: 'none',
          background: 'transparent', border: 0, padding: 0,
          fontFamily: 'inherit', fontSize: 13.5,
          color: 'var(--ink)', outline: 'none',
          lineHeight: 1.5,
        }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
        {tags.map((t) => (
          <div key={t}
            className={`chip cn ${active.has(t) ? 'active' : ''}`}
            onClick={() => onToggle(t)}
            style={{ height: 26, fontSize: 11.5, padding: '0 10px' }}>{t}</div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CharacterCreation });
