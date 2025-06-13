const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
   listing.reviews.push(newReview);
   await newReview.save();
   await listing.save();
   req.flash("success", "new review created");
    console.log("Saved to database");
   res.redirect(`/listings/${listing._id}`);//the listing is from the first line of the route.
};

module.exports.destroyReview = async(req,res)=>{
  let {id,reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: { reviews : reviewId}});//to remove the id of review from the listing database.
  await  Review.findByIdAndDelete(reviewId);
  req.flash("success", "review deleted");
  res.redirect(`/listings/${id}`);
};
