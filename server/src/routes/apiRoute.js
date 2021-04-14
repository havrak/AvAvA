import os from "os";

import "../services/passport.js";
import systemconfig from "../../config/systemconfig.js";
import "../models/Limits.js";
import "../models/User.js";
import UserData from "../models/UserData.js";
import UserProjects from "../models/UserProjects.js";
import UserStateWithHistory from "../models/UserStateWithHistory.js";
import OperationState from "../models/OperationState.js";

import { app } from "../app.js";
import {
  reloadHaproxy,
  isLoggedIn,
  isProjectUsers,
  isContainerUsers,
  getProjectObject,
  getProjectStateWithHistory,
  getContainerObject,
  deleteContainer,
  getContainerStateWithHistory,
} from "../services/routeHelpers.js";
import userSQL from "../services/sql/userSQL.js";
import projectSQL from "../services/sql/projectSQL.js";
import containerSQL from "../services/sql/containerSQL.js";
import * as lxd from "./lxdRoute.js";

/**
 * All API routes are described in file USER.yaml in root of this project
 * thus they aren't documented here
 *
 */

app.get("/api/combinedData", isLoggedIn, (req, res) => {
  //
  let toReturn = new UserData();
  userSQL.getUserByEmail(req.user.email).then((result) => {
    if (result.statusCode == 400) {
      res.statusCode = 401;
      res.send({ message: result.status });
    }
    toReturn.user = result;
    toReturn.hostInformation.CPU.model = os.cpus()[0].model; // this works, however as development isn't done on server, so tester gets model nad frequency of his own cpu
    toReturn.hostInformation.CPU.frequency = systemconfig.frequency;
    containerSQL.createCreateContainerData(req.user.email).then((result) => {
      toReturn.createInstanceConfigData = result;
      userSQL.getUsersLimits(req.user.email).then((result) => {
        toReturn.userProjects = new UserProjects();
        toReturn.userProjects.limits = result;
        userSQL.getAllUsersProjects(req.user.email).then((result) => {
          toReturn.userProjects.projects = new Array(result.length);
          let counter = 0;
          result.forEach((id) => {
            getProjectObject(id).then((result) => {
              toReturn.userProjects.projects[counter] = result;
              counter++;
              if (counter == toReturn.userProjects.projects.length)
                res.send(toReturn);
            });
          });
          if (result.length == 0) {
            res.send(toReturn);
          }
        });
      });
    });
  });
});

app.post("/api/instances", isLoggedIn, (req, res) => {
  userSQL
    .doesUserOwnGivenProject(req.user.email, req.body.projectId)
    .then((result) => {
      if (result) {
        containerSQL
          .createCreateContainerJSON(req.user.email, req.body)
          .then((result) => {
            if (result.statusCode && result.statusCode != 200) {
              res.status(400).send(result.status);
              return;
            }
            let id = result.name;
            let projectId = result.project;
            let tmp = new Array();
            tmp.push(result.appsToInstall);
            lxd.createInstance(result, tmp).then((result) => {
              if (result.statusCode != 200) {
                containerSQL.removeContainer(id);
                res.status(400).send({ message: result.status });
                return;
              }
              // upload sshd_config as default has password loggin disabled
              lxd
                .postFileToInstance(
                  id,
                  projectId,
                  "../../config/serverconfiguartions/sshd_config",
                  "/etc/ssh/sshd_config"
                )
                .then((result) => {
                  lxd.execInstance(
                    id,
                    projectId,
                    "systemctl enable ssh.service",
                    false
                  );
                  lxd.execInstance(
                    id,
                    projectId,
                    `echo root:${req.body.rootPassword} | chpasswd`,
                    false
                  );
                });
              reloadHaproxy();
              getContainerObject(id).then((result) => res.send(result));
            });
          });
      } else
        res.status(400).send({
          message: "No permission to the parent project.",
        });
    });
});

app.get(
  "/api/instances/createInstanceConfigData",
  isLoggedIn,
  isProjectUsers,
  (req, res) =>
    containerSQL
      .createCreateContainerData(req.user.email)
      .then((result) => res.send(result))
);

app.get(
  "/api/instances/:instanceId",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    getContainerObject(req.params.instanceId).then((result) => {
      if (!result.state) res.status(400).send({ message: result.status });
      else res.send(result);
    })
);

app.delete(
  "/api/instances/:instanceId",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    deleteContainer(req.params.instanceId).then((result) =>
      res.status(result.statusCode).send(result.status)
    )
);

app.get(
  "/api/instances/:instanceId/stateWithHistory",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    getContainerStateWithHistory(req.params.instanceId).then((result) => {
      if (result.statusCode && result.statusCode != 200)
        res.status(400).send({ message: result.status });
      else res.send(result);
    })
);

app.get(
  "/api/instances/:instanceId/console",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        if (result.statusCode) res.status(400).send({ message: result.status });
        lxd.getConsole(req.params.instanceId, result).then((result) => {
          //{ terminal: "terminalSecret", control: "controlSecret"}
          if (result.control) res.status(200).send(result);
          else res.status(400).send({ message: result.status });
        });
      })
);

app.get(
  "/api/instances/:instanceId/export",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        if (result.statusCode) res.status(400).send({ message: result.status });
        lxd
          .exportInstance(req.params.instanceId, result, res)
          .then((result) => {
            if (result.statusCode && result.statusCode != 200)
              res.status(400).send({ message: result.status });
          });
      })
);

app.patch(
  "/api/instances/:instanceId/start",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        lxd.startInstance(req.params.instanceId, result).then((result) => {
          if (result.statusCode == 400) {
            res.statusCode = 400;
            res.send({ message: result.status });
          } else
            containerSQL
              .updateContainerStateObject(req.params.instanceId, true, 103)
              .then((result) =>
                getContainerObject(req.params.instanceId).then((result) =>
                  res.send(result)
                )
              );
        });
      })
);

app.patch(
  "/api/instances/:instanceId/stop",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        if (result.statusCode == 400) {
          res.statusCode = 400;
          res.send({ message: result.status });
        } else {
          lxd.stopInstance(req.params.instanceId, result).then((result) => {
            if (result.statusCode != 200)
              res.status(400).send({ message: result.status });
            else
              containerSQL
                .updateContainerStateObject(req.params.instanceId, false, 102)
                .then((result) =>
                  getContainerObject(req.params.instanceId).then((result) =>
                    res.send(result)
                  )
                );
          });
        }
      })
);

app.patch(
  "/api/instances/:instanceId/freeze",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        if (result.statusCode == 400) {
          res.statusCode = 400;
          res.send({ message: result.status });
        } else {
          lxd.freezeInstance(req.params.instanceId, result).then((result) => {
            if (result.statusCode != 200)
              res.status(400).send({ message: result.status });
            else
              containerSQL
                .updateContainerStateObject(req.params.instanceId, false, 110)
                .then((result) =>
                  getContainerObject(req.params.instanceId).then((result) =>
                    res.send(result)
                  )
                );
          });
        }
      })
);

app.patch(
  "/api/instances/:instanceId/unfreeze",
  isLoggedIn,
  isContainerUsers,
  (req, res) => {
    containerSQL
      .getProjectIdOfContainer(req.params.instanceId)
      .then((result) => {
        if (result.statusCode == 400) {
          res.statusCode = 400;
          res.send({ message: result.status });
        } else {
          lxd.unfreezeInstance(req.params.instanceId, result).then((result) => {
            if (result.statusCode && result.statusCode != 200)
              res.status(400).send({ message: result.status });
            else
              containerSQL
                .updateContainerStateObject(req.params.instanceId, false, 103)
                .then((result) => {
                  getContainerObject(req.params.instanceId).then((result) =>
                    res.send(result)
                  );
                });
          });
        }
      });
  }
);

app.get("/api/projects", isLoggedIn, (req, res) => {
  userSQL.getUsersLimits(req.user.email).then((result) => {
    let toReturn = new UserProjects();
    toReturn.limits = result;
    userSQL.getAllUsersProjects(req.user.email).then((result) => {
      toReturn.projects = new Array(result.length);
      let counter = 0;
      result.forEach((id) => {
        getProjectObject(id).then((result) => {
          toReturn.projects[counter] = result;
          counter++;
          if (counter == toReturn.projects.length) res.send(toReturn);
        });
      });
      if (result.length == 0) {
        res.send(toReturn);
      }
    });
  });
});

app.post("/api/projects", isLoggedIn, (req, res) => {
  projectSQL
    .createCreateProjectJSON(req.user.email, req.body)
    .then((project) => {
      if (project.statusCode == 400) {
        res.statusCode = 400;
        res.send(project.status);
      } else {
        let id = project.name; // createProject will rewrite name variable thus it is easiest to store it in variable
        lxd.createProject(project).then((result) => {
          if (result.statusCode != 200) {
            projectSQL.removeProject(id);
            res.status(400).send({ message: result.status });
          } else getProjectObject(id).then((result) => res.send(result));
        });
      }
    });
});

app.get(
  "/api/projects/stateWithHistory",
  isLoggedIn,
  isProjectUsers,
  (req, res) => {
    userSQL.getAllUsersProjects(req.user.email).then((projectIds) => {
      let counter = 0;
      let toReturn = new UserStateWithHistory(new Array());
      projectIds.forEach((id) => {
        getProjectStateWithHistory(id).then((result) => {
          if (result.statusCode && result.statusCode != 200)
            res.status(400).send({ message: result.status });
          toReturn.projectStatesHistory.push(result);
          counter++;
          if (counter == projectIds.length) res.send(toReturn);
        });
      });
      if (projectIds.length == 0) res.send(toReturn);
    });
  }
);

app.get("/api/projects/:projectId", isLoggedIn, isProjectUsers, (req, res) => {
  getProjectObject(req.params.projectId).then((result) => {
    res.send(result);
  });
});

app.patch(
  "/api/projects/:projectId",
  isLoggedIn,
  isProjectUsers,
  (req, res) => {
    projectSQL
      .updateProjectLimits(req.body, req.params.projectId, req.user.email)
      .then((result) => {
        if (result.statusCode == 400) {
          res.statusCode == 400;
          res.send({ message: result.status });
        } else {
          if (result.haproxy) reloadHaproxy();
          getProjectObject(req.params.projectId).then((result) => {
            if (result.statusCode && result.statusCode != 200)
              res.status(400).send({ message: result.status });
            res.send(result);
          });
        }
      });
  }
);

app.delete("/api/projects/:projectId", isLoggedIn, (req, res) =>
  projectSQL.getIdOfContainersInProject(req.params.projectId).then((result) => {
    new Promise((resolve) => {
      if (result.length == 0) resolve(new OperationState("Success", 200));
      let deleted = 0;
      result.forEach((id) =>
        deleteContainer(id).then((result) => {
          if (result.statusCode != 200) resolve(result);
          deleted++;
          if (deleted == result.length) resolve(result);
        })
      );
    }).then((result) => {
      if (result.statusCode != 200) {
        res.status(400).send({ message: result.status });
        return;
      }
      lxd.deleteProject(req.params.projectId).then((result) => {
        if (result.statusCode != 200)
          res.status(400).send({ message: result.status });
        else {
          projectSQL.removeProject(req.params.projectId);
          res.send(result);
        }
      });
    });
  })
);

app.get(
  "/api/projects/:projectId/stateWithHistory",
  isLoggedIn,
  isContainerUsers,
  (req, res) =>
    getProjectStateWithHistory(req.params.projectId).then((result) => {
      if (result.statusCode && result.statusCode != 200)
        res.status(400).send({ message: result.status });
      else res.send(result);
    })
);
