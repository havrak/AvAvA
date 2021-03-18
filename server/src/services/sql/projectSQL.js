import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "../../models/Limits.js";
import config from "./../../../config/sqlconfig.js";
import CreateProjectJSON from "../../models/CreateProjectJSONObj.js";
import CreateProjectJSONObj from "../../models/CreateProjectJSONObj.js";

export default class projectSQL {
  static createCreateProjectData(email) {
    console.log(email);
    return new Promise((resolve) => {
      let userLimits;
      const con = mysql.createConnection(config);
      con.query(
        "SELECT * FROM usersResourcesLimits WHERE user_email=?",
        [email],
        (err, rows) => {
          if (err) throw err;
          userLimits = new Limits(
            rows[0].RAM,
            rows[0].CPU,
            rows[0].disk,
            rows[0].upload,
            rows[0].download
          );
          console.log(userLimits);
          con.query(
            "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON project_id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=?",
            [email], // by default user is standart user
            (err, rows) => {
              if (err) throw err;
              console.log(rows.length);
              for (let i = 0; i < rows.length; i++) {
                userLimits.RAM -= rows[i].ram;
                userLimits.CPU -= rows[i].cpu;
                userLimits.disk -= rows[i].disk;
                userLimits.upload -= rows[i].upload;
                userLimits.download -= rows[i].download;
              }
              console.log(userLimits);
              resolve(userLimits);
            }
          );
        }
      );
    });
  }
  static createCreateProjectJSON(email, config) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(config);
      let currentFreeSpace;
      this.createCreateProjectData(email).then((result) => {
        currentFreeSpace = result;
        if (
          config.RAM > currentFreeSpace.RAM ||
          config.CPU > currentFreeSpace.CPU ||
          config.disk > currentFreeSpace.disk ||
          config.upload > currentFreeSpace.upload ||
          config.download > currentFreeSpace.download
        ) {
          resolve(500);
        }
        con.query(
          "INSERT INTO projects (id, name, owner_email, timestamp) VALUES (NULL,?,?,NULL);",
          [config.name, email],
          (err, rows) => {
            if (err) throw err;
            console.log(rows.insertId);
            let projectId = rows.insertId;
            con.query(
              "INSERT INTO projectsResourcesLimits (project_id, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?)",
              [
                projectId,
                string(config.RAM),
                config.CPU,
                config.disk,
                config.network.upload,
                config.network.download,
              ],
              (err, rows) => {
                resolve(
                  new CreateProjectJSONObj(
                    projectId,
                    string(config.RAM) + "b",
                    string(config.disk) + "b"
                  )
                );
              }
            );
          }
        );
      });
    });
  }
  // it is only necessary to remove project, containers will remove automatically thanks to cascade dependency
  static removeProject(id) {
    return new Promise((resove) => {
      const con = mysql.createConnection(config);
      con.query(
        "DELETE FROM projects WHERE project.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
        }
      );
    });
  }

  static getIdOfContainersInProject(id) {
    return new Promise((resove) => {
      const con = mysql.createConnection(config);
      con.query(
        "SELECT container.id FROM projects LEFT JOIN containers ON container.project_id = project.id WHERE project.id =?",
        [id],
        (err, rows) => {
          if (err) throw err;
          resolve(rows);
        }
      );
    });
  }
}
