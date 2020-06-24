var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  Password: String,
  firstName: String,
  lastName: String,
  email: String,
  avatar: { type: String, default: "https://i.imgur.com/O2vFdrv.jpg" },
  // artEntry: { type: mongoose.Schema.Types.ObjectId, ref: "ArtEntry" },
  judge: { type: Boolean, default: true },
  assignedCategories: [
    {
      name: String, //'Still Media Editorial'
      letter: String, //'B'
      type: String,
      subtype: String,
      specific: String,
    },
  ],
  judgingGroup: String,
  // assignedCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  isAdmin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
