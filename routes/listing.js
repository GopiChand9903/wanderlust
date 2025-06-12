const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");//joi listing schema
const Listing = require("../models/listing.js");//this listing.js consists is a schema. 
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");



//INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

//new route ===== we kept it above show route coz new is percieved as id of show route and show is searching for it. so we kept it above the show route//
router.get("/new", isLoggedIn, listingController.renderNewForm);

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

//EDIT route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

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