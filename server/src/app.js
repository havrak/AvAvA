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

export const isLoggedIn = (req, res, next) => {
	next();
	//if (req.user) { // due to testing purposes authentifikation is removed.
	//  next();
	//} else {
	//  res.sendStatus(401);
	//}
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

app.get("/project/createConfigData", isLoggedIn, (req, res) => {
	projectSQL.createCreateProjectData(email).then((result) => {
		res.send(result);
	});
});

app.post("/project", isLoggedIn, (req, res) => {
	projectSQL.createCreateProjectJSON(email, req.body).then((result) => {
		let id = result.name.substr(1, result.name.length);
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

app.get(
	"/projects/:projectId/createInstanceConfigData",
	isLoggedIn,
	(req, res) => {
		containerSQL
			.createCreateContainerData(req.params.projectId, email)
			.then((result) => {
				res.send(result);
			});
	}
);
app.post("/instances", isLoggedIn, (req, res) => {
	//let email = req.user.email;
	// email -> havranek.krystof@student.gyarab.cz
	containerSQL.createCreateContainerJSON(email, req.body).then((result) => {
		console.log(result);
		let id = result.name.substr(1, result.name.length);
		console.log(id);
		lxd.createInstance(result, result.appsToInstall).then((result) => {
			if (result.statusCode != 200) containerSQL.removeContainer(id);
			console.log("not deteled");
			// upload sshd_config
			containerSQL.generateHaProxyConfigurationFile().then((result) => {
				// upload new haproxy config
				// reload haproxy
			});
			this.getContainerObject(id).then((result) => {
				res.send(result);
			});
		});
		//
	});
});

app.get("/instances/:instanceId/console", isLoggedIn, (req, res) => {
	//some verification to be done beforehand...then:
	lxd.getConsole(req.params.instanceId, req.query.project).then((result) => {
		if (result.control) res.status(200).send(result);
		else res.status(400).send(result); //result -> OperationState
	});
});

app.get("/instances/:instanceId", isLoggedIn, (req, res) => {
	this.getContainerObject(id).then((result) => res.send(result));
});

function getProjectObject(projectId) {
	return new Promise((resolve) => {
		//
		projectSQL.createProjectObject().then((result) => {
			//
		});
	});
}

function getContainerObject(id) {
	return new Promise((resolve) =>
		containerSQL.createContainerObject(id).then((container) =>
			containerSQL.createContainerStateObject(id).then((state) => {
				container.state = state;
				lxd.getInstance(containerd).then((container) => resolve(container));
			})
		)
	);
}

function getContainerState(containerId, projectId) {
	return new Promise((resolve) =>
		containerSQL
			.createContainerStateObject(id)
			.then((result) =>
				lxd
					.getState(containerId, projectId, result)
					.then((result) => resolve(result))
			)
	);
}
