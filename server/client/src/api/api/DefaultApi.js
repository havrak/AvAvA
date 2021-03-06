/**
 * User API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

import ApiClient from "../ApiClient";
import Body from '../model/Body';
import Body1 from '../model/Body1';
import Container from '../model/Container';
import ContainerState from '../model/ContainerState';
import CreateContainerData from '../model/CreateContainerData';
import InlineResponse200 from '../model/InlineResponse200';
import OperationState from '../model/OperationState';
import Project from '../model/Project';
import ProjectState from '../model/ProjectState';
import Snapshot from '../model/Snapshot';
import User from '../model/User';
import UserData from '../model/UserData';
import UserProjects from '../model/UserProjects';
import UserProjectsState from '../model/UserProjectsState';

/**
* Default service.
* @module api/DefaultApi
* @version 1.0
*/
export default class DefaultApi {

    /**
    * Constructs a new DefaultApi. 
    * @alias module:api/DefaultApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }

    /**
     * Callback function to receive the result of the combinedDataGet operation.
     * @callback module:api/DefaultApi~combinedDataGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserData} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * This request will be fired after authentication in order to get all the data needed in the frontend
     * @param {module:api/DefaultApi~combinedDataGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserData}
     */
    combinedDataGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = UserData;

      return this.apiClient.callApi(
        '/combinedData', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesContainerIdSnapshotsSnapshotIdDelete operation.
     * @callback module:api/DefaultApi~instancesContainerIdSnapshotsSnapshotIdDeleteCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesContainerIdSnapshotsSnapshotIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     */
    instancesContainerIdSnapshotsSnapshotIdDelete(containerId, snapshotId, callback) {
      let postBody = null;

      let pathParams = {
        'containerId': containerId,
        'snapshotId': snapshotId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;

      return this.apiClient.callApi(
        '/instances/{containerId}/snapshots/{snapshotId}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesCreateConfigDataGet operation.
     * @callback module:api/DefaultApi~instancesCreateConfigDataGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CreateContainerData} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesCreateConfigDataGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CreateContainerData}
     */
    instancesCreateConfigDataGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = CreateContainerData;

      return this.apiClient.callApi(
        '/instances/createConfigData', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdConsoleGet operation.
     * @callback module:api/DefaultApi~instancesIdConsoleGetCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdConsoleGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    instancesIdConsoleGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = 'Number';

      return this.apiClient.callApi(
        '/instances/{id}/console', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdDelete operation.
     * @callback module:api/DefaultApi~instancesIdDeleteCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     */
    instancesIdDelete(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;

      return this.apiClient.callApi(
        '/instances/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdExportGet operation.
     * @callback module:api/DefaultApi~instancesIdExportGetCallback
     * @param {String} error Error message, if any.
     * @param {'String'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdExportGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'String'}
     */
    instancesIdExportGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = 'String';

      return this.apiClient.callApi(
        '/instances/{id}/export', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdFreezePatch operation.
     * @callback module:api/DefaultApi~instancesIdFreezePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OperationState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdFreezePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/OperationState}
     */
    instancesIdFreezePatch(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = OperationState;

      return this.apiClient.callApi(
        '/instances/{id}/freeze', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdGet operation.
     * @callback module:api/DefaultApi~instancesIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Container} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Container}
     */
    instancesIdGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Container;

      return this.apiClient.callApi(
        '/instances/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdRestoreSnapshotIdPatch operation.
     * @callback module:api/DefaultApi~instancesIdRestoreSnapshotIdPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OperationState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdRestoreSnapshotIdPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/OperationState}
     */
    instancesIdRestoreSnapshotIdPatch(id, snapshotId, callback) {
      let postBody = null;

      let pathParams = {
        'id': id,
        'snapshotId': snapshotId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = OperationState;

      return this.apiClient.callApi(
        '/instances/{id}/restore/{snapshotId}', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdSnapshotsGet operation.
     * @callback module:api/DefaultApi~instancesIdSnapshotsGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Snapshot>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Retreives the list of all snapshots for given container
     * @param {module:api/DefaultApi~instancesIdSnapshotsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Snapshot>}
     */
    instancesIdSnapshotsGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Snapshot];

      return this.apiClient.callApi(
        '/instances/{id}/snapshots', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdSnapshotsPost operation.
     * @callback module:api/DefaultApi~instancesIdSnapshotsPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Snapshot} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {module:api/DefaultApi~instancesIdSnapshotsPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Snapshot}
     */
    instancesIdSnapshotsPost(id, stateful, opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
        'snapshotName': opts['snapshotName'],
        'stateful': stateful
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Snapshot;

      return this.apiClient.callApi(
        '/instances/{id}/snapshots', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdStartPatch operation.
     * @callback module:api/DefaultApi~instancesIdStartPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OperationState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdStartPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/OperationState}
     */
    instancesIdStartPatch(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = OperationState;

      return this.apiClient.callApi(
        '/instances/{id}/start', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdStateWithHistoryGet operation.
     * @callback module:api/DefaultApi~instancesIdStateWithHistoryGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ContainerState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdStateWithHistoryGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ContainerState}
     */
    instancesIdStateWithHistoryGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ContainerState;

      return this.apiClient.callApi(
        '/instances/{id}/stateWithHistory', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdStopPatch operation.
     * @callback module:api/DefaultApi~instancesIdStopPatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OperationState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdStopPatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/OperationState}
     */
    instancesIdStopPatch(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = OperationState;

      return this.apiClient.callApi(
        '/instances/{id}/stop', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesIdUnfreezePatch operation.
     * @callback module:api/DefaultApi~instancesIdUnfreezePatchCallback
     * @param {String} error Error message, if any.
     * @param {module:model/OperationState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesIdUnfreezePatchCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/OperationState}
     */
    instancesIdUnfreezePatch(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = OperationState;

      return this.apiClient.callApi(
        '/instances/{id}/unfreeze', 'PATCH',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesImportPut operation.
     * @callback module:api/DefaultApi~instancesImportPutCallback
     * @param {String} error Error message, if any.
     * @param {'Number'} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~instancesImportPutCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link 'Number'}
     */
    instancesImportPut(containerFile, callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = 'Number';

      return this.apiClient.callApi(
        '/instances/import', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the instancesPost operation.
     * @callback module:api/DefaultApi~instancesPostCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Container} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new instance
     * @param {module:api/DefaultApi~instancesPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Container}
     */
    instancesPost(body, callback) {
      let postBody = body;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = Container;

      return this.apiClient.callApi(
        '/instances', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the projectCreateConfigDataGet operation.
     * @callback module:api/DefaultApi~projectCreateConfigDataGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/InlineResponse200} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~projectCreateConfigDataGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/InlineResponse200}
     */
    projectCreateConfigDataGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = InlineResponse200;

      return this.apiClient.callApi(
        '/project/createConfigData', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the projectIdDelete operation.
     * @callback module:api/DefaultApi~projectIdDeleteCallback
     * @param {String} error Error message, if any.
     * @param data This operation does not return a value.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~projectIdDeleteCallback} callback The callback function, accepting three arguments: error, data, response
     */
    projectIdDelete(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = [];
      let returnType = null;

      return this.apiClient.callApi(
        '/project/{id}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the projectIdGet operation.
     * @callback module:api/DefaultApi~projectIdGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/Project} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~projectIdGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/Project}
     */
    projectIdGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = Project;

      return this.apiClient.callApi(
        '/project/{id}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the projectIdStateWithHistoryGet operation.
     * @callback module:api/DefaultApi~projectIdStateWithHistoryGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProjectState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~projectIdStateWithHistoryGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ProjectState}
     */
    projectIdStateWithHistoryGet(id, callback) {
      let postBody = null;

      let pathParams = {
        'id': id
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = ProjectState;

      return this.apiClient.callApi(
        '/project/{id}/stateWithHistory', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the projectPost operation.
     * @callback module:api/DefaultApi~projectPostCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/Project>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Create a new project
     * @param {module:api/DefaultApi~projectPostCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/Project>}
     */
    projectPost(body, callback) {
      let postBody = body;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = [Project];

      return this.apiClient.callApi(
        '/project', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the userGet operation.
     * @callback module:api/DefaultApi~userGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/User} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~userGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/User}
     */
    userGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = User;

      return this.apiClient.callApi(
        '/user', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the userProjectsGet operation.
     * @callback module:api/DefaultApi~userProjectsGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserProjects} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~userProjectsGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserProjects}
     */
    userProjectsGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = UserProjects;

      return this.apiClient.callApi(
        '/user/projects', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
    /**
     * Callback function to receive the result of the userProjectsStateWithHistoryGet operation.
     * @callback module:api/DefaultApi~userProjectsStateWithHistoryGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/UserProjectsState} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/DefaultApi~userProjectsStateWithHistoryGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/UserProjectsState}
     */
    userProjectsStateWithHistoryGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = UserProjectsState;

      return this.apiClient.callApi(
        '/user/projects/stateWithHistory', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

}
