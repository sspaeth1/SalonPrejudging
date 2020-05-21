const mongoose = require("mongoose");

const GeneralScoreSchema = new mongoose.Schema({
  gnrl_part1_1_message: Number,
  gnrl_part1_2_audience: Number,
  gnrl_part1_3_problemSolving: Number,
  gnrl_part1_4_accuracy: Number,
  gnrl_part1_5_clarity: Number,
  gnrl_part2_6_technique: Number,
  gnrl_part2_7_composition: Number,
  gnrl_part2_8_draftsmanship: Number,
  gnrl_part2_9_craftsmanship: Number,
  notes: String,
  complete: Boolean,
  category: { type: String, ref: "Categories", require: true },
  created: { type: Date, default: Date.now },
});

const GeneralScore = mongoose.model("Score_general", GeneralScoreSchema);

module.exports = GeneralScoreSchema;
