import axios from 'axios'
import { useEffect, useState } from 'react'
import './MenuAdmin.css'

const CATEGORIES = ["Classic","Latte","Antukin","Milky","Mixed","Tea","Fizzy","Xtra","Rice Meals","Pasta","Appetizers","Waffles"]

const emptyForm = { name:'', description:'', price:'', hotPrice:'', icedPrice:'', category:'Classic', photo:null }

function MenuAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [msg, setMsg] = useState(null)
  const [preview, setPreview] = useState(null)

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  const fetchItems = () => axios.get('/api/menu').then(r => setItems(r.data)).catch(console.error)
  useEffect(() => { fetchItems() }, [])

  const flash = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000) }

  const openAdd = () => { setForm(emptyForm); setEditId(null); setPreview(null); setShowModal(true) }
  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description||'', price: item.price||'', hotPrice: item.hotPrice||'', icedPrice: item.icedPrice||'', category: item.category, photo: null })
    setEditId(item._id); setPreview(item.photo); setShowModal(true)
  }

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f) { setForm({...form, photo: f}); setPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k,v]) => { if (v !== null && v !== '') fd.append(k, v) })
    try {
      if (editId) { await axios.put(`/api/menu/${editId}`, fd, { headers }); flash('Menu item updated!') }
      else { await axios.post('/api/menu', fd, { headers }); flash('Menu item added!') }
      setShowModal(false); fetchItems()
    } catch (err) {
      flash(err.response?.data?.message || 'Error saving item', 'error')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await axios.delete(`/api/menu/${id}`, { headers }); flash(`"${name}" deleted`); fetchItems() }
    catch { flash('Error deleting', 'error') }
  }

  const displayed = filterCat === 'All' ? items : items.filter(i => i.category === filterCat)

  return (
    <div className="madmin">
      {msg && <div className={`flash-msg ${msg.type}`}>{msg.text}</div>}
      <div className="madmin-header">
        <div>
          <h1 className="madmin-title">Menu Items</h1>
          <p className="madmin-count">{items.length} items total</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add Item</button>
      </div>
      <div className="madmin-filters">
        {['All', ...CATEGORIES].map(c => (
          <button key={c} className={`mfilter ${filterCat===c?'active':''}`} onClick={() => setFilterCat(c)}>{c}</button>
        ))}
      </div>
      <div className="madmin-table-wrap">
        <table className="madmin-table">
          <thead><tr>
            <th>Photo</th><th>Name</th><th>Category</th><th>Description</th><th>Price (HOT / ICED / FLAT)</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {displayed.map(item => (
              <tr key={item._id}>
                <td><div className="tbl-img">{item.photo ? <img src={item.photo} alt={item.name}/> : <span>☕</span>}</div></td>
                <td><strong className="item-name-cell">{item.name}</strong></td>
                <td><span className="cat-badge">{item.category}</span></td>
                <td className="desc-cell">{item.description}</td>
                <td className="price-cell">
                  {item.hotPrice && <span className="ptag h">🔥 ₱{item.hotPrice}</span>}
                  {item.icedPrice && <span className="ptag i">🧊 ₱{item.icedPrice}</span>}
                  {item.price && !item.hotPrice && !item.icedPrice && <span className="ptag f">₱{item.price}</span>}
                </td>
                <td>
                  <div className="action-btns">
                    <button className="edit-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button className="del-btn" onClick={() => handleDelete(item._id, item.name)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!displayed.length && <tr><td colSpan="6" style={{textAlign:'center',padding:'3rem',color:'#aaa'}}>No items found. Add one!</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="fg">
                  <label>Name *</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. Salted Caramel Latte"/>
                </div>
                <div className="fg">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="fg">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} placeholder="Ingredients or short description..."/>
              </div>
              <div className="form-row">
                <div className="fg">
                  <label>HOT Price (₱)</label>
                  <input type="number" value={form.hotPrice} onChange={e => setForm({...form, hotPrice: e.target.value})} placeholder="e.g. 135"/>
                </div>
                <div className="fg">
                  <label>ICED Price (₱)</label>
                  <input type="number" value={form.icedPrice} onChange={e => setForm({...form, icedPrice: e.target.value})} placeholder="e.g. 150"/>
                </div>
                <div className="fg">
                  <label>Flat Price (₱)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="Single price"/>
                </div>
              </div>
              <div className="fg">
                <label>Photo</label>
                <div className="photo-upload">
                  {preview && <img src={preview} alt="preview" className="photo-preview"/>}
                  <input type="file" accept="image/*" onChange={handleFileChange}/>
                  <span className="photo-hint">JPG, PNG up to 5MB</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn" disabled={loading}>{loading ? 'Saving...' : editId ? 'Update Item' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default MenuAdmin;
