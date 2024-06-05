"use strict";

const sqlite = require("better-sqlite3");
const model = require("../Model/model");

let db = new sqlite("../Model/db.sqlite");
const fs = require("fs");
const data = require("../data.json");

//----------------------------CHECK IF DATA EXIST +CREATE DATA----------------------------------------

//création d'un nouveau utilisateur
function create_user(firstName, lastName, email, password, token) {
  try {
    let insert = db.prepare(
      `INSERT INTO user (firstName,lastName,email,password,token) VALUES (?,?,?,?,?)`
    );

    let result = insert.run([firstName, lastName, email, password, token]);
    return result.lastInsertRowid;
  } catch (e) {
    if (e.code == "SQLITE_CONSTRAINT_PRIMARYKEY") return -1;
    throw e;
  }
}

// vérification d'email s'il existe  ( Register )
function get_email(email) {
  let select = db.prepare("SELECT email FROM user WHERE email=?").get(email);
  if (select != undefined) return select.email;
  return -1;
}

// login ()

function login(email) {
  let select = db.prepare("SELECT idUser FROM user WHERE email = ?  ");
  let result = select.get(email);
  if (result != undefined) return result.idUser;
  else {
    return -1;
  }
}

// user password by id
function get_userpassword(idUser) {
  let select = db
    .prepare("SELECT password FROM user WHERE idUser =?")
    .get(idUser);
  if (select != undefined) return select.password;
  else {
    return -1;
  }
}

function add_contact_info(name, email, message) {
  db.prepare("INSERT INTO contact(name,email,message) VALUES(?,?,?)").run(
    name,
    email,
    message
  );
}

function get_userbytoken(token) {
  let select = db.prepare("SELECT idUser FROM user WHERE token = ?").run(token);
  if (select != undefined) return select.idUser;
  else {
    return -1;
  }
}

function confirmUserEmail(token) {
  let select = db
    .prepare(
      "UPDATE user SET token = null, isEmailConfirmed = 1 WHERE token = ?"
    )
    .run(token);
}

function verifyConfirmation(email) {
  let select = db
    .prepare(
      "SELECT idUser FROM user WHERE email = ? AND isEmailConfirmed = 1 AND token IS NULL"
    )
    .get(email);
  if (select != undefined) return select.idUser;
  else {
    return -1;
  }
}

function resetPassword(password, idUser) {
  let select = db
    .prepare("UPDATE user SET password = ? WHERE idUser = ?")
    .run(password, idUser);
}

function edit_profile(
  address,
  phoneNumber,
  level,
  sport,
  photo,
  gender,
  idUser
) {
  let select = db
    .prepare(
      "UPDATE user SET address=? , phoneNumber=? , level=?, sport=? , photo=? , gender=? WHERE idUser=?"
    )
    .run(address, phoneNumber, level, sport, photo, gender, idUser);
}

function edit_profile_without_picture(
  address,
  phoneNumber,
  level,
  sport,
  gender,
  idUser
) {
  let select = db
    .prepare(
      "UPDATE user SET address=? , phoneNumber=? , level=?, sport=? , gender=? WHERE idUser=?"
    )
    .run(address, phoneNumber, level, sport, gender, idUser);
}

function change_password(password, idUser) {
  let select = db
    .prepare("UPDATE user SET password = ? WHERE idUser = ?")
    .run(password, idUser);
}

// Vérification si une réservation existe déjà pour le terrain donné avec chevauchement de temps
function verifyReservation(idTerrain, startTime, endTime, dateReservation) {
  const overlappingReservation = db
    .prepare(
      "SELECT idReservation FROM reservation WHERE idTerrain = ? AND dateReservation = ? AND isCanceled = 0 AND ((startTime <= ? AND endTime > ?) OR (startTime < ? AND endTime >= ?) OR (startTime >= ? AND endTime <= ?))"
    )
    .get(
      idTerrain,
      dateReservation,
      startTime,
      startTime,
      endTime,
      endTime,
      startTime,
      endTime
    );

  if (overlappingReservation) {
    return true; // Return true when an overlapping reservation is found
  }
  return false; // Return false when no overlapping reservation exists
}

function create_reservation(idTerrain, startTime, endTime, dateReservation) {
  try {
    // Insertion de la nouvelle réservation
    const insert = db.prepare(
      "INSERT INTO reservation (idTerrain, startTime, endTime, dateReservation) VALUES (?, ?, ?, ?)"
    );
    const result = insert.run([idTerrain, startTime, endTime, dateReservation]);
    return result.lastInsertRowid;
  } catch (e) {
    throw e;
  }
}

function add_payment(idReservation, idUser, datePayment, statut) {
  try {
    let insert = db.prepare(
      `INSERT INTO payment (idReservation,idUser,datePayment,statut) VALUES (?,?,?,?)`
    );

    let result = insert.run([idReservation, idUser, datePayment, statut]);
    return result.lastInsertRowid;
  } catch (e) {
    if (e.code == "SQLITE_CONSTRAINT_PRIMARYKEY") return -1;
    throw e;
  }
}

function getUserProfile(idUser) {
  let select = db
    .prepare(
      "SELECT firstName,lastName,address,phoneNumber,level,sport,photo,gender FROM user WHERE idUser = ?"
    )
    .get(idUser);

  if (select != undefined) return select;
  else {
    return -1;
  }
}

function get_email_forReservation(idUser) {
  let select = db.prepare("SELECT email FROM user WHERE idUser=?").get(idUser);
  if (select != undefined) return select.email;
  return -1;
}

// function Verify_Reservation(idPayment) {
//   let select = db
//     .prepare("SELECT idPayment FROM payment WHERE idPayment = ?")
//     .run(idPayment);
//   if (select != undefined) return select.idPayment;
//   else {
//     return -1;
//   }
// }

// function confirmReservation(idPayment) {
//   let select = db
//     .prepare("UPDATE payment SET statut = 'payed' WHERE idPayment = ?")
//     .run(idPayment);
// }

function Evaluate(idUser, idTerrain, content, rating, dateEvaluation) {
  try {
    let insert = db.prepare(
      `INSERT INTO evaluation (idUser,idTerrain,content,rating, dateEvaluation) VALUES (?,?,?,?,?)`
    );

    let result = insert.run([
      idUser,
      idTerrain,
      content,
      rating,
      dateEvaluation,
    ]);
    return result.lastInsertRowid;
  } catch (e) {
    if (e.code == "SQLITE_CONSTRAINT_PRIMARYKEY") return -1;
    throw e;
  }
}

function calculateAverageRating(idTerrain) {
  // Effectuez une requête à la base de données pour récupérer tous les avis pour le terrain spécifié
  const query = db.prepare("SELECT rating FROM evaluation WHERE idTerrain = ?");
  const ratings = query.all(idTerrain);

  if (ratings.length === 0) {
    // Aucun avis trouvé pour le terrain, retourner une valeur par défaut
    return 0;
  }

  // Calculer la somme de tous les avis
  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);

  // Calculer la moyenne en divisant la somme par le nombre d'avis
  const averageRating = totalRating / ratings.length;

  // Retourner la moyenne arrondie à 1 décimale
  return averageRating.toFixed(1);
}

function get_evaluations(idTerrain) {
  // Effectuez une requête à la base de données pour récupérer tous les avis pour le terrain spécifié
  const query = db.prepare(
    "SELECT content FROM evaluation WHERE idTerrain = ?"
  );
  const contents = query.all(idTerrain);

  if (contents.length === 0) {
    // Aucun avis trouvé pour le terrain, retourner une valeur par défaut
    return 0;
  }

  return contents;
}

function get_dateEvaluation(content) {
  let select = db
    .prepare("SELECT dateEvaluation FROM evaluation WHERE content =?")
    .get(content);
  if (select != undefined) return select.dateEvaluation;
  else {
    return -1;
  }
}

// function get_idEva_byContent(content) {
//   let select = db
//     .prepare("SELECT idEvaluation FROM evaluation WHERE content =?")
//     .get(content);
//   if (select != undefined) return select.idEvaluation;
//   else {
//     return -1;
//   }
// }

function get_idUser_byContent(content) {
  let select = db
    .prepare("SELECT idUser FROM evaluation WHERE content =?")
    .get(content);
  if (select != undefined) return select.idUser;
  else {
    return -1;
  }
}

function get_user_info(idUser) {
  let select = db
    .prepare("SELECT firstName, lastName, photo FROM user WHERE idUser =?")
    .get(idUser);
  if (select != undefined) return select;
  else {
    return -1;
  }
}

// function get_photo(idUser) {
//   let select = db.prepare("SELECT photo FROM user WHERE idUser =?").get(idUser);
//   if (select != undefined) return select;
//   else {
//     return -1;
//   }
// }

function get_type_terrain(idType) {
  const select = db
    .prepare("SELECT type, price FROM typeTerrain WHERE idType = ?")
    .get(idType);

  if (select != undefined) return select;
  else {
    return "";
  }
}

function cancelReservation(idReservation) {
  const updateQuery = db.prepare(
    "UPDATE reservation SET isCanceled = 1 WHERE idReservation = ?"
  );
  updateQuery.run(idReservation);
}

function populateTablesTerrain() {
  // Insertion des types de terrain dans la table "typeTerrain"
  const insertTypeTerrain = db.prepare(
    "INSERT OR IGNORE INTO typeTerrain (type, price) VALUES (?, ?)"
  );
  for (const typeId in data) {
    const type = data[typeId].type;
    const price = data[typeId].price;
    const result = insertTypeTerrain.run(type, price);
    const idType = result.lastInsertRowid;
  }

  // Insertion des terrains dans la table "terrain"
  const insertTerrain = db.prepare(
    "INSERT INTO terrain (nameTerrain, idType, location, position, poster) VALUES (?, ?, ?, ?, ?)"
  );
  for (const terrainId in data) {
    const terrain = data[terrainId];
    const nameTerrain = terrain.name;
    const type = terrain.type;
    const location = terrain.location;
    const position = terrain.position;
    const poster = terrain.poster;
    const idType = db
      .prepare("SELECT idType FROM typeTerrain WHERE type= ?")
      .get(type).idType;
    insertTerrain.run(nameTerrain, idType, location, position, poster);
  }

  console.log('Tables "typeTerrain" and "terrain" populated successfully.');
}

function getReservationsByUserId(idUser) {
  let query = db.prepare(
    "SELECT idReservation FROM payment WHERE idUser =? AND idReservation IS NOT NULL"
  );
  const reservations = query.all(idUser);

  return reservations;
}

function getReservationContent(idReservation) {
  let query = db.prepare(
    "SELECT idTerrain, startTime, endTime, dateReservation, isCanceled FROM reservation WHERE idReservation =?"
  );
  const reservationsContent = query.all(idReservation);

  return reservationsContent;
}

function getNameTerrainById(idTerrain) {
  let query = db.prepare(
    "SELECT nameTerrain, idType, location FROM terrain WHERE idTerrain =?"
  );
  const nameTerrain = query.all(idTerrain);

  return nameTerrain;
}

function createPublication(idUser, datePublication, titre, content) {
  const formattedDate = datePublication.toISOString();
  const query = db.prepare(
    "INSERT INTO publication (idUser,datePublication,titre,content) VALUES (?,?,?,?)"
  );
  const pubId = query.run([idUser, formattedDate, titre, content]);
  return pubId;
}

function getPublications() {
  const query = db.prepare("SELECT * FROM publication");
  const publications = query.all();

  return publications;
}

function createComment(idPublication, idUser, dateComment, content) {
  const formattedDate = dateComment.toISOString();
  const query = db.prepare(
    "INSERT INTO comment (idPublication,idUser,dateComment,content) VALUES (?,?,?,?)"
  );
  const commentId = query.run([idPublication, idUser, formattedDate, content]);
  return commentId;
}

function getComments() {
  const query = db.prepare("SELECT * FROM comment");
  const comments = query.all();

  return comments;
}

function getUsers() {
  const query = db.prepare(
    "SELECT idUser, firstName, lastName, photo FROM user"
  );
  const users = query.all();

  return users;
}

module.exports = {
  create_user,
  get_email,
  login,
  get_userpassword,
  add_contact_info,
  get_userbytoken,
  confirmUserEmail,
  verifyConfirmation,
  resetPassword,
  edit_profile,
  edit_profile_without_picture,
  change_password,
  create_reservation,
  add_payment,
  populateTablesTerrain,
  getUserProfile,
  get_email_forReservation,
  Evaluate,
  calculateAverageRating,
  get_evaluations,
  get_dateEvaluation,
  get_idUser_byContent,
  get_user_info,
  cancelReservation,
  createPublication,
  get_type_terrain,
  verifyReservation,
  getReservationsByUserId,
  getReservationContent,
  getNameTerrainById,
  getPublications,
  createComment,
  getComments,
  getUsers,
};
