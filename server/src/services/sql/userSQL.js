import mysql from "mysql";
import User from "./../../models/User.js";
import sqlconfig from "./../../../config/sqlconfig.js";
import https from "https";
import fs from "fs";

export default class userSQL {
  static getUserByEmail(email) {
    console.log(email);
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM users WHERE email LIKE ?",
        [email], // by default user is standart user
        (err, rows) => {
          if (err) throw err;
          resolve(
            new User(
              rows[0].id,
              rows[0].email,
              rows[0].given_name,
              rows[0].family_name,
              rows[0].role,
              rows[0].icon,
              rows[0].coins
            )
          );
        }
      );
    });
  }

  static getUserByID(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM users WHERE id LIKE ?",
        [id], // by default user is standart user
        (err, rows) => {
          if (err) throw err;
          resolve(
            new User(
              rows[0].id,
              rows[0].email,
              rows[0].given_name,
              rows[0].family_name,
              rows[0].role,
              rows[0].icon,
              rows[0].coins
            )
          );
        }
      );
    });
  }
  static getAllUsersWorkingOnAProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projectsCoworkers LEFT JOIN users ON users.email=projectsCoworkers.user_email WHERE project_id=?",
        [id],
        (err, rows) => {
          //
          let toReturn = [rows.length];
          rows.forEach((row, index) => {
            toReturn[index] = new User(
              row.id,
              row.email,
              row.given_name,
              row.family_name,
              row.role,
              row.icon,
              row.coins
            );
          });
          resolve(toReturn);
        }
      );
    });
  }
  /*
   * adds new user do database
   * TODO: add record to usersResourcesLimits
   */
  static addNewUserToDatabaseAndReturnIt(user) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      console.log("Added new user");
      con.query(
        "INSERT INTO users (id, email, given_name, family_name, icon, role, coins) VALUES (NULL,?,?,?,?,0,0);",
        [
          user.emails[0].value,
          user.name.givenName,
          user.name.familyName,
          user.photos[0].value,
        ], // by default user is standart user
        (err, rows) => {
          console.log(err);
          if (err && err.code == "ER_DUP_ENTRY") {
            console.log("User is already stored in DB");
          } else if (err) {
            throw err;
          } else
            con.query(
              "INSERT INTO usersResourcesLimits (user_email, ram, cpu, disk, upload, download)",
              [
                user.emails[0].value,
                2147483648,
                10,
                10737418240,
                100000000,
                100000000,
              ],
              (err, rows) => {
                if (err) throw err;
              }
            );
        }
      );
      con.query(
        "SELECT * FROM users WHERE email LIKE ?",
        [user.emails[0].value], // by default user is standart user
        (err, rows) => {
          if (err) throw err;

          // due to the link to profile picture not being permanent it is necessary to download it

          //const file = fs.createWriteStream("" + rows[0].id + ".jpg");
          //const request = https.get(rows[0].icon, function (response) {
          //  response.pipe(file);
          //});
          resolve(
            new User(
              rows[0].id,
              rows[0].email,
              rows[0].given_name,
              rows[0].family_name,
              rows[0].role,
              rows[0].icon,
              rows[0].coins
            )
          );
        }
      );
    });
  }
}
