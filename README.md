# Mug Shot Cafe — MERN Stack Website
**IPT Final Project | BSIT 3B | Saint Mary's University**

A full-stack restaurant website for Mug Shot Cafe, Bambang, Nueva Vizcaya.

---

## Project Structure

```
mugshot-cafe/
├── dashboard/        ← React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PublicSite.jsx   ← Landing page (About, Menu, Location)
│   │   │   ├── Login.jsx        ← Admin login
│   │   │   ├── AdminPanel.jsx   ← Admin layout with sidebar
│   │   │   ├── MenuAdmin.jsx    ← CRUD for menu items
│   │   │   └── UsersAdmin.jsx   ← CRUD for users
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            ← minimal reset only
│   └── package.json
└── server/           ← Express + MongoDB backend
    ├── model/
    │   ├── menuItem.model.js
    │   └── user.model.js
    ├── index.js
    ├── .env
    └── package.json
```

## Setup

### Backend
```bash
cd server
npm install
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend
```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173

---

## Features
- Public landing page: Hero, About, Menu, Location, Footer
- Menu items fetched from DB (falls back to demo data)
- Admin login with JWT authentication
- Admin panel: full CRUD for menu items with image upload
- Admin panel: user management (admin role only)

## Stack
- **Frontend:** React, Vite, Material UI v5
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT + bcryptjs
- **File upload:** Multer
