const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
  console.log("Connected to wanderlust");
})
.catch((err)=>{console.log("Not connected wanderlust");});

async function main(){
  await mongoose.connect("mongodb+srv://gopichandsudhati:Peeqvegs9ziKPEnM@cluster0.z3gp0m0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

const initDB = async()=>{
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: '6860bf8a20667309df1bb0c7', geometry:{ type: "Point", coordinates: [78.312,15.324] }}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
}
initDB(); 