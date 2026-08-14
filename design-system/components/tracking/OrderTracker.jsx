import React from 'react';

const DEFAULT_STAGES = [
  { title:'Order placed', sub:'Confirmed 09:14' },
  { title:'In the oven', sub:'Baking now' },
  { title:'Decorating', sub:'Buttercream & finishing' },
  { title:'Ready for collection', sub:'We text you' }
];

function Cake({ lit }) {
  const layers = [
    { x:45, y:150, w:130, h:42, fill:'var(--honey)' },
    { x:58, y:105, w:104, h:45, fill:'var(--pistachio)' },
    { x:70, y:62, w:80, h:43, fill:'var(--berry)' }
  ];
  return (
    <svg viewBox="0 0 220 220" fill="none" style={{ width:'100%', maxWidth:220, margin:'0 auto', display:'block' }}>
      <ellipse cx="110" cy="196" rx="80" ry="10" fill="var(--ink-shadow)" />
      {layers.map((l, i) => (
        <rect key={i} x={l.x} y={l.y} width={l.w} height={l.h} rx="10" fill={l.fill}
          opacity={lit > i ? 1 : 0.18}
          style={{ transition:'opacity var(--dur-slow) var(--ease)' }} />
      ))}
      <circle cx="110" cy="50" r="13" fill="var(--candle)" opacity={lit > 3 ? 1 : 0.18}
        style={{ transition:'opacity var(--dur-slow) var(--ease)' }} />
    </svg>
  );
}

export function OrderTracker({ stages = DEFAULT_STAGES, current = 1, orderId, eta, footer, style, ...rest }) {
  return (
    <div style={{ background:'var(--ink-raised)', borderRadius:'var(--radius-inverse-inner)', padding:'32px',
      fontFamily:'var(--font-body)', ...style }} {...rest}>
      {(orderId || eta) && (
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'22px',
          fontFamily:'var(--font-mono)', fontSize:'12.5px', color:'var(--on-ink-muted)',
          borderBottom:'1px dashed var(--ink-line)', paddingBottom:'16px' }}>
          <span>{orderId}</span><span>{eta}</span>
        </div>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px', alignItems:'center' }}>
        <Cake lit={current + 1} />
        <div>
          {stages.map((s, i) => {
            const done = i < current, active = i === current;
            return (
              <div key={s.title} style={{ display:'flex', gap:'16px', padding:'16px 0',
                borderBottom: i === stages.length - 1 ? 'none' : '1px solid var(--ink-line)' }}>
                <span style={{ width:26, height:26, borderRadius:'50%', flex:'none',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--font-mono)', fontSize:'11px',
                  border:'2px solid ' + (done ? 'var(--stage-done)' : active ? 'var(--stage-active)' : 'var(--stage-idle)'),
                  background: done ? 'var(--stage-done)' : active ? 'var(--stage-active)' : 'transparent',
                  color: done ? 'var(--on-pistachio)' : active ? 'var(--on-honey)' : 'var(--stage-idle)' }}>
                  {done ? '✓' : i + 1}
                </span>
                <div>
                  <div style={{ fontWeight:600, fontSize:'15px',
                    color: done || active ? '#fff' : 'var(--on-ink-dim)' }}>{s.title}</div>
                  {s.sub && <div style={{ fontSize:'12.5px', color:'var(--on-ink-muted)', marginTop:2 }}>{s.sub}</div>}
                </div>
              </div>
            );
          })}
          {footer}
        </div>
      </div>
    </div>
  );
}
