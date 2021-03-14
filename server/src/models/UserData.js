export default class UserData {
  constructor(user, userProjects, hostInformation) {
    this.user = user;
    this.userProjects = userProjects;
    this.hostInformation = hostInformation;
  }
  user; // -> User.js;
  userProjects; // -> UserProjects.js
  hostInformation; // -> hostInformation.js
}
