export default class Project {
  constructor(id, owner, limits, coworkers, projectState, containers) {
    this.id = id;
    this.owner = owner;
    this.limits = limits;
    this.coworkers = coworkers;
    this.projectState = projectState;
    this.containers = containers;
  }
  id;
  owner; // -> User.js
  limits; // -> Limits.js
  createdOn;
  coworkers; // -> User.js[]
  projectState; // -> LightResourceState.js
  containers; // -> Container.js[]
}
