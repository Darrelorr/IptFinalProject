import {
  AppBar, Box, Button, Card, CardContent, CardMedia,
  Chip, Container, Divider, Grid, Stack, Toolbar,
  Typography, useScrollTrigger
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import aboutImg1 from '../../assets/1.jpg'
import aboutImg2 from '../../assets/2.jpg'
import aboutImg3 from '../../assets/3.jpg'
import fruitTea from '../../assets/fruitTea.jpg'
import logo from '../../assets/LOGO.jpg'
import logoPahaba from '../../assets/logoPahaba.png'

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary:    { main: '#c9773a', dark: '#a05a28', light: '#f7d7b5', contrastText: '#fff' },
    secondary:  { main: '#3f2a18', contrastText: '#fff' },
    background: { default: '#fbf2e8', paper: '#fff' },
    text:       { primary: '#3f2a18', secondary: '#7b6450' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
})

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ['Classic', 'Latte', 'Antukin', 'Milky', 'Mixed', 'Tea', 'Fizzy', 'Xtra', 'Rice Meals', 'Pasta', 'Appetizers', 'Waffles']

const DEMO_MENU = [
  { _id: '1',  name: 'Long Black',        description: 'Water + two shot espresso',                            hotPrice: 95,  icedPrice: 105, category: 'Classic' },
  { _id: '2',  name: 'Latte',             description: 'Two shot espresso + milk + thin layer foam',           hotPrice: 120, icedPrice: 125, category: 'Classic' },
  { _id: '3',  name: 'Cappuccino',        description: 'Two shot espresso + milk + foamy milk',                hotPrice: 115, icedPrice: 120, category: 'Classic' },
  { _id: '4',  name: "Togo's Cup",        description: 'Sweet wild honey milk topped with espresso',                          icedPrice: 170, category: 'Antukin' },
  { _id: '5',  name: "YJ's Cup",          description: "Reese's chocolate inspired coffee",                                   icedPrice: 170, category: 'Antukin' },
  { _id: '6',  name: "Mason's Cup",       description: 'Cinnamon explosion topped with espresso',                             icedPrice: 170, category: 'Antukin' },
  { _id: '7',  name: 'Mocha',             description: 'Chocolate sauce + double shot',                        hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { _id: '8',  name: 'Salted Caramel',    description: 'Salted caramel sauce + double shot',                   hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { _id: '9',  name: 'White Chocolate',   description: 'White chocolate sauce + double shot',                  hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { _id: '10', name: 'Milk Chocolate',    description: 'Mocha + cocoa + milk + whipping',                      hotPrice: 100, icedPrice: 120, category: 'Milky' },
  { _id: '11', name: 'Berry Milk',        description: 'Strawberry jam + milk + pink sauce + whipping',                       icedPrice: 120, category: 'Milky' },
  { _id: '12', name: 'Matcha',            description: 'Ceremonial matcha + oat milk + condensed milk',        hotPrice: 135, icedPrice: 145, category: 'Mixed' },
  { _id: '13', name: 'Chai Tea',          description: 'Authentic chai tea leaves + water + sugar',            hotPrice: 90,  icedPrice: 100, category: 'Mixed' },
  { _id: '14', name: 'Butterfly Peaches', description: 'Butterfly pea tea + lemon soda + peach jam',          price: 120,                   category: 'Tea' },
  { _id: '15', name: 'Citron Hibiscus',   description: 'Hibiscus tea + lemon soda + sweetener + citron jam',  price: 120,                   category: 'Tea' },
  { _id: '16', name: 'Soda Yakult',       description: 'Green apple, peach, blueberry, strawberry, lychee',   price: 120,                   category: 'Fizzy' },
  { _id: '17', name: 'Espresso',          price: 70,  category: 'Xtra' },
  { _id: '18', name: 'Syrup',             price: 40,  category: 'Xtra' },
  { _id: '19', name: 'Chicken Ala-King',  description: 'Chicken breast fillet in creamy ala king sauce',       price: 175,                   category: 'Rice Meals' },
  { _id: '20', name: 'Sweet Braised Pork',description: 'Sweet cubed pork topped with sesame seeds',            price: 180,                   category: 'Rice Meals' },
  { _id: '21', name: 'Spaghetti',         description: 'Filipino-style spaghetti',                             price: 155,                   category: 'Pasta' },
  { _id: '22', name: 'Pesto Pasta',       description: 'Herby, garlicky kick with creamy cheesy finish',       price: 165,                   category: 'Pasta' },
  { _id: '23', name: 'Combo',             description: 'Chinggers + fries',                                    price: 150,                   category: 'Appetizers' },
  { _id: '24', name: 'Fries Solo',        description: 'Just fries',                                           price: 90,                    category: 'Appetizers' },
  { _id: '25', name: 'Waffles',           description: 'Caramel, chocolate, blueberry, strawberry, cinnamon',  price: 125,                   category: 'Waffles' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────
function StickyNav({ scrollTo, menuRef }) {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 0 })
  return (
    <AppBar
      elevation={trigger ? 4 : 0}
      sx={{ bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 40, width: 40, borderRadius: 2, objectFit: 'cover' }} />
          <Typography variant="subtitle1" fontWeight={700} color="secondary">Mug Shot Cafe</Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {[['about', 'About'], ['menu-section', 'Menu'], ['location', 'Location']].map(([id, label]) => (
            <Button key={id} onClick={() => scrollTo(id)} sx={{ color: 'text.secondary' }}>{label}</Button>
          ))}
          <Button variant="contained" size="small" href="/admin/login" sx={{ ml: 1 }}>Admin</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

function MenuCard({ item }) {
  return (
    <Card elevation={0} sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      border: '1px solid', borderColor: 'divider', borderRadius: 3,
      transition: 'box-shadow .2s, transform .2s',
      '&:hover': { boxShadow: '0 8px 24px rgba(63,42,24,.12)', transform: 'translateY(-2px)' },
    }}>
      {item.photo
        ? <CardMedia component="img" image={item.photo} alt={item.name} sx={{ height: 150, objectFit: 'cover' }} />
        : <Box sx={{ height: 80, bgcolor: '#fbf2e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>☕</Box>
      }
      <CardContent sx={{ flex: 1, p: 1.75 }}>
        <Typography variant="subtitle2" fontWeight={700} color="secondary" gutterBottom>{item.name}</Typography>
        {item.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, lineHeight: 1.5 }}>{item.description}</Typography>
        )}
        <Stack direction="row" flexWrap="wrap" gap={0.5}>
          {item.hotPrice  && <Chip size="small" label={`🔥 ₱${item.hotPrice}`}  sx={{ bgcolor: '#fff3e0', color: '#c9773a', fontSize: '0.72rem' }} />}
          {item.icedPrice && <Chip size="small" label={`🧊 ₱${item.icedPrice}`} sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontSize: '0.72rem' }} />}
          {item.price && !item.hotPrice && !item.icedPrice && (
            <Chip size="small" label={`₱${item.price}`} sx={{ bgcolor: '#fbf2e8', color: '#3f2a18', fontSize: '0.72rem' }} />
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PublicSite() {
  const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const menuRef = useRef(null)

  useEffect(() => {
    axios.get('/api/menu').then(r => setMenuItems(r.data)).catch(() => {})
  }, [])

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const data = menuItems.length > 0 ? menuItems : DEMO_MENU
  const categories = ['All', ...CATEGORIES.filter(c => data.some(i => i.category === c))]
  const filtered = activeCategory === 'All' ? data : data.filter(i => i.category === activeCategory)
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter(i => i.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <StickyNav scrollTo={scrollTo} menuRef={menuRef} />
        <Toolbar />

        {/* ── HERO ── */}
        <Box sx={{ background: 'radial-gradient(circle at top left, #fff5ea 0%, #f7d7b5 42%, #c4854c 100%)', pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="overline" sx={{ color: '#8a6b4f', letterSpacing: 4 }}>Bambang · Nueva Vizcaya · Est. 2020</Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '5rem' }, lineHeight: 1, mt: 1 }}>
                  <Box component="span" sx={{ display: 'block', color: 'secondary.main' }}>MUG</Box>
                  <Box component="span" sx={{ display: 'block', color: '#8a4e2f' }}>SHOT</Box>
                </Typography>
                <Typography sx={{ color: '#5d4222', mt: 1, mb: 3, fontStyle: 'italic' }}>"Where every cup tells a story"</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  <Button variant="contained" size="large" onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}>View Menu</Button>
                  <Button variant="outlined" size="large" onClick={() => scrollTo('about')} sx={{ borderColor: 'rgba(63,42,24,.3)', color: 'secondary.main', bgcolor: 'rgba(255,255,255,.9)' }}>Our Story</Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['📍 Boyie St, Buag, Bambang NV', '🕘 Opens 9 AM Tue–Sun', '⭐ 4.7 on Google'].map(p => (
                    <Box key={p} sx={{ bgcolor: 'rgba(255,255,255,.8)', borderRadius: 99, px: 1.5, py: 0.75, fontSize: '0.82rem' }}>{p}</Box>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Box component="img" src={logoPahaba} alt="Cafe" sx={{ width: '45%', borderRadius: 4, objectFit: 'cover', aspectRatio: '3/4', boxShadow: '0 24px 60px rgba(79,43,19,.28)' }} />
                  <Box component="img" src={fruitTea}   alt="Drinks" sx={{ width: '45%', borderRadius: 4, objectFit: 'cover', aspectRatio: '3/4', boxShadow: '0 24px 60px rgba(79,43,19,.28)', mt: 4 }} />
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ── ABOUT ── */}
        <Box id="about" sx={{ bgcolor: '#fff7ef', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>Our Story</Typography>
                <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                  Born in Bambang,<br />Brewed with Soul
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                  Mug Shot Cafe is a beloved coffee shop nestled in the heart of Bambang, Nueva Vizcaya. We craft drinks that tell the stories of the people who make and enjoy them — from our signature Antukin series to our locally-inspired rice meals.
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                  Every recipe carries a piece of Nueva Vizcaya's warm, vibrant culture. Whether you're stopping by for your morning Latte or a late-afternoon Chai Tea, we pour our heart into every cup.
                </Typography>
                <Stack direction="row" spacing={4}>
                  {[['4.7★', 'Google Rating'], ['50+', 'Menu Items'], ['3', 'Service Types']].map(([val, label]) => (
                    <Box key={label}>
                      <Typography variant="h4" color="primary" fontWeight={800}>{val}</Typography>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1.5}>
                  {[aboutImg1, aboutImg2, aboutImg3].map((img, i) => (
                    <Grid item xs={4} key={i}>
                      <Box component="img" src={img} alt={`Cafe ${i + 1}`} sx={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 3, boxShadow: '0 8px 24px rgba(63,42,24,.12)' }} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ── MENU ── */}
        <Box id="menu-section" ref={menuRef} sx={{ py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>What We Serve</Typography>
              <Typography variant="h2" sx={{ mt: 1, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>Our Menu</Typography>
              <Divider sx={{ borderColor: 'rgba(201,119,58,.2)' }} />
            </Box>

            {/* Category chips */}
            <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{ mb: 5 }}>
              {categories.map(c => (
                <Chip
                  key={c}
                  label={c}
                  clickable
                  variant={activeCategory === c ? 'filled' : 'outlined'}
                  color={activeCategory === c ? 'primary' : 'default'}
                  onClick={() => setActiveCategory(c)}
                />
              ))}
            </Stack>

            {/* Grouped items */}
            {Object.entries(grouped).map(([cat, items]) => (
              <Box key={cat} sx={{ mb: 5 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2.5 }}>
                  <Chip label={cat} color="primary" sx={{ fontWeight: 700 }} />
                  <Divider sx={{ flex: 1 }} />
                </Stack>
                <Grid container spacing={2}>
                  {items.map(item => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                      <MenuCard item={item} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Container>
        </Box>

        {/* ── LOCATION ── */}
        <Box id="location" sx={{ bgcolor: '#fff7ef', py: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="flex-start">
              <Grid item xs={12} md={5}>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 3 }}>Find Us</Typography>
                <Typography variant="h2" sx={{ mt: 1, mb: 4, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>Come Visit</Typography>
                <Stack spacing={3} sx={{ mb: 4 }}>
                  {[
                    ['📍', 'Address', 'Boyie St, Buag, Bambang\nNueva Vizcaya 3702'],
                    ['🕘', 'Hours',   'Tuesday – Sunday\n9:00 AM onwards'],
                    ['📞', 'Contact', '0976 469 2606'],
                  ].map(([icon, label, val]) => (
                    <Stack direction="row" spacing={2} key={label}>
                      <Typography sx={{ fontSize: '1.4rem', lineHeight: 1, mt: 0.25 }}>{icon}</Typography>
                      <Box>
                        <Typography fontWeight={700} color="secondary" variant="body2">{label}</Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ whiteSpace: 'pre-line', mt: 0.25 }}>{val}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['🍽 Dine-in', '🛵 Curbside Pickup', '📦 No-contact Delivery'].map(s => (
                    <Chip key={s} label={s} variant="outlined" sx={{ borderColor: 'rgba(201,119,58,.3)', color: 'text.secondary' }} />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={7}>
                <Box sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 24px rgba(63,42,24,.12)' }}>
                  <iframe
                    title="Mugshot Cafe"
                    src="https://maps.google.com/maps?q=Bambang+Nueva+Vizcaya+Philippines&output=embed"
                    width="100%"
                    height="380"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* ── FOOTER ── */}
        <Box component="footer" sx={{ bgcolor: '#2f251e', color: '#fbf2e8', py: 4 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box component="img" src={logo} alt="Logo" sx={{ height: 38, width: 38, borderRadius: 1.5, objectFit: 'cover', border: '2px solid rgba(201,168,76,.5)' }} />
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#c9a84c' }}>Mugshot Cafe</Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(251,242,232,.6)' }}>Bambang, Nueva Vizcaya</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={3}>
                {[['about', 'About'], ['menu-section', 'Menu'], ['location', 'Location']].map(([id, label]) => (
                  <Typography key={id} onClick={() => scrollTo(id)} sx={{ color: 'rgba(251,242,232,.7)', cursor: 'pointer', fontSize: '0.9rem', '&:hover': { color: '#c9a84c' } }}>
                    {label}
                  </Typography>
                ))}
              </Stack>
              <Typography variant="caption" sx={{ color: 'rgba(251,242,232,.4)' }}>© 2024 Mugshot Cafe · All rights reserved</Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
