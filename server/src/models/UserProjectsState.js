export default class UserProjectState {
  constructor(maxResources, projectsState) {
    this.maxResources = maxResources;
    this.projectsState = projectsState;
  }
  maxResources; // -> Limits.js
  projectsState; // -> ProjectState.js[]
}
