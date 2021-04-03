import mysql from "mysql";
<<<<<<< HEAD
import config from "./../../../config/sqlconfig.js";

export default class containerSQL {
	static createCreateContainerJSON(email, config) {}
=======
import sqlconfig from "../../../config/sqlconfig.js";
import CreateInstanceJSONObj from "./../../models/CreateInstanceJSONObj.js";
import CreateInstanceConfigData from "./../../models/CreateInstanceConfigData.js";
import templateSQL from "./templateSQL.js";

export default class containerSQL {
  static createCreateContainerJSON(email, config) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      this.getFreeSpaceForContainer(config.projectId, email).then((result) => {
        if (
          config.customLimits.RAM > result.RAM ||
          config.customLimits.CPU > result.CPU ||
          config.customLimits.disk > result.disk ||
          config.customLimits.upload > result.upload ||
          config.customLimits.download > result.download
        ) {
          resolve(500);
        }
        // create JSON, call function to add container to database (for once can be synchronous)
        // request to templates - profile and source,
        con.query(
          "SELECT * FROM templates WHERE id=?",
          [config.templateId],
          (err, rows) => {
            if (config.disk < rows[0].min_disk_size) {
              resolve(500);
            }
            addNewContainerToDatabase(config, email).then((result) => {
              // as contianer name is in fact his id we first need to save it to database
              let template = JSON.parse(fs.readFile(rows[0].profile_path));
              let createContainerJSON = new CreateInstanceJSONObj(
                "c" + result,
                template.profiles,
                template.source,
                config.projectId
              );
              createContainerJSON.device.root.size = config.disk + "B";
              createContainerJSON.config["limits.memory"] = config.CPU;
              createContainerJSON.config["limits.cpu"] = config.RAM + "B";
              createContainerJSON.device.eth0["limits.ingress"] = config.upload;
              createContainerJSON.device.eth0["limits.egress"] =
                config.download;
              resolve(createContainerJSON);
            });
          }
        );
      });
    });
  }

  static addNewContainerToDatabase(config, email) {
    const con = mysql.createConnection(sqlconfig);
    con.query(
      "SELECT * FROM projects WHERE id = ?", // as url of container contain projects name it is necessary to make request to get the name
      [config.projectId],
      (err, rows) => {
        if (err) throw err;
        con.query(
          "INSERT INTO containers (project_id, name, url, template_id, state) VALUES (?,?,?,?,?,?,?)",
          [
            config.projectId,
            config.name,
            str(config.name) +
              "." +
              str(rows[0].name) +
              "." +
              email.substr(0, email.indexOf("@")),
            config.templateId,
            1,
          ],
          (err, rows) => {
            if (err) throw err;
            con.query(
              "INSERT INTO containersResourcesLimits (container_id, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
              [
                rows.insertId,
                config.customLimits.ram,
                config.customLimits.cpu,
                config.customLimits.disk,
                config.customLimits.upload,
                config.customLimits.download,
              ],
              (err, rows) => {
                if (err) throw err;
              }
            );
            con.query(
              "INSERT INTO containersResourcesLogs (container_id, ram, cpu, number_of_processes, upload, download) VALUES (?,?,?,?,?,?)",
              [
                rows.insertId,
                "0,0,0,0,0,0,0,0,0,0,0,0",
                "0,0,0,0,0,0,0,0,0,0,0,0",
                "0,0,0,0,0,0,0,0,0,0,0,0",
                "0,0,0,0,0,0,0,0,0,0,0,0",
                "0,0,0,0,0,0,0,0,0,0,0,0",
              ],
              (err, rows) => {
                if (err) throw err;
              }
            );
            resolve(id);
          }
        );
      }
    );
  }

  static getFreeSpaceForContainer(projectId, ownerEmail) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projectsResourcesLimits WHERE project_id=?",
        [projectId],
        (err, rows) => {
          if (err) throw err;
          // project either has its limit or not, so there is no need to check all variables
          if (rows[0].ram == Null) {
            con.query(
              // first we will query for limits of user
              "SELECT * FROM usersResourcesLimits WHERE user_email=?",
              [ownerEmail],
              (err, rows) => {
                userLimits = new Limits(
                  rows[0].ram,
                  rows[0].cpu,
                  rows[0].disk,
                  rows[0].upload,
                  rows[0].download
                );
                con.query(
                  "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON projectsResourcesLimits.project_id = project.id WHERE project.owner_email = ?",
                  [ownerEmail],
                  (err, rows) => {
                    rows.forEach((row, index) => {
                      // if I could, I would shove all this primitive code into single functions but given that some impotent retard designed this language so I cant', fuck synchronous functions
                      userLimits.RAM -= rows[i].ram;
                      userLimits.CPU -= rows[i].cpu;
                      userLimits.disk -= rows[i].disk;
                      userLimits.network.upload -= rows[i].upload;
                      userLimits.network.download -= rows[i].download;
                    });
                    con.query(
                      "SELECT * FROM containers LEFT JOIN containersResourcesLimits WHERE containers.project_id=?",
                      [projectId],
                      (err, rows) => {
                        rows.forEach((row, index) => {
                          userLimits.RAM -= rows[i].ram;
                          userLimits.CPU -= rows[i].cpu;
                          userLimits.disk -= rows[i].disk;
                          userLimits.network.upload -= rows[i].upload;
                          userLimits.network.download -= rows[i].download;
                        });
                        resolve(userLimits);
                      }
                    );
                  }
                );
              }
            );
          } else {
            limits = new Limits(
              rows[0].ram,
              rows[0].cpu,
              rows[0].disk,
              rows[0].upload,
              rows[0].download
            );
            con.query(
              "SELECT * FROM containers LEFT JOIN containersResourcesLimits WHERE container.project_id=?",
              [projectId],
              (err, rows) => {
                rows.forEach((row, index) => {
                  limits.RAM -= rows[i].ram;
                  limits.CPU -= rows[i].cpu;
                  limits.disk -= rows[i].disk;
                  limits.network.upload -= rows[i].upload;
                  limits.network.download -= rows[i].download;
                });
              }
            );
            resolve(limits);
          }
        }
      );
    });
  }

  static createCreateContainerData(projectId, ownerEmail) {
    return new Promise((resolve) => {
      let toReturn = new CreateInstanceConfigData();
      templateSQL.getAllTemplates().then((result) => {
        toReturn.templateTypes = result;
        templateSQL.getAllAppsToInstall().then((result) => {
          toReturn.applicationsToInstall = result;
          getFreeSpaceForContainer(projectId, ownerEmail).then((result) => {
            toReturn.maxLimits = result;
            resolve(toReturn);
          });
        });
      });
    });
  }
>>>>>>> a1f6130 (SQL logic for creating containers and project, not tested, just need to get newest commit)
}
