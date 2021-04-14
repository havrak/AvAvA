/**
 * inforamtion about snapshot
 *
 */
export default class Snapshot {
  constructor(name, createdOn, stateful, limits) {
    this.name = name;
    this.createdOn = createdOn;
    this.stateful = stateful;
    this.limits = limits;
  }

  name;
  createdOn;
  stateful;
  limits;
}
