const { Button, Eyebrow, Stat, SectionHead, Tab, Chip, IconButton, ItemCard, OfferCard, LocationCard, OrderTracker } = window.CakeLakeDesignSystem_0e660f;
const ICON = 'https://unpkg.com/lucide-static@0.436.0/icons/';

function App(){
  const [route, setRoute] = React.useState('home');
  const [cart, setCart] = React.useState(0);
  const add = () => setCart(c => c + 1);
  React.useEffect(() => { window.scrollTo(0,0); }, [route]);
  const screens = {
    home:<window.HomeScreen onRoute={setRoute} onAdd={add} />,
    menu:<window.MenuScreen onAdd={add} />,
    track:<window.TrackOrderScreen />,
    locations:<window.LocationsScreen />
  };
  return (<React.Fragment>
    <window.SiteHeader route={route} onRoute={setRoute} cartCount={cart} />
    {screens[route]}
    <window.SiteFooter />
  </React.Fragment>);
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
