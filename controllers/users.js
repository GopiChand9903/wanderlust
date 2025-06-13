const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try{
    let {username, email, password} = req.body;
    let newUser = new User({email, username});
    let registeredUser = await User.register(newUser, password);//register anedhi it comes from passport
    console.log(registeredUser);

    //the login is invoked by passport.autheticate() automatically.
    req.login(registeredUser, (err) => {//login also comes from the passport
      if(err){
        return next(err);//it calls the express default error handler
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");//we wrote this because the error msg is displayed in random page. So, we catched the error, flash it and then redirect it to /signup.
  }
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
  // res.send("Welcome to WanderLust, You are logged in");
  req.flash("success", "You are logged in succesfully to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings"; //we wrote this coz the res.locals.redirectUrl only present if there is an originalUrl, but when we dont go on a path like /edit, /new, /delete.., the originalUrl is empty and our basic thing is give them convinience so we just redirects it to "/listings".
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out successfully!");
    res.redirect("/listings");
  })
};