import express from "express";
const app = express();
// import cors from "cors";
import { keys } from "../config/keys.js";
import cookieSession from "cookie-session";
import passport from "passport";
const PORT = process.env.PORT || 5000;
import "./models/User.js";
import "./services/passport.js";
import "./models/Limits.js";
import projectSQL from "./services/sql/projectSQL.js";

//import * as bodyParser from "body-parser";
import * as lxd from "./routes/lxdquery.js";

lxd.test();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

import authRoutes from "./routes/authRoute.js";
import containerSQL from "./services/sql/containerSQL.js";
authRoutes(app);

// app.use(cors());

//v produkci bude react soubory obs fluhovat node server
/*if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}*/

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// SQLInterface.test();

/* const to verify whether user is logged in via google auth
 *
 */
export const isLoggedIn = (req, res, next) => {
  next();
  //if (req.user) { // due to testing purposes authentifikation is removed.
  //  next();
  //} else {
  //  res.sendStatus(401);
  //}
};

/*  const to verify whether container which id was given in
 * 	request truly belongs to the user or whether user is
 * 	coworker on project which container is part of
 *
 */
export const isContainerUsers = (req, res, next) => {
  next();
  // userSQL
  //   .doesUserOwnGivenContainer(req.params.instanceId, req.user.email)
  //   .then((result) => {
  //     if (result) next();
  //     else res.sendStatus(401);
  //   });
};

/*  const to verify whether project which id was given in
 * 	request truly belongs to the user or whether user is
 * 	coworker on it
 *
 */
export const isProjectUsers = (req, res, next) => {
  next();
  // userSQL
  //   .doesUserOwnGivenProject(req.params.projectId, req.user.email)
  //   .then((result) => {
  //     if (result) next();
  //     else res.sendStatus(401);
  //   });
};

//NOTE: replace with: let email = req.user.email;
const email = "krystof.havranek@student.gyarab.cz";

const server = app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`)
);

import * as WebSocket from "./services/websocket.js";
import { resolve } from "node:dns";
server.on("upgrade", (req, socket, head) => {
  WebSocket.wss.handleUpgrade(req, socket, head, (socket) =>
    WebSocket.wss.emit("connection", socket, req)
  );
});

app.get("/api/project/createConfigData", isLoggedIn, (req, res) => {
  projectSQL.createCreateProjectData(email).then((result) => {
    res.send(result);
  });
});

app.post("/api/project", isLoggedIn, (req, res) => {
  projectSQL.createCreateProjectJSON(email, req.body).then((result) => {
    lxd.createProject(result).then((result) => {
      if (result.err_code != 200) {
        projectSQL.removeProject(id);
        res.send(result);
      }
      //
    });
    console.log(result);
  });
});

app.get("/api/projects/:projectId", isProjectUsers, isLoggedIn, (req, res) => {
  console.log(req.params.projectId);
  getProjectObject(req.params.projectId).then((project) => {
    console.log(project);
    lxd.getInstances(project.containers).then((result) => {
      project.containers = result;
      res.send(project);
    });
  });
});

app.get(
  "/api/projects/:projectId/createInstanceConfigData",
  isLoggedIn,
  isProjectUsers,
  (req, res) => {
    containerSQL
      .createCreateContainerData(req.params.projectId, email)
      .then((result) => {
        res.send(result);
      });
  }
);

let haproxyConfigIsBeingCreated = false;
app.post("/api/instances", isLoggedIn, (req, res) => {
  //let email = req.user.email;
  // email -> havranek.krystof@student.gyarab.cz
  containerSQL.createCreateContainerJSON(email, req.body).then((result) => {
    console.log(result);
    let id = result.name;
    let projectId = result.project;
    console.log(id);
    lxd.createInstance(result, result.appsToInstall).then((result) => {
      if (result.statusCode != 200) containerSQL.removeContainer(id);
      console.log("not deteled");
      // upload sshd_config
      lxd
        .postFileToInstance(
          id,
          projectId,
          ".../.../config/serverconfiguartions/ssh_config",
          "/etc/ssh"
        )
        .then((result) => {
          let commands = new Array();
          commands.push("systemctl enable haproxy.service");
          lxd.execInstance(id, projectId, commands, false, false);
          commands = new Array();
          commands.push("passwd " + req.body.rootPassword);
          lxd.execInstance(id, projectId, commands, false, false);
        });
      //
      if (!haproxyConfigIsBeingCreated) {
        // TODO: come up with better solution to prevent concurrent creating of haproxy config but make it still create it, add listener for another variable that will create new config if container was added when another one was being created
        // this solution just makes sure that the config won't be corrupted
        haproxyConfigIsBeingCreated = true;
        containerSQL.generateHaProxyConfigurationFile().then((result) => {
          lxd
            .postFileToInstance(
              "haproxy",
              "default",
              "../../config/serverconfiguartions/ssh_config",
              "/etc/ssh"
            )
            .then((result) => {
              let commands = new Array();
              commands.push("systemctl reload haproxy.service");
              lxd.execInstance("haproxy", "default", commands, false, true);
            });
          haproxyConfigIsBeingCreated = false;
        });
      }
      getContainerObject(id).then((result) => {
        res.send(result);
      });
    });
    //
  });
});

app.get(
  "/api/instances/:instanceId/console",
  isLoggedIn,
  isContainerUsers,
  (req, res) => {
    //some verification to be done beforehand...then:
    lxd.getConsole(req.params.instanceId, req.query.project).then((result) => {
      //{ terminal: "terminalSecret", control: "controlSecret"}
      if (result.control) res.status(200).send(result);
      else res.status(400).send(result); //result -> OperationState
    });
  }
);

app.get(
  "/api/instances/:instanceId",
  isLoggedIn,
  isContainerUsers,
  (req, res) => {
    getContainerObject(req.params.instanceId).then((result) => {
      res.send(result);
    });
  }
);

function getContainerObject(id) {
  return new Promise((resolve) => {
    containerSQL.createContainerObject(id).then((container) => {
      containerSQL.createContainerStateObject(id).then((result) => {
        container.state = result;
        lxd.getInstance(container).then((result) => {
          containerSQL.updateContainerStateObject(
            id,
            false,
            result.state.OperationState.statusCode
          );
          resolve(result);
        });
      });
    });
  });
}

function getContainerState(containerId, projectId) {
  return new Promise((resolve) => {
    containerSQL.createContainerStateObject(containerId).then((result) => {
      console.log(result);
      lxd.getState(containerId, projectId, result).then((result) => {
        resolve(result);
        //
      });
    });
  });
}

function getProjectObject(projectId) {
  return new Promise((resolve) => {
    //
    projectSQL.createProjectObject(projectId).then((result) => {
      resolve(result);
    });
  });
}
