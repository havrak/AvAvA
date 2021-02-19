export default class Snapshot {
  constructor(id, name, timestamp, stateful) {
    this.id = id;
    this.name = name;
    this.timestamp = timestamp;
    this.stateful = stateful;
  }

  id;
  name;
  timestamp;
  stateful;
}
