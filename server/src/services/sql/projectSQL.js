import mysql from "mysql";
import User from "./../../models/User.js";
import Limits from "../../models/Limits.js";
import config from "./../../../config/sqlconfig.js";

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
            rows[0].ram,
            rows[0].cpu,
            rows[0].disk,
            rows[0].upload,
            rows[0].download
          );
          console.log(userLimits);
          let allocatedResources = new Limits(0, 0, 0, 0, 0);
          con.query(
            "SELECT * FROM projects LEFT JOIN projectsResourcesLimits ON project_id = projectsResourcesLimits.project_id LEFT JOIN users ON projects.owner_email=users.email WHERE users.email=?",
            [email], // by default user is standart user
            (err, rows) => {
              if (err) throw err;
              console.log(rows.length);
              for (let i = 0; i < rows.length; i++) {
                userLimits.ram -= rows[i].ram;
                userLimits.cpu -= rows[i].cpu;
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
}
