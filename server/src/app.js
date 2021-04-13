import express from "express";
export const app = express();
// import cors from "cors";
import { keys } from "../config/keys.js";
import cookieSession from "cookie-session";
import passport from "passport";
import schedule from "node-schedule";

const PORT = process.env.PORT || 5000;

import "./services/passport.js";
import authRoutes from "./routes/authRoute.js";
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

//v produkci bude react soubory obs flushovat node server
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

import("./routes/apiRoute.js");

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
