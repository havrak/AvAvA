import os from "os";

import "./services/passport.js";
import systemconfig from "../config/systemconfig.js";
import "./models/Limits.js";
import "./models/User.js";
import UserData from "./models/UserData.js";
import UserProjects from "./models/UserProjects.js";
import UserStateWithHistory from "./models/UserStateWithHistory.js";

import {
	app,
	reloadHaproxy,
	isLoggedIn,
	isProjectUsers,
	isContainerUsers,
	getProjectObject,
	getProjectStateWithHistory,
	getContainerObject,
	deleteContainer,
	getContainerStateWithHistory,
} from "../app.js";
import userSQL from "./services/sql/userSQL.js";
import projectSQL from "./services/sql/projectSQL.js";
import containerSQL from "./services/sql/containerSQL.js";
import lxd from "./lxdRoute.js";

//NOTE: replace with: let email = req.user.email;
const email = "krystof.havranek@student.gyarab.cz";

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

app.get("/api/projects/createConfigData", isLoggedIn, (req, res) => {
	projectSQL.createCreateProjectData(email).then((result) => {
		res.send(result);
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

app.get("/api/projects/:projectId", isProjectUsers, isLoggedIn, (req, res) => {
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
	"/api/instances/createInstanceConfigData",
	isLoggedIn,
	isProjectUsers,
	(req, res) => {
		containerSQL.createCreateContainerData(email).then((result) => {
			res.send(result);
		});
	}
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

app.get(
	"/api/instances/:instanceId/console",
	isLoggedIn,
	isContainerUsers,
	(req, res) => {
		lxd.getConsole(
			req.params.instanceId,
			containerSQL.getProjectIdOfContainer(req.params.instanceId)
		).then((result) => {
			//{ terminal: "terminalSecret", control: "controlSecret"}
			if (result.control) res.status(200).send(result);
			else res.status(400).send({ message: result.status }); //result -> OperationState
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

app.get(
	"/api/instances/:instanceId/export",
	isLoggedIn,
	isContainerUsers,
	(req, res) =>
		lxd
			.exportInstance(
				req.params.instanceId,
				containerSQL.getProjectIdOfContainer(req.params.instanceId),
				res
			)
			.then((result) => {
				if (result.statusCode && result.statusCode != 200)
					res.status(400).send({ message: result.status });
			})
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
