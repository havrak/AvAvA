import * as UserApi from "api/index";

const api = new UserApi.DefaultApi();

export const startSpinnerContainerPost = (projectId, container) => {
   return {
      type: "START_SPINNER_CONTAINER_POST",
      payload: {
         projectId: projectId,
         container: container,
      },
   };
};

export const containerIdGet = (projectId, containerId, notify) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
            notify(`Error occured: ${error}`);
         } else {
            dispatch(containerGetSuccess(projectId, data));
         }
      };
      api.instancesIdGet(containerId, callback);
   };
};

export const containerIdPatch = (projectId, containerPatched, notify) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         dispatch(startSpinnerContainerPatch(projectId, containerPatched.id));
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerPatched.id));
            notify(`Error occured: ${error}`);
         } else {
            console.log(data, "success");
            dispatch(containerGetSuccess(projectId, data));
         }
      };
      api.instancesIdPatch(containerPatched, containerPatched.id, callback);
   };
};

const startSpinnerContainerPatch = (projectId, containerId) => {
   return {
      type: "START_SPINNER_CONTAINER_PATCH",
      payload: {
         projectId: projectId,
         containerId: containerId,
      },
   };
};

const containerGetSuccess = (projectId, container) => {
   return {
      type: "CONTAINER_GET_SUCCESS",
      payload: {
         projectId: projectId,
         container: container,
      },
   };
};

export const containerPostFail = (projectId, containerName) => {
   return {
      type: "CONTAINER_POST_FAIL",
      payload: {
         project: projectId,
         container: containerName,
      },
   };
};

export const containerPostSuccess = (projectId, container) => {
   return {
      type: "CONTAINER_POST_SUCCESS",
      payload: {
         projectId: projectId,
         container: container,
      },
   };
};

export const containerPost = (container, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainerPost(container.projectId, container));
      const callback = function (error, data, response) {
         if (error) {
            console.error(error + "containerPostError");
            dispatch(containerPostFail(container.projectId, container.name));
            notify(`Error occured: ${error}`);
            console.log(error);
         } else {
            data.name = "asdf";
            data.id = "123"; //TESTING PURPOSES
            dispatch(containerPostSuccess(container.projectId, data));
         }
      };
      api.instancesPost(container, callback);
   };
};

export const startSpinnerContainer = (projectId, containerId, message) => {
   return {
      type: "START_SPINNER_CONTAINER",
      payload: {
         projectId: projectId,
         containerId: containerId,
         message: message,
      }, //MAYBE CHANGE
   };
};

export const containerDeleteSuccess = (projectId, containerId) => {
   return {
      type: "CONTAINER_DELETE_SUCCESS",
      payload: {
         projectId: projectId,
         containerId: containerId,
      },
   };
};

export const containerStateChangeFail = (projectId, containerId) => {
   return {
      type: "CONTAINER_STATE_CHANGE_FAIL",
      payload: {
         projectId: projectId,
         containerId: containerId,
      },
   };
};

export const containerStateChangeSuccess = (projectId, container) => {
   return {
      type: "CONTAINER_STATE_CHANGE_SUCCESS",
      payload: {
         projectId: projectId,
         container: container,
      },
   };
};

export const containerIdStart = (projectId, containerId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "Starting"));
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerId));
            notify(`Error occured: ${error ? error : ""}`);
         } else {
            dispatch(containerStateChangeSuccess(projectId, data));
         }
      };
      api.instancesIdStartPatch(containerId, callback);
   };
};

export const containerIdStop = (projectId, containerId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "Stopping"));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerId));
            notify(`Error occured: ${error ? error : ""}`);
         } else {
            dispatch(containerStateChangeSuccess(projectId, data));
         }
      };
      api.instancesIdStopPatch(containerId, callback);
   };
};

export const containerIdFreeze = (projectId, containerId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "Freezing"));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerId));
            notify(`Error occured: ${error ? error : ""}`);
         } else {
            dispatch(containerStateChangeSuccess(projectId, data));
         }
      };
      api.instancesIdFreezePatch(containerId, callback);
   };
};

export const containerIdUnfreeze = (projectId, containerId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "Unfreezing"));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerId));
            notify(`Error occured: ${error ? error : ""}`);
         } else {
            dispatch(containerStateChangeSuccess(projectId, data));
         }
      };
      api.instancesIdUnfreezePatch(containerId, callback);
   };
};

export const containerIdDelete = (projectId, containerId, notify) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "Deleting"));
      const callback = function (error, data, response) {
         if (error) {
            dispatch(containerStateChangeFail(projectId, containerId));
            notify(`Error occured: ${error ? error : ""}`);
         } else {
            dispatch(containerDeleteSuccess(projectId, containerId));
         }
      };
      api.instancesIdDelete(containerId, callback);
   };
};

export const instancesCreateInstanceConfigDataGet = () => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
         if (!error) {
            dispatch(instancesCreateInstanceConfigDataGetSuccess(data));
         }
      };
      api.instancesCreateInstanceConfigDataGet(callback);
   };
};

function instancesCreateInstanceConfigDataGetSuccess(createinstanceConfigData) {
   return {
      type: "CREATE_INSTANCE_CONFIG_DATA_GET",
      payload: createinstanceConfigData,
   };
}
