const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';
const { wrap } = window; const { ITEMS, CATEGORIES, OFFERS, LOCATIONS } = window;


function Hero({ onRoute }) {
  return (
    <section style={{ ...wrap, padding:'64px var(--gutter) 40px', display:'grid',
      gridTemplateColumns:'1.05fr 0.95fr', gap:'40px', alignItems:'center' }}>
      <div>
        <Eyebrow>Dubai · since 2019</Eyebrow>
        <h1 style={{ fontFamily:'var(--font-display)', fontWeight:600, letterSpacing:'var(--display-tracking)',
          fontSize:'var(--text-hero)', lineHeight:'var(--display-leading)', margin:'18px 0 20px' }}>
          Cake, <em style={{ fontStyle:'italic', color:'var(--berry)', fontWeight:500 }}>made properly</em>.
        </h1>
        <p style={{ fontSize:'17px', color:'var(--ink-soft)', maxWidth:440, lineHeight:'var(--body-leading)', marginBottom:'28px' }}>
          Custom cakes, cupcakes and celebration bakes — ordered online, baked the morning you collect.
        </p>
        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'34px' }}>
          <Button onClick={() => onRoute('menu')}>Order online →</Button>
          <Button variant="ghost" onClick={() => onRoute('track')}>Track an order</Button>
        </div>
        <div style={{ display:'flex', gap:'28px', flexWrap:'wrap' }}>
          <Stat value="12,400+" label="Cakes baked" />
          <Stat value="4.9 ★" label="Google rating" />
          <Stat value="48h" label="Pre-order notice" />
        </div>
      </div>
      <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
        <img src="../../assets/layer-cake.svg" alt="" style={{ width:'100%', maxWidth:420 }} />
        {[[ '8%','12%','var(--berry)',18 ],[ '70%','6%','var(--honey)',12 ],[ '24%','86%','var(--pistachio)',14 ]].map(([t,l,c,s],i) => (
          <span key={i} style={{ position:'absolute', top:t, left:l, width:s, height:s, borderRadius:'50%',
            background:c, opacity:.8, animation:'float var(--float-dur) ease-in-out infinite', animationDelay:(i*0.8)+'s' }} />
        ))}
      </div>
    </section>
  );
}

function HomeScreen({ onRoute, onAdd }) {
  const [stage, setStage] = React.useState(1);
  return (
    <main>
      <Hero onRoute={onRoute} />

      <section style={{ ...wrap, padding:'var(--section-y) var(--gutter)' }}>
        <SectionHead eyebrow="This week" title="Offers on now"
          action={<Button variant="ghost" size="sm">All offers</Button>} />
        <div style={{ display:'flex', gap:'16px', overflowX:'auto', paddingBottom:'8px' }}>
          {OFFERS.map(o => <OfferCard key={o.code} {...o} style={{ flex:'none', width:280 }} />)}
        </div>
      </section>

      <section style={{ ...wrap, padding:'0 var(--gutter) var(--section-y)' }}>
        <SectionHead eyebrow="Menu" title="Pick your bake"
          description="Everything is baked the morning you collect it. Celebration sizes need 48 hours."
          action={<Button variant="ghost" size="sm" onClick={() => onRoute('menu')}>See the full menu</Button>} />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'var(--grid-gap)' }}>
          {ITEMS.slice(0,3).map(i => <ItemCard key={i.id} {...i} image="../../assets/cake-icon.svg" onAdd={() => onAdd(i)} />)}
        </div>
      </section>

      <section style={{ ...wrap, padding:'0 var(--gutter) var(--section-y)' }}>
        <div style={{ background:'var(--surface-inverse)', color:'var(--cream)', borderRadius:'var(--radius-inverse)', padding:'56px 40px' }}>
          <SectionHead tone="dark" eyebrow="Order tracking" title="Watch your cake get built"
            description="Every order shows exactly where it is — placed, in the oven, being decorated, ready to collect." />
          <OrderTracker current={stage} orderId="ORDER #LY-4471" eta="READY ~16:40"
            footer={<Button variant="inverse" style={{ marginTop:18 }} onClick={() => setStage((stage + 1) % 4)}>Simulate next stage</Button>} />
        </div>
      </section>

      <section style={{ ...wrap, padding:'0 var(--gutter) var(--section-y)', display:'grid',
        gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'center' }}>
        <div style={{ background:'var(--ink)', borderRadius:'var(--radius-phone)', padding:'14px',
          maxWidth:260, margin:'0 auto', boxShadow:'var(--shadow)' }}>
          <div style={{ background:'var(--paper)', borderRadius:'24px', overflow:'hidden', padding:'16px' }}>
            <div style={{ background:'var(--cream)', borderRadius:'12px', padding:'14px', display:'flex',
              gap:'10px', alignItems:'center', marginBottom:'12px' }}>
              <img src={ICON + 'qr-code.svg'} width="38" height="38" alt="" style={{ flex:'none' }} />
              <div>
                <b style={{ fontSize:'13px' }}>Scan in store</b>
                <div style={{ fontSize:'11.5px', color:'var(--ink-soft)' }}>Collect points on the counter</div>
              </div>
            </div>
            {[['Pistachio cake','AED 145'],['Cupcake box of six','AED 72']].map(([n,p]) => (
              <div key={n} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                borderTop:'1px dashed var(--line)', padding:'10px 0', fontSize:'12.5px' }}>
                <span>{n}</span><span style={{ fontFamily:'var(--font-mono)', fontWeight:700 }}>{p}</span>
              </div>
            ))}
            <Button size="sm" style={{ width:'100%', justifyContent:'center', marginTop:10 }}>Checkout</Button>
          </div>
        </div>
        <div>
          <SectionHead eyebrow="In store" title="Same account, either counter"
            description="Order ahead on your phone, or scan at the till — points, past orders and saved cakes follow you." />
          <ul style={{ display:'flex', flexDirection:'column', gap:'14px', padding:0, margin:0 }}>
            {[['Skip the queue','Pick a 15-minute collection slot.'],
              ['Reorder in two taps','Your last five bakes stay saved.'],
              ['Points either way','Scan in store or check out online.']].map(([b,s]) => (
              <li key={b} style={{ display:'flex', gap:'12px', alignItems:'flex-start', listStyle:'none', fontSize:'14.5px' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--berry)', marginTop:6, flex:'none' }} />
                <span><b style={{ display:'block' }}>{b}</b><span style={{ color:'var(--ink-soft)', fontSize:'13px' }}>{s}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ ...wrap, padding:'0 var(--gutter) var(--section-y)' }}>
        <SectionHead eyebrow="Locations" title="Where to find us" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
          {LOCATIONS.map(l => <LocationCard key={l.name} {...l} />)}
        </div>
      </section>
    </main>
  );
}

window.HomeScreen = HomeScreen;
