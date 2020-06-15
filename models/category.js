const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
  letter: String,
  folderId: String,
  created: { type: Date, default: Date.now },
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
