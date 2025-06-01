const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing:Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("",null),
  })
  .required(),

})// this kind "module.exports.listingSchema" of writing is equivalent to writing module.exports = {listingSchema}; by doing this we are exporting an object, listingSchema is a JOI OBJECT.

//atlast ".required()" is for listing, that is there must be listing along with all the fields. Only then it approves of the listing and it lets us store in the database.

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required()
})