import React from 'react';
import { Chip } from '../core/Chip.jsx';

export function OfferCard({ tag, title, description, code, punchColor = 'var(--cream)', style, ...rest }) {
  return (
    <div style={{ background:'var(--surface-card)', border:'1.5px dashed var(--berry)', borderRadius:'var(--radius-card-alt)',
      padding:'22px', position:'relative', fontFamily:'var(--font-body)', ...style }} {...rest}>
      {['left','right'].map(side => (
        <span key={side} style={{ position:'absolute', width:18, height:18, background:punchColor, borderRadius:'50%',
          top:'50%', transform:'translateY(-50%)', [side]:-9 }} />
      ))}
      {tag && <div style={{ marginBottom:'12px' }}><Chip tone="offer">{tag}</Chip></div>}
      <h3 style={{ fontFamily:'var(--font-display)', fontWeight:'var(--display-weight)', fontSize:'19px', margin:'0 0 6px' }}>{title}</h3>
      {description && <p style={{ fontSize:'13.5px', color:'var(--ink-soft)', margin:'0 0 14px' }}>{description}</p>}
      {code && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
          borderTop:'1px dashed var(--line)', paddingTop:'12px', fontFamily:'var(--font-mono)', fontSize:'12.5px' }}>
          <span>CODE</span><span>{code}</span>
        </div>
      )}
    </div>
  );
}
