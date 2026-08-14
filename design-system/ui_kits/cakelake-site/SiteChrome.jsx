const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';

const wrap = { maxWidth:'var(--content-max)', margin:'0 auto', padding:'0 var(--gutter)' };

function SiteHeader({ route, onRoute, cartCount }) {
  const links = [['home','Home'],['menu','Menu'],['track','Track order'],['locations','Locations']];
  return (
    <header style={{ position:'sticky', top:0, zIndex:50, background:'var(--scrim-header)',
      backdropFilter:'var(--blur-header)', WebkitBackdropFilter:'var(--blur-header)', borderBottom:'1px solid var(--line)' }}>
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px var(--gutter)', maxWidth:'var(--content-max)', margin:'0 auto' }}>
        <a href="#" onClick={e => { e.preventDefault(); onRoute('home'); }}
          style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, display:'flex',
            alignItems:'center', gap:'9px', color:'var(--ink)', textDecoration:'none' }}>
          <img src="../../assets/logo-mark.svg" width="26" height="26" alt="" />Cake Lake
        </a>
        <div style={{ display:'flex', gap:'34px', fontWeight:500, fontSize:'14.5px' }}>
          {links.map(([id,label]) => (
            <a key={id} href="#" onClick={e => { e.preventDefault(); onRoute(id); }}
              style={{ position:'relative', padding:'4px 0', color:'var(--ink)', textDecoration:'none',
                borderBottom:'2px solid ' + (route === id ? 'var(--berry)' : 'transparent') }}>{label}</a>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <IconButton variant="outline" badge={cartCount || undefined} aria-label="Cart">
            <img src={ICON + 'shopping-bag.svg'} width="18" height="18" alt="" />
          </IconButton>
          <Button size="sm" onClick={() => onRoute('menu')}>Order online</Button>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  const cols = [
    ['Shop', ['Celebration cakes','Cupcakes','Loaves & bakes','Gift boxes']],
    ['Visit', ['Jumeirah 1','Al Quoz','Saadiyat — 2026','Opening hours']],
    ['Company', ['Our bakers','Wholesale','Careers','Contact']]
  ];
  return (
    <footer style={{ borderTop:'1px solid var(--line)', padding:'56px 0 32px', marginTop:'20px' }}>
      <div style={wrap}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:'40px', marginBottom:'44px' }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'24px', fontWeight:700, display:'flex', alignItems:'center', gap:'9px' }}>
              <img src="../../assets/logo-mark.svg" width="26" height="26" alt="" />Cake Lake
            </div>
            <p style={{ color:'var(--ink-soft)', fontSize:'14px', lineHeight:'var(--body-leading)', margin:'14px 0 0', maxWidth:260 }}>
              A small bakery making celebration cakes properly — baked the morning you collect them.
            </p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginTop:'14px' }}>
              {['VISA','MASTERCARD','APPLE PAY','TABBY'].map(p => <Chip key={p} tone="pay">{p}</Chip>)}
            </div>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <h4 style={{ fontSize:'12.5px', textTransform:'uppercase', letterSpacing:'.08em',
                color:'var(--ink-soft)', marginBottom:'14px', fontWeight:600 }}>{h}</h4>
              {items.map(i => <a key={i} href="#" onClick={e=>e.preventDefault()} style={{ display:'block', fontSize:'14px', padding:'6px 0', color:'var(--ink)', textDecoration:'none' }}>{i}</a>)}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:'24px',
          borderTop:'1px solid var(--line)', fontSize:'12.5px', color:'var(--ink-soft)', flexWrap:'wrap', gap:'10px' }}>
          <span>© 2026 Cake Lake Bakery</span><span>Dubai, UAE</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { wrap, SiteHeader, SiteFooter });
