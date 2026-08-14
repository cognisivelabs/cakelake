import React from 'react';

export function Chip({ tone = 'neutral', children, style, ...rest }) {
  const tones = {
    neutral:{ background:'var(--cream)', color:'var(--ink-soft)', border:'1px solid var(--line)', fontSize:'var(--text-chip)', padding:'3px 8px' },
    offer:{ background:'var(--pistachio-soft)', color:'var(--pistachio)', border:'1px solid transparent', fontSize:'11px', padding:'4px 10px', fontWeight:700 },
    pay:{ background:'transparent', color:'var(--ink-soft)', border:'1px solid var(--line)', fontSize:'11px', padding:'6px 10px', borderRadius:'8px' }
  };
  return (
    <span style={{ fontFamily:'var(--font-mono)', borderRadius:'var(--radius-pill)', display:'inline-block',
      whiteSpace:'nowrap', ...tones[tone], ...style }} {...rest}>{children}</span>
  );
}
