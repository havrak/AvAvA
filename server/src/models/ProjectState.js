export default class ProjectState {
  constructor(id, maxResources, containerState) {
    this.id = id;
    this.maxResources = maxResources;
    this.containerState = containerState;
  }
  id;
  containerState; // -> ContainerState.js[]
  projectState; // -> LightResourceState.js
  stateHistory; // -> LightResourceState.js[]
}
