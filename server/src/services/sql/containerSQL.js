import mysql from "mysql";
import { resolve } from "node:dns";
import sqlconfig from "./../../../config/sqlconfig.js";
import proxyconfig from "./../../../config/proxyconfig.js";
import CreateInstanceConfigData from "../../models/CreateInstanceConfigData.js";
import CreateInstanceJSONObj from "../../models/CreateInstanceJSONObj.js";
import Container from "../../models/Container.js";
import ContainerResourceState from "../../models/ContainerResourceState.js";
import fs from "fs";
import Limits from "../../models/Limits.js";
import templateSQL from "./templateSQL.js";
import { NetworkState } from "../../models/NetworkState.js";

export default class containerSQL {
  static createCreateContainerJSON(email, config) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      this.getFreeSpaceForContainer(config.projectId, email).then((result) => {
        if (typeof result == String) resolve(result);
        if (
          config.limits.RAM > result.RAM ||
          config.limits.CPU > result.CPU ||
          config.limits.disk > result.disk ||
          config.limits.upload > result.upload ||
          config.limits.download > result.download
        ) {
          resolve("500, limits are over current maximum");
        }
        // create JSON, call function to add container to database (for once can be synchronous)
        // request to templates - profile and source,
        con.query(
          "SELECT * FROM templates WHERE id=?",
          [config.templateId],
          (err, rows) => {
            if (rows.length == 0) resolve("500, teplates doesn't exists");
            if (config.limits.disk < rows[0].min_disk_size) {
              resolve("500, not enough space for desired image");
            }
            this.addNewContainerToDatabase(config, email).then((result) => {
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
                // createContainerJSON.devices.root.size =
                //   "" + config.limits.disk + "";
                createContainerJSON.config["limits.memory"] =
                  "" + config.limits.RAM + ""; // by default in bites
                createContainerJSON.config["limits.cpu.allowance"] =
                  "" + config.limits.CPU + "%";
                createContainerJSON.devices.eth0["limits.ingress"] =
                  "" + config.limits.internet.upload + "";
                createContainerJSON.devices.eth0["limits.egress"] =
                  "" + config.limits.internet.download + "";
                createContainerJSON.appsToInstall = new Array();

                if (config.applicationsToInstall.length > 0) {
                  let tmpString = "sleep 5; ";
                  switch (rows[0].image_name) {
                    case "Ubuntu":
                      tmpString += "apt-get update && apt-get -yyq install ";
                      break;
                    case "Debian":
                      tmpString += "apt-get update && apt-get -yyq install ";
                      break;
                  }
                  con.query("SELECT * FROM appsToInstall", (err, apps) => {
                    if (err) throw err;
                    apps.forEach((app, index) => {
                      if (config.applicationsToInstall.includes(app.id)) {
                        switch (rows[0].image_name) {
                          case "Ubuntu":
                            tmpString += app.package_name + " ";
                            break;
                          case "Debian":
                            tmpString += app.package_name + " ";
                            break;
                        }
                      }
                    });
                    createContainerJSON.appsToInstall.push(tmpString);
                    resolve(createContainerJSON);
                  });
                } else {
                  resolve(createContainerJSON);
                }
              });
            });
          }
        );
      });
    });
  }

  static addNewContainerToDatabase(config, email) {
    const con = mysql.createConnection(sqlconfig);
    return new Promise((resolve) => {
      con.query(
        "SELECT * FROM projects WHERE id = ?", // as url of container contain projects name it is necessary to make request to get the name
        [config.projectId],
        (err, rows) => {
          if (err) throw err;
          con.query(
            "INSERT INTO containers (project_id, name, url, template_id, state) VALUES (?,?,?,?,?)",
            [
              config.projectId,
              config.name,
              config.name +
                "." +
                rows[0].name +
                "." +
                email.substr(0, email.indexOf("@")) +
                "." +
                proxyconfig.domain,
              config.templateId,
              1,
            ],
            (err, rows) => {
              if (err && err.code == "ER_DUP_ENTRY") {
                console.log(
                  "There already is container with the same name in the database"
                );
                resolve(500);
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
              resolve(rows.insertId);
            }
          );
        }
      );
    });
  }

  static getFreeSpaceForContainer(projectId, ownerEmail) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM projectsResourcesLimits WHERE project_id=?",
        [projectId],
        (err, rows) => {
          if (err) throw err;
          if (rows.length == 0) {
            resolve("project doesn't exists");
          }
          // project either has its limit or not, so there is no need to check all variables
          if (rows[0].ram == null) {
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
                  limits.network.upload -= rows[index].upload;
                  limits.network.download -= rows[index].download;
                });
              }
            );
            resolve(limits);
          }
        }
      );
    });
  }
  static getAllContainersInProject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers WHERE containers.project_id=?",
        [id],
        (err, rows) => {
          let toReturn = [rows.length];
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
                if (counter == rows.length - 1) {
                  resolve(toReturn);
                }
              });
            });
          });
        }
      );
    });
  }

  static removeContainer(id) {
    return new Promise((resove) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "DELETE FROM containers WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          resolve(1);
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
          console.log(toReturn);
          this.getFreeSpaceForContainer(projectId, ownerEmail).then(
            (result) => {
              toReturn.maxLimits = result;
              resolve(toReturn);
            }
          );
        });
      });
    });
  }
  static createContainerObject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          templateSQL.getTemplate(rows[0].template_id).then((result) => {
            let toReturn = new Container();
            toReturn.id = id;
            toReturn.projectId = rows[0].project_id;
            toReturn.name = rows[0].name;
            toReturn.url = rows[0].url;
            toReturn.template = result;
            resolve(toReturn);
          });
        }
      );
    });
  }
  static createContainerStateObject(id) {
    return new Promise((resolve) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "SELECT * FROM containers LEFT JOIN containersResourcesLimits ON containersResourcesLimits.container_id=containers.id WHERE containers.id=?",
        [id],
        (err, rows) => {
          if (err) throw err;
          let toReturn = new ContainerResourceState();
          toReturn.CPU.limit = rows[0].cpu;
          toReturn.RAM.limit = rows[0].ram;
          toReturn.disk.limit = rows[0].disk;
          toReturn.internet = new NetworkState(); //
          toReturn.internet.limits.download = rows[0].download;
          toReturn.internet.limits.upload = rows[0].upload;
          resolve(toReturn);
        }
      );
    });
  }

  static updateContainerStateObject(id, started, statusCode) {
    const con = mysql.createConnection(sqlconfig);
    if (started) {
      con.query(
        "UPDATE containers SET state=?, time_started=CURRENT_TIMESTAMP WHERE id=?",
        [statusCode, id],
        (err, rows) => {
          if (err) throw err;
        }
      );
    } else {
      con.query(
        "UPDATE containers SET state=? WHERE id=?",
        [statusCode, id],
        (err, rows) => {
          if (err) throw err;
        }
      );
    }
  }

  static generateHaProxyConfigurationFile() {
    return new Promise((result) => {
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
              "\tbind *:443 ssl crt" +
                proxyconfig.pemfilepath +
                "no-tls-tickets ca-file" +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\ttimeout client 5000\n");
            stream.write("\treqadd X-Forwarded-Proto: https\n");
            stream.write("\toption http-keep-alive\n");
            stream.write("\toption forwardfor\n");
            stream.write("\n");

            stream.write(
              "\tuse_backend bac_web_hostmachine if { hdr(host) -i " +
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
              "\tuse_backend bac_web_hostmachine if { hdr(host) -i " +
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
              "\tbind *:3000 ssl crt" +
                proxyconfig.pemfilepath +
                "no-tls-tickets ca-file" +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\ttimeout client 5000\n");
            stream.write("\treqadd X-Forwarded-Proto: https\n");
            stream.write("\toption http-keep-alive\n");
            stream.write("\toption forwardfor\n");
            stream.write("\n");

            stream.write(
              "\tuse_backend bac_rest_hostmachine if { hdr(host) -i " +
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
              "\tbind *:2222 ssl crt" +
                proxyconfig.pemfilepath +
                "no-tls-tickets ca-file" +
                proxyconfig.cabundle +
                "\n"
            );
            stream.write("\tmode tcp\n");
            stream.write(
              "\ttcp-request content set-var(sess.dst) ssl_fc_sni\n"
            );
            stream.write("\n");

            // stream.write(
            //   "\tuse_backend bac_ssh_hostmachine if { var(sess.dst) -i " +
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
            stream.write("backend bac_web_hostmachine\n");
            stream.write("\thttp-request set-header X-Client-IP %[src]\n");
            stream.write("\tredirect scheme https if !{ssl_fc}\n");
            stream.write(
              "\tserver hostmachine " +
                proxyconfig.ipAdressOfHostOnLxdbr0 +
                ".lxd:81 check\n"
            );
            rows.forEach((row, index) => {
              stream.write("\n");
              stream.write("backend bac_web_c" + row.id + "\n");
              stream.write("\thttp-request set-header X-Client-IP %[src]\n");
              stream.write("\tredirect scheme https if !{ssl_fc}\n");
              stream.write(
                "\tserver c" + row.id + " c" + row.id + ".lxd:80 check\n"
              );
            });
            // ssh backend
            stream.write("\n");
            stream.write("\n");
            stream.write("backend bac_rest_hostmachine\n");
            stream.write("\thttp-request set-header X-Client-IP %[src]\n");
            stream.write("\tredirect scheme https if !{ssl_fc}\n");
            stream.write(
              "\tserver hostmachine " +
                proxyconfig.ipAdressOfHostOnLxdbr0 +
                ".lxd:3001 check\n"
            );
            rows.forEach((row, index) => {
              stream.write("\n");
              stream.write("backend bac_rest_c" + row.id + "\n");
              stream.write("\thttp-request set-header X-Client-IP %[src]\n");
              stream.write("\tredirect scheme https if !{ssl_fc}\n");
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
            resolve(200);
          });
        }
      );
    });
  }
}
