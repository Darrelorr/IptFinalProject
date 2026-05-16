import axios from 'axios'
import { useEffect, useState } from 'react'
import './UsersAdmin.css'

const emptyForm = { name:'', email:'', password:'', role:'staff' }

function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetch = () =>
    axios.get('/api/users', { headers })
      .then(r => setUsers(r.data))
      .catch(console.error)

  useEffect(() => { fetch() }, [])

  const flash = (text, type='success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }

  const openAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (u) => {
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role
    })
    setEditId(u._id)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editId) {
        await axios.put(`/api/users/${editId}`, form, { headers })
        flash('User updated!')
      } else {
        await axios.post('/api/auth/register', form, { headers })
        flash('User created!')
      }

      setShowModal(false)
      fetch()
    } catch (err) {
      flash(err.response?.data?.message || 'Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"?`)) return

    try {
      await axios.delete(`/api/users/${id}`, { headers })
      flash(`"${name}" deleted`)
      fetch()
    } catch {
      flash('Error deleting', 'error')
    }
  }

  return (
    <div className="uadmin">
      {msg && <div className={`flash-msg ${msg.type}`}>{msg.text}</div>}

      <div className="uadmin-header">
        <div>
          <h1 className="uadmin-title">Users</h1>
          <p className="uadmin-count">{users.length} accounts</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add User</button>
      </div>

      <div className="users-grid">
        {users.map(u => (
          <div key={u._id} className="user-card">
            <div className="uc-avatar">
              {u.name[0]?.toUpperCase()}
            </div>

            <div className="uc-info">
              <div className="uc-name">{u.name}</div>
              <div className="uc-email">{u.email}</div>
              <div className="uc-meta">
                <span className={`role-badge ${u.role}`}>{u.role}</span>
                <span className="joined">
                  Joined {new Date(u.createdAt).toLocaleDateString('en-PH', {
                    month:'short',
                    year:'numeric'
                  })}
                </span>
              </div>
            </div>

            <div className="uc-actions">
              <button className="edit-btn" onClick={() => openEdit(u)}>Edit</button>
              <button className="del-btn" onClick={() => handleDelete(u._id, u.name)}>Delete</button>
            </div>
          </div>
        ))}

        {!users.length && (
          <div className="empty-state">
            No users yet. Add one!
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Edit User' : 'Add User'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="fg">
                <label>Full Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name:e.target.value})}
                  required
                  placeholder="Juan dela Cruz"
                />
              </div>

              <div className="fg">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  required
                  placeholder="juan@mugshotcafe.com"
                />
              </div>

              <div className="fg">
                <label>
                  {editId ? 'New Password (leave blank to keep)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  required={!editId}
                  placeholder="••••••••"
                />
              </div>

              <div className="fg">
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm({...form, role:e.target.value})}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editId ? 'Update' : 'Create User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersAdmin