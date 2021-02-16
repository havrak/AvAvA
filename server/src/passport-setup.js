import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.serializeUser(function (user, done) {
  console.log("PASSPORT-SETUP | serializeUser");
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("PASSPORT-SETUP | deserializeUser");
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "868348467869-co5mjv0h0tuitte0ah2o1r0sirnfdfbc.apps.googleusercontent.com",
      clientSecret: "vbpC9wi-MYYfn9nWZsUTp29s",
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("PASSPORT-SETUP | use");
      //console.log(profile);
      return done(null, profile);
    }
  )
);
