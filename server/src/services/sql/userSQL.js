import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "./../../models/Limits.js";
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
          con.end();
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

  static getUsersLimits(email) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM usersResourcesLimits WHERE user_email=?",
        [email],
        (err, rows) => {
          if (err) throw err;
          if (rows != undefined) {
            con.end();
            resolve(
              new Limits(
                rows[0].ram,
                rows[0].cpu,
                rows[0].disk,
                rows[0].upload,
                rows[0].download
              )
            );
          }
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
          con.end();
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

  static getAllUsersProjects(email) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT GROUP_CONCAT(id) AS ids FROM projects WHERE owner_email=?",
        [email],
        (err, rows) => {
          con.end();
          resolve(rows[0].ids.split(","));
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
          con.end();
          resolve(toReturn);
        }
      );
    });
  }

  static doesUserOwnGivenContainer(email, id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers WHERE containers.id=?",
        [id],
        (err, rows) => {
          this.doesUserOwnGivenProject(email, rows[0].project_id).then(
            (result) => {
              con.end();
              resolve(result);
            }
          );
        }
      );
    });
  }

  static doesUserOwnGivenProject(email, id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projects LEFT JOIN users ON projects.owner_email=users.email LEFT JOIN projectsCoworkers ON projectsCoworkers.project_id=projects.id WHERE projects.id=? AND owner_email=? OR user_email=?",
        [id, email, email],
        (err, rows) => {
          if (err) throw err;
          con.end();
          if (rows.length > 0) resolve(true);
          else resolve(false);
        }
      );
    });
  }

  /*
   * adds new user do database
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
        ],
        (err, rows) => {
          console.log(err);
          if (err && err.code == "ER_DUP_ENTRY") {
            console.log("User is already stored in DB");
          } else if (err) {
            throw err;
          } else
            con.query(
              "INSERT INTO usersResourcesLimits (user_email, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
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
        [user.emails[0].value],
        (err, rows) => {
          if (err) throw err;
          con.end();
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
