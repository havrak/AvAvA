export default class Project {
  constructor(id, owner, limits, coworkers, containers) {
    this.id = id;
    this.owner = owner;
    this.limits = limits;
    this.coworkers = coworkers;
    this.containers = containers;
  }
  id;
  owner; // -> User.js
  limits; // -> Limits.js
  createdOn;
  coworkers; // -> User.js[]
  containers; // -> Container.js[]
}
