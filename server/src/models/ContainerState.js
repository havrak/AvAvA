export default class ContainerState {
  constructor(id, state, stateHistory) {
    this.id;
    this.state = state;
    this.stateHistory = stateHistory;
  }
  id;
  currentState; // -> ResourceState.js
  stateHistory; // -> LightResourceState.js
}
