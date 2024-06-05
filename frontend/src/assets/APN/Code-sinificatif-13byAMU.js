/*
membres:
*) Abdelhak BENKORTBI
*) Nabil NKHILI
*) Youssef EL HAMRANI
*)Amelia HAMMOUCHE
*/

// Création du transporteur d'e-mails avec les informations de connexion
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "pfe.Assistance2023@gmail.com",
    pass: "tlliuinvwlvnfyuf",
  },
  tls: {
    rejectUnauthorized: true,
  },
});

// Route pour l'enregistrement d'un utilisateur
app.post("/register", async (req, res) => {
  // Récupération des données du formulaire
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;

  // Hashage du mot de passe avec bcrypt
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);

  var id;
  const errors = validationResult(req);
  if (model.get_email(email) != -1) {
    // Si l'e-mail existe déjà dans la base de données, renvoyer une réponse indiquant l'échec de l'enregistrement
    res.json({ success: false, redirectUrl: "/signup" });
  } else {
    // Génération d'un jeton de confirmation aléatoire
    const token = Math.random().toString(36).substr(2);
    // Création de l'utilisateur avec le jeton de confirmation
    id = model.create_user(firstName, lastName, email, password, token);
    // Configuration des données de l'e-mail avec des symboles Unicode
    let mailOptions = {
      from: '"Contact Support <pfeAssistance.2023@gmail.com>"',
      to: email,
      subject: "Vérification de l'E-mail",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* Vos styles CSS personnalisés ici */
            /* ... */

            body {
              background-color: #e1f1ff;
              font-family: Arial, sans-serif;
            }
      
            .container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              text-align: center;
              border-radius: 5px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }
      
            h1 {
              color: #2597e8;
            }
      
            p {
              color: #555;
              margin-bottom: 20px;
            }
      
            .button {
              display: inline-block;
              background-color: #2597e8;
              color: #fff;
              padding: 10px 20px;
              border-radius: 5px;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vérification de l'E-mail</h1>
            <p>Veuillez cliquer sur le lien suivant pour confirmer votre adresse e-mail :</p>
            <a href="http://localhost:4200/accueil/${token}" class="button">Confirmez votre email</a>
          </div>
        </body>
      </html>
      `,
    };
    // Envoi de l'e-mail de confirmation
    mailTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("it has an error", err);
      } else {
        console.log("email has sent!");
      }
    });
    // Renvoi d'une réponse au client indiquant le succès de l'enregistrement
    res.json({ success: true, redirectUrl: "/accueil" });
  }
});

// Route pour la confirmation de l'e-mail
app.get("/confirm-email/:token", (req, res) => {
  const { token } = req.params;
  if (model.get_userbytoken(token) == -1) {
    // Si aucun utilisateur avec le jeton de confirmation n'est trouvé, renvoyer une erreur
    console.log("User with confirmation token not found.");
    return res.status(400).json({
      error:
        "Jeton de confirmation non valide. Veuillez vérifier votre e-mail et réessayer.",
    });
  } else {
    // Confirmer l'e-mail de l'utilisateur
    model.confirmUserEmail(token);
    // Renvoi d'une réponse au client indiquant la confirmation réussie de l'e-mail
    res.json({
      message: "E-mail confirmé avec succès !",
    });
  }
});














// Route pour l'évaluation d'un terrain (affichage du formulaire d'évaluation)
app.get("/reservation/evaluation/:idTerrain", (req, res) => {
  // Récupération de l'ID du terrain à évaluer à partir des paramètres de l'URL
  const idTerrain = req.params.idTerrain;

  // Préparation de la requête SQL pour récupérer les informations du terrain
  const query = db.prepare("SELECT * FROM terrain WHERE idTerrain = ?");

  // Exécution de la requête SQL avec l'ID du terrain en tant que paramètre
  const terrain = query.get(idTerrain);

  // Rendu de la vue "evaluation" avec les informations du terrain passées en tant que données
  res.render("evaluation", { terrain: terrain });
});

// Route pour l'évaluation d'un terrain (traitement du formulaire d'évaluation)
app.post("/reservation/evaluation/:idTerrain", (req, res) => {
  // Récupération des données du formulaire d'évaluation
  const idUser = req.body.idUser;
  const idTerrain = req.body.idTerrain;
  const rating = req.body.stars;
  const comment = req.body.message;

  // Obtention de la date d'évaluation actuelle
  const dateEvaluation = new Date().toISOString();

  let idEvaluation;
  // Appel à la méthode "Evaluate" du modèle pour enregistrer l'évaluation dans la base de données
  idEvaluation = model.Evaluate(
    idUser,
    idTerrain,
    comment,
    rating,
    dateEvaluation
  );

  // Renvoi d'une réponse JSON indiquant le succès de l'évaluation et l'URL de redirection
  res.json({
    success: true,
    redirectUrl: "/terrains",
    message: done,
  });
});