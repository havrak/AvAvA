/**
 * generic with operation used across whole project.
 *
 */
export default class OperationState {
  // used as generec response to http requests
  constructor(status, statusCode) {
    this.status = status;
    this.statusCode = statusCode;
  }

  status;
  statusCode;
}
