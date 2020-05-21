const mongoose = require("mongoose");

//Mongoose model F1 Animation Scoring
const AnimationSchema = new mongoose.Schema({
  anim_part1_1_message: Number,
  anim_part1_2_audience: Number,
  anim_part1_3_problemSolving: Number,
  anim_part1_4_accuracy: Number,
  anim_part1_5_clarity: Number,
  anim_part2_6_technique: Number,
  anim_part2_7_composition: Number,
  anim_part2_8_draftsmanship: Number,
  anim_part2_9_craftsmanship: Number,
  anim_part2_10_motion_fx: Number,
  anim_part2_11_sound: Number,
  notes: String,
  complete: Boolean,
  category: { type: String, ref: "Categories", required: true },
  created: { type: Date, default: Date.now },
});

const Animation = mongoose.model("Score_animation", AnimationSchema);

module.exports = Animation;
