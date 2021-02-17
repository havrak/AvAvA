//klíče ve fázi produkce - deploynutý projekt
export default {
    googleClientID:process.env.GOOGLE_CLIENT_ID,
    googleClientSecret:process.env.GOOGLE_SECRET_ID,
    // connection do databáze pro produkční mód - deployment
    cookieKey:process.env.COOKIE_KEY
}