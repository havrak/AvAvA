export default class UserData {
  constructor(user, userProjects, createContainerData) {
    this.user = user;
    this.userProjects = userProjects;
    this.createContainerData = createContainerData;
  }
  user; // -> User.js;
  userProjects; // -> UserProjects.js
  createContainerData; // -> CreateContainerData.js
}
