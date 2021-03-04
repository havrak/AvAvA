export default class ContainerState {
  constructor(id, maxResources, state) {
    this.id;
    this.maxResources = maxResources;
    this.state = state;
  }
  id;
  maxResources; // -> Limits.js
  state; // -> ResourceState.js
}
