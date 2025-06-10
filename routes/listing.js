const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");//joi listing schema
const Listing = require("../models/listing.js");//this listing.js consists is a schema. 
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");



//INDEX ROUTE
router.get("/",wrapAsync(async(req,res)=>{
  // console.log("Naa lisitngs");
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs",{allListings});
}));

//new route ===== we kept it above show route coz new is percieved as id of show route and show is searching for it. so we kept it above the show route//
router.get("/new", isLoggedIn, (req,res)=>{
  res.render("listings/new.ejs");
});

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async(req,res,next)=>{
  // let {title,description,image,price,country,location} = req.body;
  // let listing = req.body.listing;=====>>>>>//this gives us JAVASCRIPT Object but we need to change it to LISTING type, because our database is only able to store that//<<<<<<======
  // console.log(listing);
  
  const newListing =  new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
  
}));

//SHOW ROUTE
router.get("/:id", wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews", populate:({
    path: "author",
  }),}).populate("owner");//populate is used here because we need to get the data related to the reviews that are associated with the listing .. Even though you're storing the owner ID, Mongoose .populate("owner") is needed to replace that ID with the full user document from the User collection.


  if(!listing){
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{listing});
}));

//EDIT route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, validateListing,wrapAsync(async(req,res)=>{
  let {id} = req.params;

  let listing = await Listing.findById(id);
  
  await Listing.findByIdAndUpdate(id,{...req.body.listing});//this is spreading operator and when we use this we copy the data if req.body.listing into another variable
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
}));

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  //this triggers the middleware written in "models/listing.js"
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
}));

module.exports = router;


// app.get("/testListing",async (req,res)=>{
//   let sampleListing = new Listing({
//     title:"naa kotha villa",
//     description:"Baguntadi",
//     image:"",
//     price:120000,
//     location:"Palaigudem",
//     country:"India",
//   })

//   await sampleListing.save().then(()=>{
//     console.log("save aindi ra baabu");
//   });
//   res.send("Save succesful");
// });