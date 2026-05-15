import { Alert, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/LOGO.jpg'
import './Login.css'

const theme = createTheme({
  palette: {
    primary: { main: '#c9773a' },
    secondary: { main: '#3f2a18' },
  },
  typography: { fontFamily: "'Inter', sans-serif" },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
})

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="login-page">
        <Paper elevation={3} className="login-card">
          <div className="login-header">
            <img src={logo} alt="Mugshot Cafe" className="login-logo" />
            <Typography variant="h6" fontWeight={700} color="secondary">Mug Shot Cafe</Typography>
            <Typography variant="body2" color="text.secondary">Admin Panel</Typography>
          </div>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="admin@mugshotcafe.com"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          <div className="login-back">
            <a href="/">← Back to Website</a>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  )
}