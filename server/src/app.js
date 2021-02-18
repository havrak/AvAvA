import express from "express";
const app = express();
// import cors from "cors";
import { keys } from "../config/keys.js";
import cookieSession from "cookie-session";
import passport from "passport";
const PORT = process.env.PORT || 5000;
import "./models/User.js";
import "./services/passport.js";
//import * as bodyParser from "body-parser";
// import { SQLInterface } from "./databaseInterface.js";
import * as lxd from "./lxd/api.js";

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
authRoutes(app);

// app.use(cors());

//v produkci bude react soubory obsluhovat node server
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// SQLInterface.test();

const isLoggedIn = (req, res, next) => {
  //na req.user.role se bude dát získat role uživatele a pomocí ní zjistit, zda má uživatel přístup k části API
  // pro autentizaci předejte jako middleware:
  //app.get("/api/containers", isLoggedIn, (req, res) =>
  //res.send(`Welcome mr ${req.user.displayName}!`)
  //);
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
