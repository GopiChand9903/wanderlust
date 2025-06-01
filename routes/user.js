const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// The below one is async request as we are changing things in the data base.
router.post("/signup", wrapAsync(async (req, res, next) => {
  try{
    let {username, email, password} = req.body;
    let newUser = new User({email, username});
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if(err){
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");//we wrote this because the error msg is displayed in random page. So, we catched the error, flash it and then redirect it to /signup.
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// the parameter "local" is the strategy used
//there is no other logic for the authentication of the user we are using the "passport.authenticate()" method
router.post("/login", 
  saveRedirectUrl, 
  passport.authenticate("local",
  {failureRedirect:"/login",failureFlash: true}),
  async(req, res) => {
  // res.send("Welcome to WanderLust, You are logged in");
  req.flash("success", "You are logged in succesfully to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings"; //we wrote this coz the res.locals.redirectUrl only present if there is an originalUrl, but when we dont go on a path like /edit, /new, /delete.., the originalUrl is empty and our basic thing is give them convinience so we just redirects it to "/listings".
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out successfully!");
    res.redirect("/listings");
  })
})

module.exports = router;
