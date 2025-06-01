const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");//joi review schema
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview =(req,res,next)=> {
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


//Reviews
//POST REVIEW ROUTE
router.post("/",validateReview,wrapAsync(async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success", "new review created");
    console.log("Saved to database");
   res.redirect(`/listings/${listing._id}`);//the listing is from the first line of the route.
}));

//Delete Review Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: { reviews : reviewId}});//to remove the id of review from the listing database.
  await  Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted");
  res.redirect(`/listings/${id}`);
}))
    
module.exports = router;