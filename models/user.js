const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
  }
});

userSchema.plugin(passportLocalMongoose);//In userSchema we are not giving username because passport-local-mongoose can create its own username and hash, salt the password and then store it. The hashed password and the salt value are also stored.

module.exports = mongoose.model('User', userSchema);