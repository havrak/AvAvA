/**
 * information about history of multiple projects
 *
 */
export default class UserStateWithHistory {
  constructor(projectStatesHistory) {
    this.projectStatesHistory = projectStatesHistory;
  }
  projectStatesHistory; // -> ProjectStateWithHistory.js[]
}
