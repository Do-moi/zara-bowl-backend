var express = require("express");
var router = express.Router();
var UserModel = require("../models/users");
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");
var ballModel = require("../models/ball");
var stripe = require("stripe")("sk_test_ZY8sZa9vQGzDbX48Nahzt3Ey00nSD58inI");

router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express!!!!!!!!!",
  });
});
// =========================================/sign-up=============================================

router.post("/sign-up", async function (req, res, next) {
  // console.log("==========req.body", typeof req.body.password[3]);

  var body = req.body;
  var error = [];
  var nb = false;
  var upperCase = false;
  var lowerCase = false;
  var caracteres = false;
  var userSearch;
  var reponseSave = false;
  var letter = false;
  var telCt = false;
  var userToken;
  var profilUser;
  // ===========================condition champs vides=======================
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
  // ============================condition password===================
  if (body.password.length < 6) {
    error.push("mot de passe minimum 6 caractères");
  }
  var regexUpperCase = /[A-Z]/;
  var findUpperCase = regexUpperCase.test(body.password);

  // console.log("=============findUpperCase", findUpperCase);
  if (findUpperCase == true) {
    upperCase = true;
  }
  var regexLowerCase = /[a-z]/;
  var findLowerCase = regexLowerCase.test(body.password);

  // console.log("=============findLowerCase", findLowerCase);
  if (findLowerCase == true) {
    lowerCase = true;
  }
  // for (var i = 0; i < body.password.length; i++) {
  //   if (
  //     body.password[i] == body.password[i].toUpperCase() &&
  //     body.password[i] != 0 &&
  //     body.password[i] != 1 &&
  //     body.password[i] != 2 &&
  //     body.password[i] != 3 &&
  //     body.password[i] != 4 &&
  //     body.password[i] != 5 &&
  //     body.password[i] != 6 &&
  //     body.password[i] != 7 &&
  //     body.password[i] != 8 &&
  //     body.password[i] != 9
  //   ) {
  //     upperCase = true;
  //   } else if (
  //     body.password[i] == body.password[i].toLowerCase() &&
  //     body.password[i] != 0 &&
  //     body.password[i] != 1 &&
  //     body.password[i] != 2 &&
  //     body.password[i] != 3 &&
  //     body.password[i] != 4 &&
  //     body.password[i] != 5 &&
  //     body.password[i] != 6 &&
  //     body.password[i] != 7 &&
  //     body.password[i] != 8 &&
  //     body.password[i] != 9
  //   ) {
  //     lowerCase = true;
  //   }
  // }

  var regex = /[0-9]/;
  var testNB = regex.test(body.password);

  // console.log("============testNB", testNB);
  if (testNB == true) {
    nb = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.password);
  // console.log("============testCaracters", testCaracteres);
  if (testCaracteres == true) {
    caracteres = true;
  }

  if (upperCase == false) {
    error.push("mot de passe minimum 1 majuscule ");
  } else if (nb == false) {
    error.push("mot de passe minimum 1 chiffre");
  } else if (lowerCase == false) {
    error.push("mot de passe minimum 1 minuscule ");
  } else if (caracteres == false) {
    error.push("mot de passe minimun 1 caractère spécial");
  }
  // ==============================================condition numero telephone==========================
  console.log("======body.telephone.length", body.telephone.length);
  console.log("======body.telephone", body.telephone.length);
  if (body.telephone.length != 10) {
    error.push("le numéro de téléphone doit comporter 10 chiffres");
  }
  var regexLetter = /[A-Za-z]/;
  var testLetter = regexLetter.test(body.telephone);

  console.log("============testLetter", testLetter);
  if (testLetter == true) {
    letter = true;
  }

  var regexCt = /[^A-Za-z0-9_]/;
  var testCt = regexCt.test(body.telephone);

  console.log("============testCt", testCt);
  if (testCt == true) {
    telCt = true;
  }

  if (letter == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }
  if (telCt == true) {
    error.push("le numéro de téléphone doit contenir que des chiffres");
  }
  if (error.length == 0) {
    var userFind = await UserModel.findOne({
      nom: req.body.nom,
      email: req.body.email,
    });
    if (userFind == null) {
      var salt = uid2(32);

      var newUser = await new UserModel({
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        email: req.body.email,
        password: SHA256(req.body.password + salt).toString(encBase64),
        adresse: req.body.adresse,
        postal: req.body.postal,
        ville: req.body.ville,
        salt: salt,
        token: uid2(32),
      });

      var userSave = await newUser.save();
      console.log("======userSave", userSave);
      profilUser = {
        nom: userSave.nom,
        prenom: userSave.prenom,
        telephone: userSave.telephone,
        email: userSave.email,
        adresse: userSave.adresse,
        postal: userSave.postal,
        ville: userSave.ville,
        commande: userSave.commande,
      };
    }
    if (userFind) {
      userSearch = true;
    } else {
      userSearch = profilUser;
      userToken = userSave.token;
    }

    if (userSave) {
      reponseSave = true;
    } else {
      error.push("utilisateur déjà enregistré");
    }
  }
  console.log(
    "========================",
    reponseSave,
    userSearch,
    userToken,
    error
  );
  res.json({
    reponseSave,
    userSearch,
    userToken,
    error,
  });
});
// ===========================================/sign-in==============================================

router.post("/sign-in", async function (req, res, next) {
  console.log("==========sign-in", req.body);
  var error = [];
  var findUser = null;
  var result = false;
  var token = null;
  var profilUser;

  if (req.body.email == "" || req.body.password == "") {
    error.push("champs vide");
  }
  if (error.length == 0) {
    const userFind = await UserModel.findOne({
      email: req.body.email,
    });

    console.log("=====userFind", userFind);

    if (userFind) {
      var hash = SHA256(req.body.password + userFind.salt).toString(encBase64);
      if (hash === userFind.password) {
        result = true;
        token = userFind.token;
        console.log("==========", userFind.password, "==========", hash);

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
        result = false;
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
// ===============================/commande===========================================

router.post("/commande", async function (req, res, next) {
  var date = new Date();

  var jour = date.getDate();
  var mois = date.getMonth() + 1;
  var annee = date.getFullYear();

  console.log("===========tokenrdx", req.body.commandeId);

  var cmd = req.body.commandeId[2].ball;
  var idUser = req.body.commandeId[0];
  var idLivraison = req.body.commandeId[1];

  var total = 0;

  cmd.map((ball, i) => {
    total = parseInt(ball.price, 10) * parseInt(ball.theQuantite) + total;
    console.log("============", total);
  });
  console.log("============total", total);

  var charge = await stripe.charges.create({
    amount: total * 100,
    currency: "eur",
    description: "zara bowl charge",
    source: req.body.token,
  });

  console.log("==========charge", charge);
  if (charge.status === "succeeded") {
    cmd.map(async (ball, i) => {
      var obj = {
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
      };
      console.log("=========================obj", obj);
      console.log("=========================tokenuser", idUser);
      const cmdUpdate = await UserModel.updateMany(
        {
          token: idUser,
        },
        {
          $push: {
            commande: obj,
          },
        }
      );
      console.log("=========cmd", cmdUpdate);
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
// =======================================/profil===========================================
router.post("/profil", async function (req, res, next) {
  console.log("==============reqBodyProfil".req.body);
  var profilUser;
  var reponseSave;
  var userFind = await UserModel.findOne({
    token: req.body.token,
  });
  console.log("==========userFind", userFind);
  profilUser = {
    nom: userFind.nom,
    prenom: userFind.prenom,
    email: userFind.email,
    adresse: userFind.adresse,
    postal: userFind.postal,
    ville: userFind.ville,
    commande: userFind.commande,
  };

  res.json({
    profilUser,
  });
});
router.get("/saveBall", async function (req, res, next) {
  var newBall = await new ballModel({
    brand: "Motiv",
  });
  newBall.list.push(
    {
      name: "GOLDEN JACKAL",
      brand: "Motiv",
      price: "240",
      img:
        "https://www.bowlerx.com/wp-content/uploads/2019/01/Golden_Jackal.jpg",
      imgCore:
        "https://www.bowlerx.com/wp-content/uploads/2019/01/Golden_Jackal_Core.jpg",
      desc: `La nouvelle Golden Jackal donne vie à la légende d'un Jackal perlé .
        Fournissant plus de longueur à travers l'huile, la Golden Jackal affiche un mouvement de backend impressionnant.
         Il n'y a jamais eu de Jackal avec ce genre d'agilité et de vitesse!
        La Golden Jackal est doté du dernier bloc de poids asymétrique Predator V3 pour fournir un potentiel d'éclat de piste massif et une puissance d'accrochage.
         Cette technologie produit également un RG très faible, de sorte que la Golden Jackal est plus facile à controler,
          ce qui le rend plus tolérant sur les modèles d'huile lourde que les balles RG plus élevées qui peuvent glisser au-delà du point de transition approprié.
        Pour générer un angle puissant dans des environnements à volume élevé, la couverture Hexion SE est incroyable.
         Cette version renforcée de la technologie Hexion produit un mouvement de descente exceptionnel sans sacrifier la traction dans l'huile.
          La finition d'usine sur le stock de couverture Golden Jackal est de 4000 Grit LSS.`,
      core: "Asymétrique",
      coverstock: "Pearl Reactive",
      flare: "Haute",
      performance: "Haute performance",
      condition: "Très huilé",
      color: "Or",
      differential: "0.055 (15lb)",
      finish: "4000 Grit LSS",
      masse_bias: "oui",
      rg: "2.47 (15lb)",
      reaction: "Mouvement backend très fort",
      date: "13/02/2019",
    },

    {
      name: "ALPHA JACKAL",
      brand: "Motiv",
      price: "240",
      img:
        "https://www.bowlerx.com/wp-content/uploads/2019/11/motiv-alpha-jackal-bowling-ball.png",
      imgCore:
        "https://www.bowlerx.com/wp-content/uploads/2019/11/Alpha-Jackal-Core.png",
      desc: `L'Alpha Jackal utilise le noyau Predator V2 du Jackal Ghost et le nouveau coverstock Coercion HV3 Solid Reactive pour créer le nouveau monstre crochet de Motiv.
       Cette boule sort de la boîte avec une finition sablée de grain 2000 pour lui donner des dents à travers l'huile,
        tandis que son noyau à faible RG l'aide à accélérer très rapidement.
         L'Alpha Jackal fournit plus de crochet dans l'huile que le  Golden Jackal , ce qui en fait un choix facile pour des conditions de volume plus longues et plus lourdes.
          Avec le Trident Abyss, qui a un mouvement de balle plus fluide, l'Alpha Jackal fournira aux quilleurs le crochet le plus complet de la gamme de produits Motiv.
        La Jackal règne en maître sur le pétrole lourd. Pendant plus d'une demi-décennie, la gamme de boules de bowling Jackal a été la force dominante pour le pétrole lourd.
         Dernier-né de la gamme, l'Alpha Jackal repousse les limites en offrant plus de crochet avec le contrôle et la continuation dévastatrice que vous attendez.`,
      core: "Asymétrique",
      coverstock: "Solide Reactive",
      flare: "Haute",
      performance: "Haute performance",
      condition: "Huile lourde",
      color: "Bleu solide / Violet",
      differential: "0.054 (15lb)",
      finish: "2000 Grit LSS",
      masse_bias: "oui",
      rg: "2.47 (15lb)",
      reaction: "Mouvement Midlane et Backend très puissant",
      date: "15/01/2020",
    },

    {
      name: "TRIDENT NEMESIS",
      brand: "Motiv",
      price: "230",
      img:
        "https://www.bowlerx.com/wp-content/uploads/2020/01/motiv-trident-nemesis-bowling-ball-e1579386519633.png",
      imgCore:
        "https://www.bowlerx.com/wp-content/uploads/2020/01/motiv-trident-nemesis-bowling-ball-core-e1579386645336.png",
      desc: `La Trident Nemesis est le quatrième opus de la gamme Trident pour Motiv.
       La Nemesis utilise la nouvelle forme de noyau Sidewinder asymétrique, qui offre un RG plus élevé,
        un différentiel total inférieur et un différentiel intermédiaire inférieur par rapport au noyau Turbulent utilisé dans les versions précédentes de Trident.
         L'association de cette conception de base et de la nouvelle couverture d'infusion HV Pearl Reactive crée une boule qui va glisser et est très sensible au sec.
          Les versions précédentes de la couverture Infusion ont été trouvées sur Forge Fire , Ripcord et Supra.
         Allons droit au but… la nouvelle Trident Nemesis est sans aucun doute la boule asymétrique la plus angulaire jamais créée par MOTIV!
          Il est fier de notre dernière technologie de couverture Pearl Reactive Infusion HV (High Volume) et de la nouvelle conception de bloc de poids asymétrique Sidewinder.
           Destiné aux conditions d'huile moyennement lourdes, le Trident Nemesis a un mouvement de backend impressionnant et une continuation puissante.`,
      core: "Asymétrique",
      coverstock: "Pearl Reactive",
      flare: "Haute",
      performance: "Haute performance",
      condition: "Huile moyenne à lourde",
      color: "Sarcelle / Noir",
      differential: "0.049 (15lb)",
      finish: "5500 Grit LSP",
      masse_bias: "oui",
      rg: "2.52 (15lb)",
      reaction: "Excellente longueur avec un fort mouvement de backend",
      date: "19-02-2020",
    },

    {
      name: "FORGE FIRE",
      brand: "Motiv",
      price: "235",
      img:
        "https://www.bowlerx.com/wp-content/uploads/2019/09/motiv-forge-fire-front.png",
      imgCore:
        "https://www.bowlerx.com/wp-content/uploads/2019/09/motiv-forge-fire-core.png",
      desc: `La Forge Fire est la dernière version de Motiv à utiliser la forme de noyau détonateur symétrique.
       Ce suivi de la Forge d'origine comprend également la couverture Infusion Hybrid Reactive,
        qui est très réactive à l'arrière et offre une traction plus totale que la version perle utilisée sur le Ripcord.
         Cette couverture agressive est finie à 4000 grains LSS.
         La nouvelle Forge Fire apporte la chaleur à la ligne de forge à huile moyennement lourde.
          Doté du nouveau revêtement hybride réactif Infusion Hybrid, la Forge Fire a une réponse beaucoup plus rapide aux frottements que la Forge d'origine.
           Le Forge Fire est une balle angulaire modérée pour le pétrole moyennement lourd.
            La couverture est une version hybride de la coque Ripcord .`,
      core: "Asymétrique",
      coverstock: "Hybride réactive",
      flare: "Haute",
      performance: "Haute performance",
      condition: "Huile moyenne à lourde",
      color: "Rouge foncé solide / jaune nacré",
      differential: "0.055 (15lb)",
      finish: "4000 Grit LSS",
      masse_bias: "oui",
      rg: "2.47 (15lb)",
      reaction:
        "Mouvement d'arrière-plan modérément angulaire avec une excellente continuité",
      date: "10-16-2019",
    },

    {
      name: "FORGE",
      brand: "Motiv",
      price: "240",
      img: "https://www.bowlerx.com/wp-content/uploads/2019/01/forge2.jpg",
      imgCore:
        "https://www.bowlerx.com/wp-content/uploads/2019/01/forge20core1.jpg",
      desc: `La Forge est la boule de bowling la plus solide jamais créée par Motiv.
      Le nouveau bloc de poids Detonator et le couvercle Coercion HFS se combinent pour produire un potentiel d'accroche massif avec contrôle.
       Conçue pour un mouvement fluide dans des conditions d'huile moyennement lourdes, la Forge affiche une continuité exceptionnelle.
       La Forge est la nouvelle balle à réponse moyenne-lourde / lente (lisse) de Motiv.
        Depuis 5 ans, c'est un endroit réservé aux méchants et aux révoltes.
         La nouvelle ligne Forge remplace les révoltes.
          Il s'agit d'un tout nouveau noyau symétrique similaires aux révoltes.
       Cette boule a été développée pour s'adapter sous la Trident Abyss.
        Lorsque l'Abyss est sorti, il était tellement plus fort que tout le reste de la ligne Motiv qu'ils ont décidé qu'il devait y avoir une autre coque solide dans la ligne pour combler l'écart.
         Cette boule ressemble beaucoup à une révolte Havoc, mais elle est nettement plus de solide pour l'environnement moderne.`,
      core: "Symétrique",
      coverstock: "Solide Reactive",
      flare: "Haute",
      performance: "Haute performance",
      condition: "Huile moyenne à lourde",
      color: "Noir rouge",
      differential: "0.055 (15lb)",
      finish: "300 Grit LSS",
      masse_bias: "oui",
      rg: "2.47 (15lb)",
      reaction: "Mouvement fort et fluide avec une excellente continuité",
      date: "14/01/2019",
    }
  );

  var ballSave = await newBall.save();
  res.json({ response: ballSave });
});

router.get("/search", async function (req, res, next) {
  console.log("========= search", req.query);
  var ballFind = await ballModel.findOne({
    brand: req.query.name,
  });

  res.json({ response: ballFind });
});
// ==============================================/updateUser============================================

router.put("/updateUser", async function (req, res, next) {
  console.log("===============/updateUser======", req.body);
  var body = req.body;
  var error = [];
  var result = false;
  var findUser;

  var nb = false;
  var upperCase = false;
  var lowerCase = false;
  var caracteres = false;

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
    error.push("Veuillez remplir les champs vides");
  }
  if (body.newPassword.length < 6) {
    error.push("nouveau mot de passe minimum 6 caractères");
  }
  for (var i = 0; i < body.newPassword.length; i++) {
    if (
      body.newPassword[i] == body.newPassword[i].toUpperCase() &&
      body.newPassword[i] != 0 &&
      body.newPassword[i] != 1 &&
      body.newPassword[i] != 2 &&
      body.newPassword[i] != 3 &&
      body.newPassword[i] != 4 &&
      body.newPassword[i] != 5 &&
      body.newPassword[i] != 6 &&
      body.newPassword[i] != 7 &&
      body.newPassword[i] != 8 &&
      body.newPassword[i] != 9
    ) {
      upperCase = true;
    } else if (
      body.newPassword[i] == body.newPassword[i].toLowerCase() &&
      body.newPassword[i] != 0 &&
      body.newPassword[i] != 1 &&
      body.newPassword[i] != 2 &&
      body.newPassword[i] != 3 &&
      body.newPassword[i] != 4 &&
      body.newPassword[i] != 5 &&
      body.newPassword[i] != 6 &&
      body.newPassword[i] != 7 &&
      body.newPassword[i] != 8 &&
      body.newPassword[i] != 9
    ) {
      lowerCase = true;
    }
  }
  // if (upperCase == false) {
  //   error.push("mot de passe minimum 1 majuscule ");
  // } else if (nb == false) {
  //   error.push("mot de passe minimum 1 chiffre");
  // } else if (lowerCase == false) {
  //   error.push("mot de passe minimum 1 minuscule ");
  // }
  var regex = /[0-9]/;
  var testNB = regex.test(body.newPassword);
  console.log("============testNB", testNB);
  if (testNB == true) {
    nb = true;
  }

  var regex1 = /[^A-Za-z0-9_]/;
  var testCaracteres = regex1.test(body.newPassword);
  console.log("============testCaracters", testCaracteres);
  if (testCaracteres == true) {
    caracteres = true;
  }

  if (upperCase == false) {
    error.push(" nouveau mot de passe minimum 1 majuscule ");
  } else if (nb == false) {
    error.push("nouveau mot de passe minimum 1 chiffre");
  } else if (lowerCase == false) {
    error.push("nouveau mot de passe minimum 1 minuscule ");
  } else if (caracteres == true) {
    error.push(
      "nouveau mot de passe ne doit pas contenir de caractère spécial"
    );
  }
  if (error.length == 0) {
    var userFind = await UserModel.findOne({ token: body.token });
    if (userFind) {
      var hash = SHA256(body.password + userFind.salt).toString(encBase64);
      if (hash === userFind.password) {
        result = true;
        var salt = uid2(32);
        console.log("==========", userFind.password, "==========", hash);
        var userUpdate = await UserModel.updateOne(
          { token: body.token },
          {
            nom: body.nom,
            prenom: body.prenom,
            telephone: body.telephone,
            email: body.email,
            password: SHA256(body.newPassword + salt).toString(encBase64),
            adresse: body.adresse,
            postal: body.postal,
            ville: body.ville,
            salt: salt,
          }
        );
        console.log("=========userUpdate", userUpdate);

        var updateUser = await UserModel.findOne({ token: body.token });
        console.log("===============updateUser", updateUser);
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
// ===========================================/deteteProfil====================================================

router.delete("/deleteProfil", async function (req, res, next) {
  console.log("====================/deleteProfil================", req.query);
  var deleteUser = await UserModel.deleteOne({ token: req.query.token });
  console.log("============deleteUser=", deleteUser.deletedCount);
  var userDeleted = deleteUser.deletedCount;
  res.json({
    userDeleted,
  });
});
module.exports = router;
