const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const MenuItem = require("./model/menuItem.model");
const User = require("./model/user.model");

const JWT_SECRET = "mugshot_cafe_secret_2024";

const DEFAULT_MENU_ITEMS = [
  { name: 'Long Black', description: 'Water + two shot espresso', hotPrice: 95, icedPrice: 105, category: 'Classic' },
  { name: 'Latte', description: 'Two shot espresso + milk + thin layer foam', hotPrice: 120, icedPrice: 125, category: 'Classic' },
  { name: 'Cappuccino', description: 'Two shot espresso + milk + Foamy milk', hotPrice: 115, icedPrice: 120, category: 'Classic' },
  { name: "Togo's Cup", description: 'Sweet wild honey milk topped with espresso', icedPrice: 170, category: 'Antukin' },
  { name: "YJ's Cup", description: "Reese's chocolate inspired coffee", icedPrice: 170, category: 'Antukin' },
  { name: "Mason's Cup", description: 'Cinnamon explosion topped with espresso', icedPrice: 170, category: 'Antukin' },
  { name: 'Mocha', description: 'Chocolate sauce + Double shot', hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { name: 'Salted Caramel', description: 'Salted caramel sauce + Double Shot', hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { name: 'White Chocolate', description: 'White Chocolate sauce + Double Shot', hotPrice: 135, icedPrice: 150, category: 'Latte' },
  { name: 'Milk Chocolate', description: 'Mocha + Cocoa + Milk + Whipping', hotPrice: 100, icedPrice: 120, category: 'Milky' },
  { name: 'Berry Milk', description: 'Strawberry Jam + Milk + pink sauce + whipping', icedPrice: 120, category: 'Milky' },
  { name: 'Matcha', description: 'Ceremonial Matcha + Oat milk + condensed milk', hotPrice: 135, icedPrice: 145, category: 'Mixed' },
  { name: 'Chai Tea', description: 'Authentic chai tea leaves + water + sugar', hotPrice: 90, icedPrice: 100, category: 'Mixed' },
  { name: 'Butterfly Peaches', description: 'Butterfly Pea tea + Lemon soda + peach jam', price: 120, category: 'Tea' },
  { name: 'Citron Hibiscus', description: 'Hibiscus tea + lemon soda + sweetener + citron jam', price: 120, category: 'Tea' },
  { name: 'Soda Yakult', description: 'Green apple, Peach, Blueberry, Strawberry, Lychee', price: 120, category: 'Fizzy' },
  { name: 'Espresso', price: 70, category: 'Xtra' },
  { name: 'Syrup', price: 40, category: 'Xtra' },
  { name: 'Chicken Ala-King', description: 'Chicken breast fillet drenched in a creamy ala king sauce', price: 175, category: 'Rice Meals' },
  { name: 'Sweet Braised Pork', description: 'Sweet cubed cut pork topped with sesame seeds', price: 180, category: 'Rice Meals' },
  { name: 'Spaghetti', description: 'Crossed FiLian combination of spaghetti', category: 'Pasta' },
  { name: 'Pesto Pasta', description: 'Herby flavor garlicky kick and a creamy, cheesy finish', price: 165, category: 'Pasta' },
  { name: 'Combo', description: 'Chinggers + Fries (real fries)', price: 150, category: 'Appetizers' },
  { name: 'Fries Solo', description: 'Just fries', price: 90, category: 'Appetizers' },
  { name: 'Waffles', description: 'Caramel, Chocolate, Blueberry, Strawberry, Cinnamon', price: 125, category: 'Waffles' },
];

async function seedMenuItems() {
  try {
    const count = await MenuItem.countDocuments();
    if (count === 0) {
      await MenuItem.insertMany(DEFAULT_MENU_ITEMS.map(item => ({
        ...item,
        photo: null,
      })));
      console.log('Default menu items seeded.');
    }
  } catch (err) {
    console.error('Error seeding menu items:', err);
  }
}

mongoose
  .connect("mongodb://localhost:27017/mugshotcafe")
  .then(async () => {
    console.log("MongoDB connected to mugshotcafe");
    await seedMenuItems();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ── AUTH ROUTES ──────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: role || "staff" });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// ── MENU ROUTES (public GET) ─────────────────────────────────────────────────
app.get("/api/menu", async (req, res) => {
  try {
    await seedMenuItems();
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

app.post("/api/menu", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, category, hotPrice, icedPrice } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    const item = new MenuItem({ name, description, price, category, hotPrice, icedPrice, photo });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Error creating menu item", error: err.message });
  }
});

app.put("/api/menu/:id", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const { name, description, price, category, hotPrice, icedPrice } = req.body;
    const updateData = { name, description, price, category, hotPrice, icedPrice };
    if (req.file) updateData.photo = `/uploads/${req.file.filename}`;
    const item = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating menu item" });
  }
});

app.delete("/api/menu/:id", authMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting menu item" });
  }
});

// ── USER MANAGEMENT (admin only) ─────────────────────────────────────────────
app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.put("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updateData = { name, email, role };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating user" });
  }
});

app.delete("/api/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

app.get("/", (req, res) => res.send("Mug Shot Cafe API running"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
