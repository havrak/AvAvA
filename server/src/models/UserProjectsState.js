export default class UserProjectState {
  constructor(projectsState, userState, stateHistory) {
    this.projectsState = projectsState;
    this.userState = userState;
    this.stateHistory = stateHistory;
  }
  projectsState; // -> projectState.js
  userState; // -> lightResourceState.js
  stateHistory; // -> lightResourceState.js[]
}
