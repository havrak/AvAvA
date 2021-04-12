import express from "express";
const app = express();
// import cors from "cors";
import { keys } from "../config/keys.js";
import systemconfig from "../config/systemconfig.js";
import cookieSession from "cookie-session";
import passport from "passport";
import schedule from "node-schedule";

import UserData from "./models/UserData.js";

const PORT = process.env.PORT || 5000;
import UserProjects from "./models/UserProjects.js";
import ProjectStateWithHistory from "./models/ProjectStateWithHistory.js";
import UserStateWithHistory from "./models/UserStateWithHistory.js";
import "./models/User.js";
import "./services/passport.js";
import "./models/Limits.js";
import projectSQL from "./services/sql/projectSQL.js";
import os from "os";
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
import userSQL from "./services/sql/userSQL.js";
import OperationState from "./models/OperationState.js";
server.on("upgrade", (req, socket, head) => {
	WebSocket.wss.handleUpgrade(req, socket, head, (socket) =>
		WebSocket.wss.emit("connection", socket, req)
	);
});

app.get("/api/combinedData", isLoggedIn, (req, res) => {
	//
	let toReturn = new UserData();
	userSQL.getUserByEmail(email).then((result) => {
		toReturn.user = result;
		toReturn.hostInformation.CPU.model = os.cpus()[0].model; // this works, however as developnet isn't done on server one gets model nad frequency of his own cpu
		toReturn.hostInformation.CPU.frequency = systemconfig.frequency;
		containerSQL.createCreateContainerData(email).then((result) => {
			toReturn.createInstanceConfigData = result;
			userSQL.getUsersLimits(email).then((result) => {
				toReturn.userProjects = new UserProjects();
				toReturn.userProjects.limits = result;
				userSQL.getAllUsersProjects(email).then((result) => {
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
				});
			});
		});
	});
});

app.get(
	"/api/projects/stateWithHistory",
	isLoggedIn,
	isProjectUsers,
	(req, res) => {
		userSQL.getAllUsersProjects(email).then((projectIds) => {
			let counter = 0;
			let toReturn = new UserStateWithHistory(new Array());
			projectIds.forEach((id) => {
				getProjectStateWithHistory(id).then((result) => {
					if (result.statusCode == 400) {
						res.statusCode = 400;
						res.send({ message: result.status });
					}
					toReturn.projectStatesHistory.push(result);
					counter++;
					if (counter == projectIds.length) {
						res.send(toReturn);
					}
				});
			});
			if (projectIds.length == 0) {
				res.send(toReturn);
			}
		});
	}
);

app.get(
	"/api/projects/:projectId/stateWithHistory",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		getProjectStateWithHistory(req.params.projectId).then((result) => {
			if (result.statusCode == 400) {
				res.statusCode(400);
				res.send({ message: result.status });
			} else {
				res.send(result);
			}
		});
	}
);

app.get(
	"/api/instances/:instanceId/stateWithHistory",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		getContainerStateWithHistory(req.params.instanceId).then((result) => {
			if (result.statusCode == 400) {
				res.statusCode(400);
				res.send({ message: result.status });
			} else {
				res.send(result);
			}
		});
	}
);

app.get("/api/projects/createConfigData", isLoggedIn, (req, res) => {
	projectSQL.createCreateProjectData(email).then((result) => {
		res.send(result);
	});
});

app.post("/api/projects", isLoggedIn, (req, res) => {
	projectSQL.createCreateProjectJSON(email, req.body).then((project) => {
		if (project.statusCode == 400) {
			res.statusCode = 400;
			res.send(project.status);
		}
		let id = project.name; // createProject will rewrite name variable thus it is easyest to store it in variable
		lxd.createProject(project).then((result) => {
			if (result.statusCode != 200) {
				projectSQL.removeProject(id);
			} else {
				getProjectObject(id).then((result) => {
					res.send(result);
				});
			}
			//
		});
	});
});

app.delete("/api/projects/:projectId", isLoggedIn, (req, res) => {
	projectSQL
		.getIdOfContainersInProject(req.params.projectId)
		.then((result) => {
			let counter = 0;
			result.forEach((id) => {
				deleteContainer(id).then((result) => {
					counter++;
					if (result.statusCode != 200) {
						res.statusCode = 400;
						res.send({
							message:
								"Project couldn't have been deleted, problem with container: " +
								id,
						});
					} else {
						if (counter == result.length) {
							lxd.deleteProject(req.params.projectId).then((result) => {
								if (result.statusCode == 200) {
									projectSQL.removeProject(req.params.projectId);
									res.statusCode = 200;
									res.send({
										message: "Project was successfully deleted'",
									});
								}
							});
						}
					}
				});
			});
			if (result.length == 0) {
				lxd.deleteProject(req.params.projectId).then((result) => {
					if (result.statusCode == 200) {
						projectSQL.removeProject(req.params.projectId);
						res.statusCode = 200;
						res.send({ message: "Project was successfully deleted'" });
					}
				});
			}
		});
});

app.get("/api/projects/:projectId", isProjectUsers, isLoggedIn, (req, res) => {
	getProjectObject(req.params.projectId).then((result) => {
		res.send(result);
	});
});

app.get(
	"/api/instances/createInstanceConfigData",
	isLoggedIn,
	isProjectUsers,
	(req, res) => {
		containerSQL.createCreateContainerData(email).then((result) => {
			res.send(result);
		});
	}
);

app.post("/api/instances", isLoggedIn, (req, res) => {
	//let email = req.user.email;
	// email -> havranek.krystof@student.gyarab.cz
	// TODO: check if user owns project in which he is trying to create new container
	containerSQL.createCreateContainerJSON(email, req.body).then((result) => {
		if (result.statusCode == 400) {
			console.log(result);
			res.statusCode = 400;
			res.send(result.status);
		}
		let id = result.name;
		let projectId = result.project;
		console.log(id);
		lxd.createInstance(result, result.appsToInstall).then((result) => {
			console.log(result);
			if (result.statusCode != 200) {
				console.log(id);
				containerSQL.removeContainer(id);
				res.statusCode = result.statusCode;
				res.send = result.status;
			} else {
				// upload sshd_config
				lxd.postFileToInstance(
					id,
					projectId,
					"../../config/serverconfiguartions/sshd_config",
					"/etc/ssh/sshd_config"
				).then((result) => {
					console.log("file uploaded");
					lxd.execInstance(
						id,
						projectId,
						"systemctl enable ssh.service",
						false,
						false
					);
					lxd.execInstance(
						id,
						projectId,
						"passwd " + req.body.rootPassword,
						false,
						false
					);
				});
				//
				reloadHaproxy(); // TODO: move to sperate function, that will make sure proxy gets reloaded
				getContainerObject(id).then((result) => {
					res.send(result);
				});
			}
		});
		//
	});
});

app.get(
	"/api/projects/:projectId/instances/:instanceId/console",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		//some verification to be done beforehand...then:
		lxd.getConsole(req.params.instanceId, req.params.projectId).then(
			(result) => {
				//{ terminal: "terminalSecret", control: "controlSecret"}
				if (result.control) res.status(200).send(result);
				else res.status(400).send({ message: result.status }); //result -> OperationState
			}
		);
	}
);

app.get(
	"/api/projects/:projectId/instances/:instanceId/export",
	isLoggedIn,
	isContainerUsers,
	(req, res) =>
		lxd
			.exportInstance(
				req.params.instanceId,
				req.params.projectId,
				(stream) => stream.pipe(res)
			)
			.then((result) => {
				if (result.statusCode && result.statusCode != 200)
					res.status(400).send({ message: result.status });
			})
);

app.get(
	"/api/instances/:instanceId",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		getContainerObject(req.params.instanceId).then((result) => {
			if (result.statusCode == 400) {
				res.statusCode = 400;
				res.send({ message: result.status });
			}
			res.send(result);
		});
	}
);

app.delete(
	"/api/instances/:instanceId",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		deleteContainer(req.params.instanceId).then((result) => {
			res.statusCode = result.statusCode;
			res.send(result.status);
		});
	}
);

app.patch(
	"/api/projects/:projectId",
	isLoggedIn,
	isProjectUsers,
	(req, res) => {
		projectSQL
			.updateProjectLimits(req.body, req.params.projectId, email)
			.then((result) => {
				console.log(result);
				if (result.haproxy) {
					reloadHaproxy().then((result) => {
						if (result.statusCode == 400) {
							while (!haproxyConfigIsBeingCreated) sleep(1);
							reloadHaproxy();
						}
					});
				}
				getProjectObject(req.params.projectId).then((result) => {
					if (result.statusCode == 400) {
						res.statusCode = 400;
						res.send({ message: result.status });
					}
					res.send(result);
				});
			});
	}
);

app.patch(
	"/api/instances/:instanceId/start",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		containerSQL
			.getProjectIdOfContainer(req.params.instanceId)
			.then((result) => {
				lxd.startInstance(req.params.instanceId, result).then((result) => {
					if (result.statusCode != 200) {
						res.statusCode = 400;
						res.send({
							message:
								"Container c" +
								req.params.instanceId +
								" couldn't have been started: " +
								result.status,
						});
					} else {
						containerSQL
							.updateContainerStateObject(
								req.params.instanceId,
								true,
								103
							)
							.then((result) => {
								console.log(result);
								getContainerObject(req.params.instanceId).then(
									(result) => {
										console.log(" " + result);
										res.send(result);
									}
								);
							});
					}
				});
			});
	}
);
app.patch(
	"/api/instances/:instanceId/stop",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		console.log(req.params);
		containerSQL
			.getProjectIdOfContainer(req.params.instanceId)
			.then((result) => {
				lxd.stopInstance(req.params.instanceId, result).then((result) => {
					if (result.statusCode != 200) {
						res.statusCode = 400;
						res.send({
							message:
								"Container c" +
								req.params.instanceId +
								" couldn't have been stopped: " +
								result.status,
						});
					} else {
						containerSQL
							.updateContainerStateObject(
								req.params.instanceId,
								false,
								102
							)
							.then((result) => {
								getContainerObject(req.params.instanceId).then(
									(result) => {
										console.log(result);
										res.send(result);
									}
								);
							});
					}
				});
			});
	}
);
app.patch(
	"/api/instances/:instanceId/freeze",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		containerSQL
			.getProjectIdOfContainer(req.params.instanceId)
			.then((result) => {
				lxd.freezeInstance(req.params.instanceId, result).then((result) => {
					if (result.statusCode != 200) {
						res.statusCode = 400;
						res.send({
							message:
								"Container c" +
								req.params.instanceId +
								" couldn't have been frozen: " +
								result.status,
						});
					} else {
						containerSQL
							.updateContainerStateObject(
								req.params.instanceId,
								false,
								110
							)
							.then((result) => {
								getContainerObject(req.params.instanceId).then(
									(result) => {
										res.send(result);
									}
								);
							});
					}
				});
			});
	}
);

app.patch(
	"/api/instances/:instanceId/unfreeze",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		containerSQL
			.getProjectIdOfContainer(req.params.instanceId)
			.then((result) => {
				lxd.unfreezeInstance(req.params.instanceId, result).then(
					(result) => {
						if (result.statusCode != 200) {
							res.statusCode = 400;
							res.send({
								message:
									"Container c" +
									req.params.instanceId +
									" couldn't have been unfrozen: " +
									result.status,
							});
						} else {
							containerSQL
								.updateContainerStateObject(
									req.params.instanceId,
									false,
									103
								)
								.then((result) => {
									getContainerObject(req.params.instanceId).then(
										(result) => {
											res.send(result);
										}
									);
								});
						}
					}
				);
			});
	}
);

app.get(
	"/api/instances/:instanceId/snapshots",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		//
	}
);

function getProjectStateWithHistory(id) {
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

function getContainerStateWithHistory(id) {
	return new Promise((resolve) => {
		containerSQL.getProjectIdOfContainer(id).then((result) => {
			if (result.statusCode != 200 && result.statusCode != undefined) {
				resolve(result);
			} else {
				getContainerState(id, result).then((result) => {
					containerSQL.getContainerHistory(id).then((history) => {
						// this will be pushed into list result;
						history.push(result);
						resolve({ id: id, containerStateHistory: history });
					});
				});
			}
		});
	});
}

let haproxyConfigIsBeingCreated = false;
function reloadHaproxy() {
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

function deleteContainer(id) {
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

function getContainerObject(id) {
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
		projectSQL.createProjectObject(projectId).then((project) => {
			lxd.getInstances(project.containers).then((result) => {
				project.containers = result;
				resolve(project);
			});
		});
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
