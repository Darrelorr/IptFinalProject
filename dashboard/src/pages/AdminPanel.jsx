import LogoutIcon from '@mui/icons-material/Logout'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PeopleIcon from '@mui/icons-material/People'
import { Avatar, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import logo from '../../assets/LOGO.jpg'
import './AdminPanel.css'
import MenuAdmin from './MenuAdmin'
import UsersAdmin from './UsersAdmin'

const theme = createTheme({
  palette: {
    primary: { main: '#c9773a' },
    secondary: { main: '#3f2a18' },
    background: { default: '#f5f0eb' },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
})

export default function AdminPanel() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  const navLinks = [
    { label: 'Menu Items', to: '/admin', end: true, icon: <MenuBookIcon fontSize="small" /> },
    ...(user.role === 'admin' ? [{ label: 'Users', to: '/admin/users', icon: <PeopleIcon fontSize="small" /> }] : []),
    { label: 'View Site', to: '/', icon: <OpenInNewIcon fontSize="small" /> },
  ]

  return (
    <ThemeProvider theme={theme}>
      <div className="admin-layout">
        <Drawer
          variant="permanent"
          sx={{
            width: 220,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 220,
              bgcolor: '#2f251e',
              color: '#fbf2e8',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <div className="sidebar-brand">
            <img src={logo} alt="Mug Shot" className="sidebar-logo" />
              <div>
                <Typography fontWeight={700} sx={{ color: '#c9a84c', lineHeight: 1.2 }}>Mug Shot</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(251,242,232,0.5)' }}>Admin Panel</Typography>
              </div>
          </div>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          <List sx={{ flex: 1, px: 1, pt: 1 }}>
            {navLinks.map(({ label, to, end, icon }) =>
              <ListItemButton
                key={label}
                component={NavLink}
                to={to}
                end={end}
                sx={{
                  borderRadius: 2, mb: 0.5,
                  color: 'rgba(251,242,232,0.7)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' },
                  '&.active': { bgcolor: '#c9773a', color: '#fff' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>{icon}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }} />
              </ListItemButton>
            )}
          </List>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

          <div className="sidebar-user">
            <Avatar sx={{ bgcolor: '#c9773a', width: 34, height: 34, fontSize: 14 }}>
              {user.name?.[0]?.toUpperCase() || 'A'}
            </Avatar>
            <div className="sidebar-user-info">
              <Typography variant="body2" fontWeight={600} sx={{ color: '#fbf2e8' }} noWrap>
                {user.name || 'Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(251,242,232,0.5)', textTransform: 'capitalize' }}>
                {user.role || 'admin'}
              </Typography>
            </div>
            <Tooltip title="Logout">
              <LogoutIcon onClick={logout} className="logout-icon" />
            </Tooltip>
          </div>
        </Drawer>

        <main className="admin-main">
          <Routes>
            <Route index element={<MenuAdmin />} />
            <Route path="users" element={user.role === 'admin' ? <UsersAdmin /> : <Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  )
}