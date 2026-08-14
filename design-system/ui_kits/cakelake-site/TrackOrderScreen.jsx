const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const { wrap } = window; const { ITEMS, CATEGORIES, OFFERS, LOCATIONS } = window;

function TrackOrderScreen() {
  const [stage, setStage] = React.useState(1);
  return (
    <main style={{ ...wrap, padding:'56px var(--gutter) var(--section-y)' }}>
      <Eyebrow>Track an order</Eyebrow>
      <h1 style={{ fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'var(--display-tracking)',
        fontSize:'var(--text-page-title)', margin:'16px 0 24px' }}>Order #LY-4471</h1>
      <div style={{ background:'var(--surface-inverse)', borderRadius:'var(--radius-inverse)', padding:'40px' }}>
        <OrderTracker current={stage} orderId="ORDER #LY-4471" eta="READY ~16:40"
          footer={<Button variant="inverse" style={{ marginTop:18 }} onClick={() => setStage((stage + 1) % 4)}>Simulate next stage</Button>} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginTop:'22px' }}>
        <div style={{ background:'var(--paper)', border:'1px solid var(--line)', borderRadius:'var(--radius)', padding:'28px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'19px', margin:'0 0 14px' }}>In this order</h3>
          {[['Pistachio celebration cake','AED 145'],['Cupcake box of six','AED 72']].map(([n,p]) => (
            <div key={n} style={{ display:'flex', justifyContent:'space-between', borderTop:'1px dashed var(--line)', padding:'12px 0', fontSize:'14px' }}>
              <span>{n}</span><span style={{ fontFamily:'var(--font-mono)', fontWeight:700 }}>{p}</span>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', borderTop:'1.5px solid var(--line)', paddingTop:'12px', marginTop:'4px', fontFamily:'var(--font-mono)', fontWeight:700 }}>
            <span>TOTAL</span><span>AED 217</span>
          </div>
        </div>
        <div style={{ background:'var(--paper)', border:'1px solid var(--line)', borderRadius:'var(--radius)', padding:'28px' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:'19px', margin:'0 0 10px' }}>Collection</h3>
          <p style={{ color:'var(--ink-soft)', fontSize:'14px', lineHeight:'var(--body-leading)', margin:'0 0 14px' }}>
            Jumeirah 1 — Al Wasl Road, next to the beach car park.
          </p>
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
            <Chip>Today 16:30 — 16:45</Chip><Chip>Eggless</Chip><Chip>Gift note added</Chip>
          </div>
        </div>
      </div>
    </main>
  );
}

window.TrackOrderScreen = TrackOrderScreen;
