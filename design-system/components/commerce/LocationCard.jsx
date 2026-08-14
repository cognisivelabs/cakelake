import React from 'react';
import { StatusPill } from '../core/StatusPill.jsx';

export function LocationCard({ status = 'open', statusLabel, name, address, hours, style, ...rest }) {
  const soon = status === 'soon';
  return (
    <div style={{ borderRadius:'var(--radius)', padding:'28px', fontFamily:'var(--font-body)',
      background: soon ? 'transparent' : 'var(--paper)',
      border: soon ? '1.5px dashed var(--line)' : '1px solid var(--line)',
      display:'flex', flexDirection:'column', alignItems:'flex-start',
      justifyContent: soon ? 'center' : 'flex-start', ...style }} {...rest}>
      <StatusPill status={status} style={{ marginBottom:'14px' }}>{statusLabel || (soon ? 'Opening soon' : 'Open now')}</StatusPill>
      <h3 style={{ fontFamily:'var(--font-display)', fontWeight:'var(--display-weight)', fontSize:'19px', margin:'0 0 8px' }}>{name}</h3>
      {address && <p style={{ fontSize:'14px', color:'var(--ink-soft)', margin:0, lineHeight:'var(--body-leading)' }}>{address}</p>}
      {hours && <p style={{ fontFamily:'var(--font-mono)', fontSize:'12.5px', color:'var(--ink-soft)', margin:'12px 0 0' }}>{hours}</p>}
    </div>
  );
}
