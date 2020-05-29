const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  categoryName: String,
  // artEntry: { type: mongoose.Schema.Types.ObjectId, ref: "ArtEntry" },
  created: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
