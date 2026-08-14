const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const { wrap } = window; const { ITEMS, CATEGORIES, OFFERS, LOCATIONS } = window;

function LocationsScreen() {
  return (
    <main style={{ ...wrap, padding:'56px var(--gutter) var(--section-y)' }}>
      <Eyebrow>Locations</Eyebrow>
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'var(--display-tracking)',
        fontSize:'var(--text-page-title)', margin:'16px 0 14px' }}>Two shops, two more coming</h1>
      <p style={{ color:'var(--ink-soft)', fontSize:'16px', maxWidth:'var(--measure)', lineHeight:'var(--body-leading)', marginBottom:32 }}>
        Collection from either counter. The Al Quoz bakery is where the celebration cakes are made.
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
        {LOCATIONS.map(l => <LocationCard key={l.name} {...l} />)}
      </div>
    </main>
  );
}

window.LocationsScreen = LocationsScreen;
