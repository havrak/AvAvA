import mysql from "mysql";
import { resolve } from "node:dns";
import sqlconfig from "./../../../config/sqlconfig.js";
import proxyconfig from "./../../../config/proxyconfig.js";
import systemconfig from "./../../../config/systemconfig.js";
import CreateInstanceConfigData from "../../models/CreateInstanceConfigData.js";
import CreateInstanceJSONObj from "../../models/CreateInstanceJSONObj.js";
import Container from "../../models/Container.js";
import ContainerResourceState from "../../models/ContainerResourceState.js";
import fs from "fs";
import Limits from "../../models/Limits.js";
import templateSQL from "./templateSQL.js";
import { NetworkState } from "../../models/NetworkState.js";
import OperationState from "../../models/OperationState.js";

export default class containerSQL {
  // TODO: get rid of email
  /* creates JSON which will be send to lxd in oder to create new container, contaienr will also be added into databse via function call
   * @param email - email of user who is creating the container
   * @param	config - configuration of new container, submitted by user
   *
   * @return CreateInstanceJSONObj
   */
  static createCreateContainerJSON(email, config) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      this.getFreeSpaceForContainer(config.projectId, email).then((result) => {
        console.log("result");
        console.log(result);
        if (result.statusCode == 400) {
          resolve(result);
          return;
        }
        if (typeof result == String) resolve(result);
        if (
          config.limits.RAM > result.RAM ||
          config.limits.CPU > result.CPU ||
          config.limits.disk > result.disk ||
          config.limits.upload > result.upload ||
          config.limits.download > result.download
        ) {
          resolve(new OperationState("Limits are over current max", 400));
          return;
        }
        // create JSON, call function to add container to database (for once can be synchronous)
        // request to templates - profile and source,
        con.query(
          "SELECT * FROM templates WHERE id=?",
          [config.templateId],
          (err, rows) => {
            if (rows[0] == undefined) {
              con.end();
              resolve(new OperationState("Templates doesn't exists", 400));
              return;
            }
            if (config.limits.disk < rows[0].min_disk_size) {
              con.end();
              resolve(
                new OperationState(
                  "Not enough free space to create desired container",
                  400
                )
              );
              return;
            }
            this.addNewContainerToDatabase(config, email).then((result) => {
              if (result.statusCode == 400) {
                con.end();
                resolve(result);
                return;
              }
              // self
              // as contianer name is in fact his id we first need to save it to database
              let template;
              let path = "config/templates/" + rows[0].profile_path + ".json";
              fs.readFile(path, "utf-8", (err, data) => {
                template = JSON.parse(data);
                let createContainerJSON = new CreateInstanceJSONObj(
                  result,
                  template.profiles,
                  template.source,
                  config.projectId
                );
                // NOTE: as things stand now lxd has unfixed error which leads to contianer failing to start and throwing error related to some broken change of ownership thus limit of disk size is disabled
                //createContainerJSON.devices.root.size =
                //  "" + config.limits.disk + "";
                createContainerJSON.config["limits.memory"] =
                  "" + config.limits.RAM + ""; // by default in bites
                createContainerJSON.config["limits.cpu.allowance"] =
                  "" +
                  parseInt((config.limits.CPU / systemconfig.frequency) * 100) +
                  "%";
                console.log(createContainerJSON.config["limits.cpu.allowance"]);
                createContainerJSON.devices.eth0["limits.ingress"] =
                  "" + config.limits.internet.upload + "";
                createContainerJSON.devices.eth0["limits.egress"] =
                  "" + config.limits.internet.download + "";
                createContainerJSON.appsToInstall = "";

                if (config.applicationsToInstall.length > 0) {
                  createContainerJSON.appsToInstall += "sleep 5; ";
                  switch (rows[0].image_name) {
                    case "Ubuntu":
                      createContainerJSON.appsToInstall +=
                        "apt-get update && apt-get -yyq install ";
                      break;
                    case "Debian":
                      createContainerJSON.appsToInstall +=
                        "apt-get update && apt-get -yyq install ";
                      break;
                    case "CentOS":
                      createContainerJSON.appsToInstall +=
                        "yum clean all && yum install ";
                      break;
                  }
                  con.query("SELECT * FROM appsToInstall", (err, apps) => {
                    if (err) throw err;
                    apps.forEach((app, index) => {
                      if (config.applicationsToInstall.includes(app.id)) {
                        config.applicationsToInstall += app.package_name + " ";
                      }
                    });
                    resolve(createContainerJSON);
                  });
                } else {
                  console.log(createContainerJSON);
                  resolve(createContainerJSON);
                }
              });
            });
          }
        );
      });
    });
  }

  /**
   * get id of project to which container belongs
   * @param id - id of container
   *
   * @return id - id of project
   */
  static getProjectIdOfContainer(id) {
    console.log(id);
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT project_id FROM containers WHERE id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            con.end();
            resolve(
              new OperationState("Container: " + id + " doesn't exist", 400)
            );
            return;
          }
          resolve(rows[0].project_id);
        }
      );
    });
  }

  /**
   * create stateHistory of given container, fills in what is stored in logs and current limits
   * @param id - id of container
   *
   * @return ContainerResourceState[] - on last position is lastest read
   */
  static getContainerHistory(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT containersResourcesLog.ram AS loram, containersResourcesLog.cpu AS locpu, containersResourcesLog.number_of_processes AS lonop, containersResourcesLog.upload AS loup, containersResourcesLog.download AS lodow, containersResourcesLimits.ram AS liram, containersResourcesLimits.cpu AS licpu, containersResourcesLimits.upload AS liup, containersResourcesLimits.download AS lidow, timestamp FROM containersResourcesLog LEFT JOIN containersResourcesLimits ON containersResourcesLog.container_id=containersResourcesLimits.container_id WHERE containersResourcesLog.container_id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            con.end();
            resolve(
              new OperationState(
                "Container either doesn't exist or doesn't have logs",
                400
              )
            );
            return;
          }
          let ram = rows[0].loram.split(",");
          let cpu = rows[0].locpu.split(",");
          let nop = rows[0].lonop.split(",");
          let upload = rows[0].loup.split(",");
          let download = rows[0].lodow.split(",");
          let toReturn = new Array(systemconfig.logCount);
          for (let i = ram.length - 1; i >= 0; i--) {
            toReturn[i] = new ContainerResourceState();
            toReturn[i].RAM.usage = ram[i];
            toReturn[i].RAM.limit = rows[0].liram;
            toReturn[i].CPU.usage = cpu[i];
            toReturn[i].CPU.limit = rows[0].licpu;
            toReturn[i].numberOfProcesses = nop[i];
            toReturn[i].internet = new NetworkState();
            toReturn[i].internet.counters.upload.usedSpeed = upload[i];
            toReturn[i].internet.limits.download = rows[0].lidow;
            toReturn[i].internet.limits.upload = rows[0].liup;
            toReturn[i].internet.counters.download.usedSpeed = download[i];
            toReturn[i].measuredOn = new Date(rows[0].timestamp);
            toReturn[i].measuredOn.setMinutes(
              toReturn[i].measuredOn.getMinutes() - (ram.length - i - 1) * 10
            );
          }
          con.end();
          resolve(toReturn);
        }
      );
    });
  }

  /**
   * adds new container to database
   * @param config - config given by user in API route
   * @param email - email of user
   *
   * @return id - id in database of new container
   */
  static addNewContainerToDatabase(config, email) {
    const con = mysql.createConnection(sqlconfig);
    return new Promise((resolve) => {
      con.query(
        "SELECT * FROM projects WHERE id = ?", // as url of container contain projects name it is necessary to make request to get the name
        [config.projectId],
        (err, rows) => {
          if (rows[0] == undefined) {
            con.end();
            resolve(new OperationState("Project doesn't exist", 400));
            return;
          }
          if (err) throw err;
          con.query(
            "INSERT INTO containers (project_id, name, url, template_id, state) VALUES (?,?,?,?,?)",
            [
              config.projectId,
              config.name,
              (
                config.name +
                "." +
                rows[0].name +
                "." +
                email.substr(0, email.indexOf("@")) +
                "." +
                proxyconfig.domain
              ).replace(/\s/g, ""),
              config.templateId,
              1,
            ],
            (err, rows) => {
              if (err && err.code == "ER_DUP_ENTRY") {
                con.end();
                resolve(
                  new OperationState(
                    "There already is container with the same name in the database",
                    400
                  )
                );
                return;
              } else if (err) throw err;
              con.query(
                "INSERT INTO containersResourcesLimits (container_id, ram, cpu, disk, upload, download) VALUES (?,?,?,?,?,?)",
                [
                  rows.insertId,
                  config.limits.RAM,
                  config.limits.CPU,
                  config.limits.disk,
                  config.limits.internet.upload,
                  config.limits.internet.download,
                ],
                (err, rows) => {
                  if (err) throw err;
                }
              );
              con.query(
                "INSERT INTO containersResourcesLog (container_id, ram, cpu, number_of_processes, upload, download) VALUES (?,?,?,?,?,?)",
                [
                  rows.insertId,
                  "0,0,0,0,0,0,0,0,0,0,0,0", // logs are stored as an array in one filed, TODO: make number of logs configurable in config file
                  "0,0,0,0,0,0,0,0,0,0,0,0",
                  "0,0,0,0,0,0,0,0,0,0,0,0",
                  "0,0,0,0,0,0,0,0,0,0,0,0",
                  "0,0,0,0,0,0,0,0,0,0,0,0",
                ],
                (err, rows) => {
                  if (err) throw err;
                }
              );
              resolve(rows.insertId);
            }
          );
        }
      );
    });
  }
  /**
   * check how big limits for container can be
   * @param projectId - id of project in which container in question is
   * @param email - email of user
   *
   * @return Limits - free resources
   */
  static getFreeSpaceForContainer(projectId, ownerEmail) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projectsResourcesLimits WHERE project_id=?",
        [projectId],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            resolve(
              new OperationState(
                "project doesn't exists or doesn't have limits",
                400
              )
            );
            return;
          }
          // project either has its limit or not, so there is no need to check all variables
          if (rows[0].ram == null) {
            con.query(
              // first we will query for limits of user
              "SELECT * FROM usersResourcesLimits WHERE user_email=?",
              [ownerEmail],
              (err, users) => {
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
                      userLimits.RAM -= rows[i].ram;
                      userLimits.CPU -= rows[i].cpu;
                      userLimits.disk -= rows[i].disk;
                      userLimits.internet.upload -= rows[i].upload;
                      userLimits.internet.download -= rows[i].download;
                    });
                    con.query(
                      "SELECT * FROM containers LEFT JOIN containersResourcesLimits WHERE containers.project_id=?",
                      [projectId],
                      (err, rows) => {
                        rows.forEach((row, index) => {
                          userLimits.RAM -= rows[i].ram;
                          userLimits.CPU -= rows[i].cpu;
                          userLimits.disk -= rows[i].disk;
                          userLimits.internet.upload -= rows[i].upload;
                          userLimits.internet.download -= rows[i].download;
                        });
                        con.end();
                        resolve(userLimits);
                      }
                    );
                  }
                );
              }
            );
          } else {
            let limits = new Limits(
              rows[0].ram,
              rows[0].cpu,
              rows[0].disk,
              rows[0].upload,
              rows[0].download
            );
            con.query(
              "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containers.id=containersResourcesLimits.container_id WHERE containers.project_id=?",
              [projectId],
              (err, rows) => {
                rows.forEach((row, index) => {
                  limits.RAM -= rows[index].ram;
                  limits.CPU -= rows[index].cpu;
                  limits.disk -= rows[index].disk;
                  limits.internet.upload -= rows[index].upload;
                  limits.internet.download -= rows[index].download;
                });
                con.end();
                resolve(limits);
              }
            );
          }
        }
      );
    });
  }

  /**
   * updates containersResourcesLog with new log
   * @param id - id of container
   * @param state - ContainerResourceState with current state
   */
  static updateLogsForContainer(id, state) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containersResourcesLog WHERE containersResourcesLog.container_id=?",
        [id],
        (err, rows) => {
          if (rows[0] == undefined) {
            con.end();
            resolve(
              new OperationState(
                "Container: " +
                  id +
                  " doesn't exist, or does not have log in logs "
              )
            );
            return;
          }
          if (err) throw err;
          let ram = rows[0].ram.split(",");
          ram.push(state.RAM.usage == undefined ? 0 : state.RAM.usage);
          let cpu = rows[0].cpu.split(",");
          cpu.push(state.CPU.usage == undefined ? 0 : state.CPU.usage);
          let upload = rows[0].upload.split(",");
          upload.push(
            state.internet.counters.upload.usedSpeed == undefined
              ? 0
              : state.internet.counters.upload.usedSpeed
          );
          let download = rows[0].download.split(",");
          download.push(
            state.internet.counters.download.usedSpeed == undefined
              ? 0
              : state.internet.counters.download.usedSpeed
          );
          let nop = rows[0].number_of_processes.split(",");
          nop.push(
            state.numberOfProcesses == undefined ? 0 : state.numberOfProcesses
          );
          con.query(
            "UPDATE containersResourcesLog SET ram=?, cpu=?, number_of_processes=?,upload=?, download=?, timestamp=CURRENT_TIMESTAMP WHERE container_id=?",
            [
              `${ram.slice(1)}`,
              `${cpu.slice(1)}`,
              `${nop.slice(1)}`,
              `${upload.slice(1)}`,
              `${download.slice(1)}`,
              id,
            ],
            (err, rows) => {
              if (err) throw err;
              resolve(new OperationState("database updated", 200));
            }
          );
        }
      );
    });
  }

  /**
   * checks all containers in database
   *
   * @return array of id and project_id
   */
  static getAllContainers() {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query("SELECT id, project_id FROM containers", (err, rows) => {
        if (err) throw err;
        con.end();
        resolve(rows);
      });
    });
  }

  /**
   * checks all container in give project
   * @param id - id of project in which containers in question are
   *
   * @return array of Container objects
   */
  static getAllContainersInProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers WHERE containers.project_id=?",
        [id],
        (err, rows) => {
          if (rows[0] == undefined) {
            con.end();
            resolve(new Array());
            return;
          }
          let toReturn = new Array(rows.length);
          let counter = 0;
          rows.forEach((row, index) => {
            templateSQL.getTemplate(row.template_id).then((template) => {
              this.createContainerStateObject(row.id).then((result) => {
                toReturn[index] = new Container();
                toReturn[index].state = result;
                toReturn[index].id = row.id;
                toReturn[index].projectId = row.project_id;
                toReturn[index].name = row.name;
                toReturn[index].url = row.url;
                toReturn[index].template = template;
                counter++;
                if (counter == toReturn.length) {
                  con.end();
                  resolve(toReturn);
                }
              });
            });
          });
          if (rows[0] == undefined) {
            resolve(new Array());
          }
        }
      );
    });
  }

  /**
   * removes container form databse
   * @param id - id of container to be deleted
   *
   * @return OperationState
   */
  static removeContainer(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "DELETE FROM containers WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          con.end();
          resolve(new OperationState("Container removed from database", 200));
        }
      );
    });
  }

  /**
   * creates object with all data necessary to create new container
   * @param email - email of user
   *
   * @return CreateInstanceConfigData
   */
  static createCreateContainerData(ownerEmail) {
    return new Promise((resolve) => {
      let toReturn = new CreateInstanceConfigData();
      templateSQL.getAllTemplates().then((result) => {
        toReturn.templates = result;
        templateSQL.getAllAppsToInstall().then((result) => {
          toReturn.applicationsToInstall = result;
          resolve(toReturn);
        });
      });
    });
  }
  /**
   * creates Object Container with data from containers table
   * @param id - id of container
   *
   * @return Container object
   */
  static createContainerObject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined || rows.length == 0) {
            con.end();
            resolve(
              new OperationState("Container: " + id + " doesn't exits", 400)
            );
            return;
          } else {
            templateSQL.getTemplate(rows[0].template_id).then((result) => {
              let toReturn = new Container();
              toReturn.id = id;
              toReturn.projectId = rows[0].project_id;
              toReturn.name = rows[0].name;
              toReturn.url = rows[0].url;
              toReturn.template = result.statusCode == 400 ? "unknown" : result;
              con.end();
              resolve(toReturn);
            });
          }
        }
      );
    });
  }
  /**
   * creates ContainerResourceState object for given container
   * @param id - id of contianer
   *
   * @return ContainerResourceState
   */
  static createContainerStateObject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containersResourcesLimits.container_id=containers.id WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          if (rows[0] == undefined) {
            con.end();
            resolve(
              new OperationState(
                "Container: " +
                  id +
                  " either doesn't exist, or his limits aren't set in the database",
                400
              )
            );
            return;
          }
          let toReturn = new ContainerResourceState();
          toReturn.CPU.limit = rows[0].cpu;
          toReturn.RAM.limit = rows[0].ram;
          toReturn.disk.limit = rows[0].disk;
          toReturn.internet = new NetworkState(); //
          toReturn.internet.limits.download = rows[0].download;
          toReturn.internet.limits.upload = rows[0].upload;
          con.end();
          resolve(toReturn);
        }
      );
    });
  }

  /**
   * updates state of container in database
   * @param id - id of container
   * @param started - boolean whether container has started
   * @param statusCode - statusCode of container
   *
   * @return OperationState
   */
  static updateContainerStateObject(id, started, statusCode) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      if (started) {
        con.query(
          "UPDATE containers SET state=?, time_started=CURRENT_TIMESTAMP WHERE id=?",
          [statusCode, id],
          (err, rows) => {
            if (err) throw err;
            resolve(new OperationState("success", 200));
          }
        );
      } else {
        con.query(
          "UPDATE containers SET state=? WHERE id=?",
          [statusCode, id],
          (err, rows) => {
            if (err) throw err;
            resolve(new OperationState("success", 200));
          }
        );
      }
    });
  }

  /**
   * generates new configuration file for haproxy
   *
   * @return OperationState - always 200
   */
  static generateHaProxyConfigurationFile() {
    return new Promise((resolve) => {
      fs.readFile(
        "config/serverconfiguartions/haproxy_header",
        "utf8",
        (err, data) => {
          let stream = fs.createWriteStream(
            "config/serverconfiguartions/haproxy.cfg",
            { flags: "w", encoding: "utf8" }
          );
          stream.write(data);
          const con = mysql.createConnection(sqlconfig);
          con.query("SELECT * FROM containers", (err, rows) => {
            if (err) throw err;
            // frontend https
            stream.write("frontend fe_https\n");
            stream.write(
              "\tbind *:443 ssl crt " +
                proxyconfig.pemfilepath +
                " no-tls-tickets ca-file " +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\ttimeout client 5000\n");
            stream.write("\treqadd X-Forwarded-Proto:\\ https\n");
            stream.write("\toption http-keep-alive\n");
            stream.write("\toption forwardfor\n");
            stream.write("\n");

            stream.write(
              "\tuse_backend bac_web_systemconfig if { hdr(host) -i " +
                proxyconfig.domain +
                " }\n"
            );

            rows.forEach((row, index) => {
              stream.write(
                "\tuse_backend bac_web_c" +
                  row.id +
                  " if { hdr(host) -i " +
                  row.url +
                  " }\n"
              );
            });
            // frontend http
            stream.write("\n");
            stream.write("\n");
            stream.write("frontend fe_http\n");
            stream.write("\tbind *:80\n");
            stream.write("\ttimeout client 50000\n");
            stream.write("\n");
            stream.write(
              "\tuse_backend bac_web_systemconfig if { hdr(host) -i " +
                proxyconfig.domain +
                " }\n"
            );
            rows.forEach((row, index) => {
              stream.write(
                "\tuse_backend bac_web_c" +
                  row.id +
                  " if { hdr(host) -i " +
                  row.url +
                  " }\n"
              );
            });
            // frontend rest api
            stream.write("\n");
            stream.write("\n");
            stream.write("frontend fe_rest\n");
            stream.write(
              "\tbind *:3000 ssl crt " +
                proxyconfig.pemfilepath +
                " no-tls-tickets ca-file " +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\ttimeout client 5000\n");
            stream.write("\treqadd X-Forwarded-Proto:\\ https\n");
            stream.write("\toption http-keep-alive\n");
            stream.write("\toption forwardfor\n");
            stream.write("\n");

            stream.write(
              "\tuse_backend bac_rest_systemconfig if { hdr(host) -i " +
                proxyconfig.domain +
                " }\n"
            );

            rows.forEach((row, index) => {
              stream.write(
                "\tuse_backend bac_rest_c" +
                  row.id +
                  " if { hdr(host) -i " +
                  row.url +
                  " }\n"
              );
            });

            // frontend ssh
            stream.write("\n");
            stream.write("\n");
            stream.write("frontend fe_ssh\n");
            stream.write(
              "\tbind *:2222 ssl crt " +
                proxyconfig.pemfilepath +
                " no-tls-tickets ca-file " +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\tmode tcp\n");
            stream.write(
              "\ttcp-request content set-var(sess.dst) ssl_fc_sni\n"
            );
            stream.write("\n");

            // stream.write(
            //   "\tuse_backend bac_ssh_systemconfig if { var(sess.dst) -i " +
            //     proxyconfig.domain +
            //     " }\n"
            // );

            rows.forEach((row, index) => {
              stream.write(
                "\tuse_backend bac_ssh_c" +
                  row.id +
                  " if { var(sess.dst) -i " +
                  row.url +
                  " }\n"
              );
            });
            // web backend
            stream.write("\n");
            stream.write("\n");
            stream.write("backend bac_web_systemconfig\n");
            stream.write("\thttp-request set-header X-Client-IP %[src]\n");
            stream.write("\tredirect scheme https if !{ ssl_fc }\n");
            stream.write(
              "\tserver systemconfig " +
                proxyconfig.ipAdressOfHostOnLxdbr0 +
                ":81 check\n"
            );
            rows.forEach((row, index) => {
              stream.write("\n");
              stream.write("backend bac_web_c" + row.id + "\n");
              stream.write("\thttp-request set-header X-Client-IP %[src]\n");
              stream.write("\tredirect scheme https if !{ ssl_fc }\n");
              stream.write(
                "\tserver c" + row.id + " c" + row.id + ".lxd:80 check\n"
              );
            });
            // ssh backend
            stream.write("\n");
            stream.write("\n");
            stream.write("backend bac_rest_systemconfig\n");
            stream.write("\thttp-request set-header X-Client-IP %[src]\n");
            stream.write("\tredirect scheme https if !{ ssl_fc }\n");
            stream.write(
              "\tserver systemconfig " +
                proxyconfig.ipAdressOfHostOnLxdbr0 +
                ":3001 check\n"
            );
            rows.forEach((row, index) => {
              stream.write("\n");
              stream.write("backend bac_rest_c" + row.id + "\n");
              stream.write("\thttp-request set-header X-Client-IP %[src]\n");
              stream.write("\tredirect scheme https if !{ ssl_fc }\n");
              stream.write(
                "\tserver c" + row.id + " c" + row.id + ".lxd:3000 check\n"
              );
            });
            // ssh backend
            stream.write("\n");
            rows.forEach((row, index) => {
              stream.write("\n");
              stream.write("backend bac_ssh_c" + row.id + "\n");
              stream.write("\tmode tcp\n");
              stream.write(
                "\tserver c" + row.id + " c" + row.id + ".lxd:22 check\n"
              );
            });
            resolve(new OperationState("Haproxy created", 200));
          });
        }
      );
    });
  }
}
