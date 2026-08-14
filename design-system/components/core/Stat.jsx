import React from 'react';

export function Stat({ value, label, tone = 'light', style, ...rest }) {
  return (
    <div style={{ fontFamily:'var(--font-mono)', ...style }} {...rest}>
      <b style={{ display:'block', fontSize:'20px', color: tone === 'dark' ? '#fff' : 'var(--ink)' }}>{value}</b>
      <span style={{ fontSize:'11.5px', color: tone === 'dark' ? 'var(--on-ink-muted)' : 'var(--ink-soft)',
        textTransform:'uppercase', letterSpacing:'var(--chip-tracking)' }}>{label}</span>
    </div>
  );
}
