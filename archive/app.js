var bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  express = require("express"),
  app = express();

//App config
mongoose.connect(
  "mongodb://localhost:27017/salon_prejudging_app",
  { useNewUrlParser: true, useUnifiedTopology: true },
  { useFindAndModify: false }
);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongoose model config

var artEntrySchema = new mongoose.Schema({
  category: String,
  title: String,
  image: String,
  medium: String,
  format: String,
  primaryAudience: String,
  description: String,
  audience: String,
  created: { type: Date, default: Date.now },
});

var artEntry = mongoose.model("ArtEntry", artEntrySchema);

// artEntry.create({
//   title: 'cell nucleus',
//   image: 'https://micro.magnet.fsu.edu/cells/nucleus/images/nucleusfigure1.jpg',
//   medium: 'photoshop',
//   fomat: 'painting',
//   audience: 'High School'
// });
// artEntry.create({
//   title: 'cell nucleus',
//   image: 'https://simonsfoundation.imgix.net/wp-content/uploads/2017/07/18141602/SF-Genomics.jpg',
//   medium: 'photoshop',
//   fomat: 'painting',
//   audience: 'High School'
// });
// artEntry.create({
//   title: 'cell nucleus',
//   image: 'https://www.niddk.nih.gov/media-assets/9465/9465_48450_thumbnail.jpg',
//   medium: 'photoshop',
//   fomat: 'painting',
//   audience: 'High School'
// });

//RESTful routes

app.get("/", function (req, res) {
  res.redirect("/artentries");
});

//INDEX route
app.get("/artentries", function (req, res) {
  artEntry.find({}, function (err, artentries) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { artentries, artentries });
    }
  });
});

//New route
app.get("/artentries/new", function (req, res) {
  res.render("new");
});

//CREATE route
app.post("/artentries", function (req, res) {
  //create entry
  artEntry.create(req.body.artentries, function (err, newEntry) {
    if (err) {
      res.render("/new");
    } else {
      res.redirect("/artentries");
    }
  });
});

//SHOW Routes
app.get("/artentries/:id", function (req, res) {
  artEntry.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log("redirect show route");
      res.redirect("/artentries");
    } else {
      res.render("show", { artentries: foundBlog });
    }
  });
});

//EDIT ROUTE
app.get("/artentries/:id/edit", function (req, res) {
  artEntry.findById(req.params.id, function (err, foundBlog) {
    if (err) {
      console.log("redirect id edit");
      res.redirect("/artentries");
    } else {
      res.render("edit", { artentries: foundBlog });
    }
  });
});

//Update route
app.put("/artentries/:id", function (req, res) {
  // (id, new data, callback )
  artEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function (
    err,
    foundBlog
  ) {
    if (err) {
      console.log("error");
      res.render("/");
    } else {
      res.redirect("/artentries/" + req.params.id);
    }
  });
});

//Destroy route
app.delete("/artentries/:id", function (req, res) {
  //destroy
  artEntry.deleteOne(req.params.id, function (err) {
    if (err) {
      res.redirect("/artentries");
    } else {
      console.log("Deleted entry");
      res.redirect("/artentries");
    }
  });
});

app.listen(3000 || process.env.PORT, process.env.IP, function () {
  console.log("Server Started for prejuging app");
});
