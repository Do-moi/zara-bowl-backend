var mongoose = require("mongoose");
var listSchema = mongoose.Schema({
  brand: String,
  name: String,
  img: String,
  imgCore: String,
  date: String,
  desc: String,
  core: String,
  coverstock: String,
  flare: String,
  performance: String,
  condition: String,
  color :String,
  differential : String,
  finish: String,
  masse_bias: String,
  rg: String,
  reaction: String,
  price: Number,
});

var ballSchema = mongoose.Schema({
  brand: String,
  list: [listSchema],
});

var ballModel = mongoose.model("ball", ballSchema);

module.exports = ballModel;


