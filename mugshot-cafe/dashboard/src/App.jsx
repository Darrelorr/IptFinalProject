import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicSite from './pages/PublicSite'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoute><AdminPanel /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
