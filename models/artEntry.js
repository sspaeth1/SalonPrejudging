const mongoose = require("mongoose");

// Mongoose model ART ENTRIES SCHEMA config
var artEntrySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  title: String,
  image: { type: String, default: "https://i.imgur.com/33E6CfN.jpg" },
  client: String,
  medium_software: String,
  presentation_format: String,
  primaryAudience: String,
  intended_purpose: String,
  rating: Number,
  category: String,
  star: { type: Boolean, default: false },
  excellenceWinner: { type: Boolean, default: false },
  meritWinner: { type: Boolean, default: false }, //ArtEntry.find({meritWinner: true})
  judge: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score_general: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Score_general" },
  ],
  created: { type: Date, default: Date.now },
});

var ArtEntry = mongoose.model("ArtEntry", artEntrySchema);

module.exports = ArtEntry;
