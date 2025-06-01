module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl; //this gets lost in when we log in because passport.autheticate() resets the req.session, so to stop that we write the middleware - saveRedirectUrl, then we export it and call it from the user.js, coz that's where the login route and the login route redirects to the correct route or renders correct page.
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");//return because the next() gets executed, which should not happen if not logged in, he needs to login, so we use return
  }
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

