const ITEMS = [
  { id:'pistachio', cat:'Celebration cakes', name:'Pistachio celebration cake', description:'Three layers, rose-water buttercream, pistachio crumb.', price:'AED 145', chips:['Bestseller'] },
  { id:'berry', cat:'Celebration cakes', name:'Berry cream layer cake', description:'Raspberry compote between vanilla sponge.', price:'AED 165', chips:['Pre-order 72h'] },
  { id:'choc', cat:'Celebration cakes', name:'Dark chocolate fudge', description:'Seven layers, 70% Valrhona ganache.', price:'AED 180', chips:['Eggless option'] },
  { id:'cup6', cat:'Cupcakes', name:'Cupcake box of six', description:'Mix of vanilla bean, red velvet and salted caramel.', price:'AED 72', chips:['Bestseller'] },
  { id:'cardamom', cat:'Loaves & bakes', name:'Cardamom loaf', description:'Baked each morning, sliced or whole.', price:'AED 48', chips:[] },
  { id:'basque', cat:'Loaves & bakes', name:'Basque cheesecake', description:'Burnt top, soft centre, no crust.', price:'AED 98', chips:['Bestseller'] }
];
const CATEGORIES = ['All bakes','Celebration cakes','Cupcakes','Loaves & bakes'];
const OFFERS = [
  { tag:'Ends Fri', title:'20% off Eid boxes', description:'Any celebration cake, when you order 48h ahead.', code:'EID20' },
  { tag:'This month', title:'Free delivery over AED 200', description:'Dubai only, same-day slots before 14:00.', code:'CAKE200' },
  { tag:'Members', title:'Every 10th bake free', description:'Scan in store or use your account at checkout.', code:'LOYAL' }
];
const LOCATIONS = [
  { name:'Jumeirah 1', address:'Al Wasl Road, next to the beach car park, Dubai', hours:'DAILY 08:00 — 22:00', status:'open' },
  { name:'Al Quoz — the bakery', address:'Alserkal Avenue, Unit 12, Dubai', hours:'TUE — SUN 09:00 — 18:00', status:'open' },
  { name:'Saadiyat', address:'Abu Dhabi', status:'soon', statusLabel:'Opening 2026' },
  { name:'Sharjah', address:'Al Majaz waterfront', status:'soon', statusLabel:'Opening 2026' }
];

Object.assign(window, { ITEMS, CATEGORIES, OFFERS, LOCATIONS });
