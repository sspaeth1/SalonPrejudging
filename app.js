const bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  expressSanitizer = require("express-sanitizer"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  User = require("./models/user"),
  ArtEntry = require("./models/artEntry"),
  Category = require("./models/category"),
  alt = "acdNGY4RKoPe",
  categorySpecifics = require("./public/json/categorySpecifics.js"),
  JudgeGroups = require("./public/json/Groups.js"),
  entrants = require("./public/json/AllEntrants"); // js file with all entries  converted from excel> CSV > Json > js
const newItemRoutes = require("./routes/newItem");
const auth = require("./routes/auth");
const indexRoutes = require("./routes/index");
const rating = require("./routes/rating");
const ArtEntryCategoryPages = require("./routes/categoryArtEntryPages");
const app = express();

//App config//

// //mongoose connect mongo DB Atlas
mongoose
  .connect("mongodb+srv://spaeth2:" + alt + "@ss-apps.vtkpg.mongodb.net/AMI-Judging-Portal-Collection?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    //Populate Art Entries from Js/JSON file. created from spreadsheet
    ArtEntry.find().then((res) => {
      if (res.length == 0) {
        for (let i = 0; i < entrants.length; i++) {
          let art = new ArtEntry(entrants[i]);
          art.save();
        }
      }
    });
    console.log("Connected to mongoDB Atlas DB");
  });
Category.find()
  .then((res) => {
    if (res.length == 0) {
      //manually populate
      let newEntry = new Category({
        name: "",
        letter: "",
        folderId: "",
      });
      newEntry.save();
    }
  })

  .catch((err) => {
    console.log("Error: " + err.message);
  });
mongoose.Promise = global.Promise;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  require("express-session")({
    secret: "pulseOx___20",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(expressSanitizer());

//Use passport functions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User Flash: site specific middleware  sets a currentUser check on every Route //returns user feedback
app.use(async function (req, res, next) {
  res.locals.currentUser = req.user;
  // if (req.user) {
  //   try {
  //     let group = req.user.judgingGroup;
  //     if ((req.user.assignedCategories = [])) {
  //       console.log(JudgeGroups[req.user.judgingGroup][0].letters);
  //     }
  //     await req.user.save();
  //   } catch (err) {
  //     console.log("assigned categories ERROR: ", err.message);
  //   }
  // }
  res.locals.isAdmin = req.isAdmin;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//Use routes
app.use(indexRoutes);
app.use(auth);
app.use(newItemRoutes);
app.use(rating);
app.use(ArtEntryCategoryPages);

//App listen
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
  console.log(`Server Started for prejuging app: ${port}`);
});
