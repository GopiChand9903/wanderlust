const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl, //this saveRedirectUrl is called to know the originalUrl from the req object. Because after login (passport.authenticate() invokes login) the req object resets and all info is lost. To stop that we called this middleware - it is in middleware.js
  passport.authenticate("local",
  {failureRedirect:"/login",failureFlash: true}),//this authenticate() invokes the req.login() in the /signup route.
  userController.login);// the parameter "local" is the strategy used
//there is no other logic required for the authentication of the user, coz we are using the "passport.authenticate()" method

router.get("/logout", userController.logout)

module.exports = router;
