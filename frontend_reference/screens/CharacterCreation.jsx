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
  const [appearance, setAppearance] = React.useState('');
  const [personality, setPersonality] = React.useState('');

  // When user picks a preset, swap in its defaults (name + species only).
  const pickPreset = (d) => {
    setPicked(d.id);
    setName(d.cn);
    setSpecies(d.typeId);
  };

  return (
    <>
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
            <span style={{ color: 'var(--accent)' }}>描述</span>你的伙伴
          </h1>
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

      {/* Appearance + Personality — free-form textareas only */}
      <div style={{ padding: '20px 22px 4px' }}>
        <DescBlock
          label="外貌描述" en="appearance" icon="✨"
          value={appearance} setValue={setAppearance}
          placeholder="描述 ta 的样子…" />
        <div style={{ height: 12 }} />
        <DescBlock
          label="性格描述" en="personality" icon="💭"
          value={personality} setValue={setPersonality}
          placeholder="描述 ta 的性格…" />
      </div>

      {/* spacer so content above doesn't sit under the bottom CTA */}
      <div style={{ height: 110 }} />
    </div>
    {/* CTA lives outside .screen so it stays pinned to the phone bottom. */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '14px 22px 28px',
      background: 'linear-gradient(180deg, transparent, var(--bg) 40%)',
      display: 'flex', gap: 10, alignItems: 'center',
      zIndex: 50, pointerEvents: 'none',
    }}>
      <button className="btn-primary" onClick={() => onNav('feed')}
        style={{ flex: 1, pointerEvents: 'auto' }}>
        <span className="cn">让 ta 醒过来</span>
        <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.6, fontSize: 11 }}>· NEXT</span>
        {Icon.chev({ width: 14, height: 14 })}
      </button>
    </div>
    </>
  );
}

// ─── Preview stage ──────────────────────────────────────────
// Animated abstract orb — swirling gradient blobs with a soft glow.
// Pure CSS, no images required, looks "alive" without committing to a
// specific character art style.
function PreviewStage() {
  return (
    <div style={{
      height: 220,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 170 + i * 44, height: 170 + i * 44,
          borderRadius: '50%',
          border: '0.5px dashed rgba(164,139,255,0.22)',
          opacity: 1 - i * 0.28,
          animation: `pv-spin${i} ${22 + i * 8}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
        }} />
      ))}

      {/* Floor glow */}
      <div style={{
        position: 'absolute',
        bottom: 30, left: '50%', transform: 'translateX(-50%) rotateX(70deg)',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(164,139,255,0.38) 0%, transparent 65%)',
        filter: 'blur(2px)',
      }} />

      {/* The orb — a circular mask with several animated colored blobs inside */}
      <div className="pv-orb" style={{
        width: 150, height: 150, borderRadius: '50%',
        position: 'relative', overflow: 'hidden', zIndex: 3,
        boxShadow:
          '0 0 50px rgba(164,139,255,0.45),' +
          '0 12px 36px rgba(0,0,0,0.55),' +
          'inset 0 0 24px rgba(255,255,255,0.08)',
        background:
          'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.18) 0%, transparent 40%),' +
          'linear-gradient(135deg, #1f0e3f 0%, #0a0717 100%)',
      }}>
        <span className="pv-blob pv-blob-a" />
        <span className="pv-blob pv-blob-b" />
        <span className="pv-blob pv-blob-c" />
        <span className="pv-highlight" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pv-spin0 { to { transform: rotate(360deg); } }
        @keyframes pv-spin1 { to { transform: rotate(360deg); } }
        @keyframes pv-spin2 { to { transform: rotate(360deg); } }
        @keyframes pv-bob { 50% { transform: translateY(-6px); } }
        .pv-orb { animation: pv-bob 4.4s ease-in-out infinite; }

        .pv-blob {
          position: absolute;
          width: 110px; height: 110px;
          border-radius: 50%;
          filter: blur(18px);
          mix-blend-mode: screen;
          opacity: 0.85;
        }
        .pv-blob-a {
          background: radial-gradient(circle, #a48bff 0%, transparent 70%);
          animation: pv-drift-a 7s ease-in-out infinite;
        }
        .pv-blob-b {
          background: radial-gradient(circle, #ff7ab8 0%, transparent 70%);
          animation: pv-drift-b 9s ease-in-out infinite;
        }
        .pv-blob-c {
          background: radial-gradient(circle, #6cf2ff 0%, transparent 70%);
          animation: pv-drift-c 11s ease-in-out infinite;
        }
        @keyframes pv-drift-a {
          0%, 100% { transform: translate(-20%, -10%); }
          50%      { transform: translate(35%, 30%); }
        }
        @keyframes pv-drift-b {
          0%, 100% { transform: translate(40%, -20%); }
          50%      { transform: translate(-15%, 35%); }
        }
        @keyframes pv-drift-c {
          0%, 100% { transform: translate(10%, 40%); }
          50%      { transform: translate(20%, -20%); }
        }
        .pv-highlight {
          position: absolute;
          top: 12%; left: 18%;
          width: 38%; height: 22%;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, transparent 70%);
          filter: blur(2px);
        }
      `}} />
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

function DescBlock({ label, en, icon, value, setValue, placeholder }) {
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
          width: '100%', minHeight: 64, resize: 'none',
          background: 'transparent', border: 0, padding: 0,
          fontFamily: 'inherit', fontSize: 13.5,
          color: 'var(--ink)', outline: 'none',
          lineHeight: 1.5,
        }} />
    </div>
  );
}

Object.assign(window, { CharacterCreation });
