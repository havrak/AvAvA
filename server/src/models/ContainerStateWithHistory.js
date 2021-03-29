export default class ContainerStateWithHistory {
  constructor(id, stateHistory) {
    this.id = id;
    this.stateHistory = stateHistory;
  }

  id;
  stateHistory; // -> ContainerResourceState.js[]
}
