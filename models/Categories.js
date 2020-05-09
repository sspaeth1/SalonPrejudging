const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
    A1: String,  //  Didactic/Instructional - Non-Commercial                            //
    A2: String,  //  Didactic/Instructional - Commercial          
     B: String,  //  Still Media - Editorial
     C: String,  //  Still Media - Advertising and Marketing/Promotional
     D: String,  //  Still Media - Medical Legal
     E: String,  //  Still Media - Illustrated Textbook (Traditionally printed book)
    F1: String,  //  Animation-Didactic/Instructional - Non-Commercial
    F2: String,  //  Animation-Didactic/Instructional - Commercial   
    G1: String,  //  Interactive Media - Didactic/Instructional-Non-Commercial
    G2: String,  //  Interactive Media - Didactic/Instructional-Commercial
    G3: String,  //  Interactive Media - Advertising and Marketing/Promotional
    G4: String,  //  Interactive Media – Gaming
    G5: String,  //  Interactive Media – Interactive Textbook
    I1: String,  //  Didactic/Instructional – Anatomical/ Pathological 
    I2: String,  //  Didactic/Instructional – Surgical/Clinical Procedures
    I3: String,  //  Didactic/Instructional – Molecular/Biological/Life Sciences
     J: String,  //  Didactic/Instructional – Editorial 
     K: String,  //  Didactic/Instructional – Advertising and Marketing/Promotional
     L: String,  //  Student Motion Media -  Animation
     M: String,  //  Student Interactive Section - Interactive 
     created: {type: Date, default: Date.now} 
});



const Categories = mongoose.model("Categories", CategoriesSchema);


module.exports = Categories;