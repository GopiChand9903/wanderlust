const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
  // console.log("Naa lisitngs");
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.createListing = async(req,res,next)=>{
  // let {title,description,image,price,country,location} = req.body;
  // let listing = req.body.listing;=====>>>>>//this gives us JAVASCRIPT Object but we need to change it to LISTING type, because our database is only able to store that//<<<<<<======
  // console.log(listing);
  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url+" " +filename);
  
  const newListing =  new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
  
};

module.exports.showListing = async(req,res)=>{
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
};

module.exports.renderEditForm = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
  let {id} = req.params;

  let listing = await Listing.findById(id);
  
  await Listing.findByIdAndUpdate(id,{...req.body.listing});//this is spreading operator and when we use this we copy the data if req.body.listing into another variable
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
  let delListing = await Listing.findByIdAndDelete(id);
  //this triggers the middleware written in "models/listing.js"
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};
