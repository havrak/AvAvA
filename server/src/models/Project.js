export default class Project {
  constructor(id, owner, coworkers, projectState, containers) {
    this.id = id;
    this.owner = owner;
    this.coworkers = coworkers;
    this.projectState = projectState;
    this.containers = containers;
  }
  id;
  owner; // -> User.js
  createdOn;
  coworkers; // -> User.js[]
  projectState; // -> LightResourceState.js
  containers; // -> Container.js[]
}
