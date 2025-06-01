const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
  console.log("Connected to wanderlust");
})
.catch((err)=>{console.log("Not connected wanderlust");});

async function main(){
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: '6839a1bd0813864f9e5e9151'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}
initDB(); 