import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import logo from '../../assets/LOGO.jpg'
import menuImg from '../../assets/MENU.jpg'
import './PublicSite.css'

const CATEGORIES = ["Classic","Latte","Antukin","Milky","Mixed","Tea","Fizzy","Xtra","Rice Meals","Pasta","Appetizers","Waffles"]
const CAT_COLORS = {
  "Classic": "#c9773a", "Latte": "#5a7a52", "Antukin": "#a0522d",
  "Milky": "#7a5c8a", "Mixed": "#3a6b8a", "Tea": "#6b8a3a",
  "Fizzy": "#c95a6b", "Xtra": "#8a6b3a", "Rice Meals": "#3a5a8a",
  "Pasta": "#8a3a5a", "Appetizers": "#5a8a6b", "Waffles": "#8a7a3a"
}

const DEMO_MENU = [
  { _id: '1', name: 'Long Black', description: 'Water + two shot espresso', hotPrice: 95, icedPrice: 105, category: 'Classic', photo: null },
  { _id: '2', name: 'Latte', description: 'Two shot espresso + milk + thin layer foam', hotPrice: 120, icedPrice: 125, category: 'Classic', photo: null },
  { _id: '3', name: 'Cappuccino', description: 'Two shot espresso + milk + Foamy milk', hotPrice: 115, icedPrice: 120, category: 'Classic', photo: null },
  { _id: '4', name: "Togo's Cup", description: 'Sweet wild honey milk topped with espresso', icedPrice: 170, category: 'Antukin', photo: null },
  { _id: '5', name: "YJ's Cup", description: "Reese's chocolate inspired coffee", icedPrice: 170, category: 'Antukin', photo: null },
  { _id: '6', name: "Mason's Cup", description: 'Cinnamon explosion topped with espresso', icedPrice: 170, category: 'Antukin', photo: null },
  { _id: '7', name: 'Mocha', description: 'Chocolate sauce + Double shot', hotPrice: 135, icedPrice: 150, category: 'Latte', photo: null },
  { _id: '8', name: 'Salted Caramel', description: 'Salted caramel sauce + Double Shot', hotPrice: 135, icedPrice: 150, category: 'Latte', photo: null },
  { _id: '9', name: 'White Chocolate', description: 'White Chocolate sauce + Double Shot', hotPrice: 135, icedPrice: 150, category: 'Latte', photo: null },
  { _id: '10', name: 'Milk Chocolate', description: 'Mocha + Cocoa + Milk + Whipping', hotPrice: 100, icedPrice: 120, category: 'Milky', photo: null },
  { _id: '11', name: 'Berry Milk', description: 'Strawberry Jam + Milk + pink sauce + whipping', icedPrice: 120, category: 'Milky', photo: null },
  { _id: '12', name: 'Matcha', description: 'Ceremonial Matcha + Oat milk + condensed milk', hotPrice: 135, icedPrice: 145, category: 'Mixed', photo: null },
  { _id: '13', name: 'Chai Tea', description: 'Authentic chai tea leaves + water + sugar', hotPrice: 90, icedPrice: 100, category: 'Mixed', photo: null },
  { _id: '14', name: 'Butterfly Peaches', description: 'Butterfly Pea tea + Lemon soda + peach jam', price: 120, category: 'Tea', photo: null },
  { _id: '15', name: 'Citron Hibiscus', description: 'Hibiscus tea + lemon soda + sweetener + citron jam', price: 120, category: 'Tea', photo: null },
  { _id: '16', name: 'Soda Yakult', description: 'Green apple, Peach, Blueberry, Strawberry, Lychee', price: 120, category: 'Fizzy', photo: null },
  { _id: '17', name: 'Espresso', price: 70, category: 'Xtra', photo: null },
  { _id: '18', name: 'Syrup', price: 40, category: 'Xtra', photo: null },
  { _id: '19', name: 'Chicken Ala-King', description: 'Chicken breast fillet drenched in a creamy ala king sauce', price: 175, category: 'Rice Meals', photo: null },
  { _id: '20', name: 'Sweet Braised Pork', description: 'Sweet cubed cut pork topped with sesame seeds', price: 180, category: 'Rice Meals', photo: null },
  { _id: '21', name: 'Spaghetti', description: 'Crossed FiLian combination of spaghetti', category: 'Pasta', photo: null },
  { _id: '22', name: 'Pesto Pasta', description: 'Herby flavor garlicky kick and a creamy, cheesy finish', price: 165, category: 'Pasta', photo: null },
  { _id: '23', name: 'Combo', description: 'Chinggers + Fries (real fries)', price: 150, category: 'Appetizers', photo: null },
  { _id: '24', name: 'Fries Solo', description: 'Just fries', price: 90, category: 'Appetizers', photo: null },
  { _id: '25', name: 'Waffles', description: 'Caramel, Chocolate, Blueberry, Strawberry, Cinnamon', price: 125, category: 'Waffles', photo: null },
]

export default function PublicSite() {
  const [menu, setMenu] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    axios.get('/api/menu').then(r => setMenu(r.data)).catch(() => setMenu(DEMO_MENU))
  }, [])

  const displayMenu = menu.length > 0 ? menu : DEMO_MENU
  const categories = ['All', ...CATEGORIES.filter(c => displayMenu.some(i => i.category === c))]
  const filtered = activeCategory === 'All' ? displayMenu : displayMenu.filter(i => i.category === activeCategory)
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <div className="pub-site">

      {/* NAV */}
      <nav className="pub-nav">
        <div className="pub-nav-logo">
          <img src={logo} alt="Mugshot Cafe Logo" style={{ height: '50px' }} />
          <a href="/" className="nav-brand">Mug Shot Cafe</a>
        </div>
        <div className={`pub-nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#menu-section" onClick={() => setMenuOpen(false)}>Menu</a>
          <a href="#location" onClick={() => setMenuOpen(false)}>Location</a>
          <a href="/admin/login" className="nav-admin-btn">Admin Login</a>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span/><span/><span/>
        </button>
      </nav>

      {/* HERO */}
      <section className="pub-hero">
        <div className="hero-noise"/>
        <div className="hero-content">
          <div className="hero-eyebrow">Bambang · Nueva Vizcaya · Est. 2020</div>
          <h1 className="hero-title">
            <span className="hero-word-mug">MUG</span>
            <span className="hero-word-shot">SHOT</span>
          </h1>
          <p className="hero-brand">Mugshot Cafe</p>
          <p className="hero-tagline">"Where every cup tells a story"</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => menuRef.current?.scrollIntoView({ behavior:'smooth' })}>
              View Menu
            </button>
            <a href="#about" className="btn-ghost">Our Story</a>
          </div>
          <div className="hero-pills">
            <span>📍 Boyie St, Buag, Bambang NV</span>
            <span>🕘 Opens 9 AM Tue–Sun</span>
            <span>⭐ 4.7 on Google</span>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="vinyl">
            <div className="vinyl-inner">
              <span className="vinyl-text">Our Love Song</span>
            </div>
          </div>
          <div className="hero-tape-1"/>
          <div className="hero-tape-2"/>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="pub-about">
        <div className="about-container">
          <div className="about-left">
            <div className="about-label">Our Story</div>
            <h2 className="about-headline">Born in Bambang,<br/>Brewed with Soul</h2>
            <p className="about-body">Mug Shot Cafe is a beloved coffee shop nestled in the heart of Bambang, Nueva Vizcaya. We craft drinks that tell the stories of the people who make and enjoy them — from our signature Antukin series to our locally-inspired rice meals.</p>
            <p className="about-body">Every recipe carries a piece of Nueva Vizcaya's warm, vibrant culture. Whether you're stopping by for your morning Latte or a late afternoon Viet Coffee, we pour our heart into every cup.</p>
            <div className="about-stats">
              <div className="astat"><div className="astat-val">4.7★</div><div className="astat-label">Google Rating</div></div>
              <div className="astat"><div className="astat-val">50+</div><div className="astat-label">Menu Items</div></div>
              <div className="astat"><div className="astat-val">3</div><div className="astat-label">Service Types</div></div>
            </div>
          </div>
          <div className="about-right">
            <div className="collage">
              <div className="collage-piece p1">☕</div>
              <div className="collage-piece p2">🎵</div>
              <div className="collage-piece p3">🌿</div>
              <div className="collage-piece p4">📷</div>
              <div className="collage-tape t1"/>
              <div className="collage-tape t2"/>
              <div className="collage-tape t3"/>
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu-section" className="pub-menu" ref={menuRef}>
        <div className="menu-header-block">
          <div className="menu-label-tag">What We Serve</div>
          <div className="menu-big-title">
            <img src={menuImg} alt="Menu" style={{ height: '120px' }} />
          </div>
        </div>
        <div className="menu-filter-bar">
          {categories.map(c => (
            <button key={c}
              className={`filter-pill ${activeCategory === c ? 'active' : ''}`}
              style={activeCategory === c && c !== 'All' ? {background: CAT_COLORS[c], color:'#fff'} : {}}
              onClick={() => setActiveCategory(c)}
            >{c}</button>
          ))}
        </div>
        <div className="menu-content">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="cat-section">
              <div className="cat-title-row">
                <div className="cat-chip" style={{background: CAT_COLORS[cat] || '#2d5a3d'}}>{cat}</div>
                <div className="cat-divider"/>
              </div>
              <div className="items-grid">
                {items.map(item => (
                  <div key={item._id} className="item-card">
                    <div className="item-img">
                      {item.photo ? <img src={item.photo} alt={item.name}/> : <div className="item-emoji">☕</div>}
                    </div>
                    <div className="item-body">
                      <h4 className="item-name">{item.name}</h4>
                      {item.description && <p className="item-desc">{item.description}</p>}
                      <div className="item-prices">
                        {item.hotPrice && <span className="price hot">HOT ₱{item.hotPrice}</span>}
                        {item.icedPrice && <span className="price iced">ICED ₱{item.icedPrice}</span>}
                        {item.price && !item.hotPrice && !item.icedPrice && <span className="price flat">₱{item.price}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="pub-location">
        <div className="location-container">
          <div className="loc-info">
            <div className="about-label">Find Us</div>
            <h2 className="loc-headline">Come Visit</h2>
            <div className="loc-details">
              <div className="loc-row">
                <span className="loc-icon">📍</span>
                <div><strong>Address</strong><p>Boyie St, Buag, Bambang<br/>Nueva Vizcaya 3702</p></div>
              </div>
              <div className="loc-row">
                <span className="loc-icon">🕘</span>
                <div><strong>Hours</strong><p>Tuesday – Sunday<br/>9:00 AM onwards</p></div>
              </div>
              <div className="loc-row">
                <span className="loc-icon">📞</span>
                <div><strong>Contact</strong><p>0976 469 2606</p></div>
              </div>
            </div>
            <div className="service-tags">
              <span>🍽 Dine-in</span>
              <span>🛵 Curbside Pickup</span>
              <span>📦 No-contact Delivery</span>
            </div>
          </div>
          <div className="loc-map">
            <iframe
              title="Mugshot Cafe"
              src="https://maps.google.com/maps?q=Bambang+Nueva+Vizcaya+Philippines&output=embed"
              width="100%" height="360" style={{border:0, borderRadius:'16px'}}
              allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pub-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-cms">CMS</div>
            <div>
              <div className="footer-name">Mugshot Cafe</div>
              <div className="footer-location">Bambang, Nueva Vizcaya</div>
            </div>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#menu-section">Menu</a>
            <a href="#location">Location</a>
          </div>
          <div className="footer-copy">© 2024 Mugshot Cafe · All rights reserved</div>
        </div>
      </footer>

    </div>
  )
}