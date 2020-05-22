var mongoose = require("mongoose");
var commandeSchema = mongoose.Schema({
  brand: String,
  name: String,
  img: String,
  date: String,
  qte: Number,
  poids: String,
  price: Number,
  nom: String,
  prenom: String,
  adresse: String,
  telephone: String,
  postal: String,
  ville: String,
});

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
  commande: [commandeSchema],
});

var userModel = mongoose.model("user", userSchema);

module.exports = userModel;
