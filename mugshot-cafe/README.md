# ☕ Mug Shot Mugshot Cafe — Full-Stack Restaurant Website

**IPT Final Project | Saint Mary's University**

A full-stack MERN application for **Mug Shot Mugshot Cafe** located in Bambang, Nueva Vizcaya, Philippines.

---

## Project Structure

```
mugshot-cafe/
├── server/              # Express.js + MongoDB backend
│   ├── index.js         # Main server, all API routes
│   ├── model/
│   │   ├── menuItem.model.js
│   │   └── user.model.js
│   ├── uploads/         # Uploaded dish photos
│   └── package.json
│
└── client/              # React + Vite frontend
    ├── src/
    │   ├── App.jsx       # Router
    │   ├── pages/
    │   │   ├── PublicSite.jsx   # Landing page (public)
    │   │   ├── Login.jsx        # Admin login
    │   │   ├── AdminPanel.jsx   # Admin layout
    │   │   ├── MenuAdmin.jsx    # CRUD for menu items
    │   │   └── UsersAdmin.jsx   # CRUD for users
    │   └── index.css     # Global CSS variables
    └── package.json
```

---

## Features

### Public Website (Landing Page)
- **Navigation** — Fixed top nav with smooth scroll links
- **Hero Section** — Retro collage aesthetic with animated vinyl record
- **About** — Cafe history and stats
- **Menu** — Full menu display with category filters, hot/iced prices, and dish photos
- **Location** — Address, hours, contact, Google Maps embed
- **Footer** — Branding and social links

### Admin Panel
- **JWT-based login** (persistent with localStorage)
- **Menu Management** — Add, Edit, Delete menu items with photo upload
- **User Management** — Add, Edit, Delete admin/staff accounts
- Protected routes (redirect to login if not authenticated)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Pure CSS with CSS Variables (no framework required) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Dev Server | Vite |

---

## Setup Instructions

### 1. Install MongoDB
Make sure MongoDB is running locally on port 27017, OR update the connection string in `server/index.js` to use MongoDB Atlas.

### 2. Backend Setup
```bash
cd server
npm install
npm run dev   # runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev   # runs on http://localhost:5173
```

### 4. Create Initial Admin Account
After the server is running, send a POST request to register the first admin:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@mugshotcafe.com","password":"admin123","role":"admin"}'
```

Then login at **http://localhost:5173/admin/login**

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/login` | Login, returns JWT |

### Menu (Protected: require Bearer token for write ops)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/menu` | Get all menu items (public) |
| POST | `/api/menu` | Add menu item (with photo) |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

### Users (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | List all users |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

---

## Menu Schema
```js
{
  name: String,        // Required
  description: String,
  price: Number,       // Flat price (if no hot/iced)
  hotPrice: Number,    // Hot variant price
  icedPrice: Number,   // Iced variant price
  category: String,   // Classic | Latte | Antukin | Milky | Mixed | Tea | Fizzy | Xtra | Rice Meals | Pasta | Appetizers | Waffles
  photo: String        // Path to uploaded image
}
```

---

## Style Guide

**Colors:**
- Forest Green `#2d5a3d` — primary brand color
- Dark Forest `#1a3828` — nav/sidebar
- Gold `#c9a84c` — accents
- Cream `#f5f0e8` — backgrounds
- Rust `#b85c38` — warm accent

**Fonts:**
- Display: `Bebas Neue` — headings, menu titles
- Editorial: `Playfair Display` — subheadings
- Typewriter: `Special Elite` — labels, nav, badges
- Body: `Crimson Pro` — descriptions, body text

---

*Mug Shot Mugshot Cafe · Boyie St, Buag, Bambang, Nueva Vizcaya 3702 · 0976 469 2606*
