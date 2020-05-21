const mongoose = require("mongoose");

// Mongoose model ART ENTRIES SCHEMA config
var artEntrySchema = new mongoose.Schema({
  title: String,
  image: { type: String, default: "https://i.imgur.com/33E6CfN.jpg" },
  client: String,
  medium_software: String,
  presentation_format: String,
  primaryAudience: String,
  intended_purpose: String,
  rating: Number,
  category: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score_animation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Score_animation",
  },
  score_book: { type: mongoose.Schema.Types.ObjectId, ref: "Score_book" },
  score_general: { type: mongoose.Schema.Types.ObjectId, ref: "Score_general" },
  created: { type: Date, default: Date.now },
});

var artEntry = mongoose.model("ArtEntry", artEntrySchema);

module.exports = artEntry;
