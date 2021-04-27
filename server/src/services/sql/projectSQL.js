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
  /**
   * looks up free space in user account
   * @param email - email of user to whom limit is calculated
   *
   * @return Limits - free space available for project
   */
  static createCreateProjectData(email, id) {
    return new Promise((resolve) => {
      let userLimits;
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM usersResourcesLimits WHERE user_email=?",
        [email],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            resolve(
              new OperationState(
                "User doesn't exist or doesn't have limits",
                400
              )
            );
          }
          userLimits = new Limits(
            rows[0].ram,
            rows[0].cpu,
            rows[0].disk,
            rows[0].upload,
            rows[0].download
          );
          let queryCommand =
            "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projects.id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=?";
          if (id != null) {
            queryCommand =
              "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projects.id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=? AND projects.id !=?";
          }
          con.query(queryCommand, [email, id], (err, rows) => {
            //check if this works
            if (err) throw err;
            let counter = 0; // variable to make sure all projects of user are checked as con.query is synchronous
            let desiredCount = rows.length;
            for (let i = 0; i < rows.length; i++) {
              if (rows[i].ram != null) {
                userLimits.RAM -= rows[i].ram;
                userLimits.CPU -= rows[i].cpu;
                userLimits.disk -= rows[i].disk;
                userLimits.internet.upload -= rows[i].upload;
                userLimits.internet.download -= rows[i].download;
                if (++counter == desiredCount) {
                  console.log(resolve);
                  con.end();
                  resolve(userLimits);
                }
              } else {
                // for project that doesn't have  limits it is necessary to check all its container
                con.query(
                  "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containersResourcesLimits.container_id=containers.id WHERE containers.project_id=?",
                  [rows[i].project_id],
                  (err, rows) => {
                    if (err) throw err;
                    if (rows[0] != undefined) {
                      rows.forEach((row) => {
                        userLimits.RAM -= row.ram;
                        userLimits.CPU -= row.cpu;
                        userLimits.disk -= row.disk;
                        userLimits.internet.upload -= row.upload;
                        userLimits.internet.download -= row.download;
                      });
                    }
                    if (++counter == desiredCount) {
                      con.end();
                      resolve(userLimits);
                    }
                  }
                );
              }
              // wait till query finishes, TODO: come up with more elegant method, but this seems to work.
            }
            if (rows.length == 0) resolve(userLimits);
          });
        }
      );
    });
  }
  /**
   * check whether limits increased and if it is possilbe updates them, same also applyes for name
   * @param newLimits - object got from api route
   * @param id - id of container
   * @params email - email of user
   *
   */
  static updateProjectLimits(newLimits, id, email) {
    return new Promise((resolve) => {
      //TODO Enable limits to be also decreased
      const con = mysql.createConnection(sqlconfig);
      let nameChange = false; // haproxy will need to be regenerate after name change
      con.query(
        "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projectsResourcesLimits.project_id=projects.id WHERE project_id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            con.end();
            resolve(new OperationState("Project doesn't exist", 400));
            return;
          }
          if (rows[0].name != newLimits.name) {
            nameChange = true;
            con.query(
              "UPDATE projects SET name=? WHERE projects.id=?",
              [newLimits.name, id],
              (err, rows) => {
                if (err) throw err;
              }
            );
          }
          let minimalLimits = newLimits(0, 0, 0, 0, 0);
          if (rows[0].ram == null) {
            con.query(
              "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containersResourcesLimits.container_id=containers.id WHERE containers.project_id=?",
              [id],
              (err, rows) => {
                rows.forEach((row, index) => {
                  minimalLimits.subtractFromLimits(
                    row.ram,
                    row.cpu,
                    row.disk,
                    row.upload,
                    row.download
                  );
                });
              }
            );
            // need to check minimal size
          }
          let ramChange = newLimits.limits.RAM - rows[0].ram;
          let cpuChange = newLimits.limits.CPU - rows[0].cpu;
          let diskChange = newLimits.limits.disk - rows[0].disk;
          let uploadChange = newLimits.limits.internet.upload - rows[0].upload;
          let downloadChange =
            newLimits.limits.internet.download - rows[0].download;
          if (
            ramChange >= 0 &&
            cpuChange >= 0 &&
            diskChange >= 0 &&
            uploadChange >= 0 &&
            downloadChange >= 0
          ) {
            this.createCreateProjectData(email, id).then((result) => {
              // should take into account containers that are in the projects
              // console.log("free space to create new project");
              // console.log(result);
              // console.log("currentProjectLimits");
              // console.log(rows[0]);
              // console.log("desired limits");
              // console.log(newLimits);

              if (
                ramChange <= result.RAM &&
                cpuChange <= result.CPU &&
                diskChange <= result.disk &&
                uploadChange <= result.internet.upload &&
                downloadChange <= result.internet.download
              ) {
                con.query(
                  "UPDATE projectsResourcesLimits SET ram=?, cpu=?, disk=?, upload=?, download=? WHERE project_id=?",
                  [
                    newLimits.limits.RAM,
                    newLimits.limits.CPU,
                    newLimits.limits.disk,
                    newLimits.limits.internet.upload,
                    newLimits.limits.internet.download,
                    id,
                  ],
                  (err, rows) => {
                    if (err) throw err;
                    console.log("update successful");
                    resolve({
                      status: "Limits successfully updated",
                      statusCode: 200,
                      haproxy: nameChange,
                    });
                  }
                );
              } else {
                resolve({
                  // essentially OperationState, but with haproxy added
                  status: "Not enough free space",
                  statusCode: 400,
                  haproxy: nameChange,
                });
              }
            });
          } else {
            resolve({
              status: "Currently on increase is supported",
              statusCode: 400,
              haproxy: nameChange,
            });
          }
        }
      );
    });
  }
  /**
   * creates JSON that will be send to lxd in oder to create new project, new project is also stored in database
   * @param	email - email of owner of new project
   * @param	config - configuration of new container
   *
   * @return CreateProjectJSONObj
   */
  static createCreateProjectJSON(email, config) {
    return new Promise((resolve) => {
      let currentFreeSpace;
      this.createCreateProjectData(email).then((result) => {
        if (result.statusCode == 400) {
          resolve(result);
          return;
        }
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

        if (
          config.limits.RAM == null ||
          config.limits.CPU == null ||
          config.limits.disk == null ||
          config.limits.internet.upload == null ||
          config.limits.internet.download == null
        ) {
          if (
            config.limits.RAM != null ||
            config.limits.CPU != null ||
            config.limits.disk != null ||
            config.limits.internet.upload != null ||
            config.limits.internet.download != null
          ) {
            con.end();
            resolve(
              new OperationState(
                "Either all limits are null or none of them is null",
                400
              )
            );
            return;
          }
        }
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
  /**
   * creates Project object with data about given project
   * @param id - id of project in question
   *
   * @return Project - project object with all data available from databse about it, rest is filled in by lxd
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
          if (rows[0] == undefined) {
            resolve(
              new OperationState("Project: " + id + " doesn't exist", 400)
            );
            return;
          }
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

  /**
   * removes project form databse
   * @param id - id of project in question
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
          resolve(new OperationState("container successfully deleted", 200));
        }
      );
    });
  }

  /**
   * return array of id of containers in give project
   * @param id - id of project in question
   *
   * @return array - filled with ids of containers
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
