export default class ProjectState {
  constructor(id, maxResources, containerState) {
    this.id = id;
    this.maxResources = maxResources;
    this.containerState = containerState;
  }
  id;
  maxResources; // -> Limits.js[]
  containerState; // -> ContainerState.js[]
}
