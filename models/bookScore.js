const mongoose = require('mongoose');


//Mongoose model Book Scoring

var BookSchema = new mongoose.Schema({
   book_part1_1_message: Number,
   book_part1_2_audience: Number,
   book_part1_3_MedIlliUse: Number,
   book_part1_4_accuracy: Number,
   book_part1_5_clarity: Number,
   book_part2_6_technique: Number,
   book_part2_7_cmpstionDrftsmnshpCrftmnshp: Number,
   book_part2_8_consistencyRendering: Number,
   book_part2_9_layoutIntegration: Number,
   complete: Boolean,
   category: { type: String, ref: 'Categories', required: true},
   created: {type: Date, default: Date.now}
});


var BookEntry = mongoose.model("Book", BookSchema);

module.exports = BookEntry;
