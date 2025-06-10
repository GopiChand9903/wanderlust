const Listing = require("./models/listing.js");
const Review = require("./models/review.js")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");//joi listing schema


module.exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl; //this gets lost in when we log in because passport.autheticate() resets the req.session, so to stop that we write the middleware - saveRedirectUrl, then we export it and call it from the user.js, coz that's where the login route and the login route redirects to the correct route or renders correct page.
    // The login route itself has a different URL.After the user is redirected to /login, req.originalUrl becomes /login.The original request, like /listings/new, is now lost in the current request. So, we store it in the res.session.redirectUrl.
    req.flash("error", "You must be logged in to create a listing");
    return res.redirect("/login");//return because the next() gets executed, which should not happen if not logged in, he needs to login, so we use return the control from here to the origin.this redirect statement goes to app.js there it just finds the userRouter - "/", then the login page comes in
  } 
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req, res, next) => {

  let {id} = req.params;

  let listing = await Listing.findById(id);
  if(!(listing.owner._id.equals(res.locals.currUser._id))){
    req.flash("error", "You are not authorized to edit the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next)=> {
  let {error} = listingSchema.validate(req.body);//this validates the request body and returns something and we are extracting error from that
  // console.log(result);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.validateReview =(req,res,next)=> {
  let {error} = reviewSchema.validate(req.body);//this validates the request body and returns something and we extracting error from that
  // console.log(result);
  // console.log(error);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req, res, next) => {

  let {id, reviewId} = req.params;

  let review = await Review.findById(reviewId);
  if(!(review.author._id.equals(res.locals.currUser._id))){
    req.flash("error", "You are not authorized to delete the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}