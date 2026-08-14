import React from 'react';

export function IconButton({ variant = 'add', badge, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    add:{ width:38, height:38, background: hover ? 'var(--action-accent)' : 'var(--ink)', color:'var(--cream)', border:'none', fontSize:18 },
    outline:{ width:42, height:42, background:'var(--paper)', color:'var(--ink)', border:'1.5px solid var(--line)', fontSize:16 }
  };
  return (
    <button
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position:'relative', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', fontFamily:'var(--font-body)', transition:'background var(--dur-fast) var(--ease)',
        ...variants[variant], ...style }}
      {...rest}
    >
      {children}
      {badge != null && (
        <span style={{ position:'absolute', top:-5, right:-5, background:'var(--berry)', color:'#fff',
          fontSize:'10.5px', fontWeight:700, width:18, height:18, borderRadius:'50%',
          display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-mono)' }}>{badge}</span>
      )}
    </button>
  );
}
