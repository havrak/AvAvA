export default class Container {
  constructor(
    id,
    name,
    url,
    template,
    createdOn,
    lastStartedOn,
    maxResources,
    snapshots,
    state
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.template = template;
    this.createdOn = createdOn;
    this.lastStartedOn = lastStartedOn;
    this.maxResources = maxResources;
    this.snapshots = snapshots;
    this.state = state;
  }
  id;
  name;
  url;
  template; // -> Template.js
  stateful;
  createdOn;
  lastStartedOn;
  snapshots; // -> Snapshot.js
  state; // -> ContainerResourceState.js
}
