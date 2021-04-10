import mysql from "mysql";
import sqlconfig from "./../../../config/sqlconfig.js";
import Template from "./../../models/Template.js";
import User from "./../../models/User.js";
import ApplicationToInstall from "../../models/ApplicationToInstall.js";
import Image from "../../models/Image.js";

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

  static getTemplate(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM templates WHERE id=?", [id], (err, rows) => {
        if (err) throw err;
        let toReturn = new Template(
          row.id,
          row.profile_name,
          row.timestamp,
          new Image(row.image_name, row.version, row.image_description),
          row.profile_description,
          row.min_disk_size
        );
        resolve(toReturn);
      });
    });
  }

  static getAllTemplates() {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM templates", (err, rows) => {
        if (err) throw err;
        let toReturn = [rows.length];
        rows.forEach((row, index) => {
          toReturn[index] = new Template(
            row.id,
            row.profile_name,
            row.timestamp,
            new Image(row.image_name, row.version, row.image_description),
            row.profile_description,
            row.min_disk_size
          );
        });
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
            row.icon_path
          );
        });
        resolve(toReturn);
      });
    });
  }
}
