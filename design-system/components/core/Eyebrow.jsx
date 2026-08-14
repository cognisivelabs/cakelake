import React from 'react';

export function Eyebrow({ tone = 'berry', children, style, ...rest }) {
  const color = tone === 'honey' ? 'var(--honey)' : 'var(--berry-deep)';
  const dot = tone === 'honey' ? 'var(--honey)' : 'var(--berry)';
  return (
    <span style={{ fontFamily:'var(--font-mono)', fontSize:'var(--text-eyebrow)', letterSpacing:'var(--eyebrow-tracking)',
      textTransform:'uppercase', color, display:'inline-flex', alignItems:'center', gap:'8px', ...style }} {...rest}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:dot, display:'inline-block', flex:'none' }} />
      {children}
    </span>
  );
}
