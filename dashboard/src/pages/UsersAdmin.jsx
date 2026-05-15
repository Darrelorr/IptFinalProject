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
import './UsersAdmin.css'

const emptyForm = { name: '', email: '', password: '', role: 'staff' }

export default function UsersAdmin() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' })

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` }

  const fetchUsers = () => axios.get('/api/users', { headers }).then(r => setUsers(r.data)).catch(console.error)
  useEffect(() => { fetchUsers() }, [])

  const toast = (msg, severity = 'success') => setSnack({ open: true, msg, severity })
  const closeModal = () => { setForm(emptyForm); setEditId(null); setOpen(false) }

  const openAdd = () => { setForm(emptyForm); setEditId(null); setOpen(true) }
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setEditId(u._id); setOpen(true) }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (editId) { await axios.put(`/api/users/${editId}`, form, { headers }); toast('User updated!') }
      else { await axios.post('/api/auth/register', form, { headers }); toast('User created!') }
      closeModal()
      fetchUsers()
    } catch (err) {
      toast(err.response?.data?.message || 'Error saving user', 'error')
    } finally { setLoading(false) }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await axios.delete(`/api/users/${id}`, { headers }); toast(`"${name}" deleted`); fetchUsers() }
    catch { toast('Error deleting', 'error') }
  }

  const field = (key) => ({ value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) })

  return (
    <div className="users-admin">
      <div className="page-header">
        <div>
          <Typography variant="h5" fontWeight={700} color="secondary.main">Users</Typography>
          <Typography variant="body2" color="text.secondary">{users.length} accounts</Typography>
        </div>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add User</Button>
      </div>

      <TableContainer component={Paper} elevation={0} className="table-wrap">
        <Table size="small">
          <TableHead sx={{ bgcolor: '#fbf2e8' }}>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id} hover>
                <TableCell>
                  <Avatar sx={{ bgcolor: '#c9773a', width: 34, height: 34, fontSize: 14 }}>
                    {u.name?.[0]?.toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell><Typography variant="body2" fontWeight={600}>{u.name}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{u.email}</Typography></TableCell>
                <TableCell>
                  <Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} sx={{ textTransform: 'capitalize' }} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(u.createdAt).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' })}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" color="primary" onClick={() => openEdit(u)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(u._id, u.name)}><DeleteIcon fontSize="small" /></IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No users yet.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editId ? 'Edit User' : 'Add User'}
          <IconButton size="small" onClick={closeModal}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <TextField label="Full Name *" fullWidth size="small" required {...field('name')} />
            <TextField label="Email *" type="email" fullWidth size="small" required {...field('email')} />
            <TextField
              label={editId ? 'New Password (leave blank to keep)' : 'Password *'}
              type="password"
              fullWidth
              size="small"
              required={!editId}
              {...field('password')}
            />
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>Role</Typography>
              <Select fullWidth size="small" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </Box>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={closeModal}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={loading || !form.name || !form.email}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}>
                {loading ? 'Saving...' : editId ? 'Update' : 'Create'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} onClose={() => setSnack(p => ({ ...p, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </div>
  )
}