export default class Project {
  constructor(id, owner, coworkers, maxResources, containers) {
    this.id = id;
    this.owner = owner;
    this.coworkers = coworkers;
    this.maxResources = maxResources;
    this.containers = containers;
  }
  id;
  owner; // -> User.js
  coworkers; // -> User.js[]
  maxResources; // -> Limits.js[]
  containers; // -> Container.js[]
}
