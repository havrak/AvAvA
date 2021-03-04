export default class UserProjectsInfo {
  constructor(maxResources, projectsInfo) {
    this.maxResources = maxResources;
    this.projectsInfo = projectsInfo;
  }
  maxResources; // -> Limits.js[]
  projectsInfo; // -> ProjectInfo.js[]
}
