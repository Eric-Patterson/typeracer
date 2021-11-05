const User = require("../models/users");

// renders the register form
module.exports.renderRegister = (req, res) => {
  res.render("register");
};

// registers the user
module.exports.register = async (req, res, next) => {
  // res.send(req.body)
  // We try catch this, with e.message it will flash the error message to the user and then redirect them back to the page
  try {
    // const newUser = new User(req.body);
    // await newUser.save();
    const { email, username, password } = req.body;
    // const currentLocation =
    const user = new User({ email, username });
    // this registers the user, hashes the password
    const registeredUser = await User.register(user, password);
    // we login the user that was created, and redirect them to /gyms with flashed message
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to the maze!");
      res.redirect("/start");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

// renders the login form
module.exports.renderLogin = (req, res) => {
  res.render("login");
};

// Logs in the user
module.exports.login = (req, res) => {
  // req.flash("success", "Welcome back!");
  // either we redirect to the session the user was trying to access to before login
  // if no session was trying to be accessed the user will be redirected to the homepage '/gyms'
  const redirectUrl = req.session.returnTo || "/";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// logs out the user
module.exports.logout = (req, res) => {
  // req.logout(); is a passport function that logs you out of their login middleware
  req.logout();
  // req.flash("success", "You have been logged out!");
  res.redirect("/start");
};
