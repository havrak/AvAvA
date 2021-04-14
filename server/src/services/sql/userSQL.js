import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "./../../models/Limits.js";
import containerSQL from "./containerSQL.js";
import sqlconfig from "./../../../config/sqlconfig.js";
import systemconfig from "./../../../config/systemconfig.js";
import https from "https";
import fs from "fs";

export default class userSQL {
  /**
   * looks up user by his email
   * @params email - email of user for which object will be created
   *
   * @returns User
   */
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
  /**
   * looks up limits of user given in arguments
   * @param email - email of user to which limits object corresponds
   *
   * @return Limits - limits of given user
   */
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
  /**
   * looks up user by his id
   * @param id - id of user to which User object corresponds
   *
   * @return User
   */
  static getUserByID(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM users WHERE id LIKE ?", [id], (err, rows) => {
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
      });
    });
  }
  /**
   * finds in what project user is listed as owner
   * @param email - email of user which projects this methods looks for
   *
   * @return array - contains ids of projects
   */
  static getAllUsersProjects(email) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT GROUP_CONCAT(id) AS ids FROM projects WHERE owner_email=?",
        [email],
        (err, rows) => {
          con.end();
          if (rows[0].ids == undefined) resolve(new Array());
          else resolve(rows[0].ids.split(","));
        }
      );
    });
  }
  /**
   * find what User are listed as coworkers on give project
   * @params id - id of project
   *
   * @return array of Users - coworkers on project
   */
  static getAllUsersWorkingOnAProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projectsCoworkers LEFT JOIN users ON users.email=projectsCoworkers.user_email WHERE project_id=?",
        [id],
        (err, rows) => {
          //
          let toReturn = new Array(rows.length);
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
  /**
   * checks whether user is owner or coworker on given container
   * @param	email - email of user
   * @param	id - id of container
   *
   * @return boolean - true of owner has permission to the container
   */
  static doesUserOwnGivenContainer(email, id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      containerSQL.getProjectIdOfContainer(id).then((result) => {
        if (result.statusCode == 400) {
          resolve(false);
        } else
          this.doesUserOwnGivenProject(email, result).then(
            // if user is listed as owner or coworker on project to which container belongs he also has permission to modify such container
            (result) => {
              con.end();
              resolve(result);
            }
          );
      });
    });
  }

  /**
   * return true if given user is owner or coworker on given project
   * @param	email - email of user
   * @param id - id of project
   *
   * @return boolean - true of owner has permission to the project
   */
  static doesUserOwnGivenProject(email, id) {
    console.log(email + " project id " + id);

    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projects LEFT JOIN users ON projects.owner_email=users.email LEFT JOIN projectsCoworkers ON projectsCoworkers.project_id=projects.id WHERE owner_email=? OR user_email=? AND projects.id=?", // SQL is rather strange looking however owner isn't stated in coworkers thus two different email field need to be checked
        [email, email, id],
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
   * @param User - user from google auth
   *
   * @return User - object of user just added into the database
   */
  static addNewUserToDatabaseAndReturnIt(user) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "INSERT INTO users (id, email, given_name, family_name, icon, role, coins) VALUES (NULL,?,?,?,?,0,0);",
        [
          user.emails[0].value,
          user.name.givenName,
          user.name.familyName,
          user.photos[0].value,
        ],
        (err, rows) => {
          if (err && err.code == "ER_DUP_ENTRY") {
            // this method is called every time one user authenticates
            console.log("User is already stored in DB");
            this.getUserByEmail(user.emails[0].value).then((result) => {
              resolve(result);
            });
          } else if (err) {
            throw err;
          } else {
            con.query(
              "INSERT INTO usersResourcesLimits (user_email, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
              [
                user.emails[0].value,
                systemconfig.defaultRamLimit,
                systemconfig.frequency / systemconfig.defaultCouFraction,
                systemconfig.defaultDiskSize,
                systemconfig.defaultUpload,
                systemconfig.defaultDownload,
              ],
              (err, rows) => {
                if (err) throw err;
              }
            );
            resolve(
              new User(
                rows.insertId,
                rows[0].email,
                rows[0].given_name,
                rows[0].family_name,
                rows[0].role,
                rows[0].icon,
                rows[0].coins
              )
            );
          }
        }
      );
    });
  }
}
