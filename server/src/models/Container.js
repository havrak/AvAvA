export default class Container {
  constructor(
    id,
    name,
    template,
    ipv4,
    ipv6,
    createdOn,
    lastStartedOn,
    stateful,
    statusCode,
    maxResources,
    snapshots,
    state
  ) {
    this.id = id;
    this.name = name;
    this.template = template;
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
    this.createdOn = createdOn;
    this.lastStartedOn = lastStartedOn;
    this.stateful = stateful;
    this.statusCode = statusCode;
    this.maxResources = maxResources;
    this.snapshots = snapshots;
    this.state = state;
  }
  id;
  name;
  template; // Template.js
  ipv4;
  ipv6;
  createdOn;
  lastStartedOn;
  stateful;
  statusCode;
  maxResources; // -> Limits.js
  snapshots; // -> Snapshot.js
  state; // -> ResourceState.js
}
