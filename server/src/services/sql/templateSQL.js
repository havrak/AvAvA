import mysql from "mysql";
import sqlconfig from "./../../../config/sqlconfig.js";
import Template from "./../../models/Template.js";
import User from "./../../models/User.js";
import ApplicationToInstall from "../../models/ApplicationToInstall.js";

export default class templateSQL {
  constructor() {}

  static getProfilePath(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
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
      const con = mysql.createConnection(sqlconfig);
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
      const con = mysql.createConnection(sqlconfig);
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
  static getAllAppsToInstall() {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM appsToInstall", (err, rows) => {
        if (err) throw err;
        let toReturn = [rows.length];
        rows.forEach((row, index) => {
          toReturn[index] = new ApplicationToInstall(
            row.id,
            row.name,
            row.description,
            row.icon
          );
        });
        resolve(toReturn);
      });
    });
  }
}
