"use strict";
const sqlite = require("better-sqlite3");
let db = new sqlite("../Model/db.sqlite");

//----------------------------CHECK IF DATA EXIST +CREATE DATA----------------------------------------

db.prepare("DROP TABLE IF EXISTS user").run();
db.prepare("DROP TABLE IF EXISTS contact").run();
db.prepare("DROP TABLE IF EXISTS terrain").run();
db.prepare("DROP TABLE IF EXISTS typeTerrain").run();
db.prepare("DROP TABLE IF EXISTS reservation").run();
db.prepare("DROP TABLE IF EXISTS payment").run();

db.prepare(
  "CREATE TABLE  user(idUser INTEGER PRIMARY KEY AUTOINCREMENT ,firstName TEXT ,lastName TEXT ,email TEXT UNIQUE ,password TEXT ,token INTEGER ,isEmailConfirmed INTEGER DEFAULT 0 ,address TEXT DEFAULT NULL ,phoneNumber TEXT DEFAULT NULL , level TEXT DEFAULT NULL , sport TEXT DEFAULT NULL , photo TEXT DEFAULT NULL, gender TEXT DEFAULT NULL )"
).run();

db.prepare("CREATE TABLE contact(name TEXT, email TEXT,message TEXT) ").run();

db.prepare(
  "CREATE TABLE typeTerrain(idType INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT UNIQUE, price INTEGER) "
).run();

db.prepare(
  "CREATE TABLE terrain( idTerrain INTEGER PRIMARY KEY AUTOINCREMENT, nameTerrain TEXT, idType INTEGER, location TEXT, position TEXT, poster TEXT, FOREIGN KEY (idType) REFERENCES typeTerrain (idType)) "
).run();

db.prepare(
  "CREATE TABLE reservation(idReservation  INTEGER PRIMARY KEY AUTOINCREMENT, idTerrain INTEGER REFERENCES terrain(idTerrain) , startTime TIMESTAMP(0), endTime TIMESTAMP(0), dateReservation TIMESTAMP(0), isCanceled BOOLEAN DEFAULT 0)"
).run();

db.prepare(
  'CREATE TABLE payment(idPayment INTEGER PRIMARY KEY AUTOINCREMENT, idReservation INTEGER REFERENCES reservation(idReservation) , idUser INTEGER REFERENCES user(idUser), datePayment TIMESTAMP(0) , statut TEXT DEFAULT "unpaid")'
).run();

db.prepare(
  "CREATE TABLE comment(idComment INTEGER PRIMARY KEY AUTOINCREMENT, idPublication  INTEGER REFERENCES publication(idPublication), idUser INTEGER REFERENCES user(idUser), dateComment TIMESTAMP(0), content TEXT)"
).run();
db.prepare(
  "CREATE TABLE evaluation (idEvaluation INTEGER PRIMARY KEY AUTOINCREMENT, idUser INTEGER REFERENCES user(idUser), idTerrain INTEGER REFERENCES terrain(idTerrain), content TEXT, rating INTEGER , dateEvaluation TIMESTAMP(0))"
).run();

db.prepare(
  "CREATE TABLE publication(idPublication INTEGER PRIMARY KEY AUTOINCREMENT, idUser INTEGER REFERENCES user(idUser), datePublication TIMESTAMP(0), titre TEXT, content TEXT)"
).run();

const model = require("../Model/model.js");
model.populateTablesTerrain();
