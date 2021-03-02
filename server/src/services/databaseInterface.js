//import path from "path";
import mysql from "mysql";
import Template from "./../models/Template.js";
import User from "./../models/User.js";
import config from "./../../config/sqlconfig.js";

export class SQLInterface {
   constructor() {}

   static getProfilePath(id) {
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         con.query(
            "SELECT profilePath FROM templates WHERE id = ?",
            [id],
            (err, rows) => {
               if (err) throw err;
               resolve(rows[0].profilePath);
            }
         );
         resolve(null);
      });
   }

   static getAllTemplates() {
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         con.query("SELECT * FROM templates", (err, rows) => {
            if (err) throw err;
            let toReturn = [rows.length];
            for (i = 0; i < rows.length; i++) {
               toReturn[i] = new Template();
               toReturn[i].id = rows[i].id;
               toReturn[i].name = rows[i].profileName;
               toReturn[i].timestamp = rows[i].timestamp;
               toReturn[i].image.os = rows[i].imageName;
               toReturn[i].image.version = rows[i].version;
               toReturn[i].image.description = rows[i].imageDescription;
               toReturn[i].description = rows[i].profileDescription;
            }
            resolve(toReturn);
         });
      });
   }

   static addNewTemplate(template, templatePath) {
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         con.query(
            "INSERT INTO templates (id, timestamp, profileName, imageName, version, profileDescription, imageDescription, profilePath) VALUES (NULL, 'CURRENT_TIMESTAMP(6).000000', ?, ?, ?, ?, ?, ?)",
            [
               (template.name,
               template.image.os,
               template.image.version,
               template.description,
               template.image.description,
               templatePath),
            ], // by default user is standart user
            (err, rows) => {
               if ((err.code = "ER_DUP_ENTRY")) {
                  console.log("Template is already stored in DB");
               } else if (err) {
                  throw err;
               }
               resolve("done");
            }
         );
      });
   }

   static getUserByEmail(email) {
      console.log(email);
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         con.query(
            "SELECT * FROM users WHERE email LIKE ?",
            [email], // by default user is standart user
            (err, rows) => {
               if (err) throw err;
               let user = new User();
               console.log(rows[0]);
               user.id = rows[0].id;
               user.email = rows[0].email;
               user.familyName = rows[0].family_name;
               user.givenName = rows[0].given_name;
               user.role = rows[0].role;
               resolve(user);
            }
         );
      });
   }

   static getUserByID(id) {
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         con.query(
            "SELECT * FROM users WHERE id LIKE ?",
            [id], // by default user is standart user
            (err, rows) => {
               if (err) throw err;
               let user = new User();

               user.id = rows[0].id;
               user.email = rows[0].email;
               user.familyName = rows[0].family_name;
               user.givenName = rows[0].given_name;
               user.role = rows[0].role;
               resolve(user);
            }
         );
      });
   }

   /*
    * adds new user do database
    *
    */
   static addNewUserToDatabaseAndReturnIt(user) {
      return new Promise((resolve) => {
         const con = mysql.createConnection(config);
         console.log("Added new user");
         con.query(
            "INSERT INTO users (id, email, given_name, family_name, role) VALUES (NULL,?,?,?,?);",
            [user.emails[0].value, user.name.givenName, user.name.familyName, 0], // by default user is standart user
            (err, rows) => {
               if ((err.code = "ER_DUP_ENTRY")) {
                  console.log("User is already stored in DB");
               } else if (err) {
                  throw err;
               }
            }
         );
         con.query(
            "SELECT * FROM users WHERE email LIKE ?",
            [user.emails[0].value], // by default user is standart user
            (err, rows) => {
               if (err) throw err;
               let user = new User();
               user.id = rows[0].id;
               user.email = rows[0].email;
               user.familyName = rows[0].family_name;
               user.givenName = rows[0].given_name;
               user.role = rows[0].role;
               resolve(user);
            }
         );
      });
   }
}
