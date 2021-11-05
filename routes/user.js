const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");

const users = require("../controllers/user");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

// renders the register form
// router.get('/register', users.renderRegister);
// registers the user
// router.post('/register', catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// renders the login form
// router.get('/login', users.renderLogin)
// Logs in the user
// passport comes with their own authentication middleware.
// using this middleware we authentiate the local,
// here are the options, if there is a failure redirect to local
// router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// logs out the user
router.get("/logout", users.logout);

module.exports = router;
