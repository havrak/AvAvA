import express from "express";
export const app = express();
// import cors from "cors";
import { keys } from "../config/keys.js";
import cookieSession from "cookie-session";
import passport from "passport";
import schedule from "node-schedule";

const PORT = process.env.PORT || 5000;

import "./routes/apiRoute.js";
import ProjectStateWithHistory from "./models/ProjectStateWithHistory.js";
import "./models/Limits.js";
import "./services/passport.js";
import "./models/User.js";
import OperationState from "./models/OperationState.js";
import authRoutes from "./routes/authRoute.js";
import projectSQL from "./services/sql/projectSQL.js";
import containerSQL from "./services/sql/containerSQL.js";
import * as lxd from "./routes/lxdRoute.js";
import { resolve } from "node:dns";

app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	})
);

app.use(passport.initialize());
app.use(passport.session());

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

import * as WebSocket from "./services/websocket.js";
app.listen(PORT, () => console.log(`App on port ${PORT}!`)).on(
	"upgrade",
	(req, socket, head) => {
		WebSocket.wss.handleUpgrade(req, socket, head, (socket) =>
			WebSocket.wss.emit("connection", socket, req)
		);
	}
);

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

export function getProjectObject(projectId) {
	return new Promise((resolve) => {
		projectSQL.createProjectObject(projectId).then((project) => {
			lxd.getInstances(project.containers).then((result) => {
				project.containers = result;
				resolve(project);
			});
		});
	});
}

export function getProjectStateWithHistory(id) {
	return new Promise((resolve) => {
		projectSQL.getIdOfContainersInProject(id).then((containerIds) => {
			let counter = 0;
			let toReturn = new ProjectStateWithHistory(id, new Array());
			containerIds.forEach((containerId) => {
				getContainerStateWithHistory(containerId).then((result) => {
					if (result.statusCode == 400) {
						resolve(result);
					}
					toReturn.containerStateHistory.push(result);
					counter++;
					if (counter == containerIds.length) {
						resolve(toReturn);
					}
				});
			});
			if (containerIds.length == 0) {
				toReturn = new ProjectStateWithHistory(id, new Array());
			}
		});
	});
}

export function getContainerObject(id) {
	return new Promise((resolve) => {
		containerSQL.createContainerObject(id).then((container) => {
			containerSQL.createContainerStateObject(id).then((result) => {
				container.state = result;
				lxd.getInstance(container).then((result) => {
					containerSQL.updateContainerStateObject(
						id,
						false,
						result.state.operationState.statusCode
					);
					resolve(result);
				});
			});
		});
	});
}

export function deleteContainer(id) {
	return new Promise((resolve) => {
		containerSQL.getProjectIdOfContainer(id).then((project) => {
			lxd.stopInstance(id, project).then((result) => {
				if (result.statusCode != 200) {
					resolve(
						new OperationState(
							{
								message:
									"Container c" +
									id +
									" Could have been deleted: " +
									result.status,
							},
							400
						)
					);
				} else {
					lxd.deleteInstance(id, project).then((result) => {
						if (result.statusCode != 200) {
							resolve(
								new OperationState(
									{
										message:
											"Container c" +
											id +
											" Could have been deleted: " +
											result.status,
									},
									400
								)
							);
						} else {
							containerSQL.removeContainer(id);
							resolve(
								new OperationState(
									{ message: "Successfully deleted container" },
									200
								)
							);
						}
					});
				}
			});
		});
	});
}

export function getContainerState(containerId, projectId) {
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

export function getContainerStateWithHistory(id) {
	return new Promise((resolve) => {
		containerSQL.getProjectIdOfContainer(id).then((result) => {
			if (result.statusCode != 200 && result.statusCode != undefined) {
				resolve(result);
			} else {
				getContainerState(id, result).then((result) => {
					containerSQL.getContainerHistory(id).then((history) => {
						// this will be pushed into list result;
						history.push(result);
						resolve({ id: id, stateHistory: history });
					});
				});
			}
		});
	});
}

let haproxyConfigIsBeingCreated = false;
export function reloadHaproxy() {
	return new Promise((resolve) => {
		if (!haproxyConfigIsBeingCreated) {
			haproxyConfigIsBeingCreated = true;
			containerSQL.generateHaProxyConfigurationFile().then((result) => {
				lxd.postFileToInstance(
					"haproxy",
					"default",
					"../../config/serverconfiguartions/haproxy.cfg",
					"/etc/haproxy/haproxy.cfg"
				).then((result) => {
					lxd.execInstance(
						"haproxy",
						"default",
						"sleep 5; systemctl reload haproxy.service", // it takes a little bit of time for new container to react
						false
					);
				});
				haproxyConfigIsBeingCreated = false;
				resolve(
					new OperationState("Proxy has been successfully created", 200)
				);
			});
		} else {
			resolve(new OperationState("Proxy is currently being created", 400));
		}
	});
}

schedule.scheduleJob("*/10 * * * *", () => {
	containerSQL.getAllContainers().then((result) => {
		result.forEach((cont) => {
			containerSQL.createContainerStateObject(cont.id).then((result) => {
				lxd.getState(cont.id, cont.project_id, result).then((result) => {
					containerSQL.updateLogsForContainer(cont.id, result);
				});
			});
		});
	});
});
