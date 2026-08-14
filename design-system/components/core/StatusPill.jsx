import React from 'react';

export function StatusPill({ status = 'open', children, style, ...rest }) {
  const open = status === 'open';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-mono)',
      fontSize:'11px', fontWeight:700, padding:'5px 10px', borderRadius:'var(--radius-pill)',
      background: open ? 'var(--status-open-bg)' : 'var(--status-soon-bg)',
      color: open ? 'var(--status-open-fg)' : 'var(--status-soon-fg)',
      border: open ? '1px solid transparent' : '1px solid var(--line)', ...style }} {...rest}>
      {open && <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--pistachio)' }} />}
      {children}
    </span>
  );
}
