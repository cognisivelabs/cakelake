import React from 'react';
import { Eyebrow } from './Eyebrow.jsx';

export function SectionHead({ eyebrow, title, description, action, tone = 'light', style, ...rest }) {
  const dark = tone === 'dark';
  return (
    <div style={{ marginBottom:'28px', ...style }} {...rest}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'20px', flexWrap:'wrap' }}>
        <div>
          {eyebrow && <div style={{ marginBottom:'10px' }}><Eyebrow tone={dark ? 'honey' : 'berry'}>{eyebrow}</Eyebrow></div>}
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:'var(--display-weight)',
            letterSpacing:'var(--display-tracking)', fontSize:'var(--text-h2)', margin:0,
            color: dark ? 'var(--cream)' : 'var(--ink)' }}>{title}</h2>
        </div>
        {action}
      </div>
      {description && (
        <p style={{ fontFamily:'var(--font-body)', color: dark ? 'var(--on-ink)' : 'var(--ink-soft)',
          fontSize:'15px', lineHeight:'var(--body-leading)', maxWidth:'var(--measure)', margin:'14px 0 0' }}>{description}</p>
      )}
    </div>
  );
}
