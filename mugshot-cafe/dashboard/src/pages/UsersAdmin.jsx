import {
  Avatar,
  Button, MenuItem,
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "./UsersAdmin.css";

const emptyForm = { name: "", email: "", password: "", role: "staff" };

function UsersAdmin() {
  const [users, setUsers]         = useState([]);
  const [form, setForm]           = useState(emptyForm);
  const [editId, setEditId]       = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState(null);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = () =>
    axios.get("/api/users", { headers })
      .then(r => setUsers(r.data))
      .catch(console.error);

  useEffect(() => { fetchUsers(); }, []);

  const flash = (text, type = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setEditId(u._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/users/${editId}`, form, { headers });
        flash("User updated!");
      } else {
        await axios.post("/api/auth/register", form, { headers });
        flash("User created!");
      }
      resetForm();
      fetchUsers();
    } catch (err) {
      flash(err.response?.data?.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await axios.delete(`/api/users/${id}`, { headers });
      flash(`"${name}" deleted`);
      fetchUsers();
    } catch {
      flash("Error deleting", "error");
    }
  };

  return (
    <div className="uadmin">
      {msg && <div className={`flash-msg ${msg.type}`}>{msg.text}</div>}

      {/* HEADER */}
      <div className="uadmin-header">
        <div>
          <h1 className="uadmin-title">Users</h1>
          <p className="uadmin-count">{users.length} accounts</p>
        </div>
        <button className="add-btn" onClick={openAdd}>+ Add User</button>
      </div>

      {/* TABLE */}
      <div className="madmin-table-wrap">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>
                  <Avatar sx={{ bgcolor: "var(--forest)", color: "#fff" }}>
                    {u.name?.[0]?.toUpperCase()}
                  </Avatar>
                </TableCell>
                <TableCell><strong className="item-name-cell">{u.name}</strong></TableCell>
                <TableCell className="desc-cell">{u.email}</TableCell>
                <TableCell>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </TableCell>
                <TableCell className="desc-cell">
                  {new Date(u.createdAt).toLocaleDateString("en-PH", { month: "short", year: "numeric" })}
                </TableCell>
                <TableCell>
                  <div className="action-btns">
                    <Button size="small" onClick={() => openEdit(u)}
                      sx={{ background: "var(--forest)", color: "var(--cream)", "&:hover": { background: "var(--dark-forest)" } }}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(u._id, u.name)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>
                  No users yet. Add one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && resetForm()}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editId ? "Edit User" : "Add User"}</h2>
              <button className="modal-close" onClick={resetForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">

              <div className="fg">
                <label>Full Name *</label>
                <TextField size="small" fullWidth value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Juan dela Cruz" required />
              </div>

              <div className="fg">
                <label>Email *</label>
                <TextField size="small" type="email" fullWidth value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="juan@mugshotcafe.com" required />
              </div>

              <div className="fg">
                <label>{editId ? "New Password (leave blank to keep)" : "Password *"}</label>
                <TextField size="small" type="password" fullWidth value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required={!editId} />
              </div>

              <div className="fg">
                <label>Role</label>
                <TextField size="small" select fullWidth value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : editId ? "Update" : "Create User"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersAdmin;