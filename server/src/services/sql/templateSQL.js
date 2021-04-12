import mysql from "mysql";
import sqlconfig from "./../../../config/sqlconfig.js";
import Template from "./../../models/Template.js";
import User from "./../../models/User.js";
import ApplicationToInstall from "../../models/ApplicationToInstall.js";
import Image from "../../models/Image.js";
import OperationState from "../../models/OperationState.js";

export default class templateSQL {
  /**
   * looks up path of profile
   * @param {id} id of profile
   *
   * @return String path to profile
   */
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
      con.end();
    });
  }

  /**
   * looks up template by his id
   * @params {id} id of template
   *
   * @returns Template
   */
  static getTemplate(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM templates WHERE id=?", [id], (err, rows) => {
        if (err) throw err;
        let toReturn = new Template(
          rows[0].id,
          rows[0].profile_name,
          rows[0].timestamp,
          new Image(
            rows[0].image_name,
            rows[0].version,
            rows[0].image_description
          ),
          rows[0].profile_description,
          rows[0].min_disk_size
        );
        resolve(toReturn);
        con.end();
      });
    });
  }
  /**
   * searches database for all templates that can be used to create container with
   *
   * @return Template
   */
  static getAllTemplates() {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT * FROM templates", (err, rows) => {
        if (err) throw err;
        let toReturn = new Array(rows.length);
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
        con.end();
        resolve(toReturn);
      });
    });
  }
  /*
   * adds new template to database
   * @param template - template object corresponding to new templates
   * @param templatePath - path to new template
   */
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
          resolve(new OperationState("added", 200));
          con.end();
        }
      );
    });
  }
  /**
   * searches databse for all apps available to be installed on new machine
   *
   * @return array of ApplicationToInstall
   */
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
        con.end();
      });
    });
  }
}
