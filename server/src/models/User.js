export default class User {
  constructor(id, email, givenName, familyName, role, icon, coins) {
    this.id = id;
    this.email = email;
    this.givenName = givenName;
    this.familyName = familyName;
    this.role = role;
    this.icon = icon;
    this.coins = coins;
  }
  id; // corresponds to id
  email; // corresponds to email
  givenName; // corresponds to give_name
  familyName; // corresponds to family_name
  role; // 0 - normal user, 1 - admin, 2 - superadmin
  icon;
  coins;
}
