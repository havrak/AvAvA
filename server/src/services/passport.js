import passport from "passport";
import { keys } from "../../config/keys.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userSQL from "./sql/userSQL.js";

passport.serializeUser((user, done) => {
  //metoda se volá, když je potřeba do session souboru uložit něco, podle čeho se pozná aktuální uživatel. Ten se pozná podle id, které je uložené v databázi uživatelů. Vrať tedy done(null, user.id)
  //  na základě mailu
  //
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //V proměnné id je uložené id uživatele, které je vráceno metodou serializeUser a uloženo v session souboru. Na základě něj přistup do databáze a zavolej done(null, userFromDatabaseWithAllTheData)
  userSQL.getUserByID(id).then((result) => done(null, result));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);

      userSQL.addNewUserToDatabaseAndReturnIt(profile).then((result) => {
        done(null, result);
      });
    }
  )
);
