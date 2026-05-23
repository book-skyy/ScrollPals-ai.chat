// Character360.jsx — 360° character preview with drag-to-rotate
// Shows the cat model sheet's four views (front / 3-4 / side / back)
// based on the current angle. No auto-rotate.

function Character360({ onNav }) {
  const [angle, setAngle] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const startRef = React.useRef(null);
  const stageRef = React.useRef(null);

  // Drag to rotate (pointer events — works for mouse + touch)
  const onPointerDown = (e) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (stage && stage.setPointerCapture) {
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
    startRef.current = { x: e.clientX, ang: angle, id: e.pointerId };
    setDragging(true);
  };
  const onPointerMove = (e) => {
    const s = startRef.current;
    if (!s || s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    let next = (s.ang + dx * 0.6) % 360;
    if (next < 0) next += 360;
    setAngle(next);
  };
  const onPointerUp = (e) => {
    const s = startRef.current;
    if (s && s.id === e.pointerId) startRef.current = null;
    const stage = stageRef.current;
    if (stage && stage.releasePointerCapture) {
      try { stage.releasePointerCapture(e.pointerId); } catch (_) {}
    }
    setDragging(false);
  };

  return (
    <div className="screen" data-screen-label="02 Character 360"
      style={{ overflow: 'hidden', background: 'radial-gradient(circle at 50% 30%, #1a1230 0%, var(--bg) 70%)' }}>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '60px 22px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => onNav('character-create')}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>{Icon.back()}</button>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: 0.2, textTransform: 'uppercase',
          color: 'var(--ink-3)',
        }}>step 02 / 02 — observe</div>
        <button style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--line)',
          color: 'var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>{Icon.more()}</button>
      </div>

      {/* Title */}
      <div style={{ paddingTop: 110, textAlign: 'center' }}>
        <div className="display-cn" style={{
          fontSize: 26, fontWeight: 600, lineHeight: 1.2,
        }}>
          ta 在 <span style={{ color: 'var(--accent)' }}>装配中</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-4)', marginTop: 6, letterSpacing: 0.18 }}>
          DRAG TO ROTATE · 360°
        </div>
      </div>

      {/* 3D Stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: '100%', height: 420,
          marginTop: 16,
          perspective: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          touchAction: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
          position: 'relative',
          userSelect: 'none',
        }}>
        {/* Floor disc */}
        <div style={{
          position: 'absolute', left: '50%', bottom: 60,
          transform: 'translateX(-50%) rotateX(70deg)',
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(164,139,255,0.30) 0%, transparent 65%)',
          filter: 'blur(2px)',
          pointerEvents: 'none',
        }} />

        {/* Concentric rings */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: 'absolute', left: '50%', bottom: 60 - i * 4,
            transform: `translateX(-50%) rotateX(70deg) rotate(${angle * (1 + i * 0.3)}deg)`,
            width: 200 + i * 50, height: 200 + i * 50, borderRadius: '50%',
            border: '0.5px dashed rgba(164,139,255,0.25)',
            opacity: 1 - i * 0.25,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Cat figure — chooses the closest view to the current angle */}
        <CatRotator angle={angle} />

        {/* Spec tag overlays — orbiting */}
        {[
          { label: '毛绒身', a: 0 },
          { label: '小肉垫', a: 120 },
          { label: '钝感力 max', a: 240 },
        ].map((s, i) => {
          const rad = (angle + s.a) * Math.PI / 180;
          const visible = Math.cos(rad) > -0.4;
          const x = Math.sin(rad) * 140;
          return (
            <div key={i} className="cn" style={{
              position: 'absolute',
              top: 50 + i * 110,
              left: `calc(50% + ${x}px)`,
              transform: 'translate(-50%, 0)',
              padding: '4px 10px',
              borderRadius: 99,
              background: 'rgba(164,139,255,0.15)',
              border: '1px solid var(--accent-line)',
              color: 'var(--accent-2)',
              fontSize: 11,
              fontWeight: 500,
              backdropFilter: 'blur(8px)',
              opacity: visible ? 0.9 : 0.2,
              transition: 'opacity 0.3s',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>{s.label}</div>
          );
        })}
      </div>

      {/* Angle readout — just the angle, no AUTO ROTATE label */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: -4 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 99,
          background: 'rgba(164,139,255,0.10)',
          border: '1px solid var(--accent-line)',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--accent-2)',
          letterSpacing: 0.15,
        }}>
          {Math.round(angle).toString().padStart(3, '0')}°
          <span style={{ color: 'var(--ink-4)' }}>·</span>
          <span>{viewLabel(angle)}</span>
        </div>
      </div>

      {/* Specs strip */}
      <div style={{
        margin: '24px 22px 0',
        padding: 14, borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--line)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        }}>
          {[
            { k: '形态', v: '银渐层小猫', en: 'form' },
            { k: '声线', v: '软糯短促喵', en: 'voice' },
            { k: '动力', v: '小鱼干 · 阳光', en: 'power' },
          ].map((s) => (
            <div key={s.k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 0.15, color: 'var(--ink-4)', textTransform: 'uppercase' }}>{s.en}</span>
              <span className="cn" style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — single primary button, no rotate toggle */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 22px 28px',
        display: 'flex', gap: 10,
      }}>
        <button className="btn-primary" onClick={() => onNav('feed')}
          style={{ flex: 1 }}>
          <span className="cn">就是 ta 了</span>
          <span style={{ fontFamily: 'var(--font-mono)', opacity: 0.6, fontSize: 11 }}>· FINISH</span>
        </button>
      </div>
    </div>
  );
}

// Map angle (degrees) to the closest of the 4 sheet views.
//   0°   front
//   90°  3/4 (turning right)
//   180° back
//   270° left side
function pickView(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a < 45 || a >= 315) return 'front';
  if (a < 135) return 'three';
  if (a < 225) return 'back';
  return 'side';
}
function viewLabel(angle) {
  return ({
    front: 'FRONT', three: '3/4', back: 'BACK', side: 'SIDE',
  })[pickView(angle)];
}

// CatRotator — shows the sheet view that best matches the current angle.
// Mirrors horizontally when the angle is past 180° on the side view so the
// silhouette still feels like it's spinning continuously.
function CatRotator({ angle }) {
  const view = pickView(angle);
  // Smooth scale "breath" — gentle subtle scale only, no rotation, so the
  // illustration stays upright.
  const stageSize = 280;
  // Flip the side view horizontally when the angle is on the right half
  // (so dragging right shows the cat turning right).
  const flip = view === 'side' && angle > 180 + 90 ? false : view === 'side' ? true : false;
  return (
    <div style={{
      width: stageSize, height: stageSize,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', zIndex: 3,
      pointerEvents: 'none',
      filter: 'drop-shadow(0 18px 28px rgba(0,0,0,0.45))',
    }}>
      <div style={{
        transform: flip ? 'scaleX(-1)' : 'none',
        transition: 'transform 0.25s ease',
      }}>
        <CatSprite view={view} height={stageSize}
          style={{
            transition: 'opacity 0.2s ease',
          }} />
      </div>
      {/* Soft glow behind the cat */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 60%)',
        filter: 'blur(4px)',
      }} />
    </div>
  );
}

Object.assign(window, { Character360 });
