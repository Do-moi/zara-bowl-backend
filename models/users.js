var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  nom: String,
  prenom: String,
  telephone: String,
  email: String,
  password: String,
  adresse: String,
  postal: String,
  ville: String,
  salt: String,
  token: String,
});

var userModel = mongoose.model("user", userSchema);

module.exports = userModel;
