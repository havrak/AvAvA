const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const SQLInterface = require("./databaseInterface.js");

require("./passport-setup");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
