import React from 'react';
import { Chip } from '../core/Chip.jsx';
import { IconButton } from '../core/IconButton.jsx';

export function ItemCard({ name, description, price, chips = [], image, onAdd, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background:'var(--surface-card)', borderRadius:'var(--radius)', padding:'22px',
        border:'1px solid var(--line)', display:'flex', flexDirection:'column', gap:'14px',
        transition:'var(--transition-card)', transform: hover ? 'translateY(var(--lift-y))' : 'none',
        boxShadow: hover ? 'var(--shadow)' : 'none', fontFamily:'var(--font-body)', ...style }} {...rest}>
      <div style={{ background:'var(--surface-media)', borderRadius:'var(--radius-media)', height:150,
        display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {typeof image === 'string' ? <img src={image} alt="" style={{ width:88, height:88, display:'block' }} /> : image}
      </div>
      {chips.length > 0 && (
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>{chips.map(c => <Chip key={c}>{c}</Chip>)}</div>
      )}
      <h3 style={{ fontFamily:'var(--font-display)', fontWeight:'var(--display-weight)', letterSpacing:'var(--display-tracking)', fontSize:'18px', margin:0 }}>{name}</h3>
      {description && <p style={{ fontSize:'13px', color:'var(--ink-soft)', margin:0, lineHeight:1.5 }}>{description}</p>}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto',
        paddingTop:'8px', borderTop:'1px dashed var(--line)' }}>
        <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, fontSize:'16px' }}>{price}</span>
        <IconButton variant="add" onClick={onAdd} aria-label={'Add ' + name}>+</IconButton>
      </div>
    </div>
  );
}
