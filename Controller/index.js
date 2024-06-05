"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mustache = require("mustache-express");
const cors = require("cors");

const sqlite = require("better-sqlite3");
const session = require("express-session");

var nodemailer = require("nodemailer");

const model = require("../Model/model.js");

const { error } = require("console");

const { check, validationResult } = require("express-validator");

const bcrypt = require("bcrypt");
const { nextTick } = require("process");

const jwt = require("jsonwebtoken");

const multer = require("multer");

let db = new sqlite("../Model/db.sqlite");
const fs = require("fs");
const jsonData = fs.readFileSync("../data.json", "utf-8");
const data = JSON.parse(jsonData);

//----------------Configuration du serveur----------------------

var app = express();
const port = 4000;

app.use(express.static("../CSS"));
app.use(express.static("../public"));

app.use(express.json());
const corsOptions = {
  origin: "http://localhost:4200",
  credentials: true,
};

app.use(cors(corsOptions));

//---------------- Sessions ------------------------------//
const SqliteStore = require("better-sqlite3-session-store")(session);
const dbsession = new sqlite("sessions.db", {
  verbose: console.log("sqlite CONNECTED"),
});

const store = new SqliteStore({
  client: dbsession,
  expired: {
    clear: true,
    intervalMs: 10000, //ms = 15min
  },
});

app.use(
  session({
    secret: "key that will sign cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      name: "connect.sid",
    },
  })
);

app.engine("html", mustache());
app.set("view engine", "html");
app.set("views", "../Views");
app.use(bodyParser.urlencoded({ extended: false }));

const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/src/assets/PDP"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });



//-----------------Gérer l'authentification de l'utilisateur ---------------------------------
app.get("/", (req, res) => {
  res.render("homepage");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.render("logout");
});

//------------------------------------------------------------------/


app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/reset_password", (req, res) => {
  res.render("reset_password");
});

app.get("/after_rp/:id", (req, res) => {
  res.render("after_rp");
});

app.get("/change_password", (req, res) => {
  res.render("change_password");
});


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



app.post("/register", async (req, res) => {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var password = req.body.password;

  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);

  
  const errors = validationResult(req);

  if (model.get_email(email) != -1) {
    res.json({ success: false, redirectUrl: "/signup" });
  } else {
    const { email } = req.body;

    // Générer un token de confirmation aléatoire

    const token = Math.random().toString(36).substr(2);
    var id;
    id = model.create_user(firstName, lastName, email, password, token);

    //Configurer les données de l'email avec des symboles unicode.

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

    mailTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.log("it has an error", err);
      } else {
        console.log("email has sent!");
      }
    });

    // Envoyer une réponse au client.
    res.json({ success: true, redirectUrl: "/accueil" });

    
  }
});

app.get("/confirm-email/:token", (req, res) => {
  const { token } = req.params;

  if (model.get_userbytoken(token) == -1) {
    console.log("User with confirmation token not found.");
    return res.status(400).json({
      error:
        "Jeton de confirmation non valide. Veuillez vérifier votre e-mail et réessayer.",
    });
  } else {
    // Confirmer l'e-mail de l'utilisateur.
    model.confirmUserEmail(token);
    // Envoyer une réponse au client.
    
    //res.send("Email confirmed successfully!");
    
    res.json({
      message: "E-mail confirmé avec succès !",
    });
  }
});

app.post("/reset_password", async (req, res) => {
  var email_user = req.body.email;

  var id = model.login(email_user);

  if (id == -1) {
    res.json({
      success: false,
      message: "E-mail introuvable dans la base de données",
      redirectUrl: "/resetPassword",
    });
    return;
  }

  //Configurer les données de l'email avec des symboles Unicode.

  let mailOptions = {
    from: '"Contact Support <pfeAssistance.2023@gmail.com>"',
    to: email_user,
    subject: "RESET PASSWORD",
    html: `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
      .email-container {
        background-color: #f5f5f5;
        padding: 20px;
      }
      
      .email-text {
        font-size: 18px;
        color: #333;
        margin-bottom: 20px;
      }
      
      .reset-link {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
      }
      
      </style>
    </head>
    <body>
    <div class="email-container">
    <p class="email-text">Please click on the following link to reset your password</p>
    <a class="reset-link" href="http://localhost:4200/afterReset/${id}">Reset password</a>
  </div>
    </body>
  </html>
  `,
  };

  mailTransporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("it has an error", err);
    } else {
      console.log("email has sent!");
    }
  });
  //Envoyer une réponse au client.

  res.json({ success: true, redirectUrl: "/log" });
});

app.post("/after_rp/", async (req, res) => {
  var id = req.body.idUser;
  var new_password = req.body.newPass;
  var confirm_password = req.body.newPassConfirm;

  if (new_password == confirm_password) {
    const salt = await bcrypt.genSalt();
    new_password = await bcrypt.hash(new_password, salt);

    model.resetPassword(new_password, id);
    res.json({ success: true, redirectUrl: "/log" });
  } else {
    res.send("ERROR");
  }
});

app.post("/login", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  var id = model.login(email);

  try {
    var auth = await bcrypt.compare(password, model.get_userpassword(id));
  } catch {}
  if (id !== -1 && auth) {
    if (model.verifyConfirmation(email) !== -1) {
      console.log("Login Success");

      req.session.isAuth = true;
      req.session.idUser = id;
      const sessionData = { isAuth: true, idUser: id };

      const token = jwt.sign(
        {
          email: email,
          userId: id,
        },
        "secretfortoken",
        { expiresIn: "1h" }
      );

      res.json({
        token: token,
        success: true,
        sessionData: sessionData,
        redirectUrl: "/accueil",
        message: `Welcome back`,
      });
    } else {
      res.json({
        success: false,
        redirectUrl: "/log",
        message: `verification`,
      });
    }
  } else {
    res.json({
      success: false,
      redirectUrl: "/log",
      message: `invalid`,
    });
  }
});

app.post("/contact", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message;

  model.add_contact_info(name, email, message);
  const emailAssistance = "pfeAssistance.2023@gmail.com";
  
  let mailOptions = {
    from: '"Contact Support <pfeAssistance.2023@gmail.com>"',
    to: emailAssistance,
    subject: " Contact  ",
    html: `
        <p> from ${name} | ${email}
        </p>
        ${message}
        `,
  };

  mailTransporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("An error occurred while sending the email", err);
      res.json({
        success: false,
        message: "An error occurred while sending the email",
      });
    } else {
      console.log("--- Email sent ---");

      // Envoyer un message de confirmation à l'utilisateur
      let confirmationOptions = {
        from: '"Contact Support <pfeAssistance.2023@gmail.com>"',
        to: email,
        subject: "Confirmation de contact",
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

      .thank-you {
        font-size: 24px;
        font-weight: bold;
      }

      .response-time {
        font-size: 18px;
      }

      .message-content {
        background-color: #f5f5f5;
        padding: 10px;
        border-radius: 5px;
        text-align: left;
      }

      .message-content p {
        margin: 0;
      }

      .note {
        color: #888;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1 class="thank-you">Merci pour votre message, ${name}</h1>
      <p class="response-time">Nous avons bien reçu votre demande et nous vous répondrons dans les meilleurs délais.</p>
      <div class="message-content">
        <p>${message}</p>
      </div>
      <p class="note">
        Note: Ceci est un message de confirmation automatique, veuillez ne pas y
        répondre.
      </p>
    </div>
  </body>
</html>

              
        `,
      };

      mailTransporter.sendMail(confirmationOptions, (err) => {
        if (err) {
          console.log(
            "An error occurred while sending the confirmation email",
            err
          );
        } else {
          console.log("--- Confirmation email sent ---");
        }
      });

      res.json({ success: true, redirectUrl: "/accueil" });
    }
  });
});

app.get("/edit_profile", (req, res) => {
  const id = req.query.idUser;
  const user = model.getUserProfile(id);
  res.json(user);
});

app.post("/edit_profile", upload.single("picture"), (req, res, next) => {
  var id = req.body.idUser;
  var address = req.body.address;
  var phone = req.body.phoneNumber;
  var niveau = req.body.level;
  var sport_preferences = req.body.sport;
  var gender = req.body.gender;

  if (req.file) {
    var profile_picture = req.file.filename;
    model.edit_profile(
      address,
      phone,
      niveau,
      sport_preferences,
      profile_picture,
      gender,
      id
    );
  } else {
    model.edit_profile_without_picture(
      address,
      phone,
      niveau,
      sport_preferences,
      gender,
      id
    );
  }

  res.json({ success: true, redirectUrl: "/profile" });
});

app.post("/change_password", async (req, res) => {
  var id = req.body.idUser;
  var oldPassword = req.body.oldpassword;
  var newPassword = req.body.newpassword;

  try {
    var auth = await bcrypt.compare(oldPassword, model.get_userpassword(id));
  } catch {}
  if (auth) {
    const salt = await bcrypt.genSalt();
    newPassword = await bcrypt.hash(newPassword, salt);
    model.change_password(newPassword, id);
    res.json({ success: true, redirectUrl: "/changePassword" });
  } else {
    res.json({
      success: false,
      message: "error",
      redirectUrl: "/changePassword",
    });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("connect.sid");
  res.json({ success: true, message: "Logout successful" });
});

// Fonction de formatage de la date (jour/heure)  -----------------------------------------------------------------------
function formatDate(date) {
  const evalDate = new Date(date);
  const année = evalDate.getFullYear();
  const mois = evalDate.getMonth() + 1;
  const jour = evalDate.getDate();
  const heures = evalDate.getHours();
  const minutes = evalDate.getMinutes();
  return `${jour}/${mois}/${année}||${heures}:${minutes}`;
}

app.get("/reservation", (req, res) => {
  const query = db.prepare("SELECT * FROM terrain");
  const terrains = query.all();

  const terrainsWithAverageRating = terrains.map((terrain) => {
    const averageRating = model.calculateAverageRating(terrain.idTerrain);
    const contents = model.get_evaluations(terrain.idTerrain);

    const stars = Array.from({ length: Math.floor(averageRating) }, () => true);
    const emptyStars = Array.from(
      { length: Math.floor(5 - averageRating) },
      () => true
    );

    const typeTerrain = model.get_type_terrain(terrain.idType);

    const contentsWithUserInfo = Array.isArray(contents)
      ? contents.map((content) => {
          const userId = model.get_idUser_byContent(content.content);

          const userInfo = model.get_user_info(userId);
          const dateEvaluation = model.get_dateEvaluation(content.content);
          const formattedDate = formatDate(dateEvaluation);

          return {
            ...content,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            formattedDate,
          };
        })
      : [];

    return {
      idTerrain: terrain.idTerrain,
      nameTerrain: terrain.nameTerrain,
      typeTerrain: typeTerrain.type,
      priceTerrain: typeTerrain.price,
      locationTerrain: terrain.location,
      positionTerrain: terrain.position,
      posterTerrain: terrain.poster,
      averageRating,
      contents: contentsWithUserInfo,
    };
  });

  res.json(terrainsWithAverageRating);
});

app.get("/reservation/evaluation/:idTerrain", (req, res) => {
  const idTerrain = req.params.idTerrain;

  const query = db.prepare("SELECT * FROM terrain WHERE idTerrain = ?");
  const terrain = query.get(idTerrain);

  res.render("evaluation", { terrain: terrain });
});

app.post("/reservation/evaluation/:idTerrain", (req, res) => {
  const idUser = req.body.idUser;
  const idTerrain = req.body.idTerrain;
  const rating = req.body.stars;
  const comment = req.body.message;

  const dateEvaluation = new Date().toISOString();

  let idEvaluation;
  idEvaluation = model.Evaluate(
    idUser,
    idTerrain,
    comment,
    rating,
    dateEvaluation
  );

  

  // Redirigez l'utilisateur vers une autre page ou renvoyez une réponse appropriée
  res.json({
    success: true,
    redirectUrl: "/terrains",
    message: `done`,
  });
});

app.get("/reserver/:idTerrain", (req, res) => {
  res.render("/reserver/:idTerrain");
});

app.post("/reserver/:idTerrain", (req, res) => {
  const idTerrain = req.body.idTerrain;
  const dateReservation = req.body.date;
  const startHour = parseInt(req.body.startTime.split(":")[0]);
  const startMinute = parseInt(req.body.startTime.split(":")[1]);
  const endHour = parseInt(req.body.endTime.split(":")[0]);
  const endMinute = parseInt(req.body.endTime.split(":")[1]);

  if (
    model.verifyReservation(idTerrain, req.body.startTime, req.body.endTime)
  ) {
    res.json({
      success: false,
      message: `Terrain déjà réservé pour cette heure`,
    });
  }

  const startTime = new Date(
    `${dateReservation}T${req.body.startTime}:00Z`
  ).toISOString();
  const endTime = new Date(
    `${dateReservation}T${req.body.endTime}:00Z`
  ).toISOString();

  // Vérifier si le terrain est deja réservé
  if (
    model.verifyReservation(
      idTerrain,
      req.body.startTime,
      req.body.endTime,
      dateReservation
    )
  ) {
    res.json({
      success: false,
      message: `Terrain déjà réservé pour cette heure`,
    });
  }

  res.json({
    success: true,
    redirectUrl: `/payment/${idTerrain}/${dateReservation}/${req.body.startTime}/${req.body.endTime}`,
  });
});

app.get("/payment", (req, res) => {
  res.render("/payment/:idReservation");
});

app.post("/payment", (req, res) => {
  const idUser = req.body.idUser;
  const idTerrain = req.body.idTerrain;
  const dateReservation = req.body.dateReservation;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;

 
  let idReservation;
  idReservation = model.create_reservation(
    idTerrain,
    startTime,
    endTime,
    dateReservation
  );

  
  const statut = "payé";
  // Obtenez la date et l'heure actuelles pour le paiement
  const datePayment = new Date().toISOString();

  let idPayment;
  idPayment = model.add_payment(idReservation, idUser, datePayment, statut);

  const invoice = `
    <html>
    <head>
      <style>
        /* Styles CSS personnalisés ici */
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
        <h1>Facture de paiement</h1>
        <p>ID de réservation : ${idReservation}</p>
        <p>Terrain réservé : ${idTerrain}</p>
        <p>Date de réservation : ${dateReservation}</p>
        <p>Heure de début : ${startTime}</p>
        <p>Heure de fin : ${endTime}</p>
        <p class="total">Total à payer : 2.00 €</p>
      </div>
    </body>
    </html>
  `;

  
  let mailOptions = {
    from: '"Contact Support <pfeAssistance.2023@gmail.com>"',
    to: model.get_email_forReservation(idUser),
    subject: "Confirmation de réservation",
    html: invoice,
  };

  mailTransporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("it has an error", err);
    } else {
      console.log("email has been sent!");
    }
  });
  res.json({
    success: true,
    redirectUrl: `/accueil`,
    message: `payment validated`,
  });
});

app.get("/mesreservations", (req, res) => {
  var id = req.query.idUser;

  const reservations = model.getReservationsByUserId(id);

  const reservationContents = reservations.map((reservation) => {
    const content = model.getReservationContent(reservation.idReservation);

    const nameTerrain = model.getNameTerrainById(content[0].idTerrain);

    content[0].nameTerrain = nameTerrain[0].nameTerrain;
    content[0].idReservation = reservation.idReservation;

    return content;
  });

  res.json(reservationContents);
});

app.get("/terrain", (req, res) => {
  var id = req.query.idTerrain;

  const terrainName = model.getNameTerrainById(id);

  if (terrainName && terrainName.length > 0) {
    const terrain = terrainName[0];

    // Obtenir le type et le prix en utilisant l'idType du terrain.
    const typeTerrain = model.get_type_terrain(terrain.idType);

    
    terrain.price = typeTerrain.price;
    terrain.type = typeTerrain.type;
  }

  res.json(terrainName);
});

app.post("/publication", (req, res) => {
  const idUser = req.body.idUser;

  const datePublication = new Date();

  // Appel à la fonction createPublication pour créer la publication
  const publicationId = model.createPublication(
    idUser,
    datePublication,
    req.body.title,
    req.body.publication
  );

  // Rediriger l'utilisateur vers la page de la publication créée
  res.json({ success: true, redirectUrl: "/forum" });
});

app.get("/publication", (req, res) => {
  const publications = model.getPublications();

  const publicationsWithUserInfo = publications.map((publication) => {
    const userInfo = model.get_user_info(publication.idUser);
    return {
      ...publication,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      photo: userInfo.photo,
    };
  });

  res.json(publicationsWithUserInfo);
});

app.post("/cancel", (req, res) => {
  const idReservation = req.body.idReservation;
  console.log(idReservation);
  model.cancelReservation(idReservation);

  res.json({
    success: true,
    redirectUrl: `/mesreservations`,
  });
});

app.post("/comment", (req, res) => {
  const idPublication = req.body.idPublication;
  const idUser = req.body.idUser;
  const comment = req.body.comment;

  const dateComment = new Date();

  const commentId = model.createComment(
    idPublication,
    idUser,
    dateComment,
    comment
  );

  res.json({ success: true, redirectUrl: "/forum" });
});

app.get("/comment", (req, res) => {
  const comments = model.getComments();

  res.json(comments);
});

app.get("/users", (req, res) => {
  const users = model.getUsers();

  res.json(users);
});

//----------------END-------------------------------------------->

app.listen(port);
console.log("Server started");
