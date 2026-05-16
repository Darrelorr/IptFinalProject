import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import './AdminPanel.css'
import MenuAdmin from './MenuAdmin'
import UsersAdmin from './UsersAdmin'

function AdminPanel() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo-cms">CMS</div>
          <div className="admin-logo-text">
            <span>Mug Shot</span>
            <span className="admin-logo-sub">Admin Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink 
            to="/admin" 
            end 
            className={({isActive}) => `admin-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">☕</span> Menu Items
          </NavLink>

          <NavLink 
            to="/admin/users" 
            className={({isActive}) => `admin-link ${isActive ? 'active' : ''}`}
          >
            <span className="link-icon">👥</span> Users
          </NavLink>

          <a 
            href="/" 
            className="admin-link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span className="link-icon">🌐</span> View Site
          </a>
        </nav>

        <div className="admin-user-info">
          <div className="user-avatar">
            {user.name?.[0] || 'A'}
          </div>
          <div>
            <div className="user-name">{user.name || 'Admin'}</div>
            <div className="user-role">{user.role || 'admin'}</div>
          </div>
          <button 
            onClick={logout} 
            className="logout-btn" 
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Routes>
          <Route index element={<MenuAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Routes>
      </main>
    </div>
  )
}

export default AdminPanel