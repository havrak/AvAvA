import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "../../models/Limits.js";
import sqlconfig from "./../../../config/sqlconfig.js";
import CreateProjectJSON from "../../models/CreateProjectJSONObj.js";
import CreateProjectJSONObj from "../../models/CreateProjectJSONObj.js";

export default class projectSQL {
  static createCreateProjectData(email) {
    return new Promise((resolve) => {
      let userLimits;
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM usersResourcesLimits WHERE user_email=?",
        [email],
        (err, rows) => {
          console.log(rows);
          if (err) throw err;
          userLimits = new Limits(
            rows[0].ram,
            rows[0].cpu,
            rows[0].disk,
            rows[0].upload,
            rows[0].download
          );
          console.log(userLimits);
          con.query(
            "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projects.id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=?",
            [email], // by default user is standart user
            (err, rows) => {
              if (err) throw err;
              for (let i = 0; i < rows.length; i++) {
                if (rows[i].ram != null) {
                  userLimits.RAM -= rows[i].ram;
                  userLimits.CPU -= rows[i].cpu;
                  userLimits.disk -= rows[i].disk;
                  userLimits.network.upload -= rows[i].upload;
                  userLimits.network.download -= rows[i].download;
                } else {
                  // we need to get all containers in given
                  console.log("asdsad");
                }
              }
              resolve(userLimits);
            }
          );
        }
      );
    });
  }
  static createCreateProjectJSON(email, config) {
    return new Promise((resolve) => {
      let currentFreeSpace;
      this.createCreateProjectData(email).then((result) => {
        currentFreeSpace = result;
        if (
          config.customLimits.RAM > currentFreeSpace.RAM ||
          config.customLimits.CPU > currentFreeSpace.CPU ||
          config.customLimits.disk > currentFreeSpace.disk ||
          config.customLimits.network.upload >
            currentFreeSpace.network.upload ||
          config.customLimits.network.download >
            currentFreeSpace.network.download
        ) {
          resolve(500);
        }
        console.log(email);
        const con = mysql.createConnection(sqlconfig);
        con.query("SELECT * FROM users", (err, rows) => {
          if (err) throw err;
          console.log(rows);
        });

        con.query(
          "INSERT INTO projects (name, owner_email) VALUES (?,?)",
          [config.name, email],
          (err, rows) => {
            if (err) throw err;
            console.log(rows.insertId);
            let projectId = rows.insertId;
            console.log(projectId);
            con.query(
              "INSERT INTO projectsResourcesLimits (project_id, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
              [
                projectId,
                config.customLimits.RAM,
                config.customLimits.CPU,
                config.customLimits.disk,
                config.customLimits.network.upload,
                config.customLimits.network.download,
              ],
              (err, rows) => {
                if (err) throw err;
                resolve(
                  new CreateProjectJSONObj(
                    projectId,
                    config.customLimits.RAM + "B",
                    config.customLimits.disk + "B"
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
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "DELETE FROM projects WHERE project.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          resolve(1);
        }
      );
    });
  }

  static getIdOfContainersInProject(id) {
    return new Promise((resove) => {
      const con = mysql.createConnection(sqlconfig);
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
