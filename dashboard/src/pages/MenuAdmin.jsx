import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Alert, Avatar, Box, Button, Chip, CircularProgress,
  Dialog, DialogContent, DialogTitle, IconButton,
  MenuItem, Paper, Select, Snackbar, Stack,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './MenuAdmin.css'

const CATEGORIES = ['Classic', 'Latte', 'Antukin', 'Milky', 'Mixed', 'Tea', 'Fizzy', 'Xtra', 'Rice Meals', 'Pasta', 'Appetizers', 'Waffles']
const emptyForm = { name: '', description: '', price: '', hotPrice: '', icedPrice: '', category: 'Classic', photo: null }

export default function MenuAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' })
  const [preview, setPreview] = useState(null)

  const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchItems = () => axios.get('/api/menu').then(r => setItems(r.data)).catch(console.error)
  useEffect(() => { fetchItems() }, [])

  const toast = (msg, severity = 'success') => setSnack({ open: true, msg, severity })

  const openAdd = () => { setForm(emptyForm); setEditId(null); setPreview(null); setOpen(true) }
  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price || '',
      hotPrice: item.hotPrice || '',
      icedPrice: item.icedPrice || '',
      category: item.category,
      photo: null
    })
    setEditId(item._id)
    setPreview(item.photo || null)
    setOpen(true)
  }
  const closeModal = () => setOpen(false)

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (f) {
      setForm(p => ({ ...p, photo: f }))
      setPreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('category', form.category)
      if (form.price) fd.append('price', form.price)
      if (form.hotPrice) fd.append('hotPrice', form.hotPrice)
      if (form.icedPrice) fd.append('icedPrice', form.icedPrice)
      if (form.photo instanceof File) fd.append('photo', form.photo)

      const headers = getHeaders()

      if (editId) {
        await axios.put(`/api/menu/${editId}`, fd, { headers })
        toast('Item updated!')
      } else {
        await axios.post('/api/menu', fd, { headers })
        toast('Item added!')
      }
      closeModal()
      fetchItems()
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving item', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await axios.delete(`/api/menu/${id}`, { headers: getHeaders() })
      toast(`"${name}" deleted`)
      fetchItems()
    } catch {
      toast('Error deleting', 'error')
    }
  }

  const displayed = filterCat === 'All' ? items : items.filter(i => i.category === filterCat)
  const field = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) })

  return (
    <div className="menu-admin">
      <div className="page-header">
        <div>
          <Typography variant="h5" fontWeight={700} color="secondary.main">Menu Items</Typography>
          <Typography variant="body2" color="text.secondary">{items.length} items total</Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Item</Button>
      </div>

      <div className="filter-bar">
        {['All', ...CATEGORIES].map(c => (
          <Chip
            key={c}
            label={c}
            clickable
            size="small"
            variant={filterCat === c ? 'filled' : 'outlined'}
            color={filterCat === c ? 'primary' : 'default'}
            onClick={() => setFilterCat(c)}
          />
        ))}
      </div>

      <TableContainer component={Paper} elevation={0} className="table-wrap">
        <Table size="small">
          <TableHead sx={{ bgcolor: '#fbf2e8' }}>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayed.map(item => (
              <TableRow key={item._id} hover>
                <TableCell>
                  <Avatar
                    src={item.photo}
                    variant="rounded"
                    sx={{ width: 44, height: 44, bgcolor: '#fbf2e8', fontSize: '1.4rem' }}
                  >
                    ☕
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" />
                </TableCell>
                <TableCell className="desc-cell">
                  <Typography variant="caption" color="text.secondary" className="line-clamp">
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    {item.hotPrice && <Typography variant="caption">🔥 ₱{item.hotPrice}</Typography>}
                    {item.icedPrice && <Typography variant="caption">🧊 ₱{item.icedPrice}</Typography>}
                    {item.price && !item.hotPrice && !item.icedPrice && (
                      <Typography variant="caption">₱{item.price}</Typography>
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary" onClick={() => openEdit(item)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(item._id, item.name)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!displayed.length && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No items found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editId ? 'Edit Menu Item' : 'Add Menu Item'}
          <IconButton size="small" onClick={closeModal}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={2}>
              <TextField label="Name *" fullWidth size="small" required {...field('name')} />
              <Select
                size="small"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                sx={{ minWidth: 140 }}
              >
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </Stack>

            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="Ingredients or short description..."
              {...field('description')}
            />

            <Stack direction="row" spacing={2}>
              <TextField label="HOT Price (₱)" size="small" type="number" fullWidth {...field('hotPrice')} />
              <TextField label="ICED Price (₱)" size="small" type="number" fullWidth {...field('icedPrice')} />
              <TextField label="Flat Price (₱)" size="small" type="number" fullWidth {...field('price')} />
            </Stack>

            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Photo</Typography>
              <div className="photo-upload">
                {preview && (
                  <Avatar src={preview} variant="rounded" sx={{ width: 64, height: 64 }} />
                )}
                <Button variant="outlined" size="small" component="label">
                  {preview ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" accept="image/*" hidden onChange={handleFile} />
                </Button>
                <Typography variant="caption" color="text.secondary">JPG, PNG up to 5MB</Typography>
              </div>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeModal}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !form.name}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {loading ? 'Saving...' : editId ? 'Update' : 'Add Item'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(p => ({ ...p, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </div>
  )
}