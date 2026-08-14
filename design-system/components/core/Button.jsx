import React from 'react';

const base = {
  display:'inline-flex', alignItems:'center', gap:'8px',
  borderRadius:'var(--radius-pill)', fontFamily:'var(--font-body)', fontWeight:600,
  border:'1.5px solid transparent', cursor:'pointer',
  transition:'var(--transition-btn)', textDecoration:'none', whiteSpace:'nowrap'
};
const sizes = {
  md:{ padding:'14px 26px', fontSize:'15px' },
  sm:{ padding:'9px 16px', fontSize:'13px' }
};

export function Button({ variant = 'primary', size = 'md', disabled = false, href, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    primary:{
      background: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)',
      color:'var(--action-primary-text)', boxShadow:'var(--shadow-primary)'
    },
    ghost:{
      background: hover ? 'var(--ink)' : 'transparent',
      borderColor:'var(--ink)',
      color: hover ? 'var(--cream)' : 'var(--ink)'
    },
    inverse:{
      background:'transparent',
      borderColor: hover ? 'var(--honey)' : 'var(--ink-line-soft)',
      color: hover ? 'var(--honey)' : 'var(--on-ink)',
      padding:'9px 16px', fontSize:'12.5px'
    }
  };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      disabled={!href ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : 'auto', ...style }}
      {...rest}
    >{children}</Tag>
  );
}
