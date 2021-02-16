import express from "express";
import cors from "cors";
//import * as bodyParser from "body-parser";
import passport from "passport";
import * as cookieSession from "cookie-session";
import { SQLInterface } from "./databaseInterface.js";
import * as lxd from "./lxd.js";

lxd.request.end();
const app = express();
import "./passport-setup.js";

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(
//    cookieSession({
//       name: "tuto-session",
//       keys: ["key1", "key2"],
//    })
// );

SQLInterface.test();

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("Example Home page!"));
app.get("/failed", (req, res) => res.send("You Failed to log in!"));

app.get("/dashboard", isLoggedIn, (req, res) =>
  res.send(`Welcome mr ${req.user.displayName}!`)
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3001/auth/google",
  }),
  function (req, res) {
    res.send(req.user);
  }
);

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.sendStatus(200);
});

const PORT = 3001;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
