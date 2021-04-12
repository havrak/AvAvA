import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "../../models/Limits.js";
import sqlconfig from "./../../../config/sqlconfig.js";
import CreateProjectJSONObj from "../../models/CreateProjectJSONObj.js";
import Project from "../../models/Project.js";
import containerSQL from "./containerSQL.js";
import userSQL from "./userSQL.js";
import OperationState from "../../models/OperationState.js";

export default class projectSQL {
  /* returns Limits object with free space available for new project
   * params: email - email of user to whom limit is calculated
   *
   * returns: Limits - free space available for project
   */
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
          con.query(
            "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projects.id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=?",
            [email],
            (err, rows) => {
              if (err) throw err;
              for (let i = 0; i < rows.length; i++) {
                if (rows[i].ram != null) {
                  // project can be withou limits
                  userLimits.RAM -= rows[i].ram;
                  userLimits.CPU -= rows[i].cpu;
                  userLimits.disk -= rows[i].disk;
                  userLimits.internet.upload -= rows[i].upload;
                  userLimits.internet.download -= rows[i].download;
                } else {
                  let wait = true;
                  con.query(
                    // find limits of all contnainers in project whose limits are null and substract them from userLimits
                    "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containersResourcesLimits.container_id=containers.id WHERE containers.project_id=?",
                    [rows[i].project_id],
                    (err, rows) => {
                      if (err) throw err;
                      if (rows[0] == undefined) {
                        wait = false;
                      } else {
                        rows[0].forEach((row) => {
                          userLimits.RAM -= row.ram;
                          userLimits.CPU -= row.cpu;
                          userLimits.disk -= row.disk;
                          userLimits.internet.upload -= row.upload;
                          userLimits.internet.download -= row.download;
                        });
                        wait = false;
                      }
                    }
                  );
                  while (wait) sleep(1);
                }
              }
              resolve(userLimits);
            }
          );
        }
      );
    });
  }

  /* creates JSON that will be send to lxd in oder to create new project
   * params: 	email - email of owner of new project
   *   				config - configuration of new container
   *
   * result: CreateProjectJSONObj
   */
  static createCreateProjectJSON(email, config) {
    return new Promise((resolve) => {
      let currentFreeSpace;
      this.createCreateProjectData(email).then((result) => {
        currentFreeSpace = result;
        if (
          config.limits.RAM > currentFreeSpace.RAM ||
          config.limits.CPU > currentFreeSpace.CPU ||
          config.limits.disk > currentFreeSpace.disk ||
          config.limits.internet.upload > currentFreeSpace.internet.upload ||
          config.limits.internet.download > currentFreeSpace.internet.download
        ) {
          console.log(currentFreeSpace);
          resolve(new OperationState("Project limit exceeds current max", 400));
          return;
        }
        const con = mysql.createConnection(sqlconfig);

        con.query(
          "INSERT INTO projects (name, owner_email) VALUES (?,?)",
          [config.name, email],
          (err, rows) => {
            if (err) throw err;
            let projectId = rows.insertId;
            con.query(
              "INSERT INTO projectsResourcesLimits (project_id, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
              [
                projectId,
                config.limits.RAM,
                config.limits.CPU,
                config.limits.disk,
                config.limits.internet.upload,
                config.limits.internet.download,
              ],
              (err, rows) => {
                if (err) throw err;
                if (config.limits.RAM == null) {
                  con.end();
                  resolve(new CreateProjectJSONObj(projectId, null, null));
                } else {
                  resolve(
                    new CreateProjectJSONObj(
                      projectId,
                      config.limits.RAM + "B",
                      config.limits.disk + "B" // lxd is broken and no container can be created when this limit is set. All attempt to create one will result in error with disk size bein
                    )
                  );
                }
              }
            );
          }
        );
      });
    });
  }
  /* creates Project object with data about given project
   * params: id - id of project in question
   *
   * returns: Project - project object with all data available from databse about it, rest is filled in by lxd
   */
  static createProjectObject(id) {
    console.log(id);
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT projects.id AS projectId,  name, owner_email, timestamp, project_id, ram, cpu, disk, upload, download, users.id AS userId, email, given_name, family_name, icon, role, coins FROM projects LEFT JOIN projectsResourcesLimits ON projects.id=projectsResourcesLimits.project_id LEFT JOIN users as users ON users.email=projects.owner_email WHERE projects.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          // query for coworkers
          let toReturn = new Project(
            id,
            rows[0].name,
            new User(
              rows[0].userId,
              rows[0].email,
              rows[0].given_name,
              rows[0].family_name,
              rows[0].role,
              rows[0].icon,
              rows[0].coins
            ),
            new Limits(
              rows[0].ram,
              rows[0].cpu,
              rows[0].disk,
              rows[0].upload,
              rows[0].download
            ),
            rows[0].timestamp,
            undefined,
            undefined
          );
          containerSQL.getAllContainersInProject(id).then((result) => {
            toReturn.containers = result;
            userSQL.getAllUsersWorkingOnAProject(id).then((result) => {
              toReturn.coworkers = result;
              con.end();
              resolve(toReturn);
            });
          });
        }
      );
    });
  }

  /* removes project form databe
   * params: id - id of project in question
   */
  static removeProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "DELETE FROM projects WHERE projects.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          con.end();
          resolve(1);
        }
      );
    });
  }

  /* return array of id of containers in give project
   * params: id - id of project in question
   *
   * returns: array - filled with ids of containers
   */
  static getIdOfContainersInProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT GROUP_CONCAT(id) AS ids FROM containers WHERE project_id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          console.log(rows);
          resolve(rows[0].ids == null ? new Array() : rows[0].ids.split(","));
        }
      );
    });
  }
}
