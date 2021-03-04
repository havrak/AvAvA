export default class ProjectInfo {
  constructor(id, owner, coworkers, maxResources, containersInfo) {
    this.id = id;
    this.owner = owner;
    this.coworkers = coworkers;
    this.maxResources = maxResources;
    this.containersInfo = containersInfo;
  }
  id;
  owner; // -> User.js
  coworkers; // -> User.js[]
  maxResources; // -> Limits.js
  containersInfo; // -> ContainerInfo.js[]
}
