const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: "868348467869-co5mjv0h0tuitte0ah2o1r0sirnfdfbc.apps.googleusercontent.com",
    clientSecret: "vbpC9wi-MYYfn9nWZsUTp29s",
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));