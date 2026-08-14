const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const { wrap } = window; const { ITEMS, CATEGORIES, OFFERS, LOCATIONS } = window;

function MenuScreen({ onAdd }) {
  const [cat, setCat] = React.useState('All bakes');
  const shown = cat === 'All bakes' ? ITEMS : ITEMS.filter(i => i.cat === cat);
  return (
    <main style={{ ...wrap, padding:'56px var(--gutter) var(--section-y)' }}>
      <Eyebrow>Menu</Eyebrow>
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'var(--display-tracking)',
        fontSize:'var(--text-page-title)', margin:'16px 0 14px' }}>Everything we bake</h1>
      <p style={{ color:'var(--ink-soft)', fontSize:'16px', maxWidth:'var(--measure)', lineHeight:'var(--body-leading)', marginBottom:32 }}>
        Celebration sizes need 48 hours' notice. Everything else is baked the morning you collect.
      </p>
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'32px' }}>
        {CATEGORIES.map(c => <Tab key={c} active={c === cat} onClick={() => setCat(c)}>{c}</Tab>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--grid-gap)' }}>
        {shown.map(i => <ItemCard key={i.id} {...i} image="../../assets/cake-icon.svg" onAdd={() => onAdd(i)} />)}
      </div>
    </main>
  );
}

window.MenuScreen = MenuScreen;
