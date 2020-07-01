var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var commandeModel = require("../models/commande");
var ballModel = require("../models/ball");
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");

var stripe = require("stripe")("sk_test_ZY8sZa9vQGzDbX48Nahzt3Ey00nSD58inI");

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express!!!!!!!!!",
  });
});
// =========================================/sign-up=============================================

router.post("/sign-up", async function (req, res, next) {
  var body = req.body;
  var error = [];
  var reponseSave = false;
  var userToken;

  // ===================================var test password===============================================
  var passwordNB = false;
  var upperCase = false;
  var lowerCase = false;
  var caracteres = false;
  // ===================================var test telephone===============================================

  var telephoneLetter = false;
  var telCt = false;
  // =====================================var test email===================================================

  var testEmail = false;
  // ==================================var test nom======================================================
  var testNomCaractere = false;
  var testNomLettre = false;
  var nomNB = false;
  // ==================================var test prenom=======================================================
  var testPrenomCaractere = false;
  var testPrenomLettre = false;
  var testPrenomNb = false;
  // ==================================var test postal=======================================================
  var testPostalCaracters = false;
  var testPostalLetter = false;
  // ==================================var test ville==========================================================
  var testVilleCaracters = false;
  var testVilleNB = false;

  // ====================================condition champs vides=======================
  if (
    body.nom == "" ||
    body.prenom == "" ||
    body.telephone == "" ||
    body.email == "" ||
    body.password == "" ||
    body.adresse == "" ||
    body.ville == "" ||
    body.postal == ""
  ) {
    error.push("champs vides");
  }
  // ========================================condition nom===========================

  var regexNom = /[^A-Za-z0-9_]/;
  var testNom = regexNom.test(body.nom);

  if (testNom == true) {
    testNomCaractere = true;
  }
  var regexNom1 = /[0-9]/;
  var testNom1 = regexNom1.test(body.nom);

  if (testNom1 == true) {
    nomNB = true;
  }

  var regexNom2 = /[A-Za-z]/;
  var testNom2 = regexNom2.test(body.nom);
  if (testNom2 == true) {
    testNomLettre = true;
  }
  if (body.nom.length < 2) {
    error.push("le nom doit comporter au moins 2 lettres");
  }

  if (testNomCaractere == true || nomNB == true || testNomLettre == false) {
    error.push("le nom doit comporter que des lettres");
  }

  // =============================================condition prenom==========================================

  var regexPrenom = /[^A-Za-z0-9_]/;
  var testPrenom = regexPrenom.test(body.prenom);

  if (testPrenom == true) {
    testPrenomCaractere = true;
  }
  var regexPrenom1 = /[0-9]/;
  var testPrenom1 = regexPrenom1.test(body.prenom);

  if (testPrenom1 == true) {
    testPrenomNb = true;
  }

  var regexPrenom2 = /[A-Za-z]/;
  var testPrenom2 = regexPrenom2.test(body.prenom);

  if (testPrenom2 == true) {
    testPrenomLettre = true;
  }
  if (body.prenom.length < 2) {
    error.push("le prenom doit comporter au moins 2 lettres");
  }

  if (
    testPrenomCaractere == true ||
    testPrenomNb == true ||
    testPrenomLettre == false
  ) {
    error.push("le prenom doit comporter que des lettres");
  }

  // ===============================================condition password===================

  if (body.password.length < 8) {
    error.push("mot de passe minimum 8 caractères");
  }
  var regexUpperCase = /[A-Z]/;
  var findUpperCase = regexUpperCase.test(body.password);

  if (findUpperCase == true) {
    upperCase = true;
  }
  var regexLowerCase = /[a-z]/;
  var findLowerCase = regexLowerCase.test(body.password);

  if (findLowerCase == true) {
    lowerCase = true;
  }

  var regex = /[0-9]/;
  var testNB = regex.test(body.password);

  if (testNB == true) {
    passwordNB = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.password);

  if (testCaracteres == true) {
    caracteres = true;
  }

  if (upperCase == false) {
    error.push("mot de passe minimum 1 majuscule ");
  } else if (passwordNB == false) {
    error.push("mot de passe minimum 1 chiffre");
  } else if (lowerCase == false) {
    error.push("mot de passe minimum 1 minuscule ");
  } else if (caracteres == false) {
    error.push("mot de passe minimun 1 caractère spécial");
  }
  // ==============================================condition numero telephone==========================

  if (body.telephone.length != 10) {
    error.push("le numéro de téléphone doit comporter 10 chiffres");
  }
  var regexLetter = /[A-Za-z]/;
  var testLetter = regexLetter.test(body.telephone);

  if (testLetter == true) {
    telephoneLetter = true;
  }

  var regexCt = /[^A-Za-z0-9_]/;
  var testCt = regexCt.test(body.telephone);

  if (testCt == true) {
    telCt = true;
  }

  if (telephoneLetter == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }
  if (telCt == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }

  // ==============================condition email=============================

  var regexEmail = /@/;
  var findRegexEmail = regexEmail.test(body.email);

  if (findRegexEmail == true) {
    testEmail = true;
  }
  if (testEmail == false) {
    error.push("format email incorrect");
  }

  // ========================================condition adresse===============================

  if (body.adresse.length < 8) {
    error.push("l'adresse doit avoir au moins 8 caractères");
  }
  //===========================================condition code postal===============================

  if (body.postal.length != 5) {
    error.push("code postal incorrect");
  }
  var regexPostalCt = /[^A-Za-z0-9_]/;
  var testPostalCt = regexPostalCt.test(body.postal);

  if (testPostalCt == true) {
    testPostalCaracters = true;
  }
  var regexPostalLetter = /[A-Za-z]/;
  var testPostalLT = regexPostalLetter.test(body.postal);

  if (testPostalLT == true) {
    testPostalLetter = true;
  }

  if (testPostalCaracters == true || testPostalLetter == true) {
    error.push("le code postal doit contenir que des chiffres");
  }
  // ============================condition ville============================

  var regexVilleCt = /[^A-Za-z0-9_]/;
  var testVilleCt = regexVilleCt.test(body.ville);

  if (testVilleCt == true) {
    testVilleCaracters = true;
  }
  var regexVilleNB = /[0-9]/;
  var testVilleNumber = regexVilleNB.test(body.ville);

  if (testVilleNumber == true) {
    testVilleNB = true;
  }
  if (testVilleCaracters == true || testVilleNB == true) {
    error.push("la ville doit avoir que des lettres");
  }

  //=========================================condition d'enregistrement user================================

  if (error.length == 0) {
    var userFind = await UserModel.findOne({
      nom: req.body.nom,
      email: req.body.email,
    });
    if (userFind == null) {
      var salt = uid2(32);
      var token = uid2(32);
      var hashPassword = SHA256(req.body.password + salt).toString(encBase64);

      var newUser = await new UserModel({
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        email: req.body.email,
        password: hashPassword,
        adresse: req.body.adresse,
        postal: req.body.postal,
        ville: req.body.ville,
        salt: salt,
        token: token,
      });

      var userSave = await newUser.save();
    }
    if (userFind) {
      userSearch = true;
    } else {
      userToken = userSave.token;
    }

    if (userSave) {
      reponseSave = true;
    } else {
      error.push("utilisateur déjà enregistré");
    }
  }

  res.json({
    reponseSave,
    userToken,
    error,
  });
});

// ===========================================/sign-in==============================================

router.post("/sign-in", async function (req, res, next) {
  var body = req.body;
  var error = [];
  var findUser = false;
  var testEmail = false;
  var token = null;
  var profilUser;
  // ===================================var test password===============================================
  var passwordNB = false;
  var upperCase = false;
  var lowerCase = false;
  var caracteres = false;
  // =============================champs vides======================================
  if (body.email == "" || body.password == "") {
    error.push("champs vides");
  }
  // =======================================condition email===============================
  var regexEmail = /@/;
  var findRegexEmail = regexEmail.test(body.email);

  if (findRegexEmail == true) {
    testEmail = true;
  }
  if (testEmail == false) {
    error.push("format email incorrect");
  }
  // ===============================================condition password===================

  if (body.password.length < 8) {
    error.push("mot de passe minimum 8 caractères");
  }
  var regexUpperCase = /[A-Z]/;
  var findUpperCase = regexUpperCase.test(body.password);

  if (findUpperCase == true) {
    upperCase = true;
  }
  var regexLowerCase = /[a-z]/;
  var findLowerCase = regexLowerCase.test(body.password);

  if (findLowerCase == true) {
    lowerCase = true;
  }

  var regex = /[0-9]/;
  var testNB = regex.test(body.password);

  if (testNB == true) {
    passwordNB = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.password);

  if (testCaracteres == true) {
    caracteres = true;
  }

  if (upperCase == false) {
    error.push("mot de passe minimum 1 majuscule ");
  } else if (passwordNB == false) {
    error.push("mot de passe minimum 1 chiffre");
  } else if (lowerCase == false) {
    error.push("mot de passe minimum 1 minuscule ");
  } else if (caracteres == false) {
    error.push("mot de passe minimun 1 caractère spécial");
  }
  // ========================================findUser==================================
  if (error.length == 0) {
    const userFind = await UserModel.findOne({
      email: req.body.email,
    });

    if (userFind) {
      var hash = SHA256(req.body.password + userFind.salt).toString(encBase64);
      if (hash === userFind.password) {
        result = true;
        token = userFind.token;

        profilUser = {
          nom: userFind.nom,
          prenom: userFind.prenom,
          telephone: userFind.telephone,
          email: userFind.email,
          adresse: userFind.adresse,
          postal: userFind.postal,
          ville: userFind.ville,
          commande: userFind.commande,
        };

        findUser = true;
      } else {
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("email incorrect");
    }
  }
  res.json({
    error,
    findUser,
    token,
    profilUser,
  });
});

// ========================================/commande===========================================

router.post("/commande", async function (req, res, next) {
  var date = new Date();

  var jour = date.getDate();
  var mois = date.getMonth() + 1;
  var annee = date.getFullYear();

  var cmd = req.body.commandeId[2].ball;
  var idUser = req.body.commandeId[0];
  var idLivraison = req.body.commandeId[1];

  var total = 0;

  cmd.map((ball, i) => {
    total = parseInt(ball.price, 10) * parseInt(ball.theQuantite) + total;
  });

  var charge = await stripe.charges.create({
    amount: total * 100,
    currency: "eur",
    description: "zara bowl charge",
    source: req.body.token,
  });

  if (charge.status === "succeeded") {
    cmd.map(async (ball, i) => {
      const findIdUser = await UserModel.findOne({ token: idUser });

      const newCmd = await new commandeModel({
        brand: ball.brand,
        name: ball.name,
        img: ball.img,
        date: jour + "/" + mois + "/" + annee,
        qte: parseInt(ball.theQuantite, 10),
        poids: ball.thePoids,
        price: parseInt(ball.price, 10),
        nom: idLivraison.nom,
        prenom: idLivraison.prenom,
        adresse: idLivraison.adresse,
        postal: idLivraison.postal,
        ville: idLivraison.ville,
        telephone: idLivraison.tel,
        userCommande: findIdUser._id,
      });
      var cmdSave = await newCmd.save();
    });

    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
});
// =====================================================/profil===========================================

router.post("/profil", async function (req, res, next) {
  var profilUser;
  var tabCommande = [];
  // console.log("================req.body.token", req.body.token);
  var userFind = await UserModel.findOne({
    token: req.body.token,
  });
  var userCommande = await commandeModel.find({ userCommande: userFind._id });
  // console.log("============userCommande", userCommande);

  userCommande.map((commande, i) => {
    var cmd = {
      brand: commande.brand,
      name: commande.name,
      img: commande.img,
      date: commande.date,
      qte: commande.qte,
      poids: commande.poids,
      price: commande.price,
      nom: commande.nom,
      prenom: commande.prenom,
      adresse: commande.adresse,
      postal: commande.postal,
      ville: commande.ville,
      telephone: commande.telephone,
    };
    tabCommande.push(cmd);
  });

  // console.log("=============tabCommande", tabCommande);
  profilUser = {
    nom: userFind.nom,
    prenom: userFind.prenom,
    email: userFind.email,
    telephone: userFind.telephone,
    adresse: userFind.adresse,
    postal: userFind.postal,
    ville: userFind.ville,
    commande: tabCommande,
  };

  res.json({
    profilUser,
  });
});

// ==============================================/updateUser============================================

router.put("/updateUser", async function (req, res, next) {
  var body = req.body;
  var error = [];
  var result = false;
  var findUser;

  // =====================================var test old password===============================================
  var passwordNB = false;
  var upperCase = false;
  var lowerCase = false;
  var caracteres = false;
  // =====================================var test new password============================================
  var newPasswordUpperCase = false;
  var newPasswordLowerCase = false;
  var newPasswordNB = false;
  var newPasswordCaracteres = false;
  // =====================================var test telephone===============================================

  var telephoneLetter = false;
  var telCt = false;
  // ======================================var test email===================================================

  var testEmail = false;
  // =======================================var test nom======================================================
  var testNomCaractere = false;
  var testNomLettre = false;
  var nomNB = false;
  // =======================================var test prenom=======================================================
  var testPrenomCaractere = false;
  var testPrenomLettre = false;
  var testPrenomNb = false;
  // ========================================var test postal=======================================================
  var testPostalCaracters = false;
  var testPostalLetter = false;
  // ========================================var test ville==========================================================
  var testVilleCaracters = false;
  var testVilleNB = false;

  // ===========================condition champs vides=======================
  if (
    body.nom == "" ||
    body.prenom == "" ||
    body.telephone == "" ||
    body.email == "" ||
    body.password == "" ||
    body.newPassword == "" ||
    body.adresse == "" ||
    body.ville == "" ||
    body.postal == ""
  ) {
    error.push("champs vides");
  }
  // ============================condition nom===========================

  var regexNom = /[^A-Za-z0-9_]/;
  var testNom = regexNom.test(body.nom);

  if (testNom == true) {
    testNomCaractere = true;
  }
  var regexNom1 = /[0-9]/;
  var testNom1 = regexNom1.test(body.nom);

  if (testNom1 == true) {
    nomNB = true;
  }

  var regexNom2 = /[A-Za-z]/;
  var testNom2 = regexNom2.test(body.nom);
  if (testNom2 == true) {
    testNomLettre = true;
  }
  if (body.nom.length < 2) {
    error.push("le nom doit comporter au moins 2 lettres");
  }

  if (testNomCaractere == true || nomNB == true || testNomLettre == false) {
    error.push("le nom doit comporter que des lettres");
  }

  // ============================condition prenom==========================================

  var regexPrenom = /[^A-Za-z0-9_]/;
  var testPrenom = regexPrenom.test(body.prenom);

  if (testPrenom == true) {
    testPrenomCaractere = true;
  }
  var regexPrenom1 = /[0-9]/;
  var testPrenom1 = regexPrenom1.test(body.prenom);

  if (testPrenom1 == true) {
    testPrenomNb = true;
  }

  var regexPrenom2 = /[A-Za-z]/;
  var testPrenom2 = regexPrenom2.test(body.prenom);

  if (testPrenom2 == true) {
    testPrenomLettre = true;
  }
  if (body.prenom.length < 2) {
    error.push("le prenom doit comporter au moins 2 lettres");
  }

  if (
    testPrenomCaractere == true ||
    testPrenomNb == true ||
    testPrenomLettre == false
  ) {
    error.push("le prenom doit comporter que des lettres");
  }

  // ================================================condition password===================

  if (body.password.length < 8) {
    error.push("mot de passe minimum 8 caractères");
  }
  var regexUpperCase = /[A-Z]/;
  var findUpperCase = regexUpperCase.test(body.password);

  if (findUpperCase == true) {
    upperCase = true;
  }
  var regexLowerCase = /[a-z]/;
  var findLowerCase = regexLowerCase.test(body.password);

  if (findLowerCase == true) {
    lowerCase = true;
  }

  var regex = /[0-9]/;
  var testNB = regex.test(body.password);

  if (testNB == true) {
    passwordNB = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.password);

  if (testCaracteres == true) {
    caracteres = true;
  }

  if (upperCase == false) {
    error.push("mot de passe minimum 1 majuscule ");
  } else if (passwordNB == false) {
    error.push("mot de passe minimum 1 chiffre");
  } else if (lowerCase == false) {
    error.push("mot de passe minimum 1 minuscule ");
  } else if (caracteres == false) {
    error.push("mot de passe minimun 1 caractère spécial");
  }
  //  ==============================================condition nouveau password===========================
  if (body.newPassword.length < 8) {
    error.push("nouveau mot de passe minimum 8 caractères");
  }
  var regexUpperCase = /[A-Z]/;
  var findUpperCase = regexUpperCase.test(body.newPassword);

  if (findUpperCase == true) {
    newPasswordUpperCase = true;
  }
  var regexLowerCase = /[a-z]/;
  var findLowerCase = regexLowerCase.test(body.newPassword);

  if (findLowerCase == true) {
    newPasswordLowerCase = true;
  }

  var regex = /[0-9]/;
  var testNB = regex.test(body.newPassword);

  if (testNB == true) {
    newPasswordNB = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.newPassword);

  if (testCaracteres == true) {
    newPasswordCaracteres = true;
  }

  if (newPasswordUpperCase == false) {
    error.push("le nouveau mot de passe minimum 1 majuscule ");
  } else if (newPasswordNB == false) {
    error.push("le nouveau mot de passe minimum 1 chiffre");
  } else if (newPasswordLowerCase == false) {
    error.push("le nouveau mot de passe minimum 1 minuscule ");
  } else if (newPasswordCaracteres == false) {
    error.push("le nouveau mot de passe minimun 1 caractère spécial");
  }
  // ==============================================condition numero telephone==========================

  if (body.telephone.length != 10) {
    error.push("le numéro de téléphone doit comporter 10 chiffres");
  }
  var regexLetter = /[A-Za-z]/;
  var testLetter = regexLetter.test(body.telephone);

  if (testLetter == true) {
    telephoneLetter = true;
  }

  var regexCt = /[^A-Za-z0-9_]/;
  var testCt = regexCt.test(body.telephone);

  if (testCt == true) {
    telCt = true;
  }

  if (telephoneLetter == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }
  if (telCt == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }

  // ==============================condition email=============================

  var regexEmail = /@/;
  var findRegexEmail = regexEmail.test(body.email);

  if (findRegexEmail == true) {
    testEmail = true;
  }
  if (testEmail == false) {
    error.push("format email incorrect");
  }

  // ========================================condition adresse===============================

  if (body.adresse.length < 8) {
    error.push("l'adresse doit avoir au moins 8 caractères");
  }
  //===========================================condition code postal===============================

  if (body.postal.length != 5) {
    error.push("code postal incorrect");
  }
  var regexPostalCt = /[^A-Za-z0-9_]/;
  var testPostalCt = regexPostalCt.test(body.postal);

  if (testPostalCt == true) {
    testPostalCaracters = true;
  }
  var regexPostalLetter = /[A-Za-z]/;
  var testPostalLT = regexPostalLetter.test(body.postal);

  if (testPostalLT == true) {
    testPostalLetter = true;
  }

  if (testPostalCaracters == true || testPostalLetter == true) {
    error.push("le code postal doit contenir que des chiffres");
  }
  // ============================condition ville============================

  var regexVilleCt = /[^A-Za-z0-9_]/;
  var testVilleCt = regexVilleCt.test(body.ville);

  if (testVilleCt == true) {
    testVilleCaracters = true;
  }
  var regexVilleNB = /[0-9]/;
  var testVilleNumber = regexVilleNB.test(body.ville);

  console.log("============testVilleNumber", testVilleNumber);
  if (testVilleNumber == true) {
    testVilleNB = true;
  }
  if (testVilleCaracters == true || testVilleNB == true) {
    error.push("la ville doit avoir que des lettres");
  }

  if (error.length == 0) {
    var userFind = await UserModel.findOne({ token: body.token });
    if (userFind) {
      var hash = SHA256(body.password + userFind.salt).toString(encBase64);
      if (hash === userFind.password) {
        result = true;
        var salt = uid2(32);
        var newHash = SHA256(body.newPassword + salt).toString(encBase64);
        await UserModel.updateOne(
          { token: body.token },
          {
            nom: body.nom,
            prenom: body.prenom,
            telephone: body.telephone,
            email: body.email,
            password: newHash,
            adresse: body.adresse,
            postal: body.postal,
            ville: body.ville,
            salt: salt,
          }
        );

        var updateUser = await UserModel.findOne({ token: body.token });

        findUser = updateUser;
      } else {
        result = false;
        error.push("mot de passe incorrect");
      }
    } else {
      error.push("utilisateur incorrect");
    }
  }

  res.json({ error, result, findUser });
});
// ===========================================/searchBall====================================================

router.get("/searchBall", async function (req, res, next) {
  var ballFind = await ballModel.find({});

  res.json({ response: ballFind });
});

module.exports = router;
