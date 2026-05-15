import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import PublicSite from './pages/PublicSite'

function ProtectedRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
