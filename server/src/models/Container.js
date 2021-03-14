export default class Container {
  constructor(
    id,
    name,
    url,
    template,
    ipv4,
    ipv6,
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
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
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
  ipv4;
  ipv6;
  stateful;
  createdOn;
  lastStartedOn;
  snapshots; // -> Snapshot.js
  state; // -> ResourceState.js
}
