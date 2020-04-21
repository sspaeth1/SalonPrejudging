const mongoose = require('mongoose');

// Mongoose model ART ENTRIES SCHEMA config
var artEntrySchema = new mongoose.Schema({
    category: String,
    title: String,
    image: String,
    medium: String,
    format: String,
    primaryAudience: String,
    description: String,
    audience: String,
    created: {type: Date, default: Date.now}
  });
  
  var artEntry = mongoose.model("ArtEntry", artEntrySchema);
  

  module.exports = artEntry;