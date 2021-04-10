import mysql from "mysql";
import { resolve } from "node:dns";
import sqlconfig from "./../../../config/sqlconfig.js";
import proxyconfig from "./../../../config/proxyconfig.js";
import CreateInstanceConfigData from "../../models/CreateInstanceConfigData.js";
import CreateInstanceJSONObj from "../../models/CreateInstanceJSONObj.js";
import fs from "fs";
import Limits from "../../models/Limits.js";
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
            this.addNewContainerToDatabase(config, email).then((result) => {
              // self
              // as contianer name is in fact his id we first need to save it to database
              let template;
              let path = "config/templates/" + rows[0].profile_path + ".json";
              console.log(path);
              fs.readFile(path, "utf-8", (err, data) => {
                console.log(data);
                template = JSON.parse(data);
                let createContainerJSON = new CreateInstanceJSONObj(
                  "c" + result,
                  template.profiles,
                  template.source,
                  config.projectId
                );
                createContainerJSON.device.root.size =
                  config.customLimits.disk + "B";
                createContainerJSON.config["limits.memory"] =
                  config.customLimits.RAM + "B";
                createContainerJSON.config["limits.cpu.allowance"] =
                  config.customLimits.CPU;
                createContainerJSON.device.eth0["limits.ingress"] =
                  config.customLimits.internet.upload;
                createContainerJSON.device.eth0["limits.egress"] =
                  config.customLimits.internet.download;
                resolve(createContainerJSON);
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
                proxyconfig.domain, // TODO: move later to configuration file
              config.templateId,
              1,
            ],
            (err, rows) => {
              if (err) throw err;
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
                  config.customLimits.RAM,
                  config.customLimits.CPU,
                  config.customLimits.disk,
                  config.customLimits.internet.upload,
                  config.customLimits.internet.download,
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

  static removeContainer(id) {
    return new Promise((resove) => {
      const con = mysql.createConnection(sqlconfig);
      con.query(
        "DELETE FROM containers WHERE container.id=?",
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
          });
        }
      );
    });
  }
}
