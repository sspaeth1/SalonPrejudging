const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema({
  A1: Boolean, //  Didactic/Instructional - Non-Commercial                            //
  A2: Boolean, //  Didactic/Instructional - Commercial
  B: Boolean, //  Still Media - Editorial
  C: Boolean, //  Still Media - Advertising and Marketing/Promotional
  D: Boolean, //  Still Media - Medical Legal
  E: Boolean, //  Still Media - Illustrated Textbook (Traditionally printed book)
  F1: Boolean, //  Animation-Didactic/Instructional - Non-Commercial
  F2: Boolean, //  Animation-Didactic/Instructional - Commercial
  G1: Boolean, //  Interactive Media - Didactic/Instructional-Non-Commercial
  G2: Boolean, //  Interactive Media - Didactic/Instructional-Commercial
  G3: Boolean, //  Interactive Media - Advertising and Marketing/Promotional
  G4: Boolean, //  Interactive Media – Gaming
  G5: Boolean, //  Interactive Media – Interactive Textbook
  I1: Boolean, //  Didactic/Instructional – Anatomical/ Pathological
  I2: Boolean, //  Didactic/Instructional – Surgical/Clinical Procedures
  I3: Boolean, //  Didactic/Instructional – Molecular/Biological/Life Sciences
  J: Boolean, //  Didactic/Instructional – Editorial
  K: Boolean, //  Didactic/Instructional – Advertising and Marketing/Promotional
  L: Boolean, //  Student Motion Media -  Animation
  M: Boolean, //  Student Interactive Section - Interactive
  created: { type: Date, default: Date.now },
});

const CategoriesBool = mongoose.model("CategoriesBool", CategoriesSchema);

module.exports = CategoriesBool;
