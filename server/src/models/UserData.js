export default class UserData {
  constructor(user, userProjects, createInstanceConfigData) {
    this.user = user;
    this.userProjects = userProjects;
    this.createInstanceConfigData = createInstanceConfigData;
  }
  user; // -> User.js;
  userProjects; // -> UserProjects.js
  createInstanceConfigData;
  hostInformation = {
    CPU: {
      model: undefined,
      frequency: undefined,
    },
  };
}
