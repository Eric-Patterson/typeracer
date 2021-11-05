if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");

// Requires
// const prompt = require("prompt");
const mongoose = require("mongoose");
const User = require("./models/users");
const Post = require("./models/post");
const flash = require("connect-flash");
const parseurl = require("parseurl");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const ejsMate = require("ejs-mate");
// const random = require("./public/javascripts/maze.js");

// Routes
const userRoutes = require("./routes/user");

const secret = process.env.SECRET || "thisshouldbeabettersecret";

// EJS setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// creates DB
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/maze-runner";

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60, //24 hours * 60 minutes * 60 seconds
});

store.on("error", function (e) {
  console.log("Session store error, e");
});

const sessionConfig = {
  store, // store will now use mongo to store our information
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, //this cookie should only work over https
    // 1000 * 60 * 60 * 24 * 7 || 1000 miliseconds in a second, 60 seconds in a minute, 60 minutes in an hour, 24 hours in a day, 7 days a week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  // currentpage: parseurl(req).pathname,
};

// middleware
app.use(express.urlencoded({ extended: true }));
// app.use("/views", express.static(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionConfig));
app.use(flash());

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  useUnifiedTopology: true,
  //   useFindAndModify: false,
});

// confirms database is connected
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// passport info

app.use(passport.initialize());
app.use(passport.session());
// Below we are saying: Password please user localstrategy that we have downloaded and required.
// For the local strategy use the usermodel and its called authenticate || We never set one up although local-passport-mongoose set one up for us
passport.use(new LocalStrategy(User.authenticate()));

// passport is telling how to serialize a user. Serialize = how do we store a user in the session
passport.serializeUser(User.serializeUser());
// How do we get a user out of the session - to deserialize that user
passport.deserializeUser(User.deserializeUser());

// ========================= logged in middleware ======================
// User logged in??
app.use((req, res, next) => {
  // we will have access to all these in all templates
  // currentUser will be used to hide/show stuff when logged in or not
  res.locals.currentUser = req.user;
  next();
});

// =================================== ROUTES ==========================
// Start game here
app.use("/", userRoutes);

app.get("/", (req, res) => {
  if ((res.locals.currentUser = req.user)) {
    let { username } = req.user;
    res.render("start", { username });
    // res.render("start", { data });
  } else {
    res.render("index");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

// save to database
app.post("/leaderboard", async (req, res, next) => {
  let timer = req.body.timer;
  let wpm = req.body.wordspm;
  let error = req.body.error;
  // console.log(`${timer} timer`);
  // console.log(`${wpm} wpm`);
  // console.log(`${error} error`);

  const user = req.user;

  await User.findByIdAndUpdate(user._id, {
    wordsPerMinute: wpm,
    time: timer,
    error: error,
  });
  // User.find({}, function (err, user) {
  //   res.render("leaderboard", {
  //     user: user,
  //     wordsPerMinute: wpm,
  //     time: timer,
  //     error: error,
  //   });
  // });

  // let posts = await Post.find();
  // console.log(posts);

  // console.log(db.collections.posts);
  // console.log(db.posts.find());

  // res.render("leaderboard", { user });

  res.redirect("start");

  // res.render("leaderboard");
  // await User.findByIdAndUpdate(user._id, {
  //   wordsPerMinute: wpm,
  // });
  // user.save();
  // console.log(user);
  // console.log(User(user._id, { currentLocation }));

  // await User.findByIdAndUpdate(user._id, {
  //   currentLocation: parseurl(req).pathname,
  // });
  // user.save();
  // console.log(user);
  // console.log(User(user._id, { currentLocation }));
  // next();

  // finds the user using the session
  // console.log(req.session.passport.user); <--- bad version
  // console.log(res.locals.currentUser.username);
  // const user = req.user;
  // console.log(user);
});

app.get("/leaderboardShow", async (req, res) => {
  const users = await User.find({});
  // console.log(user);

  res.render("leaderboardShow", { users });
});

app.get("/start", (req, res) => {
  if ((res.locals.currentUser = req.user)) {
    // res.render("start", { randomItem }, console.log(randomItem));
    let { username } = req.user;
    res.render("start", { username });
    // res.render("start", { data });
  } else {
    res.redirect("/signup");
  }
});

// ignore these files for route tracking
function ignores(req, res, next) {
  public = ["images", "javascripts", "stylesheets", "favicon.ico"];

  if (public.indexOf(req.params.name) != -1) {
    console.log("Ignoring static file: #{req.params.name}/#{req.params.group}");
    next("route");
  } else next();
}

app.use(ignores);

app.get("/reset", (req, res) => {
  res.send("session destroyed");
  req.session.destroy(function (err) {
    // cannot access session here
  });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

// app.listen(3000, () => {
//   console.log("Serving on port 3000");
// });

// find where user is on website
// async function filepath(req, res, next) {
//   const user = req.user;

//   await User.findByIdAndUpdate(user._id, {
//     currentLocation: parseurl(req).pathname,
//   });
//   // user.save();
//   // console.log(user);
//   // console.log(User(uder._id, { currentLocation }));
//   next();
// }

// app.get("/route-a/first", ignores, filepath, (req, res) => {
//   // res.render("start");
//   res.render("route-a/first");

//   // console.log(req.session.views);

//   // console.log(parseurl(req).pathname);
//   // console.log(
//   //   "you viewed this page " + req.session.views["/route-a/first"] + " times"
//   // );
// });
// app.get("/route-b/first", ignores, filepath, (req, res) => {
//   // res.render("start");
//   res.render("left/first");

//   // const currentpage = [];
//   // currentpage.push(parseurl(req).pathname);
//   // console.log(currentpage);
// });

// Chance to get lost and start from start
// function lost(req, res, next) {
//   numberGen = Math.floor(Math.random() * 10) + 1;
//   if (numberGen <= 7) {
//     console.log("player safe");
//   } else {
//     // console.log("You got lost and now have to start over");
//     return res.redirect("/startover"), console.log("error", numberGen);
//   }
//   next();
// }

// ===================== Right - Path 1 ==========================

// make the buttons show and hide based on how they were pressed
// app.post("/right/first", ignores, filepath, (req, res) => {
//   res.render("right/first");
// });

// // --------------------Right Path 2--------------------------------
// app.post("/right/second", lost, ignores, filepath, (req, res) => {
//   res.render("right/second");
// });

// // ----------------------Right Path 3---------------------------------
// app.post("/right/third", lost, ignores, filepath, (req, res) => {
//   res.render("right/third");
// });

// // ===================== Left Turn (Safe) ==========================
// app.post("/left/first", ignores, filepath, (req, res) => {
//   res.render("left/first");
// });

// // ---------------- Start over -----------------
// app.get("/startover", ignores, filepath, async (req, res) => {
//   let { username } = req.user;
//   res.render("startover", { username });
// });
// // --------------------------- ERROR MIDDLEWARE ------------------------
// 404 message for page not found
// app.all("*", (req, res, next) => {
//   // res.send('404!!!!')
//   next(new ExpressError("Page Not Found", 404));
// });

// app.use((err, req, res, next) => {
//   // destructuring the err message that went thru below
//   const { status = 500, message = "Something went wrong" } = err;
//   res.status(status).send(message);
// });
