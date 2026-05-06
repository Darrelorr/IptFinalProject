import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import logo from '../../assets/LOGO.jpg'
import map from '../../assets/map.png'
import menu from '../../assets/MENU.jpg'
import users from '../../assets/users.png'
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
          <img src={logo} alt="Mugshot Cafe Logo" className="admin-brand-logo" />
          <div className="admin-brand-text">
            <div className="admin-brand-name">Mug Shot</div>
            <div className="admin-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
          >
            <img src={menu} alt="" className="link-icon-img" /> Menu Items
          </NavLink>

          {user.role === 'admin' && (
            <NavLink
              to="/admin/users"
              className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
            >
              <img src={users} alt="" className="link-icon-img" /> Users
            </NavLink>
          )}

          {/* FIXED LINK */}
          <a
            href="/"
            className="admin-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={map} alt="" className="link-icon-img" /> View Site
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
          <button onClick={logout} className="logout-btn" title="Logout">⏻</button>
        </div>

      </aside>

      <main className="admin-main">
        <Routes>
          <Route index element={<MenuAdmin />} />
          <Route
            path="users"
            element={
              user.role === 'admin'
                ? <UsersAdmin />
                : <Navigate to="/admin" replace />
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default AdminPanel