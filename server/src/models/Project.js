export default class Project {
  constructor(id, name, owner, limits, createdOn, coworkers, containers) {
    this.id = id;
    this.name = name;
    this.owner = owner;
    this.limits = limits;
    this.createdOn = createdOn;
    this.coworkers = coworkers;
    this.containers = containers;
  }
  id;
  name;
  owner; // -> User.js
  limits; // -> Limits.js
  createdOn;
  coworkers; // -> User.js[]
  containers; // -> Container.js[]
}
