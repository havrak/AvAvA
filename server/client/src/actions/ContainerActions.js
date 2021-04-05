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

export const containerPostFail = (project, container) => {
   return {
      type: "CONTAINER_POST_FAIL",
      payload: {
         project: project,
         container: container,
      },
   };
};

export const containerPostSuccess = (project, container) => {
   return {
      type: "CONTAINER_POST_SUCCESS",
      payload: {
         project: project,
         container: container,
      },
   };
};

export const containerPost = (body, notify) => {
   return (dispatch) => {
      const callback = function (error, data, response) {
         if (error) {
            console.error(error + "containerPostError");
            dispatch(containerPostFail(body.name));
            notify(`Error occured: ${error.ErrorResponse ? error.ErrorResponse : ""}`);
         } else {
            // data.name = "asdf";
            // data.id = "123"; //TESTING PURPOSES
            dispatch(containerPostSuccess(data));
         }
      };
      console.log(body);
      api.instancesPost(body, callback);
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

export const containerIdStart = (
   projectId,
   containerId,
   notify,
) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "starting"));
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

export const containerIdStop = (
   projectId,
   containerId,
   notify
) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "stopping"));
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

export const containerIdFreeze = (
   projectId,
   containerId,
   notify
) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "freezing"));
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

export const containerIdUnfreeze = (
   projectId,
   containerId,
   notify
) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "unfreezing"));
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

export const containerIdDelete = (
   projectId,
   containerId,
   notify
) => {
   return (dispatch) => {
      dispatch(startSpinnerContainer(projectId, containerId, "deleting"));
      const callback = function (error, data, response) {
         // console.log(response, 'container id delete');
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
