/**
 * information about history of container is project
 *
 */
export default class ProjectStateWithHistory {
  constructor(id, containerStateHistory) {
    this.id = id;
    this.containerStateHistory = containerStateHistory;
  }
  id;
  containerStateHistory; // -> ContainerStateWithHistory.js[]
}
