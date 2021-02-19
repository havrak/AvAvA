export default class Instance {
  constructor(
    id,
    name,
    template,
    ipv4,
    ipv6,
    persistent,
    timestamp,
    OperationState
  ) {
    this.id = id;
    this.name = name;
    this.template = template;
    this.ipv4 = ipv4;
    this.ipv6 = ipv6;
    this.persistent = persistent;
    this.timestamp = timestamp;
    this.OperationState = OperationState;
  }

  id;
  name;
  template;
  ipv4;
  ipv6;
  persistent;
  timestamp;
  OperationState;
}
