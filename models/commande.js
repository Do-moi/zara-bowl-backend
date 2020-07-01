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
  userCommande: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
var commandeModel = mongoose.model("commande", commandeSchema);

module.exports = commandeModel;
