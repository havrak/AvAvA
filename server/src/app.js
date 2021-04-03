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

//v produkci bude react soubory obsluhovat node server
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

const isLoggedIn = (req, res, next) => {
  next();
  //if (req.user) { // due to testing purposes authentifikation is removed.
  //  next();
  //} else {
  //  res.sendStatus(401);
  //}
};

//NOTE: replace with: let email = req.user.email;
const email = "krystof.havranek@student.gyarab.cz";

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

app.get("/project/createConfigData", isLoggedIn, (req, res) => {
<<<<<<< HEAD
  projectSQL.createCreateProjectData(req.user.email).then((result) => {
=======
  projectSQL.createCreateProjectData(email).then((result) => {
>>>>>>> a1f6130 (SQL logic for creating containers and project, not tested, just need to get newest commit)
    res.send(result);
  });
});

app.post("/project", isLoggedIn, (req, res) => {
<<<<<<< HEAD
  //let email = req.user.email;
  // email -> havranek.krystof@student.gyarab.cz
  let email = "havranek.krystof@student.gyarab.cz";
  projectSQL.createCreateProjectJSON(email, req.body).then((result) => {
    //
  });
  console.log(req);
  console.log(req.body);
  console.log(req.body.name);
  //
=======
  projectSQL.createCreateProjectJSON(email, req.body).then((result) => {
    console.log(result);
  });
>>>>>>> a1f6130 (SQL logic for creating containers and project, not tested, just need to get newest commit)
});

app.get(
  "/projects/:projectId/createInstanceConfigData",
  isLoggedIn,
  (req, res) => {
    containerSQL
      .createCreateContainerData(projectId.params.projectId, email)
      .then((result) => {
        res.send(result);
      });
  }
);
app.post("/instances", isLoggedIn, (req, res) => {
  //let email = req.user.email;
  // email -> havranek.krystof@student.gyarab.cz
  containerSQL.createCreateContainerJSON(email, req.body).then((result) => {
    //
  });
});

app.post("/project", isLoggedIn, (req, res) => {
  let email = "havranek.krystof@student.gyarab.cz";
  containerSQL.createCreateContainerJSON(email, config).then((result) => {
    //
  });
});
