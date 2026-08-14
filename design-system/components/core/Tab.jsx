import React from 'react';

export function Tab({ active = false, children, style, ...rest }) {
  return (
    <button style={{ padding:'10px 18px', borderRadius:'var(--radius-pill)',
      border:'1.5px solid ' + (active ? 'var(--ink)' : 'var(--line)'),
      background: active ? 'var(--ink)' : 'var(--paper)',
      color: active ? 'var(--cream)' : 'var(--ink-soft)',
      fontFamily:'var(--font-body)', fontWeight:600, fontSize:'13.5px', cursor:'pointer',
      transition:'all var(--dur-fast) var(--ease)', ...style }} {...rest}>{children}</button>
  );
}
