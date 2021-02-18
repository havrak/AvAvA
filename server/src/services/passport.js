import passport from "passport";
import { keys } from "../../config/keys.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { SQLInterface } from "./../databaseInterface.js";

//import { SQLInterface } from "./../databaseInterface.js";

//možná bude nutné u serializeUser, deserializeUser a třetí metodě (accessToken, refreshToken, profile, done) přidat do hlavičky async a pracovat s await, jelikož v nich pracujete s databází, což je asynchronní operace. Potom byste to museli přidávat i do všech routů, ze kterých to voláte. Udělejte to pouze, když to bez nich nebude fungovat //asynchronní

passport.serializeUser((user, done) => {
  //metoda se volá, když je potřeba do session souboru uložit něco, podle čeho se pozná aktuální uživatel. Ten se pozná podle id, které je uložené v databázi uživatelů. Vrať tedy done(null, user.id)
  //  na základě mailu
  //
  console.log("serialize");
  SQLInterface.getIdForUser(user.email).then((result) => {
    done(null, result.id);
  });
  done(null, null);
});

passport.deserializeUser((id, done) => {
  //V proměnné id je uložené id uživatele, které je vráceno metodou serializeUser a uloženo v session souboru. Na základě něj přistup do databáze a zavolej done(null, userFromDatabaseWithAllTheData)
  console.log("deserialize");
  console.log(id);
  SQLInterface.getUserByOauthID(id).then((result) =>
    done(null, { id: result.id, email: result.email })
  );
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
      console.log("New user");
      console.log(profile);
      SQLInterface.addNewUserToDatabase(profile).then(); //asynchronní
      const user = {
        id: profile.id,
        email: profile.emails[0].value,
      };
      done(null, user);
      //TATO METODA SE VOLÁ JEN JEDNOU a to při přihlášení, jinak se volají serialize a deserializeUser, které využívají na autentifikaci session
      //zjisti, zda uživatel s profile.emails[0].value je uložen v databázi. Pokud ano, vrať objekt získaný z databáze - zavolej done(null, existingUser).
      //Pokud ne, ulož do databáze nového uživatele a zavolej done(null, newUser)
      //Do databáze - vygenerované ID, email, role + věci specifické pro kentejnery
      //Poznámka - vytvoř si ve třídě models User.js. Metodou done budeš vracet její instance. Toto je ta samá instance, kterou vracíš pomocí done v metodě deserializeUser
      //  User.findOne({ userId: profile.id }).then((existingUser) => {
      //     if (existingUser) {
      //        done(null, existingUser);
      //     } else {
      //        new User({
      //           userId: profile.id,
      //           username: profile.displayName,
      //           picture: profile._json.picture,
      //        })
      //           .save()
      //           .then((user) => {
      //              done(null, user);
      //           });
      //     }
      //  });
    }
  )
);
