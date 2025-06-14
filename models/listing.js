const mongoose = require("mongoose");//we need to require mongoose coz we are defining a schema of a mongo database..
const Schema = mongoose.Schema;//Schema endukante in place of (1 -- look down 6th line) you need to use mongoose.Schema(),so we are storing that in a variable..

const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({//(1)
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    url: String,
    filename: String,
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  country:{
    type:String,
    required:true
  },
  reviews:[{
    type: Schema.Types.ObjectId,
    ref: "Review",
}],//this reviews is and array says [], the array consists of objectId.
//which are referring ro Review collection in the database says ref. 
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing)
    await Review.deleteMany({_id : {$in : listing.reviews}});
})
 
const Listing = mongoose.model("Listing",listingSchema);//Listing anedhi database lo collection peru, const Listing is a variable that we use to interact with database (or) perform operation through code.......
// Explanation:
// mongoose.model():

// This function is used to create a Model in Mongoose. A Model is a wrapper around a MongoDB collection that allows you to interact with the data in that collection.
// It maps the schema you define to a specific collection in the MongoDB database.
// Parameters of mongoose.model():

// "Listing":
// This is the name of the Model. It is conventionally singular and capitalized.
// Mongoose will look for a collection in the database with the plural form of this name (e.g., "listings" for "Listing"). If it doesn't exist, Mongoose will create it when you start inserting data.
// listingSchema:
// This is the schema object that defines the structure of the documents in the "listings" collection.
// The schema specifies fields, their data types, and optionally, constraints or validation rules.
// const Listing:

// This creates a variable (Listing) that holds the Model. You use this variable to interact with the collection.
// With this Model, you can perform CRUD (Create, Read, Update, Delete) operations on the collection.

module.exports = Listing;