export default class UserProjects {
  constructor(maxResources, projects) {
    this.maxResources = maxResources;
    this.projects = projects;
  }
  maxResources; // -> Limits.js
  projects; // -> Project.js[]
}
