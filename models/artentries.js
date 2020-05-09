const mongoose = require('mongoose');

// Mongoose model ART ENTRIES SCHEMA config
var artEntrySchema = new mongoose.Schema({
    category            : String,
    title               : String,
    image               : String,
    client              : String,
    medium_software     : String,
    presentation_format : String,
    primaryAudience     : String,
    intended_purpose    : String,
    rating              : Number,
    created             : {type: Date, default: Date.now}
  });
  
  var artEntry = mongoose.model("ArtEntry", artEntrySchema);
  

  module.exports = artEntry;
