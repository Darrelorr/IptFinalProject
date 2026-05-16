const { Schema, model } = require("mongoose");

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: null },
    hotPrice: { type: Number, default: null },
    icedPrice: { type: Number, default: null },
    category: {
      type: String,
      enum: ["Classic", "Latte", "Antukin", "Milky", "Mixed", "Tea", "Fizzy", "Xtra", "Rice Meals", "Pasta", "Appetizers", "Waffles"],
      required: true,
    },
    photo: { type: String, default: null },
  },
  { timestamps: true, collection: "menu-items" }
);

module.exports = model("MenuItem", menuItemSchema);
